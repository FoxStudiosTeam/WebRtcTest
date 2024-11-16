import { useEffect, useRef, useState } from 'react';

interface WebRTCMessage {
    type: 'join' | 'offer' | 'answer' | 'ice-candidate' | 'user_joined';
    data?: RTCSessionDescriptionInit | RTCIceCandidateInit;
    room?: string;
}

const configuration: RTCConfiguration = {
    iceServers: [
        //{ urls: 'stun:kaiv.space:8100' }
        //{ urls: 'stun:stun.l.google.com:19302' },
       // { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export default function WebRTCChat() {
    const [isJoinButtonDisabled, setIsJoinButtonDisabled] = useState(true);
    const [roomId, setRoomId] = useState('test-room');
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    
    const clientId = useRef(`client_${Math.random().toString(36).substr(2, 9)}`);

    const sendMessage = (message: WebRTCMessage) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
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
                remoteVideoRef.current.srcObject = event.streams[0];
            }
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
            setIsJoinButtonDisabled(false);
        } catch (err) {
            console.error('Error accessing media devices:', err);
        }
    };

    const handleJoinRoom = () => {
        wsRef.current = new WebSocket(`ws://37.110.11.176:9100/ws/${clientId.current}`);
        
        wsRef.current.onopen = () => {
            console.log('Connected to signaling server');
            sendMessage({
                type: 'join',
                room: roomId
            });
        };

        wsRef.current.onmessage = async (event) => {
            const message: WebRTCMessage = JSON.parse(event.data);
            console.log('Received message:', message);
            
            try {
                switch (message.type) {
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
            setIsAudioMuted(!isAudioMuted);
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !isAudioMuted;
            });
        }
    };

    const handleToggleVideo = () => {
        if (localStreamRef.current) {
            setIsVideoMuted(!isVideoMuted);
            localStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = !isVideoMuted;
            });
        }
    };

    useEffect(() => {
        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            peerConnectionRef.current?.close();
            wsRef.current?.close();
        };
    }, []);

    return (
        <div>
            <div className="video-container">
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                />
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                />
            </div>
            <div className="controls">
                <input
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter room ID"
                />
                <button
                    onClick={handleJoinRoom}
                    disabled={isJoinButtonDisabled}
                >Join Room
                </button>
                <button
                onClick={handleStartCamera}>Start Camera
                </button>
                <button
                    onClick={handleToggleAudio}
                    disabled={!localStreamRef.current}
                >
                    {isAudioMuted ? 'Mute Mic' : 'Unmute Mic'}
                </button>
                <button
                    onClick={handleToggleVideo}
                    disabled={!localStreamRef.current}
                >
                    {isVideoMuted ? 'Disable Video' : 'Enable Video'}
                </button>
            </div>
            <style jsx>{`
                .video-container {
                    display: flex;
                    gap: 20px;
                    margin: 20px;
                }
                video {
                    width: 400px;
                    background: #2f2f2f;
                }
                .controls {
                    margin: 20px;
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
            `}</style>
        </div>
    );
}
