import axios from 'axios';
import { handleError } from '../utils';
import { getAdminSettings } from './adminService';

// Get API key from settings
const getApiKey = () => {
  const settings = getAdminSettings();
  return settings?.ai?.geminiApiKey || '';
};

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Send a text prompt to Google's Gemini API
 * @param {string} prompt - The text prompt to send to Gemini
 * @returns {Promise} - API response with generated content
 */
export const sendToGemini = async (prompt) => {
  try {
    const API_KEY = getApiKey();
    
    if (!API_KEY) {
      handleError('Gemini API key not configured. Please set it in Admin Settings.');
      return {
        success: false,
        error: 'API key not configured'
      };
    }
    
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }
    );
    
    return {
      success: true,
      data: response.data,
      text: response.data.candidates[0]?.content?.parts[0]?.text || ''
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Handle different types of errors
    if (error.response?.status === 403) {
      handleError('API key invalid or expired. Please check your Gemini API key in settings.');
    } else if (error.response?.status === 429) {
      handleError('API rate limit exceeded. Please try again later.');
    } else {
      handleError('Failed to get AI response');
    }
    
    return {
      success: false,
      error: error.response?.data?.error || 'API call failed'
    };
  }
};

/**
 * Analyze construction verification data with Gemini
 * @param {Object} verificationData - The verification data to analyze
 * @returns {Promise} - API response with analysis
 */
export const analyzeVerification = async (verificationData) => {
  try {
    const prompt = `
      Analyze this construction verification data and provide recommendations:
      
      Project type: ${verificationData.type}
      Location: ${verificationData.location}
      Details: ${JSON.stringify(verificationData)}
      
      Please check if this construction plan complies with standard building regulations
      and provide a detailed analysis with any potential issues or improvements.
    `;
    
    return await sendToGemini(prompt);
  } catch (error) {
    console.error('Error analyzing verification:', error);
    handleError('Failed to analyze verification data');
    return {
      success: false,
      error: 'Analysis failed'
    };
  }
};

/**
 * Generate construction rule recommendations
 * @param {string} cityName - The city name to generate rules for
 * @param {string} constructionType - Type of construction (residential, commercial, etc.)
 * @returns {Promise} - API response with recommended rules
 */
export const generateRuleRecommendations = async (cityName, constructionType) => {
  try {
    const prompt = `
      Generate standard construction rules for ${constructionType} buildings in ${cityName}.
      Format the response as a JSON array of rule objects with the following structure:
      {
        "name": "Rule name",
        "description": "Detailed description of the rule",
        "category": "Category like Safety, Environmental, etc.",
        "requirements": "Specific requirements for compliance"
      }
      
      Include rules about structural integrity, safety measures, environmental considerations,
      and accessibility requirements. Provide at least 5 detailed rules.
    `;
    
    const response = await sendToGemini(prompt);
    
    if (response.success && response.text) {
      // Try to parse JSON from the response
      try {
        // Extract JSON array from the text response
        const jsonMatch = response.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const rulesArray = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            rules: rulesArray
          };
        }
      } catch (parseError) {
        console.error('Error parsing JSON from Gemini response:', parseError);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error generating rule recommendations:', error);
    handleError('Failed to generate rule recommendations');
    return {
      success: false,
      error: 'Rule generation failed'
    };
  }
};

export default {
  sendToGemini,
  analyzeVerification,
  generateRuleRecommendations
}; 