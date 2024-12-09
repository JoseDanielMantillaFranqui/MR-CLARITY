import '../style.css'

const Page404 = () => {
    return  <>
    <section className="main__container">
        <div className="interface interface__page404">
            <div className="interface__card interface__card__page404" >
            <img class="error__icon" src="https://cdn.dribbble.com/users/251873/screenshots/9388228/error-img.gif" alt="Error" />
                <h1 className='card__title card__title__page404'>
                    ERROR 404:
                    <br />
                    Recurso no encontrado
                </h1>              
            </div>
        </div>
    </section>
</>
}

export default Page404