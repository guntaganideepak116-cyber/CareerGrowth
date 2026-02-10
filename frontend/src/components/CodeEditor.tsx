import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Play, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CodeEditorProps {
    initialLanguage?: string;
    initialCode?: string;
}

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript (Node.js)', version: '18.15.0', snippet: 'console.log("Hello World");' },
    { value: 'python', label: 'Python 3', version: '3.10.0', snippet: 'print("Hello from Python!")' },
    { value: 'java', label: 'Java', version: '15.0.2', snippet: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Java!");\n    }\n}' },
    { value: 'c++', label: 'C++', version: '10.2.0', snippet: '#include <iostream>\n\nint main() {\n    std::cout << "Hello C++";\n    return 0;\n}' },
];

export default function CodeEditor({ initialLanguage = 'javascript', initialCode }: CodeEditorProps) {
    const [language, setLanguage] = useState(initialLanguage);
    const [code, setCode] = useState(initialCode || LANGUAGES.find(l => l.value === initialLanguage)?.snippet || '');
    const [output, setOutput] = useState<{ stdout: string; stderr: string } | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const handleLanguageChange = (val: string) => {
        setLanguage(val);
        // Only reset code if it was default
        const defaultSnippet = LANGUAGES.find(l => l.value === val)?.snippet;
        if (defaultSnippet) setCode(defaultSnippet);
        setOutput(null);
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput(null);

        const selectedLang = LANGUAGES.find(l => l.value === language);
        if (!selectedLang) return;

        try {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: selectedLang.value === 'c++' ? 'cpp' : selectedLang.value,
                    version: selectedLang.version,
                    files: [{ content: code }]
                })
            });

            const data = await response.json();

            if (data.run) {
                setOutput({
                    stdout: data.run.stdout,
                    stderr: data.run.stderr
                });
                if (data.run.stderr) {
                    toast.error('Code execution failed', { description: 'Check the error output.' });
                } else {
                    toast.success('Code executed successfully');
                }
            } else {
                toast.error('Failed to execute code');
            }
        } catch (error) {
            console.error(error);
            toast.error('Execution server error');
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
            {/* Editor Panel */}
            <div className="flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Select value={language} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[180px] h-8 text-xs">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGES.map(lang => (
                                    <SelectItem key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            onClick={runCode}
                            disabled={isRunning}
                            className="h-8 gap-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                            Run Code
                        </Button>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-zinc-950 text-zinc-100 dark:bg-zinc-950 dark:text-zinc-100"
                        spellCheck={false}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-zinc-500 pointer-events-none">
                        Ln {code.split('\n').length}, Col {code.length}
                    </div>
                </div>
            </div>

            {/* Output Panel */}
            <div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-900">
                    <span className="text-sm font-medium text-zinc-400">Terminal Output</span>
                    {output && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOutput(null)}
                            className="h-6 text-xs text-zinc-500 hover:text-zinc-300"
                        >
                            <Trash2 className="w-3 h-3 mr-1" /> Clear
                        </Button>
                    )}
                </div>

                <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                    {!output && !isRunning && (
                        <div className="text-zinc-600 italic">
                            Waiting for output... Click "Run Code" to start.
                        </div>
                    )}

                    {isRunning && (
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Compiling and executing...</span>
                        </div>
                    )}

                    {output && (
                        <div className="space-y-4">
                            {output.stdout && (
                                <div>
                                    <div className="text-xs text-zinc-500 mb-1">STDOUT</div>
                                    <pre className="whitespace-pre-wrap text-green-400">{output.stdout}</pre>
                                </div>
                            )}

                            {output.stderr && (
                                <div>
                                    <div className="text-xs text-red-500 mb-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> STDERR
                                    </div>
                                    <pre className="whitespace-pre-wrap text-red-400 bg-red-950/20 p-2 rounded border border-red-900/50">
                                        {output.stderr}
                                    </pre>
                                </div>
                            )}

                            {!output.stdout && !output.stderr && (
                                <div className="text-zinc-500 italic">Program finished with no output.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
