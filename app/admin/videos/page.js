"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function ManageVideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Modal State
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      const INITIAL_SIZE = 8;
      const LOAD_MORE_SIZE = 4;
      
      let from, to;
      if (page === 0) {
          from = 0;
          to = INITIAL_SIZE - 1;
      } else {
          from = INITIAL_SIZE + (page - 1) * LOAD_MORE_SIZE;
          to = from + LOAD_MORE_SIZE - 1;
      }

      const { data, count, error } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      if (count !== null) setTotalCount(count);
      
      if (data) {
          const currentBatchSize = page === 0 ? INITIAL_SIZE : LOAD_MORE_SIZE;

          if (data.length < currentBatchSize) {
              setHasMore(false);
          } else {
              setHasMore(true);
          }

          setVideos(prev => page === 0 ? data : [...prev, ...data]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
      setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast.success("Video deleted successfully");
      setVideos(prev => prev.filter(v => v.id !== deleteId));
      setTotalCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
        setDeleteId(null);
    }
  };

  const getVideoThumbnail = (link) => {
      // Basic logic to get YT thumbnail
      if (!link) return null;
      const ytMatch = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^#&?]*)/);
      if (ytMatch && ytMatch[1]) {
          return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
      return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-space-grotesk mb-2">
            Manage Videos <span className="text-neutral-400 text-lg ml-2">({totalCount})</span>
          </h1>
          <p className="text-neutral-500 font-spaceMono text-sm">Edit or delete your video portfolio.</p>
        </div>
      </div>

      {loading && videos.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-video animate-pulse" />
            ))}
        </div>
      ) : videos.length === 0 ? (
        <p className="text-neutral-400 font-spaceMono bg-neutral-50 p-8 rounded-xl border border-neutral-200 text-center">
            No videos found. Go to Upload Video to add one!
        </p>
      ) : (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                {videos.map((video) => {
                    const thumbnail = getVideoThumbnail(video.link);
                    const isInsta = video.link && video.link.includes('instagram');

                    return (
                        <div key={video.id} className="group bg-black rounded shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-all">
                            <div className="relative aspect-video bg-black">
                                {thumbnail ? (
                                    <img src={thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80" />
                                ) : (
                                    <div className="w-full h-full flex items-center font-spaceMono justify-center text-white bg-gradient-to-br from-purple-600 to-orange-500">
                                        {isInsta ? "Instagram" : "Video"}
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 font-spaceMono ">
                                    <a href={video.link} target="_blank" className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                                        View
                                    </a>
                                    <button 
                                        onClick={() => handleDeleteClick(video.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-neutral-200 font-spaceMono truncate">{video.title}</h3>
                                <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-neutral-500 font-spaceMono uppercase">{video.category}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold  ${isInsta ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'}`}>
                                        {isInsta ? 'Instagram' : 'YouTube'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {hasMore && (
               <div className="flex justify-center mt-8">
                  <button 
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={loading}
                    className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-neutral-800 transition-all disabled:opacity-50 text-sm"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
               </div>
            )}
        </>
      )}

      <ConfirmationModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Video?"
        message="Are you sure you want to delete this video? This cannot be undone."
        confirmText="Delete Video"
        isDanger={true}
      />
    </div>
  );
}
