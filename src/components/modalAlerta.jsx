import React from 'react'; 
import { FaExclamationTriangle } from 'react-icons/fa'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { closeModal } from '../store/features/modalAlertaSlice'; 
 
const ModalAlerta = ({ message, onConfirm }) => { 
  const dispatch = useDispatch(); 
  const isOpen = useSelector((state) => state.modalAlerta.isOpen); 
 
  if (!isOpen) return null; 
 
  const handleCancel = () => { 
    // Solo cierra el modal de alerta sin cerrar el modal de agregar 
    dispatch(closeModal()); 
  }; 
 
  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"> 
      <div className="bg-white w-11/12 md:w-1/3 p-6 rounded-lg shadow-lg overflow-auto max-h-full"> 
        <div className="flex items-center justify-center"> 
          <FaExclamationTriangle className="text-yellow-500 text-5xl mb-4" /> 
        </div> 
        <h2 className="text-center text-xl text-red-600 font-bold mb-2">¡Alerta!</h2> 
        <p className="text-center text-gray-700 mb-4">{message}</p> 
           
        <div className="flex justify-end space-x-2 mt-8"> 
          <button 
            onClick={handleCancel}  // Llama a handleCancel para cerrar solo el modal de alerta 
            className="px-3 py-1 text-blue-800 rounded-md text-sm" 
          > 
            Cancelar 
          </button> 
          <button 
            onClick={() => { 
              onConfirm();  // Cierra el modal de agregar 
              dispatch(closeModal());  // Cierra el modal de alerta 
            }} 
            className="px-3 py-1 bg-blue-800 text-white rounded-md text-sm" 
          > 
            Confirmar 
          </button> 
        </div> 
      </div> 
    </div> 
  ); 
}; 
 
export default ModalAlerta;