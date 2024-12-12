import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../store/features/chgPassClientSlice";

const useChgPassClient = () => {
    const dispatch = useDispatch();
    const message = useSelector((state) => state.password?.message); // Usa el operador de encadenamiento opcional
    const isLoading = useSelector((state) => state.password?.isLoading);
    const error = useSelector((state) => state.password?.error);

    const handleChangePassword = (password, new_password, new_password_confirmation) => {
        return dispatch(changePassword({ password, new_password, new_password_confirmation }));
    };

    return { message, isLoading, error, handleChangePassword };
}

export default useChgPassClient;