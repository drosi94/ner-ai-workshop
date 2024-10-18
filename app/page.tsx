import FileUpload from '@/components/FileUpload';
import NERExtraction from '@/components/NERExtraction';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        File Management and NER Extraction
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">File Upload</h2>
          <FileUpload />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">NER Extraction</h2>
          <NERExtraction />
        </div>
      </div>
    </div>
  );
}
