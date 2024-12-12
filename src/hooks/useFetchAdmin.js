import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchAdmin, addAdmin, updateAdmin, deleteAdmin } from "../store/features/adminSlice.js";

const useFetchPAdmin = () => {
    const dispatch = useDispatch();
    const { admin, isLoading, error } =  useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchAdmin());
    }, [dispatch]);

    //AGREGAR
    const handleAddAdmin = async (nuevoAdmin) => {
        try {
            await dispatch(addAdmin(nuevoAdmin)).unwrap();
            dispatch(fetchAdmin());
        } catch (error) {
            console.error("Error al agregar admin:", error);
            throw error;
        }
    };

    //MODIFICAR
    const handleUpdateAdmin = async (updatedData) => {
        const { id, ...data } = updatedData;
        try {
            await dispatch(updateAdmin({ id, updatedData: data })).unwrap();
            dispatch(fetchAdmin());
        } catch (error) {
            console.error("Error al actualizar admin:", error);
            throw error;
        }
    };

    //ELIMINAR
    const handleDeleteAdmin = async (id) => {
        try {
            await dispatch(deleteAdmin(id)).unwrap();
        } catch (error) {
            console.error("Error al eliminar admin:", error);
            throw error;
        }
    };
    return { admin, isLoading, error, handleAddAdmin, handleUpdateAdmin, handleDeleteAdmin};
}

export default useFetchPAdmin;