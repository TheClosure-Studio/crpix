"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";



export default function Gallery() {
  const [activeTab, setActiveTab] = useState("Gallery"); // Gallery, Videos
  const [activeFilters, setActiveFilters] = useState(["All"]);
  const [tempFilters, setTempFilters] = useState(["All"]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Filter Modal
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Initial Data Fetch (Categories)
  useEffect(() => {
    const fetchCategories = async () => {
      const { data: catData } = await supabase.from('categories').select('name');
      if (catData) {
        setCategories(["All", ...catData.map(c => c.name)]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Items when Tab, Filter or Page changes
  useEffect(() => {
    fetchItems();
  }, [activeTab, activeFilters, page]);

  // Reset page and items when tab changes
  useEffect(() => {
      setPage(0);
      setItems([]);
      setHasMore(true);
      setActiveFilters(["All"]); 
  }, [activeTab]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      const isGallery = activeTab === "Gallery";
      const tableName = isGallery ? 'projects' : 'videos';
      
      // Pagination Config
      const INITIAL_SIZE = isGallery ? 16 : 8;
      const LOAD_MORE_SIZE = isGallery ? 8 : 4;
      
      // Calculate Range
      let from, to;
      if (page === 0) {
          from = 0;
          to = INITIAL_SIZE - 1;
      } else {
          from = INITIAL_SIZE + (page - 1) * LOAD_MORE_SIZE;
          to = from + LOAD_MORE_SIZE - 1;
      }
      
      let query = supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!activeFilters.includes("All")) {
        query = query.in('category', activeFilters);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      if (data) {
        // Determine expected size for this specific request
        const currentBatchSize = page === 0 ? INITIAL_SIZE : LOAD_MORE_SIZE;
        
        if (data.length < currentBatchSize) {
          setHasMore(false);
        } else {
            setHasMore(true);
        }

        // Check if we are resetting (page 0) or appending
        setItems(prev => page === 0 ? data : [...prev, ...data]);
      }
      
    } catch (error) {
      console.error("Error loading gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFilter = (category) => {
    setActiveFilters([category]);
    setPage(0); 
    setHasMore(true);
    setItems([]); 
  };

  const openFilterModal = () => {
      setTempFilters([...activeFilters]);
      setFilterOpen(true);
  };
  
  const toggleTempFilter = (category) => {
      if (category === "All") {
          setTempFilters(["All"]);
          return;
      }

      let newFilters = [...tempFilters];
      if (newFilters.includes("All")) {
          newFilters = [];
      }

      if (newFilters.includes(category)) {
          newFilters = newFilters.filter(c => c !== category);
      } else {
          newFilters.push(category);
      }

      if (newFilters.length === 0) newFilters = ["All"];
      setTempFilters(newFilters);
  };

  const applyFilters = () => {
      setActiveFilters(tempFilters);
      setPage(0);
      setHasMore(true);
      setItems([]);
      setFilterOpen(false);
  };

  const openItem = (item) => {
    setCurrentItem(item);
    setCurrentImageIndex(0); 
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; 
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentItem(null);
    document.body.style.overflow = "auto";
  };

  const nextSlide = (e) => {
    if(e) e.stopPropagation();
    if (!currentItem || activeTab === "Videos") return; // Videos don't have multiple slides yet
    setCurrentImageIndex((prev) => 
      prev === currentItem.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = (e) => {
    if(e) e.stopPropagation();
    if (!currentItem || activeTab === "Videos") return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? currentItem.images.length - 1 : prev - 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (activeTab === "Gallery") {
          if (e.key === "ArrowRight") nextSlide();
          if (e.key === "ArrowLeft") prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, currentItem, activeTab]);


  // Helper for Video Thumbnails
  const getVideoThumbnail = (link) => {
      if (!link) return null;
      const ytMatch = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^#&?]*)/);
      if (ytMatch && ytMatch[1]) {
          return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
      return null;
  };

  // Helper for Video Embed ID
  const getVideoEmbedId = (link) => {
      if (!link) return null;
      const ytMatch = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([^#&?]*)/);
      if (ytMatch && ytMatch[1]) return ytMatch[1];
      return null;
  };

  return (
    <section id="gallery" className="py-24 bg-white text-neutral-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8 font-space-grotesk">
          Explore Our {activeTab}
        </h2>

        {/* Media Type Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-200 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab("Gallery")}
              className={`px-8 py-2 rounded-md font-medium transition-all ${
                activeTab === "Gallery"
                  ? "bg-yellow-500 shadow-sm text-neutral-900"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab("Videos")}
              className={`px-8 py-2 rounded-md font-medium transition-all ${
                activeTab === "Videos"
                  ? "bg-yellow-500 shadow-sm text-neutral-900"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Videos
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            
            {/* Filter Button (Multi-Select) */}
            <button 
                onClick={openFilterModal}
                className="flex items-center gap-2 bg-white border border-neutral-200 px-6 py-2 rounded-full hover:shadow-md transition-all group flex-shrink-0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-neutral-500 group-hover:text-black transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
                <span className="font-bold text-neutral-900 text-sm">Filter</span>
                {activeFilters.length > 0 && !activeFilters.includes("All") && (
                    <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full">{activeFilters.length}</span>
                )}
            </button>

            {/* divider */}
            <div className="hidden md:block w-px h-8 bg-neutral-200" />

            {/* Quick Categories (Horizontal Scroll) */}
            {/* Quick Categories (Horizontal Scroll) */}
            <div className="relative flex-1 min-w-0 w-full overflow-hidden group">
                {/* Left Gradient/Shadow */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

                <div className="flex flex-nowrap items-center gap-3 w-full overflow-x-auto px-4 md:px-0 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleQuickFilter(category)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors flex-shrink-0 ${
                                activeFilters.includes(category) && activeFilters.length === 1
                                ? "bg-yellow-500 border-yellow-500 text-neutral-900 shadow-sm"
                                : "bg-[#FFF9E5] border-transparent text-neutral-700 hover:bg-yellow-100"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Right Gradient/Shadow */}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            </div>
        </div>

        {/* Filter Modal */}
        {filterOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setFilterOpen(false)}>
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold font-space-grotesk">Select Categories</h3>
                        <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => toggleTempFilter(category)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${
                                    tempFilters.includes(category)
                                    ? "bg-black border-black text-white shadow-lg"
                                    : "bg-white border-neutral-100 text-neutral-600 hover:border-neutral-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    
                    <div className="pt-6 border-t border-neutral-100 flex justify-between items-center">
                         <button 
                            onClick={() => setTempFilters(["All"])}
                            className="text-sm font-bold text-neutral-500 hover:text-black transition-colors"
                         >
                            Reset to All
                         </button>
                         <button
                            onClick={applyFilters}
                            className="bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                         >
                            Apply Filters ({tempFilters.includes("All") ? "All" : tempFilters.length})
                         </button>
                    </div>
                </div>
            </div>
        )}

        {/* Grid */}
        <div className={`grid gap-2 mb-12 ${
            activeTab === "Videos" 
            ? "grid-cols-1 md:grid-cols-2 " 
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        }`}>
          {loading && items.length === 0 ? (
              // Skeleton Loader
              Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`relative bg-gray-200 animate-pulse rounded-2xl ${
                        activeTab === "Videos" ? "aspect-video" : "aspect-[3/4]"
                    }`}
                  />
              ))
          ) : items.length === 0 ? (
             <p className="col-span-full text-center text-neutral-400 py-12">No {activeTab.toLowerCase()} found in this category.</p>
          ) : (
             items.map((item) => {
                const isVideo = activeTab === "Videos";
                const thumbnail = isVideo ? getVideoThumbnail(item.link) : item.thumbnail_url;
                const isInsta = isVideo && item.link && item.link.includes('instagram');

                return (
                    <div 
                    key={item.id} 
                    className={`relative group overflow-hidden bg-gray-100 cursor-pointer ${
                        activeTab === "Videos" ? "aspect-video" : "aspect-[3/4]"
                    }`}
                    onClick={() => openItem(item)}
                    >
                        {/* Image / Thumbnail */}
                        {thumbnail ? (
                             <Image
                                src={thumbnail} 
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            // Fallback for non-YT videos (Insta) or missing thumbs
                            <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-white flex-col gap-1">
                                <span className="text-4xl">{isInsta ? "📸" : "🎥"}</span>
                                <span className="text-xs font-bold uppercase">{isInsta ? "Instagram" : "Video"}</span>
                            </div>
                        )}
                    
                        {/* Hover Content */}
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hidden group-hover:block">
                            <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">{item.category}</p>
                            <h3 className="text-white text-md font-bold leading-tight mb-2 font-space-grotesk">{item.title}</h3>
                            
                            {!isVideo && (
                                <div className="flex items-center gap-2 text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                    <span>{item.images ? item.images.length : 0} Photos</span>
                                </div>
                            )}
                            
                            {isVideo && (
                                <div className="text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                    Click to Watch
                                </div>
                            )}
                        </div>
                    </div>
                );
             })
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
           <div className="flex justify-center mt-12">
              <button 
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
                className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-neutral-800 transition-all disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
           </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && currentItem && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white p-2 transition-colors z-[70]"
            onClick={closeLightbox}
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
             </svg>
          </button>

          {/* Main Content Area */}
          <div 
             className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12"
             onClick={(e) => e.stopPropagation()} 
          >
             {/* Content */}
             <div className="relative w-full max-w-5xl h-[70vh] md:h-[80vh] flex items-center justify-center">
                {activeTab === "Gallery" ? (
                    <Image 
                        src={currentItem.images[currentImageIndex]}
                        alt={`Slide ${currentImageIndex}`}
                        fill
                        className="object-contain"
                        quality={100}
                        priority
                    />
                ) : (
                    // Video Player
                    <div className="w-full h-full bg-black flex items-center justify-center">
                        {currentItem.link.includes('youtube') || currentItem.link.includes('youtu.be') ? (
                             <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${getVideoEmbedId(currentItem.link)}?autoplay=1`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full max-w-4xl max-h-[80vh]"
                            ></iframe>
                        ) : (
                            <div className="text-center">
                                <p className="text-white text-xl mb-4">External Video Link</p>
                                <a 
                                    href={currentItem.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform inline-block"
                                >
                                    Open in {currentItem.link.includes('instagram') ? 'Instagram' : 'New Tab'}
                                </a>
                            </div>
                        )}
                    </div>
                )}
             </div>
             
             {/* Footer / Controls (Only for Gallery) */}
             {activeTab === "Gallery" && (
                 <>
                    <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4">
                        <p className="text-neutral-900 font-space-grotesk font-medium text-sm bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white">
                        {currentItem.title} <span className="text-white/60 text-sm ml-2">({currentImageIndex + 1} / {currentItem.images.length})</span>
                        </p>
                        
                        <div className="flex gap-2 bg-black/50 p-2 rounded-xl backdrop-blur-sm overflow-x-auto max-w-[90vw]">
                        {currentItem.images.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                                    idx === currentImageIndex ? "border-yellow-500 opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                                }`}
                            >
                                <Image src={img} alt="thumb" fill className="object-cover" />
                            </button>
                        ))}
                        </div>
                    </div>

                    <button 
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all"
                        onClick={prevSlide}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    <button 
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full backdrop-blur-sm transition-all"
                        onClick={nextSlide}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                 </>
             )}
          </div>
        </div>
      )}
    </section>
  );
}
