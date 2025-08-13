import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) { // Handle POST requests to filter data based on a user's query
  try {
    const { query, data, entityType } = await request.json();

    if (!query || !data || !entityType) {
      return NextResponse.json({ error: 'Missing query, data, or entityType' }, { status: 400 }); // Ensure all required fields are present
    }

    const systemPrompt = `You are an expert data filtering assistant. Your task is to act as a filter for a JSON array.
    Given a user's plain English query and a JSON array of data, you must return a new JSON array containing only the objects that STRICTLY match the query.
    The data you are filtering is for '${entityType}'.
    IMPORTANT: Your response MUST be ONLY the filtered JSON array. Do not include any explanations, introductory text, or markdown code blocks. Just the raw, valid JSON array.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106", // This model is good with JSON
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Filter the following data based on this query: "${query}". Data: ${JSON.stringify(data, null, 2)}` }
      ],
    });

    const result = response.choices[0].message?.content;

    if (!result) {
        throw new Error("AI did not return a result.");
    }

    // The model might return the array inside a root key, e.g. { "filtered_data": [...] }
    const parsedResult = JSON.parse(result);
    const filteredArray = Array.isArray(parsedResult) ? parsedResult : Object.values(parsedResult)[0];


    return NextResponse.json(filteredArray);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process search query.' }, { status: 500 });
  }
}