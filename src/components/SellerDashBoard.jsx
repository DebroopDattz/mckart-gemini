import { useState } from "react";
import config from "../config";
import { Upload, Plus } from 'lucide-react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

export default function SellerDashBoard({ user }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && value !== "" && Number(value) < 0) return;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (file) => {
    if (!file) return;
    setForm({ ...form, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return alert("Please upload an image");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("image", form.image);
    formData.append("sellerId", user?.uid || "unknown");
    formData.append("sellerName", user?.name || "Unknown Seller");

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/items/create`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Item rejected by AI checks");

      alert("Item posted successfully");
      setForm({
        name: "",
        price: "",
        category: "",
        description: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      alert("Server error while submitting item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-blue-400 bg-clip-text text-transparent">Seller Dashboard</h2>
        <p className="text-gray-400">List new items for sale</p>
      </div>

      <Card className="bg-white/5 border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Item Name"
              name="name"
              placeholder="e.g. Engineering Graphics Kit"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              type="number"
              label="Price (₹)"
              name="price"
              min="0"
              placeholder="0.00"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-300 font-medium ml-1">Category</label>
            <select
              name="category"
              className="glass-input appearance-none"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="" className="bg-slate-800">Select Category</option>
              <option value="stationary" className="bg-slate-800">Stationary</option>
              <option value="book" className="bg-slate-800">Book</option>
              <option value="notebook" className="bg-slate-800">Notebook</option>
              <option value="electronics" className="bg-slate-800">Electronics</option>
              <option value="sports" className="bg-slate-800">Sports</option>
              <option value="others" className="bg-slate-800">Others</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-300 font-medium ml-1">Description</label>
            <textarea
              name="description"
              placeholder="Describe condition, age, features..."
              className="glass-input h-32 resize-none"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-300 font-medium ml-1">Product Image</label>
            <div
              className="border-2 border-dashed border-white/20 rounded-xl p-8 transition-colors hover:bg-white/5 hover:border-blue-500/50 cursor-pointer flex flex-col items-center justify-center gap-2"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleImage(e.dataTransfer.files[0]);
              }}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageUpload"
                onChange={(e) => handleImage(e.target.files[0])}
              />
              <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2">
                  <Upload size={24} />
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {form.image ? form.image.name : "Click to upload or drag and drop"}
                </span>
                <span className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 50MB)</span>
              </label>
            </div>
          </div>

          <Button type="submit" variant="success" className="w-full" isLoading={loading}>
            <Plus size={20} />
            List Item for Sale
          </Button>
        </form>
      </Card>
    </div>
  );
}
