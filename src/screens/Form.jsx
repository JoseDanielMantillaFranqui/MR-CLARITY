import '../style.css'
import { useDropzone } from "react-dropzone";
import { useClarity } from '../hooks/useClarity';
import { useNavigate } from 'react-router-dom';



const Form = () => {

    const {onDrop, uploadProgress, selectedFiles, uploadedFile, handleIncompletedForm, handleUpscalingImg, handleLoading} = useClarity()
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {   'image/jpeg': [],
        'image/png': [],
        'image/webp': [],
        'image/heic': [],
        'image/jfif': [],}
        ,multiple: false });

        const navigate = useNavigate()

        const handleClickForResponse = () => {
            console.log('boton funcionando')

            if (!selectedFiles?.name) {
                return handleIncompletedForm('<img class="error__icon" src= "https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif"/><p>Debes subir una imagen</p>')
            }

            handleUpscalingImg()
            handleLoading()
            navigate('/response')
        }

        

    return <>
    <section className="main__container">
        <div className="interface">
            <div className="interface__card">
                <h1 className='card__title'>
                    Mr. Clarity
                </h1>
                { !selectedFiles?.name && <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone__active' : ''}`}>
                <input {...getInputProps()} />
                <p className='dropzone__text'>{isDragActive ? "Suelta la imagen aquí..." : "Arrastra y suelta la imagen a mejorar calidad"}</p>
                </div>}
                { selectedFiles?.name && <div className='dropzone__loading'>
                    <p className='dropzone__filename'>{selectedFiles.name}</p>
                    {
                        uploadProgress === 'Archivo subido' && <img src={uploadedFile.url} className='dropzone__image' />
                    }
                    <div className='loading__borderBar' uploadprogress={uploadProgress === 'Archivo subido' ? uploadProgress : `${uploadProgress}%`}>
                        <div className='loading__bar' style={{ width: `${uploadProgress}%`}}></div>
                    </div>
                </div>}
                <button className='card__buttonToResponse' onClick={handleClickForResponse} >Mejorar calidad de tu imagen</button>
                <a href="https://daniels-portafolio.vercel.app/" className="card__footer">
                        <p className="glitch" data-glitch="<> Daniel Franqui </>">{'<> Daniel Franqui </>'}</p>
                </a> 
            </div>
        </div>
    </section>
</>
}

export default Form