"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Modal State
  const [deleteId, setDeleteId] = useState(null);

  // Fetch Categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;

    try {
      setIsCreating(true);
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCat }])
        .select();

      if (error) throw error;
      
      setCategories([data[0], ...categories]);
      setNewCat("");
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Name might be duplicate.");
    } finally {
        setIsCreating(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      setCategories(categories.filter(c => c.id !== deleteId));
      toast.success("Category deleted");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
        setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-space-grotesk mb-2 ">Categories</h1>
        <p className="text-neutral-500 font-spaceMono text-xs md:text-sm">Organize your portfolio structure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create New Category */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="font-bold text-lg mb-4 font-space-grotesk">Add New Category</h3>
            <form onSubmit={addCategory} className="space-y-4">
              <input 
                type="text" 
                placeholder="Category Name" 
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border font-spaceMono text-sm border-neutral-200 focus:border-black outline-none disabled:opacity-50 disabled:bg-neutral-100"
                value={newCat}
                disabled={isCreating}
                onChange={(e) => setNewCat(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isCreating || !newCat.trim()}
                className="w-full bg-black text-white font-space-grotesk py-3 rounded-xl font-bold text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Category"}
              </button>
            </form>
          </div>
        </div>

        {/* List Categories */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-neutral-50 border-b border-neutral-100">
                 <tr>
                   <th className="px-6 py-2 font-bold text-xs md:text-sm text-neutral-500 font-spaceMono">Name</th>
                   <th className="px-6 py-2 font-bold text-xs md:text-sm text-neutral-500 font-spaceMono text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-neutral-100 ">
                 {loading ? (
                   <tr><td colSpan="2" className="p-8 text-center">Loading...</td></tr>
                 ) : categories.map((cat) => (
                   <tr key={cat.id} className="hover:bg-neutral-50/50 text-sm md:text-base">
                     <td className="px-6 py-4 font-bold font-space-grotesk">{cat.name}</td>
                     <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => handleDeleteClick(cat.id)}
                         className="text-red-500 hover:text-red-700 text-sm font-bold px-3 py-1 rounded-lg hover:bg-red-50 transition-colors font-spaceMono"
                       >
                         Delete
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             {categories.length === 0 && (
                <div className="p-8 text-center text-neutral-400">No categories found.</div>
             )}
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Category?"
        message="Are you sure you want to delete this category? This cannot be undone."
        confirmText="Delete Category"
        isDanger={true}
      />
    </div>
  );
}
