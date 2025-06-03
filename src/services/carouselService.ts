import { supabase } from '../lib/supabaseClient';
import initialCarouselImages from '../data/initialCarouselImages';

export interface CarouselImage {
  id?: string; // Optional for new images before insert
  src: string;
  alt: string | null; // Alt text for SEO
  sort_order: number; // For ordering
  created_at?: string; // Optional, handled by DB
  updated_at?: string; // Optional, handled by DB
}

// Function to fetch carousel images
export async function fetchCarouselImages(): Promise<CarouselImage[]> {
  const { data, error } = await supabase
    .from('carousel_images')
    .select('id, src, alt, sort_order') // Select relevant columns
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching carousel images:', error);
    throw error; // Rethrow the error for the calling component to handle
  }

  // Map snake_case from DB to camelCase if necessary (though column names match interface)
  return (data || []) as CarouselImage[];
}

// Function to add a new carousel image
export async function addCarouselImage(image: Omit<CarouselImage, 'id' | 'created_at' | 'updated_at'>): Promise<CarouselImage> {
  const { data, error } = await supabase
    .from('carousel_images')
    .insert([image])
    .select()
    .single();

  if (error) {
    console.error('Error adding carousel image:', error);
    throw error; // Rethrow the error
  }

  return data as CarouselImage; // Return the newly added image with its ID
}

// Function to update an existing carousel image
export async function updateCarouselImage(id: string, image: Omit<CarouselImage, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
  const { error } = await supabase
    .from('carousel_images')
    .update(image)
    .eq('id', id);

  if (error) {
    console.error('Error updating carousel image:', error);
    throw error; // Rethrow the error
  }
}

// Function to delete a carousel image
export async function deleteCarouselImage(id: string): Promise<void> {
  const { error } = await supabase
    .from('carousel_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting carousel image:', error);
    throw error; // Rethrow the error
  }
}

// Function to initialize carousel images from static data
export async function initializeCarouselImages(): Promise<void> {
  try {
    // Delete all existing images
    const { error: deleteError } = await supabase
      .from('carousel_images')
      .delete()
      .not('id', 'is', null);

    if (deleteError) {
      console.error('Error deleting existing carousel images for initialization:', deleteError);
      throw new Error('Hiba a meglévő körhinta képek törlése során');
    }

    // Insert initial images from static data
    const imagesToInsert = initialCarouselImages.map((img, index) => ({
      src: img.src,
      alt: img.alt,
      sort_order: index, // Use index as initial sort order
    }));

    if (imagesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('carousel_images')
        .insert(imagesToInsert);

      if (insertError) {
        console.error('Error inserting initial carousel images:', insertError);
        throw new Error('Hiba az alapértelmezett körhinta képek beszúrása során');
      }
    }
    console.log('Carousel images initialized successfully.');
  } catch (error) {
    console.error('Error during carousel images initialization:', error);
    throw error; // Rethrow the error
  }
} 