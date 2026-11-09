import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, Search, Sparkles, Image as ImageIcon } from 'lucide-react';
import { adminService, categoryService } from '../../services/api';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    price: '',
    compareAtPrice: '',
    stock: 50,
    shortDescription: '',
    fullDescription: '',
    ingredients: '',
    directions: '',
    safetyInfo: '',
    isFeatured: false,
    isBestseller: false,
    isEmergencyKit: false,
    imageUrl: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminService.getProducts(),
        categoryService.getCategories(),
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (e) {
      console.warn('Failed to load products/categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `PR-NEW-${Math.floor(100 + Math.random() * 900)}`,
      categoryId: categories[0]?.id || '',
      price: '',
      compareAtPrice: '',
      stock: 50,
      shortDescription: '',
      fullDescription: '',
      ingredients: '',
      directions: '',
      safetyInfo: '',
      isFeatured: false,
      isBestseller: false,
      isEmergencyKit: false,
      imageUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      categoryId: p.categoryId,
      price: p.price,
      compareAtPrice: p.compareAtPrice || '',
      stock: p.stock,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      ingredients: p.ingredients || '',
      directions: p.directions || '',
      safetyInfo: p.safetyInfo || '',
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      isEmergencyKit: p.isEmergencyKit,
      imageUrl: p.images?.[0]?.url || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        stock: parseInt(formData.stock, 10),
        images: formData.imageUrl ? [{ url: formData.imageUrl, altText: formData.name }] : [],
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, payload);
      } else {
        await adminService.createProduct(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save product.');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-200 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-sage-600 font-semibold block mb-1">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl font-semibold text-charcoal-900 tracking-tight">
            Product Formulations ({products.length})
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-ivory-50 border border-ivory-300 rounded pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-sage-600 w-52 sm:w-64"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-charcoal-800 hover:bg-charcoal-900 text-ivory-50 text-xs font-semibold px-4 py-2 rounded flex items-center space-x-1.5 shadow-sm uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Formulation</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-ivory-50 border border-ivory-300 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 text-charcoal-600 uppercase tracking-wider font-semibold text-[10px] border-b border-ivory-200">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredProducts.map((p) => {
                const img = p.images?.[0]?.url || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=100&q=80';
                return (
                  <tr key={p.id} className="hover:bg-ivory-100/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img src={img} alt="" className="w-10 h-10 object-cover rounded border border-ivory-200 shrink-0" />
                        <div>
                          <p className="font-semibold text-charcoal-900">{p.name}</p>
                          <p className="text-[10px] text-charcoal-400 line-clamp-1">{p.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-charcoal-600">{p.sku}</td>
                    <td className="py-3 px-4 text-charcoal-700">{p.category?.name}</td>
                    <td className="py-3 px-4 font-semibold text-charcoal-900">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          p.stock <= 20 ? 'bg-red-100 text-red-800' : 'bg-sage-100 text-sage-800'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isEmergencyKit && (
                          <span className="bg-sage-700 text-ivory-50 text-[9px] px-1.5 py-0.5 rounded">Emergency</span>
                        )}
                        {p.isBestseller && (
                          <span className="bg-gold-200 text-gold-900 text-[9px] px-1.5 py-0.5 rounded">Bestseller</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1 text-charcoal-600 hover:text-charcoal-950"
                        title="Edit Formulation"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Delete Formulation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal-900/60" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-ivory-50 border border-ivory-300 w-full max-w-2xl rounded-2xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
              {editingProduct ? 'Edit Product Formulation' : 'Add New Product Formulation'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price (INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Compare Price (INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Description &amp; Ritual Narrative</label>
                <textarea
                  rows={3}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Ingredients or Materials</label>
                <textarea
                  rows={2}
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Safety Precautions &amp; Veterinary Notes</label>
                <textarea
                  rows={2}
                  value={formData.safetyInfo}
                  onChange={(e) => setFormData({ ...formData, safetyInfo: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Featured Collection</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                  />
                  <span>Bestseller</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isEmergencyKit}
                    onChange={(e) => setFormData({ ...formData, isEmergencyKit: e.target.checked })}
                  />
                  <span>Canine Emergency Kit</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-charcoal-800 text-ivory-50 rounded font-semibold uppercase tracking-wider"
                >
                  Save Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
