import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPerfilAgente, updatePerfilAgente } from "../store/features/perfilAgenteSlice";

const useFetchPerfilAgente = () => {
    const dispatch = useDispatch();
    const { perfil, isLoading, error } = useSelector((state) => state.perfilAgente);

    useEffect(() => {
        dispatch(fetchPerfilAgente());
    }, [dispatch]);

    //Actualizar perfil agente
    const handleUpdatePerfil = async (updatedData) => {
        try {
          await dispatch(updatePerfilAgente(updatedData)).unwrap();
        } catch (error) {
          console.error("Error al actualizar el perfil de agente:", error);
          throw error; // Lanza el error si es necesario
        }
    };

    return { perfil, isLoading, error, handleUpdatePerfil };
}

export default useFetchPerfilAgente;