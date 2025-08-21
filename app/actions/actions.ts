//app/actions/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'

export async function searchUsers(query: string): Promise<User[]> {
    console.log('Searching users with query:', query)
    const results = await prisma.user.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: query,
                    }
                },
                {
                    email: {
                        contains: query,
                    }
                },
                {
                    phoneNumber: {
                        contains: query,
                    }
                }
            ]
        }
    })
    console.log('Search results:', results)
    return results
}

export async function getAllUsers(
    page: number = 1, 
    limit: number = 10, 
    search: string = ''
): Promise<{ users: User[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit
    
    const where = search ? {
        OR: [
            {
                name: {
                    contains: search,
                }
            },
            {
                email: {
                    contains: search,
                }
            },
            {
                phoneNumber: {
                    contains: search,
                }
            }
        ]
    } : {}

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                name: 'asc'
            }
        }),
        prisma.user.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return {
        users,
        total,
        totalPages
    }
}

export async function addUser(data: Omit<User, 'id'>): Promise<User> {
    const validatedData = userSchema.omit({ id: true }).parse(data)
    const newUser = await prisma.user.create({
        data: validatedData
    })
    revalidatePath('/')
    return newUser
}

export async function deleteUser(id: string): Promise<void> {
    try {
        await prisma.user.delete({
            where: { id }
        })
        console.log(`User with id ${id} has been deleted.`)
        revalidatePath('/') // Revalidate the page or component path
    } catch (error) {
        console.error('Error deleting user:', error)
        throw new Error(`User with id ${id} not found`)
    }
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: data
        })
        
        // Validate the updated user against our schema
        const validatedUser = userSchema.parse(updatedUser)
        
        console.log(`User with id ${id} has been updated.`)
        revalidatePath('/') // Revalidate the page or component path
        
        return validatedUser
    } catch (error) {
        console.error('Error updating user:', error)
        throw new Error(`User with id ${id} not found`)
    }
}

export const getUserById = cache(async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id }
    })
    return user || null
})
