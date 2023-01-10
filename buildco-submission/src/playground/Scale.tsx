import { Stage } from "konva/lib/Stage";
import { RefObject, useEffect, useRef, useState } from "react";
import { Layer, Line, Rect } from "react-konva";
import { activeToolOptions, scaleInfoType } from "../utils";

type propsType = {
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  changeScaleInfo: React.Dispatch<React.SetStateAction<scaleInfoType[][]>>;
  changeShowScaleModal: React.Dispatch<React.SetStateAction<boolean>>;
  enteredScale: any;
  activeTool: activeToolOptions;
};

const Scale = ({
  stageRef,
  scaleFactor,
  scaleInfo,
  changeScaleInfo,
  changeShowScaleModal,
  enteredScale,
  activeTool,
}: propsType): JSX.Element => {
  const needCleanup = useRef<boolean>(false);
  const [scale, setScale] = useState<number[]>([]);
  const scalling = useRef<boolean>(false);

  useEffect(() => {
    const layers = stageRef.current?.getStage().getLayers()!;
    if (activeTool === activeToolOptions.scale) {
      needCleanup.current = true;
      layers.forEach((layer) => {
        if (
          layer.attrs.name !== "imageLayer" &&
          layer.attrs.name !== "scaleLayer"
        )
          layer.hide();
      });
    }
    return () => {
      if (needCleanup.current) {
        layers.forEach((layer) => {
          if (
            layer.attrs.name !== "imageLayer" &&
            layer.attrs.name !== "scaleLayer"
          )
            layer.show();
        });
      }
    };
  }, [activeTool]);

  const handleMouseDownImageLayer = (event: any) => {
    if (activeTool !== activeToolOptions.scale) return;
    if (scalling.current === false) {
      scalling.current = true;
      event.target.getStage().container().style.cursor = "crosshair";
      const { x, y } = event.target.getStage().getPointerPosition();

      setScale([
        x - (stageRef.current?.attrs.x | 0),
        y - (stageRef.current?.attrs.y | 0),
      ]);
    } else if (scalling.current === true) {
      scalling.current = false;
      event.target.getStage().container().style.cursor = "default";
      const { x, y } = event.target.getStage().getPointerPosition();
      setScale((prev: any) => {
        const temp = [...prev];
        return [
          temp[0],
          temp[1],
          x - (stageRef.current?.attrs.x | 0),
          y - (stageRef.current?.attrs.y | 0),
        ];
      });

      enteredScale.current = {
        x:
          Math.abs(scale[0] - (x - (stageRef.current?.attrs.x | 0))) /
          scaleFactor,
        y:
          Math.abs(scale[1] - (y - (stageRef.current?.attrs.y | 0))) /
          scaleFactor,
      };
      changeShowScaleModal(true);
    }
  };

  const handleMouseMoveImageLayer = (event: any) => {
    if (activeTool !== activeToolOptions.scale) return;
    if (scale.length > 0 && scalling.current) {
      const { x, y } = event.target.getStage().getPointerPosition();
      setScale((prev) => {
        const temp = [...prev];
        return [
          temp[0],
          temp[1],
          x - (stageRef.current?.attrs.x | 0),
          y - (stageRef.current?.attrs.y | 0),
        ];
      });
    }
  };

  return (
    <>
      <Layer
        name="scaleLayer"
        onClick={handleMouseDownImageLayer}
        onMouseMove={handleMouseMoveImageLayer}
      >
        <Rect
          id="dummy-rect"
          height={stageRef.current?.getStage().attrs.height}
          width={stageRef.current?.getStage().attrs.width}
        />
        <Line
          points={scale.map((point) => point / scaleFactor)}
          stroke="#FFBC01"
          strokeWidth={3 / scaleFactor}
        ></Line>
      </Layer>
    </>
  );
};

export default Scale;
