import React from "react";

import Image from "next/image";
import micOff from "@/assets/Mic-off.svg"

interface MicOffProps {
    onclick: () => void;
}

export function MicOff({onclick}: MicOffProps){
    return(
        <div>
            <div className="w-[100%] flex justify-center">
                <button className=" bg-[#DC362E] w-[372px] h-[77px] rounded-[10px] gap-0 flex justify-center items-center space-x-[5%]"
                onClick={onclick}
                >
                    <p className="text-white text-2xl">ВАС НЕ СЛЫШНО</p>
                    <Image src={micOff} height={34} width={34} alt={"mic"}/>
                </button>
            </div>
        </div>
    );
}