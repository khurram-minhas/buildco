import { Box, Divider, styled, Typography } from "@mui/material";

import {
  countType,
  groupType,
  lengthType,
  polygonType,
  scaleInfoType,
} from "../utils";
import EstimatePerPage from "./EstimatePerPage";

type propsType = {
  fileName: string;
  scaleInfo: scaleInfoType[];
  group: groupType[];
  polygon: polygonType[][];
  length: lengthType[][];
  count: countType[][];
};

const EstimatePerPdf = ({
  fileName,
  scaleInfo,
  group,
  polygon,
  length,
  count,
}: propsType): JSX.Element => {
  return (
    <Container>
      <Typography
        noWrap
        fontWeight="500"
        letterSpacing="0.00938em"
        fontSize="24px"
        sx={{
          color: "#222222",
          maxWidth: "900px",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {fileName}
      </Typography>
      <Divider sx={{ marginTop: "3px" }} />
      {scaleInfo.map((_, index) => (
        <EstimatePerPage
          key={index}
          pageIndex={index + 1}
          scaleInfo={scaleInfo[index]}
          group={group}
          polygon={polygon[index]}
          length={length[index]}
          count={count[index]}
        />
      ))}
    </Container>
  );
};

export default EstimatePerPdf;

const Container = styled(Box)({
  padding: "20px 10px 20px 0px",
  width: "1025px",
  overflow: "hidden",
  overflowY: "auto",
});
