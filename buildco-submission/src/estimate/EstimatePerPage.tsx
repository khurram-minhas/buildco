import { Box, Divider, styled, Typography } from "@mui/material";

import {
  countType,
  groupType,
  groupTypeName,
  lengthType,
  polygonType,
  scaleInfoType,
} from "../utils";
import EstimateDefaultGroup from "./EstimateDefaultGroup";
import EstimatePerGroup from "./EstimatePerGroup";

type propsType = {
  pageIndex: number;
  scaleInfo: scaleInfoType;
  group: groupType[];
  polygon: polygonType[];
  length: lengthType[];
  count: countType[];
};

const EstimatePerPage = ({
  pageIndex,
  scaleInfo,
  group,
  polygon,
  length,
  count,
}: propsType): JSX.Element => {
  if (!(polygon.length || length.length || count.length)) {
    return <></>;
  }

  return (
    <Container>
      <Typography
        fontWeight="500"
        letterSpacing="0.00938em"
        fontSize="16px"
        sx={{
          color: "#222222",
        }}
      >
        Page {pageIndex}
      </Typography>
      <Row sx={{ color: "#666666", fontSize: "14px", fontWeight: "500" }}>
        <Field
          sx={{
            justifyContent: "flex-start",
            paddingLeft: "40px",
            width: "350px",
          }}
        >
          GROUP/ITEM NAME
        </Field>
        <Field sx={{ width: "75px" }}>UNIT</Field>
        <Field sx={{ width: "200px" }}>MEASUREMENT</Field>
        <Field sx={{ width: "130px" }}>HEIGHT/WIDTH</Field>
        <Field sx={{ width: "100px" }}>DEPTH</Field>
        <Field sx={{ width: "130px" }}>TOTAL</Field>
      </Row>
      {group
        .filter((grp) => grp.type !== groupTypeName.all)
        .map((grp, index) => {
          return (
            <EstimatePerGroup
              key={index}
              scaleInfo={scaleInfo}
              group={grp}
              polygon={polygon.filter((poly) => poly.group === grp.id)}
              length={length.filter((len) => len.group === grp.id)}
              count={count.filter((cnt) => cnt.group === grp.id)}
            />
          );
        })}
      {group
        .filter((grp) => grp.type === groupTypeName.all)
        .map((grp, index) => {
          return (
            <EstimateDefaultGroup
              key={index}
              scaleInfo={scaleInfo}
              group={grp}
              polygon={polygon.filter((poly) => poly.group === grp.id)}
              length={length.filter((len) => len.group === grp.id)}
              count={count.filter((cnt) => cnt.group === grp.id)}
            />
          );
        })}
      <Divider sx={{ height: "1px", width: "100%" }} />
    </Container>
  );
};

export default EstimatePerPage;

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  marginTop: "25px",
  gap: "12px",
});

const Row = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
});

const Field = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  height: "30px",
});
