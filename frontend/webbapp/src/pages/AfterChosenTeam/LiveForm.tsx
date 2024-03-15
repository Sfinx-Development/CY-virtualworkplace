import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { useAppSelector } from "../../slices/store";

export const LiveVideo = () => {
  const appId = "164c628ea4b243ed8ebf6d36d0e1d3c9";

  const activeMeetingId = useAppSelector(
    (state) => state.meetingSlice.activeMeetingId
  );

  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);

  // track the mic/video state - Turn on Mic and Camera On
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(false);

  // get local video and mic tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  // to leave the call
  const navigate = useNavigate();

  // Join the channel
  useJoin(
    {
      appid: appId,
      channel: activeMeetingId!,
      token: null,
    },
    activeConnection
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  //remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  // play the remote user audio tracks
  audioTracks.forEach((track) => track.play());

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
          {/* media-controls toolbar component - UI controling mic, camera, & connection state  */}
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
