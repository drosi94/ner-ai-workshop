import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { z } from 'zod';

const llm = new OpenAI({
  modelName: 'gpt-4',
  temperature: 0,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prompt, schema } = body;

  if (!prompt || !schema) {
    return NextResponse.json({ error: 'Missing prompt or schema' }, { status: 400 });
  }

  try {
    const parsedSchema = JSON.parse(schema);
    const zodSchema = z.object(parsedSchema);

    const template = `
      Extract named entities from the following text according to the given schema:
      
      Text: {text}
      
      Schema:
      {schema}
      
      Provide the output in valid JSON format that matches the given schema.
    `;

    const promptTemplate = new PromptTemplate({
      template,
      inputVariables: ['text', 'schema'],
    });

    const chain = new LLMChain({ llm, prompt: promptTemplate });

    const result = await chain.call({
      text: prompt,
      schema: JSON.stringify(parsedSchema, null, 2),
    });

    const parsedResult = JSON.parse(result.text);
    zodSchema.parse(parsedResult);

    return NextResponse.json(parsedResult);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}