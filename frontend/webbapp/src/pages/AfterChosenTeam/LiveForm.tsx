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
  RemoteUser,
} from "agora-rtc-react";
import { useAppSelector } from "../../slices/store";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { AIDenoiserExtension } from "agora-extension-ai-denoiser";

export const LiveVideo = () => {
  const appId = import.meta.env.VITE_APP_AGORA_APP_ID ?? "";
  const activeMeetingId = useAppSelector(
    (state) => state.meetingSlice.activeMeetingId
  );
  const navigate = useNavigate();

  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);

  // track the mic/video state - Turn on Mic and Camera On
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(false);

  // get local video and mic tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  useJoin(
    {
      appid: appId,
      channel: activeMeetingId!,
      token: null,
    },
    activeConnection
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  useEffect(() => {
    audioTracks.forEach((track) => track.play());
  }, [audioTracks]);

  useEffect(() => {
    const initializeProcessor = async () => {
      const denoiser = new AIDenoiserExtension({ assetsPath: "./external" });
      AgoraRTC.registerExtensions([denoiser]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      denoiser.onloaderror = (e: any) => {
        console.error("Failed to load AIDenoiserExtension:", e);
      };

      const processor = denoiser.createProcessor();

      processor.enable();

      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      audioTrack.pipe(processor).pipe(audioTrack.processorDestination);

      processor.onoverload = async () => {
        console.log("overload!!!");
        await processor.disable();
      };

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

    return () => {};
  }, []);

  return (
    <>
      <div id="remoteVideoGrid">
        {remoteUsers.map((user) => (
          <div key={user.uid} className="remote-video-container">
            <p>{activeProfile?.fullName}</p>
            <RemoteUser user={user} />
          </div>
        ))}
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
