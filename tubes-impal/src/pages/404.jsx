import { useRouteError } from "react-router-dom";

const NotFoundPage = () => {
    const error = useRouteError();
    return(
        <div className="flex justify-center min-h-screen items-center bg-white flex-col">
            <h1 className="text-4xl font-bold">Oops! Error</h1>
            <p className="my-5 text-xl">Maaf, tidak dapat menemukan halaman page yang anda cari</p>
            <p className="text-2xl">{error.statusText || error.message}</p>
        </div>
    )
}

export default NotFoundPage;