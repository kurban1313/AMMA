// AMMA Healthcare Platform - AI Client (OpenRouter Integration)

import type { HealthPrediction, ResearchResult } from '@/types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'openai/gpt-oss-120b:free';

/**
 * Base function to call OpenRouter API
 */
async function callOpenRouter(systemPrompt: string, userPrompt: string, temperature = 0.7) {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        response_format: { type: 'json_object' } // Ensure JSON output if supported by the model, otherwise instruct in prompt
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter API Error:", response.status, errText);
      throw new Error(`OpenRouter API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}

/**
 * AI Services
 */
export const aiClient = {

  // Predict Health Risks
  async generateHealthPrediction(patientData: any): Promise<HealthPrediction | null> {
    const systemPrompt = `You are a medical AI assistant for the AMMA Healthcare Platform. 
Analyze the provided patient data and generate a realistic health prediction.
Your response MUST be valid JSON matching this exact structure:
{
  "predictionType": "String (e.g., 'Diabetes Risk', 'Cardiovascular Risk')",
  "description": "String (detailed explanation of the risk)",
  "severity": "String (must be exactly 'low', 'medium', or 'high')",
  "confidenceScore": Number (between 0.0 and 1.0),
  "riskFactors": ["Array of Strings"],
  "recommendations": ["Array of Strings"],
  "suggestedActions": ["Array of Strings"]
}`;

    const userPrompt = `Patient Data: ${JSON.stringify(patientData, null, 2)}`;

    try {
      const resultString = await callOpenRouter(systemPrompt, userPrompt, 0.3);
      const resultObj = JSON.parse(resultString || '{}');

      return {
        id: `pred_${Date.now()}`,
        patientId: patientData?.id || 'unknown',
        familyMemberId: undefined, // Add if needed
        predictionType: resultObj.predictionType || 'General Health Update',
        description: resultObj.description || 'No specific risks identified at this time.',
        severity: resultObj.severity || 'low',
        confidenceScore: resultObj.confidenceScore || 0.5,
        riskFactors: resultObj.riskFactors || [],
        recommendations: resultObj.recommendations || ['Maintain a healthy lifestyle.'],
        suggestedActions: resultObj.suggestedActions || ['Schedule a routine checkup.'],
        predictedAt: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isRead: false,
        isActioned: false,
      };
    } catch (e) {
      console.error("Failed to parse prediction result:", e);
      return null;
    }
  },

  // Match Doctor
  async matchDoctor(query: string, availableDoctors: any[]): Promise<Array<{ id: string; name: string; matchScore: number }>> {
    const systemPrompt = `You are an AI matching engine. I will provide a search query and a list of available doctors.
You must evaluate how well each doctor matches the query on a scale of 0.0 to 1.0.
Respond ONLY with a valid JSON array of objects having the structure: [{"id": "doc_id", "name": "Doc Name", "matchScore": 0.95}]`;

    const userPrompt = `Query: ${query}\nAvailable Doctors: ${JSON.stringify(availableDoctors, ['id', 'user', 'specialty', 'experienceYears'])}`;

    try {
      const resultString = await callOpenRouter(systemPrompt, userPrompt, 0.1);
      const resultObj = JSON.parse(resultString || '[]');
      return Array.isArray(resultObj) ? resultObj : [];
    } catch (e) {
      console.error("Failed to parse doctor matching:", e);
      return [];
    }
  },

  // Match Patient
  async matchPatient(query: string, availablePatients: any[]): Promise<Array<{ id: string; name: string; matchScore: number }>> {
    const systemPrompt = `You are an AI matching engine. Evaluate how well each patient matches the search query (0.0 to 1.0).
Respond ONLY with a valid JSON array of objects having the structure: [{"id": "pat_id", "name": "Patient Name", "matchScore": 0.95}]`;

    const userPrompt = `Query: ${query}\nAvailable Patients: ${JSON.stringify(availablePatients, ['id', 'user', 'bloodType'])}`;

    try {
      const resultString = await callOpenRouter(systemPrompt, userPrompt, 0.1);
      const resultObj = JSON.parse(resultString || '[]');
      return Array.isArray(resultObj) ? resultObj : [];
    } catch (e) {
      console.error("Failed to parse patient matching:", e);
      return [];
    }
  },

  // Process Research Query
  async processResearchQuery(query: string, contextData: any): Promise<ResearchResult | null> {
    const systemPrompt = `You are a medical research AI data analyst. Process the researcher's query against the provided context database.
Your response MUST be valid JSON matching this exact structure:
{
  "summary": "String (comprehensive analysis summary)",
  "statistics": {
    "totalRecords": Number,
    "avgAge": Number,
    "malePercentage": Number,
    "femalePercentage": Number,
    "diabetesPrevalence": Number
  },
  "trends": [
    {
      "metric": "String",
      "dataPoints": [{"period": "String", "value": Number}]
    }
  ],
  "patterns": [
    {
      "pattern": "String",
      "confidence": Number (0.0 to 1.0),
      "description": "String"
    }
  ]
}`;

    const userPrompt = `Query: ${query}\nContext/Database Summary: ${JSON.stringify(contextData)}`;

    try {
      const resultString = await callOpenRouter(systemPrompt, userPrompt, 0.4);
      const resultObj = JSON.parse(resultString || '{}');
      return resultObj as ResearchResult;
    } catch (e) {
      console.error("Failed to parse research query result:", e);
      return null;
    }
  },

  // Generic Chatbot Message
  async generateChatResponse(messages: { role: string, content: string }[]) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            { role: 'system', content: 'You are a helpful medical research assistant for the AMMA Healthcare Platform.' },
            ...messages
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error(`OpenRouter API Error: ${response.statusText}`);

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating chat response:", error);
      return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }
  }

};
