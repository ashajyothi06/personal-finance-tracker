
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Transaction, CATEGORIES } from "@/types/finance";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (transaction: Transaction | Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

export const TransactionForm = ({ transaction, onSubmit, onCancel }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: 'expense' as 'expense' | 'income',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when transaction prop changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        description: transaction.description,
        date: transaction.date,
        category: transaction.category,
        type: transaction.type,
      });
    } else {
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        type: 'expense',
      });
    }
    setErrors({});
  }, [transaction]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const transactionData = {
      amount: Number(formData.amount),
      description: formData.description.trim(),
      date: formData.date,
      category: formData.category,
      type: formData.type,
    };

    if (transaction) {
      onSubmit({ ...transactionData, id: transaction.id });
    } else {
      onSubmit(transactionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className={errors.amount ? 'border-red-500' : ''}
          />
          {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className={errors.date ? 'border-red-500' : ''}
          />
          {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter transaction description..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className={errors.description ? 'border-red-500' : ''}
          rows={3}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(value: 'expense' | 'income') => 
            setFormData(prev => ({ ...prev, type: value }))
          }
          className="flex space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expense" id="expense" />
            <Label htmlFor="expense">Expense</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="income" id="income" />
            <Label htmlFor="income">Income</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {transaction ? 'Update Transaction' : 'Add Transaction'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
