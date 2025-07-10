import axios from 'axios';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class OpenAIService {
  private apiKey: string;
  private endpoint: string;
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    this.endpoint = process.env.REACT_APP_OPENAI_ENDPOINT || '';
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.apiKey || !this.endpoint) {
      throw new Error('OpenAI API key o endpoint no configurados');
    }

    // Agregar el mensaje del usuario al historial
    this.conversationHistory.push({
      role: 'user',
      content: message
    });

    try {
      const response = await axios.post(
        this.endpoint,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente útil y amigable. Responde de manera clara y concisa en español.'
            },
            ...this.conversationHistory
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      
      // Agregar la respuesta de la IA al historial
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      // Mantener solo los últimos 10 mensajes para evitar que el contexto sea demasiado largo
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return aiResponse;
    } catch (error: any) {
      console.error('Error al llamar a OpenAI:', error);
      
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.error?.message || 'Error desconocido';
        
        switch (status) {
          case 401:
            throw new Error('API key inválida. Verifica tu configuración.');
          case 429:
            throw new Error('Límite de velocidad alcanzado. Intenta más tarde.');
          case 500:
            throw new Error('Error del servidor de OpenAI. Intenta más tarde.');
          default:
            throw new Error(`Error ${status}: ${errorMessage}`);
        }
      }
      
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }
}

export const openaiService = new OpenAIService();
