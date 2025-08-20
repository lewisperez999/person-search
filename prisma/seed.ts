import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const users = [
  { id: '1', name: 'John Doe', phoneNumber: '0412345678', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', phoneNumber: '0423456789', email: 'jane@example.com' },
  { id: '3', name: 'Alice Johnson', phoneNumber: '0434567890', email: 'alice@example.com' },
  { id: '4', name: 'Bob Williams', phoneNumber: '0445678901', email: 'bob@example.com' },
  { id: '5', name: 'Charlie Brown', phoneNumber: '0456789012', email: 'charlie@example.com' },
  { id: '6', name: 'Emily Davis', phoneNumber: '0467890123', email: 'emily@example.com' },
  { id: '7', name: 'Frank Miller', phoneNumber: '0478901234', email: 'frank@example.com' },
  { id: '8', name: 'Grace Lee', phoneNumber: '0489012345', email: 'grace@example.com' },
  { id: '9', name: 'Henry Moore', phoneNumber: '0490123456', email: 'henry@example.com' },
  { id: '10', name: 'Isabella Young', phoneNumber: '0401234567', email: 'isabella@example.com' },
]

async function main() {
  console.log('Start seeding...')
  
  // Clear existing data
  await prisma.user.deleteMany()
  
  // Insert users
  for (const user of users) {
    const result = await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    })
    console.log(`Created user with id: ${result.id}`)
  }
  
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })