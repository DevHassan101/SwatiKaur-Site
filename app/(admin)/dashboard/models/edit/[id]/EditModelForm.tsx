'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EditModelForm() {
  const router = useRouter();
  const params = useParams();
  const modelId = params.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    model_name: '',
    model_age: '',
    model_location: '',
    model_desc: '',
  });
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  // Quill toolbar configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  useEffect(() => {
    fetchModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchModel = async () => {
    try {
      const response = await fetch(`/api/models/${modelId}`);
      const data = await response.json();

      if (data.success) {
        setFormData({
          model_name: data.model.model_name,
          model_age: data.model.model_age.toString(),
          model_location: data.model.model_location,
          model_desc: data.model.model_desc,
        });
        setCurrentImage(data.model.model_image);
      } else {
        router.push('/dashboard/models');
      }
    } catch (error) {
      console.error('Error fetching model:', error);
      router.push('/dashboard/models');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('model_name', formData.model_name);
      formDataToSend.append('model_age', formData.model_age);
      formDataToSend.append('model_location', formData.model_location);
      formDataToSend.append('model_desc', formData.model_desc);
      if (newImage) {
        formDataToSend.append('image', newImage);
      }

      const response = await fetch(`/api/models/${modelId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard/models?msg=updated');
      } else {
        setError(data.error || 'Failed to update model');
        setUpdating(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong. Please try again.');
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(157, 0, 255, 0.03) 0%, rgba(196, 0, 0, 0.03) 100%)',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(157, 0, 255, 0.08)',
        textAlign: 'center',
        border: '1px solid rgba(157, 0, 255, 0.1)'
      }}>
        <p style={{
          background: 'linear-gradient(135deg, #9D00FF 0%, #c40000 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Loading model...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(157, 0, 255, 0.03) 0%, rgba(196, 0, 0, 0.03) 100%)',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(157, 0, 255, 0.08)',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid rgba(157, 0, 255, 0.1)'
    }}>
      {error && (
        <div style={{ marginBottom: '20px', padding: '14px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' }}>
          <span>✕</span> {error}
        </div>
      )}

      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #9D00FF 0%, #c40000 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Edit Model
        </h1>
        <Link href="/dashboard/models" style={{
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #9D00FF 0%, #7a00cc 100%)',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(157, 0, 255, 0.2)',
          transition: 'all 0.2s'
        }}>
          View Models
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Model Name
          </label>
          <input
            type="text"
            value={formData.model_name}
            onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid rgba(157, 0, 255, 0.2)',
              borderRadius: '6px',
              fontSize: '16px',
              color: 'black',
              backgroundColor: 'white',
              transition: 'border-color 0.2s'
            }}
            placeholder="Enter model name"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Age
          </label>
          <input
            type="number"
            value={formData.model_age}
            onChange={(e) => setFormData({ ...formData, model_age: e.target.value })}
            required
            min="0"
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid rgba(157, 0, 255, 0.2)',
              borderRadius: '6px',
              fontSize: '16px',
              color: 'black',
              backgroundColor: 'white',
              transition: 'border-color 0.2s'
            }}
            placeholder="Enter age"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Location
          </label>
          <input
            type="text"
            value={formData.model_location}
            onChange={(e) => setFormData({ ...formData, model_location: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid rgba(157, 0, 255, 0.2)',
              borderRadius: '6px',
              fontSize: '16px',
              color: 'black',
              backgroundColor: 'white',
              transition: 'border-color 0.2s'
            }}
            placeholder="Enter location"
          />
        </div>


        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Model Image
          </label>

          {currentImage && !newImage && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '14px', marginBottom: '8px', color: '#6b7280' }}>Current Image:</p>
              <Image
                src={currentImage}
                alt="Current model image"
                width={200}
                height={200}
                style={{
                  borderRadius: '8px',
                  objectFit: 'cover',
                  border: '2px solid rgba(157, 0, 255, 0.2)'
                }}
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files?.[0] || null)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid rgba(157, 0, 255, 0.2)',
              borderRadius: '6px',
              fontSize: '14px',
              color: 'black',
              backgroundColor: 'white',
              transition: 'border-color 0.2s'
            }}
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Leave empty to keep current image
          </p>
        </div>

                  <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px',
            }}>
              Model Description
            </label>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '6px',
              marginBottom: '50px',
              border: '2px solid rgba(157, 0, 255, 0.2)',
              overflow: 'hidden'
            }}>
              <ReactQuill
                theme="snow"
                value={formData.model_desc}
                onChange={(value) => setFormData({ ...formData, model_desc: value })}
                modules={modules}
                placeholder="Enter model description..."
                style={{
                  height: '330px',
                }}
              />
            </div>
          </div>

        <button
          type="submit"
          disabled={updating}
          style={{
            width: '100%',
            padding: '12px',
            background: updating ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 'linear-gradient(135deg, #9D00FF 0%, #c40000 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: updating ? 'not-allowed' : 'pointer',
            boxShadow: updating ? 'none' : '0 4px 12px rgba(157, 0, 255, 0.3)',
            transition: 'all 0.2s'
          }}
        >
          {updating ? 'Updating...' : 'Update Model'}
        </button>
      </form>
    </div>
  );
}