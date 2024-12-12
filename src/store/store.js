import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./";  
import selectionSlice from "./features/selectionSlice";  
import modalAlertaSlice from "./features/modalAlertaSlice"; 
import contentSlice from "./features/contentSlice";
import viewSlice from "./features/viewSlice";
import headerBarReducer from './features/headerBarSlice';
import departamentosReducer from "./features/departamentosSlice";
import sedesReducer from './features/sedesSlice';
import gruposReducer from './features/gruposSlice';
import agentesReducer from './features/agentesSlice';
import clientesReducer from './features/clientesSlice';
import { adminReducer } from "./features/adminSlice";
import ticketsReducer from "./features/ticketsSlice";
import searchReducer from './features/searchSlice';
import statsReducer from './features/statsSlice';
import botonesInicioReducer from "./features/BotonesInicioSlice";
import bandejaReducer from './features/bandejaSlice';
import notificationsReducer from './features/notificationsSlice';
import perfilAdminReducer from './features/perfilAdminSlice';
import perfilAgenteReducer from "./features/perfilAgenteSlice";
import perfilClienteReducer from "./features/perfilClienteSlice";
import mensajeChatReducer from "./features/mensajesSlice";
import chgPassAdminReducer from "./features/chgPassAdminSlice";
import chgPassAgentReducer from "./features/chgPassAgentSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    selection: selectionSlice,
    headerBar: headerBarReducer,
    view: viewSlice,
    content: contentSlice,
    departamentos: departamentosReducer,
    sedes: sedesReducer,
    modalAlerta: modalAlertaSlice,
    grupos: gruposReducer,
    agentes: agentesReducer,
    clientes: clientesReducer,
    admin: adminReducer,
    tickets: ticketsReducer,
    search: searchReducer,
    stats: statsReducer,
    botonesInicio: botonesInicioReducer,
    bandeja: bandejaReducer,
    notifications: notificationsReducer,
    perfilAdmin: perfilAdminReducer,
    perfilCliente: perfilClienteReducer,
    perfilAgente: perfilAgenteReducer,
    mensajes: mensajeChatReducer,
    password: chgPassAdminReducer, //recuperar contraseña en Perfil Admin
    passwordAgent:chgPassAgentReducer, //recuperar contraseña en Perfil Agente
  },
});