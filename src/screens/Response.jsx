import "../style.css"
import { Link, useNavigate } from "react-router-dom"
import { useClarity } from "../hooks/useClarity"
import { useEffect } from "react"
import axios from "axios"

const Response = () => {

    const { response, loading, responseIMG, handleIncompletedForm, uploadedFile } = useClarity()

    const navigate = useNavigate()

    useEffect(() => {
        const handlePopState = (event) => {
              event.preventDefault()
              window.location.replace('/form')
          }
    
        window.addEventListener('popstate', handlePopState);
  
      }, [navigate]);

      const downloadIMG = async () => {
        try {
          const fileURL = response; // URL de la imagen generada
          const res = await axios.get(fileURL, { responseType: "blob" }); // Obtén los datos como blob
      
          // Crea un enlace temporal
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
      
          // Define el nombre del archivo descargado
          link.setAttribute("download", "imagen-generada.jpg");
      
          // Agrega y hace clic en el enlace
          document.body.appendChild(link);
          link.click();
      
          // Limpia los recursos temporales
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error al descargar la imagen:", error.message);
          handleIncompletedForm(`
            <img class="error__icon" src="https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif" alt="Error" />
            <p>Error: ${error.message}</p>
          `);
        }
      };

      
      useEffect(() => {
        uploadedFile?.url ? null : navigate('/form')
      }, [uploadedFile])
      

    return <>
    <section className="main__container">
        <div className="interface">
            <div className="interface__card">
                <h1 className='card__title'>
                    Mr. Clarity
                </h1>
                {loading === false ? <img className="card__loading" src="https://i.gifer.com/SVKl.gif"/> : <img src={responseIMG} className="card__imageResponse"/>
                    }
{                   loading === false ? <div></div> : <div className='card__button' style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%'}}>
                    <span onClick={downloadIMG} className="card__buttonToDownload">Descargar imagen</span>
                    <a className='card__buttonToForm' href="/form">Volver</a>
                </div>    }               
            </div>
        </div>
    </section>
</>
}

export default Response