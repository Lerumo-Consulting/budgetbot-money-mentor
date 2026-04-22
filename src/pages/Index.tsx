import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BudgetBot } from "@/components/budgetbot/BudgetBot";
import { Wallet, MessageCircle, X, PiggyBank, TrendingUp, Target, ShieldCheck, Sparkles } from "lucide-react";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    document.title = "BudgetBot — Your personal budget & savings advisor";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">BudgetBot</span>
          </div>
          <Button onClick={() => setChatOpen(true)} className="gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Chat now</span>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-xs font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Built for South Africans
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
            Your personal budget &amp; savings advisor
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Chat with BudgetBot to break down your income, plan your spending, and reach your savings goals — one rand at a time.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" onClick={() => setChatOpen(true)} className="gap-2">
              <MessageCircle className="h-5 w-5" />
              Start chatting
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">Learn more</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 py-16 bg-secondary/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">How BudgetBot helps</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: PiggyBank, title: "Plan your budget", desc: "Break income into rent, food, transport, airtime, data and more — tailored to SA living costs." },
              { icon: Target, title: "Set savings goals", desc: "Whether it's a holiday, deposit, or emergency fund, we'll work out a realistic timeline." },
              { icon: TrendingUp, title: "Save smarter", desc: "Practical tips to cut spending without giving up the things you love." },
              { icon: ShieldCheck, title: "Safe & private", desc: "No bank logins, no ID numbers, no data stored between sessions. Just guidance." },
              { icon: Sparkles, title: "Friendly advice", desc: "BudgetBot speaks like a savvy friend — never jargon, never judgmental." },
              { icon: Wallet, title: "Free to use", desc: "Open the chat and start improving your money habits in seconds." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to take control of your money?</h2>
          <p className="mt-4 text-muted-foreground text-lg">Tap the chat bubble in the corner and say hi — BudgetBot is ready when you are.</p>
          <Button size="lg" className="mt-8 gap-2" onClick={() => setChatOpen(true)}>
            <MessageCircle className="h-5 w-5" /> Open BudgetBot
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} BudgetBot. Not certified financial advice.
      </footer>

      {/* Floating chat button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          aria-label="Open BudgetBot chat"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center animate-fade-in-up"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Popup chat panel */}
      {chatOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:h-[640px] sm:max-h-[calc(100vh-3rem)] sm:w-[400px] sm:rounded-2xl overflow-hidden shadow-2xl border border-border bg-background animate-fade-in-up flex flex-col">
          <BudgetBot embedded onClose={() => setChatOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Index;
