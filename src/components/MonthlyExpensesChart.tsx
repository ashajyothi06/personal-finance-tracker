
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from "@/types/finance";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export const MonthlyExpensesChart = ({ transactions }: MonthlyExpensesChartProps) => {
  // Group transactions by month and calculate totals
  const monthlyData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const monthKey = transaction.date.slice(0, 7); // YYYY-MM
      const monthName = new Date(transaction.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          expenses: 0,
          count: 0
        };
      }
      
      acc[monthKey].expenses += transaction.amount;
      acc[monthKey].count += 1;
      
      return acc;
    }, {} as Record<string, { month: string; expenses: number; count: number }>);

  // Convert to array and sort by date
  const chartData = Object.entries(monthlyData)
    .map(([key, data]) => ({
      monthKey: key,
      ...data
    }))
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .slice(-12); // Last 12 months

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-red-600">
            Expenses: {formatCurrency(data.expenses)}
          </p>
          <p className="text-sm text-gray-600">
            {data.count} transaction{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>Track your spending patterns over time</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Track your spending patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="expenses" 
                fill="url(#expenseGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
