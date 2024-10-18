'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import locale from 'react-json-editor-ajrm/locale/en';
import { extractNER } from '@/app/actions/ner/extractNER';

const JSONEditor = dynamic(() => import('react-json-editor-ajrm').then((mod) => mod.default), { ssr: false });

const NERExtraction: React.FC = () => {
  const [prompt, setPrompt] = useState('Extract the mouseName and the catName from the context');
  const [schema, setSchema] = useState({
    type: 'object',
    properties: {
      mouseName: {
        type: 'string',
      },
      catName: {
        type: 'string',
      },
    },
  });
  const [result, setResult] = useState({});
  const { toast } = useToast();

  const handleExtraction = async () => {
    try {
      const data = await extractNER(prompt, JSON.stringify(schema, null, 2));
      setResult(data);
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
      <Textarea placeholder="Enter NER extraction prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[100px]" />
      <div className="border rounded-md p-2">
        <JSONEditor
          placeholder={schema}
          onChange={(value: { jsObject: any }) => setSchema(value.jsObject)}
          locale={locale}
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
            primitive: '#569cd6',
          }}
        />
      </div>
      <Button onClick={handleExtraction} className="w-full">
        Process NER Extraction
      </Button>
      {Object.keys(result ?? {}).length > 0 ? (
        <div className="mt-8">
          <JSONEditor
            viewOnly
            placeholder={result}
            locale={locale}
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
              primitive: '#569cd6',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default NERExtraction;
