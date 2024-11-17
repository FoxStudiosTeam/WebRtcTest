"use client";

import { useEffect, useState } from "react";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";

interface RoomDetails {
    uuid: string;
    name: string;
    physicalAddress: string;
    state: string;
    clientUid: string;
    operatorUid: string | null;
}

export default function RoomDetails() {
    const param = useParams();
    const [room, setRoom] = useState<RoomDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const roomUid = param?.id;

        if (!roomUid) return;

        axios
            .get(`http://localhost:30009/api/v1/rooms/get/${roomUid}`)
            .then((response) => {
                setRoom(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching room details:", error);
                setError("Не удалось загрузить данные.");
                setLoading(false);
            });
    }, [param?.id]);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!room) {
        return <p>Комната не найдена.</p>;
    }

    return (
        <div>

        </div>
    );
}
