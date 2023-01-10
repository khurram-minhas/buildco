import { Button, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

type propsType = {
  changeAnnotate: () => void;
  scaleFactor: number;
};

const DeleteButton = ({
  changeAnnotate,
  scaleFactor,
}: propsType): JSX.Element => {
  return (
    <Button
      variant="outlined"
      sx={{
        padding: "3px",
        minWidth: "auto",
        borderRadius: "0px",
        backgroundColor: "white",
        "&:hover": {
          backgroundColor: "#d9f0fa",
        },
      }}
      onClick={changeAnnotate}
    >
      <IconButton sx={{ padding: 0, minWidth: "auto" }}>
        <DeleteIcon
          sx={{
            width: `${20 / scaleFactor}px`,
            height: `${20 / scaleFactor}px`,
            color: "#FFBC01",
          }}
        />
      </IconButton>
    </Button>
  );
};

export default DeleteButton;
