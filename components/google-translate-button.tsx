"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function GoogleTranslateButton() {
  const [currentLang, setCurrentLang] = useState("fr");

  useEffect(() => {
    // Fonction pour charger le script Google Translate
    const loadGoogleTranslateScript = () => {
      if (document.getElementById('google-translate-script')) {
        // Le script est déjà chargé
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      // Définir la fonction de callback globale
      window.googleTranslateElementInit = function() {
        new window.google.translate.TranslateElement({
          pageLanguage: 'fr',
          includedLanguages: 'en,fr', // Seulement français et anglais
          autoDisplay: false
        }, 'google-translate-element');
      };
    };
    
    // Charger le script lors du premier rendu
    loadGoogleTranslateScript();
    
    // Créer un élément invisible pour Google Translate
    if (!document.getElementById('google-translate-element')) {
      const translateElement = document.createElement('div');
      translateElement.id = 'google-translate-element';
      translateElement.style.display = 'none';
      document.body.appendChild(translateElement);
    }
    
    return () => {
      // Nettoyage optionnel
    };
  }, []);
  
  // Fonction qui bascule entre français et anglais
  const toggleLanguage = () => {
    // Récupérer la langue opposée
    const newLang = currentLang === "fr" ? "en" : "fr";
    setCurrentLang(newLang);
    
    // Utiliser l'API de Google Translate pour changer la langue
    setTimeout(() => {
      const langSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (langSelect) {
        // Mettre à jour le sélecteur de langue
        langSelect.value = newLang === "fr" ? "fr" : "en";
        langSelect.dispatchEvent(new Event('change'));
      } else if (window.google && window.google.translate) {
        // Alternative: utiliser directement l'API Google Translate
        const langCode = newLang === "fr" ? "" : "en";
        const iframe = document.getElementsByClassName('goog-te-banner-frame')[0] as HTMLIFrameElement;
        if (iframe) {
          const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (innerDoc) {
            const select = innerDoc.getElementsByTagName('select')[0];
            if (select) {
              select.value = langCode;
              select.dispatchEvent(new Event('change'));
            }
          }
        }
      }
    }, 300);
  };
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="flex items-center justify-center"
      onClick={toggleLanguage}
      title={currentLang === "fr" ? "Switch to English" : "Passer en français"}
    >
      <span className="font-medium text-xs">{currentLang === "fr" ? "EN" : "FR"}</span>
    </Button>
  );
}

// Interface TypeScript
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}