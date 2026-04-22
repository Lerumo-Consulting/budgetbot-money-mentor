import { useEffect, useState } from "react";
import { ApiKeyScreen } from "@/components/budgetbot/ApiKeyScreen";
import { BudgetBot } from "@/components/budgetbot/BudgetBot";

const STORAGE_KEY = "budgetbot_anthropic_key";

const Index = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "BudgetBot — Your personal budget & savings advisor";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setApiKey(stored);
    setReady(true);
  }, []);

  const saveKey = (k: string) => {
    localStorage.setItem(STORAGE_KEY, k);
    setApiKey(k);
  };

  const clearKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey(null);
  };

  if (!ready) return null;
  if (!apiKey) return <ApiKeyScreen onSave={saveKey} />;
  return <BudgetBot apiKey={apiKey} onClearKey={clearKey} />;
};

export default Index;
