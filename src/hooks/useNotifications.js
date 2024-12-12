// src/hooks/useNotifications.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markNotificationAsRead,
} from '../store/features/notificationsSlice';

const useNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  return {
    notifications,
    isLoading,
    error,
    handleMarkAsRead,
  };
};

export default useNotifications;
