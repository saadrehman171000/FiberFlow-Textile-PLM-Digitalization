"use client"

import { useToast } from "./use-toast"
import { ToastProvider, ToastViewport, Toast } from "./toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, ...props }) => (
        <Toast key={id} {...props} />
      ))}
      <ToastViewport />
    </ToastProvider>
  )
} 