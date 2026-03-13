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
    // For demo purposes, we'll return random status
    const random = Math.random();
    if (random < 0.3) {
      return {
        status: 'Low Stock',
        class: 'status-warning'
      };
    } else if (random < 0.1) {
      return {
        status: 'Out of Stock',
        class: 'status-danger'
      };
    } else {
      return {
        status: 'In Stock',
        class: 'status-success'
      };
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'lowstock') {
      const status = getStockStatus(product);
      return status.status === 'Low Stock' || status.status === 'Out of Stock';
    }
    if (filter === 'expiring') {
      return expiringProducts.some(ep => ep.product_id === product.product_id);
    }
    return true;
  });

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
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Link
            href="/dashboard/inventory/add"
            className="btn-primary w-full sm:w-auto text-center"
          >
            + Add Stock
          </Link>
          <Link
            href="/dashboard/inventory/adjust"
            className="btn-secondary w-full sm:w-auto text-center"
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
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-8 min-w-max">
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

      {filteredProducts.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">No products match the selected filter.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white shadow overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
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
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    const isExpiring = expiringProducts.some(ep => ep.product_id === product.product_id);
                    const expiringProduct = expiringProducts.find(ep => ep.product_id === product.product_id);
                    
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
                            <div>
                              <span className="status-badge status-danger">
                                Expiring Soon
                              </span>
                              {expiringProduct && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatDate(expiringProduct.expirationdate)}
                                </div>
                              )}
                            </div>
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

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              const isExpiring = expiringProducts.some(ep => ep.product_id === product.product_id);
              const expiringProduct = expiringProducts.find(ep => ep.product_id === product.product_id);
              
              return (
                <div key={product.product_id} className="bg-white shadow rounded-lg p-4 border border-gray-200">
                  {/* Header with Product Name and Category */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">{product.product_name}</h3>
                      <p className="text-sm text-gray-500">{product.brand_name}</p>
                    </div>
                    <span className="status-badge status-info ml-2">{product.category_name}</span>
                  </div>
                  
                  {/* Product Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-xs text-gray-500">Price</span>
                      <p className="text-base font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Stock Status</span>
                      <p className="mt-1">
                        <span className={`status-badge ${stockStatus.class}`}>
                          {stockStatus.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Expiry Status */}
                  <div className="mb-4">
                    <span className="text-xs text-gray-500">Expiry Status</span>
                    <p className="mt-1">
                      {isExpiring ? (
                        <div>
                          <span className="status-badge status-danger">
                            ⚠️ Expiring Soon
                          </span>
                          {expiringProduct && (
                            <span className="text-xs text-gray-500 ml-2">
                              {formatDate(expiringProduct.expirationdate)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">No expiry issues</span>
                      )}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                    <Link
                      href={`/dashboard/inventory/${product.product_id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                    <Link
                      href={`/dashboard/inventory/edit/${product.product_id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}