import React from "react";
import useFetchBotonesInicio from "../../../hooks/useFetchBotonesInicio";

const BotonesInicio = ({ setTipoTicket }) => {
    const { assignedTickets, resolvedTickets, isLoading } = useFetchBotonesInicio();


    return (
        <div className="flex justify-between items-center mb-6 mt-8">
            <div className="flex flex-col">
                <h2 className="font-bold text-sm mb-1">
                    Tickets abiertos <span className="font-normal">(actuales)</span>
                </h2>
                <div className="flex space-x-0">
                    <button
                        className="border border-gray-400 bg-white text-black h-12 w-24 flex flex-col items-center rounded-sm hover:bg-gray-200 focus:bg-yellow-100 focus:outline-none"
                        onClick={() => setTipoTicket('asignados')} // Cambia a 'asignados'
                    >
                        <span className="font-bold">{isLoading ? "..." : assignedTickets || 0}</span>
                        <span className="text-sm">ABIERTOS</span>
                    </button>
                    <button
                        className="border border-gray-400 bg-white text-black h-12 w-24 flex flex-col items-center rounded-sm hover:bg-gray-200 focus:bg-yellow-100 focus:outline-none"
                        onClick={() => setTipoTicket('resueltos')} // Cambia a 'resueltos'
                    >
                        <span className="font-bold">{isLoading ? "..." : resolvedTickets || 0}</span>
                        <span className="text-sm">RESUELTOS</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BotonesInicio;
