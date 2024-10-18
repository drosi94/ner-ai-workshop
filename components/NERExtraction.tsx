'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

const JSONEditor = dynamic(() => import('react-json-editor-ajrm').then((mod) => mod.default), { ssr: false });

const NERExtraction: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [schema, setSchema] = useState({});
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const handleExtraction = async () => {
    try {
      const response = await fetch('/api/ner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, schema: JSON.stringify(schema) }),
      });

      if (!response.ok) {
        throw new Error('Failed to process NER extraction');
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      toast({
        title: 'Error processing NER extraction',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter NER extraction prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="border rounded-md p-2">
        <JSONEditor
          placeholder={schema}
          onChange={(value: { jsObject: any }) => setSchema(value.jsObject)}
          locale="en"
          height="200px"
          width="100%"
          colors={{
            background: 'transparent',
            default: '#d4d4d4',
            string: '#ce9178',
            number: '#b5cea8',
            colon: '#d4d4d4',
            keys: '#9cdcfe',
            keys_whiteSpace: '#af99c4',
            primitive: '#569cd6'
          }}
        />
      </div>
      <Button onClick={handleExtraction} className="w-full">Process NER Extraction</Button>
      {result && (
        <Textarea value={result} readOnly className="min-h-[200px]" />
      )}
    </div>
  );
};

export default NERExtraction;