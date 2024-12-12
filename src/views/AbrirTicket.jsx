import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FaChevronDown } from 'react-icons/fa';
import useFetchClientes from '../hooks/useFetchClientes';
import useFetchAgentes from '../hooks/useFetchAgentes';
import useFetchSedes from '../hooks/useFetchSedes';
import useFetchTickets from '../hooks/useFetchTickets';
import useFetchMensajes from '../hooks/useFetchMensajes';
import MensajeChat from '../components/MensajeChat';

const AbrirTicket = () => {
    const { state } = useLocation();
    const { ticket } = state;

    const [formData, setFormData] = useState({
        tipo: "",
        prioridad: ""
    });

    const [asunto, setAsunto] = useState(ticket.asunto);
    const [mensaje, setMensaje] = useState('');
    const [editorInstance, setEditorInstance] = useState(null);
    const { clientes } = useFetchClientes();
    const { agentes } = useFetchAgentes();
    const { sedes } = useFetchSedes();
    const { tickets, updateExistingTicket, assignTicketToAgent } = useFetchTickets();
    const { mensajes, isLoading, error, handleEnviarMensaje } = useFetchMensajes(ticket.id);

    
    const handleEditorReady = (editor) => {
        try {
            setEditorInstance(editor);
        } catch (error) {
            console.error("Error al inicializar CKEditor:", error);
        }
    };

    const handleUpdateTicket = async () => {
        const ticketData = {
            id_sede: ticket.id_sede,
            id_cliente: ticket.id_cliente,
            id_agente: formData.id_agente || ticket.id_agente,
            tipo_ticket: formData.tipo || ticket.tipo_ticket,
            prioridad_ticket: formData.prioridad || ticket.prioridad_ticket,
            asunto: asunto,
            nombre_ticket: asunto,
            estado_ticket: estadoSeleccionado,
        };
        console.log("Datos del ticket a actualizar:", ticketData);

        // Verificar si el ticket ya tiene agente asignado
        if (!ticket.id_agente && formData.id_agente) {
            // console.log("Asignando agente porque el ticket no tiene uno asignado.");
            await assignTicketToAgent(ticket.id, formData.id_agente);
        }

        //Actualiza el ticket
        updateExistingTicket(ticket.id, ticketData);

        // Enviar el mensaje si hay contenido
        if (mensaje.trim()) {
            const nuevoMensaje = {
                id_ticket: ticket.id,
                mensaje: mensaje,
                descripcion: mensaje // Puedes ajustar según lo que necesites
            };
            await handleEnviarMensaje(nuevoMensaje);
            setMensaje(''); // Limpiar el campo de mensaje después de enviar
        }
        if (editorInstance) {
            editorInstance.setData('');
        }
    };

    const [estadoSeleccionado, setEstadoSeleccionado] = useState(ticket.estado_ticket);
    const [showSelector, setShowSelector] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };



    const handleEditorChange = (event, editor) => {
        if (editor) {
            const data = editor.getData();
            setMensaje(data);
        }
    };

    const toggleSelector = () => {
        setShowSelector(!showSelector);
    };

    const handleSelect = (estado_ticket) => {
        setEstadoSeleccionado(estado_ticket);
        setShowSelector(false);
    };

    // Determinar el color basado en el estado del ticket 
    const getColorByEstado = (estado_ticket) => {
        switch (estado_ticket) {
            case 'nuevo':
                return 'bg-nuevoBdg';
            case 'abierto':
                return 'bg-abiertoBdg';
            case 'en_curso':
                return 'bg-cursoBdg';
            case 'pendiente':
                return 'bg-pendienteBdg';
            case 'resuelto':
                return 'bg-resueltoBdg';
            default:
                return 'bg-yellow-500';
        }
    };

    // Obtener el nombre del cliente y del agente
    const cliente = clientes ? clientes.find(c => c.id === ticket.id_cliente) : null;
    const agente = agentes ? agentes.find(a => a.id === ticket.id_agente) : null;
    const sede = sedes ? sedes.find(s => s.id === ticket.id_sede) : null;

    return (
        <div className="flex flex-col">
            <div className="bg-gray-200 p-3 flex items-center">
                <div className="bg-gray-100 p-2 flex items-center">
                    <div className="mr-2 text-sm text-black">
                        {/* {ticket.id_cliente} */}
                        {ticket ? ticket.creado_por : 'Solicitante no disponible'}
                    </div>
                </div>

                <div className="bg-gray-300 p-2 rounded flex items-center">
                    <div className={`${getColorByEstado(estadoSeleccionado)} rounded text-white font-bold px-2 text-sm mr-2`}>
                        {estadoSeleccionado}
                    </div>
                    <div className="mr-2 text-sm">
                        Ticket #{ticket.id}
                    </div>
                </div>
            </div>

            <div className="flex flex-1">
                {/* Formulario */}
                <div className="w-3/8 p-8 bg-white border border-gray-200 min-h-[74vh]">
                    <div className="mb-4">
                        <label className="block font-bold text-black">Solicitante</label>
                        <input
                            type="text"
                            value={ticket ? ticket.creado_por : 'Solicitante no disponible'}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            readOnly
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold text-black">Agente asignado</label>
                        <select
                            name="id_agente"
                            value={formData.id_agente || ticket.id_agente || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        >
                            <option value="">-</option>
                            {agentes.map(agente => (
                                <option key={agente.id} value={agente.id}>
                                    {agente.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold text-black">Sede</label>
                        <input
                            type="text"
                            value={sede ? sede.nombre : 'Cargando...'}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            readOnly
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="font-bold text-black">Tipo</label>
                            <select
                                name="tipo"
                                value={formData.tipo || ticket.tipo_ticket}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                            >
                                <option value="">-</option>
                                <option value="pregunta">Pregunta</option>
                                <option value="incidente">Incidente</option>
                                <option value="problema">Problema</option>
                                <option value="tarea">Tarea</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-bold text-black">Prioridad</label>
                            <select
                                name="prioridad"
                                value={formData.prioridad || ticket.prioridad_ticket}
                                onChange={handleChange}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                            >
                                <option value="">-</option>
                                <option value="baja">Baja</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Conversación y Editor de textos */}
                <div className="w-full flex flex-col border border-gray-200 min-h-[74vh]">
                    <input
                        type="text"
                        name="asunto"
                        value={asunto}
                        className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm font-bold text-black"
                    />

                    {/* Conversación */}
                    <div className="flex-grow overflow-y-auto p-2 border border-gray-200 max-h-[350px] min-h-[290px]">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <span className="loading loading-spinner loading-lg text-azul"></span>
                            </div>
                        ) : mensajes.length > 0 ? (
                            <MensajeChat mensajes={mensajes} />
                        ) : (
                            <p className="flex justify-center items-center h-full text-gray-400">No hay mensajes</p>
                        )}
                        {error && <p>Error al cargar mensajes: {error}</p>}
                    </div>

                    {/* Editor de Texto */}
                    <div>
                        <CKEditor
                            editor={ClassicEditor}
                            onReady={handleEditorReady}
                            onChange={handleEditorChange}
                            config={{
                                toolbar: ['undo', 'redo', 'bold', 'italic', 'link',],
                            }}
                        />
                    </div>

                    {/* Botón Enviar como */}
                    <div className="bg-white flex items-center justify-end border border-gray-200 space-x-1">
                        <button className="bg-gray-700 text-white px-1 py-1 rounded" onClick={handleUpdateTicket}>
                            Enviar como <strong>{estadoSeleccionado || ticket.estado_ticket}</strong>
                        </button>
                        <div className="relative">
                            <button
                                className="bg-gray-700 text-white px-2 py-2 rounded flex items-center"
                                onClick={toggleSelector}
                            >
                                <FaChevronDown className={`transform ${showSelector ? 'rotate-180' : 'rotate-0'}`} />
                            </button>

                            {showSelector && (
                                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white shadow-lg rounded z-10">
                                    <div
                                        onClick={() => handleSelect('abierto')}
                                        className="px-4 py-2 cursor-pointer flex items-center hover:bg-gray-200"
                                    >
                                        <span className="w-3 h-3 bg-abiertoBdg rounded-full mr-2"></span> Abierto
                                    </div>
                                    <div
                                        onClick={() => handleSelect('en_curso')}
                                        className="px-4 py-2 cursor-pointer flex items-center hover:bg-gray-200"
                                    >
                                        <span className="w-3 h-3 bg-cursoBdg rounded-full mr-2"></span> En curso
                                    </div>
                                    <div
                                        onClick={() => handleSelect('pendiente')}
                                        className="px-4 py-2 cursor-pointer flex items-center hover:bg-gray-200"
                                    >
                                        <span className="w-3 h-3 bg-pendienteBdg rounded-full mr-2"></span> Pendiente
                                    </div>
                                    <div
                                        onClick={() => handleSelect('resuelto')}
                                        className="px-4 py-2 cursor-pointer flex items-center hover:bg-gray-200"
                                    >
                                        <span className="w-3 h-3 bg-resueltoBdg rounded-full mr-2"></span> Resuelto
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AbrirTicket;