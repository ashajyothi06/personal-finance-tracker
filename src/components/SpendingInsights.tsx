
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction, Budget } from "@/types/finance";
import { TrendingUp, TrendingDown, AlertCircle, Target, Calendar } from 'lucide-react';

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const SpendingInsights = ({ transactions, budgets }: SpendingInsightsProps) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  
  // Current month data
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const currentExpenses = currentMonthTransactions.filter(t => t.type === 'expense');
  const currentIncome = currentMonthTransactions.filter(t => t.type === 'income');
  
  // Last month data
  const lastMonthExpenses = transactions.filter(t => 
    t.type === 'expense' && t.date.startsWith(lastMonth)
  );
  
  // Calculate totals
  const currentExpenseTotal = currentExpenses.reduce((sum, t) => sum + t.amount, 0);
  const currentIncomeTotal = currentIncome.reduce((sum, t) => sum + t.amount, 0);
  const lastMonthExpenseTotal = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate changes
  const expenseChange = lastMonthExpenseTotal > 0 
    ? ((currentExpenseTotal - lastMonthExpenseTotal) / lastMonthExpenseTotal) * 100
    : 0;
  
  // Category analysis
  const categoryTotals = currentExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
  
  // Budget analysis
  const currentBudgets = budgets.filter(b => b.month === currentMonth);
  const overBudgetCategories = currentBudgets.filter(budget => {
    const spent = categoryTotals[budget.category] || 0;
    return spent > budget.amount;
  });
  
  // Recent transaction analysis
  const recentTransactions = currentExpenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const avgTransactionAmount = currentExpenses.length > 0 
    ? currentExpenses.reduce((sum, t) => sum + t.amount, 0) / currentExpenses.length
    : 0;
    
  const highValueTransactions = currentExpenses.filter(t => t.amount > avgTransactionAmount * 2);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const insights = [];

  // Monthly comparison insight
  if (lastMonthExpenseTotal > 0) {
    insights.push({
      title: 'Monthly Spending Trend',
      description: `Your expenses ${expenseChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(expenseChange).toFixed(1)}% compared to last month`,
      value: formatPercentage(expenseChange),
      icon: expenseChange >= 0 ? TrendingUp : TrendingDown,
      color: expenseChange >= 0 ? 'text-red-600' : 'text-green-600',
      bgColor: expenseChange >= 0 ? 'bg-red-50' : 'bg-green-50'
    });
  }

  // Top category insight
  if (topCategories.length > 0) {
    const [topCategory, topAmount] = topCategories[0];
    const percentage = ((topAmount / currentExpenseTotal) * 100).toFixed(1);
    insights.push({
      title: 'Top Spending Category',
      description: `${topCategory} accounts for ${percentage}% of your monthly expenses`,
      value: formatCurrency(topAmount),
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    });
  }

  // Budget alert insight
  if (overBudgetCategories.length > 0) {
    insights.push({
      title: 'Budget Alert',
      description: `You've exceeded budget in ${overBudgetCategories.length} categor${overBudgetCategories.length > 1 ? 'ies' : 'y'}`,
      value: overBudgetCategories.map(b => b.category).join(', '),
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    });
  }

  // High-value transactions insight
  if (highValueTransactions.length > 0) {
    insights.push({
      title: 'Large Transactions',
      description: `${highValueTransactions.length} transaction${highValueTransactions.length > 1 ? 's' : ''} above average amount`,
      value: formatCurrency(avgTransactionAmount * 2),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    });
  }

  // Savings rate insight
  if (currentIncomeTotal > 0) {
    const savingsRate = ((currentIncomeTotal - currentExpenseTotal) / currentIncomeTotal) * 100;
    insights.push({
      title: 'Savings Rate',
      description: savingsRate >= 0 
        ? `You're saving ${savingsRate.toFixed(1)}% of your income this month`
        : `You're spending ${Math.abs(savingsRate).toFixed(1)}% more than your income`,
      value: formatPercentage(savingsRate),
      icon: Calendar,
      color: savingsRate >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: savingsRate >= 0 ? 'bg-green-50' : 'bg-red-50'
    });
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
          <CardDescription>Add more transactions to see personalized insights</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-gray-500">Not enough data for insights yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>Personalized insights based on your financial data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${insight.bgColor} border-opacity-20`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                  <h3 className="font-semibold text-sm">{insight.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
              <Badge variant="outline" className={`${insight.color} border-current`}>
                {insight.value}
              </Badge>
            </div>
          ))}
        </div>

        {/* Recent Transactions Summary */}
        {recentTransactions.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {recentTransactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">
                      -{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
