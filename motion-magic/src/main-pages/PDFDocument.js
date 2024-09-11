import {Document} from "@react-pdf/renderer";
import FullSolutionPDF from "./FullSolutionPDF";
import React from "react";

const PDFDocument = ({ problem }) => (
    <Document>

        <FullSolutionPDF problem={problem} />

    </Document>
);

export default PDFDocument;