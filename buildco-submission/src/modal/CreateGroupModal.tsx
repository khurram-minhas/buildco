import {
  Box,
  Menu,
  MenuItem,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CustomButton from "../reusables/Button";
import {
  groupType,
  groupTypeName,
  iconType,
  rgbaColors,
  unitType,
} from "../utils";
import { RGBColor, ChromePicker } from "react-color";
import { MouseEventHandler, MutableRefObject, useRef, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CircleIcon from "@mui/icons-material/Circle";
import { ReactComponent as TriangleIcon } from "../assets/icons/triangle.svg";
import SquareIcon from "@mui/icons-material/Square";
import { rgba2hex } from "../reusables/helpers";
import _ from "lodash";

type propTypes = {
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  onClose: () => void;
  newGroupType: groupTypeName;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};
const CreateGroupModal = ({
  changeGroup,
  onClose,
  newGroupType,
  undoStack,
  redoStack,
  captureStates,
}: propTypes): JSX.Element => {
  const theme = useTheme();
  const textRef = useRef<any>(null);
  const [anchorElUnit, setAnchorElUnit] = useState<null | HTMLElement>(null);
  const openUnit = Boolean(anchorElUnit);
  const [anchorElIcon, setAnchorElIcon] = useState<null | HTMLElement>(null);
  const openIcon = Boolean(anchorElIcon);
  const [anchorElColor, setAnchorElColor] = useState<null | HTMLElement>(null);
  const openColor = Boolean(anchorElColor);
  const [color, setColor] = useState<RGBColor>({
    r: 255,
    g: 188,
    b: 1,
    a: 1,
  });
  const [unit, setUnit] = useState<unitType>(unitType.ft);
  const [icon, setIcon] = useState<iconType>(iconType.circle);

  const handleToggleUnit: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElUnit) {
      setAnchorElUnit(null);
    } else {
      setAnchorElUnit(event?.currentTarget);
    }
  };
  const handleCloseUnit = () => {
    setAnchorElUnit(null);
  };
  const handleToggleIcon: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElIcon) {
      setAnchorElIcon(null);
    } else {
      setAnchorElIcon(event?.currentTarget);
    }
  };
  const handleCloseIcon = () => {
    setAnchorElIcon(null);
  };

  const handleToggleColor: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElColor) {
      setAnchorElColor(null);
    } else {
      setAnchorElColor(event?.currentTarget);
    }
  };
  const handleCloseColor = () => {
    setAnchorElColor(null);
  };

  const handleCreate = () => {
    onClose();
    let extra = {};
    if (newGroupType === groupTypeName.shape) {
      extra = {
        height: 0,
        depth: 0,
        pitch: 0,
      };
    }

    undoStack.current.push(captureStates);
    redoStack.current.length = 0;
    while (undoStack.current.length > 30) undoStack.current.shift();
    changeGroup((prev) => [
      ..._.cloneDeep(prev),
      {
        id: new Date().getTime(),
        name: textRef.current.value,
        type: newGroupType,
        color: color,
        [newGroupType === groupTypeName.count ? "icon" : "unit"]:
          newGroupType === groupTypeName.count ? icon : unit,
        ...extra,
      },
    ]);
  };
  return (
    <>
      <OverLay />
      <ModalContainer>
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexFlow: "column nowrap",
            jusifyContent: "flex-start",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <CreateNewFolderIcon />
          <Typography fontWeight="500">Create New Group</Typography>

          <Box
            sx={{
              marginTop: "20px",
              width: "95%",
              display: "flex",
              flexFlow: "column nowrap",
              alignItems: "flex-start",
            }}
          >
            <Typography fontSize={14}>Group name</Typography>
            <TextField
              fullWidth
              inputRef={textRef}
              sx={{
                "& .MuiOutlinedInput-input": {
                  padding: "10px",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              marginTop: "10px",
              width: "95%",
              display: "flex",
              flexFlow: "row nowrap",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              gap: "50px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexFlow: "column nowrap",
                alignItems: "flex-start",
              }}
            >
              <Typography fontSize={14}>Color</Typography>
              <Box
                sx={{
                  width: "190px",
                  display: "flex",
                  flexFlow: "row wrap",
                  jusifyContent: "flex-start",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                {rgbaColors.map((rgba, index) => (
                  <Box
                    key={index}
                    sx={{
                      height: "22px",
                      width: "22px",
                      borderRadius: "4px",
                      border:
                        color.r === rgba.r &&
                        color.g === rgba.g &&
                        color.b === rgba.b
                          ? `2px solid ${rgba2hex(rgba)}`
                          : "2px solid transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => setColor(rgba)}
                  >
                    <Box
                      sx={{
                        height: "18px",
                        width: "18px",
                        backgroundColor: rgba2hex(rgba),
                        borderRadius: "2px",
                      }}
                    />
                  </Box>
                ))}
                <Box
                  sx={{
                    height: "30px",
                    cursor: "pointer",
                  }}
                  onClick={handleToggleColor}
                >
                  <ArrowDropDownIcon sx={{ height: "30px", width: "30px" }} />
                </Box>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorElColor}
                  open={openColor}
                  onClose={handleCloseColor}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  sx={{
                    paddingTop: "0px",
                    padding: "0px",
                    cursor: "default",
                    "& .MuiPaper-root": {
                      minWidth: "50px",
                      padding: "0px",

                      ul: {
                        padding: "0px",
                      },
                    },
                  }}
                >
                  <ChromePicker
                    color={color}
                    onChange={(color) => setColor(color.rgb)}
                    styles={{
                      default: {
                        picker: {
                          width: "170px",
                        },
                      },
                    }}
                  />
                </Menu>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexFlow: "column nowrap",
                alignItems: "flex-start",
              }}
            >
              {(newGroupType === groupTypeName.all ||
                newGroupType === groupTypeName.shape ||
                newGroupType === groupTypeName.length) && (
                <Box
                  sx={{
                    display: "flex",
                    flexFlow: "column nowrap",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography fontSize={14}>Unit</Typography>
                  <Box
                    onClick={handleToggleUnit}
                    sx={{
                      width: "50px",
                      display: "flex",
                      alignitems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      backgroundColor: "#f4f4f4",
                      padding: "2px 6px",
                      ":hover": {
                        backgroundColor: "#e4e7ed",
                      },
                    }}
                  >
                    <Typography
                      noWrap
                      fontWeight="400"
                      lineHeight="1.5"
                      letterSpacing="0.00938em"
                      fontSize="14px"
                      sx={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {unit}
                    </Typography>
                    {openUnit ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowUpIcon />
                    )}
                  </Box>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorElUnit}
                    open={openUnit}
                    onClose={handleCloseUnit}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    sx={{
                      paddingTop: "0px",
                      "& .MuiPaper-root": {
                        minWidth: "50px",
                      },
                    }}
                  >
                    {["ft", "in"].map((unt, index) => (
                      <MenuItem
                        key={index}
                        selected={unt === unit}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          color: theme.color.primary,
                          fontSize: "14px",
                        }}
                      >
                        <Typography
                          onClick={() => {
                            handleCloseUnit();
                            setUnit(
                              unt === unitType.ft ? unitType.ft : unitType.in
                            );
                          }}
                          noWrap
                          sx={{
                            maxWidth: "400px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flexGrow: 1,
                            fontSize: "15px",
                          }}
                        >
                          {unt}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}
              {(newGroupType === groupTypeName.all ||
                newGroupType === groupTypeName.count) && (
                <Box
                  sx={{
                    display: "flex",
                    flexFlow: "column nowrap",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography fontSize={14}>Icon</Typography>
                  <Box
                    onClick={handleToggleIcon}
                    sx={{
                      width: "50px",
                      display: "flex",
                      alignitems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      backgroundColor: "#f4f4f4",
                      padding: "2px 6px",
                      ":hover": {
                        backgroundColor: "#e4e7ed",
                      },
                    }}
                  >
                    {icon === iconType.circle ? (
                      <CircleIcon sx={{ color: rgba2hex(color) }} />
                    ) : icon === iconType.triangle ? (
                      <TriangleIcon
                        fill={rgba2hex(color)}
                        style={{
                          width: "22px",
                          height: "22px",
                        }}
                      />
                    ) : (
                      <SquareIcon sx={{ color: rgba2hex(color) }} />
                    )}
                    {openIcon ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowUpIcon />
                    )}
                  </Box>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorElIcon}
                    open={openIcon}
                    onClose={handleCloseIcon}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    sx={{
                      paddingTop: "0px",
                      "& .MuiPaper-root": {
                        minWidth: "50px",
                      },
                    }}
                  >
                    {["CircleIcon", "ChangeHistoryIcon", "CropSquareIcon"].map(
                      (icn, index) => (
                        <MenuItem
                          key={index}
                          selected={icon === icn}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "10px",
                            color: theme.color.primary,
                            fontSize: "14px",
                          }}
                        >
                          <Box
                            onClick={() => {
                              handleCloseIcon();
                              setIcon(
                                icn === iconType.circle
                                  ? iconType.circle
                                  : icn === iconType.triangle
                                  ? iconType.triangle
                                  : iconType.square
                              );
                            }}
                          >
                            {icn === iconType.circle ? (
                              <CircleIcon sx={{ color: rgba2hex(color) }} />
                            ) : icn === iconType.triangle ? (
                              <TriangleIcon
                                fill={rgba2hex(color)}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                }}
                              />
                            ) : (
                              <SquareIcon sx={{ color: rgba2hex(color) }} />
                            )}
                          </Box>
                        </MenuItem>
                      )
                    )}
                  </Menu>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ marginTop: "50px", display: "flex", gap: "10px" }}>
            <CustomButton
              variant="outlined"
              onClick={onClose}
              sx={{
                padding: "6px 8px",
                borderColor: "#FFBC01",
                ":hover": {
                  borderColor: "#FFBC01",
                },
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              Color="white"
              hovercolor="white"
              backgroundcolor="#FFBC01"
              hoverbackgroudcolor="#ffa700"
              onClick={handleCreate}
              sx={{
                padding: "6px 20px",
              }}
            >
              Create Group
            </CustomButton>
          </Box>
        </Box>
      </ModalContainer>
    </>
  );
};
export default CreateGroupModal;

const OverLay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  zIndex: 1000,
});

const ModalContainer = styled(Box)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  zIndex: 1000,
  borderRadius: "5px",
});
