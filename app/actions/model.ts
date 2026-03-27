'use server';

import prisma from '../lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Create-Model
export async function createModel(formData: FormData) {
  const model_name = formData.get('model_name') as string;
  const model_age = formData.get('model_age') as string;
  const model_location = formData.get('model_location') as string;
  const model_desc = formData.get('model_desc') as string;
  const imageFile = formData.get('model_image') as File | null;

  if (!model_name || !model_age || !model_location || !model_desc) {
    return { error: 'All fields are required' };
  }

  const parsedAge = parseInt(model_age, 10);
  if (isNaN(parsedAge)) {
    return { error: 'Age must be a valid number' };
  }

  let model_image: string | null = null;

  try {
    // Upload image if provided
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);

      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/upload`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      model_image = uploadResult.imageUrl;
    }

    // Create model in database
    await prisma.model.create({
      data: {
        model_name,
        model_age: parsedAge,
        model_location,
        model_desc,
        model_image: model_image,
      },
    });

    revalidatePath('/dashboard/models');
    revalidatePath('/dashboard/models/view');
  } catch (error) {
    console.error('Error creating model:', error);
    return {
      error: 'Failed to create model: ' + (error instanceof Error ? error.message : 'Unknown error'),
    };
  }

  redirect('/dashboard/models/view');
}

// Update-Model
export async function updateModel(id: number, formData: FormData) {
  const model_name = formData.get('model_name') as string;
  const model_age = formData.get('model_age') as string;
  const model_location = formData.get('model_location') as string;
  const model_desc = formData.get('model_desc') as string;
  const imageFile = formData.get('model_image') as File | null;
  const keepOldImage = formData.get('keepOldImage') as string;

  if (!model_name || !model_age || !model_location || !model_desc) {
    return { error: 'All fields are required' };
  }

  const parsedAge = parseInt(model_age, 10);
  if (isNaN(parsedAge)) {
    return { error: 'Age must be a valid number' };
  }

  try {
    // Get existing model
    const existingModel = await prisma.model.findUnique({
      where: { id },
    });

    if (!existingModel) {
      return { error: 'Model not found' };
    }

    let model_image: string | null = existingModel?.model_image || null;

    // Handle image update
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      // Delete old image
      if (existingModel?.model_image) {
        try {
          await fetch('${process.env.NEXT_PUBLIC_SITE_URL}/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: existingModel.model_image }),
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
      model_image = uploadResult.imageUrl;
    } else if (keepOldImage === 'false') {
      // Remove image
      if (existingModel?.model_image) {
        try {
          await fetch('${process.env.NEXT_PUBLIC_SITE_URL}/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: existingModel.model_image }),
          });
        } catch (error) {
          console.warn('Failed to delete image:', error);
        }
      }
      model_image = null;
    }

    // Update model in database
    await prisma.model.update({
      where: { id },
      data: {
        model_name,
        model_age: parsedAge,
        model_location,
        model_desc,
        model_image: model_image,
      },
    });

    revalidatePath('/dashboard/models');
    revalidatePath('/dashboard/models/view');
  } catch (error) {
    console.error('Error updating model:', error);
    return {
      error: 'Failed to update model: ' + (error instanceof Error ? error.message : 'Unknown error'),
    };
  }

  redirect('/dashboard/models/view');
}

// Delete-Model
export async function deleteModel(id: number) {
  try {
    // Get model to delete image
    const model = await prisma.model.findUnique({
      where: { id },
    });

    // Delete image from filesystem
    if (model?.model_image) {
      try {
        await fetch('${process.env.NEXT_PUBLIC_SITE_URL}/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: model.model_image }),
        });
      } catch (error) {
        console.warn('Failed to delete image:', error);
      }
    }

    // Delete from database
    await prisma.model.delete({
      where: { id },
    });

    revalidatePath('/dashboard/models');
    revalidatePath('/dashboard/models/view');

    return { success: true };
  } catch (error) {
    console.error('Error deleting model:', error);
    return { error: 'Failed to delete model' };
  }
}