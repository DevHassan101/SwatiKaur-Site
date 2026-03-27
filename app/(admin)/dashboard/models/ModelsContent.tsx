'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import { Trash, SquarePen } from 'lucide-react';

interface Model {
  id: number;
  model_name: string;
  model_age: number;
  model_location: string;
  model_desc: string;
  model_image: string | null;
  createdAt: string;
  updatedAt: string;
}

const MSG_MAP: Record<string, string> = {
  created: 'Model created successfully!',
  updated: 'Model updated successfully!',
  deleted: 'Model deleted successfully!',
};

export default function ModelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const msg = searchParams.get('msg');
    if (msg && MSG_MAP[msg]) {
      setToast({ type: 'success', message: MSG_MAP[msg] });
      // Clean URL without re-rendering
      router.replace('/dashboard/models', { scroll: false });
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models');
      const data = await response.json();
      if (data.success) setModels(data.models);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this model?')) return;
    try {
      const response = await fetch(`/api/models/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setToast({ type: 'success', message: MSG_MAP.deleted });
        setTimeout(() => setToast(null), 4000);
        fetchModels();
      } else {
        setToast({ type: 'error', message: data.error || 'Failed to delete model' });
        setTimeout(() => setToast(null), 4000);
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to delete model' });
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, rgba(157,0,255,0.03) 0%, rgba(196,0,0,0.03) 100%)', borderRadius: '12px', padding: '32px', textAlign: 'center', border: '1px solid rgba(157,0,255,0.1)' }}>
        <p style={{ background: 'linear-gradient(135deg, #9D00FF 0%, #c40000 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '18px', fontWeight: '600' }}>
          Loading models...
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(157,0,255,0.03) 0%, rgba(196,0,0,0.03) 100%)', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 12px rgba(157,0,255,0.08)', border: '1px solid rgba(157,0,255,0.1)' }}>

      {/* Toast */}
      {toast && (
        <div style={{ marginBottom: '20px', padding: '14px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${toast.type === 'success' ? '#86efac' : '#fca5a5'}`, color: toast.type === 'success' ? '#166534' : '#991b1b' }}>
          <span style={{ fontSize: '18px' }}>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', background: 'linear-gradient(135deg, #9D00FF 0%, #c40000 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Models
        </h1>
        <Link href="/dashboard/models/create" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #9D00FF 0%, #c40000 100%)', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: '500', boxShadow: '0 2px 8px rgba(157,0,255,0.3)' }}>
          + Create Model
        </Link>
      </div>

      {models.length === 0 ? (
        <p style={{ fontSize: '16px', color: '#6b7280', textAlign: 'center', padding: '40px' }}>
          No models found. Create your first model!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, rgba(157,0,255,0.1) 0%, rgba(196,0,0,0.1) 100%)', borderBottom: '2px solid rgba(157,0,255,0.2)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Id</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Image</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Age</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1f2937' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id} style={{ borderBottom: '1px solid rgba(157,0,255,0.1)' }}>
                  <td style={{ padding: '12px', fontWeight: '500', color: '#1f2937' }}>{model.id}</td>
                  <td style={{ padding: '12px' }}>
                    {model.model_image ? (
                      <Image src={model.model_image} alt={model.model_name} width={60} height={60} style={{ borderRadius: '6px', objectFit: 'cover', border: '2px solid rgba(157,0,255,0.2)' }} />
                    ) : (
                      <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, rgba(157,0,255,0.1) 0%, rgba(196,0,0,0.1) 100%)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#6b7280', border: '2px solid rgba(157,0,255,0.2)' }}>
                        No Image
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500', color: '#1f2937' }}>{model.model_name}</td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{model.model_age}</td>
                  <td style={{ padding: '12px', color: '#6b7280' }}>{model.model_location}</td>
                  <td style={{ padding: '12px', maxWidth: '300px', color: '#374151' }}>
                    <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(model.model_desc, { FORBID_ATTR: ['style'] }) }} />
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Link href={`/dashboard/models/edit/${model.id}`} style={{ padding: '6px 12px', background: 'linear-gradient(135deg, #9D00FF 0%, #7a00cc 100%)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>
                        <SquarePen />
                      </Link>
                      <button onClick={() => handleDelete(model.id)} style={{ padding: '6px 12px', background: 'linear-gradient(135deg, #c40000 0%, #ff3333 100%)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
