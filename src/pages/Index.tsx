import { useEffect } from "react";
import { BudgetBot } from "@/components/budgetbot/BudgetBot";

const Index = () => {
  useEffect(() => {
    document.title = "BudgetBot — Your personal budget & savings advisor";
  }, []);
  return <BudgetBot />;
};

export default Index;
