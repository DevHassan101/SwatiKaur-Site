'use client';

import { useState } from 'react';
import { FiChevronDown, FiMenu } from 'react-icons/fi';
import { logoutAction } from '@/app/actions/auth';

interface NavbarProps {
  user: {
    username: string;
    email: string;
  };
  onMenuClick: () => void;
}

export default function Navbar({ user, onMenuClick }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <header className="h-17.5 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      {/* Left Side - Menu Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <FiMenu size={24} />
        </button>

        {/* Logo for mobile */}
        <div className="lg:hidden">
          <h2 className="text-xl font-bold text-purple-600 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-base font-bold">
              S
            </span>
            <span className="hidden sm:inline">Swati-Kuar</span>
          </h2>
        </div>

      </div>

      {/* Right Side - User Profile */}
      <div className="flex items-center gap-6">
        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 md:gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm md:text-base shadow-sm">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800">
                {user.username}
              </p>
            </div>
            <FiChevronDown
              size={18}
              className={`hidden md:block text-gray-500 transition-transform duration-200 ${
                showDropdown ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              {/* Backdrop for mobile */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />

              <div className="absolute top-14 right-0 w-60 bg-white rounded-lg shadow-xl p-2 z-50 border border-gray-100">
                <div className="px-3 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors mt-1"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
