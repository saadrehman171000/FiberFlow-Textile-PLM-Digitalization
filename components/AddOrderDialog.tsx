'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddOrderForm } from "./AddOrderForm"
import { useState } from "react"

interface AddOrderDialogProps {
  onOrderAdded?: () => void
}

export function AddOrderDialog({ onOrderAdded }: AddOrderDialogProps) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
    onOrderAdded?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
        </DialogHeader>
        <AddOrderForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
} 