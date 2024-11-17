"use client"

import {Header} from "@/app/components/header";
import { useRouter } from 'next/navigation'


export default function FSpecialist(){
    const router = useRouter()
    const handleClick = () => {
        if (true) {
            router.push('/pages/specialists/terminals');
        }
    };
    return(
        <div className="flex flex-col h-[100vh]">
            <Header/>
            <div className="flex justify-center items-center h-full bg-gray-100">
                <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md bg-[F0F4F8]">
                    <h1 className="text-2xl font-semibold text-center mb-6 text-black ">Авторизация</h1>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="login" className="block text-gray-700 font-medium mb-1">
                                Логин
                            </label>
                            <input
                                type="text"
                                id="login"
                                placeholder="Введите логин"
                                autoComplete="off"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Введите пароль"
                                autoComplete="off"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleClick}
                            className="w-full py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Начать работу
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}