import { PDFDocument } from 'pdf-lib';
// import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const getPDFPageCount = async (file) => {
  // console.log("getpdf",file)
  // try {
  //   const arrayBuffer = await file.arrayBuffer();
  //   const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  //   return pdf.numPages;
  // } catch (error) {
  //   console.error('Error counting PDF pages:', error);
  //   return null;
  // }
  console.log("getpdf",file)
  try {
  
    let totalPageCount = 0;

   
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      totalPageCount += pdfDoc.getPageCount();
    
  
    return totalPageCount;
  } catch (error) {
    console.error('Error counting PDF pages:', error);
    return null;
  }
};

