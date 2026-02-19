import React, { useState, useEffect } from 'react';
import useForecast from './hooks/useForecast';
import Sidebar from './components/common/Sidebar';
import KPICard from './components/dashboard/KPICard';
import BalanceChart from './components/dashboard/BalanceChart';
import CashFlowChart from './components/dashboard/CashFlowChart';
import CategoryChart from './components/dashboard/CategoryChart';
import SimulatorPanel from './components/dashboard/SimulatorPanel';
import TransactionList from './components/dashboard/TransactionList';
import { UploadCloud, AlertCircle } from 'lucide-react';

function App() {
  const { data, loading, error, uploadFile, updateForecast } = useForecast();
  const [originalTransactions, setOriginalTransactions] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalTransactions(null);
      const newData = await uploadFile(file);
      if (newData) {
          setOriginalTransactions(newData.transactions);
      }
    }
  };

  const handleSimulation = (simulatedTransactions) => {
    updateForecast(simulatedTransactions);
  };

  const handleIgnoreTransaction = (id) => {
     if (!data) return;
     const newTransactions = data.transactions.filter(t => t.id !== id);

     if (originalTransactions) {
         setOriginalTransactions(originalTransactions.filter(t => t.id !== id));
     }

     updateForecast(newTransactions);
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
              {loading ? "Processing..." : "Upload CSV"}
            </label>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 border border-red-100">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {!data && !loading && (
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
        )}

        {data && (
          <div className={`animate-in fade-in duration-500 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>

            {/* Top Row: KPI Cards */}
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
                type={data.forecast.months_until_zero > 12 || data.forecast.months_until_zero === 999 ? "positive" : "negative"}
              />
            </div>

            {/* Middle Row: Simulator + Balance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 h-96">
              <div className="lg:col-span-4 h-full">
                 <SimulatorPanel
                    onSimulate={handleSimulation}
                    originalTransactions={originalTransactions}
                 />
              </div>
              <div className="lg:col-span-8 h-full">
                <BalanceChart data={data.balance_history} />
              </div>
            </div>

            {/* Bottom Row: CashFlow + Category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-12">
               <CashFlowChart data={data.monthly_summary} />
               <CategoryChart data={data.spending_by_category} />
            </div>

            {/* Transactions List */}
            <div className="grid grid-cols-1 gap-8">
                <TransactionList transactions={data.transactions} onIgnore={handleIgnoreTransaction} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
