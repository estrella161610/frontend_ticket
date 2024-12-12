//!menú AGENTES
import { FaHome, FaInbox, FaUserFriends } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { GiOrganigram } from "react-icons/gi";
import { PiListDashesBold } from "react-icons/pi";
import LogoEpicore from "../../assets/img/logo_epicore.png";

import MenuSidebar from "../MenuSidebar";
import HeaderBar from "./HeaderBar";
import { Outlet } from "react-router-dom";
import ContentContainer from "../ContentContainer";

const AgentMenu = () => {
  const menuItems = [
    {
      name: "Inicio",
      icon: PiListDashesBold,
      to: "/agente",
    },
    {
      name: "Home",
      icon: FaHome,
      to: "/agente/home",
    },
    {
      name: "Bandeja de entrada",
      icon: FaInbox,
      to: "/agente/bandeja",
    },
    {
      name: "Clientes",
      icon: FaUserFriends,
      to: "/agente/clientes",
    },
    {
      name: "Departamentos",
      icon: GiOrganigram,
      to: "/agente/departamentos",
    },
    {
      name: "Grupos",
      icon: MdGroups2,
      to: "/agente/grupos",
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

export default AgentMenu;
