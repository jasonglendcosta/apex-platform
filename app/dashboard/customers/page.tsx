'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { CustomerList, CustomerProfile, CustomerForm } from '@/components/customers'

interface Customer {
  id: string
  name: string
}

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  const handleBackFromProfile = () => {
    setSelectedCustomer(null)
  }

  const handleFormClose = () => {
    setShowForm(false)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    // Trigger customer list refresh
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Customers" 
        description="Manage leads and customer relationships"
      />
      
      <div className="p-8">
        <AnimatePresence mode="wait">
          {selectedCustomer ? (
            <CustomerProfile
              key="profile"
              customerId={selectedCustomer.id}
              onBack={handleBackFromProfile}
            />
          ) : (
            <div key="list" className="space-y-4">
              <CustomerList
                onSelect={handleSelectCustomer}
                onAdd={() => setShowForm(true)}
              />
              
              {/* Customer Form Modal */}
              {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <CustomerForm
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                  />
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
