import React from "react";

import Image from "next/image";
import micOff from "@/assets/micOff mini.svg"

interface MicOffProps {
    onclick: () => void;
}

export function MicOffMini({onclick}: MicOffProps){
    return(
        <div>
            <div className="w-[100%] flex justify-center">
                <button className=" bg-[#DC362E] rounded-[10px] gap-0 flex justify-center items-center space-x-[5%]"
                onClick={onclick}
                >
                    <Image src={micOff} height={50} width={50} alt={"mic"}/>
                </button>
            </div>
        </div>
    );
}