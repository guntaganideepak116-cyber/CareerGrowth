import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import CodeEditor from '@/components/CodeEditor';
import { Terminal } from 'lucide-react';

export default function CodePlayground() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Terminal className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Code Playground</h1>
                        <p className="text-muted-foreground">
                            Write, compile, and execute code in 4+ languages instantly.
                        </p>
                    </div>
                </div>

                <CodeEditor />
            </div>
        </DashboardLayout>
    );
}
