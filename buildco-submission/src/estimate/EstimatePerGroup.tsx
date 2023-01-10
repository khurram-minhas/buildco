import { Box, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import CircleIcon from "@mui/icons-material/Circle";
import { ReactComponent as TriangleIcon } from "../assets/icons/triangle.svg";
import SquareIcon from "@mui/icons-material/Square";

import {
  countType,
  groupType,
  groupTypeName,
  iconType,
  lengthType,
  polygonType,
  scaleInfoType,
  unitType,
} from "../utils";
import {
  getLength,
  getScaledArea,
  getScaledVolume,
  polygonArea,
  rgba2hex,
} from "../reusables/helpers";

type propsType = {
  scaleInfo: scaleInfoType;
  group: groupType;
  polygon: polygonType[];
  length: lengthType[];
  count: countType[];
};

const EstimatePerGroup = ({
  scaleInfo,
  group,
  polygon,
  length,
  count,
}: propsType): JSX.Element => {
  const [unit, setUnit] = useState<string>("");
  const area = useRef<number>(0);
  const [volume, setVolume] = useState<number>(0);

  useEffect(() => {
    let newPolyArea: number[] = [];
    if (group.type === groupTypeName.count) {
      setUnit("Count");
      area.current = count.length;
      setVolume(count.length);
    } else if (group.type === groupTypeName.shape) {
      for (const poly of polygon) {
        let area = polygonArea(poly.points);
        for (const deduct of poly.deductRect) {
          area -= polygonArea(deduct.points);
        }
        newPolyArea.push(area);
      }
      if (scaleInfo.calibrated) {
        if (group.unit === unitType.ft) {
          if (group.depth || group.height) setUnit("ft3");
          else setUnit("ft2");
        } else {
          if (group.depth || group.height) setUnit("in3");
          else setUnit("in2");
        }
        area.current = +(+getScaledArea(
          newPolyArea.reduce((prev, curr) => prev + curr, 0),
          scaleInfo,
          group.unit === unitType.ft ? unitType.ft : unitType.in
        ).split(" ")[0]).toFixed(2);
        setVolume(
          +newPolyArea
            .map((area, index) => {
              return +getScaledVolume(
                area,
                scaleInfo,
                group.unit === unitType.ft ? unitType.ft : unitType.in,
                polygon[index]?.height || group.height,
                polygon[index]?.depth || group.depth
              ).split(" ")[0];
            })
            .reduce((prev, curr) => prev + curr, 0)
            .toFixed(2)
        );
      } else {
        if (group.depth || group.height) setUnit("px3");
        else setUnit("px2");
        area.current = +(+getScaledArea(
          newPolyArea.reduce((prev, curr) => prev + curr, 0),
          scaleInfo,
          "px"
        ).split(" ")[0]).toFixed(2);
        setVolume(
          +newPolyArea
            .map((area, index) => {
              return +getScaledVolume(
                area,
                scaleInfo,
                "px",
                polygon[index]?.height || group.height,
                polygon[index]?.depth || group.depth
                // polygon[index]?.pitch || group.pitch
              ).split(" ")[0];
            })
            .reduce((prev, curr) => prev + curr, 0)
            .toFixed(2)
        );
      }
    } else {
      let total = 0;
      for (const len of length) {
        total += getLength(len.points);
      }

      if (scaleInfo.calibrated) {
        if (group.unit === unitType.ft) {
          setUnit("ft");
          area.current = +(
            (total * scaleInfo.L) /
            Math.sqrt(scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
          ).toFixed(2);
        } else {
          setUnit("in");
          area.current = +(
            (total * scaleInfo.L * 12) /
            Math.sqrt(scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
          ).toFixed(2);
        }
      } else {
        setUnit("px");
        area.current = +total.toFixed(2);
      }
      setVolume(area.current);
    }
  }, []);

  return (
    <Row
      sx={{
        color: "#222222",
        fontSize: "14px !important",
        fontWeight: "500",
      }}
    >
      <Field
        sx={{
          justifyContent: "flex-start",
          width: "390px",
          paddingLeft: "0px",
        }}
      >
        {group.type === groupTypeName.shape ||
        group.type === groupTypeName.length ? (
          <FolderCopyIcon
            fontSize="small"
            sx={{ color: rgba2hex({ ...group.color, a: 0.5 }) }}
          />
        ) : group.icon === iconType.circle ? (
          <CircleIcon
            fontSize="small"
            sx={{ color: rgba2hex({ ...group.color, a: 0.5 }) }}
          />
        ) : group.icon === iconType.triangle ? (
          <TriangleIcon
            fill={rgba2hex({ ...group.color, a: 0.5 })}
            style={{
              width: "22px",
              height: "22px",
            }}
          />
        ) : (
          <SquareIcon
            fontSize="small"
            sx={{ color: rgba2hex({ ...group.color, a: 0.5 }) }}
          />
        )}
        <Box
          sx={{
            paddingLeft: "20px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {group.name}
        </Box>
      </Field>
      <Field
        sx={{
          width: "75px",
        }}
      >
        {unit}
      </Field>
      <Field sx={{ width: "200px" }}>{area.current}</Field>
      <Field sx={{ width: "130px" }}>
        {group.height || (group.type === groupTypeName.count ? "--" : 0)}
      </Field>
      <Field sx={{ width: "100px" }}>
        {group.depth || (group.type === groupTypeName.count ? "--" : 0)}
      </Field>
      <Field sx={{ width: "130px" }}>{volume}</Field>
    </Row>
  );
};

export default EstimatePerGroup;

const Row = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
});

const Field = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  minHeight: "30px",
  paddingLeft: "10px",
  overflow: "hidden",
  boxSizing: "border-box",
  textOverflow: "ellipsis",
  overflowWrap: "break-word",
});
