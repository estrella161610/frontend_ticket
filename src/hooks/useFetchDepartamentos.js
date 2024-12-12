import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartamentos, addDepartamento, updateDepartamento, deleteDepartamento,importarDepartamentos, exportarDepartamentos } from "../store/features/departamentosSlice.js";

const useFetchDepartamentos = () => {
  const dispatch = useDispatch();
  const { departamentos, isLoading, error } = useSelector((state) => state.departamentos);

  useEffect(() => {
    dispatch(fetchDepartamentos());
  }, [dispatch]);

  //AGREGAR
  const handleAddDepartamento = async (nuevoDepartamento) => {
    try {
      await dispatch(addDepartamento(nuevoDepartamento)).unwrap();
      dispatch(fetchDepartamentos());
    } catch (error) {
      console.error("Error al agregar departamento:", error);
      throw error;
    }
  };

  //MODIFICAR
  const handleUpdateDepartamento = async (updatedData) => { 
    const { id, ...data } = updatedData; // Asegúrate de que solo pasas el ID y los datos a actualizar
    try { 
        await dispatch(updateDepartamento({ id, updatedData: data })).unwrap(); 
        dispatch(fetchDepartamentos()); 
    } catch (error) { 
        console.error("Error al actualizar departamento:", error); 
        throw error;
    } 
};

   //ELIMINAR
   const handleDeleteDepartamento = async (id) => {
    try {
      await dispatch(deleteDepartamento(id)).unwrap();
    } catch (error) {
      console.error("Error al eliminar departamento:", error);
      throw error; // Lanza el error
    }
  };

   // IMPORTAR
   const handleImportarDepartamentos = async (archivo) => {
    try {
      await dispatch(importarDepartamentos(archivo)).unwrap();
      dispatch(fetchDepartamentos()); // Actualizar departamentos después de importar
    } catch (error) {
      console.error("Error al importar departamentos:", error);
      throw error;
    }
  };


  // EXPORTAR
  const handleExportarDepartamentos = async () => {
    try {
      await dispatch(exportarDepartamentos()).unwrap();
    } catch (error) {
      console.error("Error al exportar departamentos:", error);
      throw error;
    }
  };

  return { departamentos, isLoading, error, handleAddDepartamento, handleUpdateDepartamento, handleDeleteDepartamento, handleImportarDepartamentos, handleExportarDepartamentos,};
};

export default useFetchDepartamentos;