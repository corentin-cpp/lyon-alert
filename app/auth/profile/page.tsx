'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import supabase from '@/lib/supabase'
import { LogOut, RefreshCcw, UserCircle } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
    }
    fetchUser()
  }, [])

  const handleResetPassword = async () => {
    if (!user?.email) return
    const { error } = await supabase.auth.resetPasswordForEmail(user.email)
    if (error) alert('Erreur : ' + error.message)
    else alert('Un lien de réinitialisation a été envoyé par mail.')
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) alert('Erreur : ' + error.message)
    else window.location.href = '/' // Redirige vers la home
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <UserCircle className="h-16 w-16 text-muted-foreground" />
        <div>
          <h2 className="text-xl font-bold">{user?.user_metadata?.first_name || 'Prénom'} {user?.user_metadata?.last_name || 'Nom'}</h2>
          <p className="text-sm text-muted-foreground">{user?.email || 'Adresse email'}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Nom</label>
          <Input disabled value={user?.user_metadata?.last_name || ''} />
        </div>
        <div>
          <label className="text-sm font-medium">Prénom</label>
          <Input disabled value={user?.user_metadata?.first_name || ''} />
        </div>
        <div>
          <label className="text-sm font-medium">Adresse mail</label>
          <Input disabled value={user?.email || ''} />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="outline" onClick={handleResetPassword}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Réinitialiser mot de passe
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Déconnexion
        </Button>
      </div>
    </div>
  )
}
