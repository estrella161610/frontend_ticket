import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, setCategory, fetchSearchResults } from '../store/features/searchSlice';

const useSearch = () => {
  const dispatch = useDispatch();
  const { query, category, results, isLoading } = useSelector((state) => state.search);

  // Efecto para manejar los cambios en `query` o `category`
  useEffect(() => {
    if (query && !category) {
      // Caso 1: Solo `query`
      dispatch(fetchSearchResults({ query }));
    } else if (query && category) {
      // Caso 2: `query` y `category`
      dispatch(fetchSearchResults({ query, category }));
    } else if (category && !query) {
      // Caso 3: Solo `category`
      dispatch(fetchSearchResults({ category }));
    }
  }, [query, category, dispatch]);

  const updateQuery = (newQuery) => dispatch(setQuery(newQuery));
  const updateCategory = (newCategory) => dispatch(setCategory(newCategory));

  return { query, updateQuery, category, updateCategory, results, isLoading };
};

export default useSearch;
