"use client"
import { useEffect, useState } from "react";

const constraints = {
    audio: false,
    video: true,
};

export default function Camera() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSuccess = (stream: MediaStream) => {
        const video = document.querySelector("video") as HTMLVideoElement;
        const videoTracks = stream.getVideoTracks();
        console.log("Got stream with constraints:", constraints);
        console.log(`Using video device: ${videoTracks[0].label}`);
        setStream(stream);
        video.srcObject = stream;
    };

    const handleError = (error: unknown) => {
        if (error instanceof OverconstrainedError) {
            setError(`OverconstrainedError: The constraints could not be satisfied by the available devices. Constraints: ${JSON.stringify(constraints)}`);
        } else if (error instanceof DOMException) { //fix
            setError("NotAllowedError: Permissions have not been granted to use your camera and microphone.");
        } else {
            setError(`getUserMedia error: ${error}`);
        }
    };

    const init = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        } catch (e : unknown) {
            handleError(e);
        }
    };

    useEffect(() => {
        return () => {
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return (
        <div id="container">
            <video id="gum-local" autoPlay playsInline></video>
            <button id="showVideo" onClick={init}>
                Open camera
            </button>
            {error && <div id="errorMsg"><p>{error}</p></div>}
        </div>
    );
}
