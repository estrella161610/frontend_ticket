import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../store/features/statsSlice";

const useStats = () => {
    const dispatch = useDispatch();
    const stats = useSelector((state) => state.stats.stats);
    const isLoading = useSelector((state) => state.stats.isLoading);
    const error = useSelector((state) => state.stats.error);

    useEffect(() => {
        dispatch(fetchStats());
    }, [dispatch]);

    return { stats, isLoading, error };
};

export default useStats;