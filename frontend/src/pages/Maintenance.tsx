import { ShieldAlert, RefreshCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Maintenance() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
                <div className="relative inline-block">
                    <div className="h-24 w-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto relative z-10">
                        <ShieldAlert className="h-12 w-12" />
                    </div>
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl animate-pulse" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight">Protocol Offline</h1>
                    <p className="text-muted-foreground text-lg">
                        The platform is currently undergoing scheduled maintenance to upgrade core engineering nodes.
                    </p>
                </div>

                <div className="bg-muted/50 rounded-2xl p-6 border border-border flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-widest">
                        <Clock className="h-4 w-4" />
                        Estimated Completion
                    </div>
                    <p className="text-sm font-medium">Approx. 45-60 minutes</p>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-[60%]" />
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="gap-2 h-12 px-8 font-bold border-2"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        SYNC STATUS
                    </Button>
                </div>

                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter opacity-50">
                    System Managed by Global Admin Console
                </p>
            </div>
        </div>
    );
}
