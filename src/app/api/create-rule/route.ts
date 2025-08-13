import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Rule } from '@/types';

// This setup for the live Gemini API will be called when MOCK_API is set false
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

const systemPrompt = `
  You are an expert rule engine for a resource allocation tool. Your task is to convert a user's plain English request into a single, valid JSON rule object.

  You must adhere to the following STRICT schemas for the rules:
  1. Co-run Rule: { "type": "coRun", "tasks": ["TaskID1", "TaskID2"] }
  2. Load Limit Rule: { "type": "loadLimit", "workerGroup": "GroupName", "maxSlotsPerPhase": 5 }

  You will be given the user's request and context containing valid Task IDs and Worker Groups.
  - Use ONLY the Task IDs and Worker Groups provided in the context.
  - If the user's request is ambiguous or references items not in the context, you MUST return an error object: { "error": "Your clear, concise error message here." }

  IMPORTANT: Your response MUST be ONLY the valid JSON object. Do not include any explanations, markdown, or any other text.
`;

export async function POST(request: Request) {
  try {
    // MOCK API LOGIC 
    // Had to add this due to problems in testing as the api was not returning a valid response (status: 429, too many requests)
    if (process.env.MOCK_API === 'true') {
      console.log(" MOCK MODE: Returning a guaranteed successful rule response.");

      await new Promise(resolve => setTimeout(resolve, 800));

      // const { query } = await request.json();
      

      // if (query && typeof query === 'string' && query.toLowerCase().includes('co-run')) {
        const mockSuccessResponse: Rule = {
          type: "coRun",
          tasks: ["T_MOCK_A", "T_MOCK_B"]
        };
        return NextResponse.json(mockSuccessResponse);
      }
      
    //   if (query && typeof query === 'string' && query.toLowerCase().includes('limit')) {
    //      const mockLoadLimitResponse: Rule = {
    //         type: 'loadLimit',
    //         workerGroup: 'Sales-Mock-Group',
    //         maxSlotsPerPhase: 3
    //      };
    //      return NextResponse.json(mockLoadLimitResponse);
    //   }

    //   return NextResponse.json({ error: "Mock Error: Query not recognized." }, { status: 400 });
    // }
    // // END OF MOCK LOGIC


    // --- LIVE GEMINI API LOGIC ---
    // This code will only be reached if MOCK_API is not "true".
    // console.log("⚡️ LIVE MODE: Calling Gemini API.");
    
    const { query, taskContext, workerGroupContext } = await request.json();

    if (!query || !taskContext || !workerGroupContext) {
      return NextResponse.json({ error: 'Missing query or context' }, { status: 400 });
    }

    const userMessage = `
      User Request: "${query}"

      Context:
      - Valid Task IDs: ${JSON.stringify(taskContext)}
      - Valid Worker Groups: ${JSON.stringify(workerGroupContext)}
    `;

    const fullPrompt = systemPrompt + "\n" + userMessage;
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const jsonString = response.text();

    const resultObject = JSON.parse(jsonString);

    if (resultObject.error) {
      return NextResponse.json({ error: resultObject.error }, { status: 400 });
    }
    
    return NextResponse.json(resultObject as Rule);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to generate rule from your request.' }, { status: 500 });
  }
}