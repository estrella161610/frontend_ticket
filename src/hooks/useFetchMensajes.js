import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMensajes, enviarMensaje } from "../store/features/mensajesSlice";

const useFetchMensajes = (ticketId) => {
    const dispatch = useDispatch();
    const { mensajes, isLoading, error } = useSelector((state) => state.mensajes);

    // Obtener mensajes al montar el componente
    useEffect(() => {
        if (ticketId) {
            dispatch(fetchMensajes(ticketId));
        }
    }, [dispatch, ticketId]);

    // Enviar un nuevo mensaje
    const handleEnviarMensaje = async (nuevoMensaje) => {
        try {
            const response = await dispatch(enviarMensaje(nuevoMensaje)).unwrap();
            return response;
        } catch (error) {
            console.error("Error al enviar mensaje:", error.response ? error.response.data : error.message);
            throw error;
        }
    };

    return { mensajes, isLoading, error, handleEnviarMensaje };
};

export default useFetchMensajes;