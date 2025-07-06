
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Budget, CATEGORIES } from "@/types/finance";

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, 'id'>) => void;
  onCancel: () => void;
}

export const BudgetForm = ({ onSubmit, onCancel }: BudgetFormProps) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: currentMonth,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      category: formData.category,
      amount: Number(formData.amount),
      month: formData.month,
    });
  };

  // Generate month options (current month + next 11 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    const value = date.toISOString().slice(0, 7);
    const label = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
    return { value, label };
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="amount">Budget Amount ($)</Label>
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
      </div>

      <div className="space-y-2">
        <Label>Month</Label>
        <Select 
          value={formData.month} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}
        >
          <SelectTrigger className={errors.month ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Set Budget
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
