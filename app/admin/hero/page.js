"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function HeroBackgroundsPage() {
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Modal State
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_backgrounds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setBackgrounds(data);
    } catch (error) {
      console.error("Error fetching hero backgrounds:", error);
      toast.error("Failed to load hero backgrounds");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file) => {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const { error } = await supabase.storage.from('images').upload(`hero/${fileName}`, file);
    if (error) throw error;
    
    const { data } = supabase.storage.from('images').getPublicUrl(`hero/${fileName}`);
    return data.publicUrl;
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if the total backgrounds would exceed 8
    if (backgrounds.length + files.length > 8) {
        toast.error(`You can only have up to 8 hero backgrounds. You currently have ${backgrounds.length}.`);
        e.target.value = null;
        return;
    }

    try {
      setUploading(true);
      
      for (const file of files) {
        // Upload to storage
        const imageUrl = await uploadFile(file);
        
        // Save to Database
        const { error } = await supabase.from('hero_backgrounds').insert([{
          image_url: imageUrl,
        }]);

        if (error) throw error;
      }

      toast.success("Hero background(s) uploaded successfully!");
      fetchBackgrounds(); // Refresh the list
      
    } catch (error) {
      console.error("Error uploading hero background:", error);
      toast.error("Failed to upload background.");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = null;
    }
  };

  const handleDeleteClick = (id) => {
      setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      // Delete from Database
      const { error } = await supabase
        .from('hero_backgrounds')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast.success("Background deleted successfully");
      
      // Update local state
      setBackgrounds(prev => prev.filter(p => p.id !== deleteId));
      
    } catch (error) {
      console.error("Error deleting background:", error);
      toast.error("Failed to delete background");
    } finally {
        setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-space-grotesk mb-2">
            Hero Backgrounds <span className="text-neutral-400 text-lg ml-2">({backgrounds.length}/8)</span>
          </h1>
          <p className="text-neutral-500 font-spaceMono">Manage the images shown in the homepage hero carousel.</p>
        </div>
        
        <div>
            <label className={`px-6 py-3 rounded-xl font-bold font-space-grotesk transition-all shadow-lg cursor-pointer inline-block text-center ${
                backgrounds.length >= 8 || uploading 
                ? "bg-neutral-400 text-neutral-200 cursor-not-allowed shadow-none" 
                : "bg-black text-white hover:bg-neutral-800 hover:shadow-xl"
            }`}>
                {uploading ? "Uploading..." : "Upload New Background"}
                <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange} 
                    disabled={uploading || backgrounds.length >= 8}
                />
            </label>
        </div>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-neutral-100">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl aspect-video animate-shimmer bg-neutral-100" />
                ))}
            </div>
          ) : backgrounds.length === 0 ? (
            <p className="text-neutral-400 bg-neutral-50 p-8 rounded-xl border border-neutral-200 text-center font-spaceMono">
                No hero backgrounds found. Upload some impressive images!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {backgrounds.map((bg) => (
                    <div key={bg.id} className="group relative bg-black rounded-lg overflow-hidden border border-neutral-100 shadow-sm aspect-video">
                        <Image 
                            src={bg.image_url} 
                            alt="Hero Background" 
                            fill 
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105" 
                            unoptimized // To allow external Supabase URLs without strictly configuring all of them, although we have images.supabase.co configured
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                            <span className="text-white/70 text-xs font-spaceMono">
                                Added {new Date(bg.created_at).toLocaleDateString()}
                            </span>
                            <button 
                                onClick={() => handleDeleteClick(bg.id)}
                                className="bg-red-500/90 text-white px-3 py-1.5 rounded font-bold text-xs hover:bg-red-600 transition-colors font-spaceMono backdrop-blur-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          )}
      </div>

      <ConfirmationModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Background?"
        message="Are you sure you want to delete this hero background? It will no longer appear on the homepage."
        confirmText="Delete Background"
        isDanger={true}
      />
    </div>
  );
}
