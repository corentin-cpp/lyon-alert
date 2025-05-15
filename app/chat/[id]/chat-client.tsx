'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RealtimeChat } from '@/components/realtime-chat';

interface Message {
  id: number;
  user: string;
  content: string;
  timestamp: string;
}

const ChatPage = ({ id }: { id: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <RealtimeChat roomName="my-chat-room" username="john_doe" zone={id}/>
  );
};

export default ChatPage;
