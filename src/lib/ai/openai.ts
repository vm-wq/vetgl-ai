/**
 * OpenAI API Client
 * Handles interactions with OpenAI models for VETGL.AI
 * Includes support for embeddings, transcription, and chat completions
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Call OpenAI GPT with a system prompt and conversation history
 * @param messages - Conversation history (user/assistant messages)
 * @param systemPrompt - System prompt for the model
 * @param model - Model to use (default: gpt-4o)
 * @returns The assistant's response text
 */
export async function callOpenAI(
  messages: { role: string; content: string }[],
  systemPrompt: string,
  model: string = 'gpt-4o'
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model,
      max_tokens: 4096,
      messages: [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}

/**
 * Transcribe audio file using OpenAI Whisper API
 * @param audioBuffer - Audio data as Buffer
 * @param filename - Optional filename for the audio file
 * @returns Transcribed text in Portuguese
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string = 'audio.webm'
): Promise<string> {
  try {
    const file = new File([new Uint8Array(audioBuffer)], filename, { type: 'audio/webm' });

    const response = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file,
      language: 'pt',
    });

    return response.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

/**
 * Generate embedding vector for a text string
 * Used for semantic search and RAG retrieval
 * @param text - Text to embed
 * @returns Embedding vector (1536 dimensions for text-embedding-3-small)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts
 * @param texts - Array of texts to embed
 * @returns Array of embedding vectors
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

/**
 * Analyze clinical image using GPT-4 Vision
 * Useful for cytology, radiograph, ultrasound interpretation
 * @param imageUrl - URL of the image to analyze
 * @param prompt - Clinical question about the image
 * @param systemPrompt - System prompt for clinical context
 * @returns Analysis text
 */
export async function analyzeVeterinaryImage(
  imageUrl: string,
  prompt: string,
  systemPrompt: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision',
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from vision analysis');
    }

    return content;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

/**
 * Extract key information from clinical text using structured format
 * @param clinicalText - Clinical notes or case description
 * @param systemPrompt - System prompt with extraction guidelines
 * @returns Structured extraction result
 */
export async function extractClinicalInfo(
  clinicalText: string,
  systemPrompt: string
): Promise<{
  species: string;
  breed?: string;
  age?: string;
  weight?: string;
  chiefComplaint: string;
  duration?: string;
  systemsInvolved: string[];
}> {
  try {
    const extractionPrompt = `${systemPrompt}

Extract the following from the clinical text:
1. Species (exact: Canis familiaris, Felis catus, etc)
2. Breed (if mentioned)
3. Age
4. Weight
5. Chief complaint
6. Duration of symptoms
7. Body systems involved

Return as JSON.`;

    const response = await callOpenAI(
      [{ role: 'user', content: clinicalText }],
      extractionPrompt
    );

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse extraction result');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error extracting clinical info:', error);
    throw error;
  }
}

export default {
  callOpenAI,
  transcribeAudio,
  generateEmbedding,
  generateEmbeddings,
  analyzeVeterinaryImage,
  extractClinicalInfo,
};
