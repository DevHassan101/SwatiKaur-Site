'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiLayers, FiFileText, FiChevronDown, FiPlus, FiEye, FiX } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const isModelActive = pathname.startsWith('/dashboard/models');
  const isBlogActive = pathname.startsWith('/dashboard/blogs');

  const toggleAccordion = (accordion: string) => {
    setActiveAccordion(activeAccordion === accordion ? null : accordion);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:w-64
        overflow-y-auto
      `}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>

        {/* Logo */}
        <div className="px-6 py-5 mb-8">
          <h2 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
              S
            </span>
            Swati-Kuar
          </h2>
        </div>

        {/* Menu Items */}
        <nav>
          {/* Dashboard */}
          <Link
            href="/dashboard"
            onClick={onClose}
            className={`
              flex items-center gap-3 px-6 py-3 text-[15px] transition-all
              border-l-4 ${pathname === '/dashboard'
                ? 'text-purple-600 bg-purple-50 border-l-purple-600 font-semibold'
                : 'text-gray-600 border-l-transparent font-normal hover:bg-gray-50'
              }
            `}
          >
            <FiHome size={20} />
            Dashboard
          </Link>

          {/* Models Accordion */}
          <div>
            <button
              onClick={() => toggleAccordion('models')}
              className={`
                w-full flex items-center justify-between gap-3 px-6 py-3 text-[15px]
                transition-all border-l-4 text-left
                ${isModelActive
                  ? 'text-purple-600 bg-purple-50 border-l-purple-600 font-semibold'
                  : 'text-gray-600 border-l-transparent font-normal hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <FiLayers size={20} />
                Models
              </div>
              <FiChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  activeAccordion === 'models' ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {activeAccordion === 'models' && (
              <div className="bg-purple-50/30 pl-12">
                <Link
                  href="/dashboard/models/create"
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-6 py-2.5 text-sm transition-colors
                    ${pathname === '/dashboard/models/create'
                      ? 'text-purple-600 font-semibold'
                      : 'text-gray-600 font-normal hover:text-purple-600'
                    }
                  `}
                >
                  <FiPlus size={16} />
                  Add Model
                </Link>
                <Link
                  href="/dashboard/models"
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-6 py-2.5 text-sm transition-colors
                    ${pathname === '/dashboard/models'
                      ? 'text-purple-600 font-semibold'
                      : 'text-gray-600 font-normal hover:text-purple-600'
                    }
                  `}
                >
                  <FiEye size={16} />
                  View Models
                </Link>
              </div>
            )}
          </div>

          {/* Blogs Accordion */}
          <div>
            <button
              onClick={() => toggleAccordion('blogs')}
              className={`
                w-full flex items-center justify-between gap-3 px-6 py-3 text-[15px]
                transition-all border-l-4 text-left
                ${isBlogActive
                  ? 'text-purple-600 bg-purple-50 border-l-purple-600 font-semibold'
                  : 'text-gray-600 border-l-transparent font-normal hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <FiFileText size={20} />
                Blogs
              </div>
              <FiChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  activeAccordion === 'blogs' ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>

            {activeAccordion === 'blogs' && (
              <div className="bg-purple-50/30 pl-12">
                <Link
                  href="/dashboard/blogs/create"
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-6 py-2.5 text-sm transition-colors
                    ${pathname === '/dashboard/blogs/create'
                      ? 'text-purple-600 font-semibold'
                      : 'text-gray-600 font-normal hover:text-purple-600'
                    }
                  `}
                >
                  <FiPlus size={16} />
                  Add Blog
                </Link>
                <Link
                  href="/dashboard/blogs"
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-6 py-2.5 text-sm transition-colors
                    ${pathname === '/dashboard/blogs'
                      ? 'text-purple-600 font-semibold'
                      : 'text-gray-600 font-normal hover:text-purple-600'
                    }
                  `}
                >
                  <FiEye size={16} />
                  View Blogs
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
