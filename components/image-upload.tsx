"use client";

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

export default function ImageUpload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleRemove = () => {
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* Hidden Input that sends the file to the server action */}
      <input
        type="file"
        name="logo" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
      />

      {!fileName ? (
        <button
          type="button"
          onClick={handleClick}
          // Using your EXACT classes
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-300 border-dashed rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Upload className="w-4 h-4" /> Click to upload logo
        </button>
      ) : (
        <div className="w-full flex items-center justify-between px-4 py-2 border border-blue-300 bg-blue-50 rounded-md text-blue-700">
          <span className="truncate text-sm font-medium">{fileName}</span>
          <button 
            type="button" 
            onClick={handleRemove}
            className="p-1 hover:bg-blue-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}