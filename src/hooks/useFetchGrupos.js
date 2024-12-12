import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGrupos, addGrupo, updateGrupo, deleteGrupo, importarGrupo, exportarGrupo } from "../store/features/gruposSlice.js";

const useFetchGrupos = () => {
  const dispatch = useDispatch();
  const { grupos, isLoading, error } = useSelector((state) => state.grupos);

  useEffect(() => {
    dispatch(fetchGrupos());
  }, [dispatch]);

  // Agregar grupo
  const handleAddGrupo = async (nuevoGrupo) => {
    try {
      await dispatch(addGrupo(nuevoGrupo)).unwrap();
      dispatch(fetchGrupos());
    } catch (error) {
      console.error("Error al agregar grupo:", error);
      throw error; // Lanza el error si es necesario
    }
  };

  // Modificar grupo
  const handleUpdateGrupo = async (updatedData) => {
    const { id, ...data } = updatedData; // Asegúrate de que solo pasas el ID y los datos a actualizar
    try {
      await dispatch(updateGrupo({ id, updatedData: data })).unwrap();
      dispatch(fetchGrupos());
    } catch (error) {
      console.error("Error al actualizar grupo:", error);
      throw error; // Lanza el error si es necesario
    }
  };

  // Eliminar grupo
  const handleDeleteGrupo = async (id) => {
    try {
      await dispatch(deleteGrupo(id)).unwrap();
    } catch (error) {
      console.error("Error al eliminar grupo:", error);
      throw error; // Lanza el error si es necesario
    }
  };
  
  // IMPORTAR
  const handleImportarGrupo = async (archivo) => {
    try {
      await dispatch(importarGrupo(archivo)).unwrap();
      dispatch(fetchGrupos()); 
    } catch (error) {
      console.error("Error al importar grupos:", error);
      throw error;
    }
  };


  // EXPORTAR
  const handleExportarGrupo = async () => {
    try {
      await dispatch(exportarGrupo()).unwrap();
    } catch (error) {
      console.error("Error al exportar grupos:", error);
      throw error;
    }
  };

  return { grupos, isLoading, error, handleAddGrupo, handleUpdateGrupo, handleDeleteGrupo, handleImportarGrupo, handleExportarGrupo };
};

export default useFetchGrupos;