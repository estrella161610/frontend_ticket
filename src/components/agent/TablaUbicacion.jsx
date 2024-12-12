import { UAParser } from "ua-parser-js";
import useFetchPerfilAgente from "../../hooks/useFetchPerfilAgente";

const TablaUbicacion = () => {
  const { perfil, isLoading, error } = useFetchPerfilAgente();

  if (isLoading) {
    return <p className="text-gray-500">Cargando datos...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!perfil) {
    return <p className="text-gray-500">No hay datos disponibles.</p>;
  }

  // Formatear la fecha de inicio de sesión
  const inicioSesion = new Date(perfil.inicio_sesion);
  const fechaFormateada = inicioSesion.toLocaleDateString("es-MX"); // Ejemplo: 25/11/2024
  const horaFormateada = inicioSesion.toLocaleTimeString("es-MX"); // Ejemplo: 14:37:21

  // Procesar el campo "dispositivo" con UAParser
  const parser = new UAParser(perfil.dispositivo);
  const osName = parser.getOS().name || "Sistema desconocido"; // Ejemplo: "Windows"
  const osVersion = parser.getOS().version || ""; // Ejemplo: "10"
  const deviceType = parser.getDevice().type || "Desktop"; // Ejemplo: "Desktop"
  const dispositivo = `${deviceType} (${osName} ${osVersion})`;

  return (
    <div className="relative bg-white">
      <div className="overflow-y-auto max-h-[48vh]">
        <table className="table mt-2 w-full">
          <thead className="bg-white sticky top-0 z-10">
            <tr className="text-blue-700 text-sm font-bold">
              <th>Inicio de sesión</th>
              <th>Dispositivo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{`${fechaFormateada} ${horaFormateada}`}</td>
              <td>{dispositivo}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaUbicacion;
