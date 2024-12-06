import "../style.css"
import { Link, useNavigate } from "react-router-dom"
import { useClarity } from "../hooks/useClarity"
import { useEffect } from "react"

const Response = () => {

    const { response, loading } = useClarity()

    const navigate = useNavigate()

    useEffect(() => {
        const handlePopState = (event) => {
              event.preventDefault()
              window.location.replace('/form')
          }
    
        window.addEventListener('popstate', handlePopState);
  
      }, [navigate]);

    return <>
    <section className="main__container">
        <div className="interface">
            <div className="interface__card">
                <h1 className='card__title'>
                    Mr. Clarity
                </h1>
                {loading === false ? <img className="card__loading" src="https://i.gifer.com/SVKl.gif"/> : <img src={response} className="card__imageResponse"/>
                    }
{                   loading === false ? <div></div> : <div className='card__button' style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%'}}>
                    <a href={response} download className="card__buttonToDownload">Descargar imagen</a>
                    <a className='card__buttonToForm' href="/form">Volver</a>
                </div>    }               
            </div>
        </div>
    </section>
</>
}

export default Response