import React from "react";

import Image from "next/image";
import vol from "@/assets/volMinus.svg"

interface ResetProps {
    onclick: () => void;
}

export function VolMinus({onclick}: ResetProps){
    return(
      <div>
          <div className="w-[100%] flex justify-center">
              <button className=" bg-[#004899] active:bg-[#004899] rounded-[10px] gap-0 flex justify-center items-center space-x-[5%]"
              onClick={onclick}
              >
                  <Image src={vol} height={50} width={50} alt={"vol"}/>
              </button>
          </div>
      </div>
    );
}