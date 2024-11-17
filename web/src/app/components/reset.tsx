import React from "react";

import Image from "next/image";
import phone from "@/assets/Phone.svg"

interface ResetProps {
    onclick: () => void;
}

export function Reset({onclick}: ResetProps){
    return(
      <div>
          <div className="w-[100%] flex justify-center">
              <button className=" bg-[#DC362E] active:bg-[#B82D26] w-[372px] h-[77px] rounded-[10px] gap-0 flex justify-center items-center space-x-[5%]"
              onClick={onclick}
              >
                  <p className="text-white text-2xl">ЗАВЕРШИТЬ</p>
                  <Image src={phone} height={40} width={40} alt={"phone"}/>
              </button>
          </div>
      </div>
    );
}