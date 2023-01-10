import { useEffect, useRef, useState } from "react";
import {useLocation} from "react-router-dom";
import Header from "./header/Header";
import {
  getFileName,
  Pdf2Image,
  PdfjsDocument,
  pdfjsExtractPages,
} from "./reusables/helpers";
import * as pdfjsLib from "pdfjs-dist";
import PreviewSection from "./preview/PreviewSection";
import Playground from "./playground/Playground";
import {
  activeGroupType,
  activeToolOptions,
  annotateType,
  countType,
  groupType,
  groupTypeName,
  iconType,
  lengthType,
  makeid,
  polygonType,
  scaleInfoType,
  unitType,
} from "./utils";
import MeasurementSection from "./measurement/MeasurementSection";
import InitialUpload from "./fileUpload/InitialUpload";
import _ from "lodash";
import EstimateSection from "./estimate/EstimateSection";
import { Backdrop, CircularProgress } from "@mui/material";
import CostSection from "./cost/CostSection";
import CustomButton from "./reusables/Button";
import MobileWeb from "./MobileWeb";

const Homepage = (): JSX.Element => {
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const uploadedFiles = useRef<File[]>([]);
  const fileName = useRef<string[]>([]);
  const pdfDocs = useRef<pdfjsLib.PDFDocumentProxy[]>([]);
  const pdfPages = useRef<pdfjsLib.PDFPageProxy[][]>([]);
  const previewPages = useRef<HTMLImageElement[][]>([]);
  const [pdfOrder, setPdfOrder] = useState<number[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<number>(-1);
  const [selectedPage, setSelectedPage] = useState<number[]>([]);
  const [showPage, setShowPage] = useState<boolean>(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number[][]>([]);
  const [activeTool, setActiveTool] = useState<activeToolOptions>(
    activeToolOptions.pan
  );
  const search = useLocation().search;
  const pdfId = new URLSearchParams(search).get('id');
  const [scaleInfo, setScaleInfo] = useState<scaleInfoType[][]>([]);
  const [group, setGroup] = useState<groupType[]>([
    {
      id: 1,
      name: "Indivisual Measurement",
      type: groupTypeName.all,
      color: { r: 255, g: 188, b: 1, a: 1 },
      unit: unitType.ft,
      icon: iconType.circle,
    },
  ]);
  const [activeGroup, setActiveGroup] = useState<activeGroupType>({
    shape: 1,
    length: 1,
    count: 1,
  });
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:8081/getData/${pdfId}`)
      const data = await res.json();
      setScaleInfo(data.scaleInfo)
      setPolygon(data.polygon)
      setAnnotate(data.annotate)
      setLength(data.length)
      setCount(data.count)
      setCount(data.zoomLevel)
    }
    fetchData()
    window.onresize = function(event) {
      if(window.screen.width <= 991) setIsMobile(true)
      else setIsMobile(false)
    };
    if(window.screen.width <= 991) setIsMobile(true)
  }, [])

  const [polygon, setPolygon] = useState<polygonType[][][]>([]);
  const [length, setLength] = useState<lengthType[][][]>([]);
  const [count, setCount] = useState<countType[][][]>([]);
  const [annotate, setAnnotate] = useState<annotateType[][][]>([]);
  const undoStack = useRef<(() => void)[]>([]);
  const redoStack = useRef<(() => void)[]>([]);
  const [showEstimate, setShowEstimate] = useState<boolean>(false);
  const [showCost, setShowCost] = useState<boolean>(false);
  const [isDrawingActive, setIsDrawingActive] = useState<boolean>(false);

  const captureStates = () => {
    setPolygon((prev) => _.cloneDeep(polygon));
    setLength((prev) => _.cloneDeep(length));
    setCount((prev) => _.cloneDeep(count));
    setGroup((prev) => _.cloneDeep(group));
  };

  const fileUploadHandler = async (files: FileList) => {
    console.log(files)
    setLoading(true);
    const names = await getFileName(files);
    const docs = await PdfjsDocument(files);
    const newPages: pdfjsLib.PDFPageProxy[][] = [];
    const newPreviewPages: HTMLImageElement[][] = [];
    const newZoomLevel: number[][] = [];
    const newScaleInfo: scaleInfoType[][] = [];
    const newPolygon: polygonType[][][] = [];
    const newLength: lengthType[][][] = [];
    const newCount: countType[][][] = [];
    const newAnnotate: annotateType[][][] = [];
    for (const doc of docs) {
      const extractedPages = await pdfjsExtractPages(
        doc,
        [...Array(doc.numPages).keys()].map((e) => e + 1)
      );
      newPages.push(extractedPages);
      newPreviewPages.push(await Pdf2Image(hiddenCanvasRef, extractedPages));

      newZoomLevel.push([...Array(doc.numPages).keys()].map((e) => 50));
      newScaleInfo.push(
        [...Array(doc.numPages).keys()].map((e) => {
          return {
            calibrated: false,
            x: 1,
            y: 0,
            prevScale: 0.5,
            L: 1,
          };
        })
      );

      newPolygon.push([...Array(doc.numPages).keys()].map((e) => []));
      newLength.push([...Array(doc.numPages).keys()].map((e) => []));
      newCount.push([...Array(doc.numPages).keys()].map((e) => []));
      newAnnotate.push([...Array(doc.numPages).keys()].map((e) => []));
    }
    const prevCount = uploadedFiles.current.length;
    uploadedFiles.current.push(...files);
    fileName.current.push(...names);
    pdfDocs.current.push(...docs);
    pdfPages.current.push(...newPages);
    previewPages.current.push(...newPreviewPages);

    setPolygon((prev) => [...prev, ...newPolygon]);
    setLength((prev) => [...prev, ...newLength]);
    setCount((prev) => [...prev, ...newCount]);
    setAnnotate((prev) => [...prev, ...newAnnotate]);
    setScaleInfo((prev) => [...prev, ...newScaleInfo]);
    setZoomLevel((prev) => [...prev, ...newZoomLevel]);
    setSelectedPage((prev) => [
      ...prev,
      ...[...Array(files.length).keys()].map((ind) => 0),
    ]);

    setSelectedPdf(0);
    setPdfOrder((prev) => [
      ...prev,
      ...[...Array(files.length).keys()].map((ind) => ind + prevCount),
    ]);
    setLoading(false);
  };

  const onSaveDetails = async () => {
    const res = await fetch('http://localhost:8081/saveData', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scaleInfo,
        polygon,
        annotate,
        length,
        count,
        zoomLevel,
        id: pdfId,
      })
    })

    let id = pdfId ? pdfId.toString() : makeid(5);
    id += '.pdf'
    var formData = new FormData();
    var xhr      = new XMLHttpRequest();

    formData.append('file', uploadedFiles.current[0], id);

    xhr.open("POST", "http://localhost:8081/post_pdf", true);

    xhr.onreadystatechange = function () {  
        if (xhr.readyState === 4) {  
            if (xhr.status === 200) {  
                console.log(xhr.responseText);
            } else {  
                console.error(xhr.statusText);  
            }  
        }  
    };

    xhr.send(formData);
  }

  const changeZoomLevel = (zoom) => {
    // setIsDrawingActive(true)
    setZoomLevel(zoom)
  }

  const changeScaleInfo = (scaleInfo) => {
    setIsDrawingActive(true)
    setScaleInfo(scaleInfo)
  }

  if(isMobile)
    return <MobileWeb />
  return (
    <>
      {showEstimate ? (
        <EstimateSection
          pdfOrder={pdfOrder}
          fileName={fileName.current}
          scaleInfo={scaleInfo}
          group={group}
          polygon={polygon}
          length={length}
          count={count}
          toggleShowEstimate={setShowEstimate}
          toggleShowCost={setShowCost}
          onSaveDetails={onSaveDetails}
        />
      ) : showCost ? (
        <CostSection
          scaleInfo={scaleInfo}
          group={group}
          polygon={polygon}
          count={count}
          toggleShowEstimate={setShowEstimate}
          toggleShowCost={setShowCost}
          toggleLoading={setLoading}
        />
      ) : (
        <>
          {pdfOrder.length === 0 && (
            <InitialUpload pdfId={pdfId} onFileUpload={fileUploadHandler} />
          )}
          {selectedPdf !== -1 && pdfOrder.length > 0 && (
            <>
              <Header
                onFileUpload={fileUploadHandler}
                fileName={fileName.current}
                selectedPdf={selectedPdf}
                changeSelectedPdf={setSelectedPdf}
                selectedPage={selectedPage[selectedPdf]}
                pdfOrder={pdfOrder}
                changePdfOrder={setPdfOrder}
                currentZoomLevel={
                  selectedPdf === -1
                    ? 50
                    : zoomLevel[selectedPdf][selectedPage[selectedPdf]]
                }
                changeZoomLevel={changeZoomLevel}
                activeTool={activeTool}
                changeActiveTool={setActiveTool}
                showPage={showPage}
                toggleShowPage={setShowPage}
                showMeasurements={showMeasurements}
                toggleShowMeasurements={setShowMeasurements}
                group={group}
                changeGroup={setGroup}
                activeGroup={activeGroup}
                changeActiveGroup={setActiveGroup}
                scaleInfo={scaleInfo}
                polygon={polygon}
                changePolygon={setPolygon}
                length={length}
                changeLength={setLength}
                count={count}
                changeCount={setCount}
                undoStack={undoStack}
                redoStack={redoStack}
                captureStates={captureStates}
                isDrawingActive={isDrawingActive}
                setIsDrawingActive={setIsDrawingActive}
              />

              <Playground
                selectedPdf={selectedPdf}
                selectedPage={selectedPage[selectedPdf]}
                page={pdfPages.current[selectedPdf][selectedPage[selectedPdf]]}
                zoomLevel={zoomLevel[selectedPdf][selectedPage[selectedPdf]]}
                toggleLoading={setLoading}
                activeTool={activeTool}
                changeActiveTool={setActiveTool}
                scaleInfo={scaleInfo}
                changeScaleInfo={changeScaleInfo}
                polygon={polygon[selectedPdf][selectedPage[selectedPdf]]}
                changePolygon={setPolygon}
                length={length[selectedPdf][selectedPage[selectedPdf]]}
                changeLength={setLength}
                count={count[selectedPdf][selectedPage[selectedPdf]]}
                changeCount={setCount}
                annotate={annotate[selectedPdf][selectedPage[selectedPdf]]}
                changeAnnotate={setAnnotate}
                group={group}
                activeGroup={activeGroup}
                undoStack={undoStack}
                redoStack={redoStack}
                captureStates={captureStates}
                setIsDrawingActive={setIsDrawingActive}
              />

              {showPage && (
                <PreviewSection
                  selectedPdf={selectedPdf}
                  selectedPage={selectedPage[selectedPdf]}
                  changeSelectedPage={setSelectedPage}
                  pages={pdfPages.current[selectedPdf]}
                  previewPages={previewPages.current[selectedPdf]}
                  changeLoading={setLoading}
                  isGroupOpen={
                    activeTool === activeToolOptions.rectangle ||
                    activeTool === activeToolOptions.polygon ||
                    activeTool === activeToolOptions.length ||
                    activeTool === activeToolOptions.count
                  }
                />
              )}
              {showMeasurements && (
                <MeasurementSection
                  selectedPdf={selectedPdf}
                  selectedPage={selectedPage[selectedPdf]}
                  scaleInfo={scaleInfo[selectedPdf][selectedPage[selectedPdf]]}
                  group={group}
                  changeGroup={setGroup}
                  polygon={polygon}
                  changePolygon={setPolygon}
                  length={length}
                  changeLength={setLength}
                  count={count}
                  changeCount={setCount}
                  isGroupOpen={
                    activeTool === activeToolOptions.rectangle ||
                    activeTool === activeToolOptions.polygon ||
                    activeTool === activeToolOptions.length ||
                    activeTool === activeToolOptions.count
                  }
                  toggleShowEstimate={setShowEstimate}
                  toggleShowCost={setShowCost}
                  undoStack={undoStack}
                  redoStack={redoStack}
                  captureStates={captureStates}
                />
              )}
            </>
          )}
        </>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <canvas style={{ display: "none" }} ref={hiddenCanvasRef} />

      {selectedPdf !== -1 && pdfOrder.length > 0 &&  
        <CustomButton
          backgroundcolor="#ffa700"
          hoverbackgroudcolor="#ff8700"
          Color="white"
          hovercolor="white"
          sx={{
            margin: "5px 0px",
            borderRadius: "4px",
            padding: "3px 6px",
            height: "35px",
            width: "100px",
            position: "absolute",
            bottom: "10px",
            right: "10px",
          }}
          onClick={onSaveDetails}
        >
          Save
        </CustomButton>
      }
    </>
  );
};

export default Homepage;
