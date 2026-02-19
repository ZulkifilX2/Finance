import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const CategoryChart = ({ data }) => {
  const chartData = useMemo(() => {
      if (!data) return [];
      // Filter out small slices? Or just take top 5 + Other
      if (data.length > 8) {
          const top7 = data.slice(0, 7);
          const other = data.slice(7).reduce((acc, curr) => acc + curr.amount, 0);
          return [...top7, { category: 'Other', amount: other }];
      }
      return data;
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Spending Breakdown</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="amount"
            nameKey="category"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
             formatter={(value) => `$${value.toFixed(2)}`}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: '#6b7280' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
