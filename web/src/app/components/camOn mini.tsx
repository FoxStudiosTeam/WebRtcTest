import React from "react";

import Image from "next/image";
import camOn from "@/assets/camOn mini.svg"
interface CamOffProps {
    onclick: () => void;
}

export function CamOnMini({onclick}: CamOffProps){
    return(
        <div>
            <div className="w-[100%] flex justify-center">
                <button className="relative
bg-[#004899] rounded-[10px] gap-0 flex justify-center items-center space-x-[5%]"
                        onClick={onclick}
                >
                    <Image className="relative" src={camOn} height={50} width={50} alt={"cam"}/>
                </button>
            </div>
        </div>
    );
}