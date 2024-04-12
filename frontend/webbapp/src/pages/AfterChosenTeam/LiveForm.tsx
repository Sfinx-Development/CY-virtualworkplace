


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng"; // Importera AgoraRTC SDK
import {
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
  LocalUser,
  RemoteUser
} from "agora-rtc-react";
import { useAppSelector } from "../../slices/store";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { AIDenoiserExtension } from "agora-extension-ai-denoiser";

export const LiveVideo = () => {
  const appId = import.meta.env.VITE_APP_AGORA_APP_ID ?? "";
  const activeMeetingId = useAppSelector((state) => state.meetingSlice.activeMeetingId);
  const navigate = useNavigate();

  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);

  // track the mic/video state - Turn on Mic and Camera On
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(false);

  // get local video and mic tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  // Join the channel
  useJoin({
    appid: appId,
    channel: activeMeetingId!,
    token: null,
  }, activeConnection);

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const activeProfile = useAppSelector((state) => state.profileSlice.activeProfile);

  // Play the remote user audio tracks
  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  // Initialize AIDenoiserExtension and processor
  useEffect(() => {
    const initializeProcessor = async () => {
      const denoiser = new AIDenoiserExtension({ assetsPath: './external' });
      AgoraRTC.registerExtensions([denoiser]);

      // Handle loading error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      denoiser.onloaderror = (e: any) => {
        console.error('Failed to load AIDenoiserExtension:', e);
      };

      // Create processor
      const processor = denoiser.createProcessor();

      // Enable processor by default
      processor.enable();

      // Connect processor to microphone audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      audioTrack.pipe(processor).pipe(audioTrack.processorDestination);

      // Optional: Listen to processor overload callback
      processor.onoverload = async () => {
        console.log("overload!!!");
        await processor.disable();
      };

      // Dump audio
      processor.ondump = (blob, name) => {
        const objectURL = URL.createObjectURL(blob);
        const tag = document.createElement("a");
        tag.download = name + ".wav";
        tag.href = objectURL;
        tag.click();
      };

      processor.ondumpend = () => {
        console.log("dump ended!!");
      };

      processor.dump();
    };

    initializeProcessor();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <>
      <div id="remoteVideoGrid">
        {
          // Initialize each remote stream using RemoteUser component
          remoteUsers.map((user) => (
            <div key={user.uid} className="remote-video-container">
              <p>{activeProfile?.fullName}</p>
              <RemoteUser user={user} />
            </div>
          ))
        }
      </div>
      <div id="localVideo">
        <LocalUser
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={micOn}
          playVideo={cameraOn}
          className=""
        />
        <div>
          {/* media-controls toolbar component - UI controlling mic, camera, & connection state */}
          <div id="controlsToolbar">
            <div id="mediaControls">
              <button className="btn" onClick={() => setMic((a) => !a)}>
                {micOn ? <MicIcon /> : <MicOffIcon />}
              </button>
              <button className="btn" onClick={() => setCamera((a) => !a)}>
                {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
              </button>
            </div>
            <button
              id="endConnection"
              className="btn"
              onClick={() => {
                setActiveConnection(false);
                navigate("/meetingroom");
              }}
            >
              Lämna
            </button>
          </div>
        </div>
      </div>
    </>
  );
};


