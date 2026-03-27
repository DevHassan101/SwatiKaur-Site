'use server';

import prisma from '../lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Create-Blog
export async function createBlog(formData: FormData) {
  const blog_name = formData.get('blog_name') as string;
  const blog_desc = formData.get('blog_desc') as string;
  const imageFile = formData.get('blog_image') as File | null;
  const blog_date = formData.get('blog_date') as string;

  if (!blog_name || !blog_desc || !blog_date) {
    return { error: 'All fields are required' };
  }

  let blog_image: string | null = null;

  try {
    // Upload image if provided
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);

      const uploadResponse = await fetch('${process.env.NEXT_PUBLIC_SITE_URL}/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      blog_image = uploadResult.imageUrl;
    }

    // Create blog in database
    await prisma.blog.create({
      data: {
        blog_name,
        blog_desc,
        blog_image: blog_image,
        blog_date: blog_date ? new Date(blog_date) : new Date(),
      },
    });

    revalidatePath('/dashboard/blogs');
    revalidatePath('/dashboard/blogs/view');
  } catch (error) {
    console.error('Error creating blog:', error);
    return {
      error: 'Failed to create blog: ' + (error instanceof Error ? error.message : 'Unknown error'),
    };
  }

  redirect('/dashboard/blogs/view');
}

// Update-Blog
export async function updateBlog(id: number, formData: FormData) {
  const blog_name = formData.get('blog_name') as string;
  const blog_desc = formData.get('blog_desc') as string;
  const imageFile = formData.get('blog_image') as File | null;
  const blog_date = formData.get('blog_date') as string;
  const keepOldImage = formData.get('keepOldImage') as string;

  if (!blog_name || !blog_desc) {
    return { error: 'Name and description are required' };
  }

  try {
    // Get existing blog
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return { error: 'Blog not found' };
    }

    let blog_image: string | null = existingBlog?.blog_image || null;

    // Handle image update
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      // Delete old image
      if (existingBlog?.blog_image) {
        try {
          await fetch('${process.env.NEXT_PUBLIC_SITE_URL}/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: existingBlog.blog_image }),
          });
        } catch (error) {
          console.warn('Failed to delete old image:', error);
        }
      }

      // Upload new image
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);

      const uploadResponse = await fetch('${process.env.NEXT_PUBLIC_SITE_URL}/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      blog_image = uploadResult.imageUrl;
    } else if (keepOldImage === 'false') {
      // Remove image
      if (existingBlog?.blog_image) {
        try {
          await fetch('${process.env.NEXT_PUBLIC_SITE_URL}/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: existingBlog.blog_image }),
          });
        } catch (error) {
          console.warn('Failed to delete image:', error);
        }
      }
      blog_image = null;
    }

    // Update blog in database
    await prisma.blog.update({
      where: { id },
      data: {
        blog_name,
        blog_desc,
        blog_image: blog_image,
        blog_date: blog_date ? new Date(blog_date) : undefined,
      },
    });

    revalidatePath('/dashboard/blogs');
    revalidatePath('/dashboard/blogs/view');
  } catch (error) {
    console.error('Error updating blog:', error);
    return {
      error: 'Failed to update blog: ' + (error instanceof Error ? error.message : 'Unknown error'),
    };
  }

  redirect('/dashboard/blogs/view');
}

// Delete-Blog
export async function deleteBlog(id: number) {
  try {
    // Get blog to delete image
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    // Delete image from filesystem
    if (blog?.blog_image) {
      try {
        await fetch('${process.env.NEXT_PUBLIC_SITE_URL}/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: blog.blog_image }),
        });
      } catch (error) {
        console.warn('Failed to delete image:', error);
      }
    }

    // Delete from database
    await prisma.blog.delete({
      where: { id },
    });

    revalidatePath('/dashboard/blogs');
    revalidatePath('/dashboard/blogs/view');

    return { success: true };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { error: 'Failed to delete blog' };
  }
}