// app/components/user-dialog.tsx
'use client'

import React from 'react'
import {  addUser } from '@/app/actions/actions'
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas'

import { UserForm } from './user-form'
import MutableDialog, { ActionState }  from '@/components/mutable-dialog'


interface UserDialogProps {
  children?: React.ReactNode
  onUserAdded?: (user: User) => void
}

export function UserDialog({ children, onUserAdded }: UserDialogProps) {
  const handleAddUser = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      const newUser = await addUser(data)
      if (onUserAdded) {
        onUserAdded(newUser)
      }
      return {
        success: true,
        message: `User ${newUser.name} added successfully`,
        data: newUser
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add user ' + (error instanceof Error ? error.message : 'Unknown error')
      }
    }
  }

  return (
    <MutableDialog<UserFormData>
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={handleAddUser}
      triggerButtonLabel="Add User"
      addDialogTitle="Add New User"
      dialogDescription="Fill out the form below to add a new user."
      submitButtonLabel="Save"
      defaultValues={{ name: '', email: '', phoneNumber: '' }} // Default empty values
      customTrigger={children}
    />
  )
}