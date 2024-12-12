 
const Home = () => {  
  return (
    <div className="flex h-[80vh]">
      <div className="flex-1 p-2 overflow-auto h-full">
        {/* Contenido de Ayuda */}
        <div className='m-4'>
          <p className='ml-6 text-center text-3xl font-bold mb-4'>
            Administrar todos los tickets en un solo lugar
          </p>
          <p>Epicore convierte todas las conversaciones de los clientes en tickets. Los clientes chateen y los tickets estarán en un solo lugar.</p>
          <p>En el espacio de trabajo de Epicore, puede:</p>
          <ul className='list-disc ml-4'>
            <li>Ver toda la información de contacto, el historial de interacción y los detalles</li>
            <li>Incluir equipos sin salir del ticket</li>
          </ul>
        </div>

        {/* Contenedor del video */}
        <div className="flex justify-center items-center mb-4">
          <iframe
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/GAIEjoVNJjI?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0"
            title="Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Home;
