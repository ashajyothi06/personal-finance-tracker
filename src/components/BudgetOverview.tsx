
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Transaction, Budget } from "@/types/finance";
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface BudgetOverviewProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const BudgetOverview = ({ transactions, budgets }: BudgetOverviewProps) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  // Get current month expenses by category
  const currentExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  // Get current month budgets
  const currentBudgets = budgets.filter(b => b.month === currentMonth);

  // Create budget comparison data
  const budgetData = currentBudgets.map(budget => {
    const spent = currentExpenses[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    const remaining = budget.amount - spent;
    
    return {
      category: budget.category,
      budget: budget.amount,
      spent,
      remaining: Math.max(0, remaining),
      percentage,
      status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
    };
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string, percentage: number) => {
    switch (status) {
      case 'over':
        return <Badge variant="destructive">Over Budget</Badge>;
      case 'warning':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Warning</Badge>;
      default:
        return <Badge variant="outline" className="border-green-500 text-green-700">On Track</Badge>;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Budget: {formatCurrency(data.budget)}
          </p>
          <p className="text-red-600">
            Spent: {formatCurrency(data.spent)}
          </p>
          <p className="text-green-600">
            Remaining: {formatCurrency(data.remaining)}
          </p>
          <p className="text-sm text-gray-600">
            {data.percentage.toFixed(1)}% used
          </p>
        </div>
      );
    }
    return null;
  };

  if (currentBudgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>No budgets set for this month</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-gray-500">Set your first budget to start tracking</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetData.map((item) => (
          <Card key={item.category} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{item.category}</CardTitle>
                {getStatusIcon(item.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {formatCurrency(item.spent)} of {formatCurrency(item.budget)}
                </span>
                {getStatusBadge(item.status, item.percentage)}
              </div>
            </CardHeader>
            <CardContent>
              <Progress 
                value={Math.min(item.percentage, 100)} 
                className="h-3"
              />
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-600">
                  {item.percentage.toFixed(1)}% used
                </span>
                <span className={`font-medium ${
                  item.remaining > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.remaining > 0 
                    ? `${formatCurrency(item.remaining)} left`
                    : `${formatCurrency(Math.abs(item.remaining))} over`
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget vs Actual Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Spending</CardTitle>
          <CardDescription>Compare your planned budget with actual spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />
                <Bar dataKey="budget" fill="#8884d8" name="Budget" radius={[2, 2, 0, 0]} />
                <Bar dataKey="spent" fill="#82ca9d" name="Spent" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
