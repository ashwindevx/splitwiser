import { NextRequest, NextResponse } from 'next/server';
import openai from '@/app/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert the file to a base64 string
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = buffer.toString('base64');
    
    // Set content type based on file type
    const contentType = fileType === 'pdf' ? 'application/pdf' : 'image/jpeg';
    const dataUrl = `data:${contentType};base64,${base64File}`;
    
    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "You are given an image or PDF of a bill or receipt.\n\nTask: Extract all individual food and drink items and their corresponding prices. Also, identify any shared fees (such as delivery fee, rain fee, handling fee, late-night convenience charge, service fee, etc.).\n\nRules:\n- Exclude tax and tip amounts completely.\n- Output format: JSON with exactly two properties:\n  - \"items\": an array of objects, each with \"name\" (string) and \"price\" (number).\n  - \"sharedFees\": an array of objects, each with \"name\" (string) and \"price\" (number).\n\nExample Output:\n{\n  \"items\": [\n    {\"name\": \"Pasta\", \"price\": 12.99},\n    {\"name\": \"Salad\", \"price\": 8.50}\n  ],\n  \"sharedFees\": [\n    {\"name\": \"Delivery Fee\", \"price\": 3.99},\n    {\"name\": \"Service Charge\", \"price\": 2.00}\n  ]\n}\n\nImportant: Only output valid JSON. Do not include any extra text or explanations."
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl
              }
            }
          ]
        }
      ],
      max_tokens: 4000,
    });

    // Parse the response to extract the JSON data
    const content = response.choices[0].message.content;
    let items = [];
    let sharedFees = [];
    
    try {
      // The response might contain markdown code block formatting
      // Extract the JSON part by removing any markdown code block indicators
      let jsonContent = content || '{"items":[],"sharedFees":[]}';
      
      // Remove markdown code block if present
      if (jsonContent.includes('```json')) {
        jsonContent = jsonContent.replace(/```json\s*|\s*```/g, '');
      } else if (jsonContent.includes('```')) {
        jsonContent = jsonContent.replace(/```\s*|\s*```/g, '');
      }
      
      // Parse the cleaned JSON content
      const parsedContent = JSON.parse(jsonContent.trim());
      
      // Add IDs to each item
      items = (parsedContent.items || []).map((item: any, index: number) => ({
        id: index + 1,
        name: item.name,
        price: parseFloat(item.price)
      }));
      
      // Add IDs to shared fees
      sharedFees = (parsedContent.sharedFees || []).map((fee: any, index: number) => ({
        id: 'fee-' + (index + 1),
        name: fee.name,
        price: parseFloat(fee.price)
      }));
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.log('Raw response:', content);
      
      // Fallback to empty arrays if parsing fails
      items = [];
      sharedFees = [];
    }

    return NextResponse.json({ items, sharedFees });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
} 