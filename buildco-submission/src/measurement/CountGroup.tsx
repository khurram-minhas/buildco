import {
  Box,
  BoxProps,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Typography,
} from "@mui/material";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { countType, groupType, iconType, scaleInfoType } from "../utils";

import { rgba2hex } from "../reusables/helpers";
import _ from "lodash";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditGroupModal from "../modal/EditGroupModal";
import CircleIcon from "@mui/icons-material/Circle";
import { ReactComponent as TriangleIcon } from "../assets/icons/triangle.svg";
import SquareIcon from "@mui/icons-material/Square";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  scaleInfo: scaleInfoType;
  group: groupType;
  groups: groupType[];
  groupIndex: number;
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  count: countType[];
  changeCount: React.Dispatch<React.SetStateAction<countType[][][]>>;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const CountGroup = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  group,
  groups,
  groupIndex,
  changeGroup,
  count,
  changeCount,
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  const [hover, setHover] = useState<boolean>(false);
  const [filteredIndex, setFilteredIndex] = useState<number[]>([]);
  const groupSize = useRef<number>(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(40);

  const [modalType, setModalType] = useState<string>("");
  const clickRef = useRef<string>("");
  const [anchorElOption, setAnchorElOption] = useState<null | HTMLElement>(
    null
  );
  const openOption = Boolean(anchorElOption);
  const handleToggleOption = (event: any) => {
    if (anchorElOption) {
      clickRef.current = "";
      setAnchorElOption(null);
    } else {
      clickRef.current = event.currentTarget.id;
      setAnchorElOption(event?.currentTarget);
    }
  };
  const handleCloseOption = () => {
    clickRef.current = "";
    setAnchorElOption(null);
  };

  useEffect(() => {
    const indeces: number[] = [];
    count.map((cnt, index) => {
      if (cnt.group === group.id) indeces.push(index);
    });
    groupSize.current = indeces.length;
    setFilteredIndex(indeces);
  }, [group, count]);

  return (
    <>
      {filteredIndex.length > 0 && (
        <Container>
          <GroupHeader
            onMouseEnter={() => {
              changeCount((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const countList = prevCopy[selectedPdf][selectedPage];
                for (const filterIndex of filteredIndex) {
                  countList[filterIndex].hover = true;
                }
                prevCopy[selectedPdf][selectedPage] = countList;
                return prevCopy;
              });
              setHover(true);
            }}
            onMouseLeave={() => {
              changeCount((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const countList = prevCopy[selectedPdf][selectedPage];
                for (const filterIndex of filteredIndex) {
                  countList[filterIndex].hover = false;
                }
                prevCopy[selectedPdf][selectedPage] = countList;
                return prevCopy;
              });
              setHover(false);
            }}
          >
            <Field
              ref={headerRef}
              sx={{
                padding: "3px",
                width: "180px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  cursor: "pointer",
                  backgroundColor: "#f4f4f4",
                  padding: "5px 0px",
                  color: rgba2hex(group.color),
                }}
              >
                {group.icon === iconType.circle ? (
                  <CircleIcon fontSize="small" />
                ) : group.icon === iconType.triangle ? (
                  <TriangleIcon
                    fill={rgba2hex(group.color)}
                    style={{
                      width: "18px",
                      height: "18px",
                    }}
                  />
                ) : (
                  <SquareIcon fontSize="small" />
                )}
              </Box>
              <Box
                sx={{
                  width: "130px",
                  fontSize: "12px",
                  padding: "6px 3px",
                  "&:hover": {
                    backgroundColor: "#f4f4f4",
                  },
                }}
                contentEditable
                suppressContentEditableWarning={true}
                onKeyDown={(e) => {
                  setHeaderHeight(headerRef.current?.clientHeight!);
                }}
                onBlur={(e) => {
                  undoStack.current.push(captureStates);
                  redoStack.current.length = 0;
                  while (undoStack.current.length > 30)
                    undoStack.current.shift();
                  changeGroup((prev) => {
                    const prevCopy = _.cloneDeep(prev);
                    const target = prevCopy[groupIndex];
                    prevCopy.splice(groupIndex, 1, {
                      ...target,
                      name: e.target.innerText,
                    });
                    return prevCopy;
                  });
                }}
              >
                {group.name}
              </Box>
            </Field>
            <Field
              sx={{
                height: `${headerHeight}px`,
                width: "90px",
              }}
            >
              <Typography
                fontSize={12}
                sx={{
                  height: "100%",
                  paddingLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {`count ${groupSize.current}`}
              </Typography>
            </Field>
            <Field
              sx={{
                padding: "0px 10px",
                width: "40px",
              }}
            ></Field>
            <Field
              sx={{
                height: `${headerHeight}px`,
                width: "90px",
              }}
            >
              <Typography
                fontSize={12}
                sx={{
                  height: "100%",
                  paddingLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {`count ${groupSize.current}`}
              </Typography>
            </Field>
            <Field sx={{ width: "60px", justifyContent: "center" }}>
              <IconButton id="groupHeader" onClick={handleToggleOption}>
                <MoreHorizIcon sx={{ color: hover ? "#FFBC01" : "inherit" }} />
              </IconButton>
            </Field>
          </GroupHeader>

          <Menu
            id="basic-menu"
            anchorEl={anchorElOption}
            open={openOption}
            onClose={handleCloseOption}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{ zIndex: 20000 }}
          >
            {clickRef.current === "groupHeader" && (
              <MenuItem
                onClick={() => {
                  handleCloseOption();
                  setModalType("edit");
                }}
              >
                Edit
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                undoStack.current.push(captureStates);
                redoStack.current.length = 0;
                while (undoStack.current.length > 30) undoStack.current.shift();
                if (clickRef.current === "groupHeader") {
                  changeCount((prev) => {
                    const prevCopy = _.cloneDeep(prev);
                    for (let i = 0; i < prevCopy.length; i++) {
                      for (let j = 0; j < prevCopy[i].length; j++) {
                        prevCopy[i][j] = prevCopy[i][j].filter(
                          (cnt) => cnt.group !== group.id
                        );
                      }
                    }
                    return prevCopy;
                  });
                  changeGroup((prev) => {
                    const prevCopy = _.cloneDeep(prev);
                    prevCopy.splice(groupIndex, 1);
                    return prevCopy;
                  });
                } else {
                  changeCount((prev) => {
                    const prevCopy = _.cloneDeep(prev);
                    const countList = prevCopy[selectedPdf][selectedPage];
                    countList.splice(+clickRef.current, 1);
                    prevCopy[selectedPdf][selectedPage] = countList;
                    return prevCopy;
                  });
                  setFilteredIndex([]);
                }
                handleCloseOption();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
          {modalType === "edit" && (
            <EditGroupModal
              group={groups}
              groupId={group.id}
              changeGroup={changeGroup}
              onClose={() => setModalType("")}
              undoStack={undoStack}
              redoStack={redoStack}
              captureStates={captureStates}
            />
          )}
        </Container>
      )}
    </>
  );
};

export default CountGroup;

const Container = styled(Box)({
  minHeight: "35px",
  boxSizing: "border-box",
  width: "460px",
  borderLeft: "1px solid #d6dae5",
  borderBottom: "1px solid #d6dae5",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
});

const GroupHeader = styled(Box)({
  boxShadow: "border-box",
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
});

const Field = styled(Box)<BoxProps>({
  boxSizing: "border-box",
  minHeight: "40px",
  height: "100%",
  color: "#666666",
  borderRight: "1px solid #d6dae5",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
});
