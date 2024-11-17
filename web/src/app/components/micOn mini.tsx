import React from "react";

import Image from "next/image";
import micOn from "@/assets/micOn mini.svg"
interface MicOffProps {
    onclick: () => void;
}

export function MicOnMini({onclick}: MicOffProps){
    return(
        <div>
            <div className="w-[100%] flex justify-center">
                <button className="relative
bg-[#004899] rounded-[10px] gap-0 flex justify-center items-center space-x-[5%]"
                        onClick={onclick}
                >
                    <Image className="relative" src={micOn} height={50} width={50} alt={"mic"}/>
                </button>
            </div>
        </div>
    );
}