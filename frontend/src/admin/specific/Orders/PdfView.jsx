import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

function PdfViewer({ publicId }) {
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dwdgrp9kz',
    },
  });

  const myImage = cld.image(publicId);

 const  handlePrint = (event) => {
    event.preventDefault();
  }

  return (
    <div>
      <AdvancedImage cldImg={myImage} />
      <button onClick={handlePrint}>Print PDF</button>
    </div>
  );
}

export default PdfViewer;