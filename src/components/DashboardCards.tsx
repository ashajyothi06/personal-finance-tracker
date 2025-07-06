
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { Transaction, Budget } from "@/types/finance";

interface DashboardCardsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const DashboardCards = ({ transactions, budgets }: DashboardCardsProps) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  const currentMonthTransactions = transactions.filter(
    t => t.date.startsWith(currentMonth)
  );

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const totalBudget = budgets
    .filter(b => b.month === currentMonth)
    .reduce((sum, b) => sum + b.amount, 0);

  const budgetUsage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            Total Income
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-green-600 mt-1">
            This month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">
            Total Expenses
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-red-600 mt-1">
            This month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">
            Net Balance
          </CardTitle>
          <Wallet className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            netBalance >= 0 ? 'text-blue-700' : 'text-red-700'
          }`}>
            {formatCurrency(netBalance)}
          </div>
          <p className="text-xs text-blue-600 mt-1">
            This month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">
            Budget Usage
          </CardTitle>
          <Target className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">
            {budgetUsage.toFixed(0)}%
          </div>
          <p className="text-xs text-purple-600 mt-1">
            {formatCurrency(totalExpenses)} of {formatCurrency(totalBudget)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
