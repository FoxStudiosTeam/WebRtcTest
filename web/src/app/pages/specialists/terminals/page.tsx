"use client";

import { useEffect, useState } from "react";
import { Header } from "@/app/components/header";
import Image from "next/image";
import stat from "@/assets/stat.svg";
import axios from "axios";
import Link from "next/link";
import {useRouter} from "next/navigation";

interface Room {
    uuid: string;
    name: string;
    physicalAddress: string;
    state: string;
    clientUid: string;
    operatorUid: string;
}

export default function Terminals() {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = () => {
        axios
            .get("http://foxstudios.ru:30009/api/v1/rooms/all")
            .then((response) => {
                setRooms(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching rooms:", error);
                setError("Не удалось загрузить данные.");
                setLoading(false);
            });
        };
        // Initial fetch
        fetchRooms();

        // Set up interval for periodic fetching
        const interval = setInterval(fetchRooms, 3000);

        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(interval);
        
    }, []);

    const updateRoomStatus = async (newState: string, room: Room) => {
        if (!room) return;

        try {
            const response = await fetch(`http://foxstudios.ru:30009/api/v1/rooms/update/${room.uuid}`, {
                method: "POST",
                body: JSON.stringify({
                    name: room.name,
                    physicalAddress: room.physicalAddress,
                    state: newState,
                    clientUid: room.clientUid,
                    operatorUid: room.operatorUid,
                }),
            });

            if (response.ok) {
                router.push(`/pages/specialists/terminals/${room.uuid}`)
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };
    const handleLL = (room) => {
        updateRoomStatus("FULL",room);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    const filteredRooms = rooms.filter((room) => room.state === "TRANSFERING");

    if (filteredRooms.length === 0) {
        return (
            <div className="flex flex-col h-[100vh] justify-center">
                <Header/>
                <div className="flex justify-center items-center h-full bg-gray-100">
                    <p className="text-center mt-10 text-black text-2xl h-fit w-fit py-4 px-6 shadow-2xl bg-gray-200 rounded-[10px]">Нет комнат со статусом TRANSFERING.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[100vh]">
            <Header/>
            <div className="flex flex-row flex-wrap justify-center h-full bg-gray-100">
                {filteredRooms.map((room) => (
                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            handleLL(room);
                        }}
                        href={`/pages/specialists/terminals/${room.uuid}`}
                        key={room.uuid}
                        className="rounded-[10px] w-[300px] m-5 h-[200px] shadow-xl transition duration-150 ease-in-out sm:hover:scale-105"
                    >
                        <div className="text-gray-700 grid grid-rows-3 gap-1 h-full bg-white rounded-[10px]">
                            <h2 className="text-base font-bold truncate flex items-center justify-center">
                                {room.name}
                            </h2>
                            <p className="text-gray-700 px-5 flex items-top flex-wrap">
                                Адрес: {room.physicalAddress}
                            </p>
                            <div className="flex gap-3 bg-gray-200 px-5 h-full items-center rounded-br-lg rounded-bl-lg">
                                <Image src={stat} alt="stat" />
                                <p className={`text-gray-700`}>{room.state}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
