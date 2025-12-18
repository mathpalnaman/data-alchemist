import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Rule } from '@/types';

// Use your new key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// FIXED: Using the model you proved exists
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  // Move system prompt here for better adherence in 2.0+ models
  systemInstruction: `
    You are an expert rule engine for a resource allocation tool. Your task is to convert a user's plain English request into a single, valid JSON rule object.

    STRICT JSON ONLY. No thinking tags, no markdown, no explanations.

    Schemas:
    1. Co-run: { "type": "coRun", "tasks": ["ID1", "ID2"] }
    2. Load Limit: { "type": "loadLimit", "workerGroup": "Group", "maxSlotsPerPhase": 5 }

    - Use ONLY provided Context IDs.
    - If request is ambiguous, return: { "error": "Reason..." }
  `
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, taskContext, workerGroupContext } = body;

    // Log inputs to debug the 400 error
    console.log("🔹 API Request Received:", { query });

    if (!query || !taskContext || !workerGroupContext) {
      console.error("❌ Missing Data:", { hasQuery: !!query, hasTasks: !!taskContext, hasGroups: !!workerGroupContext });
      return NextResponse.json({ error: 'Missing query or context data' }, { status: 400 });
    }

    const userMessage = `
      Request: "${query}"
      Context Tasks: ${JSON.stringify(taskContext)}
      Context Groups: ${JSON.stringify(workerGroupContext)}
    `;

    const result = await model.generateContent(userMessage);
    const response = result.response;
    let text = response.text();

    console.log("🔹 Raw AI Response:", text); // See what Gemini 2.5 actually sends

    // Sanitize: Remove markdown code blocks AND any potential <thinking> tags if 2.5 is verbose
    text = text.replace(/```json|```/g, '').replace(/<thinking>[\s\S]*?<\/thinking>/g, '').trim();

    // Parse JSON
    let resultObject;
    try {
        resultObject = JSON.parse(text);
    } catch (e) {
        console.error("❌ JSON Parse Failed. Text was:", text);
        return NextResponse.json({ error: 'AI returned invalid JSON' }, { status: 500 });
    }

    // Handle AI Logic Errors (Ambiguous requests)
    if (resultObject.error) {
      console.warn("⚠️ AI Returned Logical Error:", resultObject.error);
      return NextResponse.json({ error: resultObject.error }, { status: 400 });
    }
    
    return NextResponse.json(resultObject as Rule);

  } catch (error) {
    console.error('🔥 CRITICAL API ERROR:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}