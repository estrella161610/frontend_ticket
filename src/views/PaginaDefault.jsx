import { Link } from 'react-router-dom';
import LogoEpicore from '../assets/img/logo_epicore.png';


export const PaginaDefault = () => {
  return (
    <div className='min-h-screen flex flex-col'>
        <div className='flex justify-center mb-8'>
            <img src={LogoEpicore} alt="Logo Epicore" className="w-32" />
        </div>
        <div className='flex flex-col justify-center flex-grow px-12'>
            <div className='flex flex-col items-start'>
                <p className='font-bold text-4xl mb-4 ml-8 text-azul'>¡Lo sentimos!</p>
                <p className='text-3xl ml-8'>Parece que la página que estás buscando <span className='font-bold text-azul'>no existe</span></p>
                <Link to="/" className="btn btn-wide ml-8 mt-5 bg-mandarin text-white hover:bg-orange-500">Volver al Inicio</Link>
            </div>
        </div>
    </div>
  );
}