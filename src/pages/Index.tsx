
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { DashboardCards } from "@/components/DashboardCards";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { BudgetOverview } from "@/components/BudgetOverview";
import { BudgetForm } from "@/components/BudgetForm";
import { SpendingInsights } from "@/components/SpendingInsights";
import { Plus, TrendingUp, PieChart, Target } from "lucide-react";
import { Transaction, Budget } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('finance-transactions');
    const savedBudgets = localStorage.getItem('finance-budgets');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save budgets to localStorage whenever budgets change
  useEffect(() => {
    localStorage.setItem('finance-budgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setShowTransactionForm(false);
    toast({
      title: "Transaction added",
      description: "Your transaction has been successfully recorded.",
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === transaction.id ? transaction : t)
    );
    setEditingTransaction(null);
    setShowTransactionForm(false);
    toast({
      title: "Transaction updated",
      description: "Your transaction has been successfully updated.",
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been successfully deleted.",
    });
  };

  const handleAddBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
    };
    setBudgets(prev => [...prev.filter(b => b.category !== budget.category), newBudget]);
    setShowBudgetForm(false);
    toast({
      title: "Budget set",
      description: `Budget for ${budget.category} has been set to $${budget.amount}.`,
    });
  };

  const startEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Personal Finance Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Track your expenses, manage budgets, and gain financial insights
          </p>
        </div>

        {/* Dashboard Cards */}
        <DashboardCards transactions={transactions} budgets={budgets} />

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Budgets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyExpensesChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </div>
            <SpendingInsights transactions={transactions} budgets={budgets} />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
              <Button 
                onClick={() => {
                  setEditingTransaction(null);
                  setShowTransactionForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
            
            {showTransactionForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionForm
                    transaction={editingTransaction}
                    onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
                    onCancel={() => {
                      setShowTransactionForm(false);
                      setEditingTransaction(null);
                    }}
                  />
                </CardContent>
              </Card>
            )}

            <TransactionList
              transactions={transactions}
              onEdit={startEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Category Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryPieChart transactions={transactions} />
              <MonthlyExpensesChart transactions={transactions} />
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Budget Management</h2>
              <Button 
                onClick={() => setShowBudgetForm(true)}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                <Target className="h-4 w-4 mr-2" />
                Set Budget
              </Button>
            </div>

            {showBudgetForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Set Category Budget</CardTitle>
                  <CardDescription>
                    Set monthly spending limits for different categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetForm
                    onSubmit={handleAddBudget}
                    onCancel={() => setShowBudgetForm(false)}
                  />
                </CardContent>
              </Card>
            )}

            <BudgetOverview transactions={transactions} budgets={budgets} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
