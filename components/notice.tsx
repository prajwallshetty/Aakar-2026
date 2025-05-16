import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat"
});

export default function Notice({
    title = "Text Content",
    description,
    onClose
}: {
    title?: string;
    description?: string;
    onClose?: () => void;
}) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md text-center flex justify-center flex-col">
                <DialogHeader>
                    <DialogTitle className="sm:max-w-md text-center flex justify-center flex-col">{title}</DialogTitle>
                    {description && <DialogDescription className={`${montserrat.className}`}>{description}</DialogDescription>}
                </DialogHeader>

                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}