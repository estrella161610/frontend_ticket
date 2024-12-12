import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import useChgPassClient from "../hooks/useChgPassClient";
import { useAuthStore } from "../hooks/useAuthStore";

const ChangeContClient = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false); // Visibilidad de las contraseñas
  const [password, setPassword] = useState(""); // Contraseña actual
  const [newPassword, setNewPassword] = useState(""); // Nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState(""); // Verificación de contraseña
  const [error, setError] = useState(""); // Estado para manejar el error si las contraseñas no coinciden

  //Hooks
  const { error: cambioError, handleChangePassword } = useChgPassClient();
  const { startLogout } = useAuthStore();

  // Función para verificar si las contraseñas coinciden
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    // Comparar contraseñas
    if (confirmPassword && value !== confirmPassword) {
        setError("Las contraseñas no coinciden");
    } else {
        setError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    // Compara contraseñas
    if (newPassword && value !== newPassword) {
        setError("Las contraseñas no coinciden");
    } else {
        setError("");
    }
  };

  // Función para cambiar la contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verificar si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
    }

    // Verificar que la contraseña actual no esté vacía
    if (!password) {
        setError("La contraseña actual es requerida");
        return;
    }

    // Verificar que la nueva contraseña no esté vacía
    if (!newPassword) {
        setError("La nueva contraseña es requerida");
        return;
    }

    try {
      await handleChangePassword(password, newPassword, confirmPassword);
      onClose(); // Cierra el modal después de cambiar la contraseña
      startLogout(); // Cierra sesión
    } catch (error) {
        console.error("Error cambiando la contraseña:", error);
    }
  };

  // Deshabilitar el botón si las contraseñas no coinciden o están vacías
  const isDisabled = !password || !newPassword || !confirmPassword || error;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-300"
          style={{ fontSize: "35px" }}
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">Requisitos de Contraseña</h2>
        <hr />
        <div className="mt-4 mx-6">
          <label className="block text-sm text-slate-400">
            - Mínimo 8 caracteres y máximo 128 caracteres
          </label>
          <label className="block text-sm text-slate-400">
            - No debe de ser igual a la anterior contraseña
          </label>
          <label className="block text-sm text-slate-400">
            - Debe contener al menos una letra mayúscula
          </label>
        
          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="mt-3 mb-5">
              <label className="block text-sm pb-3 pt-3">Contraseña actual</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 py-1 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
              />

              {/* Nueva contraseña */}
              <label className="block text-sm pb-3 pt-3">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handlePasswordChange} // Maneja el cambio de la nueva contraseña
                  className="w-full px-2 py-1 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-azul"
                >
                  {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                </button>
              </div>

              {/* Verificar nueva contraseña */}
              <label className="block text-sm pb-3 pt-3">Verificar nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange} // Maneja el cambio de la verificación de contraseña
                  className="w-full px-2 py-1 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-azul"
                >
                  {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                </button>
              </div>

              {/* Mensaje de error si las contraseñas no coinciden */}
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              {cambioError && (
                <p className="text-red-600 text-sm mt-2">
                    {typeof cambioError === 'string' ? cambioError : cambioError.message || "Error desconocido"}
                </p>
              )}
            </div>

            <label className="block text-sm text-slate-400">
              Nota: Si guarda su nueva contraseña, se cerrará sesión.
            </label>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              className="px-3 py-1 text-blue-800 rounded-md text-sm"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${isDisabled ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-800 text-white'}`} // Cambia el color según el estado
              disabled={isDisabled}
              type="submit"
            >
              Cambiar
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ChangeContClient;
