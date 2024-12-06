import { useState, useEffect, useContext, createContext, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CloudinaryImage } from "@cloudinary/url-gen"; // Para manejar imágenes
import { upscale } from "@cloudinary/url-gen/actions/effect"; // Para aplicar el efecto de upscale

const ClarityContext = createContext()

export const useClarity = () => useContext(ClarityContext)

const ClarityProvider = ({children}) => {

    const [selectedFiles, setSelectedFiles] = useState({});

    const onDrop = useCallback((acceptedFiles) => {
      setSelectedFiles(acceptedFiles[0]);
    }, []);

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState({});

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_PRESET); // Reemplaza con tu upload preset
    
        try {
          setUploading(true);
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dduz5dnhy/image/upload', // Reemplaza con tu cloud name
            formData,
            {
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
              }
            }
          );
          setUploadedFile(response.data);
        } catch (error) {
          console.error('Error al subir el archivo:', error);
        } finally {
          setUploading(false);
          setUploadProgress('Archivo subido')
        }
      };

    useEffect(() => {
        if (selectedFiles?.name) {
            uploadToCloudinary(selectedFiles)
        }        
    }, [selectedFiles])

    const handleIncompletedForm = (errorText) => {
        Swal.fire({
          html: errorText,
          confirmButtonText: 'Aceptar',
          customClass: {
              popup: 'swal2-popup',
              content: 'swal2-content',
              actions: 'swal2-actions',
              confirmButton: 'swal2-confirm',
          }
      });
      }

      const [publicID, setPublicID] = useState('')

      const handlePublicIDToResponse = (ID) => {
        setPublicID(ID)
      }

      useEffect(() => {
        uploadedFile?.url && handlePublicIDToResponse(uploadedFile.public_id)
    },[uploadedFile])

    const [response, setResponse] = useState('')
    const [responseIMG, setResponseIMG] = useState('')

    const handleUpscalingImg = async () => {
      try {
    
        const dynamicImage = new CloudinaryImage(publicID, { cloudName: "dduz5dnhy" });
        const aplicarUpscale = dynamicImage.effect(upscale());
        const obtenerURL = aplicarUpscale.toURL();
    
        // Verificar si la URL generada devuelve un resultado válido
        const response = await axios.get(obtenerURL);
        if (response.status !== 200) {
          throw new Error("Error al realizar el upscale. Verifica los parámetros de la imagen.");
        }
    
        setResponse(obtenerURL); // Si la URL es válida, actualiza el estado
        setResponseIMG(obtenerURL)
      } catch (error) {
        console.error("Error al realizar el upscale:", error.message);
    
        handleIncompletedForm(`
          <img class="error__icon" src="https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif" alt="Error" />
          <p>Error: ${error.message}</p>
        `);
      }
    };
    

    function agregarFlAttachment(url) {
      const partes = url.split("/upload/");
      if (partes.length === 2) {
        return `${partes[0]}/upload/fl_attachment,${partes[1]}`;
      }
      // Si la URL no tiene el formato esperado, puedes devolver la original o manejar el error.
      return url;
    }

    useEffect(() => {
      
      if (!response || response.includes("fl_attachment")) return;

      const urlModificada = agregarFlAttachment(response)
      setResponse(urlModificada)
    }, [response])

    const [loading, setLoading] = useState(false)

    const handleLoading = () => {
      setTimeout(() => {
        setLoading(true);
      }, 10000); // 5000 ms = 5 segundos
    };
    

    return <ClarityContext.Provider value={{ onDrop, uploadProgress, selectedFiles, uploadedFile, handleIncompletedForm, handleUpscalingImg, response, loading, handleLoading, responseIMG}}>
        {children}
    </ClarityContext.Provider>
}

export default ClarityProvider