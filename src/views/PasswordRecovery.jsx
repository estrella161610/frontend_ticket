import React, { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { HiOutlineMail } from 'react-icons/hi'; 
import { FaArrowLeft, FaQuestionCircle } from 'react-icons/fa'; 
import LogoEpicore from '../assets/img/logo_epicore.png'; 
import { useAuthStore } from '../hooks/useAuthStore'; 
import Alerts from '../components/Alerts'; 
 
export const PasswordRecovery = () => { 
  const [email, setEmail] = useState(''); 
  const { startPasswordRecovery, successMessage, errorMessage } = useAuthStore(); 
 
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    startPasswordRecovery(email); 
  }; 
 
  return ( 
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2"> 
      <img src={LogoEpicore} alt="Logo Epicore" className="w-32 sm:w-40 mb-4 sm:mb-0" /> 
      <div className="w-full max-w-md sm:max-w-xl bg-bgGray p-6 sm:p-8 rounded-lg shadow-lg relative"> 
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-8 border-azul mb-6"> 
          <div className="flex items-start"> 
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-azul text-white mr-4"> 
              <FaQuestionCircle className="text-5xl" /> 
            </div> 
            <div> 
              <p className="font-bold mb-2 text-azul text-sm sm:text-base">¿Has olvidado tu contraseña?</p> 
              <p className="text-sm sm:text-base"> 
                Para recibir tu código de acceso por correo electrónico, introduce la dirección de correo electrónico que proporcionaste durante el proceso de registro. 
              </p> 
            </div> 
          </div> 
        </div> 
 
        <form onSubmit={handleSubmit} className="mb-4"> 
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2"> 
            Dirección de correo electrónico: 
          </label> 
          <div className="relative"> 
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="test@example.com" 
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul focus:border-azul sm:text-sm" 
              required 
            /> 
            <div className="absolute inset-y-0 left-0 flex items-center pl-3"> 
              <HiOutlineMail className="h-5 w-5 text-gray-400" /> 
            </div> 
          </div> 
 
          {/* Mostrar mensajes usando el componente Alerts */} 
          <div className="mt-2 mb-4"> 
            {successMessage && <Alerts type="success" message={successMessage} />} 
            {errorMessage && <Alerts type="error" message={errorMessage} />} 
          </div> 
 
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4"> 
            <Link 
              to="/" 
              className="bg-white border border-azul text-azul flex items-center justify-center py-2 px-4 rounded-md hover:bg-bgYankBlue hover:text-white hover:border-transparent" 
            > 
              <FaArrowLeft className="mr-2" /> Volver al inicio de sesión 
            </Link> 
            <button 
              type="submit" 
              className="bg-azul text-white flex items-center justify-center py-2 px-4 rounded-md hover:bg-bgYankBlue" 
              aria-label="Enviar correo para recuperación de contraseña" 
            > 
              Enviar 
            </button> 
          </div> 
        </form> 
      </div> 
    </div> 
  ); 
};