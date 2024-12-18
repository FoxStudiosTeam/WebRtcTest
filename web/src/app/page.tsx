"use client"

import {Header} from "@/app/components/header";
import {useRouter} from "next/navigation";


export default function Home() {
    const router = useRouter()
    const handleClick1 = () => {
        if (true) {
            router.push('/pages/support/');
        }
    };
    const handleClick2 = () => {
        if (true) {
            router.push('/pages/terminal/');
        }
    };
    const handleClick3 = () => {
        if (true) {
            router.push('/pages/specialists/');
        }
    };
  return (
      <div className="flex flex-col h-[100vh]">
          <Header/>
          <div className="flex justify-center items-center h-full bg-gray-100">
              <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                  <h1 className="text-2xl font-semibold text-center mb-6 text-black">Кто ты?</h1>
                  <form className="h-[250px]">
                      <button
                          type="button"
                          onClick={handleClick3}
                          className="w-full py-2 my-5 h-[50px] bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                      >
                          Я специалист
                      </button>
                      <button
                          type="button"
                          onClick={handleClick1}
                          className="w-full py-2 my-5 h-[50px] bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                      >
                          Я оператор
                      </button>
                      <button
                          type="button"
                          onClick={handleClick2}
                          className="w-full py-2 my-5 h-[50px] bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                      >
                          Я клиент
                      </button>
                  </form>
              </div>
          </div>
      </div>
  );
}
