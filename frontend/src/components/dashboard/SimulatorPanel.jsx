import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { Sliders, DollarSign, RefreshCw } from 'lucide-react';

const SimulatorPanel = ({ onSimulate, originalTransactions }) => {
  const [discretionaryReduction, setDiscretionaryReduction] = useState(0);
  const [windfall, setWindfall] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Debounced simulation trigger
  const runSimulation = useCallback(
    _.debounce((reduction, windfallAmount, transactions) => {
      // If we don't have originalTransactions, we can't simulate
      if (!transactions || transactions.length === 0) return;

      setIsSimulating(true);

      // Clone transactions properly to avoid mutation
      let simulatedTransactions = JSON.parse(JSON.stringify(transactions));

      const discretionaryCategories = ['Dining', 'Entertainment', 'Shopping', 'Uncategorized'];

      // 1. Identify discretionary transactions and reduce them
      if (reduction > 0) {
        simulatedTransactions = simulatedTransactions.map(t => {
          // Identify discretionary categories
          // Check category. Also check if it's an expense (amount < 0)
          const isDiscretionary = discretionaryCategories.includes(t.category);
          if (t.amount < 0 && isDiscretionary) {
              return { ...t, amount: t.amount * (1 - reduction / 100) };
          }
          return t;
        });
      }

      // 2. Add Windfall (as a new transaction today)
      if (windfallAmount && parseFloat(windfallAmount) > 0) {
        simulatedTransactions.push({
          id: 'windfall-' + Date.now(),
          date: new Date().toISOString().split('T')[0], // Today's date YYYY-MM-DD
          description: 'One-Time Windfall (Simulated)',
          amount: parseFloat(windfallAmount),
          category: 'Income'
        });
      }

      // 3. Pass back to parent
      onSimulate(simulatedTransactions);
      setIsSimulating(false);
    }, 500),
    [] // Empty dependency array for debounce creation
  );

  // Effect to trigger debounce when inputs change
  useEffect(() => {
    runSimulation(discretionaryReduction, windfall, originalTransactions);
    // Cleanup to cancel pending debounce on unmount or re-render
    return () => {
      runSimulation.cancel();
    };
  }, [discretionaryReduction, windfall, originalTransactions, runSimulation]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Sliders size={20} className="text-blue-500" />
          Scenario Simulator
        </h3>
        {isSimulating && <RefreshCw className="animate-spin text-blue-500" size={16} />}
      </div>

      <div className="space-y-8">
        {/* Discretionary Spending Slider */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-gray-700">Reduce Discretionary Spending</label>
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-xs">{discretionaryReduction}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={discretionaryReduction}
            onChange={(e) => setDiscretionaryReduction(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Dynamically reduces expenses in <span className="font-medium text-gray-600">Dining, Entertainment, Shopping</span>.
          </p>
        </div>

        {/* Windfall Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            One-Time Windfall
          </label>
          <div className="relative group">
            <DollarSign className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="number"
              value={windfall}
              onChange={(e) => setWindfall(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-300"
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Simulates a bonus or tax refund added today.</p>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPanel;
