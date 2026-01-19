"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const uploadFile = async (file) => {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file);
    if (error) throw error;
    
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handlePublish = async () => {
    if (!title || !category || images.length === 0) {
      toast.error("Please fill all required fields (Title, Category, Images)");
      return;
    }

    try {
      setUploading(true);

      // 1. Upload All Project Images
      const projectImageUrls = await Promise.all(
        images.map(img => uploadFile(img.file))
      );

      // 2. Use the first image as the thumbnail
      const thumbnailUrl = projectImageUrls[0];

      // 3. Save to Database
      const { error } = await supabase.from('projects').insert([{
        title,
        description,
        category,
        thumbnail_url: thumbnailUrl,
        images: projectImageUrls
      }]);

      if (error) throw error;

      toast.success("Project published successfully!");
      // Reset Form
      setTitle("");
      setDescription("");
      setCategory("");
      setImages([]);
      
    } catch (error) {
      console.error("Error publishing project:", error);
      toast.error("Failed to publish project. Check console.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Limit to 4 images total
    if (images.length + files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }
    
    // Create preview URLs
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-space-grotesk mb-2">Upload New Work</h1>
        <p className="text-neutral-500 font-spaceMono text-xs md:text-sm">Share your latest masterpieces with the world.</p>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Col: Details */}
            <div className="space-y-6 font-spaceMono text-sm">
                <div>
                   <label className="block text-sm font-bold text-neutral-900 mb-2 font-space-grotesk">Project Title</label>
                   <input 
                     type="text" 
                     className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-black outline-none transition-all"
                     placeholder="e.g. Traditional Wedding in Tirupati"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                   />
                </div>

                <div>
                   <label className="block text-sm font-bold text-neutral-900 mb-2 font-space-grotesk">Category</label>
                   <select 
                     className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-black outline-none transition-all appearance-none"
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                   >
                     <option value="">Select a Category...</option>
                     {categories.map((cat) => (
                       <option key={cat.id} value={cat.name}>{cat.name}</option>
                     ))}
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-bold text-neutral-900 mb-2 font-space-grotesk">Description</label>
                   <textarea 
                     className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-black outline-none transition-all h-32 resize-none"
                     placeholder="Tell the story behind these photos..."
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                   />
                </div>
            </div>

            {/* Right Col: Image Upload */}
            <div>
               <label className="block text-sm font-bold text-neutral-900 mb-2 font-space-grotesk">
                  Upload Images <span className="text-neutral-400 font-normal ml-2">({images.length}/4)</span>
               </label>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                       <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                       <button 
                         onClick={() => removeImage(idx)}
                         className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                         </svg>
                       </button>
                    </div>
                  ))}

                  {images.length < 4 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 hover:border-black hover:bg-neutral-50 transition-all flex flex-col items-center justify-center cursor-pointer text-neutral-400 hover:text-black">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                       </svg>
                       <span className="text-xs font-bold">Add Photo</span>
                       <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
               </div>
               <p className="text-xs text-neutral-400 font-spaceMono">Supported formats: JPG, PNG, WEBP. Max size 5MB per file.</p>
            </div>

        </div>

        <div className="mt-8 flex justify-end">
           <button 
             onClick={handlePublish}
             disabled={uploading}
             className="bg-black text-white px-8 py-3 rounded-xl font-bold font-space-grotesk hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {uploading ? "Publishing..." : "Publish Project"}
           </button>
        </div>
      </div>
    </div>
  );
}
