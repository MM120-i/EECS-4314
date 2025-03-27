'use client';

import { uploadReceipt } from "@/app/data/receipts";
import { ChangeEvent, useActionState, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/material/Icon';
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import { Button } from "../button";
import { CloudArrowDownIcon } from "@heroicons/react/24/solid";



type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function DragNDrop() {


    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<UploadStatus>('idle')
    const [data, setData] = useState(null)
    const [open, setOpen] = useState(false)

    //const maxSize = 5 * 1024 * 1024 // 5MB

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    function handleFileDrop(e ){
        console.log("File(s) dropped");

        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault();
      
        if (e.dataTransfer.items[0]) {
          // Use DataTransferItemList interface to access the file(s)
          if(e.dataTransfer.items[0].kind == "file"){
            const file = e.dataTransfer.items[0].getAsFile();
            if(file && file.type == "image/jpeg"){
                setFile(file)
                console.log(file.type)
            }
          }
        }
        }   


    async function handleFileUpload() {

    
        if (!file) return
        setStatus("uploading");

        const formData = new FormData();
        formData.append('receipts', file, file.name)

        try {

            const res = await uploadReceipt(formData);


            if (!res) {
                setStatus("error")
                console.log(res)
            }
            else {
                setStatus("success")
                console.log(res)
                //console.log(await res.json())
            }




        } catch {
            setStatus("error")
        }
    }
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="mt-10">
            <Button onClick={handleClickOpen}>
                Upload Receipt
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const email = formJson.email;
                            console.log(email);
                            handleClose();
                        },
                    },
                }}
            >
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                        <div className="flex items-center justify-center w-full" >
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-30 mt-5 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-primary">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6" onDrop={handleFileDrop} onDragOver={handleFileDrop}>
                                    <CloudArrowDownIcon className="h-10 w-10" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange}  />
                            </label>
                            {file && (
                                <div className="mb-4 text-sm">
                                    <p>File name: {file.name}</p>
                                    <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <p>Type: {file.type} </p>
                                </div>
                            )}
                        </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
        
    )
}