import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgentes,
  addAgente,
  updateAgentes,
  deleteAgente,
  importarAgente, 
  exportarAgente
} from "../store/features/agentesSlice.js";

const useFetchAgentes = () => {
  const dispatch = useDispatch();
  const { agentes, isLoading, error } = useSelector((state) => state.agentes);

  useEffect(() => {
    dispatch(fetchAgentes());
  }, [dispatch]);

  //AGREGAR
  const handleAddAgente = async (nuevoAgente) => {
    try {
      await dispatch(addAgente(nuevoAgente)).unwrap();
      dispatch(fetchAgentes());
    } catch (error) {
      console.error("Error al agregar agente:", error);
      throw error;
    }
  };

  //MODIFICAR
  const handleUpdateAgente = async (updateData) => {
    const { id, ...data } = updateData;
    try {
      await dispatch(updateAgentes({ id, updateData: data })).unwrap();
      dispatch(fetchAgentes());
    } catch (error) {
      console.error("Error al actualizar agente:", error);
      throw error;
    }
  };

  //ELIMINAR
  const handleDeleteAgente = async (id) => {
    try {
      await dispatch(deleteAgente(id)).unwrap();
    } catch (error) {
      console.error("Error al eliminar agente:", error);
      throw error; // Lanza el error
    }
  };


   // IMPORTAR
   const handleImportarAgente = async (archivo) => {
    try {
      await dispatch(importarAgente(archivo)).unwrap();
      dispatch(fetchAgentes()); 
    } catch (error) {
      console.error("Error al importar Agentes:", error);
      throw error;
    }
  };


  // EXPORTAR
  const handleExportarAgente = async () => {
    try {
      await dispatch(exportarAgente()).unwrap();
    } catch (error) {
      console.error("Error al exportar Agentes:", error);
      throw error;
    }
  };
  return {
    agentes,
    isLoading,
    error,
    handleAddAgente,
    handleUpdateAgente,
    handleDeleteAgente,
    handleImportarAgente, 
    handleExportarAgente
  };
};

export default useFetchAgentes;
