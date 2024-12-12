import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../api/Axios";
import {
  clearErrorMessage,
  onChecking,
  onErrorMessageAuth,
  onLogin,
  onLogout,
  onRegister,
  onSuccessMessageAuth,
} from "../store";
import { useNavigate } from "react-router-dom";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const useAuthStore = () => {
  const navigate = useNavigate();
  const { status, user, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  // Método para iniciar sesión en administrador
  const startAdminLogin = async ({ email, password }) => {
    dispatch(onChecking());

    try {
      const { data } = await axiosClient.post("/admin/login", {
        email,
        password,
      });

      // Lógica de autenticación específica para administradores
      const { admin, token, message } = data;

      localStorage.setItem("ACCESS_TOKEN", token);
      localStorage.setItem("USER_ROLE", "admin");
      // console.log('Datos recibidos:', data);

      // Crear un nuevo objeto con la información del usuario
      const userData = {
        id: admin.id,
        nombre: admin.nombre,
        telefono: admin.telefono,
        email: admin.email,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
      };

      // Guardar el usuario en el store
      dispatch(onLogin(userData));

      // Si se desea mostrar un mensaje de éxito al iniciar sesión
      dispatch(onSuccessMessageAuth(message));
    } catch (error) {
      // Manejo de errores específico para administradores
      const data = error.response?.data || "Error al iniciar sesión";
      console.log("Error: ", data);
      dispatch(onErrorMessageAuth(data));
    }
  };

  // Método para iniciar sesión en agente
  const startAgenteLogin = async ({ email, password }) => {
    dispatch(onChecking());

    try {
      const { data } = await axiosClient.post("/agente/login", {
        email,
        password,
      });

      // Lógica de autenticación específica para agentes
      const { admin, token, message } = data;
  
      localStorage.setItem("ACCESS_TOKEN", token);
      localStorage.setItem("USER_ROLE", "agente");
      // console.log('Datos recibidos de agente:', data);
      // Crear un nuevo objeto con la información del usuario
      const userData = {
        id: admin.id,
        nombre: admin.nombre,
        email: admin.email,
        telefono: admin.telefono,
        icono: admin.icono,
        id_grupo: admin.id_grupo,
        id_departamento: admin.id_departamento,
        id_sede: admin.id_sede,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
      };
      // Guardar el usuario en el store
      dispatch(onLogin(userData));

      // Si se desea mostrar un mensaje de éxito al iniciar sesión
      dispatch(onSuccessMessageAuth(message));
    } catch (error) {
      // Manejo de errores específico para agentes
      const data = error.response?.data || "Error al iniciar sesión";
      dispatch(onErrorMessageAuth(data));
    }
  };

  // Método para iniciar sesión en cliente
  const startClienteLogin = async ({ email, password }) => {
    dispatch(onChecking());

    try {
      const { data } = await axiosClient.post("/cliente/login", {
        email,
        password,
      });

      // Lógica de autenticación específica para clientes
      const { cliente, token, message } = data;

      localStorage.setItem("ACCESS_TOKEN", token);
      localStorage.setItem("USER_ROLE", "cliente");
      // console.log("ACCESS_TOKEN clientes", token);
      // console.log('Datos recibidos de cliente:', data);

      // Crear un nuevo objeto con la información del usuario
      const userData = {
        id: cliente.id,
        id_usuario: cliente.id_usuario,
        nombre_completo: cliente.nombre_completo,
        nombre_corto: cliente.nombre_corto,
        email: cliente.email,
        telefono: cliente.telefono,
        id_sede: cliente.id_sede,
        observaciones: cliente.observaciones,
        created_at: cliente.created_at,
        updated_at: cliente.updated_at,
      };

      // Guardar el usuario en el store
      dispatch(onLogin(userData));

      // Si se desea mostrar un mensaje de éxito al iniciar sesión
      dispatch(onSuccessMessageAuth(message));
    } catch (error) {
      // Manejo de errores específico para clientes
      const data = error.response?.data || "Error al iniciar sesión";
      dispatch(onErrorMessageAuth(data));
    }
  };

  // Método para registrar un nuevo usuario
  const startRegister = async ({ name, lastname, email, phone, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await axiosClient.post("/register", {
        name,
        lastname,
        email,
        phone,
        password,
      });
      const { user } = data;

      dispatch(onRegister({ user }));

      dispatch(onSuccessMessageAuth("Usuario registrado exitosamente"));
    } catch (error) {
      const data = error.response?.data || "Error al registrar usuario";

      dispatch(onLogout(data));

      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 2000);
    }
  };

  // Método para recuperar la contraseña
  const startPasswordRecovery = async (email) => {
    dispatch(onChecking());
  
    try {
      // Haciendo la solicitud POST a la API del backend de Laravel
      const { data } = await axiosClient.post("https://api.tickets.epicore.com.mx/api/recuperar", { email });
      //
  
      // Maneja el éxito de la recuperación de contraseña
      dispatch(onSuccessMessageAuth(data.message || "Correo enviado con éxito"));
    } catch (error) {
      const data = error.response?.data || "Error al enviar el correo";
  
      // Maneja el error en la recuperación de contraseña
      dispatch(onErrorMessageAuth(data.message || "Error al enviar el correo"));
  
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 2000);
    }
  };

  //Restablecer contrseña
  // Definir la acción asíncrona para cambiar la contraseña
  const changePassword = createAsyncThunk(
    'password/changePassword',
    async ({ email, password, password_confirmation, token }, { rejectWithValue }) => {
      try {
        // Realiza la petición a la API con los datos necesarios
        const response = await axiosClient.put(
          'https://api.tickets.epicore.com.mx/api/restablecer',
          {
            email,
            password,
            password_confirmation,
            token
          }
        );
        return response.data; // Retorna la respuesta de la API
      } catch (error) {
        console.error('Error Response:', error.response);
        console.error('Error Message:', error.message);
        return rejectWithValue(error.response?.data || 'Error al cambiar la contraseña');
      }
    }
  );

  // Método para verificar el token de autenticación de administrador
  const checkAuthToken = async () => {
    dispatch(onChecking());
    const token = localStorage.getItem("ACCESS_TOKEN");
    const role = localStorage.getItem("USER_ROLE");
  
    if (!token || !role) {
      return dispatch(onLogout());
    }
  
    try {
      let endpoint = "";
  
      if (role === "admin") {
        endpoint = "/admin/session";
        navigate("/admin");
      } else if (role === "agente") {
        endpoint = "/agente/session";
        navigate("/agente");
      } else if (role === "cliente") {
        endpoint = "/cliente/session";
        navigate("/cliente");
      }
  
      const { data } = await axiosClient.get(endpoint);
  
      // Mapea los datos de acuerdo al rol
      const userData = {
        id: data.id,
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        rol_id: data.rol_id,
      };
  
      dispatch(onLogin(userData));
    } catch (error) {
      console.error("Error al verificar el token", error);
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  // Método para cerrar sesión
  const startLogout = (message = "") => {
    localStorage.clear();
    dispatch(onLogout(message));
  };

  return {
    // Propiedades
    status,
    user,
    errorMessage,
    successMessage,
    // Métodos
    checkAuthToken,
    startAdminLogin,
    startAgenteLogin,
    startClienteLogin,
    startRegister,
    startLogout,
    startPasswordRecovery,
    changePassword,
  };
};
