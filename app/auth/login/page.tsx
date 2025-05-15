"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowRight, LogIn } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import supabase from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      // Redirection après connexion réussie
      router.push('/');
      
      // Pour l'instant, simulons un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      router.push('/');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Erreur lors de la connexion");
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card className="border shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Accédez à votre compte LyonAlert
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="votre@email.fr" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full gap-2" 
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm">
            Pas encore de compte ?{" "}
            <Link 
              href="/auth/register" 
              className="font-medium hover:underline text-primary"
            >
              Inscrivez-vous
            </Link>
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            En vous connectant, vous acceptez nos{" "}
            <Link href="/terms" className="hover:underline">
              conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="hover:underline">
              politique de confidentialité
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}