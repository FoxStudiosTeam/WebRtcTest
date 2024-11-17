import React from "react";

import Image from "next/image";
import camOff from "@/assets/camOff mini.svg"

interface CamOffProps {
    onclick: () => void;
}

export function CamOffMini({onclick}: CamOffProps){
    return(
        <div>
            <div className="w-[100%] flex justify-center">
                <button className=" bg-[#DC362E] rounded-[10px] gap-0 flex justify-center items-center space-x-[5%]"
                onClick={onclick}
                >
                    <Image src={camOff} height={50} width={50} alt={"cam"}/>
                </button>
            </div>
        </div>
    );
}