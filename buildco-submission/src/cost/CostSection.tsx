import {
  Box,
  InputAdornment,
  Menu,
  MenuItem,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import CustomButton from "../reusables/Button";
import {
  costGroupType,
  countType,
  groupType,
  groupTypeName,
  polygonType,
  scaleInfoType,
  taxType,
  unitType,
} from "../utils";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { getScaledVolume, polygonArea } from "../reusables/helpers";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import _ from "lodash";
import nextId from "react-id-generator";
import { ReactComponent as LogoIcon } from "../assets/icons/logo.svg";
import { useReactToPrint } from "react-to-print";

type propsType = {
  scaleInfo: scaleInfoType[][];
  group: groupType[];
  polygon: polygonType[][][];
  count: countType[][][];
  toggleShowEstimate: React.Dispatch<React.SetStateAction<boolean>>;
  toggleShowCost: React.Dispatch<React.SetStateAction<boolean>>;
  toggleLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const CostSection = ({
  scaleInfo,
  group,
  polygon,
  count,
  toggleShowEstimate,
  toggleShowCost,
  toggleLoading,
}: propsType): JSX.Element => {
  const [costGroup, setCostGroup] = useState<costGroupType[]>([]);
  const [expand, setExpand] = useState<boolean>(true);
  const [totalMaterial, setTotalMaterial] = useState<number>(0);
  const [totalLabor, setTotalLabor] = useState<number>(0);
  const [totalMarkup, setTotalMarkup] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);

  const [anchorElTax, setAnchorElTax] = useState<null | HTMLElement>(null);
  const openTax = Boolean(anchorElTax);
  const rowIndexForTax = useRef<number>(0);
  const pdfRef = useRef<HTMLDivElement>(null);
  const hiddenText = useRef<HTMLDivElement>(null);

  const handleToggleTax: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElTax) {
      setAnchorElTax(null);
    } else {
      setAnchorElTax(event?.currentTarget);
    }
    rowIndexForTax.current = +event.currentTarget?.classList[2];
  };
  const handleCloseTax = () => {
    setAnchorElTax(null);
  };

  useEffect(() => {
    const newCostGroup: costGroupType[] = [];
    toggleLoading(true);
    for (let pdfIndex = 0; pdfIndex < polygon.length; pdfIndex++) {
      for (
        let pageIndex = 0;
        pageIndex < polygon[pdfIndex].length;
        pageIndex++
      ) {
        const polygonPerPage = polygon[pdfIndex][pageIndex];
        const groupPerPage = group.filter(
          (grp) =>
            grp.type === groupTypeName.shape || grp.type === groupTypeName.all
        );
        const scaleInf = scaleInfo[pdfIndex][pageIndex];

        groupPerPage.map((grp) => {
          const poly = polygonPerPage.filter((p) => p.group === grp.id);
          if (grp.type === groupTypeName.shape) {
            const volumePerGroup = +poly
              .map((p, index) => {
                return +getScaledVolume(
                  polygonArea(p.points) -
                    p.deductRect
                      .map((deduct) => polygonArea(deduct.points))
                      .reduce((prev, curr) => prev + curr, 0),
                  scaleInf,
                  grp.id === 1
                    ? scaleInf.calibrated
                      ? "ft"
                      : "px"
                    : scaleInf.calibrated
                    ? grp.unit === unitType.ft
                      ? unitType.ft
                      : unitType.in
                    : "px",
                  p.height || grp.height,
                  p.depth || grp.depth
                ).split(" ")[0];
              })
              .reduce((prev, curr) => prev + curr, 0)
              .toFixed(2);

            if (poly.length) {
              newCostGroup.push({
                id: nextId(),
                name: grp.name,
                quantity: volumePerGroup,
                unit: scaleInf.calibrated
                  ? poly[0].height || grp.height || poly[0].depth || grp.depth
                    ? grp.unit === unitType.ft
                      ? "ft3"
                      : "in3"
                    : grp.unit === unitType.ft
                    ? "ft2"
                    : "in2"
                  : poly[0].height || grp.height || poly[0].depth || grp.depth
                  ? "px3"
                  : "px2",
                material: 0,
                labor: 0,
                markup: 0,
                room: 0,
                tax: 0,
              });
            }
          } else {
            for (const pp of poly) {
              const volumePerGroup = +getScaledVolume(
                polygonArea(pp.points) -
                  pp.deductRect
                    .map((deduct) => polygonArea(deduct.points))
                    .reduce((prev, curr) => prev + curr, 0),
                scaleInf,
                grp.id === 1
                  ? scaleInf.calibrated
                    ? "ft"
                    : "px"
                  : scaleInf.calibrated
                  ? grp.unit === unitType.ft
                    ? unitType.ft
                    : unitType.in
                  : "px",
                pp.height,
                pp.depth
              ).split(" ")[0];

              newCostGroup.push({
                id: nextId(),
                name: pp.name,
                quantity: volumePerGroup,
                unit: scaleInf.calibrated
                  ? pp.height || pp.depth
                    ? grp.unit === unitType.ft
                      ? "ft3"
                      : "in3"
                    : grp.unit === unitType.ft
                    ? "ft2"
                    : "in2"
                  : pp.height || pp.depth
                  ? "px3"
                  : "px2",
                material: 0,
                labor: 0,
                markup: 0,
                room: 0,
                tax: 0,
              });
            }
          }
        });
      }
    }

    for (let pdfIndex = 0; pdfIndex < count.length; pdfIndex++) {
      for (let pageIndex = 0; pageIndex < count[pdfIndex].length; pageIndex++) {
        const countPerPage = count[pdfIndex][pageIndex];
        const groupPerPage = group.filter(
          (grp) =>
            grp.type === groupTypeName.count || grp.type === groupTypeName.all
        );

        groupPerPage.map((grp) => {
          const cnt = countPerPage.filter((c) => c.group === grp.id).length;

          if (cnt) {
            newCostGroup.push({
              id: nextId(),
              name: grp.type === groupTypeName.all ? "count" : grp.name,
              quantity: cnt,
              unit: "Count",
              material: 0,
              labor: 0,
              markup: 0,
              room: 0,
              tax: 0,
            });
          }
        });
      }
    }

    setCostGroup(newCostGroup);
    toggleLoading(false);
  }, []);

  useEffect(() => {
    setTotalMaterial(
      costGroup
        .map((grp) => grp.quantity * grp.material)
        .reduce((collector, curr) => collector + curr, 0)
    );
    setTotalLabor(
      costGroup
        .map((grp) => grp.quantity * grp.labor)
        .reduce((collector, curr) => collector + curr, 0)
    );
    setTotalMarkup(
      costGroup
        .map((grp) => grp.quantity * grp.markup)
        .reduce((collector, curr) => collector + curr, 0)
    );

    setTotalTax(
      (taxRate / 100.0) *
        costGroup
          .map((grp) => {
            let val = 0;
            if (grp.tax === 1) val = grp.quantity * grp.material;
            if (grp.tax === 2) val = grp.quantity * grp.labor;
            if (grp.tax === 3)
              val = grp.quantity * grp.material + grp.quantity * grp.labor;
            if (val > 0) val += grp.quantity * grp.markup;
            return val;
          })
          .reduce((collector, curr) => collector + curr, 0)
    );
  }, [costGroup, taxRate]);

  const onCostGroupChange = (index: number, field: string, value: number) => {
    if (field === "tax") index = rowIndexForTax.current;

    setCostGroup((prev) => {
      const prevCopy = _.cloneDeep(prev);
      const old = prevCopy[index];
      prevCopy.splice(index, 1, {
        ...old,
        [field]: value,
      });
      return prevCopy;
    });
  };

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ToolBar>
          <LogoIcon style={{ width: "80px", paddingRight: "10px" }} />
          <CustomButton
            backgroundcolor="#ffa700"
            hoverbackgroudcolor="#ff8700"
            Color="white"
            hovercolor="white"
            sx={{
              marginLeft: "25px",
              borderRadius: "4px",
              padding: "3px 6px",
              height: "30px",
            }}
            onClick={() => {
              toggleShowCost(false);
              toggleShowEstimate(false);
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "14px",
              }}
            >
              <ReplyIcon fontSize="small" />
              Back to Measure
            </Box>
          </CustomButton>
          <Typography
            sx={{
              marginLeft: "140px",
              color: "#222222",
              fontSize: "23px",
              fontWeight: "500",
            }}
          >
            Estimates
          </Typography>
          <CustomButton
            backgroundcolor="#ffa700"
            hoverbackgroudcolor="#ff8700"
            Color="white"
            hovercolor="white"
            sx={{
              position: "absolute",
              right: "30px",
              borderRadius: "4px",
              padding: "3px 6px",
              height: "30px",
              fontSize: "14px",
            }}
            onClick={useReactToPrint({
              content: () => pdfRef.current,
              onBeforeGetContent: () => {
                hiddenText.current!.style.display = "flex";
              },
              onAfterPrint: () => {
                hiddenText.current!.style.display = "none";
              },
            })}
          >
            Export as PDF
          </CustomButton>
        </ToolBar>

        <TableSection>
          <Box
            ref={pdfRef}
            sx={{
              margin: "30px 30px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",

              alignItems: "flex-start",
            }}
          >
            <Box
              ref={hiddenText}
              sx={{
                marginBottom: "15px",
                width: "1055px",
                display: "none",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <LogoIcon style={{ width: "150px" }} />
              <Typography
                sx={{
                  color: "#FFBC01",
                  fontSize: "24px",
                  fontWeight: "500",
                }}
              >
                Estimates
              </Typography>
            </Box>
            <Row
              sx={{
                color: "#666",
                fontSize: "16px",
                fontWeight: "500",
                borderBottom: "1px solid rgb(204, 204, 204)",
              }}
            >
              <Field sx={{ width: "200px", border: "none" }}>Item</Field>
              <Field sx={{ width: "110px", border: "none" }}>Quantity</Field>
              <Field sx={{ width: "65px", border: "none" }}>Unit</Field>
              <Field sx={{ width: "110px", border: "none" }}>Material</Field>
              <Field sx={{ width: "110px", border: "none" }}>Labor</Field>
              <Field sx={{ width: "110px", border: "none" }}>Markup</Field>
              <Field sx={{ width: "110px", border: "none" }}>Room</Field>
              <Field sx={{ width: "100px", border: "none" }}>Tax</Field>
              <Field sx={{ width: "140px", border: "none" }}>Total</Field>
            </Row>
            <Row
              sx={{
                color: "rgb(34, 34, 34)",
                fontSize: "16px",
                fontWeight: "500",
                backgroundColor: "#fafafa",
                overflowWrap: "break-word",
              }}
            >
              <Field
                sx={{ width: "200px", cursor: "pointer" }}
                onClick={() => setExpand((prev) => !prev)}
              >
                {expand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </Field>
              <Field sx={{ width: "110px" }} />
              <Field sx={{ width: "65px" }} />
              <Field sx={{ width: "110px" }}>
                <Box
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    overflowWrap: "break-word",
                  }}
                >
                  ${totalMaterial.toFixed(2)}
                </Box>
              </Field>
              <Field sx={{ width: "110px" }}>
                <Box
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    overflowWrap: "break-word",
                  }}
                >
                  ${totalLabor.toFixed(2)}
                </Box>
              </Field>
              <Field sx={{ width: "110px" }}>
                <Box
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    overflowWrap: "break-word",
                  }}
                >
                  ${totalMarkup.toFixed(2)}
                </Box>
              </Field>
              <Field sx={{ width: "110px" }} />
              <Field sx={{ width: "100px" }} />
              <Field sx={{ width: "140px", border: "none" }}>
                <Box
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    overflowWrap: "break-word",
                  }}
                >
                  ${(totalMaterial + totalLabor + totalMarkup).toFixed(2)}
                </Box>
              </Field>
            </Row>
            <Box
              sx={{
                overflow: "hidden",
                overflowY: "auto",
              }}
            >
              {expand &&
                costGroup.map((grp, index) => (
                  <Row
                    key={grp.id}
                    sx={{
                      color: "#666",
                      fontSize: "16px",
                      fontWeight: "400",
                      borderBottom: "1px solid rgb(204, 204, 204)",
                    }}
                  >
                    <Field
                      sx={{
                        width: "200px",
                      }}
                    >
                      <Box
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {grp.name}
                      </Box>
                    </Field>
                    <Field sx={{ width: "110px" }}>{grp.quantity}</Field>
                    <Field sx={{ width: "65px" }}>{grp.unit}</Field>
                    <Field sx={{ width: "110px" }}>
                      <CustomTextField
                        type="number"
                        value={grp.material}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ margin: "0px" }}
                            >
                              $
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0.0;
                          if (value >= 0) {
                            onCostGroupChange(index, "material", value);
                          }
                        }}
                      />
                    </Field>
                    <Field sx={{ width: "110px" }}>
                      <CustomTextField
                        type="number"
                        value={grp.labor}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ margin: "0px" }}
                            >
                              $
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0.0;
                          if (value >= 0)
                            onCostGroupChange(index, "labor", value);
                        }}
                      />
                    </Field>
                    <Field sx={{ width: "110px" }}>
                      <CustomTextField
                        type="number"
                        value={grp.markup}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ margin: "0px" }}
                            >
                              $
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0.0;
                          if (value >= 0)
                            onCostGroupChange(index, "markup", value);
                        }}
                      />
                    </Field>
                    <Field sx={{ width: "110px" }}>
                      <CustomTextField placeholder="Add Room" />
                    </Field>
                    <Field sx={{ width: "100px" }}>
                      <CustomTextField
                        id={`${index}`}
                        className={`${index}`}
                        value={taxType[grp.tax]}
                        onClick={handleToggleTax}
                      />
                    </Field>
                    <Field sx={{ width: "140px", border: "none" }}>
                      $
                      {(
                        grp.quantity *
                        (grp.material + grp.labor + grp.markup)
                      ).toFixed(2)}
                    </Field>
                  </Row>
                ))}
            </Box>

            <Box
              sx={{
                position: "relative",
                bottom: "0px",
                marginTop: "20px",
                alignSelf: "flex-end",
                width: "400px",
                paddingTop: "20px",
                borderRadius: "4px",
                border: "1px solid rgb(204, 204, 204)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "0px 20px",
                }}
              >
                <Box sx={{ fontWeight: "500", fontSize: "17px" }}>Subtotal</Box>
                <Box>${(totalMaterial + totalLabor).toFixed(2)}</Box>
              </Box>
              {totalMarkup > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "0px 20px",
                  }}
                >
                  <Box sx={{ fontWeight: "500", fontSize: "17px" }}>Markup</Box>
                  <Box>${totalMarkup.toFixed(2)}</Box>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0px 20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ fontWeight: "500", fontSize: "17px" }}>Tax </Box>
                  <Typography fontSize="14px">{`  (%)`}</Typography>
                  <CustomTextField
                    sx={{
                      width: "80px",
                      "& .MuiOutlinedInput-input": {
                        padding: "5px 10px 5px 0px",
                        height: "18px",
                        color: "#666",
                      },
                    }}
                    type="number"
                    value={taxRate}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0.0;
                      if (value >= 0) setTaxRate(value);
                    }}
                  />
                </Box>
                <Box>${totalTax.toFixed(2)}</Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "rgb(243, 248, 252)",
                  padding: "20px",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                }}
              >
                <Box sx={{ fontWeight: "500", fontSize: "20px" }}>Total</Box>
                <Box>
                  $
                  {(
                    totalMaterial +
                    totalLabor +
                    totalMarkup +
                    totalTax
                  ).toFixed(2)}
                </Box>
              </Box>
            </Box>
          </Box>
        </TableSection>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorElTax}
        open={openTax}
        onClose={handleCloseTax}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {[0, 1, 2, 3].map((val) => (
          <MenuItem
            key={val}
            onClick={() => {
              handleCloseTax();
              onCostGroupChange(1, "tax", val);
            }}
          >
            {taxType[val]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CostSection;

const ToolBar = styled(Box)({
  position: "fixed",
  top: "40px",
  width: "1030px",
  boxSizing: "border-box",
  backgroundColor: "white",
  borderRadius: "32px",
  boxShadow: "0px 1px 4px 0px gray",
  padding: "10px",
  paddingLeft: "30px",
  paddingRight: "30px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "10px",
  zIndex: 900,
});

const TableSection = styled(Box)({
  position: "fixed",
  top: "130px",
  maxHeight: `calc(100vh - 150px)`,
  backgroundColor: "white",
  borderRadius: "32px",
  boxShadow: "0px 0px 16px 0px #80808082",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  overflow: "hidden",
  zIndex: 900,
});

const Row = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
});

const Field = styled(Box)({
  padding: "10px 5px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  height: "50px",
  boxSizing: "border-box",
  borderRight: "1px solid #e6e6e6",
  overflow: "hidden",
});

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    paddingLeft: "4px",
    "&. MuiInputAdornment-root": {
      marginRight: "0px",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "5px 10px 5px 0px",
    height: "25px",
    color: "#666",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid transparent",
  },

  ":hover": {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid rgba(0, 0, 0, 0.23)",
    },
  },
});
