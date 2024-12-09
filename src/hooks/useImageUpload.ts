import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface UseImageUploadProps {
  bucket: string
  onSuccess?: (url: string) => void
  onError?: (error: Error) => void
}

export function useImageUpload({ bucket, onSuccess, onError }: UseImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true)
      
      if (!file) {
        throw new Error('No file selected')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onSuccess?.(publicUrl)
      return publicUrl
    } catch (error) {
       
      onError?.(error as Error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadImage, isUploading }
}

