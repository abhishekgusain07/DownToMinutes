"use client"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React, { useEffect, useRef, useState, useCallback } from "react";

interface Message {
    content: string;
    id: Id<"messages">;
    isSent: boolean;
    sender: string;
    sender_userId: string | undefined;
    time: string;
    type: "text" | "image" | "video" | "audio" | "file";
    mediaUrl ?: string;
}

const ChatList = ({
    userId,
    preloadedMessages
}:{
    userId: string;
    preloadedMessages: Preloaded<typeof api.chat.getMessages>;
}) => {
    const messages = usePreloadedQuery(preloadedMessages);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

    // Track if user has scrolled up
    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;
        
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
        setShouldAutoScroll(isNearBottom);
    }, []);

    // Scroll to bottom only if we're already at bottom or it's a new message from user
    const scrollToBottom = useCallback((force = false) => {
        if (!shouldAutoScroll && !force) return;
        
        messageEndRef.current?.scrollIntoView({ 
            behavior: messages.length > 1 ? "smooth" : "auto",
            block: "end"
        });
    }, [shouldAutoScroll, messages.length]);

    // Scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Add scroll listener
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div 
            ref={containerRef}
            className="flex-1 overflow-y-auto bg-background dark:bg-[#0B141A] max-h-[calc(100vh-135px)]"
            style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
            }}
        >
            <div className="p-4 min-h-full flex flex-col space-y-4">
                {messages.map((message: Message) => {
                    const isMyMessage = message.sender_userId === userId;
                    
                    return (
                        <div 
                            key={message.id}
                            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
                                    isMyMessage 
                                        ? "bg-primary dark:bg-[#005C4B] text-primary-foreground" 
                                        : 'bg-muted dark:bg-[#202C33]'
                                }`}
                            >
                                {!isMyMessage && (
                                    <p className="text-xs dark:text-white text-muted-foreground mb-1">
                                        {message.sender}
                                    </p>
                                )}
                                
                                {message?.type === "image" ? (
                                    <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                                        <div className="w-full">
                                            <img
                                                src={message.mediaUrl}
                                                alt="Message content"
                                                className="w-full h-auto max-h-[300px] object-contain rounded-lg"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 33vw"
                                                onLoad={() => scrollToBottom(true)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm dark:text-white break-words whitespace-pre-wrap">
                                        {message.content}
                                    </p>
                                )}
                                
                                <p className="text-right text-xs text-muted-foreground mt-1">
                                    {message.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messageEndRef} />
            </div>
        </div>
    );
};

export default ChatList;