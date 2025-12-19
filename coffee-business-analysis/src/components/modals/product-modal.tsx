/**
 * PRODUCT FORM MODAL - FIXED VERSION
 */

'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Product {
  id?: string
  name: string
  description: string | null
  category: string
  price: number
  cost: number
  stock: number
  imageUrl: string | null
  isActive: boolean
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
  product?: Product | null
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    category: 'Coffee',
    price: '',
    cost: '',
    stock: '',
    imageUrl: '',
    isActive: true
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Coffee',
        price: '',
        cost: '',
        stock: '',
        imageUrl: '',
        isActive: true
      })
    }
    setErrors({})
  }, [product, isOpen])

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0'
    if (formData.cost && parseFloat(formData.cost) < 0) newErrors.cost = 'Cost cannot be negative'
    if (formData.stock && parseInt(formData.stock) < 0) newErrors.stock = 'Stock cannot be negative'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validate()) {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        cost: parseFloat(formData.cost) || 0,
        stock: parseInt(formData.stock) || 0
      }
      onSave(dataToSave)
      onClose()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  if (!isOpen) return null

  const price = parseFloat(formData.price) || 0
  const cost = parseFloat(formData.cost) || 0
  const profitMargin = price > 0 ? (((price - cost) / price) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 animate-fadeIn">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Espresso"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Brief description of the product"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="Coffee">Coffee</option>
                <option value="Tea">Tea</option>
                <option value="Pastry">Pastry</option>
                <option value="Snack">Snack</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost (₱) *</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                    errors.cost ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>

            {price > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">Profit Margin Preview:</p>
                <p className="text-2xl font-bold text-slate-700">{profitMargin.toFixed(1)}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  Profit per unit: {price > cost ? '₱' + (price - cost).toFixed(2) : '₱0.00'}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-xl font-semibold hover:from-slate-800 hover:to-slate-950 transition-all"
              >
                {product ? 'Update Product' : 'Add Product'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  )
}