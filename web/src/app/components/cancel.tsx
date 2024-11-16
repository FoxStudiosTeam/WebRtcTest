import React from "react";

import Image from "next/image";
import phone from "@/assets/Phone.svg"

export function Cancel(){
    return(
      <div>
          <div className="w-[100%] flex justify-center">
              <button className=" bg-[#DC362E] w-[372px] h-[77px] rounded-[10px] flex justify-center items-center space-x-[10%]">
                  <p className="text-white text-2xl">ОТМЕНИТЬ</p>
                  <Image src={phone} height={35} width={35} alt={"phone"}/>
              </button>
          </div>
      </div>
    );
}