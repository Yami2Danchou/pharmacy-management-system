'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, expiringRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/products/expiring')
      ]);

      const productsData = await productsRes.json();
      const expiringData = await expiringRes.json();

      setProducts(productsData);
      setExpiringProducts(expiringData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
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
      month: 'short',
      day: 'numeric'
    });
  };

  const getStockStatus = (product) => {
    // This is simplified - you'd need actual stock levels
    return {
      status: 'In Stock',
      class: 'status-success'
    };
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/inventory/add"
            className="btn-primary"
          >
            + Add Stock
          </Link>
          <Link
            href="/dashboard/inventory/adjust"
            className="btn-secondary"
          >
            Adjust Inventory
          </Link>
        </div>
      </div>

      {/* Expiring Soon Alert */}
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

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setFilter('all')}
            className={`${filter === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter('lowstock')}
            className={`${filter === 'lowstock'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setFilter('expiring')}
            className={`${filter === 'expiring'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Expiring Soon
          </button>
        </nav>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Product</th>
              <th className="table-header">Category</th>
              <th className="table-header">Price</th>
              <th className="table-header">Stock Status</th>
              <th className="table-header">Expiry Date</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const stockStatus = getStockStatus(product);
              const isExpiring = expiringProducts.some(ep => ep.product_id === product.product_id);
              
              return (
                <tr key={product.product_id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                    <div className="text-sm text-gray-500">{product.brand_name}</div>
                  </td>
                  <td className="table-cell">
                    <span className="status-badge status-info">{product.category_name}</span>
                  </td>
                  <td className="table-cell font-medium">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="table-cell">
                    <span className={`status-badge ${stockStatus.class}`}>
                      {stockStatus.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    {isExpiring ? (
                      <span className="status-badge status-danger">
                        Expiring Soon
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <Link
                      href={`/dashboard/inventory/${product.product_id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      href={`/dashboard/inventory/edit/${product.product_id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}