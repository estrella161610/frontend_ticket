// src/components/ModalError.jsx 
import React from 'react'; 
import { FaTimesCircle } from 'react-icons/fa';
 
const ModalError = ({ isOpen, onClose, title, message }) => { 
  if (!isOpen) return null; 
 
  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center"> 
      <div className="fixed inset-0 bg-black bg-opacity-50"></div> 
      {/* Contenido del modal */} 
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-lg"> 
        <button 
          className="absolute top-4 right-8 text-gray-300" 
          style={{ fontSize: '35px' }} 
          onClick={onClose} 
        > 
          &times; 
        </button> 
        <h2 className="text-lg font-bold mb-4">{title}</h2> 
        <hr /> 
        <div className="mt-6 flex flex-col items-center"> 
          <FaTimesCircle className="text-red-600 text-6xl mb-2" />
          {/* Mostrar un mensaje de error personalizado */}
          <p className="text-black">{message}</p> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default ModalError;