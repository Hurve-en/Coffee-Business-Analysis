import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.product.deleteMany()
  await prisma.marketResearch.deleteMany()
  await prisma.financialMetric.deleteMany()

  // Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Espresso',
        description: 'Rich and bold espresso shot',
        category: 'Coffee',
        price: 3.50,
        cost: 0.80,
        stock: 500,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        category: 'Coffee',
        price: 4.50,
        cost: 1.20,
        stock: 450,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Latte',
        description: 'Smooth espresso with steamed milk',
        category: 'Coffee',
        price: 4.75,
        cost: 1.30,
        stock: 480,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Americano',
        description: 'Espresso with hot water',
        category: 'Coffee',
        price: 3.75,
        cost: 0.90,
        stock: 520,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mocha',
        description: 'Chocolate-flavored espresso drink',
        category: 'Coffee',
        price: 5.25,
        cost: 1.60,
        stock: 380,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cold Brew',
        description: 'Smooth cold-steeped coffee',
        category: 'Coffee',
        price: 4.25,
        cost: 1.10,
        stock: 300,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Croissant',
        description: 'Buttery French pastry',
        category: 'Pastry',
        price: 3.50,
        cost: 1.00,
        stock: 100,
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Blueberry Muffin',
        description: 'Fresh baked muffin with blueberries',
        category: 'Pastry',
        price: 3.25,
        cost: 0.90,
        stock: 85,
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-0101',
        totalSpent: 0,
        visitCount: 0,
        loyaltyPoints: 0,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Michael Chen',
        email: 'mchen@email.com',
        phone: '+1-555-0102',
        totalSpent: 0,
        visitCount: 0,
        loyaltyPoints: 0,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        phone: '+1-555-0103',
        totalSpent: 0,
        visitCount: 0,
        loyaltyPoints: 0,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'David Kim',
        email: 'dkim@email.com',
        phone: '+1-555-0104',
        totalSpent: 0,
        visitCount: 0,
        loyaltyPoints: 0,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Jessica Martinez',
        email: 'jmartinez@email.com',
        phone: '+1-555-0105',
        totalSpent: 0,
        visitCount: 0,
        loyaltyPoints: 0,
      },
    }),
  ])

  console.log(`✅ Created ${customers.length} customers`)

  // Create Orders (last 30 days)
  const now = new Date()
  const orders = []

  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const orderDate = new Date(now)
    orderDate.setDate(orderDate.getDate() - daysAgo)

    const customer = customers[Math.floor(Math.random() * customers.length)]
    const numItems = Math.floor(Math.random() * 3) + 1
    
    let total = 0
    const orderItems = []

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 2) + 1
      const itemTotal = product.price * quantity
      total += itemTotal

      orderItems.push({
        productId: product.id,
        quantity,
        price: product.price,
      })
    }

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderDate,
        total,
        status: 'completed',
        paymentMethod: ['cash', 'card', 'mobile'][Math.floor(Math.random() * 3)],
        items: {
          create: orderItems,
        },
      },
    })

    orders.push(order)

    // Update customer stats
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalSpent: { increment: total },
        visitCount: { increment: 1 },
        loyaltyPoints: { increment: Math.floor(total) },
        lastVisit: orderDate,
      },
    })
  }

  console.log(`✅ Created ${orders.length} orders`)

  // Create Market Research entries
  const research = await Promise.all([
    prisma.marketResearch.create({
      data: {
        title: 'Coffee Consumption Trends 2024',
        category: 'Market Trends',
        description: 'Analysis of current coffee drinking habits',
        findings: 'Cold brew and specialty lattes showing 25% growth. Sustainability increasingly important to consumers.',
        source: 'Industry Report',
      },
    }),
    prisma.marketResearch.create({
      data: {
        title: 'Local Competition Analysis',
        category: 'Competition',
        description: 'Survey of nearby coffee shops',
        findings: '3 major competitors within 2-mile radius. Average price point $4.50. Our quality ratings higher.',
        source: 'Field Research',
      },
    }),
    prisma.marketResearch.create({
      data: {
        title: 'Customer Satisfaction Survey Q4',
        category: 'Customer Feedback',
        description: 'Quarterly customer satisfaction metrics',
        findings: '4.2/5 average rating. Top requests: more seating, faster service, loyalty rewards program.',
        source: 'Customer Survey',
      },
    }),
  ])

  console.log(`✅ Created ${research.length} market research entries`)

  // Create Financial Metrics (last 6 months)
  for (let i = 0; i < 6; i++) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - i)

    await prisma.financialMetric.create({
      data: {
        date,
        revenue: 15000 + Math.random() * 5000,
        expenses: 8000 + Math.random() * 2000,
        profit: 7000 + Math.random() * 3000,
        category: 'Monthly',
        notes: `Financial performance for ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
      },
    })
  }

  console.log('✅ Created financial metrics')
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })