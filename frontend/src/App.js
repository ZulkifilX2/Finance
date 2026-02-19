import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import KPICard from './components/KPICard';
import FinancialChart from './components/FinancialChart';
import TransactionList from './components/TransactionList';
import { UploadCloud, AlertCircle } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleIgnoreTransaction = async (id) => {
    if (!data) return;

    // Optimistic update or wait? Let's wait to ensure consistency
    setLoading(true);

    const newTransactions = data.transactions.filter(t => t.id !== id);

    try {
      const response = await axios.post('http://localhost:8000/api/forecast', {
        transactions: newTransactions
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to recalculate forecast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Financial Dashboard</h1>
            <p className="text-gray-500">Welcome back, User</p>
          </div>

          <div className="relative">
             <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".csv"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition shadow-sm"
            >
              <UploadCloud size={20} />
              {uploading ? "Uploading..." : "Upload CSV"}
            </label>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 border border-red-100">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {!data ? (
          <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <UploadCloud size={40} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500 max-w-sm text-center mb-6">
              Upload a bank statement CSV to generate your financial runway and forecast.
            </p>
            <label
              htmlFor="file-upload"
              className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer"
            >
              Select a file to get started
            </label>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <KPICard
                title="Total Liquidity"
                value={`$${data.current_balance.toLocaleString()}`}
                subtext="Current available balance"
                type="blue"
              />
              <KPICard
                title="Monthly Burn Rate"
                value={`$${data.avg_monthly_burn.toLocaleString()}`}
                subtext="Average monthly expenses"
                type="negative"
              />
              <KPICard
                title="Financial Runway"
                value={data.forecast.months_until_zero === 999 ? "∞ Infinite" : `${data.forecast.months_until_zero} Months`}
                subtext={data.forecast.runway_message}
                type={data.forecast.months_until_zero > 12 ? "positive" : "negative"}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Section */}
              <div className="lg:col-span-2">
                <FinancialChart data={data.monthly_summary} />
                <div className="mt-8">
                    <TransactionList transactions={data.transactions} onIgnore={handleIgnoreTransaction} />
                </div>
              </div>

              {/* Forecast/Details Sidebar */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4">1-Year Projection</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                            <span className="text-gray-500 text-sm">Projected Balance</span>
                            <span className={`font-bold ${data.forecast.projected_savings_1yr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${data.forecast.projected_savings_1yr.toLocaleString()}
                            </span>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700 leading-relaxed">
                            Based on your current spending habits,
                            {data.forecast.months_until_zero === 999
                                ? " you are accumulating wealth efficiently. Keep it up!"
                                : ` you have approximately ${data.forecast.months_until_zero} months before your balance reaches zero.`}
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
