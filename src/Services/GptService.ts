// src/Services/GptService.ts
import OpenAI from "openai";
import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources";
import type { Prompt } from "../Components/Models/prompt";

// Service responsible for communicating with OpenAI Chat Completions API
class GptService {
  // Lazily-initialized OpenAI client
  private client: OpenAI | null = null;

  // Returns a singleton OpenAI client instance
  private getClient(): OpenAI {
    // Read API key from Vite environment variables
    const apiKey = (import.meta.env.VITE_CHATGPT_API_KEY as string | undefined)?.trim();

    // Validate API key existence
    if (!apiKey) {
      throw new Error(
        "VITE_CHATGPT_API_KEY is missing. Add it to .env (VITE_CHATGPT_API_KEY=...) and restart the dev server."
      );
    }

    // Create client once and reuse it
    if (!this.client) {
      this.client = new OpenAI({
        apiKey,

        // Required when calling OpenAI directly from the browser
        dangerouslyAllowBrowser: true,
      });
    }

    return this.client;
  }

  // Sends a prompt to OpenAI and returns the assistant text response
  public async getCompletion(prompt: Prompt): Promise<string> {
    const client = this.getClient();

    // Model can be overridden via env
    const model =
      (import.meta.env.VITE_CHATGPT_MODEL as string | undefined)?.trim() ||
      "gpt-4o-mini";

    // Temperature controls creativity
    const temperatureEnv = Number(import.meta.env.VITE_CHATGPT_TEMPERATURE);
    const temperature = Number.isFinite(temperatureEnv) ? temperatureEnv : 0.4;

    // Maximum tokens for response
    const maxTokensEnv = Number(import.meta.env.VITE_CHATGPT_MAX_TOKENS);
    const max_tokens = Number.isFinite(maxTokensEnv) ? maxTokensEnv : 800;

    // Request body for chat completion
    const body: ChatCompletionCreateParamsNonStreaming = {
      model,
      messages: [
        { role: "system", content: prompt.systemContent ?? "" },
        { role: "user", content: prompt.userContent ?? "" },
      ],
      temperature,
      max_tokens,
    };

    try {
      // Execute OpenAI request
      const response = await client.chat.completions.create(body);

      // Extract assistant message
      const content = response.choices?.[0]?.message?.content ?? "";

      // Guard against empty responses
      if (!content.trim()) {
        throw new Error("OpenAI returned an empty response.");
      }

      return content;
    } catch (err: any) {
      // Try to extract a friendly error message from different error shapes
      const apiMsg =
        err?.response?.data?.error?.message ??
        err?.error?.message ??
        err?.message ??
        "OpenAI request failed.";

      throw new Error(apiMsg);
    }
  }
}

// Singleton instance
export const gptService = new GptService();




