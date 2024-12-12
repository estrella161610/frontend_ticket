import { Route, Routes } from "react-router-dom";
import { useAuthStore } from "../hooks";
import { useEffect } from "react";

//Paginas
import { LoginAdmin } from "../views/modules/admin/auth/LoginAdmin";
import { LoginAgent } from "../views/modules/agent/auth/LoginAgent";
import LoginClients from "../views/modules/client/auth/LoginClients";

import { PasswordRecovery } from "../views/PasswordRecovery";
import { PaginaDefault } from "../views/PaginaDefault";
import LoadingPage from '../components/LoadingPage';
import UserSelection from '../components/UserSelection';

import Perfil from '../views/Perfil/Perfil'; 
import TicketNuevo from "../views/TicketNuevo";
import AbrirTicket from '../views/AbrirTicket.jsx';
import AbrirTicketAgent from "../views/modules/agent/components/AbrirTicketAgent.jsx";
import AbrirTicketCliente from "../views/modules/client/components/AbrirTicketCliente.jsx";
import Inicio from "../views/Inicio/Inicio";
import InicioCliente from "../views/modules/client/Inicio/InicioCliente";
import InicioAgent from "../views/modules/agent/Inicio/InicioAgente";
import BandejaDeEntrada from "../views/Bandeja Entrada/BandejaDeEntrada";
import BandejaDeEntradaCliente from "../views/modules/client/Bandeja Entrada/BandejaDeEntradaCliente";
import BandejaDeEntradaAgente from "../views/modules/agent/Bandeja Entrada/BandejaDeEntradaAgent";
import Home from "../views/Home";
import Clients from "../views/Clients";
import Departaments from "../views/Departaments";
import Groups from "../views/Groups";
import Users from "../views/Users";
import Sedes from "../views/Sedes";
import PanelAdmin from "../views/PanelAdmin";
import Recuperar from "../views/Recuperar.jsx";
import PerfilAgente from "../views/modules/agent/components/PerfilAgente";
import PerfilCliente from "../views/modules/client/components/PerfilCliente";
import HomeCliente from "../views/modules/client/components/HomeCliente";
import ClientsAgent from "../views/modules/agent/components/ClientsAgent";
import GroupsAgent from "../views/modules/agent/components/GroupsAgent";
import DepartamentsAgent from "../views/modules/agent/components/DepartamentsAgent";
import TicketNuevoAgente from "../views/modules/agent/components/TicketNuevoAgente.jsx";
import TicketNuevoCliente from "../views/modules/client/components/TicketNuevoCliente";
import HomeAgente from "../views/modules/agent/components/HomeAgente";


import { LayoutAdmin, LayoutAgent, LayoutClient } from "../layout";


export const AppRouter = () => {

  // checkAuthTokenAdmin, checkAuthTokenAgente, checkAuthTokenCliente
  const { status, checkAuthToken } = useAuthStore();
  // Revisamos si existe un token de acceso
    useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") return <LoadingPage />;

  return (
    <Routes>
      <Route path="/" element={<UserSelection />} />

      {/* Ruta de Login */}
      <Route path="login-admin" element={<LoginAdmin />} />
      <Route path="login-agente" element={<LoginAgent />} />
      <Route path="login-cliente" element={<LoginClients />} />
      
      {/* Rutas específicas para el administrador */}
      <Route path="/admin/*" element={<LayoutAdmin />}>
        <Route index element={<Inicio />} />
        <Route path="home" element={<Home />} />
        <Route path="bandeja" element={<BandejaDeEntrada />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="departamentos" element={<Departaments />} />
        <Route path="grupos" element={<Groups />} />
        <Route path="usuarios" element={<Users />} />
        <Route path="sedes" element={<Sedes />} />
        <Route path="panel" element={<PanelAdmin />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="ticket-nuevo" element={<TicketNuevo />} />
        <Route path="abrir-ticket/:id" element={<AbrirTicket />} />  {/* abrir ticket */}
      </Route>

      {/* Rutas específicas para el agente */}
      <Route path="/agente/*" element={<LayoutAgent />} >
        <Route index element={<InicioAgent />} />
        <Route path="home" element={<HomeAgente />} />
        <Route path="bandeja" element={<BandejaDeEntradaAgente />} />
        <Route path="clientes" element={<ClientsAgent />} />
        <Route path="departamentos" element={<DepartamentsAgent/>} />
        <Route path="grupos" element={<GroupsAgent />} />
        <Route path="perfil-agente" element={<PerfilAgente />} />
        <Route path="ticket-nuevo" element={<TicketNuevoAgente />} />
        <Route path="abrir-ticket/:id" element={<AbrirTicketAgent />} /> 
      </Route>
      

      {/* Rutas específicas para el cliente */}
      <Route path="/cliente/*" element={<LayoutClient />} >
        <Route index element={<InicioCliente  />} />
        <Route path="home" element={<HomeCliente />} />
        <Route path="bandeja" element={<BandejaDeEntradaCliente />} />
        <Route path="perfil-cliente" element={<PerfilCliente />} />
        <Route path="ticket-nuevo" element={<TicketNuevoCliente />} />
        <Route path="abrir-ticket/:id" element={<AbrirTicketCliente />} />  {/* abrir ticket */}
      </Route>

      {/* Otras rutas */}
      <Route path="/ticket" element={<TicketNuevo />} />

      {/* Rutas para recuperación de contraseña */}
      <Route path="/recuperar-contrasena" element={<PasswordRecovery />} />
      <Route path="/cambiar-contrasena" element={<Recuperar/>} />

      {/* Rutas por defecto para errores o rutas no encontradas */}
      <Route path="*" element={<PaginaDefault />} />
    </Routes>
  );
};