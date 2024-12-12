import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPerfilAdmin, updatePerfilAdmin } from "../store/features/perfilAdminSlice";

const useFetchPerfilAdmin = () => {
  const dispatch = useDispatch();
  const { perfil, isLoading, error } = useSelector((state) => state.perfilAdmin);

  useEffect(() => {
    dispatch(fetchPerfilAdmin());
  }, [dispatch]);

  // Actualizar perfil
  const handleUpdatePerfil = async (updatedData) => {
    try {
      await dispatch(updatePerfilAdmin(updatedData)).unwrap();
    } catch (error) {
      console.error("Error al actualizar el perfil de administrador:", error);
      throw error; // Lanza el error si es necesario
    }
  };

  return { perfil, isLoading, error, handleUpdatePerfil };
};

export default useFetchPerfilAdmin;
