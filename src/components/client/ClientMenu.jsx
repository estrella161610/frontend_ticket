//!menú CLIENTES
import { PiListDashesBold } from "react-icons/pi";
import { FaHome, FaInbox } from "react-icons/fa";
import LogoEpicore from "../../assets/img/logo_epicore.png";

import MenuSidebar from "../MenuSidebar";
import HeaderBar from "./HeaderBar";
import { Outlet } from "react-router-dom";
import ContentContainer from "../ContentContainer";

const menuItems = [
  {
    name: "Inicio",
    icon: PiListDashesBold,
    to: "/cliente",
  },
  {
    name: "Home",
    icon: FaHome,
    to: "/cliente/Home",
  },
  {
    name: "Bandeja de entrada",
    icon: FaInbox,
    to: "/cliente/bandeja",
  },
];

const ClientMenu = () => {
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

export default ClientMenu;
