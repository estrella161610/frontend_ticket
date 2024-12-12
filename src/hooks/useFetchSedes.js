import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSedes, addSede, updateSede, deleteSede, importarSede, exportarSede } from "../store/features/sedesSlice.js";

const useFetchSedes = () => {
  const dispatch = useDispatch();
  const { sedes, isLoading, error } = useSelector((state) => state.sedes);

  useEffect(() => {
    dispatch(fetchSedes());
  }, [dispatch]);

  //Agregar una sede
  const handleAddSede = async (nuevaSede) => {
    try {
      const result = await dispatch(addSede(nuevaSede)).unwrap();
      // Agrega la nueva sede al estado local
      dispatch(fetchSedes()); // O actualizar el estado directamente
    } catch (error) {
      console.error("Error al agregar sede:", error);
      throw error; // Lanza el error 
    }
  };

  //Actualizar una sede
  const handleUpdateSede = async (id, updatedSede) => {
    try {
      await dispatch(updateSede({ id, updatedSede })).unwrap();
      dispatch(fetchSedes()); 
    } catch (error) {
      console.error("Error al actualizar sede:", error);
      throw error; // Lanza el error
    }
  };

  //!Pendente
  //Eliminar una sede 
  const handleDeleteSede = async (id) => {
    try {
      await dispatch(deleteSede(id)).unwrap();
    } catch (error) {
      console.error("Error al eliminar sede:", error);
      throw error; // Lanza el error
    }
  };

  // IMPORTAR
const handleImportarSede = async (archivo) => {
  try {
    await dispatch(importarSede(archivo)).unwrap();
    dispatch(fetchSedes()); 
  } catch (error) {
    console.error("Error al importar Sedes:", error);
    throw error;
  }
};

// EXPORTAR
const handleExportarSede = async () => {
  try {
    await dispatch(exportarSede()).unwrap();
  } catch (error) {
    console.error("Error al exportar Sedes:", error);
    throw error;
  }
};
  return { sedes, isLoading, error, handleAddSede, handleUpdateSede, handleDeleteSede, handleImportarSede, handleExportarSede };
};
export default useFetchSedes;