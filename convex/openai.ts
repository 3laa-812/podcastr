"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// A very short silent MP3 (about 0.1s, 220 bytes)
const SILENT_MP3_BASE64 = "SUQzAwAAAAAAFlRFTkMAAAABAAgAZGF0YQAAAAA=\n";

export const generateAudioAction = action({
  args: { input: v.string() },
  handler: async (_, { input }) => {
    const dummyPath = join(__dirname, "dummy.mp3");
    if (existsSync(dummyPath)) {
      const buffer = readFileSync(dummyPath);
      return buffer.toString("base64");
    } else {
      // Return a short silent MP3 if file is missing
      return SILENT_MP3_BASE64;
    }
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
