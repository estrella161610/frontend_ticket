import { useEffect, useState } from 'react'

const ModalEditProfile = ({isOpen, onClose, onSubmit, perfil}) => {
  const [formData, setFormData] = useState(perfil);

  useEffect(() => {
    setFormData(perfil);
  }, [perfil]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // Cerrar modal al guardar
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>

      {/* Contenido del modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-lg">
        <button
          className="absolute top-4 right-8 text-gray-300"
          style={{ fontSize: '35px' }}
          onClick={onClose}  // Llama a handleCancel en lugar de onClose 
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-3">Editar Perfil</h2>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="mt-8">
            {/* <label className="block mt-2 font-semibold">Nombre</label>
            <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                required
              /> */}

            <label className="block mt-4 font-semibold">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                required
              />
            
            <label className="block mt-4 font-semibold">Alias</label>
            <input
                type="text"
                name="alias"
                value={formData.alias || ""}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                required
              />
          </div>
          {/* Botones de acción */}
          <div className="flex justify-end space-x-2 mt-12">
          <button
            className="px-3 py-1 text-blue-800 rounded-md text-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={'px-3 py-1 text-white rounded-md text-sm bg-blue-800'}
            type='submit'
          >
            Guardar
          </button>
        </div>
        </form>
      </div>
    </div>
  )
}

export default ModalEditProfile
