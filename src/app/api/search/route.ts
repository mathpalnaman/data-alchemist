import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const systemPrompt = `You are an expert data filtering assistant. Your task is to act as a filter for a JSON array.
Given a user's plain English query and a JSON array of data, you must return a new JSON array containing only the objects that STRICTLY match the query.

IMPORTANT: Your response MUST be ONLY the filtered JSON array. Do not include any explanations, introductory text, or markdown code blocks. Just the raw, valid JSON array.`;

export async function POST(request: Request) {
  try {
    // --- MOCK API LOGIC ---
    if (process.env.MOCK_API === 'true') {
      const { data } = await request.json();
      await new Promise(resolve => setTimeout(resolve, 600)); 

      // Return a slice to prove filtering "happened" visually
      const mockSearchResult = Array.isArray(data) ? data.slice(0, 2) : [];
      return NextResponse.json(mockSearchResult);
    }

    // --- LIVE GEMINI API LOGIC ---
    const { query, data, entityType } = await request.json();

    if (!query || !data || !entityType) {
      return NextResponse.json({ error: 'Missing query, data, or entityType' }, { status: 400 });
    }

    // WARNING: Sending large datasets here will fail due to token limits.
    // Keep demo data under ~50 items for stability.
    const fullPrompt = `
        ${systemPrompt}

        The data you are filtering is for '${entityType}'.
        Filter the following data based on this query: "${query}".
        
        Data: 
        ${JSON.stringify(data, null, 2)}
    `;
    
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    let text = response.text();

    // ROBUST FIX: Strip all markdown code blocks (```json or ```) and whitespace
    text = text.replace(/```json|```/g, '').trim();
    
    const filteredArray = JSON.parse(text);

    if (!Array.isArray(filteredArray)) {
        throw new Error("AI did not return a valid array.");
    }

    return NextResponse.json(filteredArray);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process search query.' }, { status: 500 });
  }
}