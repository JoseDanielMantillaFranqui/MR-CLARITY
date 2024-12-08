import { useState, useEffect, useContext, createContext, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { CloudinaryImage } from "@cloudinary/url-gen"; // Para manejar imágenes
import { upscale } from "@cloudinary/url-gen/actions/effect"; // Para aplicar el efecto de upscale
import { set } from "@cloudinary/url-gen/actions/variable";


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
        formData.append('upload_preset', import.meta.env.VITE_PRESET); 
    
        try {
          setUploading(true);
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dduz5dnhy/image/upload',
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

      const modifyFileName = (file) => {
        const randomNum = Math.floor(Math.random() * 100) + 1; // Genera un número aleatorio entre 1 y 100
        const fileExtension = file.name.split('.').pop(); // Obtiene la extensión del archivo
        const baseName = file.name.replace(`.${fileExtension}`, ''); // Obtiene el nombre base del archivo sin la extensión
        const newFileName = `${baseName}-${randomNum}.${fileExtension}`; // Crea el nuevo nombre
      
        const modifiedFile = new File([file], newFileName, { type: file.type });
        return modifiedFile;
      };

    useEffect(() => {
        if (selectedFiles?.name) {
            const modifiedFile = modifyFileName(selectedFiles)
            uploadToCloudinary(modifiedFile)
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

    const handleUpscalingImg = () => {
      const form = new FormData();
      form.append('upscale_factor', '4');
      form.append('format', 'JPG');
      form.append('image_url', uploadedFile.url);
    
      const options = {
        method: 'POST',
        url: 'https://api.picsart.io/tools/1.0/upscale',
        headers: {
          accept: 'application/json',
          'X-Picsart-API-Key': import.meta.env.VITE_PICSART, // Asegúrate de que esta clave es válida
        },
        data: form, // Aquí pasamos directamente el FormData
      };
    
      axios
        .request(options)
        .then((res) => {
          setResponse(res.data.data.url);
          setResponseIMG(res.data.data.url);
          console.log('Upscaling realizado con éxito:', res);
        })
        .catch((error) => {
          console.error('Error al realizar el upscale:', error.message);
          handleIncompletedForm(`
            <img class="error__icon" src="https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif" alt="Error" />
            <p>Error: ${error.message}</p>
          `);
        })
        .finally(() => {
          setLoading(true); // Cambié `true` a `false` porque la carga termina aquí
        });
    };

    const [loading, setLoading] = useState(false)
    

    return <ClarityContext.Provider value={{ onDrop, uploadProgress, selectedFiles, uploadedFile, handleIncompletedForm, handleUpscalingImg, response, loading, responseIMG}}>
        {children}
    </ClarityContext.Provider>
}

export default ClarityProvider