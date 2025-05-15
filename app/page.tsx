"use client";

import { Button } from '@/components/ui/button';
import { AlertPanel } from '@/components/home/alert-panel';
import { RecentEvents } from '@/components/home/recent-events';
import { QuickActions } from '@/components/home/quick-actions';
import { HeroSection } from '@/components/home/hero-section';
import { SafetyTips } from '@/components/home/safety-tips';
import Link from 'next/link';
import { useEffect } from 'react';
import supabase from '@/lib/supabase';

export default function Home() {
 /* useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.error("Utilisateur non connecté");
        return;
      }

      const { data: { user }, error } = await supabase.auth.getUser();
    };
    fetchUser();
  }, []); */

  return (
    <div className="w-full">
      <HeroSection />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <AlertPanel />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentEvents />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        <div className="mt-12">
          <SafetyTips />
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Rejoignez la communauté LyonAlert</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Inscrivez-vous pour recevoir des alertes personnalisées, accéder au chat communautaire
            de votre arrondissement et contribuer à la sécurité collective.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/register">S&apos;inscrire</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/map">Voir la carte</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}