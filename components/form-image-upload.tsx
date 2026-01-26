"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload, Loader2, X } from "lucide-react";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FormImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setIsUploading(true);
    const file = e.target.files[0];
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`; // Clean filename

    try {
      // 1. Upload
      const { error } = await supabase.storage
        .from("logos") // Ensure this bucket exists in Supabase
        .upload(fileName, file);

      if (error) throw error;

      // 2. Get URL
      const { data } = supabase.storage
        .from("logos")
        .getPublicUrl(fileName);

      setLogoUrl(data.publicUrl);
      console.log("Uploaded:", data.publicUrl);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* 1. VISIBLE UPLOAD BUTTON */}
      {!logoUrl ? (
        <div className="relative">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            id="logo-upload-input"
            className="hidden" 
          />
          <label 
            htmlFor="logo-upload-input"
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors w-fit"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-slate-500" />}
            <span className="text-sm text-slate-600">
              {isUploading ? "Uploading..." : "Click to upload logo"}
            </span>
          </label>
        </div>
      ) : (
        /* 2. PREVIEW (Shows when uploaded) */
        <div className="relative w-fit">
          <div className="h-20 w-20 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Logo Preview" className="h-full w-full object-contain" />
            
            {/* Remove Button */}
            <button 
              type="button"
              onClick={() => setLogoUrl("")}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-green-600 mt-1 font-medium">Logo uploaded successfully</p>
        </div>
      )}

      {/* 3. HIDDEN INPUT (Crucial for Server Action) */}
      {/* This passes the URL to app/actions/company.ts */}
      <input type="hidden" name="logoUrl" value={logoUrl} />
    </div>
  );
}