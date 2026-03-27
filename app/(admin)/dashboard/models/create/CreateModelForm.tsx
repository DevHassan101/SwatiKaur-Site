'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
};

export default function CreateModelForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    model_name: '',
    model_age: '',
    model_location: '',
    model_desc: '',
  });
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('model_name', formData.model_name);
      formDataToSend.append('model_age', formData.model_age);
      formDataToSend.append('model_location', formData.model_location);
      formDataToSend.append('model_desc', formData.model_desc);
      if (image) formDataToSend.append('image', image);

      const response = await fetch('/api/models', { method: 'POST', body: formDataToSend });
      const data = await response.json();

      if (data.success) {
        router.push('/dashboard/models?msg=created');
      } else {
        setError(data.error || 'Failed to create model');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(157,0,255,0.03) 0%, rgba(196,0,0,0.03) 100%)', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 12px rgba(157,0,255,0.08)', maxWidth: '800px', margin: '0 auto', border: '1px solid rgba(157,0,255,0.1)' }}>

      {error && (
        <div style={{ marginBottom: '20px', padding: '14px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' }}>
          <span>✕</span> {error}
        </div>
      )}

      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(135deg, #9D00FF 0%, #c40000 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Create New Model
        </h1>
        <Link href="/dashboard/models" style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #9D00FF 0%, #7a00cc 100%)', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
          Back to Models
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Model Name</label>
          <input type="text" value={formData.model_name} onChange={(e) => setFormData({ ...formData, model_name: e.target.value })} required style={{ width: '100%', padding: '10px', border: '2px solid rgba(157,0,255,0.2)', borderRadius: '6px', fontSize: '16px', color: 'black', backgroundColor: 'white' }} placeholder="Enter model name" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Age</label>
          <input type="number" value={formData.model_age} onChange={(e) => setFormData({ ...formData, model_age: e.target.value })} required min="0" style={{ width: '100%', padding: '10px', border: '2px solid rgba(157,0,255,0.2)', borderRadius: '6px', fontSize: '16px', color: 'black', backgroundColor: 'white' }} placeholder="Enter age" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Location</label>
          <input type="text" value={formData.model_location} onChange={(e) => setFormData({ ...formData, model_location: e.target.value })} required style={{ width: '100%', padding: '10px', border: '2px solid rgba(157,0,255,0.2)', borderRadius: '6px', fontSize: '16px', color: 'black', backgroundColor: 'white' }} placeholder="Enter location" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Model Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} style={{ width: '100%', padding: '10px', border: '2px solid rgba(157,0,255,0.2)', borderRadius: '6px', fontSize: '14px', color: 'black', backgroundColor: 'white' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '10px', color: '#374151' }}>Model Description</label>
          <div style={{ borderRadius: '6px', backgroundColor: 'white', marginBottom: '50px', border: '2px solid rgba(157,0,255,0.2)', overflow: 'hidden' }}>
            <ReactQuill theme="snow" value={formData.model_desc} onChange={(value) => setFormData({ ...formData, model_desc: value })} modules={modules} placeholder="Enter model description..." style={{ height: '330px', fontSize: '16px', color: 'black' }} />
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #9D00FF 0%, #c40000 100%)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 12px rgba(157,0,255,0.3)' }}>
          {loading ? 'Creating...' : 'Create Model'}
        </button>
      </form>
    </div>
  );
}
