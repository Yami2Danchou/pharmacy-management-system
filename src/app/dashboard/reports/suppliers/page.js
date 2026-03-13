'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SuppliersReportPage() {
  const [dateRange, setDateRange] = useState('thismonth');
  
  // Mock data - would come from API
  const suppliers = [
    { id: 1, name: 'MedSupply Inc.', contact: 'Juan Reyes', deliveries: 12, totalAmount: 125000, lastDelivery: '2026-03-10' },
    { id: 2, name: 'PharmaDist Co.', contact: 'Maria Santos', deliveries: 8, totalAmount: 89000, lastDelivery: '2026-03-12' },
    { id: 3, name: 'HealthCare Corp', contact: 'Pedro Cruz', deliveries: 15, totalAmount: 210000, lastDelivery: '2026-03-08' },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

 const handleExportCSV = () => {
  try {
    const headers = ['Supplier', 'Contact Person', 'Deliveries', 'Total Amount (PHP)', 'Last Delivery'];
    const rows = suppliers.map(s => [
      `"${s.name}"`,
      `"${s.contact}"`,
      s.deliveries,
      s.totalAmount.toFixed(2),
      formatDate(s.lastDelivery)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `suppliers-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Suppliers report downloaded successfully!');
  } catch (error) {
    console.error('Error downloading CSV:', error);
    alert('Failed to download report. Please try again.');
  }
};

  return (
    <div className="animation-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Supplier Report</h1>
          <p className="text-sm text-gray-500">Supplier performance and delivery history</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <button
            onClick={handlePrint}
            className="btn-secondary w-full sm:w-auto"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-primary w-full sm:w-auto"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="thisweek">This Week</option>
              <option value="thismonth">This Month</option>
              <option value="lastmonth">Last Month</option>
              <option value="thisquarter">This Quarter</option>
              <option value="thisyear">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Suppliers</p>
          <p className="text-3xl font-bold text-gray-900">{suppliers.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Deliveries</p>
          <p className="text-3xl font-bold text-gray-900">
            {suppliers.reduce((sum, s) => sum + s.deliveries, 0)}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(suppliers.reduce((sum, s) => sum + s.totalAmount, 0))}
          </p>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Supplier List</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Supplier</th>
                <th className="table-header">Contact Person</th>
                <th className="table-header">Deliveries</th>
                <th className="table-header">Total Amount</th>
                <th className="table-header">Last Delivery</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{supplier.name}</td>
                  <td className="table-cell">{supplier.contact}</td>
                  <td className="table-cell">{supplier.deliveries}</td>
                  <td className="table-cell font-semibold">{formatCurrency(supplier.totalAmount)}</td>
                  <td className="table-cell">{formatDate(supplier.lastDelivery)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4 p-4">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-2">{supplier.name}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Contact:</span> {supplier.contact}</p>
                <p><span className="text-gray-500">Deliveries:</span> {supplier.deliveries}</p>
                <p><span className="text-gray-500">Total:</span> {formatCurrency(supplier.totalAmount)}</p>
                <p><span className="text-gray-500">Last:</span> {formatDate(supplier.lastDelivery)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}