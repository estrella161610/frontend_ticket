import { useState, useEffect } from "react";
import { FaPlus, FaUpload, FaDownload } from "react-icons/fa";
import { FiSearch, FiUpload, FiDownload } from "react-icons/fi";
import { useDispatch } from "react-redux";

import Tabla from "../components/Tabla";
import ModalImportar from "../components/ModalImportar";
import ModalAgregar from "../components/ModalAgregar";
import ModalAlerta from "../components/ModalAlerta";
import useFetchDepartamentos from "../hooks/useFetchDepartamentos";
import { openModal } from "../store/features/modalAlertaSlice";
import ModalError from "../components/ModalError";
import ModalExito from "../components/ModalExito";
import useFetchSedes from "../hooks/useFetchSedes";
import Alerts from '../components/Alerts';

const Departamentos = () => {
  const columnas = ["id", "Nombre", "Descripcion", "Estatus", "Sede","Acciones"];
  const { departamentos, isLoading, error, handleAddDepartamento, handleUpdateDepartamento, handleDeleteDepartamento, handleImportarDepartamentos, handleExportarDepartamentos } = useFetchDepartamentos();
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const { sedes, isLoading: loadingSedes, error: errorSedes } = useFetchSedes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAgregarOpen, setIsModalAgregarOpen] = useState(false);
  const [nuevoDepartamento, setNuevoDepartamento] = useState({ 
    nombre: "", 
    descripcion: "", 
    estatus: "", 
    id_sede: "" });
  const dispatch = useDispatch();

  const toggleModalAgregar = () => setIsModalAgregarOpen(prev => !prev);
  const handleCloseModalAgregar = () => {
    dispatch(openModal());
  };

  const [isModalExitoOpen, setIsModalExitoOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  const [validaciones, setValidaciones] = useState({
    nombre: false,
    descripcion: false,
    estatus: false,
    id_sede: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleValidation = () => {

    const valid = {
      nombre: !!nuevoDepartamento.nombre,
      descripcion: !!nuevoDepartamento.descripcion,
      estatus: !!nuevoDepartamento.estatus,
      id_sede: !!nuevoDepartamento.id_sede,
    };

    setValidaciones(valid);

    // Verifica si todos los campos son válidos
    return Object.values(valid).every((field) => field === true);
  };

  useEffect(() => {
    if (submitted) {
      handleValidation();
    }
  }, [nuevoDepartamento]);

  const handleConfirmCloseAgregar = () => {
    setIsModalAgregarOpen(false);
    setNuevoDepartamento({
      nombre: "",
      descripcion: "",
      estatus: "",
      id_sede: ""
    });
    setValidaciones({
      nombre: false,
      descripcion: false,
      estatus: false,
      id_sede: false,
    });
    setSubmitted(false); // Resetea el estado de enviado
    setUsuarioAEditar(null);
  };

  const handleCloseModalEditar = () => {
    dispatch(openModal());
  };

  const [isModalEditOpen, setModalEditOpen] = useState(false);
  const handleConfirmCloseEditar = () => {
    setModalEditOpen(false);
    setUsuarioAEditar(null);
  };

  const handleEdit = (departamento) => {
    setUsuarioAEditar(departamento);
    setNuevoDepartamento({
      nombre: departamento.nombre,
      descripcion: departamento.descripcion,
      estatus: departamento.estatus === 1 ? "1" : "0",
      id_sede: departamento.id_sede
    });
    setIsModalAgregarOpen(true);
  };

  // Function to get the name of the sede based on its ID
  const getSedeName = (id_sede) => {
    const sede = sedes.find((s) => s.id === parseInt(id_sede));
    return sede ? sede.nombre : "Sede no encontrada";
  };

  useEffect(() => {
    if (!loadingSedes && sedes.length > 0) {
      // console.log('Sedes loaded:', sedes);
    }
  }, [loadingSedes, sedes]);


  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleImport = async (file) => {
    try {
      await handleImportarDepartamentos(file);
      alert("Archivo importado exitosamente.");
    } catch (error) {
      console.error("Error al importar archivo:", error);
      alert("Error al importar archivo.");
      
    }
  };

  return (
    <div className="pt-4 px-8">
      <div className="flex justify-between items-center mx-5 mt-5">
        <h1 className="text-2xl font-bold">Departamentos</h1>
        <div className="flex space-x-3">
          <button
            className="flex items-center bg-azul border rounded-md text-white text-sm font-semibold px-4 py-2 hover:bg-blue-900"
            onClick={toggleModalAgregar}
          >
            <FaPlus className="mr-2" />
            Agregar departamento
          </button>

          <button
            className="flex items-center border-2 rounded-md border-azul text-azul text-sm font-semibold px-4 py-2 hover:bg-gray-50"
            onClick={handleOpenModal}
          >
            <FaUpload className="mr-2" />
            Importar
          </button>

          <ModalImportar
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Importar Departamentos"
            onImport={handleImport}
          />

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
            onEdit={handleEdit}
            onDelete={handleDeleteDepartamento}
          />
        )}
      </div>

      <ModalExito
        isOpen={isModalExitoOpen}
        onClose={() => setIsModalExitoOpen(false)}
        title="¡Operación Exitosa!"
        message={"El departamemto se ha guardado correctamente"}
      />

      <ModalError
        isOpen={isModalErrorOpen}
        onClose={() => setIsModalErrorOpen(false)}
        title="Error"
        message="Error al agregar el departamento. Inténtalo de nuevo."
      />

      <ModalAgregar
        isOpen={isModalAgregarOpen}
        onClose={handleCloseModalAgregar}
        onSubmit={async () => {
          setSubmitted(true);  // Marca que el formulario ha sido enviado
          if (!handleValidation()) {
            setErrorMessage("Todos los campos son obligatorios.");
            return; // Detiene el envío si falta algún campo
          }
          try {
            if (usuarioAEditar) {
                await handleUpdateDepartamento({ id: usuarioAEditar.id, ...nuevoDepartamento });
            } else {
                await handleAddDepartamento(nuevoDepartamento);
            }
            setIsModalExitoOpen(true); // Abre modal de éxito
            handleConfirmCloseAgregar(); // Cierra el modal de agregar/editar
          } catch (error) {
              setErrorMessage(error.message); // Manejo de error
              handleConfirmCloseAgregar(); // Cierra el modal de agregar/editar
              setIsModalErrorOpen(true); // Abre modal de error
          }
        }}
        usuario={usuarioAEditar}
        title={usuarioAEditar ? "Editar Departamento" : "Agregar Departamento"}
      >
        {/* Formulario para agregar o editar */}
        <div className="mt-4 text-sm mx-8">
          <label className="block mb-1 font-bold text-sm">Nombre</label>
          <input
            type="text"
            className={`w-full p-2 mb-3 border ${validaciones.nombre === false && submitted ? "border-red-500" : "border-blue-700"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
            placeholder="Ingrese el nombre del departamento"
            required
            value={nuevoDepartamento.nombre}
            onChange={(e) => setNuevoDepartamento({ ...nuevoDepartamento, nombre: e.target.value })}
          />
        </div>

        <div className="mt-4 text-sm mx-8">
          <label className="block mb-1 font-bold text-sm">Descripción</label>
          <input
            type="text"
            className={`w-full p-2 mb-3 border ${validaciones.descripcion === false && submitted ? "border-red-500" : "border-blue-700"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
            placeholder="Ingrese la descripción del departamento"
            required
            value={nuevoDepartamento.descripcion}
            onChange={(e) => setNuevoDepartamento({ ...nuevoDepartamento, descripcion: e.target.value })}
          />
        </div>

        <div className="mt-4 text-sm mx-8">
          <label className="block mb-1 font-bold text-sm">Estatus</label>
          <div className="flex space-x-2">
            {/* Botón Activo */}
            <button
              type="button"
              className={`w-full p-2 rounded-md font-bold focus:outline-none transition ${nuevoDepartamento.estatus === '1' ? 'bg-pendienteBdg text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setNuevoDepartamento({ ...nuevoDepartamento, estatus: '1' })}
            >
              Activo
            </button>

            {/* Botón Inactivo */}
            <button
              type="button"
              className={`w-full p-2 rounded-md font-bold focus:outline-none transition ${nuevoDepartamento.estatus === '0' ? 'bg-abiertoBdg text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setNuevoDepartamento({ ...nuevoDepartamento, estatus: '0' })}
            >
              Inactivo
            </button>
          </div>
        </div>

        {/* Dropdown de sedes */}
        <div className="mt-4 text-sm mx-8">
          <label className="block mb-1 font-bold text-sm">Sede</label>
          {loadingSedes ? (
            <p>Cargando sedes...</p>
          ) : errorSedes ? (
            <p>Error: {errorSedes}</p>
          ) : (
            <select
            className={`w-full p-2 mb-3 border ${validaciones.id_sede === false && submitted ? "border-red-500" : "border-blue-700"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
            value={nuevoDepartamento.id_sede}
              onChange={(e) => setNuevoDepartamento({ ...nuevoDepartamento, id_sede: e.target.value })}
              required
            >
              <option value="" disabled>Seleccionar sede</option>
              {sedes.map(sede => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          )}
          {submitted && !validaciones.id_sede && (
            <p className="text-red-500 text-sm mt-1">No has seleccionado la sede.</p>
          )}
        </div>
      </ModalAgregar>

      <ModalAlerta
        message={
          isModalEditOpen
            ? "¿Desea cancelar y cerrar el modal de editar?"
            : "¿Desea cancelar y cerrar el modal de agregar?"
        }
        onConfirm={isModalEditOpen ? handleConfirmCloseEditar : handleConfirmCloseAgregar}
        onCancel={() => {
          dispatch(openModal());
        }}
      />
    </div>
  );
};

export default Departamentos;