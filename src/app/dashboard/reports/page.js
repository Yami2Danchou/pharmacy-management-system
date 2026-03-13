'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('today');
  const [reportType, setReportType] = useState('sales');
  const [downloadMessage, setDownloadMessage] = useState('');

  // Sample recent reports data
  const recentReports = [
    { 
      id: 1, 
      name: 'Daily Sales Report', 
      date: '2026-03-13', 
      type: 'sales',
      data: {
        totalSales: 15230.50,
        transactions: 45,
        average: 338.46
      }
    },
    { 
      id: 2, 
      name: 'Inventory Summary', 
      date: '2026-03-12', 
      type: 'inventory',
      data: {
        totalProducts: 156,
        lowStock: 12,
        expiring: 5
      }
    },
    { 
      id: 3, 
      name: 'Expiring Products Report', 
      date: '2026-03-10', 
      type: 'expiring',
      data: {
        expiringCount: 8,
        critical: 2,
        warning: 3,
        notice: 3
      }
    }
  ];

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleDownload = (report) => {
    try {
      let content = '';
      let filename = '';
      let headers = [];

      // Generate content based on report type
      switch(report.type) {
        case 'sales':
          headers = ['Report Name', 'Date', 'Total Sales', 'Transactions', 'Average per Transaction'];
          content = [
            report.name,
            formatDate(report.date),
            formatCurrency(report.data.totalSales),
            report.data.transactions,
            formatCurrency(report.data.average)
          ].join(',');
          filename = `sales-report-${report.date}.csv`;
          break;

        case 'inventory':
          headers = ['Report Name', 'Date', 'Total Products', 'Low Stock Items', 'Expiring Soon'];
          content = [
            report.name,
            formatDate(report.date),
            report.data.totalProducts,
            report.data.lowStock,
            report.data.expiring
          ].join(',');
          filename = `inventory-report-${report.date}.csv`;
          break;

        case 'expiring':
          headers = ['Report Name', 'Date', 'Total Expiring', 'Critical (≤7 days)', 'Warning (≤15 days)', 'Notice (≤30 days)'];
          content = [
            report.name,
            formatDate(report.date),
            report.data.expiringCount,
            report.data.critical,
            report.data.warning,
            report.data.notice
          ].join(',');
          filename = `expiring-products-${report.date}.csv`;
          break;

        default:
          headers = ['Report Name', 'Date', 'Report Type'];
          content = [report.name, formatDate(report.date), report.type].join(',');
          filename = `report-${report.date}.csv`;
      }

      // Create CSV with headers and content
      const csvContent = [
        headers.join(','),
        content
      ].join('\n');

      // Download the file
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      // Show success message
      setDownloadMessage(`${report.name} downloaded successfully!`);
      setTimeout(() => setDownloadMessage(''), 3000);
      
    } catch (error) {
      console.error('Error downloading report:', error);
      setDownloadMessage('Failed to download report. Please try again.');
      setTimeout(() => setDownloadMessage(''), 3000);
    }
  };

  const handleGenerateReport = () => {
    // This would generate a new report based on filters
    setDownloadMessage(`Generating ${reportType} report for ${dateRange}...`);
    setTimeout(() => {
      setDownloadMessage(`Report generated successfully! Check your downloads.`);
    }, 1500);
    setTimeout(() => setDownloadMessage(''), 4000);
  };

  return (
    <div className="animation-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
      </div>

      {/* Success/Error Message */}
      {downloadMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          downloadMessage.includes('Failed') 
            ? 'bg-red-50 border-l-4 border-red-400 text-red-700'
            : 'bg-green-50 border-l-4 border-green-400 text-green-700'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {downloadMessage.includes('Failed') ? (
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{downloadMessage}</p>
            </div>
          </div>
        </div>
      )}

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
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              className="btn-primary w-full"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            {recentReports.map((report) => (
              <li key={report.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">
                      Generated on {formatDate(report.date)}
                      {report.type === 'sales' && ` • ${formatCurrency(report.data.totalSales)} total sales`}
                      {report.type === 'inventory' && ` • ${report.data.totalProducts} products`}
                      {report.type === 'expiring' && ` • ${report.data.expiringCount} products expiring`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDownload(report)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download CSV
                    </button>
                    <Link
                      href={`/dashboard/reports/${report.type}`}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}