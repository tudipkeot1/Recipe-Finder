import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

const HowToCookModal = () => {
  return (
    <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely Sure?</DialogTitle>
                <DialogDescription>This action cannot be undone. This will permanetly delete youe account and remove your data from our website.</DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default HowToCookModal