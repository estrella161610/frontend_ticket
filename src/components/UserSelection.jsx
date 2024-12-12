import { Link } from "react-router-dom";
import { FaUserShield, FaUsers, FaUser } from "react-icons/fa";
import image_inicio from "../assets/img/image_inicio.jpg";
import LogoEpicore from "../assets/img/logo_epicore.png";

const UserSelection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-no-repeat bg-cover bg-center">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image_inicio})` }} />

      {/* Contenido principal */}
      <div className="relative bg-slate-50 rounded-lg shadow-xl p-8 max-w-md w-full z-10">
        <div className="flex items-center justify-center mb-2">
          <img src={LogoEpicore} alt="Logo Epicore" className="w-28" />
        </div>
        <h1 className="text-2xl font-bold text-center text-bgYankBlue mb-2">
          Sistema de Soporte a Clientes
        </h1>
        <p className="text-center text-bgLightBlue mb-6">
          Selecciona tu rol para comenzar
        </p>
        <div className="space-y-4">
          <Link to="login-admin" className="block">
            <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 border border-gray-400 rounded shadow flex items-center justify-center transition duration-300 ease-in-out transform hover:-translate-y-1">
              <FaUserShield className="mr-3 h-6 w-6" />
              Administrador
            </button>
          </Link>
          <Link to="login-agente" className="block">
            <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 border border-gray-400 rounded shadow flex items-center justify-center transition duration-300 ease-in-out transform hover:-translate-y-1">
              <FaUsers className="mr-3 h-6 w-6" />
              Agente
            </button>
          </Link>
          <Link to="login-cliente" className="block">
            <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 border border-gray-400 rounded shadow flex items-center justify-center transition duration-300 ease-in-out transform hover:-translate-y-1">
              <FaUser className="mr-3 h-6 w-6" />
              Cliente
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;