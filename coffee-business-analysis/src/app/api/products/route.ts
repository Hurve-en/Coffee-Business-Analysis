/**
 * PRODUCTS API ROUTE
 * 
 * Handles all CRUD operations for products
 * 
 * Endpoints:
 * - GET: Fetch all products
 * - POST: Create new product
 * - PUT: Update existing product
 * - DELETE: Delete product
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.name || !body.category || body.price === undefined || body.cost === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || null,
        category: body.category,
        price: parseFloat(body.price),
        cost: parseFloat(body.cost),
        stock: parseInt(body.stock) || 0,
        imageUrl: body.imageUrl || null,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description || null,
        category: body.category,
        price: parseFloat(body.price),
        cost: parseFloat(body.cost),
        stock: parseInt(body.stock),
        imageUrl: body.imageUrl || null,
        isActive: body.isActive
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Delete product
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}