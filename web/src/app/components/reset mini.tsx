import React from "react";

import Image from "next/image";
import phone from "@/assets/phone mini.svg"

interface ResetProps {
    onclick: () => void;
}

export function Reset({onclick}: ResetProps){
    return(
      <div>
          <div className="w-[100%] flex justify-center">
              <button className=" bg-[#DC362E] active:bg-[#B82D26] rounded-[10px] gap-0 flex justify-center items-center space-x-[5%]"
              onClick={onclick}
              >
                  <Image src={phone} height={50} width={50} alt={"phone"}/>
              </button>
          </div>
      </div>
    );
}