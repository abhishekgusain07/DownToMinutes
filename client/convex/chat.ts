import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { last } from "lodash";


export const createOrGetConversation = mutation({ 
    args: {
        participantUserId: v.string(),
        currentUserId: v.string(),
    },
    handler: async (ctx, args) => {
        const currentUser = await ctx.db
        .query("users").filter((user) => {
            return user.eq(user.field("userId"), args.currentUserId);
        })
        .first();
        const participantUser = await ctx.db
        .query("users").filter((user) => {
            return user.eq(user.field("userId"), args.participantUserId);
        })
        .first();
        
        if(!currentUser || !participantUser) {
            throw new Error("User not found");
        }
        
        const existingConversation = await ctx.db
        .query("conversations")
        .filter((q) => q.or(
            q.and(
                q.eq(q.field("participantOne"), currentUser._id),
                q.eq(q.field("participantTwo"), participantUser._id)
            ),
            q.and(
                q.eq(q.field("participantOne"), participantUser._id),
                q.eq(q.field("participantTwo"), currentUser._id)
            )
        ))
        .first();
        
        if(existingConversation) {
            return existingConversation?._id;
        }
        
        const newConversationId = await ctx.db
        .insert("conversations", {
            participantOne: currentUser._id,
            participantTwo: participantUser._id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        
        return newConversationId;
    }
})

export const getConversations = query({
    args: {
        userId: v.string(),
    },
    handler : async (ctx, args) => {
        const user = await ctx.db
        .query("users")
        .filter((user) => {
            return user.eq(user.field("userId"), args.userId);
        })
        .first();
        
        if(!user) {
            return [];
        }

        const conversations = await ctx.db
        .query("conversations")
        .filter((q) => q.or(
            q.eq(q.field("participantOne"), user._id),
            q.eq(q.field("participantTwo"), user._id)
        ))
        .collect();
        
        const conversationsWithDetails = await Promise.all(conversations.map(async (conversation) => {
            const otherParticipantId = conversation.participantOne === user._id ? conversation.participantTwo : conversation.participantOne;

            const otherParticipant = await ctx.db
            .get(otherParticipantId);

            const lastMessage = conversation.lastMessageId ? await ctx.db.get(conversation.lastMessageId) : null;
            return {
                id: conversation._id,
                name: otherParticipant?.name ?? "unknown",
                chatImage: otherParticipant?.profileImage ?? "",
                lastMessage: lastMessage?.content ?? "",
                time: formatChatTime(new Date(conversation.updatedAt)),
                unread: 0, // TODO: implement unread messages later
                type: lastMessage?.type ?? "text",
            };
        }))
        return conversationsWithDetails;
    }
})

export const deleteConversation = mutation({
    args: {
        userId: v.string(),
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
        .query("users")
        .filter((user) => {
            return user.eq(user.field("userId"), args.userId);
        })
        .first();
        
        if(!user) {
            throw new Error("User not found");
        }
        
        const conversation = await ctx.db
        .query("conversations")
        .filter((q) => {
            return q.eq(q.field("participantOne"), user._id);
        })
        .first();
        
        if(!conversation) {
            throw new Error("Conversation not found");
        }

        if(conversation.participantOne !== user._id && conversation.participantTwo !== user._id) {
            throw new Error("User is not Authorized to delete this conversation");
        }
        const messages = await ctx.db
        .query("messages")
        .filter((q) => {
            return q.eq(q.field("conversationId"), conversation._id);
        })
        .collect();

        await Promise.all(messages.map(async (message) => {
            await ctx.db.delete(message._id);
        }))

        await ctx.db.delete(conversation._id);

        return {
            success: true,
            deletedMessages: messages.length
        }
    }
})

export const getMessages = query({
    args: {
        conversationId: v.id("conversations"),
        limit: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        const messages = await ctx.db
        .query("messages")
        .filter((q) => {
            return q.eq(q.field("conversationId"), args.conversationId);
        })
        .order("asc")
        .take(args.limit ?? 50);
        
        const messageWithSenderDetails = await Promise.all(
            messages.map(async (message) => {
                const sender = await ctx.db.get(message.senderId);
                return {
                    id: message._id,
                    sender_userId: sender?.userId,
                    sender: sender?.name ?? "unknown",
                    content: message.content,
                    time: formatChatTime(new Date(message.createdAt)),
                    isSent: true,
                    type: message.type,
                    mediaUrl: message.mediaUrl
                };
            })
        )
        return messageWithSenderDetails;
    }
})

export const sendMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        content: v.string(),
        senderId: v.string(),
        type: v.optional(v.union(
            v.literal("text"),
            v.literal("image")
        )),
        mediaUrl: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const sender = await ctx.db
        .query("users")
        .filter((user) => {
            return user.eq(user.field("userId"), args.senderId);
        })
        .first();
        
        if(!sender) {
            throw new Error("Sender not found");
        }
        
        const messageId = await ctx.db
        .insert("messages", {
            conversationId: args.conversationId,
            senderId: sender._id,
            content: args.content,
            type: args.type ?? "text",
            mediaUrl: args.mediaUrl,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isEdited: false,
        });
        await ctx.db.patch(args.conversationId, {
            lastMessageId: messageId,
            updatedAt: Date.now(),
        });
        return messageId;
    }
})

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  });
  
  export const getUploadUrl = mutation({
    args: {
      storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
      const url = await ctx.storage.getUrl(args.storageId);
      return url;
    },
  });
  
const formatChatTime = (date: Date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
  
    if (date.toDateString() === now.toDateString()) {
      // Today: show time only
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (date.toDateString() === yesterday.toDateString()) {
      // Yesterday
      return 'Yesterday';
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      // Within last week: show day name
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      // Older: show date
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
