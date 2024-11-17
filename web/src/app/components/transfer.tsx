import React from "react";

import Image from "next/image";
import transfer from "@/assets/transfer.svg"

interface ResetProps {
    onclick: () => void;
}

export function Transfer({onclick}: ResetProps){
    return(
      <div>
          <div className="w-[100%] flex justify-center">
              <button className=" bg-[#004899] active:bg-[#B82D26] rounded-[10px] gap-0 flex justify-center items-center space-x-[5%]"
              onClick={onclick}
              >
                  <Image src={transfer} height={50} width={50} alt={"transfer"}/>
              </button>
          </div>
      </div>
    );
}