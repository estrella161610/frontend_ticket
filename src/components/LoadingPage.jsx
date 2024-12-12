import LogoEpicore from "../assets/img/logo_epicore.png";

const LoadingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <img src={LogoEpicore} alt="Logo Epicore" className="w-24 mb-4" />
            <span className="loading loading-spinner loading-lg text-azul"></span>
        </div>
    );
};

export default LoadingPage;
