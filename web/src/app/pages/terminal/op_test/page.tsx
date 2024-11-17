"use client"

import WebRTCChat from "@/app/components/socket_cam";


export default function TerminalCallTest(){
    return(
        <WebRTCChat isOperator={true}/>
    );
}