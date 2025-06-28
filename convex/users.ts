import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createUser = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, { name, email, imageUrl, clerkId }) => {
    const user = await ctx.db.insert("users", {
      name,
      email,
      imageUrl,
      clerkId,
    });
  },
});