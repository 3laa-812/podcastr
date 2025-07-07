import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
export const createPodcast = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    audioUrl: v.string(),
    audioDuration: v.number(),
    audioStorageId: v.id("_storage"),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    voiceType: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    views: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not Authenticated");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length == 0) {
      throw new ConvexError("User Not Found");
    }
    const { title, description, ...rest } = args;
    const podcast = await ctx.db.insert("podcasts", {
      ...rest,
      podcastTitle: title,
      podcastDescription: description,
      user: user[0]._id,
      author: user[0].name,
      authorId: user[0].clerkId,
      authorImageUrl: user[0].imageUrl || "",
    });

    return podcast;
  },
});

export const getTrendingPodcasts = query({
    handler: async (ctx) => {
        const podcasts = await ctx.db
            .query("podcasts").collect();
        return podcasts
    },
})