import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { FiSearch} from "react-icons/fi";
import Tabla from "../../../../components/Tabla";
import useFetchDepartamentos from "../../../../hooks/useFetchDepartamentos";
import useFetchSedes from "../../../../hooks/useFetchSedes";
import Alerts from '../../../../components/Alerts';

const Departamentos = () => {
  const columnas = ["id", "Nombre", "Descripcion", "Estatus", "Sede"];
  const { departamentos, isLoading, error,handleExportarDepartamentos } = useFetchDepartamentos();
  const { sedes, isLoading: loadingSedes, error: errorSedes } = useFetchSedes();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Si hay un error, muestra el alert
    if (error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // 3000 ms = 3 segundos

      // Limpia el timeout si el componente se desmonta o si el error cambia
      return () => clearTimeout(timer);
    }
  }, [error]);


  const getSedeName = (id_sede) => {
    const sede = sedes.find((s) => s.id === parseInt(id_sede));
    return sede ? sede.nombre : "Sede no encontrada";
  };

  useEffect(() => {
    if (!loadingSedes && sedes.length > 0) {
    }
  }, [loadingSedes, sedes]);


  return (
    <div className="pt-4 px-8">
      <div className="flex justify-between items-center mx-5 mt-5">
        <h1 className="text-2xl font-bold">Departamentos</h1>
        <div className="flex space-x-3">
          
          <button
            className="flex items-center border-2 rounded-md border-azul text-azul text-sm font-semibold px-4 py-2 hover:bg-gray-200"
            onClick={handleExportarDepartamentos}
          >
            <FaDownload className="mr-2" />
            Exportar
          </button>

        </div>
      </div>
      <span className="block mx-5 mt-2 text-sm">
        Agregue, busque y administre a sus departamentos en un solo lugar.
      </span>

      <div className="flex mx-5 pt-12 pb-2 space-x-2 items-center">
        <label className="input input-bordered flex items-center gap-2">
          <input 
            type="text" 
            className="w-64" 
            placeholder="Buscar departamentos"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <FiSearch className="text-gray-300 mr-2 text-sm" size={20} />
        </label>
      </div>

      {/* Contador de registros */}
      <div className="block mx-5 mb-8 text-sm text-gray-500">
        <span>Departamentos:</span> {departamentos.length}
      </div>

      {/* Tabla reutilizable */}
      <div className="mx-5">
        {/* Muestra el estado de carga o error si es necesario */}
        {isLoading || loadingSedes ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-azul"></span>
          </div>
        ) : showAlert ? (
          <Alerts type="error" message={`Error: ${error || errorSedes}`} />
        ) : (
          <Tabla
            columnas={columnas}
            datos={(departamentos || []).map((departamento) => ({
              ...departamento,
              Sede: getSedeName(departamento.id_sede),
            }))}
            searchTerm={searchTerm}
          />
        )}
      </div>

    </div>
  );
};

export default Departamentos;