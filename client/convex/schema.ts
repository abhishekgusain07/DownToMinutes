import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        userId: v.string(),
        email: v.string(),
        createdAt: v.number(),

        name: v.optional(v.string()),
        profileImage: v.optional(v.string()),
    })
        .index("by_user_id", ["userId"])
        .index("by_email", ["email"])
        .index("by_name", ["name"]),
        conversations: defineTable({
            participantOne: v.id("users"),
            participantTwo: v.id("users"),
            createdAt: v.number(),
            updatedAt: v.number(),
            lastMessageId: v.optional(v.id("messages")),
          })
            .index("by_participants", ["participantOne", "participantTwo"])
            .index("by_participantOne", ["participantOne"])
            .index("by_participantTwo", ["participantTwo"])
            .index("by_updated", ["updatedAt"]),
        
          messages: defineTable({
            conversationId: v.id("conversations"),
            senderId: v.id("users"),
            content: v.string(),
            type: v.union(
              v.literal("text"),
              v.literal("image"),
              v.literal("video"),
              v.literal("audio"),
              v.literal("file")
            ),
            mediaUrl: v.optional(v.string()),
            replyTo: v.optional(v.id("messages")),
            createdAt: v.number(),
            updatedAt: v.number(),
            isEdited: v.boolean(),
          })
            .index("by_conversation", ["conversationId", "createdAt"])
            .index("by_sender", ["senderId"]),
        
          media: defineTable({
            messageId: v.id("messages"),
            url: v.string(),
            type: v.union(
              v.literal("image"),
              v.literal("video"),
              v.literal("audio"),
              v.literal("file")
            ),
            size: v.number(),
            mimeType: v.string(),
            duration: v.optional(v.number()),
            fileName: v.string(),
            createdAt: v.number(),
          })
            .index("by_message", ["messageId"])
            .index("by_type", ["type"]),
});