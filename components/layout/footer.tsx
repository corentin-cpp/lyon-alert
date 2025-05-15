import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <span className="font-bold text-lg">LyonAlert</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Système d&apos;alerte et de prévention des risques naturels 
              pour la ville de Lyon
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Liens utiles</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/map" className="hover:underline">
                  Carte des risques
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:underline">
                  Alertes actives
                </Link>
              </li>
              <li>
                <Link href="/chat/1" className="hover:underline">
                  Chat communautaire
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:underline">
                  Conseils de sécurité
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.vigicrues.gouv.fr/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Vigicrues
                </a>
              </li>
              <li>
                <a href="https://www.emsc-csem.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  EMSC (Séismes)
                </a>
              </li>
              <li>
                <a href="https://www.lyon.fr/securite" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Sécurité Lyon
                </a>
              </li>
              <li>
                <a href="https://www.gouvernement.fr/risques" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Risques - Gouvernement
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:contact@lyonalert.fr" className="hover:underline">
                  contact@lyonalert.fr
                </a>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LyonAlert. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}