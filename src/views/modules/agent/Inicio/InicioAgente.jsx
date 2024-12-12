import { useState } from 'react';
import TableInicio from './../../../../components/TableInicioAgente';
import MensajeTable from './components/MensajeTable';
import BotonesInicio from './components/BotonesInicio';
import useFetchTickets from './../../../../hooks/useFetchTickets';
import useFetchSedes from './../../../../hooks/useFetchSedes';
import useFetchAgentes from './../../../../hooks/useFetchAgentes';
import useFetchClientes from './../../../../hooks/useFetchClientes';
import useFetchPerfilAgente from "./../../../../hooks/useFetchPerfilAgente";

const Inicio = () => {
  const { ticket, setTicket, isLoading: isLoadingTickets, error: errorTickets } = useFetchTickets();
  const { sedes, isLoading: isLoadingSedes, error: errorSedes } = useFetchSedes();
  const { agentes, isLoading: isLoadingAgentes, error: errorAgentes } = useFetchAgentes();
  const { clientes, isLoading: isLoadingClientes, error: errorClientes } = useFetchClientes();
  const { perfil, isLoading: isLoadingPerfil, error: errorPerfil } = useFetchPerfilAgente();

  // Estado para el tipo de tickets
  const [tipoTicket, setTipoTicket] = useState('asignados'); // 'asignados' por defecto

  // Filtra los tickets según el tipo seleccionado
  const filteredTickets = ticket.filter(t => {
    if (tipoTicket === 'asignados') {
      return t.estado_ticket === 'abierto';
    } else if (tipoTicket === 'resueltos') {
      return t.estado_ticket === 'resuelto';
    }
    return false;
  });

  // Mapear agentes para obtener nombres completos
  const agenteMap = agentes ? Object.fromEntries(agentes.map((agente) => [agente.id, agente.nombre])) : {};

  const perfilAgenteTickets = ticket.filter(t => 
    perfil && perfil.nombre && agenteMap[t.id_agente] && agenteMap[t.id_agente] === perfil.nombre
  );
  
  const openTicketsCount = perfilAgenteTickets.filter(t => t.estado_ticket === 'abierto').length;
  const resolvedTicketsCount = perfilAgenteTickets.filter(t => t.estado_ticket === 'resuelto').length;
  
  

  const isLoading = isLoadingTickets || isLoadingSedes || isLoadingAgentes || isLoadingClientes;
  const error = errorTickets || errorSedes || errorAgentes || errorClientes;

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 h-[82vh]">
      <div className="w-full md:w-1/5 p-2 overflow-y-auto border-b-2 md:border-b-0 md:border-r-2 border-gray-200 max-h-full">
        <h2 className="font-bold text-left mb-2 pl-2 mt-2 mr-2">Actualización de sus tickets</h2>
        <div className="overflow-y-auto max-h-[69vh] pl-2 mt-2">
          {isLoadingTickets ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg text-azul"></span>
            </div>
          ) : error ? (
            <p>Error al cargar tickets: {error.message || "Ocurrió un error desconocido, recargue la página"}</p>
          ) : (
            <MensajeTable tickets={filteredTickets} clientes={clientes} agentes={agentes} />
          )}
        </div>
      </div>
      <div className="w-full md:w-4/5 p-6">
        <BotonesInicio
          setTipoTicket={setTipoTicket}
          openTicketsCount={openTicketsCount}
          resolvedTicketsCount={resolvedTicketsCount}
        />
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-68">
              <span className="loading loading-spinner loading-lg text-azul"></span>
            </div>
          ) : error ? (
            <p>Error al cargar tickets: {error.message || "Ocurrió un error desconocido, recargue la página"}</p>
          ) : (
            <TableInicio tickets={filteredTickets} sedes={sedes} agentes={agentes} clientes={clientes} setTickets={setTicket} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Inicio;
