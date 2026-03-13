'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('today');
  const [reportType, setReportType] = useState('sales');

  const reports = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Daily, weekly, and monthly sales summaries',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'blue'
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Current stock levels and valuation',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      color: 'green'
    },
    {
      id: 'expiring',
      name: 'Expiring Products',
      description: 'Products nearing expiration date',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'red'
    },
    {
      id: 'suppliers',
      name: 'Supplier Report',
      description: 'Supplier performance and deliveries',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
      color: 'purple'
    }
  ];

  const getIconColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="animation-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
      </div>

      {/* Report Filters */}
      <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Generate Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="input-field"
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="expiring">Expiring Products</option>
              <option value="suppliers">Supplier Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="thisweek">This Week</option>
              <option value="lastweek">Last Week</option>
              <option value="thismonth">This Month</option>
              <option value="lastmonth">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full">
              Generate Report
            </button>
          </div>
        </div>

        {dateRange === 'custom' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input type="date" className="input-field" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Reports */}
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={`/dashboard/reports/${report.id}`}
            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`inline-flex p-3 rounded-lg ${getIconColor(report.color)} mb-4`}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={report.icon} />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{report.name}</h3>
            <p className="text-sm text-gray-500">{report.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Reports</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            <li className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Daily Sales Report</p>
                  <p className="text-sm text-gray-500">Generated on March 13, 2026</p>
                </div>
                <button className="text-blue-600 hover:text-blue-900">Download</button>
              </div>
            </li>
            <li className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Inventory Summary</p>
                  <p className="text-sm text-gray-500">Generated on March 12, 2026</p>
                </div>
                <button className="text-blue-600 hover:text-blue-900">Download</button>
              </div>
            </li>
            <li className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Expiring Products Report</p>
                  <p className="text-sm text-gray-500">Generated on March 10, 2026</p>
                </div>
                <button className="text-blue-600 hover:text-blue-900">Download</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}