import { useState, useRef } from 'react';
import { FaFileCsv } from 'react-icons/fa';

const ModalImportar = ({ isOpen, onClose, title, onImport }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(''); // Estado para almacenar el nombre del archivo
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Manejador para cambiar el archivo seleccionado
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateFile(selectedFile);
  };

  // Manejador para soltar el archivo arrastrado
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateFile(droppedFile);
  };

  const handleDragOver = (e) => e.preventDefault();

  const validateFile = (file) => {
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      setFile(file);
      setFileName(file.name); // Actualizar el nombre del archivo
      setError(null);  // Limpiar cualquier error previo
    } else {
      setFile(null);
      setFileName(''); // Limpiar el nombre del archivo
      setError("Solo se permiten archivos .csv y .xlsx");
    }
  };

  const handleSubmit = () => {
    if (file) {
      onImport(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>

      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-lg">
        <button
          className="absolute top-4 right-8 text-gray-300"
          style={{ fontSize: '35px' }}
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <hr />
        <div
          className="mt-6 p-10 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()} // Dispara el input oculto al hacer clic
        >
          <FaFileCsv className="text-green-600 text-4xl mb-2" />
          <p className="font-bold">Seleccione un archivo CSV o Excel para importar</p>
          <p className="text-gray-500">o arrastra y suelta aquí</p>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv, .xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
          {error && <p className="text-red-600 mt-2">{error}</p>}
          {fileName && <p className="text-gray-600 mt-2">Archivo seleccionado: {fileName}</p>}
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            className="px-3 py-1 text-blue-800 rounded-md text-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-3 py-1 bg-blue-800 text-white rounded-md text-sm"
            onClick={handleSubmit}
            disabled={!file}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalImportar;