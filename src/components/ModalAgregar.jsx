import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '../store/features/modalAlertaSlice';

const ModalAgregar = ({ isOpen, onClose, title, children, usuario, onSubmit }) => {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleCancel = () => {
    // Abre el modal de alerta en lugar de cerrar directamente 
    dispatch(openModal());
  };

  const handleAddOrEdit = () => {
    if (onSubmit) {
      onSubmit(); // Esto debe llamar a la función que maneja la adición del departamento
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>

      {/* Contenido del modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-lg">
        <button
          className="absolute top-4 right-8 text-gray-300"
          style={{ fontSize: '35px' }}
          onClick={handleCancel}  // Llama a handleCancel en lugar de onClose 
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <hr />
        <div className="mt-8">{children}</div>
        <div className="flex justify-end space-x-2 mt-12">
          <button
            className="px-3 py-1 text-blue-800 rounded-md text-sm"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            className={`px-3 py-1 text-white rounded-md text-sm ${usuario ? "bg-yellow-500" : "bg-blue-800"}`}
            onClick={handleAddOrEdit}  // Cambia aquí
          >
            {usuario ? "Editar" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregar;