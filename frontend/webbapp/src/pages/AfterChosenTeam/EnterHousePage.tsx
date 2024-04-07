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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <video
        id="video"
        autoPlay
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
      >
        <source src="https://i.imgur.com/hnhgiju.mp4" type="video/mp4" />
        Din webbläsare accepterar inte videotypen.
      </video>
    </div>
  );
}
