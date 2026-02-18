import React from 'react';

const KPICard = ({ title, value, subtext, type = "neutral" }) => {
  const colorMap = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-gray-900",
    blue: "text-blue-500"
  };

  const textColor = colorMap[type] || "text-gray-900";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition">
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
      <div className={`text-3xl font-bold mb-1 ${textColor}`}>
        {value}
      </div>
      <div className="text-xs text-gray-400">
        {subtext}
      </div>
    </div>
  );
};

export default KPICard;
