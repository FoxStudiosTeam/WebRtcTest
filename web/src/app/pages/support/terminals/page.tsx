"use client";

import { SetStateAction, useEffect, useState } from "react";
import { Header } from "@/app/components/header";
import Image from "next/image";
import stat from "@/assets/stat.svg";
import axios from "axios";
import Link from "next/link";

interface Room {
    uuid: string;
    name: string;
    physicalAddress: string;
    state: string;
    clientUid: string;
    operatorUid: string;
}

export default function Terminals() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get("http://foxstudios.ru:30009/api/v1/rooms/all").then((response) => {
                setRooms(response.data);
                setLoading(false);
            }).catch((error: any) => {
                console.error("Error fetching rooms:", error);
                setError("Не удалось загрузить данные.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center"><p>Загрузка...</p></div>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }
    const filteredRooms = rooms.filter((room) => room.state === "NEW");

    if (filteredRooms.length === 0) {
        return (
            <div className="flex flex-col h-[100vh]">
                <Header/>
                <div className="flex justify-center items-center h-full bg-gray-100">
                    <p className="text-center mt-10 text-black text-2xl h-fit w-fit py-4 px-6 shadow-2xl bg-gray-200 rounded-[10px]">Пока нет комнат.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col h-[100vh]">
            <Header />
            <div className="flex flex-row flex-wrap justify-center h-full bg-gray-100">
                {filteredRooms.map((room) => (
                    <Link
                        href={`/pages/support/terminals/${room.uuid}`}
                        key={room.uuid}
                        className="rounded-[10px] w-[300px] m-5 h-[200px] shadow-xl transition duration-150 ease-in-out sm:hover:scale-105"

                    >
                        <div className="grid grid-rows-3 gap-1 h-full">
                            <h2 className="text-base text-gray-700 font-bold truncate flex items-center justify-center">
                                {room.name}
                            </h2>
                            <p className="text-gray-700 px-5 flex items-top flex-wrap">
                                Адрес: {room.physicalAddress}
                            </p>
                            <div className="flex gap-3 bg-gray-200 px-5 py-1 h-full items-center rounded-br-lg rounded-bl-lg">
                                <Image src={stat} alt="stat" />
                                <p className={`text-gray-700`}>
                                    {room.state}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
