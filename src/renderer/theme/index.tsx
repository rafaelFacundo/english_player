import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    backgroundColor: Palette["primary"];
  }

  interface PaletteOptions {
    backgroundColor?: PaletteOptions["primary"];
  }
}

const applicationTheme = createTheme({
  palette: {
    primary: { main: "#AC36C4", dark: "#000000" },
    backgroundColor: { main: "#0E0515" },
  },
});

export default applicationTheme;
