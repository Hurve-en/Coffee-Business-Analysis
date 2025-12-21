/**
 * CLEAR ALL ORDERS API
 * 
 * DELETE /api/orders/clear
 * 
 * Deletes ALL orders and order items
 * Restores product stock and resets customer stats
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  try {
    // Step 1: Get all orders before deleting (to restore stock)
    const orders = await prisma.order.findMany({
      include: {
        items: true
      }
    })

    // Step 2: Restore product stock
    for (const order of orders) {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }
    }

    // Step 3: Reset customer stats
    const customers = await prisma.customer.findMany()
    for (const customer of customers) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          totalSpent: 0,
          visitCount: 0,
          loyaltyPoints: 0,
          lastVisit: null
        }
      })
    }

    // Step 4: Delete all order items
    await prisma.orderItem.deleteMany({})
    
    // Step 5: Delete all orders
    const result = await prisma.order.deleteMany({})
    
    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${result.count} orders and reset all stats`,
      count: result.count 
    })

  } catch (error) {
    console.error('Error clearing orders:', error)
    return NextResponse.json(
      { error: 'Failed to clear orders' },
      { status: 500 }
    )
  }
}