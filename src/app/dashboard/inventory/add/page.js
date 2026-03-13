'use client';

import Link from 'next/link';

export default function AddInventoryPage() {
  return (
    <div className="animation-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add Inventory</h1>
        <p className="text-gray-600">Record new stock delivery</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
              </label>
              <select className="input-field">
                <option>Select Product</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <select className="input-field">
                <option>Select Supplier</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input type="number" className="input-field" placeholder="Enter quantity" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number
              </label>
              <input type="text" className="input-field" placeholder="Enter batch number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Price
              </label>
              <input type="number" className="input-field" placeholder="Enter purchase price" />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link href="/dashboard/inventory" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary">
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}