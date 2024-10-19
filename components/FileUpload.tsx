'use client';

import Compressor from '@uppy/compressor';
import Uppy from '@uppy/core';
import GoldenRetriever from '@uppy/golden-retriever';
import ImageEditor from '@uppy/image-editor';
import { Dashboard, useUppyEvent } from '@uppy/react';
import Webcam from '@uppy/webcam';
import { useEffect, useState } from 'react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';

type Props = Readonly<{
  onFilesChange: (files: File[] | ((currentFiles: File[]) => File[])) => void;
}>;

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

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function FileUpload(props: Props) {
  const { onFilesChange } = props;

  const [uppy, setUppy] = useState(
    () =>
      new Uppy({
        debug: process.env.NODE_ENV === 'development',
        restrictions: {
          allowedFileTypes: Object.values(acceptedFileFormats).flat(),
          maxFileSize: MAX_FILE_SIZE,
          maxNumberOfFiles: 5,
        },
      }),
  );

  // keep file added to state

  useEffect(() => {
    const uppy = new Uppy().use(Webcam).use(ImageEditor).use(Compressor, {
      quality: 0.75,
    });
    setUppy(uppy);
  }, []);

  useUppyEvent(uppy, 'file-added', (file) => {
    console.log('file added:', file.name);
    onFilesChange((files) => [...files, file.data as File]);
  });

  useUppyEvent(uppy, 'file-removed', (file) => {
    console.log('file removed:', file.name);
    onFilesChange((files) => files.filter((f) => f.name !== file.name));
  });

  return (
    <>
      <Dashboard uppy={uppy} showProgressDetails />
    </>
  );
}

export default FileUpload;
