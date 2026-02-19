import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BalanceChart = ({ data }) => {
  // Use useMemo for chart data preparation
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map(item => ({
      date: item.date,
      balance: item.balance
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Projected Balance Over Time</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => val.slice(5)} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Balance']}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorBalance)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;
