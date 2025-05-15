import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Shield, AlertTriangle, MessageSquare, MapPin, Info } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  const actions = [
    {
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
      label: "Signaler un événement",
      description: "Urgence ? Signalez rapidement",
      href: "/report",
      variant: "destructive" as const
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: "Configurer les alertes",
      description: "Personnalisez vos notifications",
      href: "/profile/notifications",
      variant: "outline" as const
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Chat communautaire",
      description: "Échangez avec votre quartier",
      href: "/chat/1",
      variant: "default" as const
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Carte des risques",
      description: "Visualisez les zones à risque",
      href: "/map",
      variant: "outline" as const
    },
    {
      icon: <Shield className="h-5 w-5" />,
      label: "Conseils de sécurité",
      description: "Gestes à adopter en cas d'urgence",
      href: "/safety",
      variant: "outline" as const
    },
    {
      icon: <Info className="h-5 w-5" />,
      label: "FAQ",
      description: "Questions fréquentes",
      href: "/faq",
      variant: "outline" as const
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>Accès direct aux fonctionnalités clés</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3">
        {actions.map((action, i) => (
          <Button 
            key={i} 
            variant={action.variant} 
            size="lg" 
            className="justify-start h-auto py-3 px-4"
            asChild
          >
            <Link href={action.href}>
              <div className="flex items-center gap-3 w-full">
                <div className="shrink-0">
                  {action.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}