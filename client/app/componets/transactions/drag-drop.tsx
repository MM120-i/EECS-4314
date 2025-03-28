'use client';

import { uploadReceipt } from "@/app/data/receipts";
import { ChangeEvent, useState } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import { log } from "console";



type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function DragNDrop() {


    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<UploadStatus>('idle')
    const [data, setData] = useState(null)
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<String | null>(null)

    const maxSize = 5 * 1024 * 1024 // 5MB

    function checkFile(file : File){
        setFile(null)
        setError(null)
        if(file == null) return 
        if(file.type != "image/jpeg"){
            setError("File must be a Jpeg Image!")
            return
        }
        if (file.size > maxSize){
            setError("Jpeg Image must be 5MG or less!")
            return
        }
        setFile(file)
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            checkFile(e.target.files[0])
        }
    }

    function handleFileDrop(e ){
        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault();
      
        if (e.dataTransfer.items[0]) {
          // Use DataTransferItemList interface to access the file(s)
          if(e.dataTransfer.items[0].kind == "file"){
            const file = e.dataTransfer.items[0].getAsFile();
            checkFile(file)
          }
        }
    }   


    async function handleFileUpload() {

    
        if (!file) return
        setStatus("uploading");
        
        const formData = new FormData();
        formData.append('receipt', file, file.name)

        try {

            const res = await uploadReceipt(formData);
            console.log("hell");    

            if (!response.ok) {
                setStatus("error")
                console.log("bit")
                setError(response)
            }
            else {
                setFile(null)
                setOpen(false);
                setError(null)
                setStatus("success")
                console.log("error")
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
        setFile(null)
        setError(null)
        setStatus('idle')
    };

    return (
        <div className="mt-10">
            <Button onClick={handleClickOpen}>
                Upload Receipt
            </Button>
            <Dialog open={open} onClose={handleClose} >
                <DialogTitle>Input a Receipt for processing</DialogTitle>
                <DialogContent>
                        <div className="flex items-center justify-center w-full flex-col gap-5" >
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center  mt-2  border-2 border-dashed rounded-lg cursor-pointer  border-primary">
                                <div className="flex flex-col items-center justify-center p-10" onDrop={handleFileDrop} onDragOver={handleFileDrop}>
                                    <CloudArrowDownIcon className="h-10 w-10" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">JPG (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" accept="image/jpeg" className="hidden" onChange={handleFileChange}  />
                                {file && (
                                <div className="mb-4 text-sm">
                                    <p>File name: {file.name}</p>
                                    <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <p>Type: {file.type} </p>
                                </div>
                            )}
                            </label>
                            {error && (<p className="text-primary">{error}</p>)}
                            <div className="flex  items-center justify-center w-full gap-10">
                            <Button onClick={handleClose}>Cancel</Button>
                             <Button onClick={handleFileUpload} aria-disabled={status === 'uploading' || file == null} >Upload</Button>
                            </div>
                            {status === 'uploading' && <CircularProgress />}
                        </div>
                </DialogContent>
            </Dialog>
        </div>
        
    )
}