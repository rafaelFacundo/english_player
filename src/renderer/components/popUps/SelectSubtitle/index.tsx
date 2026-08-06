import { Box, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useContext } from "react";
import { AppContext } from "src/renderer/context/AppContext";
import Button from "../../Button";

type SelectSubtitlePopUpProps = {
  open: boolean;
};

const SelectSubtitlePopUp: React.FC<SelectSubtitlePopUpProps> = ({ open }) => {
  const { state } = useContext(AppContext);
  console.log(state);
  return (
    <Dialog
      open={open}
      sx={{
        width: "100%",
        height: "100%",
      }}
      slotProps={{
        paper: {
          sx: (theme) => ({
            height: "70%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            backgroundImage: `linear-gradient(to top right, ${theme.palette.backgroundColor.main}, ${theme.palette.primary.dark})`,
            borderRadius: "20px",
            border: "1px solid #AC36C4",
          }),
        },
      }}
      fullWidth
    >
      <DialogTitle sx={{ color: "white", fontSize: "40px" }}>
        Select your subtitle
      </DialogTitle>
      <List
        sx={{
          width: "90%",
          height: "70%",
          overflowY: "scroll",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {state.subtitles.map((subtitle) => (
          <ListItem
            sx={{
              width: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #797979",
              marginBottom: "30px",
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                color: "white",
                textOverflow: "ellipsis",
                width: "90%",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {subtitle.path.slice(subtitle.path.lastIndexOf("/") + 1)}
            </Typography>
          </ListItem>
        ))}
      </List>

      <Button text={"select"} marginTop={20} />
    </Dialog>
  );
};

export default SelectSubtitlePopUp;
