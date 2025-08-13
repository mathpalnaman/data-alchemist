import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const systemPrompt = `You are an expert data filtering assistant. Your task is to act as a filter for a JSON array.
    Given a user's plain English query and a JSON array of data, you must return a new JSON array containing only the objects that STRICTLY match the query.
    
    IMPORTANT: Your response MUST be ONLY the filtered JSON array. Do not include any explanations, introductory text, or markdown code blocks. Just the raw, valid JSON array.`;

export async function POST(request: Request) {
  try {

    if (process.env.MOCK_API === 'true') {
      // Mock response for testing purposes
      // console.log("MOCK MODE: Returning mock data");
      const { data } = await request.json();
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulating network delay

      const mockSearchResult = data.slice(0, 2);
      return NextResponse.json(mockSearchResult);
    }

    // console.log("LIVE MODE: Calling Gemini API for search.");

    const { query, data, entityType } = await request.json();

    if (!query || !data || !entityType) {
      return NextResponse.json({ error: 'Missing query, data, or entityType' }, { status: 400 });
    }

    // Combine the instructions, user query, and data into a single prompt
    const fullPrompt = `
        ${systemPrompt}

        The data you are filtering is for '${entityType}'.
        Filter the following data based on this query: "${query}".
        
        Data: 
        ${JSON.stringify(data, null, 2)}
    `;
    
    // Call the Gemini API
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    let jsonString = response.text();

    // Clean the response string before parsing
    // Gemini might wrap the JSON in markdown, so we remove it.
    if (jsonString.startsWith("```json")) {
        jsonString = jsonString.replace(/^```json\n|```$/g, '');
    }
    
    const filteredArray = JSON.parse(jsonString);

    if (!Array.isArray(filteredArray)) {
        throw new Error("AI did not return a valid array.");
    }

    return NextResponse.json(filteredArray);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process search query.' }, { status: 500 });
  }
}