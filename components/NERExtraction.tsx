'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import locale from 'react-json-editor-ajrm/locale/en';
import { defaultPromptTemplate, defaultSchemaJSON } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const JSONEditor = dynamic(() => import('react-json-editor-ajrm').then((mod) => mod.default), { ssr: false });
const editorStyles = {
  background: 'transparent',
  default: '#d4d4d4',
  string: '#ce9178',
  number: '#b5cea8',
  colon: '#d4d4d4',
  keys: '#9cdcfe',
  keys_whiteSpace: '#af99c4',
  primitive: '#569cd6',
};

type Props = Readonly<{
  result?: Record<string, unknown>;
  isLoading?: boolean;
}>;

function NERExtraction(props: Props) {
  const { result, isLoading = false } = props;

  const [prompt, setPrompt] = useState(defaultPromptTemplate);
  const [schema, setSchema] = useState<Record<string, unknown>>(defaultSchemaJSON);

  return (
    <div className="space-y-4">
      <Textarea
        name="prompt"
        placeholder="Enter NER extraction prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[100px]"
        disabled={isLoading}
      />
      <div className="border rounded-md p-2">
        <input type="hidden" name="schema" value={JSON.stringify(schema)} />
        <JSONEditor
          viewOnly={isLoading}
          placeholder={schema}
          onChange={(value: { jsObject: Record<string, unknown> }) => setSchema(value.jsObject)}
          locale={locale}
          height="200px"
          width="100%"
          colors={editorStyles}
        />
      </div>
      <Button disabled={isLoading} type="submit" className="w-full disabled:opacity-40">
        {isLoading ? 'Extracting entities...' : 'Extract entities'}
      </Button>
      {Object.keys(result ?? {}).length > 0 ? (
        <div className="mt-8">
          <JSONEditor viewOnly placeholder={result} locale={locale} height="200px" width="100%" colors={editorStyles} />
        </div>
      ) : null}
    </div>
  );
}

export default NERExtraction;
