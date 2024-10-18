'use client';

import { toast } from '@/hooks/use-toast';
import Compressor from '@uppy/compressor';
import Uppy from '@uppy/core';
import GoldenRetriever from '@uppy/golden-retriever';
import ImageEditor from '@uppy/image-editor';
import { Dashboard, useUppyEvent } from '@uppy/react';
import Tus from '@uppy/tus';
import Webcam from '@uppy/webcam';
import { useEffect, useState } from 'react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';

const acceptedFileFormats = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'text/plain': ['.txt'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '.pptx',
  ],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
  'application/vnd.oasis.opendocument.text': ['.odt'],
};

const FileUpload: React.FC = () => {
  const [uppy] = useState(
    () =>
      new Uppy({
        debug: process.env.NODE_ENV === 'development',
        restrictions: {
          allowedFileTypes: Object.values(acceptedFileFormats).flat(),
        },
      })
        .use(Webcam)
        .use(GoldenRetriever)
        .use(ImageEditor)
        .use(Compressor, {
          quality: 0.75,
        })
    // .use(Tus, {
    //   endpoint: supabaseStorageURL,
    //   headers: {
    //     apikey: SUPABASE_ANON_KEY!,
    //   },
    //   uploadDataDuringCreation: true,
    //   chunkSize: 6 * 1024 * 1024,
    //   allowedMetaFields: [
    //     'bucketName',
    //     'objectName',
    //     'contentType',
    //     'cacheControl',
    //   ],
    // })
  );

  return <Dashboard uppy={uppy} showProgressDetails />;
};

export default FileUpload;
