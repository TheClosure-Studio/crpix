"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function ImagesPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Modal State
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const INITIAL_SIZE = 16;
      const LOAD_MORE_SIZE = 8;
      
      let from, to;
      if (page === 0) {
          from = 0;
          to = INITIAL_SIZE - 1;
      } else {
          from = INITIAL_SIZE + (page - 1) * LOAD_MORE_SIZE;
          to = from + LOAD_MORE_SIZE - 1;
      }

      const { data, count, error } = await supabase
        .from('projects')
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

          setProjects(prev => page === 0 ? data : [...prev, ...data]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
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
      // 1. Delete from Database
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast.success("Project deleted successfully");
      
      // 2. Remove from local state
      setProjects(prev => prev.filter(p => p.id !== deleteId));
      setTotalCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
        setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-space-grotesk mb-2">
            Media Library <span className="text-neutral-400 text-lg ml-2">({totalCount})</span>
          </h1>
          <p className="text-neutral-500 font-spaceMono">Manage and delete your uploaded projects.</p>
        </div>
      </div>

      {loading && projects.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-neutral-400 bg-neutral-50 p-8 rounded-xl border border-neutral-200 text-center">
            No projects found. Upload some work!
        </p>
      ) : (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                {projects.map((project) => (
                <div key={project.id} className="group bg-black rounded shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-all">
                    <div className="relative aspect-[3/4]">
                    <Image 
                        src={project.thumbnail_url} 
                        alt={project.title} 
                        fill 
                        className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                            onClick={() => handleDeleteClick(project.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-red-600 font-spaceMono "
                        >
                            Delete Project
                        </button>
                    </div>
                    </div>
                    <div className="p-4">
                    <h3 className="font-bold text-neutral-200 truncate font-space-grotesk text-md">{project.title}</h3>
                    <p className="text-xs text-neutral-500 font-spaceMono uppercase">{project.category}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-neutral-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span>{project.images ? project.images.length : 0} Images</span>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            {hasMore && (
               <div className="flex justify-center mt-8">
                  <button 
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={loading}
                    className="bg-black text-white px-6 py-2 font-space-grotesk rounded-lg font-bold hover:bg-neutral-800 transition-all disabled:opacity-50 text-sm"
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
        title="Delete Project?"
        message="Are you sure you want to delete this project? This cannot be undone."
        confirmText="Delete Project"
        isDanger={true}
      />
    </div>
  );
}
