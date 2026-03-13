'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ExpiringProductsPage() {
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpiringProducts();
  }, []);

  const fetchExpiringProducts = async () => {
    try {
      const res = await fetch('/api/products/expiring');
      const data = await res.json();
      setExpiringProducts(data);
    } catch (error) {
      console.error('Error fetching expiring products:', error);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handlePrint = () => {
    window.print();
  };
const handleExportCSV = () => {
  try {
    const headers = ['Product', 'Batch Code', 'Quantity', 'Expiry Date', 'Days Left', 'Status'];
    const rows = expiringProducts.map(product => {
      const daysLeft = getDaysUntilExpiry(product.expirationdate);
      let status = 'Good';
      if (daysLeft <= 7) status = 'Critical';
      else if (daysLeft <= 15) status = 'Warning';
      else if (daysLeft <= 30) status = 'Notice';
      
      return [
        `"${product.product_name}"`,
        product.batch_code,
        product.quantity,
        formatDate(product.expirationdate),
        daysLeft,
        status
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `expiring-products-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Expiring products report downloaded successfully!');
  } catch (error) {
    console.error('Error downloading CSV:', error);
    alert('Failed to download report. Please try again.');
  }
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
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Expiring Products Report</h1>
          <p className="text-sm text-gray-500">Products nearing their expiration date</p>
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

      {/* Warning Alert */}
      {expiringProducts.length > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <span className="font-bold">{expiringProducts.length}</span> products are expiring within 30 days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Critical (7 days)</p>
          <p className="text-3xl font-bold text-red-600">
            {expiringProducts.filter(p => getDaysUntilExpiry(p.expirationdate) <= 7).length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Warning (15 days)</p>
          <p className="text-3xl font-bold text-yellow-600">
            {expiringProducts.filter(p => {
              const days = getDaysUntilExpiry(p.expirationdate);
              return days > 7 && days <= 15;
            }).length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Notice (30 days)</p>
          <p className="text-3xl font-bold text-blue-600">
            {expiringProducts.filter(p => {
              const days = getDaysUntilExpiry(p.expirationdate);
              return days > 15 && days <= 30;
            }).length}
          </p>
        </div>
      </div>

      {/* Expiring Products Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Expiring Products</h2>
        </div>

        {expiringProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No expiring products</h3>
            <p className="mt-1 text-sm text-gray-500">All products have valid expiration dates.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Product</th>
                    <th className="table-header">Batch Code</th>
                    <th className="table-header">Quantity</th>
                    <th className="table-header">Expiry Date</th>
                    <th className="table-header">Days Left</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expiringProducts.map((product) => {
                    const daysLeft = getDaysUntilExpiry(product.expirationdate);
                    let statusClass = 'status-success';
                    let statusText = 'Good';
                    
                    if (daysLeft <= 7) {
                      statusClass = 'status-danger';
                      statusText = 'Critical';
                    } else if (daysLeft <= 15) {
                      statusClass = 'status-warning';
                      statusText = 'Warning';
                    } else {
                      statusClass = 'status-info';
                      statusText = 'Notice';
                    }

                    return (
                      <tr key={`${product.product_id}-${product.batch_code}`} className="hover:bg-gray-50">
                        <td className="table-cell font-medium">{product.product_name}</td>
                        <td className="table-cell">{product.batch_code}</td>
                        <td className="table-cell">{product.quantity}</td>
                        <td className="table-cell">{formatDate(product.expirationdate)}</td>
                        <td className="table-cell font-semibold">{daysLeft} days</td>
                        <td className="table-cell">
                          <span className={`status-badge ${statusClass}`}>{statusText}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4 p-4">
              {expiringProducts.map((product) => {
                const daysLeft = getDaysUntilExpiry(product.expirationdate);
                let statusClass = 'status-success';
                let statusText = 'Good';
                
                if (daysLeft <= 7) {
                  statusClass = 'status-danger';
                  statusText = 'Critical';
                } else if (daysLeft <= 15) {
                  statusClass = 'status-warning';
                  statusText = 'Warning';
                } else {
                  statusClass = 'status-info';
                  statusText = 'Notice';
                }

                return (
                  <div key={`${product.product_id}-${product.batch_code}`} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-semibold text-gray-900">{product.product_name}</h3>
                      <span className={`status-badge ${statusClass}`}>{statusText}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <p><span className="text-gray-500">Batch:</span> {product.batch_code}</p>
                        <p><span className="text-gray-500">Qty:</span> {product.quantity}</p>
                      </div>
                      <p><span className="text-gray-500">Expires:</span> {formatDate(product.expirationdate)}</p>
                      <p><span className="text-gray-500">Days Left:</span> <span className="font-semibold">{daysLeft} days</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}