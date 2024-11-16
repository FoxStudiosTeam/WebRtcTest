"use client"


/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import loading from "@/assets/loading.svg"

export default function FTerminal(){
    return(
        <div className="bg-[#F0F4F8] flex flex-col justify-center h-[100vh]">
            <p className="font-bold text-[50px] text-black w-full text-center">
                Служба поддержки
            </p>
            <div className="w-[100%] flex justify-center">
                <button
                    className="text-white font-bold text-2xl bg-[#004899] w-[600px] h-[77px] rounded-[10px]">ЗАПРОСИТЬ
                    ЗВОНОК
                </button>
            </div>
            <div className="w-[100%] flex justify-center">
                <Image src={loading} width={200} height={200} alt="загрузка" />
            </div>
        </div>
    );
}