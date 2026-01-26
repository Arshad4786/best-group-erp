"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

// Initialize Supabase (Client Side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TestUploadPage() {
  const [status, setStatus] = useState("Idle");
  const [url, setUrl] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const fileName = `test-${Date.now()}-${file.name}`;
    
    console.log("--- 1. STARTING UPLOAD ---");
    console.log("File Name:", fileName);
    console.log("Bucket Name: 'logos'"); // Ensure this matches your Supabase bucket exactly

    setStatus("Uploading...");

    try {
      // Step A: Upload
      const { data, error } = await supabase.storage
        .from("logos") // <--- CHECK THIS NAME matches your Supabase Bucket
        .upload(fileName, file);

      if (error) {
        console.error("--- UPLOAD ERROR ---", error);
        setStatus(`Error: ${error.message}`);
        return;
      }

      console.log("--- 2. UPLOAD SUCCESS ---", data);

      // Step B: Get URL
      const { data: publicData } = supabase.storage
        .from("logos")
        .getPublicUrl(fileName);

      console.log("--- 3. PUBLIC URL GENERATED ---", publicData.publicUrl);
      
      setUrl(publicData.publicUrl);
      setStatus("Success! Check the Console for details.");

    } catch (err) {
      console.error("--- UNEXPECTED ERROR ---", err);
      setStatus("Unexpected Error");
    }
  };

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Supabase Upload Test</h1>
      
      <input type="file" onChange={handleUpload} className="border p-2" />
      
      <div className="p-4 bg-gray-100 rounded">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>URL:</strong> {url || "Waiting..."}</p>
      </div>

      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Test" className="w-32 h-32 object-contain border bg-white" />
      )}
    </div>
  );
}