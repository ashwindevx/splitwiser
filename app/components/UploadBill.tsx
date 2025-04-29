'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function UploadBill() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate file type
      const fileType = file.type;
      const isImage = fileType.startsWith('image/');
      const isPDF = fileType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      
      if (!isImage && !isPDF) {
        throw new Error('Invalid file format. Please upload an image or PDF file.');
      }
      
      // Create form data to send to the API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', isPDF ? 'pdf' : 'image');
      
      // Send the file to our API endpoint
      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process file');
      }
      
      const data = await response.json();
      
      // Check if we got any items
      if (!data.items || data.items.length === 0) {
        throw new Error('No items detected in the receipt. Please try another image.');
      }
      
      // Dispatch event with scanned data (items and shared fees)
      window.dispatchEvent(new CustomEvent('billScanned', { 
        detail: { 
          items: data.items,
          sharedFees: data.sharedFees || [] 
        }
      }));
      
    } catch (err: any) {
      console.error('Error scanning bill:', err);
      setError(err.message || 'Failed to scan bill. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Upload Your Bill</h2>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="border border-gray-300 rounded p-4 text-center">
            {preview ? (
              <div className="relative h-48 w-full">
                <Image 
                  src={preview} 
                  alt="Bill preview" 
                  fill 
                  className="object-contain"
                />
              </div>
            ) : (
              <div>
                <svg 
                  className="mx-auto h-10 w-10 text-gray-400" 
                  stroke="currentColor" 
                  fill="none" 
                  viewBox="0 0 48 48" 
                  aria-hidden="true"
                >
                  <path 
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                    strokeWidth={2} 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
                <p className="mt-1 text-xs text-gray-600">
                  Drag and drop a file or click to select
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG, PDF up to 10MB
                </p>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*,.pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="bill-upload"
            />
            <label 
              htmlFor="bill-upload" 
              className="mt-3 inline-block px-3 py-1 bg-white border border-gray-300 text-xs text-gray-700 rounded cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Select Image
            </label>
          </div>
          
          {error && (
            <div className="mt-2 text-red-500 text-xs">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-sm font-medium mb-2">How it works:</h3>
          <ol className="list-decimal ml-5 text-xs text-gray-600 space-y-1">
            <li>Upload a photo or PDF of your bill</li>
            <li>Our AI scans and extracts all items and prices</li>
            <li>Shared fees (delivery, service charges) are automatically split equally</li>
            <li>Add participants and assign menu items</li>
            <li>Get personalized payment amounts</li>
          </ol>
          
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className={`mt-4 px-4 py-1 rounded text-xs font-medium transition-colors ${
              file && !isLoading
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Scan Bill'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 