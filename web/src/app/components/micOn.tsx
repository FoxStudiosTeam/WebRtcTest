import React from "react";

import Image from "next/image";
import micOn from "@/assets/Mic-on.svg"
interface MicOffProps {
    onclick: () => void;
}

export function MicOn({onclick}: MicOffProps){
    return(
        <div>
            <div className="w-[100%] flex justify-center">
                <button className="relative
bg-[#004899] w-[372px] h-[77px] rounded-[10px] gap-0 flex justify-center items-center space-x-[5%]"
                onClick={onclick}
                >
                    <p className="text-white text-2xl">ВАС СЛЫШНО</p>
                    <Image className="relative" src={micOn} height={34} width={34} alt={"mic"}/>
                </button>
            </div>
        </div>
    );
}