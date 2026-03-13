'use client';

import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Cashier',
    employee_name: '',
    employee_gender: '',
    employee_age: '',
    employee_address: '',
    employee_contacts: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      // Ensure data is an array
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setMessage({ type: 'success', text: 'User created successfully!' });
      setShowAddModal(false);
      fetchUsers();
      
      // Reset form
      setFormData({
        username: '',
        password: '',
        role: 'Cashier',
        employee_name: '',
        employee_gender: '',
        employee_age: '',
        employee_address: '',
        employee_contacts: ''
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      password: '',
      role: user.role || 'Cashier',
      employee_name: user.employee_name || '',
      employee_gender: user.employee_gender || '',
      employee_age: user.employee_age || '',
      employee_address: user.employee_address || '',
      employee_contacts: user.employee_contacts || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`/api/users/${selectedUser.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      setMessage({ type: 'success', text: 'User updated successfully!' });
      setShowEditModal(false);
      fetchUsers();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (userId, username) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setMessage({ type: 'success', text: data.message || 'User deleted successfully!' });
      fetchUsers();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const user = users.find(u => u.user_id === userId);
      if (!user) return;

      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          role: user.role,
          employee_name: user.employee_name,
          employee_gender: user.employee_gender,
          employee_age: user.employee_age,
          employee_address: user.employee_address,
          employee_contacts: user.employee_contacts,
          is_active: !currentStatus
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update user status');
      }

      setMessage({ 
        type: 'success', 
        text: `User ${currentStatus ? 'deactivated' : 'activated'} successfully!` 
      });
      fetchUsers();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error toggling user status:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'Admin': return 'status-danger';
      case 'Manager': return 'status-warning';
      default: return 'status-info';
    }
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
      <div className="animation-fade-in">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchUsers}
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Create and manage system users</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary w-full sm:w-auto"
        >
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add New User
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'error' 
            ? 'bg-red-50 border-l-4 border-red-400 text-red-700'
            : 'bg-green-50 border-l-4 border-green-400 text-green-700'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'error' ? (
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
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Username</th>
                <th className="table-header">Employee Name</th>
                <th className="table-header">Role</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No users found. Click "Add New User" to create one.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{user.username}</td>
                    <td className="table-cell">{user.employee_name}</td>
                    <td className="table-cell">
                      <span className={`status-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${user.is_active ? 'status-success' : 'status-danger'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      
                      {/* Only show deactivate/activate button for non-admin users */}
                      {user.role !== 'Admin' && (
                        <button
                          onClick={() => handleToggleStatus(user.user_id, user.is_active)}
                          className={`mr-3 ${
                            user.is_active 
                              ? 'text-yellow-600 hover:text-yellow-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                      
                      {/* Only show delete button for non-admin users */}
                      {user.role !== 'Admin' && (
                        <button
                          onClick={() => handleDelete(user.user_id, user.username)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add New User</h3>
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
                {/* User Account Information */}
                <div className="md:col-span-2">
                  <h4 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b">Account Information</h4>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    className="input-field"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="input-field"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    required
                    className="input-field"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Cashier">Cashier</option>
                  </select>
                </div>

                {/* Employee Information */}
                <div className="md:col-span-2 mt-2">
                  <h4 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b">Employee Information</h4>
                </div>
                
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    name="employee_name"
                    required
                    className="input-field"
                    value={formData.employee_name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="employee_gender"
                    className="input-field"
                    value={formData.employee_gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="employee_age"
                    className="input-field"
                    value={formData.employee_age}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="employee_address"
                    rows="2"
                    className="input-field"
                    value={formData.employee_address}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="employee_contacts"
                    className="input-field"
                    value={formData.employee_contacts}
                    onChange={handleInputChange}
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Edit User</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Account Information */}
                <div className="md:col-span-2">
                  <h4 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b">Account Information</h4>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    className="input-field"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="input-field"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    required
                    className="input-field"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Cashier">Cashier</option>
                  </select>
                </div>

                {/* Employee Information */}
                <div className="md:col-span-2 mt-2">
                  <h4 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b">Employee Information</h4>
                </div>
                
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    name="employee_name"
                    required
                    className="input-field"
                    value={formData.employee_name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="employee_gender"
                    className="input-field"
                    value={formData.employee_gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="employee_age"
                    className="input-field"
                    value={formData.employee_age}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="employee_address"
                    rows="2"
                    className="input-field"
                    value={formData.employee_address}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="employee_contacts"
                    className="input-field"
                    value={formData.employee_contacts}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}