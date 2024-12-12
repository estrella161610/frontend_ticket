import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientes, addCliente, updateCliente, deleteCliente, importarCliente, exportarCliente } from "../store/features/clientesSlice.js";

const useFetchClientes = () => {
    const dispatch = useDispatch();
    const { clientes, isLoading, error } = useSelector((state) => state.clientes);

    useEffect(() => {
        dispatch(fetchClientes());
    }, [dispatch]);

    // Agregar cliente
    const handleAddCliente = async (nuevoCliente) => {
        try {
            await dispatch(addCliente(nuevoCliente)).unwrap();
            dispatch(fetchClientes());
        } catch (error) {
            console.error("Error al agregar cliente:", error);
            throw error; // Lanza el error si es necesario
        }
    };

    // Modificar cliente
    const handleUpdateCliente = async (updatedData) => {
        const { id, ...data } = updatedData; // Asegúrate de que solo pasas el ID y los datos a actualizar
        try {
            await dispatch(updateCliente({ id, updatedData: data })).unwrap();
            dispatch(fetchClientes());
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
            throw error; // Lanza el error si es necesario
        }
    };

    // Eliminar cliente
    const handleDeleteCliente = async (id) => {
        try {
            await dispatch(deleteCliente(id)).unwrap();
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
            throw error; // Lanza el error si es necesario
        }
    };

     // IMPORTAR
  const handleImportarCliente = async (archivo) => {
    try {
      await dispatch(importarCliente(archivo)).unwrap();
      dispatch(fetchClientes()); 
    } catch (error) {
      console.error("Error al importar Clientes:", error);
      throw error;
    }
  };


  // EXPORTAR
  const handleExportarCliente= async () => {
    try {
      await dispatch(exportarCliente()).unwrap();
    } catch (error) {
      console.error("Error al exportar Clientes:", error);
      throw error;
    }
  };

    return { clientes, isLoading, error, handleAddCliente, handleUpdateCliente, handleDeleteCliente,  handleImportarCliente, handleExportarCliente };
};

export default useFetchClientes;