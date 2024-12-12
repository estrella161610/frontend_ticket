import { useDispatch, useSelector } from 'react-redux';
import { setContentItem } from '../../../../store/features/contentSlice';
import useStats from '../../../../hooks/useStats';

const Home = () => {
  const contentItem = useSelector((state) => state.content.contentItem);
  const dispatch = useDispatch();
  const { stats, isLoading, error } = useStats();

  return (
    <div className="flex h-[75vh]">
      <div className="flex flex-col w-1/3 border-r-2 border-gray-200 h-full items-center mt-8">
        <button className={`btn text-left w-10/12 rounded-none mb-1 py-2 px-4 border-gray-300 ${contentItem === 'stats' ? 'bg-mandarin hover:bg-orange-600 text-white' : 'bg-gray-200 text-black'
          }`}
          onClick={() => dispatch(setContentItem('stats'))}
        >
          Estadística de tickets
        </button>

        <button className={`btn text-left w-10/12 rounded-none mb-1 py-2 px-4 border-gray-300 ${contentItem === 'manage' ? 'bg-mandarin hover:bg-orange-600 text-white' : 'bg-gray-200 text-black'
          }`}
          onClick={() => dispatch(setContentItem('manage'))}
        >
          Administrar todos los tickets en un solo lugar
        </button>
      </div>

      <div className="flex-1 p-2 overflow-auto h-full">
        {/* Titulo */}
        <h1 className="text-3xl font-bold pl-5 m-4">
          {contentItem === 'stats' ? 'Estadísticas de ticket' : 'Administrar todos los tickets en un solo lugar'}
        </h1>
        {/* Contenido */}
        {contentItem === 'stats' ? (
          <div className='flex justify-center'>
            {/* Estadísticas */}
            {isLoading && <p>Cargando estadísticas...</p>}
            {error && <p>Error: {error}</p>}
            {stats && (
              <>
                <div className="stats shadow bg-green-200 m-2">
                  <div className="stat place-items-center">
                    <div className="stat-title font-bold">Resolución de tickets</div>
                    <div className="stat-value">{stats["Tiempo de solucion de un ticket"].porcentaje}%</div>
                    <div className="stat-desc">Tickets resueltos a tiempo</div>
                  </div>
                </div>
                <div className="stats shadow bg-orange-200 m-1">
                  <div className="stat place-items-center">
                    <div className="stat-title font-bold">Ahorro de tiempo</div>
                    <div className="stat-value">{(stats["Tiempo de espera promedio"] / 60).toFixed(2)} min</div>
                    <div className="stat-desc">Tiempo promedio que los clientes esperan</div>
                  </div>
                </div>
                <div className="stats shadow bg-yellow-200 m-1">
                  <div className="stat place-items-center">
                    <div className="stat-title font-bold">Total tickets resueltos en la semana</div>
                    <div className="stat-value">{stats["Total tickets resueltos en la semana"]}</div>
                    <div className="stat-desc">Número total de tickets resueltos esta semana</div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            {/* Contenido de Ayuda */}
            <div className='m-6'>
              <p>Epicore convierte todas las conversaciones de los clientes en tickets. Los clientes chatean y los tickets estarán en un solo lugar.</p>
              <p>En el espacio de trabajo de Epicore, puede:</p>
              <ul className='list-disc ml-6'>
                <li>Ver toda la información de contacto, el historial de interacción y los detalles</li>
                <li>Incluir equipos sin salir del ticket</li>
              </ul>
            </div>

            {/* Video Embed */}
            <div className="flex justify-center items-center w-full mb-1">
              <iframe
                width="420"
                height="235"
                src="https://www.youtube.com/embed/dj071Mv9sso?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0"
                title="Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
