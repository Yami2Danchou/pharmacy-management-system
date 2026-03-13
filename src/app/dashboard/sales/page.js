'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchSales();
  }, [selectedDate]);

  const fetchSales = async () => {
    try {
      const res = await fetch(`/api/sales?date=${selectedDate}`);
      const data = await res.json();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="animation-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Sales Transactions</h1>
        <Link
          href="/dashboard/sales/new"
          className="btn-primary w-full sm:w-auto text-center"
        >
          + New Sale
        </Link>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-field w-full sm:w-64"
        />
      </div>

      {sales.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sales</h3>
          <p className="mt-1 text-sm text-gray-500">No sales recorded for this date.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white shadow overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Sale ID</th>
                    <th className="table-header">Customer</th>
                    <th className="table-header">Cashier</th>
                    <th className="table-header">Date & Time</th>
                    <th className="table-header">Total</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.sale_id} className="hover:bg-gray-50">
                      <td className="table-cell">
                        <span className="status-badge status-info">#{sale.sale_id}</span>
                      </td>
                      <td className="table-cell font-medium">
                        {sale.customer_name || 'Walk-in Customer'}
                      </td>
                      <td className="table-cell">
                        {sale.employee_name}
                      </td>
                      <td className="table-cell">
                        <div>{formatDate(sale.sale_date)}</div>
                        <div className="text-xs text-gray-500">{formatTime(sale.sale_date)}</div>
                      </td>
                      <td className="table-cell font-semibold text-gray-900">
                        {formatCurrency(sale.total_amount)}
                      </td>
                      <td className="table-cell">
                        <Link
                          href={`/dashboard/sales/${sale.sale_id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {sales.map((sale) => (
              <div key={sale.sale_id} className="bg-white shadow rounded-lg p-4 border border-gray-200">
                {/* Header with Sale ID and Total */}
                <div className="flex justify-between items-start mb-3">
                  <span className="status-badge status-info">#{sale.sale_id}</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(sale.total_amount)}</span>
                </div>

                {/* Customer Info */}
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Customer</span>
                  <p className="text-base font-medium text-gray-900">{sale.customer_name || 'Walk-in Customer'}</p>
                </div>

                {/* Cashier and Date Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <span className="text-xs text-gray-500">Cashier</span>
                    <p className="text-sm text-gray-900">{sale.employee_name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Date & Time</span>
                    <p className="text-sm text-gray-900">{formatDate(sale.sale_date)}</p>
                    <p className="text-xs text-gray-500">{formatTime(sale.sale_date)}</p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-3 border-t border-gray-200">
                  <Link
                    href={`/dashboard/sales/${sale.sale_id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}