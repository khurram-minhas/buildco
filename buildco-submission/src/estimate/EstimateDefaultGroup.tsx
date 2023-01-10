import { Box, styled } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

import {
  countType,
  groupType,
  lengthType,
  polygonType,
  scaleInfoType,
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

const EstimateDefaultGroup = ({
  scaleInfo,
  group,
  polygon,
  length,
  count,
}: propsType): JSX.Element => {
  return (
    <>
      {polygon.map((poly, index) => (
        <Row
          key={poly.key}
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
            <CircleIcon
              fontSize="small"
              sx={{ color: rgba2hex({ r: 255, g: 188, b: 1, a: 0.5 }) }}
            />
            <Box
              sx={{
                paddingLeft: "20px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {poly.name}
            </Box>
          </Field>
          <Field
            sx={{
              width: "75px",
            }}
          >
            {scaleInfo.calibrated
              ? poly.height || poly.depth
                ? "ft3"
                : "ft2"
              : poly.height || poly.depth
              ? "px3"
              : "px2"}
          </Field>
          <Field sx={{ width: "200px" }}>
            {getScaledArea(
              polygonArea(poly.points) -
                poly.deductRect
                  .map((deduct) => polygonArea(deduct.points))
                  .reduce((prev, curr) => prev + curr, 0),
              scaleInfo,
              scaleInfo.calibrated ? "ft" : "px"
            )}
          </Field>
          <Field sx={{ width: "130px" }}>{poly.height || 0}</Field>
          <Field sx={{ width: "100px" }}>{poly.depth || 0}</Field>
          <Field sx={{ width: "130px" }}>
            {getScaledVolume(
              polygonArea(poly.points) -
                poly.deductRect
                  .map((deduct) => polygonArea(deduct.points))
                  .reduce((prev, curr) => prev + curr, 0),
              scaleInfo,
              scaleInfo.calibrated ? "ft" : "px",
              poly.height,
              poly.depth
            )}
          </Field>
        </Row>
      ))}
      {length.map((len, index) => (
        <Row
          key={len.key}
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
            <CircleIcon
              fontSize="small"
              sx={{ color: rgba2hex({ r: 255, g: 188, b: 1, a: 0.5 }) }}
            />
            <Box
              sx={{
                paddingLeft: "20px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {len.name}
            </Box>
          </Field>
          <Field
            sx={{
              width: "75px",
            }}
          >
            {scaleInfo.calibrated ? "ft" : "px"}
          </Field>
          <Field sx={{ width: "200px" }}>
            {scaleInfo.calibrated
              ? (
                  (getLength(len.points) * scaleInfo.L) /
                  Math.sqrt(
                    scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y
                  )
                ).toFixed(2)
              : getLength(len.points).toFixed(2)}
          </Field>
          <Field sx={{ width: "130px" }}>{0}</Field>
          <Field sx={{ width: "100px" }}>{0}</Field>
          <Field sx={{ width: "130px" }}>
            {scaleInfo.calibrated
              ? (
                  (getLength(len.points) * scaleInfo.L) /
                  Math.sqrt(
                    scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y
                  )
                ).toFixed(2)
              : getLength(len.points).toFixed(2)}
          </Field>
        </Row>
      ))}
      {count.length > 0 && (
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
            <CircleIcon
              fontSize="small"
              sx={{ color: rgba2hex({ r: 255, g: 188, b: 1, a: 0.5 }) }}
            />
            <Box
              sx={{
                paddingLeft: "20px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Count
            </Box>
          </Field>
          <Field
            sx={{
              width: "75px",
            }}
          >
            Count
          </Field>
          <Field sx={{ width: "200px" }}>{count.length}</Field>
          <Field sx={{ width: "130px" }}>--</Field>
          <Field sx={{ width: "100px" }}>--</Field>
          <Field sx={{ width: "130px" }}>{count.length}</Field>
        </Row>
      )}
    </>
  );
};

export default EstimateDefaultGroup;

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
