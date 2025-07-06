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
