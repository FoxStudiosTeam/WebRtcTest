import React from "react";

import Image from "next/image";
import micOn from "@/assets/Mic-on.svg"

export function MicOn(){
    return(
        <div>
            <div className="w-[100%] flex justify-center">
                <button className=" bg-[#004899] w-[372px] h-[77px] rounded-[10px] flex justify-center items-center space-x-[10%]">
                    <p className="text-white text-2xl">ВАС СЛЫШНО</p>
                    <Image src={micOn} height={30} width={19.09} alt={"mic"}/>
                </button>
            </div>
        </div>
    );
}