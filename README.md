
# Personal Finance Visualizer

A modern web application for tracking personal finances, managing budgets, and gaining insights into your spending habits.

## 🌟 Features

### Stage 1: Basic Transaction Tracking
- ✅ Add, edit, and delete transactions with amount, date, and description
- ✅ Transaction list view with search and filtering
- ✅ Monthly expenses bar chart
- ✅ Form validation and error handling

### Stage 2: Categories & Dashboard
- ✅ Predefined transaction categories (Food & Dining, Transportation, Shopping, etc.)
- ✅ Category-wise pie chart visualization
- ✅ Dashboard with summary cards showing:
  - Total expenses and income
  - Category breakdown
  - Recent transactions overview

### Stage 3: Budgeting & Insights
- ✅ Set monthly category budgets
- ✅ Budget vs actual spending comparison
- ✅ Budget progress tracking with visual indicators
- ✅ Spending insights and recommendations
- ✅ Budget overflow alerts

## 🚀 Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Recharts** - Responsive chart library for data visualization
- **Lucide React** - Beautiful icon library
- **Local Storage** - Client-side data persistence

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-finance-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## 🎯 Usage

### Adding Transactions
1. Navigate to the "Transactions" tab
2. Click "Add Transaction"
3. Fill in the form with:
   - Amount (required)
   - Description (required)
   - Date (defaults to today)
   - Category (from predefined list)
   - Type (Income or Expense)
4. Click "Add Transaction" to save

### Managing Budgets
1. Go to the "Budgets" tab
2. Click "Set Budget"
3. Select a category and set your monthly budget limit
4. Track your progress with visual indicators

### Viewing Analytics
- **Dashboard**: Overview of your financial health
- **Categories**: Detailed category analysis with pie charts
- **Monthly Trends**: Bar chart showing spending over time

## 📊 Data Visualization

The app includes several chart types:
- **Monthly Expenses Chart**: Bar chart showing spending trends
- **Category Pie Chart**: Visual breakdown of spending by category
- **Budget Progress**: Progress bars with overflow indicators
- **Summary Cards**: Key financial metrics at a glance

## 💾 Data Storage

All data is stored locally in your browser using localStorage. This means:
- ✅ No account creation required
- ✅ Your data stays private on your device
- ⚠️ Data will be lost if you clear browser storage
- ⚠️ Data is not synced across devices

## 🎨 Features Highlights

### Responsive Design
- Mobile-first approach
- Works seamlessly on desktop, tablet, and mobile devices
- Adaptive layouts for different screen sizes

### User Experience
- Intuitive interface with clear navigation
- Real-time form validation
- Toast notifications for user actions
- Error handling and user feedback

### Data Management
- Search and filter transactions
- Edit existing transactions
- Bulk operations support
- Data export capabilities

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── BudgetForm.tsx     # Budget creation form
│   ├── BudgetOverview.tsx # Budget dashboard
│   ├── CategoryPieChart.tsx # Category visualization
│   ├── DashboardCards.tsx # Summary cards
│   ├── MonthlyExpensesChart.tsx # Monthly trends
│   ├── SpendingInsights.tsx # Financial insights
│   ├── TransactionForm.tsx # Transaction form
│   └── TransactionList.tsx # Transaction management
├── hooks/
│   └── use-toast.ts       # Toast notifications
├── pages/
│   └── Index.tsx          # Main application page
├── types/
│   └── finance.ts         # TypeScript definitions
└── lib/
    └── utils.ts           # Utility functions
```

## 🚀 Deployment

This project can be deployed on any static hosting service:

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add deploy script to package.json
3. Run: `npm run deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- Data is stored locally and not backed up
- No user authentication (by design)
- Limited to browser storage capacity

## 🔮 Future Enhancements

- [ ] Data export/import functionality
- [ ] Recurring transaction templates
- [ ] Multiple budget periods (weekly, yearly)
- [ ] Advanced reporting features
- [ ] Data backup and sync options

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

Built with ❤️ using React, TypeScript, and modern web technologies.
