const MensajeChat = ({ mensajes }) => {
  // Verifica si mensajes es un array
  if (!Array.isArray(mensajes)) {
    return <div>Algo ha ido mal</div>; // Mensaje de error
  }

  // Si no hay mensajes, muestra un mensaje alternativo
  if (mensajes.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-400">
        No hay mensajes
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-2">
      {mensajes.map((mensaje) => (
        <div
          key={mensaje.id}
          className={`chat ${mensaje.emisor_type === 'App\\Models\\Cliente' ? 'chat-end' : 'chat-start'}`}
        >
          <div
            className={`chat-bubble ${
              mensaje.emisor_type === 'App\\Models\\Cliente'
                ? 'bg-azul text-white' // Azul oscuro
                : 'bg-charcol text-white' // Charcoal
            }`}
          >
            <strong>{mensaje.emisor_type === 'App\\Models\\Cliente' ? 'Cliente: ' : 'Agente: '}</strong>{mensaje.mensaje}
            <br />
            <small className="text-[#828282]">{new Date(mensaje.created_at).toLocaleString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MensajeChat;