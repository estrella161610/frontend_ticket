import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import AdminMenu from "../components/admin/AdminMenu";

export const LayoutAdmin = () => {
  const { status } = useSelector((state) => state.auth);

  if (status !== "authenticated") return <Navigate to={"/"} />;

  return (
    <div className="h-screen flex flex-col">
      {/* Renderiza el menú admin completo */}
      <AdminMenu />
      
      {/* Contenido que se renderiza dinámicamente
      <div className="flex-grow flex flex-col">
        <div className="overflow-auto flex-grow p-6">
          <Outlet />
        </div>
      </div> */}
    </div>
  );
};
