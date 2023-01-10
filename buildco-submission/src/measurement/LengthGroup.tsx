import {
  Box,
  BoxProps,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Typography,
} from "@mui/material";
import {
  createRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { groupType, lengthType, scaleInfoType, unitType } from "../utils";
import FolderTwoToneIcon from "@mui/icons-material/FolderTwoTone";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getLength, rgba2hex } from "../reusables/helpers";
import _ from "lodash";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditGroupModal from "../modal/EditGroupModal";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  scaleInfo: scaleInfoType;
  group: groupType;
  groups: groupType[];
  groupIndex: number;
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  length: lengthType[];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const LengthGroup = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  group,
  groups,
  groupIndex,
  changeGroup,
  length,
  changeLength,
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  const [hover, setHover] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(true);
  const [filteredIndex, setFilteredIndex] = useState<number[]>([]);
  const indivisualLengths = useRef<number[]>([]);
  const totalLength = useRef<number>(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(40);
  const rowRefs = useRef(filteredIndex.map(() => createRef<any>()));
  const [rowsHeight, setRowsHeight] = useState<number[]>([]);

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
    length.map((len, index) => {
      if (len.group === group.id) indeces.push(index);
    });
    indivisualLengths.current.length = 0;
    let total = 0.0;
    for (let idx = 0; idx < indeces.length; idx++) {
      let area = getLength(length[indeces[idx]].points);
      indivisualLengths.current.push(area);
      total += area;
    }
    totalLength.current = total;

    rowRefs.current = indeces.map(() => createRef<HTMLDivElement>());
    setRowsHeight((prev) => {
      return indeces.map((e) => 40);
    });

    setFilteredIndex(indeces);
  }, [group, length]);

  return (
    <>
      {filteredIndex.length > 0 && (
        <Container>
          <GroupHeader
            onMouseEnter={() => {
              changeLength((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const lenList = prevCopy[selectedPdf][selectedPage];
                for (const filterIndex of filteredIndex) {
                  lenList[filterIndex].hover = true;
                }
                prevCopy[selectedPdf][selectedPage] = lenList;
                return prevCopy;
              });
              setHover(true);
            }}
            onMouseLeave={() => {
              changeLength((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const lenList = prevCopy[selectedPdf][selectedPage];
                for (const filterIndex of filteredIndex) {
                  lenList[filterIndex].hover = false;
                }
                prevCopy[selectedPdf][selectedPage] = lenList;
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
                onClick={() => setExpand((prev) => !prev)}
                sx={{
                  display: "flex",
                  cursor: "pointer",
                  backgroundColor: "#f4f4f4",
                  padding: "5px 0px",
                }}
              >
                <FolderTwoToneIcon
                  fontSize="small"
                  sx={{ color: rgba2hex(group.color) }}
                />
                {!expand ? (
                  <ArrowRightIcon
                    fontSize="small"
                    sx={{ color: rgba2hex(group.color) }}
                  />
                ) : (
                  <ArrowDropDownIcon
                    fontSize="small"
                    sx={{ color: rgba2hex(group.color) }}
                  />
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
                {scaleInfo.calibrated === false
                  ? `${totalLength.current.toFixed(2)} px`
                  : group.unit === unitType.ft
                  ? `${(
                      (totalLength.current * scaleInfo.L) /
                      Math.sqrt(
                        scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y
                      )
                    ).toFixed(2)} ft`
                  : `${(
                      (totalLength.current * scaleInfo.L * 12) /
                      Math.sqrt(
                        1.0 * scaleInfo.x * scaleInfo.x +
                          scaleInfo.y * scaleInfo.y
                      )
                    ).toFixed(2)} in`}
              </Typography>
            </Field>
            <Field
              sx={{
                padding: "0px 10px",
                width: "40px",
                // cursor: "pointer",
                // ":hover": {
                //   backgroundColor: "#f4f4f4",
                // },
              }}
            >
              {/* <Settings fill={hover ? "#FFBC01" : "#c3c3ca"} /> */}
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
                {scaleInfo.calibrated === false
                  ? `${totalLength.current.toFixed(2)} px`
                  : group.unit === unitType.ft
                  ? `${(
                      (totalLength.current * scaleInfo.L) /
                      Math.sqrt(
                        scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y
                      )
                    ).toFixed(2)} ft`
                  : `${(
                      (totalLength.current * scaleInfo.L * 12) /
                      Math.sqrt(
                        1.0 * scaleInfo.x * scaleInfo.x +
                          scaleInfo.y * scaleInfo.y
                      )
                    ).toFixed(2)} in`}
              </Typography>
            </Field>
            <Field sx={{ width: "60px", justifyContent: "center" }}>
              <IconButton id="groupHeader" onClick={handleToggleOption}>
                <MoreHorizIcon sx={{ color: hover ? "#FFBC01" : "inherit" }} />
              </IconButton>
            </Field>
          </GroupHeader>
          {expand &&
            filteredIndex.map((index, idx) => (
              <Row
                key={idx}
                onMouseEnter={() => {
                  changeLength((prev) => {
                    const prevCopy = _.cloneDeep(prev);
                    prevCopy[selectedPdf][selectedPage][index].hover = true;
                    return prevCopy;
                  });
                }}
                onMouseLeave={() => {
                  changeLength((prev) => {
                    const prevCopy = _.cloneDeep(prev);
                    prevCopy[selectedPdf][selectedPage][index].hover = false;
                    return prevCopy;
                  });
                }}
              >
                <Field
                  ref={rowRefs.current[idx]!}
                  sx={{
                    padding: "3px",
                    paddingLeft: "10px",
                    width: "180px",
                  }}
                >
                  <Box
                    sx={{
                      height: "20px",
                      width: "5px",
                      backgroundColor: rgba2hex(group.color),
                      marginRight: "5px",
                    }}
                  />
                  <Box
                    sx={{
                      width: "150px",
                      fontSize: "12px",
                      padding: "6px 3px",
                      ":hover": {
                        backgroundColor: "#f4f4f4",
                      },
                    }}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onKeyDown={(e) => {
                      setRowsHeight((prev) => {
                        const copy = [...prev];
                        copy.splice(
                          idx,
                          1,
                          rowRefs.current[idx].current.clientHeight
                        );
                        return copy;
                      });
                    }}
                    onBlur={(e) => {
                      undoStack.current.push(captureStates);
                      redoStack.current.length = 0;
                      while (undoStack.current.length > 30)
                        undoStack.current.shift();
                      changeLength((prev) => {
                        const prevCopy = _.cloneDeep(prev);
                        const target =
                          prevCopy[selectedPdf][selectedPage][index];
                        target.name = e.target.innerText;
                        prevCopy[selectedPdf][selectedPage][index] = target;
                        return prevCopy;
                      });
                    }}
                  >
                    {length[index]?.name}
                  </Box>
                </Field>
                <Field
                  sx={{
                    height: `${rowsHeight[idx]}px`,
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
                    {scaleInfo.calibrated === false
                      ? `${indivisualLengths.current[idx].toFixed(2)} px`
                      : group.unit === unitType.ft
                      ? `${(
                          (indivisualLengths.current[idx] * scaleInfo.L) /
                          Math.sqrt(
                            scaleInfo.x * scaleInfo.x +
                              scaleInfo.y * scaleInfo.y
                          )
                        ).toFixed(2)} ft`
                      : `${(
                          (indivisualLengths.current[idx] * scaleInfo.L * 12) /
                          Math.sqrt(
                            scaleInfo.x * scaleInfo.x +
                              scaleInfo.y * scaleInfo.y
                          )
                        ).toFixed(2)} in`}
                  </Typography>
                </Field>
                <Field
                  sx={{
                    padding: "0px 10px",
                    width: "40px",
                  }}
                />
                <Field
                  sx={{
                    height: `${rowsHeight[idx]}px`,
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
                    {scaleInfo.calibrated === false
                      ? `${indivisualLengths.current[idx].toFixed(2)} px`
                      : group.unit === unitType.ft
                      ? `${(
                          (indivisualLengths.current[idx] * scaleInfo.L) /
                          Math.sqrt(
                            scaleInfo.x * scaleInfo.x +
                              scaleInfo.y * scaleInfo.y
                          )
                        ).toFixed(2)} ft`
                      : `${(
                          (indivisualLengths.current[idx] * scaleInfo.L * 12) /
                          Math.sqrt(
                            scaleInfo.x * scaleInfo.x +
                              scaleInfo.y * scaleInfo.y
                          )
                        ).toFixed(2)} in`}
                  </Typography>
                </Field>
                <Field sx={{ width: "60px", justifyContent: "center" }}>
                  <IconButton id={`${index}`} onClick={handleToggleOption}>
                    <MoreHorizIcon
                      sx={{
                        color:
                          hover === false && length[index]?.hover
                            ? "#FFBC01"
                            : "inherit",
                      }}
                    />
                  </IconButton>
                </Field>
              </Row>
            ))}

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
                  changeLength((prev) => {
                    const prevCopy = _.cloneDeep(prev);
                    for (let i = 0; i < prevCopy.length; i++) {
                      for (let j = 0; j < prevCopy[i].length; j++) {
                        prevCopy[i][j] = prevCopy[i][j].filter(
                          (len) => len.group !== group.id
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
                  changeLength((prev) => {
                    const prevCopy = _.cloneDeep(prev);
                    const lenList = prevCopy[selectedPdf][selectedPage];
                    lenList.splice(+clickRef.current, 1);
                    prevCopy[selectedPdf][selectedPage] = lenList;
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

export default LengthGroup;

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

const Row = styled(Box)({
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
