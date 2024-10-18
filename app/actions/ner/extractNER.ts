'use server';

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { jsonSchemaToZod } from 'json-schema-to-zod';

export async function extractNER(prompt: string, schema: string) {
  const parsedSchema = JSON.parse(schema) as Record<string, string>;

  // biome-ignore lint/security/noGlobalEval: <explanation>
  const zodSchema = eval(jsonSchemaToZod(parsedSchema, { module: 'cjs' }));

  const template = `
      You are a smart and intelligent Named Entity Recognition (NER) system. Your task is to extract named entities from the following Input according to the given prompt and schema:

      Prompt: {prompt}

      Input: {context}

      Provide the output in valid JSON format that matches the given schema.
      If you cannot find any entity, please return an empty array.
    `;

  const promptTemplate = ChatPromptTemplate.fromTemplate(template);

  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0,
    maxRetries: 6,
    apiKey: process.env.OPENAI_API_KEY,
  }).withStructuredOutput(zodSchema);

  const chain = promptTemplate.pipe(model);

  const result = await chain.invoke({
    prompt,
    context: 'The cat name is tom and the mouse name is jerry',
  });

  console.log(result);

  return result;
}
