import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React from "react";

interface MyDialogProps {
  triggerBtn: React.ReactNode;
  dialogTitle?: React.ReactNode;
  dialogContent?: React.ReactNode;
}

export const  MyDialog = ({
  triggerBtn,
  dialogTitle,
  dialogContent,
}: MyDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{triggerBtn}</DialogTrigger>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
