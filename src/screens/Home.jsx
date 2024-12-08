import '../style.css'
import 'two-up-element'
import { Link } from 'react-router-dom'
import Lottie from 'react-lottie'
import pointingHand from '../../public/eZocUNTdcU.json'

const Home = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: pointingHand,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return <>
        <section className="main__container">
            <div className="interface">
                <div className="interface__card">
                    <h1 className='card__title'>
                        Mr. Clarity
                    </h1>
                    <two-up class='my-two-up'>
                    <img className='card__image' src='https://res.cloudinary.com/prod/image/upload/e_upscale/me/upscale-face-1'/>
                        <img className='card__image' src='https://res.cloudinary.com/prod/image/upload/me/upscale-face-1'/>
                    </two-up>
                    <div className='card__button'>
                        <Link className='card__buttonToForm' to={'/form'}>Mejora la resolución de tu imagen ahora</Link>
                        <Lottie
                            style={{ position: 'absolute', left: '0px', bottom: '40px', transform: 'rotate(190deg)' }} 
                            options={defaultOptions} 
                            height={100} 
                            width={100}
                        />
                    </div>                   
                </div>
            </div>
        </section>
    </>
}

export default Home