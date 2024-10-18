'use client';

import Compressor from '@uppy/compressor';
import Uppy from '@uppy/core';
import GoldenRetriever from '@uppy/golden-retriever';
import ImageEditor from '@uppy/image-editor';
import { Dashboard } from '@uppy/react';
import Webcam from '@uppy/webcam';
import { useEffect, useState } from 'react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';

const acceptedFileFormats = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.oasis.opendocument.text': ['.odt'],
};

const FileUpload: React.FC = () => {
  const [uppy, setUppy] = useState(
    () =>
      new Uppy({
        debug: process.env.NODE_ENV === 'development',
        restrictions: {
          allowedFileTypes: Object.values(acceptedFileFormats).flat(),
        },
      }),
  );

  useEffect(() => {
    const uppy = new Uppy().use(Webcam).use(GoldenRetriever).use(ImageEditor).use(Compressor, {
      quality: 0.75,
    });
    setUppy(uppy);
  }, []);

  return <Dashboard uppy={uppy} showProgressDetails />;
};

export default FileUpload;
