import LogoEpicore from "../assets/img/logo_epicore.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../hooks";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch } from "react-redux";

const Recuperar = () => {
  const [showPassword, setShowPassword] = useState(false); // Visibilidad de la contraseña
  const [password, setPassword] = useState(""); // Nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmación de contraseña
  const [error, setError] = useState(""); // Manejo de errores
  const [loading, setLoading] = useState(false); // Estado de carga
  const { changePassword } = useAuthStore();
  const [email, setEmail] = useState(""); // Estado para almacenar el correo

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Recuperar el token y el email desde la URL
  const queryParams = new URLSearchParams(location.search);
  const tokenFromUrl = queryParams.get('token');
  const emailFromUrl = queryParams.get('email'); // Obtener el parámetro 'email' de la URL

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl); // Establecer el email cuando se obtenga de la URL
    }

    // Verificar si el token está presente en la URL
    if (!tokenFromUrl) {
      navigate('/error'); // Redirigir si el token no está presente
    }
  }, [emailFromUrl, tokenFromUrl, navigate]); // El useEffect se ejecutará cuando 'emailFromUrl' o 'tokenFromUrl' cambien


  // Función para manejar el cambio de contraseña
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (confirmPassword && value !== confirmPassword) {
      setError("Las contraseñas no coinciden");
    } else {
      setError("");
    }
  };

  // Función para manejar la confirmación de la contraseña
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password && value !== password) {
      setError("Las contraseñas no coinciden");
    } else {
      setError("");
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificación de las contraseñas
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);
    try {
      const passwordData = { email, password, password_confirmation: confirmPassword, token: tokenFromUrl };

      // Despachar la acción de cambiar la contraseña
      await dispatch(changePassword(passwordData));
      console.log(passwordData);
      setLoading(false);
      navigate("/"); // Redirigir al login después de cambiar la contraseña
    } catch (err) {
      setLoading(false);
      setError("Ocurrió un error al restablecer la contraseña");
      console.error("Error al cambiar la contraseña:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <img src={LogoEpicore} alt="Logo Epicore" className="w-32" />
        </div>
        <p className="text-center text-azul font-bold text-2xl mb-4">Cambiar la contraseña</p>
        <p className="text-center text-gray-600 text-sm mb-4">
          Protege tu cuenta con una contraseña segura.
        </p>

        {/* Formulario para cambiar la contraseña */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña nueva
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Ingresa tu nueva contraseña"
                className="block w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul focus:border-azul sm:text-sm"
                required
                name="password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-azul"
              >
                {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmación de contraseña nueva
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirma tu nueva contraseña"
                className="block w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-azul focus:border-azul sm:text-sm"
                required
                name="password_confirmation"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-azul text-white mt-8 py-2 px-4 rounded-md shadow-md hover:bg-bgYankBlue transition duration-300"
          >
            {loading ? "Cambiando..." : "Cambiar la contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Recuperar;