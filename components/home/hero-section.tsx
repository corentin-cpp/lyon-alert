"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, MapPin, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from '@/lib/motion';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  return (
    <div className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-16 md:pt-24 md:pb-20">
      {/* Animated pulse for emergency feel */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-destructive/5 blur-3xl animate-pulse" />
        <div className="absolute top-20 -left-20 w-60 h-60 rounded-full bg-destructive/5 blur-3xl animate-pulse [animation-delay:2s]" />
      </div>
      
      <div className="container relative mx-auto px-4 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="relative">
            <AlertTriangle className="h-16 w-16 text-destructive" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
            </span>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
        >
          LyonAlert
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8"
        >
          Système d&apos;alerte en temps réel pour la prévention des risques naturels à Lyon
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" asChild className="gap-2 shadow-lg">
            <Link href="/map">
              <MapPin className="h-4 w-4" />
              Voir la carte des risques
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2">
            <Link href="/chat/1">
              <MessageSquare className="h-4 w-4" />
              Chat communautaire
            </Link>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {[
            {
              title: "Alertes en temps réel",
              description: "Notifications immédiates en cas de séisme ou d'inondation",
              icon: <AlertTriangle className="h-8 w-8 text-destructive mb-2 mx-auto" />,
              delay: 0
            },
            {
              title: "Carte interactive",
              description: "Visualisez les zones à risque et les événements en cours",
              icon: <MapPin className="h-8 w-8 text-primary mb-2 mx-auto" />,
              delay: 0.2
            },
            {
              title: "Communication locale",
              description: "Échangez des informations avec les habitants de votre quartier",
              icon: <MessageSquare className="h-8 w-8 text-primary mb-2 mx-auto" />,
              delay: 0.4
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + feature.delay }}
              className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border shadow-sm"
            >
              {feature.icon}
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}