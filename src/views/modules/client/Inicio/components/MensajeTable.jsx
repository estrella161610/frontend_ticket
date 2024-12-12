import PropTypes from 'prop-types';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useFetchPerfilCliente from "../../../../../hooks/useFetchPerfilCliente";


const MensajeTable = ({ tickets, clientes }) => {
  const { perfil, isLoading, error, handleUpdatePerfil } = useFetchPerfilCliente();
  const navigate = useNavigate();

  // Crear mapeos de ID a nombre
  const clienteMap = Object.fromEntries(clientes.map(cliente => [cliente.id, cliente.nombre_completo]));

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

  const handleRowClick = (ticket) => { 
    navigate(`abrir-ticket/${ticket.id}`, { state: { ticket } });  
  };

  // Filtrar los tickets para que solo se muestren los que coincidan con perfil.nombre_completo
  const filteredTickets = tickets.filter(ticket => clienteMap[ticket.id_cliente] === perfil?.nombre_completo);

  return (   
    <div className="grid grid-cols-1 gap-2 mr-4 cursor-pointer">   
      {filteredTickets.length > 0 ? (   
        filteredTickets.map(ticket => (   
          <div  
            key={ticket.id}  
            className="flex items-start bg-white shadow-md p-4 rounded-lg" 
            onClick={() => handleRowClick(ticket)}  
          >   
            <div className="mr-3">   
              <FaUserCircle className="text-gray-400" size={40} />   
            </div>   
            <div>   
              <h3 className="font-bold text-m">{clienteMap[ticket.id_cliente]}</h3>   
              <p className="text-sm">{ticket.nombre_ticket}</p>   
              <p className="text-xs mt-2 text-gray-400">Hace {calculateTimeAgo(ticket.created_at)}</p> 
            </div>   
          </div>   
        ))   
      ) : (   
        <p className="text-gray-500">No hay tickets abiertos para mostrar.</p>   
      )}   
    </div>   
  );   
};

MensajeTable.propTypes = {   
  tickets: PropTypes.array.isRequired,
  clientes: PropTypes.array.isRequired,
};   

export default MensajeTable;
