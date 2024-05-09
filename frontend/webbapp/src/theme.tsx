import { createTheme, SimplePaletteColorOptions } from "@mui/material/styles";

//användning i din komponent:
// const officeColor = theme1.palette.office?.main;
//  <Button
// variant="contained"
// sx={{ backgroundColor: officeColor }}
// >

interface CustomPalette {
  primary: SimplePaletteColorOptions;
  calendar: SimplePaletteColorOptions;
  office: SimplePaletteColorOptions;
  room: SimplePaletteColorOptions;
  chat: SimplePaletteColorOptions;
  leave: SimplePaletteColorOptions;
  warning: SimplePaletteColorOptions;
}

declare module "@mui/material/styles" {
  interface Palette extends CustomPalette {}
}

//här kan vi lägga till fler, buttons, background, text osv för varje del
export const theme1 = createTheme({
  palette: {
    primary: {
      main: "#f15c6f",
    },
    office: {
      main: "#e7b46b",
    },
    calendar: {
      main: "#fff6f2",
    },
    room: {
      main: "#52b0d9",
    },
    chat: {
      main: "#b4838f",
    },
    leave: {
      main: "#F5CBA7",
    },
    warning: {
      main: "#A4000D",
    },
  } as CustomPalette,
});
