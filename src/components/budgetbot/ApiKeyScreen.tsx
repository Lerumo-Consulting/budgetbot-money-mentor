import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, KeyRound } from "lucide-react";

interface Props {
  onSave: (key: string) => void;
}

export const ApiKeyScreen = ({ onSave }: Props) => {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setError("That doesn't look like an Anthropic API key (should start with sk-ant-).");
      return;
    }
    onSave(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-sm p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4">
            <Wallet className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">BudgetBot</h1>
          <p className="text-sm text-muted-foreground mt-1">Your personal budget &amp; savings advisor</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
              <KeyRound className="h-4 w-4" /> Anthropic API key
            </label>
            <Input
              type="password"
              autoFocus
              placeholder="sk-ant-..."
              value={key}
              onChange={(e) => { setKey(e.target.value); setError(""); }}
            />
            {error && <p className="text-xs text-destructive mt-2">{error}</p>}
            <p className="text-xs text-muted-foreground mt-2">
              Your key is stored only in your browser (localStorage). Get one at console.anthropic.com.
            </p>
          </div>
          <Button type="submit" className="w-full">Start chatting</Button>
        </form>
      </div>
    </div>
  );
};