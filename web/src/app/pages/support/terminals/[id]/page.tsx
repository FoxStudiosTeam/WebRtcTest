"use client";

import {useEffect, useRef, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import { Header } from "@/app/components/header";
import axios from "axios";
import {Reset} from "@/app/components/reset mini";
import {VolPlus} from "@/app/components/volPlus mini";
import {VolMinus} from "@/app/components/volMinus mini";
import {CamOnMini} from "@/app/components/camOn mini";
import {CamOffMini} from "@/app/components/camOff mini";
import {MicOffMini} from "@/app/components/micOff mini";
import {MicOnMini} from "@/app/components/micOn mini";
import {Transfer} from "@/app/components/transfer";

interface RoomDetails {
    uuid: string;
    name: string;
    physicalAddress: string;
    state: string;
    clientUid: string;
    operatorUid: string;
}

interface WebRTCMessage {
    type: 'join' | 'offer' | 'answer' | 'ice-candidate' | 'user_joined' | 'disconnect' | 'user_left';
    data?: RTCSessionDescriptionInit | RTCIceCandidateInit;
    room?: string;
}

const configuration: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:kaiv.space:3478' },
        //{ urls: 'stun:stun.l.google.com:19302' },
        //{ urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export default function CallRoom() {
    const params = useParams();
    const router = useRouter();
    const [room, setRoom] = useState<RoomDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isJoinButtonDisabled, setIsJoinButtonDisabled] = useState(true);
    const [roomId, setRoomId] = useState(params.id as string);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

    const volumeStep = 0.25;
    const volumeMax = 2.0;
    const volumeMin = -1.0;


    const clientId = useRef(`client_${Math.random().toString(36).substr(2, 9)}`);

    const sendMessage = (message: WebRTCMessage) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    };
    

    

    const handleEndCall = () => {
        sendMessage({
            type: 'disconnect',
            room: roomId
        });
        // Закрываем WebSocket
        wsRef.current?.close();
        wsRef.current = null;

        // Останавливаем RTCPeerConnection
        peerConnectionRef.current?.close();
        peerConnectionRef.current = null;

        // Останавливаем все треки локального потока
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;

        // Очищаем видеоэлементы
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        console.log("Call ended");
    };

    

    const createPeerConnection = () => {
        if (peerConnectionRef.current) {
            console.log("Closing existing peer connection");
            peerConnectionRef.current.close();
        }

        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;
        console.log("Created new peer connection", peerConnection);

        // Add local stream
        localStreamRef.current?.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStreamRef.current!);
        });

        // Handle incoming remote stream
        peerConnection.ontrack = event => {
            console.log("Received remote track", event);
            if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== event.streams[0]) {
                if (event.track.kind === 'audio') {
                    // Create audio context and gain node for volume control
                    audioContextRef.current = new AudioContext();
                    const source = audioContextRef.current.createMediaStreamSource(event.streams[0]);
                    gainNodeRef.current = audioContextRef.current.createGain();
                    gainNodeRef.current.gain.value = volume;

                    source.connect(gainNodeRef.current);
                    gainNodeRef.current.connect(audioContextRef.current.destination);
                }
                remoteVideoRef.current.srcObject = event.streams[0];
            }
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            });
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                console.log("Sending ICE candidate", event.candidate);
                sendMessage({
                    type: 'ice-candidate',
                    data: event.candidate,
                    room: roomId
                });
            }
        };

        peerConnection.oniceconnectionstatechange = () => {
            console.log("ICE connection state:", peerConnection.iceConnectionState);
        };

        return peerConnection;
    };
    const updateRoomStatus = async (newState: string) => {
        if (!room) return;

        try {
            const response = await fetch(`http://foxstudios.ru:30009/api/v1/rooms/update/${room.uuid}`, {
                method: "POST",
                body: JSON.stringify({
                    name: room.name,
                    physicalAddress: room.physicalAddress,
                    state: newState,
                    clientUid: room.clientUid,
                    operatorUid: room.operatorUid
                }),
            });
            if (response.status === 200) {
                handleEndCall()
                router.push("/pages/support/terminals/");
            } else {
                console.error("Ошибка при обновлении комнаты:", response.body);
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };
    const handleReset = () => {
        updateRoomStatus("CLOSED");
    };

    const handleTransfer = () => {
        updateRoomStatus("TRANSFERING");
    };
    const handleStartCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            
            // Set initial track states
            stream.getVideoTracks().forEach(track => {
                track.enabled = !isVideoMuted;
            });
            stream.getAudioTracks().forEach(track => {
                track.enabled = !isAudioMuted;
            });
            
            if (peerConnectionRef.current) {
                localStreamRef.current?.getTracks().forEach(track => {
                    peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
                });
            }

            setIsJoinButtonDisabled(false);
        } catch (err) {
            console.error('Error accessing media devices:', err);
        }
    };

    const handleJoinRoom = () => {
        wsRef.current = new WebSocket(`ws://37.110.11.176:8080/ws/operator/${clientId.current}`);

        wsRef.current.onopen = () => {
            console.log('Connected to signaling server');
            sendMessage({
                type: 'join',
                room: roomId
            });
        };

        wsRef.current.onmessage = async (event) => {
            const message: WebRTCMessage = JSON.parse(event.data);
            if (message.type != 'ice-candidate') {
                console.log('Received message:', message);
            }
            try {
                switch (message.type) {
                    case 'user_left':
                        console.log("User left, closing peer connection");
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = null;
                        }
                        handleEndCall();
                        break;
                    case 'user_joined':
                        console.log("User joined, creating offer");
                        const pc1 = createPeerConnection();
                        const offer = await pc1.createOffer();
                        await pc1.setLocalDescription(offer);
                        sendMessage({
                            type: 'offer',
                            data: offer,
                            room: roomId
                        });
                        break;
                    case 'offer':
                        console.log("Received offer, creating answer");
                        const pc2 = createPeerConnection();
                        await pc2.setRemoteDescription(new RTCSessionDescription(message.data as RTCSessionDescriptionInit));
                        const answer = await pc2.createAnswer();
                        await pc2.setLocalDescription(answer);
                        sendMessage({
                            type: 'answer',
                            data: answer,
                            room: roomId
                        });
                        break;
                    case 'answer':
                        console.log("Received answer");
                        if (peerConnectionRef.current) {
                            await peerConnectionRef.current.setRemoteDescription(
                                new RTCSessionDescription(message.data as RTCSessionDescriptionInit)
                            );
                        }
                        break;
                    case 'ice-candidate':
                        console.log("Received ICE candidate");
                        if (peerConnectionRef.current) {
                            try {
                                await peerConnectionRef.current.addIceCandidate(
                                    new RTCIceCandidate(message.data as RTCIceCandidateInit)
                                );
                            } catch (e) {
                                console.error("Error adding received ice candidate", e);
                            }
                        }
                        break;
                    case 'disconnect':
                        console.log("Received disconnect message");
                        handleEndCall();
                        break;
                }
            } catch (e) {
                console.error("Error handling message", e);
            }
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };
    };

    const handleToggleAudio = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = isAudioMuted;
            });
            setIsAudioMuted(!isAudioMuted);
        }
    };

    const handleToggleVideo = () => {
        if (localStreamRef.current) {
            const videoTracks = localStreamRef.current.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = isVideoMuted;
            });
            setIsVideoMuted(!isVideoMuted);
            
            // Force video element update
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null;
                localVideoRef.current.srcObject = localStreamRef.current;
            }
        }
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = newVolume;
        }
    };

    const addVolume = () => {
        setVolume(clamp(volume + volumeStep, volumeMin, volumeMax));
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume;
        }
    };

    const decVolume = () => {
        setVolume(clamp(volume - volumeStep, volumeMin, volumeMax));
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume;
        }
    };


    
    useEffect(() => {
        const roomId = params?.id;
        
        // Cleanup function to properly stop all tracks and close connections
        const cleanup = () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };

        // Create an async function inside useEffect
        const initCamera = async () => {
            // Clean up existing streams and connections first
            cleanup();
            
            try {
                await handleStartCamera();
                console.log("Camera started");
                if (!roomId) return;

                axios
                    .get(`http://foxstudios.ru:30009/api/v1/rooms/get/${roomId}`)
                    .then((response) => {
                        setRoom(response.data);
                        setLoading(false);
                        if (!wsRef.current) {
                            handleJoinRoom();
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching room details:", error);
                        setError("Не удалось загрузить данные.");
                        setLoading(false);
                    });
            } catch (error) {
                console.error("Failed to initialize camera:", error);
                setError("Не удалось инициализировать камеру.");
                setLoading(false);
            }
        };

        // Call the async function
        initCamera();

        // Cleanup when component unmounts or roomId changes
        return cleanup;
    }, [params?.id]);

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
        <>
            <Header/>
            <div className='absolute bg-white w-full h-full'>
                <div className="w-full h-[100vh] bg-white absolute">
                    <video className='w-full h-[100vh] object-contain'
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                    />
                </div>

                <div className="w-[200px] h-fit absolute top-[30px] left-[30px]">
                    <video className='rounded-[10px] w-full h-full object-contain'
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                    />
                </div>

                <div className="absolute top-[10px] right-[10px]">
                    <div className="flex flex-col gap-2">
                        <VolPlus onclick={addVolume}/>
                        <VolMinus onclick={decVolume}/>
                    </div>
                </div>

                <div className="controls flex justify-center gap-10 bottom-[24px] w-full absolute z-10">
                    {/*<input*/}
                    {/*    className='absolute left-0 bg-green-500 text-red-500 text-center rounded'*/}
                    {/*    value={roomId}*/}
                    {/*    onChange={(e) => setRoomId(e.target.value)}*/}
                    {/*    placeholder="Enter room ID"*/}
                    {/*/>*/}
                    {/*<button*/}
                    {/*    className='absolute left-0 top-[-2rem] bg-green-500 text-red-500 text-center rounded'*/}
                    {/*    onClick={handleJoinRoom}*/}
                    {/*    disabled={isJoinButtonDisabled}*/}
                    {/*>Join Room*/}
                    {/*</button>*/}
                    {/*<button*/}
                    {/*    className='absolute left-0 top-[-4rem] bg-green-500 text-red-500 text-center rounded'*/}
                    {/*    onClick={handleStartCamera}>Start Camera*/}
                    {/*</button>*/}
                    <div className="bg-[#F0F4F8] flex space-x-5 p-3 px-5 rounded-[10px] shadow-2xl">
                        {isVideoMuted ? <CamOnMini onclick={handleToggleVideo}/> :
                            <CamOffMini onclick={handleToggleVideo}/>}
                        {isAudioMuted ? <MicOffMini onclick={handleToggleAudio}/> :
                            <MicOnMini onclick={handleToggleAudio}/>}
                        <Reset onclick={handleReset}/>
                        <Transfer onclick={handleTransfer}/>
                    </div>
                    <input
                        type="range"
                        min={`${volumeMin}`}
                        max={`${volumeMax}`}
                        step={`${volumeStep}`}
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className=" hidden
                    w-[200px] rotate-[-90deg] absolute right-[-80px] bottom-[190px]
                    h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700
                    scale-[2]
                    "
                    />
                </div>
            </div>
        </>
    );
}
