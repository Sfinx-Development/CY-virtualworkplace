import { createTheme, SimplePaletteColorOptions } from "@mui/material/styles";

//användning i din komponent:
// const officeColor = theme1.palette.office?.main;
//  <Button
// variant="contained"
// sx={{ backgroundColor: officeColor }}
// >

interface CustomPalette {
  primary: SimplePaletteColorOptions;
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
      main: "#E4B7BF",
    },
    office: {
      main: "#E6FFDD",
    },
    room: {
      main: "#E2F2FC",
    },
    chat: {
      main: "#f3e4fa",
    },
    leave: {
      main: "#FFE8C5",
    },
    warning: {
      main: "#A4000D",
    },
  } as CustomPalette,
});
