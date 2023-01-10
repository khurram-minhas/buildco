import * as pdfjsLib from "pdfjs-dist";
import { scaleInfoType } from "../utils";
pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

const getFileName = async (
  files: File | FileList
): Promise<string | string[]> => {
  if (files instanceof File) return files.name;
  const names: string[] = [];
  for (const file of files) {
    names.push(file.name);
  }
  return names;
};

const PdfjsDocument = async (
  files: FileList
): Promise<pdfjsLib.PDFDocumentProxy[]> => {
  const docs: pdfjsLib.PDFDocumentProxy[] = [];
  for (const file of files) {
    const pdfDoc = await pdfjsLib
      .getDocument(URL.createObjectURL(file))
      .promise.then((pdf: pdfjsLib.PDFDocumentProxy) => pdf);
    docs.push(pdfDoc);
  }
  return docs;
};

const pdfjsExtractPages = async (
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageIndex: number[]
): Promise<pdfjsLib.PDFPageProxy[]> => {
  const pdfPages: pdfjsLib.PDFPageProxy[] = [];
  const promises: Promise<pdfjsLib.PDFPageProxy>[] = [];

  for (const index of pageIndex) {
    await pdfDoc.getPage(index).then((page) => {
      const promise = new Promise<pdfjsLib.PDFPageProxy>((resolve, reject) =>
        resolve(page)
      );
      promises.push(promise);
    });
  }
  await Promise.all(promises).then((pages) => {
    pdfPages.push(...pages);
  });
  return pdfPages;
};

const getPairedPoint = (point: number[]) => {
  const paired: any = [];
  for (let idx = 0; idx < point.length; idx += 2) {
    paired.push([point[idx], point[idx + 1]]);
  }
  return paired as any;
};

const rgba2hex = (rgba: any) => {
  if (!rgba) return "#ffffff";
  const { r, g, b, a } = rgba;
  var outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255)
      .toString(16)
      .substring(0, 2),
  ];
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = "0" + part;
    }
  });
  return "#" + outParts.join("");
};

const isClockwise = (points: number[]) => {
  let vertices = [...points, points[0], points[1]];
  let area = 0.0;
  for (let i = 2; i < vertices.length; i += 2) {
    area +=
      (vertices[i] - vertices[i - 2]) * (vertices[i + 1] + vertices[i + 1 - 2]);
  }
  return area < 0;
};
const polygonArea = (vertices: number[]) => {
  var total = 0;
  for (var i = 0, l = vertices.length / 2; i < l; i++) {
    var addX = vertices[2 * i];
    var addY = vertices[2 * i === vertices.length - 2 ? 1 : 2 * i + 3];
    var subX = vertices[2 * i === vertices.length - 2 ? 0 : 2 * i + 2];
    var subY = vertices[2 * i + 1];
    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }
  return Math.abs(total);
};

const getLength = (points: number[]) => {
  let length = 0.0;
  for (let i = 2; i < points.length; i += 2) {
    const deltaX = points[i] - points[i - 2];
    const deltaY = points[i + 1] - points[i + 1 - 2];
    length += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
  return length;
};

const getScaledVolume = (
  area: number,
  scaleInfo: scaleInfoType,
  unit: string,
  height: number | undefined,
  depth: number | undefined
  // pitch: number | undefined
) => {
  const dim = height || depth; //|| pitch;
  if (unit === "px") {
    if (dim) {
      return `${(area * dim).toFixed(2)} px3`;
    } else {
      return `${area.toFixed(2)} px2`;
    }
  } else if (unit === "ft") {
    if (dim) {
      return `${(
        (area * scaleInfo.L * scaleInfo.L * dim) /
        (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
      ).toFixed(2)} ft3`;
    } else {
      return `${(
        (area * scaleInfo.L * scaleInfo.L) /
        (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
      ).toFixed(2)} ft2`;
    }
  } else if (unit === "in") {
    if (dim) {
      return `${(
        (area * scaleInfo.L * scaleInfo.L * dim * 144) /
        (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
      ).toFixed(2)} in3`;
    } else {
      return `${(
        (area * scaleInfo.L * scaleInfo.L * 144) /
        (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
      ).toFixed(2)} in2`;
    }
  } else {
    return "0 unit";
  }
};

const getScaledArea = (
  area: number,
  scaleInfo: scaleInfoType,
  unit: string
) => {
  if (unit === "px") {
    return `${area.toFixed(2)} px2`;
  } else if (unit === "ft") {
    return `${(
      (area * scaleInfo.L * scaleInfo.L) /
      (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
    ).toFixed(2)} ft2`;
  } else if (unit === "in") {
    return `${(
      (area * scaleInfo.L * scaleInfo.L * 144) /
      (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
    ).toFixed(2)} in2`;
  } else {
    return "0 unit";
  }
};

const Pdf2Image = async (
  hiddenCanvasRef: React.RefObject<HTMLCanvasElement>,
  pages: pdfjsLib.PDFPageProxy[]
) => {
  const canvas = hiddenCanvasRef.current!;
  const ctx = canvas.getContext("2d")!;

  const promises: Promise<string>[] = [];
  for (const page of pages) {
    const viewport = page.getViewport({ scale: 0.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page
      .render({
        canvasContext: ctx,
        viewport: viewport,
      })
      .promise.then(() => {
        const promise = new Promise<string>((resolve, reject) => {
          resolve(canvas.toDataURL("image/png", 0.1));
        });
        promises.push(promise);
      });
  }

  const bufferPromises: Promise<HTMLImageElement>[] = [];

  await Promise.all(promises).then(async (blobs) => {
    for (const blob of blobs) {
      const img = new window.Image();
      img.src = blob;
      const bufferPromise = new Promise<HTMLImageElement>((res, rej) => {
        img.onload = () => res(img);
      });
      bufferPromises.push(bufferPromise);
    }
  });
  const imageBuffers: HTMLImageElement[] = [];
  await Promise.all(bufferPromises).then((buffers) => {
    imageBuffers.push(...buffers);
  });
  return imageBuffers;
};

export {
  getFileName,
  PdfjsDocument,
  pdfjsExtractPages,
  getPairedPoint,
  rgba2hex,
  polygonArea,
  isClockwise,
  getLength,
  getScaledVolume,
  getScaledArea,
  Pdf2Image,
};
