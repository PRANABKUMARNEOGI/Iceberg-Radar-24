import React, { useState } from 'react';
import { Camera, ImagePlus, Leaf, Sparkles } from 'lucide-react';

const FloraFaunaCard = ({ item }) => {
  const [photos, setPhotos] = useState(item.initialPhotos || []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhotos((prev) => [imageUrl, ...prev]);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 shadow-xl hover:border-cyan-500/40 transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-100">{item.name}</h3>
        </div>
        <span className="text-xs uppercase px-2 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
          {item.category}
        </span>
      </div>

      <p className="text-sm text-slate-400 mb-4">{item.description}</p>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {photos.map((src, idx) => (
          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
            <img src={src} alt={`${item.name} user upload ${idx}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Upload Action */}
      <label className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 text-sm font-medium cursor-pointer transition">
        <ImagePlus className="w-4 h-4" />
        <span>Add Photo</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </label>
    </div>
  );
};

export default FloraFaunaCard;