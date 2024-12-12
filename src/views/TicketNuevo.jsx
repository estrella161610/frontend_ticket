import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FaChevronDown } from 'react-icons/fa';
import useFetchClientes from '../hooks/useFetchClientes';
import useFetchAgentes from '../hooks/useFetchAgentes';
import useFetchSedes from '../hooks/useFetchSedes';
import useFetchTickets from '../hooks/useFetchTickets';
import useFetchMensajes from '../hooks/useFetchMensajes';
import MensajeChat from '../components/MensajeChat';

const TicketNuevo = () => {
  const [formData, setFormData] = useState({
    id_sede: '',
    id_cliente: '',
    id_agente: '',
    tipo_ticket: '',
    prioridad_ticket: '',
    nombre_ticket: '',
    asunto: '',
  });

  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Nuevo');
  const [showSelector, setShowSelector] = useState(false);
  const [mensaje, setMensaje] = useState(''); // Estado para el mensaje
  const [mensajesEnviados, setMensajesEnviados] = useState([]); // Estado para almacenar mensajes enviados

  // Llamadas a los hooks
  const { clientes } = useFetchClientes();
  const { agentes } = useFetchAgentes();
  const { sedes } = useFetchSedes();
  const { addTicket } = useFetchTickets();
  const { handleEnviarMensaje } = useFetchMensajes(); // Hook para enviar mensajes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({
      ...formData,
      asunto: data, // Actualiza el asunto desde el CKEditor
    });
  };

  const handleMensajeChange = (event, editor) => {
    const data = editor.getData();
    setMensaje(data); // Actualiza el mensaje
  };

  const handleAddTicket = async () => {
    const newTicket = {
      id_sede: formData.id_sede,
      id_cliente: formData.id_cliente,
      id_agente: formData.id_agente,
      tipo_ticket: formData.tipo_ticket,
      prioridad_ticket: formData.prioridad_ticket,
      nombre_ticket: formData.asunto, 
      estado_ticket: estadoSeleccionado,
      asunto: formData.asunto, 
    };

    console.log("Payload de nuevo ticket:", newTicket);
    const createdTicket = await addTicket(newTicket); // Esperar a que se cree el ticket

    // Enviar el mensaje si existe
    if (mensaje.trim()) {
      const nuevoMensaje = {
        id: Date.now(), // Usar el timestamp como un ID único
        id_ticket: createdTicket.id, // Usar el ID del ticket creado
        emisor_id: formData.id_agente || formData.id_cliente, // ID del agente o cliente
        emisor_type: formData.id_agente ? 'Agente' : 'Cliente', // Determinar el tipo de emisor
        mensaje: mensaje,
        descripcion: mensaje,
        created_at: new Date().toISOString(), // Agregar la fecha de creación
      };
      await handleEnviarMensaje(nuevoMensaje); // Enviar el mensaje

      // Agregar el mensaje a la lista de mensajes enviados
      setMensajesEnviados(prevMensajes => [...prevMensajes, nuevoMensaje]);
    }

    // Reinicia el formulario
    setFormData({
      id_sede: '',
      id_cliente: '',
      id_agente: '',
      tipo_ticket: '',
      prioridad_ticket: '',
      nombre_ticket: '',
      asunto: '', // Reinicia el asunto
    });
  };

  const toggleSelector = () => {
    setShowSelector(!showSelector);
  };

  const handleSelect = (estado) => {
    if (estadoSeleccionado !== 'Nuevo') {
      setEstadoSeleccionado(estado);
    }
    setShowSelector(false);
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-200 p-3 flex items-center">
        <div className="bg-gray-300 p-2 rounded flex items-center">
          <div className={`bg-yellow-500 rounded text-black font-bold px-2 text-sm mr-2`}>
            {estadoSeleccionado}
          </div>
          <div className="mr-2 text-sm">Ticket</div>
        </div>
      </div>

      <div className="flex flex- 1">
        {/* Formulario */}
        <div className="w-3/8 p-8 bg-white border border-gray-200 min-h-[74vh]">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleAddTicket(); }}>
            <div>
              <label className="font-bold text-black">Cliente</label>
              <select
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              >
                <option value="">-</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nombre_completo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-black">Agente asignado</label>
              <select
                name="id_agente"
                value={formData.id_agente}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              >
                <option value="">-</option>
                {agentes.map(agente => (
                  <option key={agente.id} value={agente.id}>{agente.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-black">Sede</label>
              <select
                name="id_sede"
                value={formData.id_sede}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
              >
                <option value="">-</option>
                {sedes.map(sede => (
                  <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-black">Tipo</label>
                <select
                  name="tipo_ticket"
                  value={formData.tipo_ticket}
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
                  name="prioridad_ticket"
                  value={formData.prioridad_ticket}
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
          </form>
        </div>

        {/* Conversación y Editor */}
        <div className="w-full flex flex-col border border-gray-200">
          <input
            type="text"
            value={formData.asunto}
            onChange={handleChange}
            name="asunto"
            placeholder="Asunto"
            className={`p-2 border border-white rounded w-full ${formData.asunto ? 'font-bold text-black' : 'mt-0'}`}
          />
          <hr />
          {/* Conversación */}
          <div className="flex-grow overflow-y-auto p-2 border border-gray-200" style={{ minHeight: '290px' }}>
            <MensajeChat mensajes={mensajesEnviados} />
          </div>

          {/* Editor de Texto */}
          <div>
            <CKEditor
              editor={ClassicEditor}
              data=""
              onChange={handleMensajeChange} //Aquí se maneja el mensaje
              config={{
                toolbar: ['undo', 'redo', 'bold', 'italic', 'link'],
              }}
            />
          </div>

          {/* Botón Enviar como */}
          <div className="bg-white flex items-center justify-end border border-gray-200 space-x-1">
            <button className="bg-gray-700 text-white px-1 py-1 rounded" onClick={handleAddTicket}>
              Enviar como <strong>{estadoSeleccionado}</strong>
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
                    onClick={() => handleSelect('nuevo')}
                    className="px-4 py-2 cursor-pointer flex items-center hover:bg-red-100"
                  >
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span> Nuevo
                  </div>
                  <div
                    onClick={() => handleSelect('abierto')}
                    className="px-4 py-2 cursor-pointer flex items-center hover:bg-red-100"
                  >
                    <span className="w-3 h-3 bg-abiertoBdg rounded-full mr-2"></span> Abierto
                  </div>
                  <div
                    onClick={() => handleSelect('en_curso')}
                    className="px-4 py-2 cursor-pointer flex items-center hover:bg-orange-100"
                  >
                    <span className="w-3 h-3 bg-cursoBdg rounded-full mr-2"></span> En curso
                  </div>
                  <div
                    onClick={() => handleSelect('pendiente')}
                    className="px-4 py-2 cursor-pointer flex items-center hover:bg-blue-100"
                  >
                    <span className="w-3 h-3 bg-pendienteBdg rounded-full mr-2"></span> Pendiente
                  </div>
                  <div
                    onClick={() => handleSelect('resuelto')}
                    className="px-4 py-2 cursor-pointer flex items-center hover:bg-green-100"
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

export default TicketNuevo;