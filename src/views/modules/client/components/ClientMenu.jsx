//!menú CLIENTES
import { FaUserFriends } from 'react-icons/fa'; 
import { PiListDashesBold } from 'react-icons/pi'; 
import LogoEpicore from '../../../../assets/img/logo_epicore.png';

import { useSelector } from 'react-redux'; 
import MenuSidebar from '../../../../components/MenuSidebar';
import HeaderBar from '../../../../components/HeaderBar';

// Importa vistas 
//TODO: Cambiar la dirección de cada vista (si se requiere jsjs)
import Inicio from '../../../Inicio/Inicio';
import Clients from '../../../Clients';

const ClientMenu = () => {
    const selectedIndex = useSelector((state) => state.selection.selectedItem); 
 
    const menuItems = [ 
      { icon: PiListDashesBold, label: 'Inicio' },  
      { icon: FaUserFriends, label: 'Clientes' },
    ]; 
   
    const renderContent = () => { 
      switch (selectedIndex) { 
        case 0: 
          return <Inicio />; 
        case 1: 
          return <Clients />; 
        default: 
          return <div className="p-4">Seleccione un ítem del menú.</div>; 
      } 
    }; 
  
    return ( 
      <div className="h-screen flex flex-col"> 
        <div className="bg-white border-b border-gray-200 flex items-center"> 
          <img src={LogoEpicore} alt="Epicore Logo" className="w-20 ml-0" /> 
        </div> 
   
        <div className="flex flex-grow"> 
          <MenuSidebar items={menuItems} /> 
   
          <div className="flex-grow flex flex-col"> 
            <HeaderBar /> 
            <div> 
              {renderContent()} 
            </div> 
          </div> 
        </div> 
      </div> 
    ); 
  };


export default ClientMenu