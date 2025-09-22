import React from 'react';
import { ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function MenuItem({ item, isActive, collapsed, toggleSubmenu, isOpen, setActiveItem }) {
  if (item.children) {
    return (
      <li>
        <button
          onClick={() => !collapsed && toggleSubmenu(item.key)}
          className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-200 hover:bg-blue-800 hover:text-white transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </div>
          {!collapsed && (
            <ChevronDown
              className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              size={16}
            />
          )}
        </button>

        {!collapsed && isOpen && (
          <ul className="bg-blue-800 py-1">
            {item.children.map((subItem) => (
              <SubMenuItem key={subItem.key} subItem={subItem} isActive={isActive} setActiveItem={setActiveItem} />
            ))}
          </ul>
        )}
      </li>
    );
  } else {
    return (
      <li>
        <NavLink
          to={item.path}
          onClick={() => {
            setActiveItem(item.path);
          }}
          className={({ isActive: isNavLinkActive }) =>
            `flex items-center space-x-3 px-4 py-3 transition-colors duration-200 ${isNavLinkActive
              ? 'text-white font-bold bg-blue-800'
              : 'text-gray-200 hover:bg-blue-800 hover:text-white'
            }`
          }
          end
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {item.key === '0' && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            )}
            {item.key === '2' && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            )}
            {item.key === '3' && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a1 1 0 001 1h6a1 1 0 001-1v-6M8 11H7a1 1 0 00-1 1v6a1 1 0 001 1h1m0-8h8m-8 0V7a4 4 0 018 0v4m0 0h1a1 1 0 011 1v6a1 1 0 01-1 1h-1" />
              </svg>
            )}
            {item.key === '4' && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            )}
            {item.key === '5' && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )}
          </div>
          {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
        </NavLink>
      </li>
    );
  }
}

function SubMenuItem({ subItem, isActive, setActiveItem }) {
  return (
    <li>
      <NavLink
        to={subItem.path}
        onClick={() => {
          setActiveItem(subItem.path);
        }}
        className={({ isActive: isNavLinkActive }) =>
          `block px-12 py-2 text-sm transition-colors duration-200 ${isNavLinkActive
            ? 'text-white font-bold bg-blue-700'
            : 'text-gray-200 hover:text-white hover:bg-blue-700'
          }`
        }
      >
        {subItem.label}
      </NavLink>
    </li>
  );
}

export { MenuItem, SubMenuItem };
