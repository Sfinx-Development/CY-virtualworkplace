import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EnterHouse() {
  const navigate = useNavigate();

  useEffect(() => {
    const video = document.getElementById("video");

    const handleVideoEnd = () => {
      navigate("/menu");
    };

    if (video) {
      video.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (video) {
        video.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, [navigate]);

  return (
    <video id="video" autoPlay style={{ height: "100%", width: "100%" }}>
      <source src="https://i.imgur.com/s4D0XN7.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
