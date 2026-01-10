"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function UploadVideoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const [platform, setPlatform] = useState(null); // 'youtube' or 'instagram'

  const router = useRouter();

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  // Handle Link Changes & Preview
  useEffect(() => {
    if (!link) {
        setPreviewId(null);
        setPlatform(null);
        return;
    }

    // YouTube Parser
    const ytMatch = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^#&?]*)/);
    if (ytMatch && ytMatch[1]) {
        setPlatform('youtube');
        setPreviewId(ytMatch[1]);
        return;
    }

    // Instagram Parser (Basic)
    if (link.includes("instagram.com/reel/") || link.includes("instagram.com/p/")) {
        setPlatform('instagram');
        setPreviewId(link); // Instagram embeds use the full URL normally or need specific handling
        return;
    }

    setPlatform('unknown');
    setPreviewId(null);

  }, [link]);

  const handlePublish = async () => {
    if (!title || !category || !link) {
      toast.error("Please fill all required fields (Title, Category, Link)");
      return;
    }

    if (platform === 'unknown') {
        toast.error("Please provide a valid YouTube or Instagram link.");
        return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from('videos').insert([{
        title,
        description,
        category,
        link
      }]);

      if (error) throw error;

      toast.success("Video published successfully!");
      
      // Reset
      setTitle("");
      setDescription("");
      setCategory("");
      setLink("");
      
    } catch (error) {
      console.error("Error publishing video:", error);
      toast.error("Failed to publish video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-space-grotesk mb-2">Upload Video</h1>
        <p className="text-neutral-500 font-spaceMono text-sm">Add YouTube or Instagram videos to your portfolio.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Col: Form */}
            <div className="space-y-6 font-spaceMono text-sm ">
                <div>
                   <label className="block text-sm font-bold text-neutral-900 mb-2 font-space-grotesk">Video Title</label>
                   <input 
                     type="text" 
                     className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-black outline-none transition-all"
                     placeholder="e.g. Cinematic Wedding Highlights"
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
                   <label className="block text-sm font-bold text-neutral-900 mb-2 font-space-grotesk">Video Link</label>
                   <input 
                     type="text" 
                     className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-black outline-none transition-all"
                     placeholder="https://youtube.com/watch?v=..."
                     value={link}
                     onChange={(e) => setLink(e.target.value)}
                   />
                   <p className="text-xs text-neutral-400 mt-2">Supports YouTube and Instagram Reals/Posts.</p>
                </div>

                <div>
                   <label className="block text-sm font-bold text-neutral-900 mb-2 font-space-grotesk">Description</label>
                   <textarea 
                     className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:border-black focus:ring-black outline-none transition-all h-32 resize-none"
                     placeholder="Description of the video..."
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                   />
                </div>
            </div>

            {/* Right Col: Preview */}
            <div>
               <label className="block text-sm font-bold text-neutral-900 mb-2 font-space-grotesk">
                  Preview
               </label>
               
               <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden flex items-center justify-center border border-neutral-200">
                  {platform === 'youtube' && previewId ? (
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${previewId}`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                  ) : platform === 'instagram' ? (
                      <div className="text-center p-8">
                          <p className="font-bold text-neutral-900">Instagram Video</p>
                          <p className="text-sm text-neutral-500 mt-2">Preview not available for Instagram links yet (Requires API), but link is valid.</p>
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-sm mt-2 block">Open Link</a>
                      </div>
                  ) : (
                      <div className="text-neutral-400 text-sm flex flex-col items-center font-spaceMono text-sm">
                          
                          Enter a valid link to see preview
                      </div>
                  )}
               </div>
               
               {platform && platform !== 'unknown' && (
                   <span className="inline-block mt-4 px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                       Detected: {platform}
                   </span>
               )}
               {platform === 'unknown' && link && (
                   <span className="inline-block mt-4 px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                       Invalid / Unsupported Link
                   </span>
               )}
            </div>

        </div>

        <div className="mt-8 flex justify-end">
           <button 
             onClick={handlePublish}
             disabled={loading}
             className="bg-black text-white px-8 py-3 rounded-xl font-bold font-space-grotesk hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {loading ? "Publishing..." : "Publish Video"}
           </button>
        </div>
      </div>
    </div>
  );
}
