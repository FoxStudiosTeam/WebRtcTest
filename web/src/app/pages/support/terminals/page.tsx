"use client"

import {Header} from "@/app/components/header";
import Link from "next/link";
import Image from "next/image";
import stat from "@/assets/stat.svg";
export default function Terminals() {
    return(
        <div>
            <Header/>
            <div className="flex flex-row flex-wrap justify-center h-[94vh]">
                <div
                    className="rounded-[10px] w-[300px] m-5 h-[200px] shadow-xl transition duration-150 ease-in-out sm:hover:scale-105">
                    <div className="grid grid-rows-3 gap-1 h-full">
                        <h2 className="text-base font-bold truncate flex items-center justify-center">Терминал 1</h2>
                        <p className="text-gray-700 px-5 flex items-top flex-wrap">Адрес:</p>
                        <div className="flex gap-3 bg-[#F0F4F8] px-5 h-full items-center rounded-br-lg rounded-bl-lg">
                            <Image src={stat} alt="stat"/>
                            <p className="text-gray-700">Свободен</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}