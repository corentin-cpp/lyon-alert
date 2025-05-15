'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import {
  AlertTriangle,
  Menu,
  X,
  MapPin,
  MessageSquare,
  Bell,
  User,
  LogIn,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm border-b'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <span className="font-bold text-lg">LyonAlert</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/map">
                      <MapPin className="mr-2 h-4 w-4" />
                      Carte
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/alerts">
                      <Bell className="mr-2 h-4 w-4" />
                      Alertes
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((arrondissement) => (
                        <li key={arrondissement}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/chat/${arrondissement}`}
                              className={cn(
                                'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                              )}
                            >
                              <div className="text-sm font-medium leading-none">
                                {arrondissement}e Arrondissement
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Chat communautaire du {arrondissement}e
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-2">
              <ModeToggle />
              {isLoggedIn ? (
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profil</span>
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/auth/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Connexion
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background shadow-sm border-t">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/map"
              className="flex items-center py-2 text-base font-medium rounded-md hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MapPin className="mr-3 h-5 w-5" />
              Carte
            </Link>
            <Link
              href="/alerts"
              className="flex items-center py-2 text-base font-medium rounded-md hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bell className="mr-3 h-5 w-5" />
              Alertes
            </Link>
            <div className="py-2">
              <p className="flex items-center text-base font-medium">
                <MessageSquare className="mr-3 h-5 w-5" />
                Chat par arrondissement
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2 pl-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((arr) => (
                  <Link
                    key={arr}
                    href={`/chat/${arr}`}
                    className="text-sm py-1 px-2 rounded hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {arr}e
                  </Link>
                ))}
              </div>
            </div>
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center py-2 text-base font-medium rounded-md hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="mr-3 h-5 w-5" />
                Profil
              </Link>
            ) : (
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Connexion
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}