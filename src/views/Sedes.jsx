import { useEffect, useState } from "react";
import { FaPlus, FaUpload, FaDownload } from "react-icons/fa";
import { FiSearch, FiUpload, FiDownload } from "react-icons/fi";
import { useDispatch } from "react-redux";

import Tabla from "../components/Tabla";
import ModalImportar from "../components/ModalImportar";
import ModalAgregar from "../components/ModalAgregar";
import ModalAlerta from "../components/ModalAlerta";
import useFetchSedes from "../hooks/useFetchSedes";
import { openModal } from "../store/features/modalAlertaSlice";
import ModalError from "../components/ModalError";
import ModalExito from "../components/ModalExito";
import Alerts from '../components/Alerts';

const Sedes = () => {
  const columnas = [
    "ID",
    "Nombre",
    "Encargado",
    "Email",
    "Ciudad",
    "Telefono_Oficina",
    "Acciones",
  ];
  const { sedes, isLoading, error, handleAddSede, handleUpdateSede, handleDeleteSede, handleImportarSede, handleExportarSede } = useFetchSedes();
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [nuevaSede, setNuevaSede] = useState({
    nombre: "",
    dato_sede: {
      calle_no: "",
      colonia: "",
      entre_calles: "",
      ciudad: "",
      estado: "",
      pais: "",
      cp: "",
    },
    contacto_sede: {
      nombre_contacto: "",
      telefono_oficina: "",
      telefono_movil: "",
      email: "",
      observaciones: "",
    },
  });

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Si hay un error, muestra el alert
    if (error) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // 3000 ms = 3 segundos

      // Limpia el timeout si el componente se desmonta o si el error cambia
      return () => clearTimeout(timer);
    }
  }, [error]);

  //--------------------------MODALES--------------------------
  const toggleModalAgregar = () => setIsModalAgregarOpen((prev) => !prev);
  const [isModalExitoOpen, setIsModalExitoOpen] = useState(false);
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirmCloseAgregar = () => {
    setIsModalAgregarOpen(false);
    setNuevaSede({
      nombre: "",
      dato_sede: {
        calle_no: "",
        colonia: "",
        entre_calles: "",
        ciudad: "",
        estado: "",
        pais: "",
        cp: "",
      },
      contacto_sede: {
        nombre_contacto: "",
        telefono_oficina: "",
        telefono_movil: "",
        email: "",
        observaciones: "",
      },
    });
    setSubmitted(false);
    setUsuarioAEditar(null); // Resetear el usuario a editar
  };

  //Modal importar
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Modales
  const [isModalAgregarOpen, setIsModalAgregarOpen] = useState(false);

  //Modal Editar
  const [isModalEditOpen, setModalEditOpen] = useState(false);
  const handleConfirmCloseEditar = () => {
    setModalEditOpen(false);
    setUsuarioAEditar(null);
  };

  const handleEdit = (sede) => {
    setUsuarioAEditar(sede);
    setNuevaSede({
      nombre: sede.nombre,
    });
    setIsModalAgregarOpen(true); // Cambia a true para abrir el modal
  };

  //Acordeon (modal)
  const [openAccordion, setOpenAccordion] = useState(null); // Estado para controlar el acordeón abierto

  const handleToggleAccordion = (accordionId) => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
  };


  // Transformar los datos para la tabla
  const datosTabla = sedes.map((sede) => ({
    id: sede.id,
    nombre: sede.nombre,
    encargado: sede.nombre_contacto || "Jorge Manuel Ambriz Leyva",
    email: sede.email || "No disponible",
    ciudad: sede.ciudad || "No disponible",
    telefono_oficina: sede.telefono_oficina || "No disponible",
    acciones: (
      <div className="flex space-x-3">
        <button onClick={() => handleEdit(sede)}>Editar</button>
        <button onClick={() => handleDeleteSede(sede)}>Eliminar</button>
      </div>
    ),
  }));

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleImport = async (file) => {
    try {
      await handleImportarSede(file);
      alert("Archivo importado exitosamente.");
    } catch (error) {
      console.error("Error al importar archivo:", error);
      alert("Error al importar archivo.");

    }
  };

  const [validaciones, setValidaciones] = useState({
    nombre: false,
  });

  const [submitted, setSubmitted] = useState(false);

  // Actualiza la función `handleValidation`
  const handleValidation = () => {
    const valid = {
      nombre: !!nuevaSede.nombre.trim(), // Asegúrate de que el nombre no esté vacío
    };

    setValidaciones(valid);

    // Retorna true solo si todos los campos son válidos
    return Object.values(valid).every((field) => field === true);
  };


  return (
    <div className="pt-4 px-8">
      <div className="flex justify-between items-center mx-5 mt-5">
        <h1 className="text-2xl font-bold">Sedes</h1>
        <div className="flex space-x-3">
          <button
            className="flex items-center bg-azul border rounded-md text-white text-sm font-semibold px-4 py-2 hover:bg-blue-900"
            onClick={toggleModalAgregar}
          >
            <FaPlus className="mr-2" />
            Agregar Sede
          </button>

          <button
            className="flex items-center border-2 rounded-md border-azul text-azul text-sm font-semibold px-4 py-2 hover:bg-gray-50"
            onClick={handleOpenModal}
          >
            <FaUpload className="mr-2" />
            Importar
          </button>

          <ModalImportar
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Importar Sedes"
            onImport={handleImport}
          />

          <button
            className="flex items-center border-2 rounded-md border-azul text-azul text-sm font-semibold px-4 py-2 hover:bg-gray-200"
            onClick={handleExportarSede}
          >
            <FaDownload className="mr-2" />
            Exportar
          </button>

        </div>
      </div>
      <span className="block mx-5 mt-2 text-sm">
        Agregue, busque y administre a sus sedes en un solo lugar
      </span>

      <div className="flex mx-5 pt-12 pb-2 space-x-2 items-center">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="w-64"
            placeholder="Buscar sedes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="text-gray-300 mr-2 text-sm" size={20} />
        </label>
      </div>

      {/* Contador de registros */}
      <div className="block mx-5 mb-8 text-sm text-gray-500">
        <span>Sedes:</span> {sedes.length}
      </div>

      {/* Tabla reutilizable */}
      <div className="mx-5">
        {/* Muestra el estado de carga o error si es necesario */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-azul"></span>
          </div>
        ) : showAlert ? (
          <Alerts type="error" message={`Error: ${error}`} />
        ) : (
          <Tabla columnas={columnas} datos={datosTabla} onEdit={handleEdit} onDelete={handleDeleteSede} searchTerm={searchTerm} />
        )}
      </div>

      <ModalExito
        isOpen={isModalExitoOpen}
        onClose={() => setIsModalExitoOpen(false)}
        title="¡Operación Exitosa!"
        message={"La sede se ha guardado correctamente"}
      />

      <ModalError
        isOpen={isModalErrorOpen}
        onClose={() => setIsModalErrorOpen(false)}
        title="Error"
        message="Error al agregar la sede. Inténtalo de nuevo."
      />

      <ModalAgregar
        isOpen={isModalAgregarOpen}
        onClose={handleConfirmCloseAgregar}
        onSubmit={async () => {
          setSubmitted(true); // Marca el formulario como enviado
          if (!handleValidation()) {
            return; // Detén el envío si hay errores de validación
          }

          try {
            if (usuarioAEditar) {
              await handleUpdateSede(usuarioAEditar.id, { nombre: nuevaSede.nombre });
            } else {
              await handleAddSede({ nombre: nuevaSede.nombre });
            }
            setIsModalExitoOpen(true); // Muestra modal de éxito
            handleConfirmCloseAgregar(); // Cierra el modal y resetea estado
          } catch (error) {
            setErrorMessage(error.message || "Error al agregar/actualizar la sede");
            setIsModalErrorOpen(true);
          }
        }}

        usuario={usuarioAEditar}
        title={usuarioAEditar ? "Editar Sede" : "Agregar Sede"}
      >
        <div className="w-full">
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="collapse collapse-arrow join-item border-base-300 border mb-2">
              <input
                type="checkbox"
                id="sede"
                checked={openAccordion === "sede"}
                onChange={() => handleToggleAccordion("sede")}
              />
              <div className="collapse-title text-md font-bold">
                Datos de la sede
              </div>
              <div className="collapse-content">
                <div className="mx-2">
                  <label className="block mb-2 font-bold text-sm">Nombre de la sede</label>
                  <input
                    type="text"
                    className={`w-full p-2 mb-3 border ${validaciones.nombre === false && submitted ? "border-red-500" : "border-blue-700"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700`}
                    placeholder="Ingrese el nombre de la sede"
                    value={nuevaSede.nombre}
                    onChange={(e) => {
                      const nombre = e.target.value;
                      setNuevaSede({ ...nuevaSede, nombre });
                      setValidaciones({ ...validaciones, nombre: !!nombre }); // Valida si no está vacío
                    }}
                    required
                  />
                  {submitted && !validaciones.nombre && (
                    <p className="text-red-500 text-sm mt-1">El nombre es obligatorio.</p>
                  )}


                  <label className="block mb-2 font-bold text-sm">País</label>
                  <input
                    type="text"
                    className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                    placeholder="País"
                    // value={nuevaSede.dato_sede.pais}
                    onChange={(e) =>
                      setNuevaSede({
                        ...nuevaSede,
                        dato_sede: {
                          ...nuevaSede.dato_sede,
                          pais: e.target.value,
                        },
                      })
                    }
                  />
                  <label className="block mb-2 font-bold text-sm">Calle</label>
                  <input
                    type="text"
                    className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                    placeholder="Calle"
                    // value={nuevaSede.dato_sede.calle_no}
                    onChange={(e) =>
                      setNuevaSede({
                        ...nuevaSede,
                        dato_sede: {
                          ...nuevaSede.dato_sede,
                          calle_no: e.target.value,
                        },
                      })
                    }
                  />
                  <div className="flex space-x-1 mb-5">
                    <div className="w-1/2 pr-2">
                      <label className="block mb-2 font-bold text-sm">
                        Colonia
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                        placeholder="Colonia"
                        // value={nuevaSede.dato_sede.colonia}
                        onChange={(e) =>
                          setNuevaSede({
                            ...nuevaSede,
                            dato_sede: {
                              ...nuevaSede.dato_sede,
                              colonia: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="w-1/2 pl-2">
                      <label className="block mb-2 font-bold text-sm">
                        Entre Calles
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                        placeholder="Entre calles"
                        // value={nuevaSede.dato_sede.entre_calles}
                        onChange={(e) =>
                          setNuevaSede({
                            ...nuevaSede,
                            dato_sede: {
                              ...nuevaSede.dato_sede,
                              entre_calles: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex space-x-1 mb-1">
                    <div className="w-1/3 pr-2">
                      <label className="block mb-2 font-bold text-sm">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                        placeholder="C.P. de la sede"
                        // value={nuevaSede.dato_sede.cp}
                        onChange={(e) =>
                          setNuevaSede({
                            ...nuevaSede,
                            dato_sede: {
                              ...nuevaSede.dato_sede,
                              cp: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="w-1/3 pr-2">
                      <label className="block mb-2 font-bold text-sm">
                        Estado
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                        placeholder="Estado de la sede"
                        // value={nuevaSede.dato_sede.estado}
                        onChange={(e) =>
                          setNuevaSede({
                            ...nuevaSede,
                            dato_sede: {
                              ...nuevaSede.dato_sede,
                              estado: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="w-1/3 pr-2">
                      <label className="block mb-2 font-bold text-sm">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                        placeholder="Ciudad de la sede"
                        // value={nuevaSede.dato_sede.ciudad}
                        onChange={(e) =>
                          setNuevaSede({
                            ...nuevaSede,
                            dato_sede: {
                              ...nuevaSede.dato_sede,
                              ciudad: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="collapse collapse-arrow join-item border-base-300 border">
              <input
                type="checkbox"
                id="encargado"
                checked={openAccordion === "encargado"}
                onChange={() => handleToggleAccordion("encargado")}
              />
              <div className="collapse-title text-md font-bold">
                Datos del encargado
              </div>
              <div className="collapse-content">
                <label className="block mb-2 font-bold text-sm">
                  Nombre del encargado
                </label>
                <input
                  type="text"
                  className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                  placeholder="Nombre completo"
                  // value={nuevaSede.contacto_sede.nombre_contacto}
                  onChange={(e) =>
                    setNuevaSede({
                      ...nuevaSede,
                      contacto_sede: {
                        ...nuevaSede.contacto_sede,
                        nombre_contacto: e.target.value,
                      },
                    })
                  }
                />
                <div className="flex space-x-2 mb-5">
                  <div className="w-1/2 pr-2">
                    <label className="block mb-2 font-bold text-sm">
                      Teléfono de oficina
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                      placeholder="(222) 222 2222"
                      // value={nuevaSede.contacto_sede.telefono_oficina}
                      onChange={(e) =>
                        setNuevaSede({
                          ...nuevaSede,
                          contacto_sede: {
                            ...nuevaSede.contacto_sede,
                            telefono_oficina: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label className="block mb-2 font-bold text-sm">
                      Teléfono móvil
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                      placeholder="(222) 222 2222"
                      // value={nuevaSede.contacto_sede.telefono_movil}
                      onChange={(e) =>
                        setNuevaSede({
                          ...nuevaSede,
                          contacto_sede: {
                            ...nuevaSede.contacto_sede,
                            telefono_movil: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <label className="block mb-2 font-bold text-sm">
                  Correo electrónico
                </label>
                <input
                  type="text"
                  className="w-full p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                  placeholder="colaborador@epicore.com.mx"
                  // value={nuevaSede.contacto_sede.email}
                  onChange={(e) =>
                    setNuevaSede({
                      ...nuevaSede,
                      contacto_sede: {
                        ...nuevaSede.contacto_sede,
                        email: e.target.value,
                      },
                    })
                  }
                />
                <label className="block mb-2 font-bold text-sm">
                  Observaciones
                </label>
                <input
                  type="text"
                  className="w-full h-28 p-2 mb-3 border border-blue-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-700"
                  // value={nuevaSede.contacto_sede.observaciones}
                  onChange={(e) =>
                    setNuevaSede({
                      ...nuevaSede,
                      contacto_sede: {
                        ...nuevaSede.contacto_sede,
                        observaciones: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </ModalAgregar>

      <ModalAlerta
        message={
          isModalEditOpen
            ? "¿Desea cancelar y cerrar el modal de editar?"
            : "¿Desea cancelar y cerrar el modal de agregar?"
        }
        onConfirm={
          isModalEditOpen ? handleConfirmCloseEditar : handleConfirmCloseAgregar
        }
        onCancel={() => {
          dispatch(openModal());
        }}
      />
    </div>
  );
};

export default Sedes;
