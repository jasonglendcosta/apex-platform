import React from 'react';
import '../globals.css';

export const metadata = {
  title: 'APEX Platform | One Development',
  description: 'Sales Intelligence Platform for Property Developers',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-slate-100">
          {/* Navigation Sidebar */}
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white hidden lg:block">
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  APEX
                </div>
                <div>
                  <h1 className="font-bold text-lg">APEX Platform</h1>
                  <p className="text-xs text-slate-400">One Development</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <NavLink href="/" icon="📊" label="Dashboard" />
                <NavLink href="/inventory" icon="🏢" label="Inventory" />
                <NavLink href="/offers" icon="📝" label="Offers" active />
                <NavLink href="/customers" icon="👥" label="Customers" />
                <NavLink href="/reservations" icon="🔒" label="Reservations" />
                <NavLink href="/analytics" icon="📈" label="Analytics" />
                <NavLink href="/settings" icon="⚙️" label="Settings" />
              </nav>
            </div>

            {/* User Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">
                  JC
                </div>
                <div>
                  <p className="font-medium text-sm">Jason D Costa</p>
                  <p className="text-xs text-slate-400">Sales Consultant</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}

function NavLink({ href, icon, label, active = false }: NavLinkProps) {
  return (
    <a
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-pink-500/20 text-pink-400'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </a>
  );
}
