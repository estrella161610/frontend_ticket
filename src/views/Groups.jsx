import { useState, useEffect } from "react";
import { FaPlus, FaUpload, FaDownload } from "react-icons/fa";
import { FiSearch, FiUpload, FiDownload } from "react-icons/fi";
import { useDispatch } from 'react-redux';

import Tabla from "../components/Tabla";
import ModalImportar from "../components/ModalImportar";
import ModalAgregar from "../components/ModalAgregar";
import ModalAlerta from "../components/ModalAlerta";
import useFetchGrupos from "../hooks/useFetchGrupos";
import { openModal } from "../store/features/modalAlertaSlice";
import ModalError from "../components/ModalError";
import ModalExito from "../components/ModalExito";
import useFetchDepartamentos from "../hooks/useFetchDepartamentos";
import useFetchSedes from "../hooks/useFetchSedes";
import Alerts from '../components/Alerts';

const Groups = () => {
  const columnas = ["id", "Nombre", "Descripcion", "Estatus", "Sede", "Departamento", "Acciones"];
  const { grupos, isLoading, error, handleAddGrupo, handleUpdateGrupo, handleDeleteGrupo, handleImportarGrupo, handleExportarGrupo } = useFetchGrupos();

  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const { departamentos, isLoading: loadingDepartamentos, error: errorDepartamentos } = useFetchDepartamentos();
  const { sedes, isLoading: loadingSedes, error: errorSedes } = useFetchSedes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAgregarOpen, setIsModalAgregarOpen] = useState(false);
  const [nuevoGrupo, setNuevoGrupo] = useState({
    nombre: "",
    descripcion: "",
    estatus: "",
    id_sede: "",
    id_departamento: ""
  });
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
    id_departamento: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleValidation = () => {

    const valid = {
      nombre: !!nuevoGrupo.nombre,
      descripcion: !!nuevoGrupo.descripcion,
      estatus: !!nuevoGrupo.estatus,
      id_sede: !!nuevoGrupo.id_sede,
      id_departamento: !!nuevoGrupo.id_departamento,
    };

    setValidaciones(valid);

    // Verifica si todos los campos son válidos
    return Object.values(valid).every((field) => field === true);
  };

  useEffect(() => {
    if (submitted) {
      handleValidation();
    }
  }, [nuevoGrupo]);

  const handleConfirmCloseAgregar = () => {
    setIsModalAgregarOpen(false);
    setNuevoGrupo({
      nombre: "",
      descripcion: "",
      estatus: "",
      id_sede: "",
      id_departamento: ""
    });
    setValidaciones({
      nombre: false,
      descripcion: false,
      estatus: false,
      id_sede: false,
      id_departamento: false,
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

  const handleEdit = (grupo) => {
    setUsuarioAEditar(grupo);
    setNuevoGrupo({
      nombre: grupo.nombre,
      descripcion: grupo.descripcion,
      estatus: grupo.estatus === 1 ? "1" : "0",
      id_sede: grupo.id_sede,
      id_departamento: grupo.id_departamento

    });
    setIsModalAgregarOpen(true);
  };

  // Function to get the name of the sede based on its ID
  const getSedeName = (id_sede) => {
    const sede = sedes.find((s) => s.id === parseInt(id_sede));
    // console.log(sede.nombre);
    // console.log(sede)
    return sede ? sede.nombre : "Sede no encontrada";
  };

  useEffect(() => {
    if (!loadingSedes && sedes.length > 0) {
      // console.log('Sedes loaded:', sedes);
    }
  }, [loadingSedes, sedes]);

  // Function to get the name of the sede based on its ID
  const getDepName = (id_departamento) => {
    const departamento = departamentos.find((d) => d.id === parseInt(id_departamento));
    // console.log(sede.nombre);
    // console.log(sede)
    return departamento ? departamento.nombre : "Departamento no encontrado";
  };

  useEffect(() => {
    if (!loadingDepartamentos && departamentos.length > 0) {
      // console.log('Sedes loaded:', sedes);
    }
  }, [loadingDepartamentos, departamentos]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleImport = async (file) => {
    try {
      await handleImportarGrupo(file);
      alert("Archivo importado exitosamente.");
    } catch (error) {
      console.error("Error al importar archivo:", error);
      alert("Error al importar archivo.");

    }
  };

  return (
    <div className="pt-4 px-8">
      <div className="flex justify-between items-center mx-5 mt-5">
        <h1 className="text-2xl font-bold">Grupos</h1>
        <div className="flex space-x-3">
          <button
            className="flex items-center bg-azul border rounded-md text-white text-sm font-semibold px-4 py-2 hover:bg-blue-900"
            onClick={toggleModalAgregar}
          >
            <FaPlus className="mr-2" />
            Agregar grupo
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
            title="Importar Grupos"
            onImport={handleImport}
          />

          <button
            className="flex items-center border-2 rounded-md border-azul text-azul text-sm font-semibold px-4 py-2 hover:bg-gray-200"
            onClick={handleExportarGrupo}
          >
            <FaDownload className="mr-2" />
            Exportar
          </button>

        </div>
      </div>
      <span className="block mx-5 mt-2 text-sm">
        Organice a los integrantes del equipo en función de su experiencia, ubicación u otro criterio para proporcionar un soporte más específico.
      </span>

      <div className="flex mx-5 pt-12 pb-2 space-x-2 items-center">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="w-64"
            placeholder="Buscar Grupos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="text-gray-300 mr-2 text-sm" size={20} />
        </label>
      </div>

      {/* Contador de registros */}
      <div className="block mx-5 mb-8 text-sm text-gray-500">
        <span>Grupos:</span> {grupos.length}
      </div>

      {/* Tabla reutilizable */}
      <div className="mx-5">
        {/* Muestra el estado de carga o error si es necesario */}
        {isLoading || loadingSedes || loadingDepartamentos ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-azul"></span>
          </div>
        ) : showAlert ? (
          <Alerts type="error" message={`Error: ${error || errorSedes || errorDepartamentos}`} />
        ) : (
          <Tabla
            columnas={columnas}
            datos={(grupos || []).map((grupo) => ({
              ...grupo,
              Sede: getSedeName(grupo.id_sede),
              Departamento: getDepName(grupo.id_departamento),
            }))}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDeleteGrupo}
          />
        )}
      </div>
      <ModalExito
        isOpen={isModalExitoOpen}
        onClose={() => setIsModalExitoOpen(false)}
        title="¡Operación Exitosa!"
        message={"El Grupo se ha guardado correctamente"}
      />

      <ModalError
        isOpen={isModalErrorOpen}
        onClose={() => setIsModalErrorOpen(false)}
        title="Error"
        message="Error al agregar el Grupo. Inténtalo de nuevo."
      />

      {/* Modal de Agregar Grupos */}
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
              await handleUpdateGrupo({ id: usuarioAEditar.id, ...nuevoGrupo });
            } else {
              await handleAddGrupo(nuevoGrupo);
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
        title={usuarioAEditar ? "Editar Grupo" : "Agregar Grupo"}
      >
        {/* Formulario para agregar o editar */}
        <div className="mt-4 text-sm mx-8">
          <label className="block mb-1 font-bold text-sm">Nombre</label>
          <input
            type="text"
            className={`w-full p-2 mb-3 border ${validaciones.nombre === false && submitted ? "border-red-500" : "border-blue-700"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
            placeholder="Ingrese el nombre del grupo"
            required
            value={nuevoGrupo.nombre}
            onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, nombre: e.target.value })}
          />
        </div>

        <div className="mt-4 text-sm mx-8">
          <label className="block mb-1 font-bold text-sm">Descripción</label>
          <input
            type="text"
            className={`w-full p-2 mb-3 border ${validaciones.descripcion === false && submitted ? "border-red-500" : "border-blue-700"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
            placeholder="Ingrese la descripción del grupo"
            required
            value={nuevoGrupo.descripcion}
            onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, descripcion: e.target.value })}
          />
        </div>

        <div className="mt-4 text-sm mx-8">
          <label className="block mb-1 font-bold text-sm">Estatus</label>
          <div className="flex space-x-2">
            {/* Botón Activo */}
            <button
              type="button"
              className={`w-full p-2 rounded-md font-bold focus:outline-none transition ${nuevoGrupo.estatus === '1' ? 'bg-pendienteBdg text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setNuevoGrupo({ ...nuevoGrupo, estatus: '1' })}
            >
              Activo
            </button>

            {/* Botón Inactivo */}
            <button
              type="button"
              className={`w-full p-2 rounded-md font-bold focus:outline-none transition ${nuevoGrupo.estatus === '0' ? 'bg-abiertoBdg text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setNuevoGrupo({ ...nuevoGrupo, estatus: '0' })}
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
              value={nuevoGrupo.id_sede}
              onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, id_sede: e.target.value })}
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


        {/* Dropdown de Departamentos */}
        <div className="mt-4 text-sm mx-8">
          <label className="block mb-1 font-bold text-sm">Departamentos</label>
          {loadingDepartamentos ? (
            <p>Cargando Departamentos...</p>
          ) : errorDepartamentos ? (
            <p>Error: {errorDepartamentos}</p>
          ) : (
            <select
              className={`w-full p-2 mb-3 border ${validaciones.id_departamento === false && submitted ? "border-red-500" : "border-blue-700"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
              value={nuevoGrupo.id_departamento}
              onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, id_departamento: e.target.value })}
              required
            >
              <option value="" disabled>Seleccionar departamento</option>
              {departamentos.map(departamento => (
                <option key={departamento.id} value={departamento.id}>
                  {departamento.nombre}
                </option>
              ))}
            </select>
          )}
          {submitted && !validaciones.id_departamento && (
            <p className="text-red-500 text-sm mt-1">No has seleccionado un departamento.</p>
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

export default Groups;