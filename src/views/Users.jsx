import { useEffect, useState } from "react";
import { FaPlus, FaUpload, FaDownload } from "react-icons/fa";
import { FiSearch, FiUpload, FiDownload } from "react-icons/fi";
import { useDispatch } from "react-redux";

import Tabla from "../components/Tabla";
import ModalImportar from "../components/ModalImportar";
import ModalAgregar from "../components/ModalAgregar";
import ModalAlerta from "../components/ModalAlerta";
import { openModal } from "../store/features/modalAlertaSlice";
import ModalError from "../components/ModalError";
import ModalExito from "../components/ModalExito";
import Alerts from '../components/Alerts';

import useFetchSedes from "../hooks/useFetchSedes";
import useFetchDepartamentos from "../hooks/useFetchDepartamentos";
import useFetchGrupos from "../hooks/useFetchGrupos";
import useFetchAgentes from "../hooks/useFetchAgentes";

const Users = () => {
  const columnas = ["Nombre", "Departamento", "Sede", "Estatus" ,"Grupo", "Email", "Acciones"];

  const { sedes, isLoading: loadingSedes, error: errorSedes } = useFetchSedes();
  const { departamentos, isLoading: loadingDptos, error: errorDptos } = useFetchDepartamentos();
  const { grupos, isLoading: loadingGrupos, error: errorGrupos } = useFetchGrupos();
  const { agentes, isLoading, error, handleAddAgente, handleUpdateAgente, handleDeleteAgente, handleImportarAgente, handleExportarAgente } = useFetchAgentes();

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

  const [isModalExitoOpen, setIsModalExitoOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);

  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleModalAgregar = () => setIsModalAgregarOpen((prev) => !prev);
  const handleCloseModalAgregar = () => {
    dispatch(openModal());
  };

  const [nuevoAgente, setNuevoAgente] = useState({
    nombre: "",
    id_departamento: "",
    estatus: "",
    id_sede: "",
    id_grupo: "",
    email: "",
    password: "",
    telefono: "",
  });

  const handleConfirmCloseAgregar = () => {
    setIsModalAgregarOpen(false);
    setNuevoAgente({
      nombre: "",
      id_departamento: "",
      estatus: "",
      id_sede: "",
      id_grupo: "",
      email: "",
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

  const handleEdit = (agente) => {
    setUsuarioAEditar(agente);
    setNuevoAgente({
      nombre: agente.nombre,
      id_sede: agente.sede,
      id_departamento: agente.departamento,
      id_grupo: agente.grupo,
      email: agente.email,
      password: agente.password,
      telefono: agente.telefono,
      estatus: agente.estatus,
    });
    setIsModalAgregarOpen(true);
  };

  //Función para obtener el nombre de...
  //SEDE
  const getSedeName = (id_sede) => {
    const sede = sedes.find((s) => s.id === parseInt(id_sede));
    return sede ? sede.nombre : "Sede no encontrada";
  };

  //DEPARTAMENTO
  const getDptoName = (id_departamento) => {
    const departamento = departamentos.find(
      (s) => s.id === parseInt(id_departamento)
    );
    return departamento ? departamento.nombre : "Departamento no encontrado";
  };

  //GRUPO
  const getGrupoName = (id_grupo) => {
    const grupo = grupos.find((s) => s.id === parseInt(id_grupo));
    return grupo ? grupo.nombre : "Grupo no encontrado";
  };

  const handleImport = async (file) => {
    try {
      await handleImportarAgente(file);
      alert("Archivo importado exitosamente.");
    } catch (error) {
      console.error("Error al importar archivo:", error);
      alert("Error al importar archivo.");
      
    }
  };

  return (
    <div className="pt-4 px-8">
      <div className="flex justify-between items-center mx-5 mt-5">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <div className="flex space-x-3">
          <button
            className="flex items-center bg-azul border rounded-md text-white text-sm font-semibold px-4 py-2 hover:bg-blue-900"
            onClick={toggleModalAgregar}
          >
            <FaPlus className="mr-2" />
            Agregar usuario
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
            title="Importar Agentes"
            onImport={handleImport}
          />

          <button
            className="flex items-center border-2 rounded-md border-azul text-azul text-sm font-semibold px-4 py-2 hover:bg-gray-200"
            onClick={handleExportarAgente}
          >
            <FaDownload className="mr-2" />
            Exportar
          </button>

        </div>
      </div>
      <span className="block mx-5 mt-2 text-sm">
        Organice a los integrantes del equipo en función de su rol o
        departamento para proporcionar un soporte más específico.
      </span>

      {/* BUSCADOR */}
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

      {/* CONTADOR */}
      <div className="block mx-5 mb-8 text-sm text-gray-500">
        <span>Usuarios:</span> {agentes.length}
      </div>

      <div className="mx-5">
        {/* Muestra el estado de carga o error si es necesario */}
        {isLoading || loadingSedes || loadingDptos || loadingGrupos ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-azul"></span>
          </div>
        ) : showAlert ? (
          <Alerts type="error" message={`Error: ${error || errorSedes || errorDptos || errorGrupos}`} />
        ) : (
          <Tabla
            columnas={columnas}
            datos={(agentes || []).map((agente) => ({
              ...agente,
              Sede: getSedeName(agente.id_sede),
              Departamento: getDptoName(agente.id_departamento),
              Grupo: getGrupoName(agente.id_grupo),
            }))}
            onEdit={handleEdit}
            onDelete={handleDeleteAgente}
            searchTerm={searchTerm}
          />
        )}
      </div>


      <ModalExito
        isOpen={isModalExitoOpen}
        onClose={() => setIsModalExitoOpen(false)}
        title="¡Operación Exitosa!"
        message={"El usuario se ha guardado correctamente"}
      />

      <ModalError
        isOpen={isModalErrorOpen}
        onClose={() => setIsModalErrorOpen(false)}
        title="Error"
        message="Error al agregar el usuario. Inténtalo de nuevo."
      />

      <ModalAgregar
        isOpen={isModalAgregarOpen || isModalEditOpen}
        onClose={handleCloseModalAgregar}
        onSubmit={async () => {
          try {
            if (usuarioAEditar) {
                await handleUpdateAgente({
                    id: usuarioAEditar.id,
                    ...nuevoAgente,
                });
            } else {
                await handleAddAgente(nuevoAgente);
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
        title={usuarioAEditar ? "Editar Usuario" : "Agregar Usuario"}
      >
        <div className="mt-4 text-sm mx-8 max-h-[60vh] overflow-y-auto">
          <label className="block mb-2 font-bold text-sm">Nombre</label>
          <input
            type="text"
            className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            placeholder="Ingrese el nombre de usuario"
            value={nuevoAgente.nombre}
            onChange={(e) =>
              setNuevoAgente({ ...nuevoAgente, nombre: e.target.value })
            }
            required
          />

          

          <label className="block mb-2 font-bold text-sm">Correo electrónico</label>
          <input
            type="text"
            className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            placeholder="example@epicore.com.mx"
            value={nuevoAgente.email}
            onChange={(e) =>
              setNuevoAgente({ ...nuevoAgente, email: e.target.value })
            }
          />

          {/* Observaciones: Si poner la contraseña aquí??? */}
          <label className="block mb-2 font-bold text-sm"> Contraseña </label>
          <input
            type="text"
            className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            value={nuevoAgente.password}
            onChange={(e) =>
              setNuevoAgente({ ...nuevoAgente, password: e.target.value })
            }
          />

          <label className="block mb-2 font-bold text-sm">Teléfono</label>
          <input
            type="tel"
            className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
            placeholder="(222) 222 2222"
            value={nuevoAgente.telefono}
            onChange={(e) =>
              setNuevoAgente({ ...nuevoAgente, telefono: e.target.value })
            }
          />

          <label className="block mb-1 font-bold text-sm">Estatus</label>
          <div className="flex space-x-2">
            {/* Botón Activo */}
            <button
              type="button"
              className={`w-full p-2 rounded-md font-bold focus:outline-none transition ${nuevoAgente.estatus === '1' ? 'bg-pendienteBdg text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setNuevoAgente({ ...nuevoAgente, estatus: '1' })}
            >
              Activo
            </button>

            {/* Botón Inactivo */}
            <button
              type="button"
              className={`w-full p-2 rounded-md font-bold focus:outline-none transition ${nuevoAgente.estatus === '0' ? 'bg-abiertoBdg text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setNuevoAgente({ ...nuevoAgente, estatus: '0' })}
            >
              Inactivo
            </button>
          </div>

          {/* SEDE */}
          <label className="block mb-1 font-bold text-sm">Sede</label>
          {loadingSedes ? (
            <p>Cargando sedes...</p>
          ) : errorSedes ? (
            <p>Error: {errorSedes}</p>
          ) : (
            <select
              className="w-full p-2 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
              value={nuevoAgente.id_sede}
              onChange={(e) => setNuevoAgente({ ...nuevoAgente, id_sede: e.target.value })}
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
       
          {/* DEPARTAMENTO */}
          <label className="block my-2 font-bold text-sm">Departamento</label>
          {loadingDptos ? (
            <p>Cargando departamentos...</p>
          ) : errorDptos ? (
            <p>Error: {errorDptos}</p>
          ) : (
            <select
              className="w-full p-2 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
              value={nuevoAgente.id_departamento}
              onChange={(e) =>
                setNuevoAgente({
                  ...nuevoAgente,
                  id_departamento: e.target.value,
                })
              }
              required
            >
              <option value="" disabled>
                Seleccionar departamento
              </option>
              {departamentos.map((departamento) => (
                <option key={departamento.id} value={departamento.id}>
                  {departamento.nombre}
                </option>
              ))}
            </select>
          )}

          {/* GRUPOS */}
          <label className="block my-2 font-bold text-sm">Grupos</label>
          {loadingGrupos ? (
            <p>Cargando grupos...</p>
          ) : errorGrupos ? (
            <p>Error: {errorGrupos}</p>
          ) : (
            <select
              className="w-full p-2 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
              value={nuevoAgente.id_grupo}
              onChange={(e) =>
                setNuevoAgente({ ...nuevoAgente, id_grupo: e.target.value })
              }
              required
            >
              <option value="" disabled>
                Seleccionar grupo
              </option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </option>
              ))}
            </select>
          )}

          {/* ROL - NO SE PONE PORQUE ES UN DATO QUE NO RECIBE EL BACKEND */}
          {/* <label className="block mb-2 font-bold text-sm">Rol</label>
          <select className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700">
            <option disabled selected>
              Seleccione...
            </option>
            <option>Gerente</option>
            <option>Líder</option>
            <option>Colaborador</option>
          </select> */}
        </div>
      </ModalAgregar>

      <ModalAlerta
        message={
          isModalEditOpen
            ? "¿Desea cancelar y cerrar el modal de editar?"
            : "¿Desea cancelar y cerrar el modal de agregar?"
        }
        onConfirm={
          isModalEditOpen ? handleConfirmCloseEditar : handleConfirmCloseAgregar
        }
        onCancel={() => {
          dispatch(openModal());
        }}
      />
    </div>
  );
};

export default Users;
