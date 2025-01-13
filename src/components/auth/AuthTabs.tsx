"use client";

import React, { useState } from 'react';
import SignInForm from '../auth/SignInForm';
import SignUpForm from '../auth/SignUpForm';

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">SneakerVault</h1>
        <p className="text-gray-600 mt-2">Welcome back! Please sign in to continue.</p>
      </div>

      {/* Tabs */}
      <div className="flex mb-8">
        <button
          className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
            activeTab === 'signin'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('signin')}
        >
          Sign In
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
            activeTab === 'signup'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </button>
      </div>

      {/* Forms */}
      {activeTab === 'signin' ? <SignInForm /> : <SignUpForm />}

      {/* Social Login */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <img
              className="h-5 w-5 mr-2"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />
            Google
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <i className="fab fa-facebook text-blue-600 text-lg mr-2"></i>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthTabs; 