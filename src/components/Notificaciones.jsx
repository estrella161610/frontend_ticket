    // src/components/Notificaciones.jsx
    import React, { useState, useRef } from 'react';
    import { FaBell, FaDove } from 'react-icons/fa';
    import { useNavigate } from 'react-router-dom';
    import useNotifications from '../hooks/useNotifications';

    const Notificaciones = () => {
    const {
        notifications,
        isLoading,
        error,
        handleMarkAsRead,
    } = useNotifications();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef(null);
    const navigate = useNavigate();

    const handleOutsideClick = (e) => {
        if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleNotificationClick = (notification) => {
        console.log(notification); // Verifica la estructura del objeto
        handleMarkAsRead(notification.id); // Marca como leída
        // if (notification.data && notification.data.ticket && notification.data.ticket.id) {
        //     // Asegúrate de que el template string esté entre comillas
        //     navigate(`/agente/abrir-ticket/${notification.data.ticket.id}`, {
        //         state: { ticket: notification }, // Envía la notificación como parte del estado
        //     });
        // } else {
        //     console.error('No se encontró un ticket válido en la notificación');
        // }
    };
     

    const unreadCount = notifications.filter((n) => n.status === 'unread').length;

    return (
        <div className="relative flex items-center">
        {/* Ícono de Notificaciones */}
        <div className="relative">
            <FaBell
            className="text-gray-300 cursor-pointer"
            size={24}
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            />
            {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
            </span>
            )}
        </div>

        {/* Desplegable de notificaciones */}
        {isNotificationOpen && (
            <div
            className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg p-4 border border-gray-200 w-64 z-50"
            ref={notificationRef}
            >
            <p className="font-bold text-gray-700 p-2">Actualización de mensajería</p>
            <hr />
            <div className="mt-4 max-h-60 overflow-y-auto">
                {isLoading ? (
                <p className="text-gray-300">Cargando notificaciones...</p>
                ) : error ? (
                <p className="text-red-500">Error al cargar las notificaciones.</p>
                ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center">
                    <FaDove className="text-gray-200" size={40} />
                    <p className="text-gray-300 text-center mt-2">
                    No hay ninguna actualización de mensajería en este momento
                    </p>
                </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`notification-item ${
                                notification.status === 'unread' ? 'font-bold' : 'font-normal'
                            } hover:bg-gray-100 p-2 rounded-md cursor-pointer`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <p className="text-gray-700 font-bold">
                                {notification.data.mensaje || notification.data.asunto || "No hay mensaje"}
                            </p>
                            
                            {/* Mostrar el Ticket ID, el mensaje y el asunto en conjunto */}
                            {notification.type === "App\\Notifications\\TicketAsignadoAgente" && (
                                <div className="text-gray-500 text-sm font-semibold">
                                    <p>Ticket ID: {notification.data.ticket_id}</p>
                                    <p>Asunto: {notification.data.asunto}</p>
                                </div>
                            )}
                            
                            {notification.type === "App\\Notifications\\NuevoMensaje" && (
                                <div className="text-gray-500 text-sm font-semibold">
                                    <p>Ticket ID: {notification.data.id_ticket}</p>
                                    <p>Mensaje: {notification.data.mensaje}</p>
                                </div>
                            )}
                            
                            {notification.type === "App\\Notifications\\TicketActualizadoCliente" && (
                                <div className="text-gray-500 text-sm font-semibold">
                                    <p>Ticket ID: {notification.data.ticket_id}</p>
                                    <p>Asunto: {notification.data.asunto}</p>
                                </div>
                            )}
                    
                            <hr />
                        </div>
                    ))
                )}
            </div>
            </div>
        )}
        </div>
    );
    };

    export default Notificaciones;
