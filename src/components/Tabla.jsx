import { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import ModalEliminar from "./ModalEliminar";
import ModalExito from './ModalExito';
import ModalError from './ModalError';

const Tabla = ({ columnas, datos, onEdit, onEstatusChange, onDelete, searchTerm }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // Estado para el modal de éxito
  const [isModalExitoOpen, setModalExitoOpen] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  // Estado para el modal de error
  const [isModalErrorOpen, setModalErrorOpen] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  // Función para abrir el modal de eliminar    
  const abrirModalEliminar = (usuario) => {
    setUsuarioAEliminar(usuario);
    setModalOpen(true);
  };

  // Función para cerrar el modal de eliminar    
  const cerrarModalEliminar = () => {
    setModalOpen(false);
    setUsuarioAEliminar(null);
  };

  // Función para manejar la edición    
  const handleEdit = (usuario) => {
    onEdit(usuario); // Llama a la función onEdit pasada como prop    
  };

  const eliminarUsuario = async () => {
    if (usuarioAEliminar) {
      try {
        await onDelete(usuarioAEliminar.id); // Llama a la función de eliminación
        setMensajeExito("Registro eliminado con éxito."); // Mensaje de éxito
        setModalExitoOpen(true); // Abre el modal de éxito
      } catch (error) {
        setMensajeError("Error al eliminar Registro."); // Mensaje de error
        setModalErrorOpen(true); // Abre el modal de error
      } finally {
        cerrarModalEliminar();
      }
    }
  };

  // Función para filtrar los datos
const filtrarDatos = (datos, searchTerm) => {
  if (!searchTerm) return datos; // Si no hay término de búsqueda, devuelve todos los datos

  return datos.filter((fila) => {
    // Compara el término de búsqueda con los valores de la fila
    return Object.values(fila).some((valor) => {
      return String(valor).toLowerCase().includes(searchTerm.toLowerCase());
  }) || (fila.estatus === 1 && searchTerm.toLowerCase() === 'activo') || (fila.estatus === 0 && searchTerm.toLowerCase() === 'inactivo');
  });
};

  const datosFiltrados = filtrarDatos(datos, searchTerm);
  // console.log(datosFiltrados);

  return (
    <div className="overflow-x-auto text-sm">
      <div className="h-[230px] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columnas.map((columna, index) => (
                <th
                  key={index}
                  className="p-2 border-b text-left bg-white sticky top-0 z-10"
                >
                  {columna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((fila, indexFila) => (
              <tr key={indexFila} className="hover:bg-gray-50 text-sm">
                {columnas.map((columna, indexColumna) => (
                  <td
                    key={indexColumna}
                    className={`p-2 border-b ${
                      columna === 'Nombre' ? 'text-blue-700' : ''
                    }`}
                  >
                    {columna === 'Acciones' ? (
                      <div className="flex space-x-3 text-sm">
                        <button
                          className="text-yellow-400 hover:text-yellow-500"
                          onClick={() => handleEdit(fila)}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() => abrirModalEliminar(fila)}
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    ) : columna === 'Estatus' ? (
                      <div className="flex items-center cursor-pointer">
                        <div
                          className={`relative w-24 h-5 rounded-full transition duration-300 ease-in-out ${
                            fila.estatus === 1 ? 'bg-pendienteBdg' : 'bg-abiertoBdg'
                          } flex justify-center items-center`}
                        >
                          <span
                            className={`transition duration-300 ease-in-out ${
                              fila.estatus === 1 ? 'text-white' : 'text-white'
                            }`}
                          >
                            {fila.estatus === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Busca el valor en 'fila' usando el nombre de la columna, y si no existe, lo busca en minúsculas    
                      fila[columna] || fila[columna.toLowerCase()]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para eliminar */}
      <ModalEliminar
        isOpen={isModalOpen}
        onClose={cerrarModalEliminar}
        onConfirm={eliminarUsuario}
        message={`¿Estás seguro de que deseas eliminar este elemento? `}
      />

      {/* Modal para éxito */}
      <ModalExito
        isOpen={isModalExitoOpen}
        onClose={() => setModalExitoOpen(false)}
        title="Éxito"
        message={mensajeExito}
      />

      {/* Modal de Error */}
      <ModalError
        isOpen={isModalErrorOpen}
        onClose={() => setModalErrorOpen(false)}
        title="Error"
        message={mensajeError}
      />
    </div>
  );
};

export default Tabla;