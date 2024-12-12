import LogoEpicore from "../../../../assets/img/logo_epicore.png";
import LoginImg from "../../../../assets/img/login_clientes.jpg";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "../../../../hooks";
import { useAuthStore } from "../../../../hooks/useAuthStore";
import Alerts from "../../../../components/Alerts";
import { BiArrowBack } from "react-icons/bi";

const loginFormFields = {
  email: "",
  password: "",
};

const LoginClients = () => {
  const navigate = useNavigate();
  const { startClienteLogin } = useAuthStore();
  const { email, password, onInputChange } = useForm(loginFormFields);
  const [loading, setLoading] = useState(false);

  // Alerta y mensaje de error
  const [alertType, setAlertType] = useState("info");
  const [messageErrors, setMessageErrors] = useState("");

  // Mostrar u ocultar contraseña
  const [showPass, setShowPass] = useState(false);

  // Manejo de errores de auth
  const { status, errorMessage } = useSelector((state) => state.auth);
  useEffect(() => {
    if (errorMessage) {
      handleErrors(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    // Redirección si el usuario ya está autenticado
    // console.log("Status de clientes", status);
    if (status === "authenticated") {
      navigate("/cliente");
    }
  }, [status, navigate]);

  const handleErrors = (error) => {
    if (error.errors) {
      const errors = Object.values(error.errors).flat();
      setMessageErrors(errors.join(", "));
    } else if (error.message) {
      setMessageErrors(error.message);
    }
    setAlertType("error");

    // Limpia el mensaje después de 2 segundos
    const timer = setTimeout(() => {
      setMessageErrors("");
    }, 4000);

    return () => clearTimeout(timer); // Limpia el temporizador
  };

  // Submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await startClienteLogin({ email, password });
    } catch (error) {
      console.error("Error:", error);
      // Manejo de errores si la autenticación falla
      setMessageErrors("Hubo un error al intentar iniciar sesión, inténtelo de nuevo");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Link to="/" className="label-text-alt link underline text-gray-300 hover:text-azul  ml-3 mt-3 ">
        <BiArrowBack size={20} />
      </Link>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <img src={LogoEpicore} alt="Logo Epicore" className="w-40" />
        <p className="flex items-center font-bold text-center text-azul mb-6 text-xl">
          Login Clientes
        </p>

        <form onSubmit={onSubmit} className="w-full max-w-md">
          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text font-bold mb-1">
                Correo Electrónico
              </span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onInputChange}
              className="input input-bordered"
              required
            />
          </div>
          <div className="relative form-control w-full max-w-md my-2">
            <label className="label">
              <span className="label-text font-bold mb-1">Contraseña</span>
            </label>
            <input
              type={showPass ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={onInputChange}
              className="input input-bordered"
              required
            />
            <div
              className="absolute inset-y-1/2 right-0 transform -translate-y-1/2 flex items-center pr-3 text-azul cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </div>
            <label className="label justify-center mt-0">
              <Link
                to="/recuperar-contrasena"
                className="label-text-alt link underline text-blue-500 hover:text-blue-600"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </label>
          </div>
          <div className="form-control w-40 mx-auto mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn bg-azul text-white hover:bg-bgYankBlue"
            >
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </div>
        </form>
        <div className="w-full pt-4">
          {messageErrors && <Alerts type={alertType} message={messageErrors} />}
        </div>
      </div>
      <div className="hidden lg:block lg:w-4/5">
        <img
          src={LoginImg}
          alt="Login"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default LoginClients;
