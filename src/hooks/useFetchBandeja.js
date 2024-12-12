import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBandeja } from '../store/features/bandejaSlice';

const useFetchBandeja = (view) => {
  const dispatch = useDispatch();
  const { bandeja, loading, error } = useSelector((state) => state.bandeja);

  useEffect(() => {
    if (view !== undefined) {
      dispatch(fetchBandeja(view));
    }
  }, [dispatch, view]);

  return { bandeja, loading, error };
};

export default useFetchBandeja;