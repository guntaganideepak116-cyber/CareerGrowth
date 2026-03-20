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
      console.log('✅ PWA: beforeinstallprompt event received');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    // iOS/Standalone Detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // Show prompt after 2 seconds on mobile to ensure visibility
    const timer = setTimeout(() => {
      if (!isStandalone) {
        console.log('💡 PWA: Proactive prompt display triggered');
        setIsVisible(true);
      }
    }, 2000);

    if (isStandalone) {
      setIsVisible(false);
      clearTimeout(timer);
    }

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Manual instructions for iOS or if browser hasn't fired event yet
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        toast.info("Tap the 'Share' icon and choose 'Add to Home Screen' to install CareerGrowth", {
          duration: 6000,
        });
      } else {
        toast.info("Open your browser menu (⋮) and select 'Install App' or 'Add to Home Screen'", {
          duration: 6000,
        });
      }
      return;
    }

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
    <div className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:right-8 md:bottom-8 md:w-[400px] animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-5 group">
        {/* Abstract background blobs for 'WOW' effect */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors duration-700"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
        
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Install CareerGrowth</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Experience the platform as a native app</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsVisible(false)} 
              className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              onClick={handleInstallClick} 
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-teal-500/25 transition-all active:scale-95 px-5"
            >
              Install
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
