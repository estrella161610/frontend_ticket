import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import AgentMenu from "../components/agent/AgentMenu";

export const LayoutAgent = () => {
  const { status } = useSelector((state) => state.auth);

  if (status !== "authenticated") return <Navigate to={"/"} />;

  return (
    <div className="h-screen flex flex-col">
      {/* Renderiza el menú admin completo */}
      <AgentMenu />
      
      {/* Contenido que se renderiza dinámicamente
      <div className="flex-grow flex flex-col">
        <div className="overflow-auto flex-grow p-6">
          <Outlet />
        </div>
      </div> */}
    </div>
  );
};
