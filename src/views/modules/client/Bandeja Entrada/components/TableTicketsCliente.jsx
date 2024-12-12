import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ModalEliminaTicket from '../../../../../components/ModalElimiraTicket';
import axiosClient from '../../../../../api/Axios';
import ModalExito from "../../../../../components/ModalExito";
import ModalError from "../../../../../components/ModalError";
import useFetchPerfilCliente from '../../../../../hooks/useFetchPerfilCliente';

const TableTickets = ({ title, bandeja, loading, error, sedes, agentes, clientes, tickets }) => {
   // Crear mapeos de ID a nombre
  const sedeMap = Object.fromEntries(sedes.map(sede => [sede.id, sede.nombre]));
  const agenteMap = Object.fromEntries(agentes.map(agente => [agente.id, agente.nombre]));
  const clienteMap = Object.fromEntries(clientes.map(cliente => [cliente.id, cliente.nombre_completo]));

  const [checkedTickets, setCheckedTickets] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [isModalExitoOpen, setIsModalExitoOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const { perfil, isLoading: isLoadingPerfil, error: errorPerfil } = useFetchPerfilCliente();

  const navigate = useNavigate();

   // Filtrar tickets por solicitante
   const filteredTickets = bandeja.filter((ticket) => {
    // Aseguramos que el nombre del solicitante coincida con el nombre completo del perfil
    const nombreSolicitante = clienteMap[ticket.id_cliente];
    return nombreSolicitante === perfil.nombre_completo;
  });
  
  // Manejo del checkbox principal para seleccionar todos
  const handleSelectAll = () => {
    const newCheckedTickets = {};
    if (!selectAll) {
      bandeja.forEach((ticket) => {
        newCheckedTickets[ticket.id] = true;
      });
    }
    setCheckedTickets(newCheckedTickets);
    setSelectAll(!selectAll);
  };

  // Manejo del checkbox individual
  const handleCheckbox = (ticketId) => {
    setCheckedTickets((prevState) => ({
      ...prevState,
      [ticketId]: !prevState[ticketId],
    }));
  };
  
  // Mapa de estilos para cada estado
  const statusStyles = {
    nuevo: 'bg-nuevoBdg',
    abierto: 'bg-abiertoBdg',
    en_curso: 'bg-cursoBdg',
    pendiente: 'bg-pendienteBdg',
    resuelto: 'bg-resueltoBdg',
  }; 

  const handleDeleteSelected = () => {
    setIsModalOpen(true); // Abre el modal
  };

  const handleCancelSelection = () => {
    setCheckedTickets({});
    setSelectAll(false);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false); // Cierra el modal
  };


  // Función para calcular el tiempo transcurrido dinámicamente
  const calculateTimeAgo = (dateString) => {
    const createdDate = new Date(dateString);
    const now = new Date();
    const timeDiff = now - createdDate;

    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (minutes < 60) {
      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `${hours} hora${hours !== 1 ? 's' : ''}`;
    } else if (days < 7) {
      return `${days} día${days !== 1 ? 's' : ''}`;
    } else {
      return `${weeks} semana${weeks !== 1 ? 's' : ''}`;
    }
  };


  const handleDeleteTickets = async (setTickets) => {
    const ticketsToDelete = bandeja.filter((ticket) => checkedTickets[ticket.id]);
    try {
      // Realiza la eliminación de los tickets
      const deletePromises = ticketsToDelete.map((ticket) =>
        axiosClient.delete(`/ticket/${ticket.id}`)
      );
      await Promise.all(deletePromises);
      console.log('Tickets eliminados:', ticketsToDelete);
      setIsModalExitoOpen(true);
      setIsModalOpen(false);

      setTimeout(() => {
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => !checkedTickets[ticket.id])
        );
      }, 1000);
    } catch (error) {
      console.error('Error al eliminar los tickets:', error);
      setIsModalErrorOpen(true);
    }
  };
// Contador de tickets seleccionados
const selectedCount = Object.keys(checkedTickets).filter((ticketId) => checkedTickets[ticketId]).length;

const handleRowClick = (ticket) => {
  navigate(`/cliente/abrir-ticket/${ticket.id}`, { state: { ticket } });
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-azul"></span>
      </div>
    );
  }
  if (error) {
    return <div>Error al cargar los datos.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mx-5 mt-7">
        {/* Título dinámico */}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      {/* Contador de tickets */}
      <span className="badge badge-sm ml-5">{bandeja.length} Ticket{bandeja.length > 1 ? 's' : ''}</span>
      <div className="overflow-x-auto">
        <table className="table mt-16">
          {/* head */}
          <thead>
            <tr className="text-black text-sm font-bold">
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox h-5 w-5"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </label>
              </th>
              <th>Estado del ticket</th>
              <th>ID</th>
              <th>Asunto</th>
              <th>Solicitante</th>
              <th>Solicitado</th>
              <th>Sede</th>
              <th>Agente asignado</th>
            </tr>
          </thead>
         
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => handleRowClick(ticket)}
                  className="cursor-pointer" >
                  <th>
                    <label>
                    
                    <input
                        type="checkbox"
                        className="checkbox h-5 w-5"
                        checked={checkedTickets[ticket.id] || false}
                        onChange={() => handleCheckbox(ticket.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className={`badge font-semibold text-xs text-white ${statusStyles[ticket.estado_ticket]}`}>
                          {ticket.estado_ticket}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{ticket.id}</td>
                  <td>{ticket.asunto}</td>
                  <td>{clienteMap[ticket.id_cliente]}</td>
                  <td>Hace {calculateTimeAgo(ticket.created_at)}</td>
                  <td>{sedeMap[ticket.id_sede]}</td>
                  <td>{agenteMap[ticket.id_agente]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">No hay tickets para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedCount > 0 && (
        <div className="mt-2 flex justify-between p-2 items-center">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold">{selectedCount} ticket{selectedCount > 1 && 's'}</span>
            <button
              onClick={handleDeleteSelected}
              className="text-red-500 flex items-center gap-2 text-sm cursor-pointer"
            >
              <FaTrash />
              <span>Eliminar</span>
            </button>
          </div>
          <button
            onClick={handleCancelSelection}
            className="text-blue-500 text-sm cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Modal para confirmar eliminación */}
      <ModalEliminaTicket
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteTickets}
      />

      <ModalExito
        isOpen={isModalExitoOpen}
        onClose={() => setIsModalExitoOpen(false)}
        title="¡Operación Exitosa!"
        message="Eliminado correctamente"
      />
      <ModalError
        isOpen={isModalErrorOpen}
        onClose={() => setIsModalErrorOpen(false)}
        title="Error"
        message="Error al eliminar ticket, Inténtalo de nuevo."
      />
    </div>
  );
};

TableTickets.propTypes = {
  title: PropTypes.string.isRequired,
  bandeja: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  sedes: PropTypes.array.isRequired,
  agentes: PropTypes.array.isRequired,
  clientes: PropTypes.array.isRequired,
};

export default TableTickets;