'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { RealtimeChat } from '@/components/realtime-chat';
import supabase from '@/lib/supabase';

const ChatPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [username, setUsername] = useState<string>("Utilisateur");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Récupérer les informations de l'utilisateur connecté
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Utiliser le prénom et le nom si disponibles, sinon l'email
        const firstName = user.user_metadata?.first_name;
        const lastName = user.user_metadata?.last_name;
        
        if (firstName && lastName) {
          setUsername(`${firstName} ${lastName}`);
        } else if (firstName) {
          setUsername(firstName);
        } else if (user.email) {
          // Utiliser la partie avant @ de l'email
          setUsername(user.email.split('@')[0]);
        }
      }
    };
    
    fetchUserProfile();
  }, []);

  return (
    <RealtimeChat roomName={id} username={username} zone={id}/>
  );
};


export default ChatPage;