import { useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets, createTicket, updateTicket, assignTicket} from "../store/features/ticketsSlice";

const useFetchTickets = () => {
  const dispatch = useDispatch();
  const { ticket, isLoading, error } = useSelector((state) => state.tickets);

  const addTicket = async (ticketData) => {
    return await dispatch(createTicket(ticketData)).unwrap();
  };

  const updateExistingTicket = (id, ticketData) => {
    dispatch(updateTicket({ id, ticketData }));
  };

  const assignTicketToAgent = async (id, idAgente) => {
    return await dispatch(assignTicket({ id, idAgente })).unwrap();
  };

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  return { ticket, isLoading, error, addTicket, updateExistingTicket, assignTicketToAgent }; 
};
export default useFetchTickets;