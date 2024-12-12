import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

const ModalEliminaTicket = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
        {/* Título y botón de cerrar */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Borrar ticket</h2>
          <button
            className="text-gray-500 hover:text-gray-300"
            onClick={onClose}
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Línea divisoria */}
        <hr className="mb-4" />

        {/* Texto del cuerpo */}
        <p className="text-sm text-gray-700 mb-2">
          Si elimina este ticket, <strong>no podrá restaurarlo.</strong>
        </p>
        <p className='text-sm text-gray-700 mt-0 mb-4'>
          ¿Está seguro de que desea eliminar este ticket?
        </p>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            className="px-3 py-1 text-blue-800 rounded-md text-sm "
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-800 text-white font-semibold px-3 py-2 rounded-md text-sm  hover:bg-blue-900"
            onClick={onDelete}
          >
            Borrar Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

ModalEliminaTicket.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Controla si el modal está abierto o no
  onClose: PropTypes.func.isRequired, // Función para cerrar el modal
  onDelete: PropTypes.func.isRequired, // Función para manejar el borrado del ticket
};

export default ModalEliminaTicket;
