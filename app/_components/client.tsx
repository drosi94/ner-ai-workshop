'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import NERExtraction from '@/components/NERExtraction';
import { useToast } from '@/hooks/use-toast';
import { extractNER } from '@/app/actions/ner/extractNER';

export function AppClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExtraction = async (formData: FormData) => {
    const prompt = formData.get('prompt') as string;
    const schema = formData.get('schema') as string;

    if (!files || files.length === 0 || !prompt || !schema) {
      toast({
        title: 'Validation failed',
        description: 'Please select at least one file, add a prompt and schema to extract NER',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult({});
    files.forEach((file) => formData.append('file', file));

    try {
      const data = await extractNER(formData);
      setResult(data);
    } catch (error) {
      toast({
        title: 'Error processing NER extraction',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-8" action={handleExtraction}>
      <div>
        <h2 className="text-2xl font-semibold mb-4">File Upload</h2>
        <FileUpload onFilesChange={setFiles} />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">NER Extraction</h2>
        <NERExtraction result={result} isLoading={isLoading} />
      </div>
    </form>
  );
}
