import { useEffect, useState } from "react";
import { FaPlus, FaUpload, FaDownload } from "react-icons/fa";
import { FiSearch, FiUpload, FiDownload } from "react-icons/fi";
import { useDispatch } from "react-redux";

import Tabla from "../components/Tabla";
import ModalImportar from "../components/ModalImportar";
import ModalAgregar from "../components/ModalAgregar";
import ModalAlerta from "../components/ModalAlerta";
import { openModal } from '../store/features/modalAlertaSlice';
import ModalError from "../components/ModalError";
import ModalExito from "../components/ModalExito";

import useFetchSedes from "../hooks/useFetchSedes";
import useFetchAgentes from "../hooks/useFetchAgentes";
import useFetchClientes from "../hooks/useFetchClientes";
import Alerts from "../components/Alerts";
 
const Clients = () => { 
  const columnas = ["Nombre_Completo", "Email", "Telefono", "Estatus", "Observaciones" ,"Acciones"];

  const { sedes, isLoading: loadingSedes, error: errorSedes } = useFetchSedes();
  const { agentes, isLoading: loadingAgentes, error: errorAgentes } = useFetchAgentes();
  const { clientes, isLoading, error, handleAddCliente, handleUpdateCliente, handleDeleteCliente, handleImportarCliente, handleExportarCliente } = useFetchClientes();

  const dispatch = useDispatch();
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

  //--------------------------MODALES--------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAgregarOpen, setIsModalAgregarOpen] = useState(false);
  const [isModalEditOpen, setModalEditOpen] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const [isModalExitoOpen, setIsModalExitoOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleModalAgregar = () => setIsModalAgregarOpen((prev) => !prev);
  const handleCloseModalAgregar = () => {
    dispatch(openModal());
  };
  
  const [nuevoCliente, setNuevoCliente] = useState({
    id_usuario: "",
    id_sede: "",
    nombre_completo: "",
    nombre_corto: "",
    telefono: "",
    email: "",
    password: "",
    estatus: "",
    observaciones: "",
  });

  const handleConfirmCloseAgregar = () => {
    setIsModalAgregarOpen(false);
    setNuevoCliente({
      nombre: "",
      telefono: "",
      email: "",
      estatus: "",
      observaciones: "",
    });
    setUsuarioAEditar(null);
  };

  const handleCloseModalEditar = () => {
    dispatch(openModal());
  };

  const handleConfirmCloseEditar = () => {
    setModalEditOpen(false);
    setUsuarioAEditar(null);
  };

  const handleEdit = (cliente) => {
    setUsuarioAEditar(cliente);
    setNuevoCliente({
      id_usuario: cliente.id_usuario,
      id_sede: cliente.id_sede,
      nombre_completo: cliente.nombre_completo,
      nombre_corto: cliente.nombre_corto,
      telefono: cliente.telefono,
      email: cliente.email,
      password: cliente.password,
      estatus: cliente.estatus === 1 ? "1" : "0",
      observaciones: cliente.observaciones,
      
    });
    setIsModalAgregarOpen(true);
  };

  //Función para obtener el nombre de...
  //SEDE
  const getSedeName = (id_sede) => {
    const sede = sedes.find((s) => s.id === parseInt(id_sede));
    return sede ? sede.nombre : "Sede no encontrada";
  };

  //AGENTE
  const getAgenteName = (id_agente) => {
    const agente = agentes.find((s) => s.id === parseInt(id_agente));
    return agente ? agente.nombre : "Agente no encontrado";
  };

  const handleImport = async (file) => {
    try {
      await handleImportarCliente(file);
      alert("Archivo importado exitosamente.");
    } catch (error) {
      console.error("Error al importar archivo:", error);
      alert("Error al importar archivo.");
      
    }
  };

  return (
    <div className="pt-4 px-8">
      <div className="flex justify-between items-center mx-5 mt-5">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <div className="flex space-x-3">
          <button
            className="flex items-center bg-azul border rounded-md text-white text-sm font-semibold px-4 py-2 hover:bg-blue-900"
            onClick={toggleModalAgregar}
          >
            <FaPlus className="mr-2" />
            Agregar Clientes
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
            title="Importar Clientes"
            onImport={handleImport}
          />

          <button
            className="flex items-center border-2 rounded-md border-azul text-azul text-sm font-semibold px-4 py-2 hover:bg-gray-200"
            onClick={handleExportarCliente}
          >
            <FaDownload className="mr-2" />
            Exportar
          </button>

        </div>
      </div>
      <span className="block mx-5 mt-2 text-sm">
        Agregue, busque y administre a sus clientes en un solo lugar
      </span>

      <div className="flex mx-5 pt-12 pb-2 space-x-2 items-center">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="w-64"
            placeholder="Buscar clientes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="text-gray-300 mr-2 text-sm" size={20} />
        </label>
      </div>

      {/* Contador de registros */}
      <div className="block mx-5 mb-8 text-sm text-gray-500">
        <span>Clientes:</span> {clientes.length}
      </div>

      {/* Tabla reutilizable */}
      <div className="mx-5">
        {/* Muestra el estado de carga o error si es necesario */}
        {isLoading || loadingSedes || loadingAgentes ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-azul"></span>
          </div>
        ) : showAlert ? (
          <Alerts type="error" message={`Error: ${error || errorSedes || errorAgentes}`} />
        ) : (
          <Tabla
            columnas={columnas}
            datos={(clientes || []).map((cliente) => ({
              ...cliente,
              Sede: getSedeName(cliente.id_sede),
              Agente: getAgenteName(cliente.id_agente),
            }))}
            searchTerm={searchTerm}
            onEdit={handleEdit}
            onDelete={handleDeleteCliente}
          />
        )}
      </div>

      <ModalExito
        isOpen={isModalExitoOpen}
        onClose={() => setIsModalExitoOpen(false)}
        title="¡Operación Exitosa!"
        message={"El cliente se ha guardado correctamente"}
      />

      <ModalError
        isOpen={isModalErrorOpen}
        onClose={() => setIsModalErrorOpen(false)}
        title="Error"
        message="Error al agregar el cliente. Inténtalo de nuevo."
      />

      {/* Modal Agregar Cliente */}
      <ModalAgregar
        isOpen={isModalAgregarOpen || isModalEditOpen}
        onClose={handleCloseModalAgregar}
        onSubmit={async () => {
          try {
            if (usuarioAEditar) {
                await handleUpdateCliente({ id: usuarioAEditar.id, ...nuevoCliente });
            } else {
                await handleAddCliente(nuevoCliente);
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
        title={usuarioAEditar ? "Editar Cliente" : "Agregar Cliente"}
      >
        <div className="mt-6 text-sm mx-8 max-h-[60vh] overflow-y-auto">
          <label className="block mb-2 font-bold text-sm">Nombre completo</label>
          <input
            type="text"
            className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            placeholder="Ingrese su nombre completo"
            value={nuevoCliente.nombre_completo}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre_completo: e.target.value })}
            required
          />

          <label className="block mb-2 font-bold text-sm">Nombre corto</label>
          <input
            type="text"
            className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            placeholder="Ingrese su nombre corto"
            value={nuevoCliente.nombre_corto}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre_corto: e.target.value })}
            required
          />

          {/* AGENTE */}
          <label className="block mb-1 font-bold text-sm">Agente</label>
          {loadingAgentes ? (
            <p>Cargando agentes...</p>
          ) : errorSedes ? (
            <p>Error: {errorSedes}</p>
          ) : (
            <select
              className="w-full p-2 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
              value={nuevoCliente.id_usuario}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, id_usuario: e.target.value })}
              required
            >
              <option value="" disabled>Seleccionar agente</option>
              {agentes.map(agente => (
                <option key={agente.id} value={agente.id}>
                  {agente.nombre}
                </option>
              ))}
            </select>
          )}
          
          {/* SEDE */}
          <label className="block mb-1 mt-2 font-bold text-sm">Sede</label>
          {loadingSedes ? (
            <p>Cargando sedes...</p>
          ) : errorSedes ? (
            <p>Error: {errorSedes}</p>
          ) : (
            <select
              className="w-full p-2 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
              value={nuevoCliente.id_sede}
              onChange={(e) => 
                setNuevoCliente({ ...nuevoCliente, id_sede: e.target.value })
              }
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

          <label className="block mb-2 mt-2 font-bold text-sm"> Teléfono </label>
          <input
            type="text"
            className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            placeholder="222 2222222"
            value={nuevoCliente.telefono}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
            required
          />  

          <label className="block mb-2 font-bold text-sm"> Correo electrónico </label>
          <input
            type="text"
            className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            placeholder="example@dominio.com"
            value={nuevoCliente.email}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
            required
          />

          <label className="block mb-2 font-bold text-sm"> Contraseña </label>
          <input
            type="text"
            className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            value={nuevoCliente.password}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, password: e.target.value })}
            required
          />
          

          <label className="block mb-1 font-bold text-sm">Estatus</label>
          <div className="flex space-x-2">
            {/* Botón Activo */}
            <button
              type="button"
              className={`w-full p-2 rounded-md font-bold focus:outline-none transition ${nuevoCliente.estatus === '1' ? 'bg-pendienteBdg text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setNuevoCliente({ ...nuevoCliente, estatus: '1' })}
            >
              Activo
            </button>

            {/* Botón Inactivo */}
            <button
              type="button"
              className={`w-full p-2 rounded-md font-bold focus:outline-none transition ${nuevoCliente.estatus === '0' ? 'bg-abiertoBdg text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setNuevoCliente({ ...nuevoCliente, estatus: '0' })}
            >
              Inactivo
            </button>
          </div>

          <label className="block mb-2 font-bold text-sm"> Observaciones </label>
          <input
            type="text"
            className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            value={nuevoCliente.observaciones}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, observaciones: e.target.value })}
            required
          />
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
 
export default Clients;