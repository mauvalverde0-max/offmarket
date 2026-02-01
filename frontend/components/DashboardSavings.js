import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardSavings({ savingsData }) {
  const chartData = {
    labels: savingsData.map((s) => {
      const date = new Date(s.month_year);
      return date.toLocaleString('default', { month: 'short', year: '2-digit' });
    }),
    datasets: [
      {
        label: 'Monthly Savings',
        data: savingsData.map((s) => s.savings_amount),
        borderColor: '#0066cc',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Average',
        data: Array(savingsData.length).fill(
          savingsData.reduce((sum, s) => sum + s.savings_amount, 0) / savingsData.length
        ),
        borderColor: '#666',
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Monthly Savings',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Savings ($)',
        },
      },
    },
  };

  const totalSavings = savingsData.reduce((sum, s) => sum + s.savings_amount, 0);
  const avgSavings = totalSavings / savingsData.length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Savings Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-gray-600 mb-1">Total Saved</div>
          <div className="text-3xl font-bold text-green-600">
            ${totalSavings.toFixed(2)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Monthly Average</div>
          <div className="text-3xl font-bold text-blue-600">
            ${avgSavings.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mb-6 h-96">
        <Line data={chartData} options={options} />
      </div>

      <div className="text-sm text-gray-600">
        <p>
          You've saved an average of <strong>${avgSavings.toFixed(2)} per month</strong> by using
          Offmarket alerts and comparing prices across stores.
        </p>
      </div>
    </div>
  );
}
