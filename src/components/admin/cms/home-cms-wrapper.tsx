'use client'

import React, { useState } from 'react'
import { SectionEditor } from './section-editor'
import { EditContentDialog, ContentFormData } from './edit-content-dialog'
import { updateContentBlock } from '@/lib/firebase-cms'
import { useFirebaseAuth } from '@/hooks/use-firebase-auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface HomeCmsWrapperProps {
  children: React.ReactNode
  sectionId: string
  sectionName: string
  initialData?: Partial<ContentFormData>
}

export function HomeCmsWrapper({
  children,
  sectionId,
  sectionName,
  initialData
}: HomeCmsWrapperProps) {
  const [isEditDialogOpen, setIsEditOpen] = useState(false)
  const { user } = useFirebaseAuth()
  const router = useRouter()

  const handleSave = async (data: ContentFormData) => {
    if (!user) return

    try {
      // Store the section data as a JSON string in the ContentBlock 'value'
      await updateContentBlock(
        sectionId,
        JSON.stringify(data),
        user.email || user.uid,
        {
          type: 'json',
          status: 'PUBLISHED'
        }
      )
      toast.success(`${sectionName} updated successfully!`)
      router.refresh() // Refresh server components to show new data
    } catch (error) {
      console.error('Save error:', error)
      toast.error(`Failed to update ${sectionName}`)
      throw error
    }
  }

  return (
    <>
      <SectionEditor
        sectionId={sectionId}
        sectionName={sectionName}
        onEdit={() => setIsEditOpen(true)}
        onHistory={() => toast.info('History viewer coming in Phase 3!')}
      >
        {children}
      </SectionEditor>

      <EditContentDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        initialData={initialData}
        sectionName={sectionName}
      />
    </>
  )
}
