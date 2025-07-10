"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";

export const generateAudioAction = action({
  args: { input: v.string() },
  handler: async (_, { input }) => {
    // 1. Get Camb.ai API key from environment
    const apiKey = process.env.CAMBAI_API_KEY;
    if (!apiKey) throw new Error("CAMBAI_API_KEY is not set in environment");

    // 2. Fetch voices and pick the first English voice
    const englishVoice = { voice_id: "20305", language_code: "1" }; // Replace with a real Camb.ai English voice_id

    // 3. Submit TTS request, get task_id (UUID)
    const ttsRes = await fetch("https://client.camb.ai/apis/tts", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        gender: 1,
        text: input,
        voice_id: 20305,
        language: 1,
      }),
    });

    if (!ttsRes.ok) {
      const errorText = await ttsRes.text();
      console.error(
        "Failed to submit Camb.ai TTS request:",
        ttsRes.status,
        errorText
      );
      throw new Error("Failed to submit Camb.ai TTS request");
    }
    const { task_id } = await ttsRes.json();
    console.log("Camb.ai TTS task response:", task_id);
    if (!task_id) throw new Error("No task_id returned from Camb.ai TTS");

    // 4. Poll for status using task_id (UUID)
    let runId = null;
    for (let i = 0; i < 50; i++) {
      // Try for up to 50 seconds
      await new Promise((r) => setTimeout(r, 1000));
      const pollRes = await fetch(
        `https://client.camb.ai/apis/tts/${task_id}`,
        { headers: { "x-api-key": apiKey, Accept: "application/json" } }
      );
      if (!pollRes.ok) {
        const errorText = await pollRes.text();
        console.error(
          "Failed to poll Camb.ai TTS status:",
          pollRes.status,
          errorText
        );
        throw new Error("Failed to poll Camb.ai TTS status");
      }
      const pollData = await pollRes.json();
      console.log("Camb.ai TTS poll status:", pollData); // <--- Add this line
      if (pollData.status === "SUCCESS" && pollData.run_id) {
        runId = pollData.run_id;
        break;
      } else if (pollData.status === "FAILED") {
        throw new Error("Camb.ai TTS task failed");
      }
    }
    if (!runId) throw new Error("Camb.ai TTS did not complete in time");

    // 5. Download the audio file using run_id (integer)
    const audioRes = await fetch(
      `https://client.camb.ai/apis/tts-result/${runId}?output_type=raw_bytes`,
      { headers: { "x-api-key": apiKey, Accept: "application/json" } }
    );
    if (!audioRes.ok) throw new Error("Failed to download Camb.ai audio");
    const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
    // Return as a data URL for direct use in <audio src="..." />
    return `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;
  },
});
// quickstart-QUdJIGlzIGNvbWluZy4uLi4K
export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const res = await fetch(
      "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt)
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("Pollinations failed:", text);
      throw new Error("Pollinations image generation error");
    }
    const buffer = await res.arrayBuffer();
    // Return a base64 URL so frontend can show it
    const base64 = Buffer.from(buffer).toString("base64");
    return { thumbnailBase64: "data:image/jpeg;base64," + base64 };
    /*
    const thumbnailUrl = json.image; // image URL
    const thumbnailResponse = await fetch(thumbnailUrl);
    const buffer = await thumbnailResponse.arrayBuffer();
    return buffer;
*/
  },
});
