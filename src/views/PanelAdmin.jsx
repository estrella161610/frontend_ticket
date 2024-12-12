import { useEffect, useState } from "react";
import { FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiSearch } from "react-icons/fi";
import { useDispatch } from 'react-redux';

import Tabla from "../components/Tabla";
import ModalAgregar from "../components/ModalAgregar";
import ModalAlerta from "../components/ModalAlerta";
import ModalError from "../components/ModalError";
import ModalExito from "../components/ModalExito";
import { openModal } from "../store/features/modalAlertaSlice";
import useFetchAdmin from "../hooks/useFetchAdmin";
import Alerts from '../components/Alerts';

const PanelAdmin = () => {
  const columnas = ["ID", "Nombre", "Estatus", "Email", "Telefono", "Acciones"];
  const { admin, isLoading, error, handleAddAdmin, handleUpdateAdmin, handleDeleteAdmin } = useFetchAdmin();

  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  //--------------------------MODALES--------------------------
  const [isModalAgregarOpen, setIsModalAgregarOpen] = useState(false);
  const [isModalEditOpen, setModalEditOpen] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const [isModalExitoOpen, setIsModalExitoOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Si hay un error, muestra el alert
    if (error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // 3000 ms = 3 segundos

      // Limpia el timeout si el componente se desmonta o si el error cambia
      return () => clearTimeout(timer);
    }
  }, [error]);

  const toggleModalAgregar = () => setIsModalAgregarOpen((prev) => !prev);
  const handleCloseModalAgregar = () => {
    dispatch(openModal());
  };


  const handleCloseModalEditar = () => {
    dispatch(openModal());
  };

  const handleConfirmCloseEditar = () => {
    setModalEditOpen(false);
    setUsuarioAEditar(null);
  };

  const handleEdit = (admin) => {
    setUsuarioAEditar(admin);
    setNuevoAdmin({
      nombre: admin.nombre,
      telefono: admin.telefono,
      email: admin.email,
      password: admin.password,
      estatus: admin.estatus === 1 ? "1" : "0",
    });
    setIsModalAgregarOpen(true);
  };

  const [nuevoAdmin, setNuevoAdmin] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: "",
    estatus: "",
  });

  const [validaciones, setValidaciones] = useState({
    nombre: false,
    email: false,
    telefono: false,
    password: false,
    estatus: false,
  });

  const [submitted, setSubmitted] = useState(false); // Indica si el formulario ha sido enviado
  const [showPassword, setShowPassword] = useState(false);

  const handleValidation = () => {
    // Expresión regular para validar 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const telefonoRegex = /^(?:\+52\s?)?(\(?\d{2}\)?\s?)?(\d{2})\s?(\d{4})\s?(\d{4})$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    const valid = {
      nombre: !!nuevoAdmin.nombre,
      email: emailRegex.test(nuevoAdmin.email), // Verifica si el correo tiene un formato válido
      telefono: telefonoRegex.test(nuevoAdmin.telefono),
      password: usuarioAEditar ? true : passwordRegex.test(nuevoAdmin.password), // Solo valida password si no es edición
      estatus: !!nuevoAdmin.estatus,
    };

    setValidaciones(valid);

    // Verifica si todos los campos son válidos
    return Object.values(valid).every((field) => field === true);
  };


  useEffect(() => {
    if (submitted) {
      handleValidation();
    }
  }, [nuevoAdmin]);

  const handleConfirmCloseAgregar = () => {
    setIsModalAgregarOpen(false);
    setNuevoAdmin({
      nombre: "",
      telefono: "",
      email: "",
      estatus: "",
      password: "", // Asegúrate de resetear todos los campos
    });
    setValidaciones({
      nombre: false,
      email: false,
      telefono: false,
      password: false,
      estatus: false,
    });
    setSubmitted(false); // Resetea el estado de enviado
    setUsuarioAEditar(null);
  };

  return (
    <div className="pt-4 px-8">
      <div className="flex justify-between items-center mx-5 mt-5">
        <h1 className="text-2xl font-bold">Panel Administrativo</h1>
        <div className="flex space-x-2">
          <button
            className="flex items-center bg-azul border rounded-md text-white text-sm font-semibold px-4 py-2 hover:bg-blue-900"
            onClick={toggleModalAgregar}
          >
            <FaPlus className="mr-2" />
            Agregar administradores
          </button>
        </div>
      </div>
      <span className="block mx-5 mt-2 text-sm">
        Configure y administre los recursos y permisos para una gestión eficiente de la plataforma
      </span>

      {/* Search */}
      <div className="flex mx-5 pt-12 pb-2 space-x-2 items-center">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="w-64"
            placeholder="Buscar administradores"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="text-gray-300 mr-2 text-sm" size={20} />
        </label>
      </div>

      {/* Contador de registros */}
      <div className="block mx-5 mb-8 text-sm text-gray-500">
        <span>Administradores:</span> {admin.length}
      </div>

      <div className="mx-5">
        {/* Muestra el estado de carga o error si es necesario */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-azul"></span>
          </div>
        ) : showAlert ? (
          <Alerts type="error" message={`Error: ${error}`} />
        ) : (
          <Tabla
            columnas={columnas}
            datos={admin}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDeleteAdmin}
          />
        )}
      </div>

      <ModalExito
        isOpen={isModalExitoOpen}
        onClose={() => setIsModalExitoOpen(false)}
        title="¡Operación Exitosa!"
        message={"El administrador se ha guardado correctamente"}
      />

      <ModalError
        isOpen={isModalErrorOpen}
        onClose={() => setIsModalErrorOpen(false)}
        title="Error"
        message="Error al agregar el administrador. Inténtalo de nuevo."
      />

      <ModalAgregar
        isOpen={isModalAgregarOpen || isModalEditOpen}
        onClose={handleCloseModalAgregar}
        onSubmit={async () => {
          setSubmitted(true);  // Marca que el formulario ha sido enviado
          if (!handleValidation()) {
            setErrorMessage("Todos los campos son obligatorios.");
            return; // Detiene el envío si falta algún campo
          }
          try {
            if (usuarioAEditar) {
              await handleUpdateAdmin({ id: usuarioAEditar.id, ...nuevoAdmin });
            } else {
              await handleAddAdmin(nuevoAdmin);
            }
            setIsModalExitoOpen(true); // Abre modal de éxito
            handleConfirmCloseAgregar(); // Cierra el modal de agregar/editar
          } catch (error) {
            setErrorMessage(error.message); // Manejo de error
            handleConfirmCloseAgregar(); // Cierra el modal de agregar/editar
            setIsModalErrorOpen(true); // Abre modal de error
          }
        }}
        usuario={usuarioAEditar}
        title={usuarioAEditar ? "Editar Administrador" : "Agregar Administrador"}
      >
        <div className="mt-6 text-sm mx-8">
          <label className="block mb-2 font-bold text-sm">Nombre</label>
          <input
            type="text"
            className={`w-full p-2 mb-3 border ${validaciones.nombre === false && submitted ? "border-red-500" : "border-blue-700"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
            placeholder="Ingrese el nombre de usuario"
            value={nuevoAdmin.nombre}
            onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, nombre: e.target.value })}
            required
          />

          <label className="block mb-2 font-bold text-sm">Correo electrónico</label>
          <input
            type="text"
            className={`w-full p-2 mb-3 border ${validaciones.email === false && submitted ? "border-red-500" : "border-blue-700"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
            placeholder="example@epicore.com.mx"
            value={nuevoAdmin.email}
            onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, email: e.target.value })}
            required
          />
          {validaciones.email === false && submitted && (
            <span className="text-red-500 text-xs mt-0">Por favor, ingrese un correo válido.</span>
          )}

          <label className="block mb-2 font-bold text-sm">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full p-2 mb-3 border ${validaciones.password === false && submitted ? 'border-red-500' : 'border-blue-700'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
              placeholder="Ingrese la contraseña"
              value={nuevoAdmin.password}
              onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-2 top-1/3 transform -translate-y-1/3 text-sm text-blue-700"
              onClick={() => setShowPassword(!showPassword)}  // Toggle showPassword state
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {validaciones.password === false && submitted && (
            <p className="text-red-500 text-xs mt-0">La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.</p>
          )}

          <label className="block mb-2 font-bold text-sm">Teléfono</label>
          <input
            type="text"
            className={`w-full p-2 mb-3 border ${validaciones.telefono === false && submitted ? "border-red-500" : "border-blue-700"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
            placeholder="Ingrese el número de celular"
            value={nuevoAdmin.telefono}
            onChange={(e) => setNuevoAdmin({ ...nuevoAdmin, telefono: e.target.value })}
            required
          />
          {validaciones.telefono === false && submitted && (
            <span className="text-red-500 text-xs mt-0 mb-2">Por favor, ingrese un número de teléfono válido.</span>
          )}

          <label className="block mb-2 font-bold text-sm">Estatus</label>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`w-full p-2 rounded-md font-bold focus:outline-none transition ${nuevoAdmin.estatus === "1" ? "bg-pendienteBdg text-white" : "bg-gray-300 text-gray-700"}`}
              onClick={() => setNuevoAdmin({ ...nuevoAdmin, estatus: "1" })}
            >
              Activo
            </button>
            <button
              type="button"
              className={`w-full p-2 rounded-md font-bold focus:outline-none transition ${nuevoAdmin.estatus === "0" ? "bg-abiertoBdg text-white" : "bg-gray-300 text-gray-700"}`}
              onClick={() => setNuevoAdmin({ ...nuevoAdmin, estatus: "0" })}
            >
              Inactivo
            </button>

          </div>
        </div>
      </ModalAgregar>

      <ModalAlerta
        message={
          isModalEditOpen
            ? "¿Desea cancelar y cerrar el modal de editar?"
            : "¿Desea cancelar y cerrar el modal de agregar?"
        }
        onConfirm={isModalEditOpen ? handleConfirmCloseEditar : handleConfirmCloseAgregar}
        onCancel={() => {
          dispatch(openModal());
        }}
      />
    </div>
  )
}

export default PanelAdmin
