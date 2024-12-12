import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVisibleView } from "../../../../store/features/viewSlice";
import TableTickets from "./components/TableTicketsCliente";
import useFetchBandeja from "../../../../hooks/useFetchBandeja";
import useFetchSedes from "../../../../hooks/useFetchSedes";
import useFetchAgentes from "../../../../hooks/useFetchAgentes";
import useFetchClientes from "../../../../hooks/useFetchClientes";
import useFetchTickets from '../../../../hooks/useFetchTickets';

const BandejaDeEntrada = () => {
  const dispatch = useDispatch();
  const { visibleView, activeBtn } = useSelector((state) => state.view);
  const { bandeja, loading, error, counts } = useSelector((state) => state.bandeja); // Acceder a los contadores
  const { sedes } = useSelector((state) => state.sedes); // Acceder a los contadores
  const { agentes } = useSelector((state) => state.agentes); // Acceder a los contadores  
  const { clientes } = useSelector((state) => state.clientes); // Acceder a los contadores
  const { ticket, isLoading: isLoadingTickets, error: errorTickets } = useFetchTickets();

  const getViewEndpoint = (index) => {
    const views = [
      "sinResolver",
      "sinAsignar",
      "todosSinResolver",
      "actualizados",
      "pendientes",
      // "resueltos",
      // "borrados",
    ];
    return views[index];
  };

  const currentView = getViewEndpoint(visibleView);
  const { bandeja: currentBandeja, loading: currentLoading, error: currentError } = useFetchBandeja(currentView);

  const btns = [
    "Sus tickets sin resolver",
    "Tickets sin asignar",
    "Todos los tickets sin resolver",
    "Tickets recién actualizados",
    "Tickets pendientes",
    // "Tickets resueltos",
    // "Tickets borrados",
  ];
  
  return (
    <div className="flex h-[75vh]">
      <div className="flex flex-col w-1/4 border-r-2 border-gray-200 h-full">
        <div className="border-b-2 border-gray-200">
          <h1 className="text-xl font-bold p-3">Vistas</h1>
        </div>

        {/* Barra lateral de botones */}
        <div className="flex flex-col items-center p-3">
          {btns.map((view , index) => (
            <React.Fragment key={index}>
              <button
                className={`flex justify-between items-center text-sm text-left h-auto w-full py-2 px-2 mb-1 
                ${
                  activeBtn === index
                    ? "bg-blue-200 text-black font-bold rounded-md"
                    : "bg-transparent"
                }`}
                onClick={() => dispatch(setVisibleView({ index }))}
              >
                <span>{view}</span>
                {/* Contador de cuantos tickets hay */}
                <span className="ml-auto">
                  {loading ? "..." : counts[getViewEndpoint(index)] || 0}
                </span>
              </button>

              {index === 5 && (
                <div className="border-b-2 border-gray-200 w-full my-2"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 p-2 overflow-auto h-full">
        {/* Título dinámico y contenido de la tabla */}
        <TableTickets 
          title={getTitleForView(visibleView)} 
          bandeja={currentBandeja} 
          loading={currentLoading} 
          error={currentError} 
          sedes={sedes} 
          agentes={agentes} 
          clientes={clientes}
          tickets={ticket}
        />
      </div>
    </div>
  );
};

const getTitleForView = (index) => {
  switch (index) {
    case 0:
      return "Sus tickets sin resolver";
    case 1:
      return "Tickets sin asignar";
    case 2:
      return "Todos los tickets sin resolver";
    case 3:
      return "Tickets recién actualizados";
    case 4:
      return "Tickets pendientes";
    // case 5:
    //   return "Tickets resueltos";
    // case 6:
    //   return "Tickets borrados";
    default:
      return "Vistas";
  }
};

export default BandejaDeEntrada;