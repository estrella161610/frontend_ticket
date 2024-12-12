import {
  FaHome,
  FaInbox,
  FaUserFriends,
  FaBuilding,
  FaUserCheck,
} from "react-icons/fa";
import { MdGroups2, MdAdminPanelSettings } from "react-icons/md";
import { GiOrganigram } from "react-icons/gi";
import { PiListDashesBold } from "react-icons/pi";
import LogoEpicore from "../../assets/img/logo_epicore.png";

import MenuSidebar from "../MenuSidebar";
import HeaderBar from "./HeaderBar";
import { Outlet } from "react-router-dom";
import ContentContainer from "../ContentContainer";
import AppContent from '../AppContent';

const AdminMenu = () => {
  const menuItems = [
    {
      name: "Inicio",
      icon: PiListDashesBold,
      to: "/admin",
    },
    {
      name: "Home",
      icon: FaHome,
      to: "/admin/home",
    },
    {
      name: "Bandeja de entrada",
      icon: FaInbox,
      to: "/admin/bandeja",
    },
    {
      name: "Clientes",
      icon: FaUserFriends,
      to: "/admin/clientes",
    },
    {
      name: "Departamentos",
      icon: GiOrganigram,
      to: "/admin/departamentos",
    },
    {
      name: "Grupos",
      icon: MdGroups2,
      to: "/admin/grupos",
    },
    {
      name: "Usuarios",
      icon: FaUserCheck,
      to: "/admin/usuarios",
    },
    {
      name: "Sedes",
      icon: FaBuilding,
      to: "/admin/sedes",
    },
    {
      name: "Panel de administración",
      icon: MdAdminPanelSettings,
      to: "/admin/panel",
    },
  ];

  return (
    <div>
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b border-gray-200 flex items-center">
          <img src={LogoEpicore} alt="Epicore Logo" className="w-20 ml-0" />
        </div>

        <div className="flex flex-grow">
          <MenuSidebar items={menuItems} />
          <div className="flex-grow flex flex-col">
            <HeaderBar />
            <div className="overflow-auto flex-grow">
              <ContentContainer>
                <Outlet />
              </ContentContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
