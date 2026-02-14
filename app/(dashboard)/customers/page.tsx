'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useCustomer } from '@/hooks/useCustomer'
import { CustomerList } from '@/components/customers/CustomerList'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { CustomerProfile } from '@/components/customers/CustomerProfile'
import { ToastProvider } from '@/components/ui/Toast'
import { Customer } from '@/types'

function CustomersPageContent() {
  const {
    customers,
    loading,
    error,
    searchCustomers,
    deleteCustomer,
    filters,
  } = useCustomer()

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
    searchCustomers({ ...filters, search: value })
  }, [searchCustomers, filters])

  const handleAddSuccess = useCallback(() => {
    setShowAddForm(false)
    setEditingCustomer(null)
    // Real-time subscription will auto-update the list
  }, [])

  const handleDelete = useCallback(async (customerId: string) => {
    await deleteCustomer(customerId)
  }, [deleteCustomer])

  const handleSelectCustomer = useCallback((customer: Customer) => {
    setSelectedCustomerId(customer.id)
  }, [])

  const handleEditCustomer = useCallback((customer: Customer) => {
    setEditingCustomer(customer)
    setShowAddForm(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-[1400px] mx-auto p-6">
        <CustomerList
          customers={customers}
          loading={loading}
          onSelect={handleSelectCustomer}
          onAdd={() => { setEditingCustomer(null); setShowAddForm(true) }}
          onEdit={handleEditCustomer}
          onDelete={handleDelete}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        />

        {/* Add/Edit Customer Modal */}
        <AnimatePresence>
          {showAddForm && (
            <CustomerForm
              onClose={() => { setShowAddForm(false); setEditingCustomer(null) }}
              onSuccess={handleAddSuccess}
              editCustomer={editingCustomer || undefined}
            />
          )}
        </AnimatePresence>

        {/* Customer Profile Modal */}
        <AnimatePresence>
          {selectedCustomerId && (
            <CustomerProfile
              customerId={selectedCustomerId}
              onClose={() => setSelectedCustomerId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function CustomersPage() {
  return (
    <ToastProvider>
      <CustomersPageContent />
    </ToastProvider>
  )
}
