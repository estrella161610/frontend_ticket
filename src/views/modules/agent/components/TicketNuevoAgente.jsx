import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FaChevronDown } from 'react-icons/fa';
import useFetchClientes from '../../../../hooks/useFetchClientes';
import useFetchAgentes from '../../../../hooks/useFetchAgentes';
import useFetchSedes from '../../../../hooks/useFetchSedes';
import useFetchPerfilAgente from '../../../../hooks/useFetchPerfilAgente';
import useFetchTickets from '../../../../hooks/useFetchTickets';
import useFetchMensajes from '../../../../hooks/useFetchMensajes';
import MensajeChat from '../../../../components/MensajeChat';
import ModalExito from '../../../../components/ModalExito';
import ModalError from '../../../../components/ModalError';

const TicketNuevoAgente = () => {
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

  //Modales
  const [isModalExitoOpen, setIsModalExitoOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);

  // Llamadas a los hooks
  const { clientes } = useFetchClientes();
  const { agentes } = useFetchAgentes();
  const { sedes } = useFetchSedes();
  const { addTicket, assignTicketToAgent } = useFetchTickets();
  const { handleEnviarMensaje } = useFetchMensajes(); // Hook para enviar mensajes
  const { perfil } = useFetchPerfilAgente();

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

  //Agregar un nuevo ticket + mensaje
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
    //Envio de mensaje
    try {
      // Esperar a que se cree el ticket
      const createdTicket = await addTicket(newTicket);
      console.log("Ticket creado:", createdTicket);
      
      // Asignar el agente al ticket
      if (formData.id_agente) {
        await assignTicketToAgent(createdTicket.id, formData.id_agente);
        console.log(`Agente ${formData.id_agente} asignado al ticket ${createdTicket.id}`);
      }
  
      // Enviar el mensaje si existe
      if (mensaje.trim()) {
        const nuevoMensaje = {
          id_ticket: createdTicket.id, // Usar el ID del ticket creado
          mensaje: mensaje,
          descripcion: mensaje,
        };
  
        console.log("Mensaje a enviar:", nuevoMensaje); // Verifica el contenido del mensaje
  
        // Aquí es donde se envía el mensaje
        const response = await handleEnviarMensaje(nuevoMensaje); // Enviar el mensaje
        // Agregar el mensaje a la lista de mensajes enviados usando la respuesta del backend
        setMensajesEnviados(prevMensajes => [...prevMensajes, response]); // response ya contiene el mensaje con emisor_type
        // Reinicia solo el campo del mensaje
        setMensaje(''); // Reinicia el mensaje
      }
  
      // Mostrar modal de éxito
      setIsModalExitoOpen(true);
      
      // Limpiar el formulario
      // setFormData({
      //   id_sede: '',
      //   id_cliente: '',
      //   id_agente: '',
      //   tipo_ticket: '',
      //   prioridad_ticket: '',
      //   nombre_ticket: '',
      //   asunto: '',
      // });
      // setMensaje('');
    } catch (error) {
      console.error("Error al crear ticket o enviar mensaje:", error.response ? error.response.data : error.message);
      // Mostrar modal de error
      setIsModalErrorOpen(true);
    }
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
              <label className="font-bold text-black">Solicitante</label>
              <input
                type="text"
                value={perfil.nombre}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                readOnly
              />
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
      {/* Modales de éxito y error */}
      <ModalExito
        isOpen={isModalExitoOpen}
        onClose={() => setIsModalExitoOpen(false)}
        title="¡Operación Exitosa!"
        message={"El ticket ha sido generado exitosamente"}
      />

      <ModalError
        isOpen={isModalErrorOpen}
        onClose={() => setIsModalErrorOpen(false)}
        title="Error"
        message="Error al generar el ticket. Intente nuevamente."
      />
    </div>
  );
};

export default TicketNuevoAgente;