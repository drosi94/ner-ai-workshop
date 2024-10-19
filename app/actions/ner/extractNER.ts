'use server';

import { UnstructuredLoader } from '@langchain/community/document_loaders/fs/unstructured';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export async function extractNER(formData: FormData) {
  const userPrompt = formData.get('prompt') as string;
  const userSchema = formData.get('schema') as string;
  const userFiles = formData.getAll('file') as File[];

  const userParsedSchema = JSON.parse(userSchema) as Record<string, string>;

  const schema = {
    type: 'object',
    properties: {
      entities: {
        type: 'array',
        items: userParsedSchema,
      },
    },
  };

  const template = `
      You are a smart and intelligent Named Entity Recognition (NER) system. Your task is to extract named entities from the following Input according to the given prompt and schema:

      Prompt: {prompt}

      Input: {context}

      Provide the output in valid JSON format that matches the given schema and always according to the prompt given above. NEVER extract entities from the prompt or the examples, only from the input text given as context. If you cannot find any entity, please return an empty array.
    `;

  const promptTemplate = ChatPromptTemplate.fromTemplate(template);

  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0,
    maxRetries: 6,
    apiKey: process.env.OPENAI_API_KEY,
  }).withStructuredOutput(schema, {
    method: 'jsonSchema',
  });

  const chain = promptTemplate.pipe(model);

  const filesToBlob = userFiles.map((file) => new Blob([file]));

  const filesContents = await Promise.all(
    filesToBlob.map(async (blob, index) => {
      const loader = new UnstructuredLoader(
        {
          fileName: userFiles[index].name,
          buffer: Buffer.from(await blob.arrayBuffer()),
        },
        {
          apiUrl: 'https://api.unstructuredapp.io/general/v0/general',
          apiKey: process.env.UNSTRUCTURED_API_KEY,
          ocrLanguages: ['el', 'en'],
          strategy: userFiles[index].type === 'application/pdf' ? 'fast' : 'auto',
        },
      );

      const documents = await loader.load();

      // join all the text from the documents
      return documents.map((doc) => doc.pageContent).join('');
    }),
  );

  console.log('STARTED EXTRACTION');
  const result = await chain.invoke({
    prompt: userPrompt,
    context: filesContents.join('\n\n'),
  });

  console.log('FINISHED EXTRACTION');
  console.log(result);

  return result;
}
