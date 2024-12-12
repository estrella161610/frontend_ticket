import { useState, useRef, useEffect } from "react";
import { FaBell, FaUserCircle, FaDove, FaTimes, FaTicketAlt, FaBuilding, FaUser, FaUserFriends } from "react-icons/fa";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addItem, setActiveModal } from "../../store/features/headerBarSlice";
import SearchBar from "./SearchBar";
import useFetchPerfilCliente from "../../hooks/useFetchPerfilCliente";
import Notificaciones from "../Notificaciones";

const HeaderBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeItemId, setActiveItemId] = useState(null); // ID de la vista activa
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { perfil, isLoading: loadingPerfil, error: errorPerfil } = useFetchPerfilCliente();
  const { startLogout } = useAuthStore();

  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Historial de vistas para poder regresar a la vista anterior
  const [viewStack, setViewStack] = useState([]);
  const [previousRoute, setPreviousRoute] = useState(location.pathname); // Ruta antes de abrir una nueva pestaña

  const handleClickOutside = (event, ref, setStateFunction) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setStateFunction(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      handleClickOutside(event, menuRef, setIsMenuOpen);
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleAddItem = (type, label) => {
    // Guardar la ruta actual antes de abrir una nueva vista
    setPreviousRoute(location.pathname);

    // Crear un nuevo item con un ID único para permitir múltiples instancias
    const newItem = { id: Date.now(), type, label };
    setSelectedItems([...selectedItems, newItem]);

    // Agregar el nuevo item al stack de vistas y activarlo
    setViewStack([...viewStack, newItem.id]);
    setActiveItemId(newItem.id);

    // Cambiar la vista actual y navegar a la ruta correspondiente
    dispatch(addItem(newItem));
    dispatch(setActiveModal(type));
    setIsMenuOpen(false);

    // Navegar a la ruta correspondiente
    navigateToView(type);
  };

  const navigateToView = (type) => {
    switch (type) {
      case 'ticket':
        navigate('/cliente/ticket-nuevo');
        break;
    }
  };

  const handleRemoveItem = (id) => {
    // Filtrar el item cerrado y actualizar el estado
    const updatedItems = selectedItems.filter(item => item.id !== id);
    setSelectedItems(updatedItems);

    // Remover el ID de la vista cerrada del stack de historial
    const updatedStack = viewStack.filter(viewId => viewId !== id);
    setViewStack(updatedStack);

    // Si la vista cerrada es la actual, retroceder a la vista anterior en el stack
    if (activeItemId === id) {
      const newActiveItemId = updatedStack[updatedStack.length - 1];
      setActiveItemId(newActiveItemId);

      if (newActiveItemId) {
        // Si quedan otras vistas abiertas, navegar a la última en el historial
        const previousItem = selectedItems.find(item => item.id === newActiveItemId);
        if (previousItem) {
          navigateToView(previousItem.type);
        }
      } else {
        // Si ya no quedan vistas abiertas, redirigir a /admin
        navigate('/cliente');
      }
    }
  };
  
  const handleSelectItem = (id) => {
    setActiveItemId(id);
    const selectedItem = selectedItems.find(item => item.id === id);
    if (selectedItem) navigateToView(selectedItem.type);
  };

  const handleProfileClick = () => {
    navigate('/cliente/perfil-cliente');
    setIsProfileMenuOpen(false);
  };


  return (
    <div className="flex items-center p-2 bg-white border-b border-gray-200">
      {/* Menú de + Agregar */}
      <div className="relative ml-2" ref={menuRef}>
        <button className="text-gray-500 p-2 rounded hover:bg-gray-200" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          + Agregar
        </button>
        {isMenuOpen && (
          <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg p-4 border border-gray-200 w-64 z-50">
            <p className="font-bold text-gray-700 p-2">Nuevo</p>
            <hr />
            <ul className="text-sm mt-2">
              <li className="p-2 hover:bg-azul hover:text-white rounded cursor-pointer" onClick={() => handleAddItem('ticket', 'Nuevo Ticket')}>Ticket</li>
            </ul>
          </div>
        )}
      </div>

      {/* Barra de elementos seleccionados */}
      <div className="flex ml-4 space-x-2">
        {selectedItems.map(item => (
          <div
            key={item.id}
            className={`flex items-center px-2 py-1 rounded border ${activeItemId === item.id ? 'bg-gray-200' : 'bg-white'
              } border-gray-200 cursor-pointer`}
            onClick={() => handleSelectItem(item.id)}
          >
            {item.type === 'ticket' && <FaTicketAlt className="mr-1 text-gray-500" />}
            <span className="mr-1">{item.label}</span>
            <FaTimes
              className="text-gray-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();  // Evitar que cierre y seleccione al mismo tiempo
                handleRemoveItem(item.id);
              }}
            />
          </div>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-4 text-sm">
        <SearchBar />
        <Notificaciones />

        <div className="relative" ref={profileMenuRef}>
          <FaUserCircle className="text-gray-300 cursor-pointer mr-6" size={36} onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} />
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg p-4 border border-gray-200 w-64" style={{ zIndex: 1000 }}>
              <div className="flex items-center mb-2">
                <FaUserCircle className="text-gray-300" size={24} />
                <div className="ml-2">
                  {loadingPerfil ? (
                    <p className="text-gray-500 text-sm">Cargando perfil...</p>
                  ) : errorPerfil ? (
                    <p className="text-red-500 text-sm">Error al cargar perfil</p>
                  ) : perfil ? (
                    <>
                      <p className="font-bold text-black text-sm">{perfil.nombre_completo}</p>
                      <p className="text-gray-600 text-xs">{perfil.email}</p>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">Datos no disponibles</p>
                  )}
                </div>

              </div>
              <hr />
              <ul className="text-sm mt-2">
                <li className="p-2 hover:bg-azul hover:text-white rounded cursor-pointer" onClick={handleProfileClick}>Ver perfil</li>
                <li className="p-2 hover:bg-azul hover:text-white rounded cursor-pointer" onClick={() => startLogout()}>Cerrar sesión</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
