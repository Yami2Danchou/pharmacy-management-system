'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    unit: '',
    price: '',
    category_id: '',
    description: '',
    brand_id: '',
    reorder_level: '10'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch products
      const productsRes = await fetch('/api/products');
      if (!productsRes.ok) {
        throw new Error(`Products API returned ${productsRes.status}`);
      }
      const productsData = await productsRes.json();
      setProducts(productsData);

      // Fetch categories - handle 404 gracefully
      try {
        const categoriesRes = await fetch('/api/categories');
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        } else {
          console.warn('Categories API returned:', categoriesRes.status);
          // Try to get categories from products data as fallback
          const uniqueCategories = [...new Set(productsData.map(p => p.category_name))];
          const fallbackCategories = uniqueCategories.map((name, index) => ({
            category_id: index + 1,
            category_name: name
          }));
          setCategories(fallbackCategories);
        }
      } catch (catError) {
        console.warn('Error fetching categories:', catError);
      }

      // Fetch brands - handle 404 gracefully
      try {
        const brandsRes = await fetch('/api/brands');
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          setBrands(brandsData);
        } else {
          console.warn('Brands API returned:', brandsRes.status);
          // Try to get brands from products data as fallback
          const uniqueBrands = [...new Set(productsData.map(p => p.brand_name))];
          const fallbackBrands = uniqueBrands.map((name, index) => ({
            brand_id: index + 1,
            brand_name: name
          }));
          setBrands(fallbackBrands);
        }
      } catch (brandError) {
        console.warn('Error fetching brands:', brandError);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to create product');
      }

      const data = await res.json();
      setShowAddModal(false);
      fetchData(); // Refresh the list
      setFormData({
        product_name: '',
        unit: '',
        price: '',
        category_id: '',
        description: '',
        brand_id: '',
        reorder_level: '10'
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product: ' + error.message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading products: {error}
              </p>
              <button
                onClick={fetchData}
                className="mt-2 text-sm text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animation-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white shadow sm:rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              + Add Product
            </button>
          </div>
        </div>
   ) : (
  <>
    {/* Desktop Table View - hidden on mobile */}
    <div className="hidden sm:block bg-white shadow overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Product</th>
              <th className="table-header">Category</th>
              <th className="table-header">Brand</th>
              <th className="table-header">Price</th>
              <th className="table-header">Unit</th>
              <th className="table-header">Reorder Level</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.product_id} className="hover:bg-gray-50">
                <td className="table-cell">
                  <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                  {product.description && (
                    <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                  )}
                </td>
                <td className="table-cell">
                  <span className="status-badge status-info">{product.category_name}</span>
                </td>
                <td className="table-cell">{product.brand_name}</td>
                <td className="table-cell font-medium">{formatCurrency(product.price)}</td>
                <td className="table-cell">{product.unit}</td>
                <td className="table-cell">{product.reorder_level}</td>
                <td className="table-cell">
                  <Link
                    href={`/dashboard/products/${product.product_id}`}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => {
                      // Handle edit
                    }}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      // Handle delete
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Mobile Card View - visible only on mobile */}
    <div className="sm:hidden space-y-4">
      {products.map((product) => (
        <div key={product.product_id} className="bg-white shadow rounded-lg p-4 border border-gray-200">
          {/* Header with Name and Category */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-base font-semibold text-gray-900 flex-1">{product.product_name}</h3>
            <span className="status-badge status-info ml-2">{product.category_name}</span>
          </div>
          
          {/* Brand */}
          <div className="mb-3">
            <span className="text-xs text-gray-500">Brand</span>
            <p className="text-sm text-gray-900">{product.brand_name}</p>
          </div>
          
          {/* Product Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <span className="text-xs text-gray-500">Price</span>
              <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Unit</span>
              <p className="text-sm text-gray-900">{product.unit}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Reorder Level</span>
              <p className="text-sm text-gray-900">{product.reorder_level}</p>
            </div>
          </div>
          
          {/* Description */}
          {product.description && (
            <div className="mb-3">
              <span className="text-xs text-gray-500">Description</span>
              <p className="text-sm text-gray-600">{product.description.substring(0, 100)}...</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
            <Link
              href={`/dashboard/products/${product.product_id}`}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </Link>
            <button
              onClick={() => {
                // Handle edit
              }}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => {
                // Handle delete
              }}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </>
)}
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.product_name}
                    onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g., Tablet, Bottle, Piece"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₱) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="input-field"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.brand_id}
                    onChange={(e) => setFormData({...formData, brand_id: e.target.value})}
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.brand_id} value={brand.brand_id}>
                        {brand.brand_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reorder Level
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.reorder_level}
                    onChange={(e) => setFormData({...formData, reorder_level: e.target.value})}
                  />
                </div>
                
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}