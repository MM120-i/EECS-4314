'use client';

import { UploadImage } from "@/app/auth/actions";
import { CloudArrowDownIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";


export default function DragNDrop(){
      const [errorMessage, formAction, isPending] = useActionState(UploadImage,undefined);
    return(
        <form action={formAction}>
        <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-30 mt-5 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-primary">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <CloudArrowDownIcon className="h-10 w-10"/>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                </label>
            </div>
        </form>
    )
}