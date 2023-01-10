import { Box, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import {
  MouseEventHandler,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import _ from "lodash";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  activeGroupType,
  activeToolOptions,
  groupType,
  groupTypeName,
} from "../utils";
import CustomButton from "../reusables/Button";
import CreateGroupModal from "../modal/CreateGroupModal";
import EditGroupModal from "../modal/EditGroupModal";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { rgba2hex } from "../reusables/helpers";
import CreatePortal from "../reusables/CreatePortal";

type propsType = {
  activeTool: activeToolOptions;
  group: groupType[];
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  activeGroup: activeGroupType;
  changeActiveGroup: React.Dispatch<React.SetStateAction<activeGroupType>>;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const GroupSection = ({
  activeTool,
  group,
  changeGroup,
  activeGroup,
  changeActiveGroup,
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  const [filteredGroups, setFilteredGroups] = useState<groupType[]>([]);
  const anchorElOptionId = useRef<any>(null);
  const theme = useTheme();

  const [modalType, setModalType] = useState<string>("");
  const handleOpenModal = (type: "delete" | "edit" | "create") => {
    if (type === "create") handleCloseList();
    setModalType(type);
  };

  const [anchorElList, setAnchorElList] = useState<null | HTMLElement>(null);
  const openList = Boolean(anchorElList);
  const [anchorElOption, setAnchorElOption] = useState<null | HTMLElement>(
    null
  );
  const openOption = Boolean(anchorElOption);

  const currentGroup = filteredGroups.find(
    (grp) =>
      grp.id ===
      (activeTool === activeToolOptions.count
        ? activeGroup.count
        : activeTool === activeToolOptions.length
        ? activeGroup.length
        : activeGroup.shape)
  );

  useEffect(() => {
    const groupName =
      activeTool === activeToolOptions.count
        ? groupTypeName.count
        : activeTool === activeToolOptions.length
        ? groupTypeName.length
        : groupTypeName.shape;

    const availableGroups = group.filter((grp) => {
      return grp.type === groupName || grp.type === groupTypeName.all;
    });
    let found = false;
    for (const grp of availableGroups) {
      if (
        grp.id ===
        (activeTool === activeToolOptions.count
          ? activeGroup.count
          : activeTool === activeToolOptions.length
          ? activeGroup.length
          : activeGroup.shape)
      ) {
        found = true;
        break;
      }
    }
    if (!found)
      activeTool === activeToolOptions.count
        ? changeActiveGroup((prev) => {
            return { ...prev, count: 1 };
          })
        : activeTool === activeToolOptions.length
        ? changeActiveGroup((prev) => {
            return { ...prev, length: 1 };
          })
        : changeActiveGroup((prev) => {
            return { ...prev, shape: 1 };
          });
    setFilteredGroups(availableGroups);
  }, [group, activeTool]);

  const handleToggleList: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElList) {
      setAnchorElList(null);
    } else {
      setAnchorElList(event?.currentTarget);
    }
  };
  const handleToggleOption = (event: any) => {
    if (anchorElOption) {
      setAnchorElOption(null);
    } else {
      setAnchorElOption(event?.currentTarget);
    }
  };

  const handleCloseList = () => {
    setAnchorElList(null);
  };
  const handleCloseOption = () => {
    anchorElOptionId.current = anchorElOption?.id;
    setAnchorElOption(null);
    setAnchorElList(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <Typography
        noWrap
        fontWeight="500"
        lineHeight="1.5"
        letterSpacing="0.00938em"
        fontSize="14px"
        sx={{
          color: "#4b4646",
          maxWidth: "180px",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        GROUP
      </Typography>

      <Box
        onClick={handleToggleList}
        sx={{
          width: "230px",
          display: "flex",
          alignitems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          backgroundColor: "#e4e7ed",
          padding: "2px 6px",
          borderRadius: "4px",
          ":hover": {
            backgroundColor: "#c9ccd1",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <CreateNewFolderIcon
            fontSize="small"
            sx={{
              color: rgba2hex(currentGroup?.color),
            }}
          />

          <Typography
            noWrap
            fontWeight="500"
            lineHeight="1.5"
            letterSpacing="0.00938em"
            fontSize="14px"
            sx={{
              color: "#4b4646",
              maxWidth: "180px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentGroup?.name}
          </Typography>
        </Box>
        {openList ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </Box>

      <Menu
        id="basic-menu"
        anchorEl={anchorElList}
        open={openList}
        onClose={handleCloseList}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          zIndex: 800,
          marginTop: "10px",

          "& .MuiPaper-root": {
            padding: "20px 10px",
            width: "280px",
            minHeight: "60px",
            maxHeight: "300px",
            borderRadius: "0px 0px 8px 8px",
            boxShadow: "0px 1px 4px 0px grey",
          },
        }}
      >
        {filteredGroups.map((group, index) => (
          <MenuItem
            key={index}
            selected={group.id === currentGroup?.id}
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
                handleCloseList();
                if (activeTool === activeToolOptions.count)
                  changeActiveGroup((prev) => {
                    return { ...prev, count: group.id };
                  });
                else if (activeTool === activeToolOptions.length)
                  changeActiveGroup((prev) => {
                    return { ...prev, length: group.id };
                  });
                else
                  changeActiveGroup((prev) => {
                    return { ...prev, shape: group.id };
                  });
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
              {group.name}
            </Typography>
            {group.id !== 1 && (
              <MoreHorizIcon
                id={group.id.toString()}
                onClick={handleToggleOption}
              />
            )}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        id="basic-menu2"
        anchorEl={anchorElOption}
        open={openOption}
        onClose={handleCloseOption}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {anchorElOption?.id !== "1" && (
          <Box>
            <MenuItem
              onClick={() => {
                undoStack.current.push(captureStates);
                redoStack.current.length = 0;
                while (undoStack.current.length > 30) undoStack.current.shift();
                changeGroup((prev) => {
                  const prevCopy = _.cloneDeep(prev);

                  const updatedGroup = prevCopy.filter(
                    (grp) => grp.id.toString() !== anchorElOptionId.current
                  );
                  return updatedGroup;
                });

                handleCloseOption();
              }}
            >
              Delete
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseOption();
                handleOpenModal("edit");
              }}
            >
              Edit
            </MenuItem>
          </Box>
        )}
      </Menu>

      <CustomButton
        backgroundcolor="#ffa700"
        hoverbackgroudcolor="#ff8700"
        Color="white"
        hovercolor="white"
        sx={{
          borderRadius: "10px",
          padding: "3px 6px",
        }}
        onClick={() => handleOpenModal("create")}
      >
        New Group
      </CustomButton>

      {modalType === "create" && (
        <CreatePortal>
          <CreateGroupModal
            changeGroup={changeGroup}
            onClose={() => setModalType("")}
            newGroupType={
              activeTool === activeToolOptions.count
                ? groupTypeName.count
                : activeTool === activeToolOptions.length
                ? groupTypeName.length
                : groupTypeName.shape
            }
            undoStack={undoStack}
            redoStack={redoStack}
            captureStates={captureStates}
          />
        </CreatePortal>
      )}
      {modalType === "edit" && (
        <EditGroupModal
          onClose={() => setModalType("")}
          groupId={+anchorElOptionId.current}
          group={group}
          changeGroup={changeGroup}
          undoStack={undoStack}
          redoStack={redoStack}
          captureStates={captureStates}
        />
      )}
    </Box>
  );
};

export default GroupSection;
