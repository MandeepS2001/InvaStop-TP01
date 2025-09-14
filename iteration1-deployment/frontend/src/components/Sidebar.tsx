import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Leaf, 
  FileText, 
  Plus, 
  User,
  MapPin
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Species', href: '/species', icon: Leaf },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'New Report', href: '/reports/new', icon: Plus },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Map', href: '/map', icon: MapPin },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
