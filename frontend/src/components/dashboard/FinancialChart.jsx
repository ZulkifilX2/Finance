import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const FinancialChart = ({ data }) => {
  // Transform data for visualization
  const chartData = data.map(item => ({
    ...item,
    expenses: Math.abs(item.expenses), // Make positive for chart
    income: item.income
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
            name="Income"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
            name="Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;
