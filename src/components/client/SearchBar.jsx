import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, fetchSearchResults } from "../../store/features/searchSlice";

const SearchBar = () =>{
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [query, setQueryLocal] = useState('');
    const [debounceTimer, setDebounceTimer] = useState(null);
    const dispatch = useDispatch();
    const { results, isLoading } = useSelector((state) => state.search);
    const categories = ['tickets']; //Delimitando búsqueda de clientes
    const [activeFilter, setActiveFilter] = useState(null);
    const [resultCategory, setResultCategory] = useState(null); // Nueva variable para almacenar la categoría de los resultados
    const searchRef = useRef(null);

    // Función para activar/desactivar el buscador y limpiar cuando se cierra
    const handleSearchClick = () => {
        if (isSearchActive) {
            // Limpiar el input y el filtro al cerrar el buscador
            setQueryLocal('');
            setActiveFilter(null);
            setResultCategory(null); // Limpiar categoría cuando se cierra el buscador
            dispatch(setQuery(''));  // Limpia el estado de búsqueda global si es necesario
        }
        setIsSearchActive(!isSearchActive);
    };

    // Manejar el cambio de texto en el input de búsqueda
    const handleInputChange = (e) => {
        const term = e.target.value;
        setQueryLocal(term);
        if (debounceTimer) clearTimeout(debounceTimer);
        const newTimer = setTimeout(() => {
            dispatch(setQuery(term));
            dispatch(fetchSearchResults({ query: term, category: activeFilter }));
        }, 500);
        setDebounceTimer(newTimer);
    };

    // Función para manejar el cambio de filtro, asegurando que solo uno esté activo
    const handleCategoryChange = (category) => {
        setActiveFilter(activeFilter === category ? null : category);
        dispatch(fetchSearchResults({ query, category })); // Asegúrate de que se llame con `query` y la `category` activa
    };


    // Detectar la categoría de los resultados cuando no hay filtro seleccionado
    useEffect(() => {
        if (!activeFilter && results.length > 0) {
            const firstResultCategory = results[0].category;
            setResultCategory(firstResultCategory);
        } else {
            setResultCategory(null); // Limpiar categoría cuando hay un filtro activo
        }
    }, [results, activeFilter]);

    // Limpiar el debounce cuando se desmonta el componente
    useEffect(() => {
        return () => clearTimeout(debounceTimer);
    }, [debounceTimer]);

    // Detectar clic fuera del buscador para cerrarlo
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchActive(false);
                setQueryLocal(''); // Limpiar el input al cerrar el buscador
                setActiveFilter(null); // Limpiar filtro al cerrar el buscador
                setResultCategory(null); // Limpiar categoría al cerrar el buscador
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayResults = activeFilter 
        ? results[activeFilter] || [] 
        : results.tickets || []; // Combina todos los resultados

    return (
        <div ref={searchRef} className="relative w-96">
            <div className="flex items-center w-full">
                <FaSearch
                    onClick={handleSearchClick}
                    className="text-gray-300 cursor-pointer ml-auto mr-2"
                    size={20}
                />
                {isSearchActive && (
                    <div className="flex items-center border p-1 rounded w-full">
                        {activeFilter && (
                            <span className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2">
                                {activeFilter}
                                <button
                                    onClick={() => setActiveFilter(null)}
                                    className="ml-1 text-blue-500 hover:text-blue-700"
                                >
                                    &times;
                                </button>
                            </span>
                        )}
                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Buscar..."
                            className="outline-none flex-grow"
                        />
                    </div>
                )}
            </div>

            {/* Desplegable de resultados */}
            {isSearchActive && (
                <div className="absolute top-full mt-1 w-100 bg-white shadow-lg rounded p-4 border border-gray-300 left-6 z-50">
                    {/* Sección de Filtros */}
                    <div className="mb-2">
                        <span className="font-semibold">Filtros</span>
                        <div className="flex flex-wrap gap-4 mt-1">
                            {categories.map((cat) => (
                                <span
                                    key={cat}
                                    className={`cursor-pointer ${activeFilter === cat ? 'text-blue-600' : 'text-blue-500'} hover:text-blue-700`}
                                    onClick={() => handleCategoryChange(cat)}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Línea separadora */}
                    <hr className="my-4 border-t border-gray-300" />

                    {/* Sección de resultados */}
                    <div className="mb-2">
                        <div className="flex items-center">
                            <FaSearch className="mr-2" size={10} />
                            <p className="font-semibold">
                                {activeFilter ? `Todos los resultados de ${activeFilter}` :
                                    resultCategory ? `${resultCategory.charAt(0).toUpperCase() + resultCategory.slice(1)}` :
                                        'Todos los resultados'}
                            </p>
                        </div>
                        <ul className="mt-2 max-h-48 overflow-y-auto">
                            {isLoading ? (
                                <div className="text-gray-500">Cargando...</div>
                            ) : activeFilter ? ( // Si hay un filtro activo
                                displayResults.length === 0 ? (
                                    <li className="p-2 text-gray-500">No se encontraron resultados para el filtro seleccionado.</li>
                                ) : (
                                    displayResults.map((result, index) => (
                                        <li key={index} className="p-2 hover:bg-gray-100">
                                            {result.nombre || result.nombre_completo || result.nombre_ticket}
                                        </li>
                                    ))
                                )
                            ) : query === '' ? ( // Si el query está vacío y no hay filtro activo
                                <li className="p-2 text-gray-500">No hay nada que buscar.</li>
                            ) : displayResults.length === 0 ? (
                                <li className="p-2 text-gray-500">No se encontraron resultados.</li>
                            ) : (
                                displayResults.map((result, index) => (
                                    <li key={index} className="p-2 hover:bg-gray-100">
                                        {result.nombre || result.nombre_completo || result.nombre_ticket}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;