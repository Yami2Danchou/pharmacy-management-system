'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-morphism fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold gradient-text">
                  Labdrug Pharmacy
                </h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Features
                  </a>
                  <a href="#benefits" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Benefits
                  </a>
                  <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    About
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="btn-secondary"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className={`relative overflow-hidden pt-20 ${isVisible ? 'animation-fade-in' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              <span className="gradient-text">Labdrug Pharmacy</span>
              <br />
              Sales & Inventory Management System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Streamline your pharmacy operations with our comprehensive management solution. 
              Track sales, monitor inventory, manage expirations, and generate reports with ease.
            </p>
            {/* Removed Start Free Trial and Learn More buttons */}
          </div>

          {/* Dashboard Preview */}
<div className="mt-20 relative">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-3xl opacity-20"></div>
  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
    {/* Always show placeholder first, image will load on top if available */}
    <div className="p-12 text-center" id="dashboard-preview-container">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-8 rounded-2xl">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-2xl font-bold mb-2">Interactive Dashboard</h3>
        <p className="text-blue-100">Real-time analytics and insights at your fingertips</p>
      </div>
    </div>
    
    {/* Try to load the image, but it will be hidden by default */}
    <img
      src="/dashboard-preview.png"
      alt="Dashboard Preview"
      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500"
      onLoad={(e) => {
        // When image loads successfully, fade it in and hide the placeholder
        e.target.style.opacity = '1';
        const container = document.getElementById('dashboard-preview-container');
        if (container) {
          container.style.opacity = '0';
        }
      }}
      onError={(e) => {
        // If image fails to load, keep showing the placeholder
        console.log('Dashboard preview image not found, showing placeholder');
        e.target.style.display = 'none';
      }}
    />
  </div>
</div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Features for Your Pharmacy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your pharmacy efficiently in one integrated system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 card-hover">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sales Management</h3>
              <p className="text-gray-600">
                Process transactions quickly with an intuitive POS interface. Track daily sales, print receipts, and manage returns effortlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 card-hover">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Inventory Tracking</h3>
              <p className="text-gray-600">
                Real-time inventory updates with automatic stock adjustments. Set reorder levels and receive low stock alerts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8 card-hover">
              <div className="bg-red-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expiration Monitoring</h3>
              <p className="text-gray-600">
                Track batch numbers and expiration dates. Get automated alerts for products nearing expiration to minimize losses.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 card-hover">
              <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reports & Analytics</h3>
              <p className="text-gray-600">
                Generate comprehensive sales reports, inventory summaries, and performance analytics to make data-driven decisions.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 card-hover">
              <div className="bg-yellow-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User Management</h3>
              <p className="text-gray-600">
                Role-based access control for Admin, Manager, and Cashier. Secure authentication and activity logging.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 card-hover">
              <div className="bg-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Supplier Management</h3>
              <p className="text-gray-600">
                Manage supplier information, track deliveries, and maintain product sourcing history efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-24 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Labdrug Pharmacy System?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Transform your pharmacy operations with our proven solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg">
                <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                <p className="text-blue-100">Inventory Accuracy</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg">
                <div className="text-4xl font-bold text-white mb-2">60%</div>
                <p className="text-blue-100">Faster Checkout</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg">
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <p className="text-blue-100">Expiry Tracking</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <p className="text-blue-100">System Availability</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About Labdrug Pharmacy
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Established in 2015, Labdrug Pharmacy has been providing high-quality pharmaceutical services 
                and essential healthcare products to the local community in Isulan.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Our mission is to efficiently provide pharmaceutical products and services through organized 
                sales and inventory management, ensuring accurate stock monitoring, timely replenishment, 
                and proper handling of medications.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                With this new Sales and Inventory Management System, we aim to improve operational efficiency, 
                enhance customer satisfaction, and maintain accurate inventory records to better serve our community.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Licensed Pharmacists</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Quality Products</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Real-time Expiry Tracking</h4>
                      <p className="text-sm text-gray-600">Never miss an expiration date</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Automated Reports</h4>
                      <p className="text-sm text-gray-600">Daily, weekly, monthly analytics</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Multi-branch Ready</h4>
                      <p className="text-sm text-gray-600">Scale as your business grows</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Streamline Your Pharmacy Operations?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join Labdrug Pharmacy in embracing digital transformation for better service and efficiency.
          </p>
          <Link
            href="/login"
            className="btn-primary text-lg px-8 py-3 inline-block"
          >
            Access the System
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Labdrug Pharmacy</h3>
              <p className="text-gray-600 text-sm">
                Your trusted partner in health and wellness since 2015.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Contact
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Isulan, Philippines</li>
                <li>contact@labdrugpharmacy.com</li>
                <li>+63 (XXX) XXX-XXXX</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-600 hover:text-blue-600">Features</a></li>
                <li><a href="#benefits" className="text-gray-600 hover:text-blue-600">Benefits</a></li>
                <li><a href="#about" className="text-gray-600 hover:text-blue-600">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Labdrug Pharmacy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}