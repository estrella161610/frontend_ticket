import { GoAlertFill } from "react-icons/go";

const ModalEliminar = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      {/* Contenido del modal */}
      <div className="relative bg-white p-8 rounded-lg shadow-lg z-10 w-full max-w-xl">
        <button
          className="absolute top-6 right-8 text-gray-300 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="mb-6">
          <h2 className="text-lg font-bold">¡Advertencia!</h2>
          <hr className="my-4" />
        </div>
        <div className="text-center">
          <GoAlertFill size={60} color="#F0B23F" className="mx-auto" />
          <p className="font-bold text-lg mt-4">{message}</p>
          <p className="text-gray-600">Esta acción no se puede deshacer</p>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <button
            className="bg-rojoCoral text-white px-6 py-2 rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Eliminar
          </button>
          <button
            className="bg-transparent text-azul border-2 border-azul px-6 py-2 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminar;