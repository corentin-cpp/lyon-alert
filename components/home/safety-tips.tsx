"use client";

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Droplets, ShieldCheck } from 'lucide-react';

export function SafetyTips() {
  const [activeTab, setActiveTab] = useState('earthquake');
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          Conseils de sécurité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="earthquake" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="earthquake" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Séismes
            </TabsTrigger>
            <TabsTrigger value="flood" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Inondations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="earthquake">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="before">
                <AccordionTrigger>Avant un séisme</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Identifiez les zones sûres de votre logement (sous une table solide, contre un mur porteur).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Fixez les meubles lourds et suspendus aux murs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Préparez un kit d&apos;urgence: eau, nourriture non périssable, médicaments, lampe de poche, radio à piles, couverture thermique.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Informez-vous sur les plans d&apos;évacuation de votre quartier.</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="during">
                <AccordionTrigger>Pendant un séisme</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>À l&apos;intérieur: abritez-vous sous une table solide ou contre un mur porteur. Éloignez-vous des fenêtres.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>À l&apos;extérieur: éloignez-vous des bâtiments, des lignes électriques et des arbres.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>En voiture: arrêtez-vous à l&apos;écart des ponts, des bâtiments et des arbres.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>Protégez votre tête et votre cou avec vos bras.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>Ne sortez pas pendant les secousses.</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="after">
                <AccordionTrigger>Après un séisme</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Vérifiez si vous ou votre entourage êtes blessés.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Quittez le bâtiment s&apos;il est endommagé.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Fermez les arrivées de gaz, d&apos;eau et d&apos;électricité en cas de dommages.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>N&apos;utilisez pas les ascenseurs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Écoutez la radio pour suivre les consignes des autorités.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Préparez-vous à d&apos;éventuelles répliques.</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="flood">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="before">
                <AccordionTrigger>Avant une inondation</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Consultez régulièrement les alertes météo et les prévisions de crue.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Mettez les objets de valeur et les produits dangereux en hauteur.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Préparez un kit d&apos;urgence et des documents importants dans un sac étanche.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Identifiez les itinéraires d&apos;évacuation et les points hauts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Protégez votre logement (batardeaux, sacs de sable).</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="during">
                <AccordionTrigger>Pendant une inondation</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>Suivez les consignes des autorités et respectez les ordres d&apos;évacuation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>Montez aux étages supérieurs et n&apos;utilisez pas les ascenseurs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>Coupez l&apos;électricité et le gaz si possible.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>Ne vous engagez pas sur une route inondée, à pied ou en voiture.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>Ne descendez pas dans les sous-sols ou parkings souterrains.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>Tenez-vous informé via la radio ou LyonAlert.</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="after">
                <AccordionTrigger>Après une inondation</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Attendez les consignes des autorités avant de regagner votre domicile.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Aérez et désinfectez les pièces.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Ne rétablissez l&apos;électricité que sur une installation sèche.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Ne consommez pas l&apos;eau du robinet sans l&apos;accord des autorités.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Prenez des photos des dommages pour les assurances.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Signalez les dégâts et dangers potentiels sur LyonAlert.</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}