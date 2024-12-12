// src/App.jsx o donde renderices el contenido principal 
import React from 'react'; 
import { useSelector } from 'react-redux'; 
import TicketNuevo from '../views/TicketNuevo'; 
import Users from '../views/Users'; 
import Sedes from '../views/Sedes'; 
import Departaments from '../views/Departaments'; 
import Groups from '../views/Groups'; 

const AppContent = () => { 
    const activeModal = useSelector((state) => state.headerBar.activeModal); 
 
    const renderContent = () => { 
        switch (activeModal) { 
            case 'ticket': 
                return <TicketNuevo />; 
            case 'usuario': 
                return <Users />; 
            case 'sedes': 
                return <Sedes />; 
            case 'departamento': 
                return <Departaments />; 
            case 'grupo': 
                return <Groups />; 
            default: 
                return null; // O retorna la vista actual 
        } 
    }; 
 
    return <div className="content-area">{renderContent()}</div>; 
}; 
 
export default AppContent;