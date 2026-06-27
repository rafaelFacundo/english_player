import { Box, SxProps, Theme } from "@mui/material";
import ApplicationLogo from "../icons/ApplicationLogo";
import CardIcon from "../icons/cardIcon";
import SettingsIcon from "../icons/SettingsIcon";
import StatsIcon from "../icons/StatsIcon";
import Button from "../Button";

const SideBar = () => {
  const iconStyle: SxProps<Theme> = {
    "& svg": { width: "62px", height: "62px" },
  };

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "flex-start",
        borderRight: `1px solid ${theme.palette.primary.main}`,
        paddingTop: "30px",
        paddingLeft: "30px",
        paddingRight: "22px",
        gap: "41px",
      })}
    >
      <Button icon={<ApplicationLogo />} sx={iconStyle} />
      <Button icon={<CardIcon />} sx={iconStyle} />
      <Button icon={<SettingsIcon />} sx={iconStyle} />
      <Button icon={<StatsIcon />} sx={iconStyle} />
    </Box>
  );
};

export default SideBar;
