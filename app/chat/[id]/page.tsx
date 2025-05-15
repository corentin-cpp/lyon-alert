'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { RealtimeChat } from '@/components/realtime-chat';

interface Message {
  id: number;
  user: string;
  content: string;
  timestamp: string;
}

const ChatPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <RealtimeChat roomName={id} username="users" zone={id}/>
  );
};

export default ChatPage;