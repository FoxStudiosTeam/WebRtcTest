import React from "react";

import Image from "next/image";
import micOff from "@/assets/Mic-off.svg"

export function MicOff(){
    return(
        <div>
            <div className="w-[100%] flex justify-center">
                <button className=" bg-[#DC362E] w-[372px] h-[77px] rounded-[10px] flex justify-center items-center space-x-[10%]">
                    <p className="text-white text-2xl">ВАС НЕ СЛЫШНО</p>
                    <Image src={micOff} height={35} width={35} alt={"mic"}/>
                </button>
            </div>
        </div>
    );
}