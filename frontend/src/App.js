import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function App() {
  const [data, setData] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:8000/upload', formData);
    setData(response.data);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Personal Finance Dashboard</h1>
      
      <input type="file" onChange={handleFileUpload} className="mb-8" />

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* KPI Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Monthly Burn Rate</h2>
            <p className="text-4xl font-bold text-red-500">${Math.abs(data.avg_burn_rate)}</p>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="mb-4 font-semibold">Spending Trend</h2>
            <LineChart width={400} height={200} data={data.transactions}>
              <XAxis dataKey="Date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
              <Line type="monotone" dataKey="Amount" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
