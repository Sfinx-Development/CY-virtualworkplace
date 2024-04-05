import FourBackGroundDesign from "../../components/4ColorsWave";
import { theme1 } from "../../theme";

export default function TextWave() {
  return (
    <FourBackGroundDesign
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
      color1={theme1.palette.office.main}
      color3={theme1.palette.leave.main}
      color4={theme1.palette.room.main}
      color2={theme1.palette.chat.main}
    />
  );
}
