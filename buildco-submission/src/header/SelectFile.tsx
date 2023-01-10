import { Box, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import React, { MouseEventHandler, useRef, useState } from "react";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RenameModal from "../modal/RenameModal";
import DeleteModal from "../modal/DeleteModal";

type props = {
  fileName: string[];
  pdfOrder: number[];
  selectedPdf: number;
  changePdfOrder: React.Dispatch<React.SetStateAction<number[]>>;
  changeSelectedPdf: React.Dispatch<React.SetStateAction<number>>;
};
const SelectFile = ({
  fileName,
  pdfOrder,
  changePdfOrder,
  selectedPdf,
  changeSelectedPdf,
}: props): JSX.Element => {
  const theme = useTheme();
  const [anchorElList, setAnchorElList] = useState<null | HTMLElement>(null);
  const openList = Boolean(anchorElList);
  const [anchorElOption, setAnchorElOption] = useState<null | HTMLElement>(
    null
  );
  const openOption = Boolean(anchorElOption);
  const activePdf = useRef<string>("");
  const [modalType, setModalType] = useState<string>("");
  if (selectedPdf === -1 && pdfOrder.length > 0) changeSelectedPdf(pdfOrder[0]);
  else if (selectedPdf !== -1 && pdfOrder.indexOf(selectedPdf) === -1) {
    changeSelectedPdf((prev) => pdfOrder[0] || -1);
  }

  const handleChangeList = (order: number) => {
    changeSelectedPdf(order);
  };
  const handleToggleList: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElList) {
      setAnchorElList(null);
    } else {
      setAnchorElList(event?.currentTarget);
    }
  };
  const handleCloseList = () => {
    setAnchorElList(null);
  };

  const handleToggleOption = (event: any) => {
    activePdf.current = event.currentTarget.id;
    if (anchorElOption) {
      setAnchorElOption(null);
    } else {
      setAnchorElOption(event?.currentTarget);
    }
  };
  const handleCloseOption = () => {
    setAnchorElOption(null);
    setAnchorElList(null);
  };

  const handleOpenModal = (type: "delete" | "rename") => {
    setModalType(type);
  };

  return (
    <Box
      sx={{
        color: theme.color.primary,
      }}
    >
      <Box
        onClick={handleToggleList}
        sx={{
          display: "flex",
          alignitems: "center",
          justtifyContent: "center",
          cursor: "pointer",
          ":hover": {
            backgroundColor: theme.color.buttonHover,
          },
        }}
      >
        {selectedPdf !== -1 && (
          <PictureAsPdfIcon
            fontSize="small"
            sx={{
              color: theme.color.primary,
              marginRight: "5px",
            }}
          />
        )}
        <Typography
          noWrap
          fontWeight="400"
          lineHeight="1.5"
          letterSpacing="0.00938em"
          fontSize="15px"
          sx={{
            maxWidth: "150px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {selectedPdf === -1 ? "no file selected" : fileName[selectedPdf]}
        </Typography>
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
        sx={{
          "& .MuiPaper-root": {
            maxWidth: "350px",
            minWidth: "150px",
            minHeight: "30px",
            maxHeight: "600px",
          },
        }}
      >
        {pdfOrder.map((order) => (
          <MenuItem
            key={order}
            selected={order === selectedPdf}
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
                setTimeout(() => {
                  handleChangeList(order);
                }, 10);
              }}
              noWrap
              sx={{
                maxWidth: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexGrow: 1,
                fontSize: "15px",
              }}
            >
              {fileName[order]}
            </Typography>
            <MoreHorizIcon id={order.toString()} onClick={handleToggleOption} />
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
        <MenuItem
          onClick={() => {
            handleOpenModal("delete");
            handleCloseOption();
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseOption();
            handleOpenModal("rename");
          }}
        >
          Rename
        </MenuItem>
      </Menu>

      {modalType === "rename" && (
        <RenameModal
          fileName={fileName}
          pdfIndex={activePdf.current}
          onClose={() => setModalType("")}
        />
      )}
      {modalType === "delete" && (
        <DeleteModal
          type={"Plan"}
          onClose={() => setModalType("")}
          onDelete={() => {
            setTimeout(() => {
              changePdfOrder((prev) => {
                const temp = [...prev];
                temp.splice(pdfOrder.indexOf(+activePdf.current), 1);
                return temp;
              });
            }, 10);
          }}
        />
      )}
    </Box>
  );
};

export default SelectFile;
