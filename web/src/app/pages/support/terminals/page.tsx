"use client";

import { useEffect, useState } from "react";
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
        axios.get("http://localhost:30009/api/v1/rooms/all").then((response) => {
                setRooms(response.data);
                setLoading(false);
            }).catch((error) => {
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

    return (
        <div>
            <Header />
            <div className="flex flex-row flex-wrap justify-center h-[94vh]">
                {rooms.map((room) => (
                    <Link
                        href={`/pages/support/terminals/${room.uuid}`}
                        key={room.uuid}
                        className="rounded-[10px] w-[300px] m-5 h-[200px] shadow-xl transition duration-150 ease-in-out sm:hover:scale-105"

                    >
                        <div className="grid grid-rows-3 gap-1 h-full">
                            <h2 className="text-base font-bold truncate flex items-center justify-center">
                                {room.name}
                            </h2>
                            <p className="text-gray-700 px-5 flex items-top flex-wrap">
                                Адрес: {room.physicalAddress}
                            </p>
                            <div className="flex gap-3 bg-[#F0F4F8] px-5 h-full items-center rounded-br-lg rounded-bl-lg">
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
