import { useState } from 'react';
import TableInicio from '../../../../components/TableInicioCliente';
import TablaUbicacion from '../../../../components/client/TablaUbicacion';
import { FaUserCircle, FaTicketAlt } from 'react-icons/fa';
import ChangeContClient from '../../../../components/ChangeContClient';
import { useNavigate } from 'react-router-dom';
import useFetchTickets from '../../../../hooks/useFetchTickets';
import useFetchSedes from '../../../../hooks/useFetchSedes';
import useFetchAgentes from '../../../../hooks/useFetchAgentes';
import useFetchClientes from '../../../../hooks/useFetchClientes';
import useFetchPerfilCliente from "../../../../hooks/useFetchPerfilCliente";
import { FaEdit } from 'react-icons/fa';
import ModalEditProfileClient from '../../../../components/ModalEditProfileClient';
import ModalError from "../../../../components/ModalError";
import ModalExito from "../../../../components/ModalExito";

const PerfilCliente = () => {
  const { perfil, isLoading, error, handleUpdatePerfil } = useFetchPerfilCliente();
  const [selectedTab, setSelectedTab] = useState('tickets');
  const { ticket } = useFetchTickets();
  const { sedes } = useFetchSedes();
  const { agentes } = useFetchAgentes();
  const { clientes } = useFetchClientes();

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // Obtener el nombre
  //SEDE
  const sede = sedes.find(s => s.id === perfil?.id_sede);
  const nombreSede = sede ? sede.nombre : '-';

  //Cambiar contraseña
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  //Editar perfil
  const [isModalEditProfileOpen, setIsModalOpenEditProfile] = useState(false);
  const handleOpenModalEditProfile = () => setIsModalOpenEditProfile(true);
  const handleCloseModalEditProfile = () => setIsModalOpenEditProfile(false);

  const handleEditSubmitProfile = async (updatedData) => {
    try {
      await handleUpdatePerfil(updatedData);
      setIsModalExitoOpen(true); // Abre el modal de éxito
    } catch (error) {
      setIsModalErrorOpen(true); // Abre el modal de error
    }
  };

  //Modal exito y error
  const [isModalExitoOpen, setIsModalExitoOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);

  const navigate = useNavigate();
  const handleNuevoTicketClick = () => {
    navigate('/cliente/ticket-nuevo');
  };
  const [ticketCount, setTicketCount] = useState(0); 

  return (
    <div className="min-h-[80vh] flex bg-gray-100 overflow-hidden">
      <div className="w-2/6 p-4 overflow-y-auto border-r-2 border-gray-200">
        <div className="space-y-4">
          <div className="bg-white p-2 rounded-md space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-black text-right w-1/3">Tipo de usuario</label>
              <input
                type="text"
                className="border-none p-1 rounded text-blue-700 w-1/2 focus:outline-none text-left cursor-pointer"
                value={perfil?.roles[0]?.guard_name || ""}
                readOnly
              />
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <label className="text-black text-right w-1/3">Rol</label>
              <input
                type="text"
                className="border-none p-1 rounded text-blue-700 w-1/2 focus:outline-none text-left cursor-pointer"
                value={perfil?.roles[0]?.name || ""}
                readOnly
              />
            </div>
          </div>

          <div className="bg-white p-2 rounded-md space-y-2">

            <div className="flex justify-between items-center">
              <label className="text-black text-right w-1/3">Alias</label>
              <input
                type="text"
                className="border-none p-1 rounded text-blue-700 w-1/2 focus:outline-none text-left cursor-pointer"
                value={perfil?.alias || "-"}
                readOnly
              />
            </div>
          </div>

          <div className="bg-white p-2 rounded-md space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-black text-right w-1/3">Correo electrónico principal</label>
              <input
                type="text"
                className="border-none p-1 rounded text-blue-700 w-1/2 focus:outline-none text-left cursor-pointer"
                value={perfil?.email || ""}
                readOnly
              />
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <label className="text-black  text-right w-1/3">Telefono</label>
              <input
                type="text"
                className="border-none p-1 rounded text-blue-700 w-1/2 focus:outline-none text-left cursor-pointer"
                value={perfil?.telefono || ""}
                readOnly
              />
            </div>

            <hr />
            <div className="flex justify-between items-center">
              <label className="text-black text-right w-1/3">Sede</label>
              <input
                type="text"
                className="border-none p-1 rounded text-blue-700 w-1/2 focus:outline-none text-left cursor-pointer"
                value={nombreSede || ""}
                readOnly
              />
            </div>
          </div>
        </div>
        {/* Botón Editar */}
        <div className="flex justify-end space-x-3 my-2 text-sm">
          <button
            className="text-azul hover:text-blue-800"
            onClick={handleOpenModalEditProfile}
          >
            <FaEdit size={18} />
          </button>
        </div>
      </div>

      <div className="flex w-4/6 p-4 bg-white border-r-2 border-gray-200">
        <div className="p-4 rounded-md text-eight w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative ">
                <FaUserCircle size={100} className="text-gray-300" />
              </div>
              <div className="ml-2">
                <h2 className="font-bold text-xl ml-4">
                  {isLoading ? "Cargando..." : error ? "Error al cargar" : perfil?.nombre_completo || "Nombre no disponible"}
                </h2>
                <h2 className=" text-sm  ml-4">
                  {isLoading ? "Cargando..." : error ? "Error al cargar" : perfil?.nombre_corto || "Nombre no disponible"}
                </h2>
              </div>
            </div>
            <button className="flex items-center border-2 rounded-md border-azul text-azul text-sm font-semibold px-4 py-2 hover:bg-gray-50"
              onClick={handleNuevoTicketClick}>
              <FaTicketAlt className="mr-2" /> Nuevo ticket
            </button>
          </div>

          <div className="flex space-x-2 mt-6">
            <button
              className={`text-lg ${selectedTab === 'tickets' ? 'font-bold text-gray-800' : 'text-gray-400'}`}
              onClick={() => handleTabChange('tickets')}
            >
              Tickets ({ticketCount})  {/* Use the ticket count */}
            </button>
            <button
              className={`text-lg ${selectedTab === 'configuracion' ? 'font-bold text-gray-800' : 'text-gray-400'}`}
              onClick={() => handleTabChange('configuracion')}
            >
              Configuración de seguridad
            </button>
          </div>
          <hr />

          {selectedTab === 'tickets' ? (
            <TableInicio tickets={ticket} sedes={sedes} agentes={agentes} clientes={clientes} setTicketCount={setTicketCount}/>
          ) : (
            <div>
              <h3 className="font-bold text-left my-4">Configuración</h3>
              <div className="flex justify-between items-center mt-2">
                <label>Contraseña</label>
                <span>••••••••</span>
                <div>
                  <button className="text-blue-700 ml-2" onClick={handleOpenModal}>Cambiar</button>
                </div>
              </div>
              <hr className="my-4" />
              <h4 className="font-bold text-left">Mis dispositivos</h4>
              <p className="text-sm text-left text-gray-600">Todos los equipos y navegadores que tienen acceso a su cuenta se encuentran aquí.</p>
              <TablaUbicacion />
            </div>
          )}
        </div>
      </div>
      <ChangeContClient isOpen={isModalOpen} onClose={handleCloseModal} />

      <ModalExito
        isOpen={isModalExitoOpen}
        onClose={() => setIsModalExitoOpen(false)}
        title="¡Operación Exitosa!"
        message={"Los cambios se han guardado correctamente."}
      />

      <ModalError
        isOpen={isModalErrorOpen}
        onClose={() => setIsModalErrorOpen(false)}
        title="Error"
        message="Error al guardar los cambios. Intente nuevamente."
      />

      <ModalEditProfileClient
        perfil={perfil}
        isOpen={isModalEditProfileOpen}
        onClose={handleCloseModalEditProfile}
        onSubmit={handleEditSubmitProfile} />
    </div>
  );
};

export default PerfilCliente;