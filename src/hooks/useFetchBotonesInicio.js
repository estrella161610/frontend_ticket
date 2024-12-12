import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignedTickets, fetchResolvedTickets } from "../store/features/BotonesInicioSlice";

const useFetchBotonesInicio = () => {
  const dispatch = useDispatch();
  const { assignedTickets, resolvedTickets, isLoading, error } = useSelector((state) => state.botonesInicio);

  useEffect(() => {
    dispatch(fetchAssignedTickets());
    dispatch(fetchResolvedTickets());
  }, [dispatch]);

  return { assignedTickets, resolvedTickets, isLoading, error };
};

export default useFetchBotonesInicio;
