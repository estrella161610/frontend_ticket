import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPerfilCliente, updatePerfilCliente } from '../store/features/perfilClienteSlice';

const useFetchPerfilCliente = () => {
    const dispatch = useDispatch();
    const { perfil, isLoading, error } = useSelector((state) => state.perfilCliente);

    useEffect(() => {
        dispatch(fetchPerfilCliente());
    }, [dispatch]);

    //Actualizar perfil Cliente
    const handleUpdatePerfil = async (updatedData) => {
        try {
          await dispatch(updatePerfilCliente(updatedData)).unwrap();
        } catch (error) {
          console.error("Error al actualizar el perfil de cliente:", error);
          throw error; // Lanza el error si es necesario
        }
    };

    return { perfil, isLoading, error, handleUpdatePerfil };
}

export default useFetchPerfilCliente;