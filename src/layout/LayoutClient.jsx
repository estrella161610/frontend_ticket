import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import ClientMenu from "../components/client/ClientMenu";

export const LayoutClient = () => {
  const { status } = useSelector((state) => state.auth);

  if (status !== "authenticated") return <Navigate to={"/"} />;

  return (
    <div className="h-screen flex flex-col">
      {/* Renderiza el menú admin completo */}
      <ClientMenu />
      
      {/* Contenido que se renderiza dinámicamente
      <div className="flex-grow flex flex-col">
        <div className="overflow-auto flex-grow p-6">
          <Outlet />
        </div>
      </div> */}
    </div>
  );
};
