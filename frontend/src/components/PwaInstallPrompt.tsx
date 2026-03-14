import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install button/prompt
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('Thank you for installing CareerGrowth!');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-8 md:bottom-8 md:w-96 animate-fade-in">
      <div className="bg-card border border-border rounded-xl shadow-2xl p-4 flex items-center justify-between gap-4 backdrop-blur-sm bg-card/95">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Install CareerGrowth</p>
            <p className="text-xs text-muted-foreground line-clamp-1">Install our app for a better experience</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsVisible(false)} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleInstallClick} className="whitespace-nowrap font-medium px-4">
            Install
          </Button>
        </div>
      </div>
    </div>
  );
};
