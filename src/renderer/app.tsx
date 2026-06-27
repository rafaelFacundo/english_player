import { createRoot } from "react-dom/client";
import Home from "./screens/Home/index";
import VideoPlayer from "./screens/VideoPlayer";
import AppProvider from "./context/AppContext";
import { BrowserRouter, Route, Routes } from "react-router";
import applicationTheme from "./theme";
import { ThemeProvider } from "@mui/material";

const App = () => {
  return (
    <AppProvider>
      <ThemeProvider theme={applicationTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video" element={<VideoPlayer />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AppProvider>
  );
};

const root = createRoot(document.body);
root.render(<App />);
