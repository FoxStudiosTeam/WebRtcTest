"use client"
{/*<div className="w-[100%] flex justify-center">*/}
{/*    <Image src={loading} width={200} height={200} alt="загрузка" />*/}
{/*</div>*/}


import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FTerminal() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleCreateRoom() {
        setLoading(true);
        try {
            const response = await fetch("http://foxstudios.ru:30009/api/v1/rooms/create", {
                method: "POST",
                body: JSON.stringify({
                    name: "test",
                    physicalAddress: "test",
                    state: "NEW",
                    clientUid: "test",
                    operatorUid: null,
                }),
            });

            if (!response.ok) {
                throw new Error("Ошибка создания комнаты");
            }

            const data = await response.json();
            const roomUid = data.uuid;

            router.push(`/pages/terminal/call/${roomUid}`);
        } catch (error) {
            console.error("Ошибка:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-[#F0F4F8] flex flex-col justify-center h-[100vh] gap-10">
            <p className="font-bold text-[50px] text-black w-full text-center">
                Служба поддержки
            </p>
            <div className="w-[100%] flex justify-center">
                {loading ? (
                    <div>Загрузка...</div>
                ) : (
                    <button
                        onClick={handleCreateRoom}
                        className="text-white font-bold text-2xl bg-[#004899] w-[600px] h-[77px] rounded-[10px]"
                    >
                        СОЗДАТЬ КОМНАТУ
                    </button>
                )}
            </div>
        </div>
    );
}
