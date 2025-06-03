import React, { useState, useEffect } from 'react';
import { PackageGroup, PackageItem } from '../data/packageGroups';
import { supabase } from '../lib/supabaseClient';
import packageGroupsData from '../data/packageGroups';
import { 
  RotateCcw, 
  Eye, 
  EyeOff, 
  LogOut, 
  Package, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowUp, 
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  Upload,
  X
} from 'lucide-react';
import referencesData, { Reference, ReferenceImage } from '../data/references';
import { LogoConfig, navbarLogoConfig, footerLogoConfig } from '../config/brand';
import { fetchCarouselImages, addCarouselImage, updateCarouselImage, deleteCarouselImage, CarouselImage, initializeCarouselImages } from '../services/carouselService';

const TABS = [
  { key: 'packages', label: 'Csomagok' },
  { key: 'references', label: 'Referenciák' },
  { key: 'carousel', label: 'Sorozatképek' },
];

const LUCIDE_ICONS = ['Camera', 'Film', 'Mic', 'Image'];

function getLucideIconName(icon: any) {
  if (typeof icon === 'string') return icon;
  if (icon && icon.name) return icon.name;
  if (icon && icon.displayName) return icon.displayName;
  return '';
}

// --- Supabase CRUD helpers (Packages) ---
async function fetchPackageGroupsWithItems(): Promise<PackageGroup[]> {
  const { data: groups, error: groupError } = await supabase.from('package_groups').select('*').order('sort_order', { ascending: true });
  const { data: items, error: itemError } = await supabase.from('package_items').select('*');
  if (groupError || itemError) throw groupError || itemError;
  return (groups || []).map(group => ({
    ...group,
    items: (items || []).filter(item => item.group_id === group.id)
  }));
}
async function addPackageGroup(group: { title: string; icon: string; sort_order: number }) {
  const { data, error } = await supabase.from('package_groups').insert([{ title: group.title, icon: group.icon, sort_order: group.sort_order }]).select();
  if (error) throw error;
  return data?.[0];
}
async function updatePackageGroup(id: string, group: { title: string; icon: string; sort_order: number }) {
  const { error } = await supabase.from('package_groups').update({ title: group.title, icon: group.icon, sort_order: group.sort_order }).eq('id', id);
  if (error) throw error;
}
async function deletePackageGroup(id: string) {
  const { error } = await supabase.from('package_groups').delete().eq('id', id);
  if (error) throw error;
}
async function addPackageItem(groupId: string, item: PackageItem) {
  const { error } = await supabase.from('package_items').insert([{ group_id: groupId, name: item.name, description: item.description, price: item.price }]);
  if (error) throw error;
}
async function updatePackageItem(id: string, item: PackageItem) {
  const { error } = await supabase.from('package_items').update({ name: item.name, description: item.description, price: item.price }).eq('id', id);
  if (error) throw error;
}
async function deletePackageItem(id: string) {
  const { error } = await supabase.from('package_items').delete().eq('id', id);
  if (error) throw error;
}

// Inicializáló függvény az eredeti adatok feltöltéséhez
async function initializePackageGroups() {
  try {
    // Teljes törlés a meglévő adatokból
    const { error: deleteItemsError } = await supabase
      .from('package_items')
      .delete()
      .not('id', 'is', null);

    const { error: deleteGroupsError } = await supabase
      .from('package_groups')
      .delete()
      .not('id', 'is', null);

    if (deleteItemsError || deleteGroupsError) {
      console.error('Delete items error:', deleteItemsError);
      console.error('Delete groups error:', deleteGroupsError);
      throw new Error('Hiba a meglévő adatok törlése során');
    }

    // Feltöltjük az eredeti csoportokat
    for (let i = 0; i < packageGroupsData.length; i++) {
      const group = packageGroupsData[i];
      const { data: newGroup, error: groupError } = await supabase
        .from('package_groups')
        .insert([{ 
          title: group.title,
          icon: getLucideIconName(group.icon),
          sort_order: i // Sorrend beállítása az index alapján
        }])
        .select()
        .single();

      if (groupError || !newGroup) {
         console.error(`Hiba a csoport létrehozásakor (${group.title}):`, groupError);
        throw new Error(`Hiba a csoport létrehozásakor: ${groupError?.message || 'Ismeretlen hiba'}`);
      }

      // Feltöltjük a csomagokat
      const items = group.items.map(item => ({
        group_id: newGroup.id,
        name: item.name,
        description: item.description,
        price: item.price
      }));

      if (items.length > 0) {
        const { error: itemsError } = await supabase
          .from('package_items')
          .insert(items);

        if (itemsError) {
           console.error(`Hiba a csomagok létrehozásakor (${group.title}):`, itemsError);
          throw new Error(`Hiba a csomagok létrehozásakor: ${itemsError.message}`);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Hiba az inicializálás során:', error);
    throw error;
  }
}

// --- Supabase CRUD helpers (References) ---
// Módosítva: Képezi a snake_case Supabase neveket camelCase-re
async function fetchReferences(): Promise<(Reference & { id: string; images: (ReferenceImage & { id: string })[] })[]> {
  const { data: references, error: refError } = await supabase.from('project_references').select('*').order('created_at', { ascending: true });
  if (refError) {
    console.error('Error fetching project references:', refError);
     // Hibakezelés javítása: ne dobjon hibát rögtön, hanem adjon vissza üres tömböt vagy kezelje máshogy a UI-ban
    return []; // Üres tömb visszaadása hiba esetén
  }

  const { data: images, error: imgError } = await supabase.from('project_reference_images').select('*').order('sort_order', { ascending: true });
  if (imgError) {
    console.error('Error fetching project reference images:', imgError);
     // Hibakezelés javítása
    return (references || []).map(ref => ({
      ...ref,
      // Mappeljük a Supabase neveket camelCase-re
      imageUrl: ref.image_url,
      videoUrl: ref.video_url, // Null értékeket is kezel
      fullDescription: ref.full_description,
      images: [] // Nincsenek képek hiba miatt
    })) as any; // Supabase visszatérési típus pontosítása később
  }

  // Összefűzzük a referenciákat a hozzájuk tartozó képekkel és mappeljük a neveket
  return (references || []).map(ref => ({
    id: ref.id, // Supabase ID
    title: ref.title,
    description: ref.description,
    imageUrl: ref.image_url, // Átképezés
    videoUrl: ref.video_url, // Átképezés (lehet null)
    fullDescription: ref.full_description, // Átképezés
    images: (images || []).filter(img => img.reference_id === ref.id).map(img => ({
      id: img.id, // Supabase ID
      src: img.src,
      alt: img.alt,
      description: img.description, // Null értékeket is kezel
      // sort_order nem szükséges a ReferenceImage típusban
    }))
  })) as any; // Ideiglenes any, Supabase visszatérési típus pontosítása később
}

// Módosított addReference típus a snake_case oszlopnevekkel
async function addReference(reference: {
  title: string;
  description: string;
  image_url: string;
  video_url?: string | null;
  full_description: string;
  images?: Omit<ReferenceImage, 'id' | 'reference_id' | 'sort_order'>[]
}) {
  const { images, ...rest } = reference;
  const { data: newRef, error: refError } = await supabase.from('project_references').insert([rest]).select().single();
  if (refError) throw refError;

  if (images && images.length > 0 && newRef?.id) {
    const imagesToInsert = images.map((img, index) => ({
      reference_id: newRef.id,
      src: img.src,
      alt: img.alt,
      description: img.description,
      sort_order: index
    }));
    const { error: imgError } = await supabase.from('project_reference_images').insert(imagesToInsert);
    if (imgError) throw imgError;
  }
  return newRef;
}

// Módosított updateReference típus a snake_case oszlopnevekkel
async function updateReference(id: string, reference: {
  title: string;
  description: string;
  image_url: string;
  video_url?: string | null;
  full_description: string;
  images?: Omit<ReferenceImage, 'id' | 'reference_id' | 'sort_order'>[]
}) {
  const { images, ...rest } = reference;
  const { error: refError } = await supabase.from('project_references').update(rest).eq('id', id);
  if (refError) throw refError;

  // Töröljük a régi képeket
  const { error: deleteError } = await supabase.from('project_reference_images').delete().eq('reference_id', id);
  if (deleteError) throw deleteError;

  // Feltöltjük az új képeket
  if (images && images.length > 0) {
    const imagesToInsert = images.map((img, index) => ({
      reference_id: id,
      src: img.src,
      alt: img.alt,
      description: img.description,
      sort_order: index
    }));
    const { error: insertError } = await supabase.from('project_reference_images').insert(imagesToInsert);
    if (insertError) throw insertError;
  }
}

async function deleteReference(id: string) {
   // A reference_images-ben beállított ON DELETE CASCADE miatt elég csak a fő referenciát törölni
  const { error } = await supabase.from('project_references').delete().eq('id', id);
  if (error) throw error;
}

// Inicializáló függvény az eredeti referencia adatok feltöltéséhez
async function initializeReferences() {
  try {
    // Teljes törlés a meglévő referenciákból és képekből
    const { error: deleteImagesError } = await supabase
      .from('project_reference_images')
      .delete()
      .not('id', 'is', null);

    const { error: deleteReferencesError } = await supabase
      .from('project_references')
      .delete()
      .not('id', 'is', null);

    if (deleteImagesError || deleteReferencesError) {
      console.error('Delete reference images error:', deleteImagesError);
      console.error('Delete references error:', deleteReferencesError);
      throw new Error('Hiba a meglévő referencia adatok törlése során');
    }

    // Feltöltjük az eredeti referenciákat és képeket
    for (const reference of referencesData) {
      // Először a fő referencia beszúrása
      const { images, ...restOfReference } = reference; // Különválasztom a képeket
       // Mappeljük a camelCase neveket snake_case nevekre a beszúráshoz
      const mappedRestOfReference = {
         title: restOfReference.title,
         description: restOfReference.description,
         image_url: restOfReference.imageUrl, // Módosítva
         video_url: restOfReference.videoUrl, // Módosítva
         full_description: restOfReference.fullDescription, // Módosítva
      };

      const { data: newRef, error: refError } = await supabase
        .from('project_references')
        .insert([mappedRestOfReference])
        .select()
        .single();

      if (refError || !newRef) {
        console.error(`Hiba a referencia létrehozásakor (${reference.title}):`, refError);
        throw new Error(`Hiba a referencia létrehozásakor: ${refError?.message || 'Ismeretlen hiba'}`);
      }

      // Feltöltjük a galéria képeket, ha vannak
      if (images && images.length > 0) {
        const imagesToInsert = images.map((img, index) => ({
          reference_id: newRef.id,
          src: img.src,
          alt: img.alt,
          description: img.description === '' ? null : img.description, // Üres string helyett null
          sort_order: index // Sorrend beállítása
        }));

        const { error: imgError } = await supabase
          .from('project_reference_images')
          .insert(imagesToInsert);

        if (imgError) {
           console.error(`Hiba a referencia képek létrehozásakor (${reference.title}):`, imgError);
          throw new Error(`Hiba a referencia képek létrehozásakor: ${imgError.message}`);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Hiba az referencia inicializálás során:', error);
    throw error;
  }
}

// Add this function after the other CRUD helpers
async function uploadCarouselImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `carousel/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Add these functions after the other upload function
async function uploadReferenceImage(file: File, folder: string = 'references'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}

async function uploadMultipleGalleryImages(files: FileList): Promise<string[]> {
  const uploadPromises = Array.from(files).map(file => uploadReferenceImage(file, 'references/gallery'));
  return Promise.all(uploadPromises);
}

const Admin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('packages');

  // --- packageGroups state (Supabase) ---
  const [packageGroups, setPackageGroups] = useState<PackageGroup[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editGroup, setEditGroup] = useState<PackageGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // --- Referenciák state (Supabase) ---
  const [references, setReferences] = useState<(Reference & { id: string; images: (ReferenceImage & { id: string })[] })[]>([]);
  const [editingRefIndex, setEditingRefIndex] = useState<number | null>(null);
  const [editReference, setEditReference] = useState<(Reference & { id?: string; images: (ReferenceImage & { id?: string })[] }) | null>(null);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [initializingReferences, setInitializingReferences] = useState(false);
  const [showRefResetConfirm, setShowRefResetConfirm] = useState(false);

  // --- Carousel Images state (Supabase) ---
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [editingCarouselImageIndex, setEditingCarouselImageIndex] = useState<number | null>(null);
  const [editCarouselImage, setEditCarouselImage] = useState<CarouselImage | null>(null);
  const [loadingCarouselImages, setLoadingCarouselImages] = useState(true);
  const [initializingCarouselImages, setInitializingCarouselImages] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingRefImage, setUploadingRefImage] = useState(false);
  const [uploadingGalleryImages, setUploadingGalleryImages] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add these handler functions
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editReference) return;

    setUploadingRefImage(true);
    try {
      const imageUrl = await uploadReferenceImage(file);
      setEditReference({ ...editReference, imageUrl });
    } catch (error) {
      console.error('Error uploading main image:', error);
      alert('Hiba történt a fő kép feltöltése során!');
    } finally {
      setUploadingRefImage(false);
    }
  };

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editReference) return;

    setUploadingGalleryImages(true);
    try {
      const imageUrls = await uploadMultipleGalleryImages(files);
      const newGalleryImages = imageUrls.map((src, index) => ({
        src,
        alt: `Galéria kép ${index + 1}`,
        description: null
      }));
      
      setEditReference({
        ...editReference,
        images: [...(editReference.images || []), ...newGalleryImages]
      });
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      alert('Hiba történt a galéria képek feltöltése során!');
    } finally {
      setUploadingGalleryImages(false);
    }
  };

  // Betöltés Supabase-ből (Packages)
  useEffect(() => {
    if (activeTab === 'packages') {
      setLoading(true);
      fetchPackageGroupsWithItems().then(groups => {
        setPackageGroups(groups);
        setLoading(false);
      }).catch(error => {
         console.error('Error fetching package groups:', error);
         alert('Hiba a csomagok betöltésekor!');
         setLoading(false);
      });
    }
  }, [activeTab]);

  // Betöltés Supabase-ből (References)
  useEffect(() => {
    if (activeTab === 'references') {
      setLoadingReferences(true);
      fetchReferences().then(refs => {
        setReferences(refs);
        setLoadingReferences(false);
      }).catch(error => {
         console.error('Error fetching references:', error);
         alert('Hiba a referenciák betöltésekor!');
         setLoadingReferences(false);
      });
    }
  }, [activeTab]);

  // Betöltés Supabase-ből (Carousel Images)
  useEffect(() => {
    if (activeTab === 'carousel') {
      setLoadingCarouselImages(true);
      fetchCarouselImages().then(images => {
        setCarouselImages(images);
        setLoadingCarouselImages(false);
      }).catch(error => {
        console.error('Error fetching carousel images:', error);
        alert('Hiba a körhinta képek betöltésekor!');
        setLoadingCarouselImages(false);
      });
    }
  }, [activeTab]);

  // --- CRUD ---
  const handleEditGroup = (idx: number) => {
    setEditingIndex(idx);
    setEditGroup(JSON.parse(JSON.stringify(packageGroups[idx])));
  };
  const handleDeleteGroup = async (idx: number) => {
    const groupId = packageGroups[idx].id;
    if (!groupId) {
      alert('Hiba: A csomagcsoport azonosítója nem található!');
      return;
    }

    if (window.confirm('Biztosan törlöd ezt a csomagcsoportot?')) {
      setLoading(true);
      try {
        await deletePackageGroup(groupId);
        const groups = await fetchPackageGroupsWithItems();
        setPackageGroups(groups);
      } catch (error) {
        alert('Hiba történt a törlés során!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleSaveEdit = async () => {
    if (!editGroup) return;

    setLoading(true);
    try {
      if (!editGroup.id) {
        // Új csoport létrehozása
        const newGroup = await addPackageGroup({ 
          title: editGroup.title, 
          icon: editGroup.icon,
          sort_order: editGroup.sort_order || 0
        });
        
        if (!newGroup?.id) {
          throw new Error('Nem sikerült létrehozni az új csoportot!');
        }

        // Új csomagok beszúrása
        for (const item of editGroup.items) {
          await addPackageItem(newGroup.id, item);
        }
      } else {
        // Meglévő csoport frissítése
        await updatePackageGroup(editGroup.id, { 
          title: editGroup.title, 
          icon: editGroup.icon,
          sort_order: editGroup.sort_order || 0
        });

        // Régi csomagok törlése
        const oldItems = packageGroups.find(g => g.id === editGroup.id)?.items || [];
        for (const oldItem of oldItems) {
          if (oldItem.id) {
            await deletePackageItem(oldItem.id);
          }
        }

        // Új csomagok beszúrása
        for (const item of editGroup.items) {
          await addPackageItem(editGroup.id, item);
        }
      }

      const groups = await fetchPackageGroupsWithItems();
      setPackageGroups(groups);
      setEditingIndex(null);
      setEditGroup(null);
    } catch (error) {
      alert('Hiba történt a mentés során!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditGroup(null);
  };
  const handleAddGroup = () => {
    setEditingIndex(null);
    // Új csoport hozzáadásakor a sort_order a lista végére kerül
    const maxSortOrder = Math.max(...packageGroups.map(g => g.sort_order || 0), -1);
    setEditGroup({ 
      title: '', 
      icon: 'Camera', 
      items: [],
      sort_order: maxSortOrder + 1 
    });
  };
  // --- Package item CRUD (csak a szerkesztőben, mentéskor Supabase-be írjuk) ---
  const handleAddItem = () => {
    if (editGroup) {
      setEditGroup({ ...editGroup, items: [...editGroup.items, { name: '', description: '', price: '' }] });
    }
  };
  const handleEditItem = (idx: number, field: keyof PackageItem, value: string) => {
    if (editGroup) {
      const items = [...editGroup.items];
      items[idx] = { ...items[idx], [field]: value };
      setEditGroup({ ...editGroup, items });
    }
  };
  const handleDeleteItem = (idx: number) => {
    if (editGroup) {
      const items = [...editGroup.items];
      items.splice(idx, 1);
      setEditGroup({ ...editGroup, items });
    }
  };

  // Referencia CRUD (Supabase)
  const handleEditReference = (idx: number) => {
    setEditingRefIndex(idx);
    // Győződjünk meg róla, hogy van images tömb, ha szerkesztünk
    const refToEdit = JSON.parse(JSON.stringify(references[idx]));
    if (!refToEdit.images) {
       refToEdit.images = [];
    }
    setEditReference(refToEdit);
  };
  const handleDeleteReference = async (idx: number) => {
    const refToDelete = references[idx];
    if (!refToDelete.id) { // Biztonsági ellenőrzés
       alert('Hiba: A referencia azonosítója nem található!');
       return;
    }
    if (window.confirm('Biztosan törlöd ezt a referenciát?')) {
      setLoadingReferences(true);
      try {
        await deleteReference(refToDelete.id);
        const updatedRefs = await fetchReferences();
        setReferences(updatedRefs);
      } catch (error) {
        alert('Hiba történt a törlés során!');
        console.error(error);
      } finally {
        setLoadingReferences(false);
      }
    }
  };
  const handleSaveReference = async () => {
    if (!editReference) return;

    setLoadingReferences(true);
    try {
      // Létrehozunk egy objektumot a Supabase-nek a snake_case oszlopnevekkel
      const referenceDataToSave = {
         title: editReference.title,
         description: editReference.description,
         image_url: editReference.imageUrl, // snake_case
         video_url: editReference.videoUrl === '' ? null : editReference.videoUrl, // snake_case, üres string -> null
         full_description: editReference.fullDescription, // snake_case
      };

      if (!editReference.id) {
        // Új referencia
        // addReference kezeli a képeket is, miután megkapta az új referencia id-ját
        // Átadjuk a snake_case adatokat és a camelCase images tömböt
        await addReference({ ...referenceDataToSave, images: editReference.images as any }); // Ideiglenes any
      } else {
        // Meglévő referencia frissítése
        // updateReference kezeli a képek törlését és újrabeszúrását
         // Átadjuk a snake_case adatokat és a camelCase images tömböt
        await updateReference(editReference.id, { ...referenceDataToSave, images: editReference.images as any }); // Ideiglenes any
      }

      const updatedRefs = await fetchReferences();
      setReferences(updatedRefs);
      setEditingRefIndex(null);
      setEditReference(null);
    } catch (error) {
      alert('Hiba történt a mentés során!');
      console.error(error);
    } finally {
      setLoadingReferences(false);
    }
  };
  const handleCancelReference = () => {
    setEditingRefIndex(null);
    setEditReference(null);
  };
  const handleAddReference = () => {
    setEditingRefIndex(null);
    setEditReference({
      title: '',
      description: '',
      imageUrl: '',
      videoUrl: null,
      fullDescription: '',
      images: [] // Üres tömb az új referenciához
    });
  };
  // Galéria képek kezelése (csak local state a szerkesztő formban)
  const handleAddGalleryImage = () => {
    if (editReference) {
      setEditReference({
        ...editReference,
        images: [...(editReference.images || []), { src: '', alt: '', description: null }]
      });
    }
  };
  const handleEditGalleryImage = (idx: number, field: keyof ReferenceImage, value: string) => {
    if (editReference && editReference.images) {
      const images = [...editReference.images];
      // Biztosítom, hogy az 'id' és 'reference_id' mezők megmaradjanak szerkesztés közben, ha vannak
      images[idx] = { ...images[idx], [field]: value };
      setEditReference({ ...editReference, images });
    }
  };
  const handleDeleteGalleryImage = (idx: number) => {
    if (editReference && editReference.images) {
      const images = [...editReference.images];
      images.splice(idx, 1);
      setEditReference({ ...editReference, images });
    } else if (editReference && !editReference.images) {
       // Nincs teendő, nem volt kép a törléshez
    }
  };

  // Referencia Visszaállítás
  const handleRefResetClick = () => {
    setShowRefResetConfirm(true);
  };

  const handleRefResetConfirm = async () => {
    setShowRefResetConfirm(false);
    setInitializingReferences(true);
    try {
      await initializeReferences();
      const updatedRefs = await fetchReferences();
      setReferences(updatedRefs);
      alert('A referenciák sikeresen visszaállítva az eredeti állapotra!');
    } catch (error) {
      alert('Hiba történt a visszaállítás során!');
      console.error(error);
    } finally {
      setInitializingReferences(false);
    }
  };

  // Carousel Image CRUD (Supabase)
  const handleEditCarouselImage = (idx: number) => {
    setEditingCarouselImageIndex(idx);
    setEditCarouselImage(JSON.parse(JSON.stringify(carouselImages[idx])));
  };

  const handleDeleteCarouselImage = async (idx: number) => {
    const imageToDelete = carouselImages[idx];
    if (!imageToDelete.id) {
      alert('Hiba: A kép azonosítója nem található!');
      return;
    }
    if (window.confirm('Biztosan törlöd ezt a képet a körhintából?')) {
      setLoadingCarouselImages(true);
      try {
        await deleteCarouselImage(imageToDelete.id);
        const updatedImages = await fetchCarouselImages();
        setCarouselImages(updatedImages);
      } catch (error) {
        alert('Hiba történt a törlés során!');
        console.error(error);
      } finally {
        setLoadingCarouselImages(false);
      }
    }
  };

  const handleSaveCarouselImage = async () => {
    if (!editCarouselImage) return;

    setLoadingCarouselImages(true);
    try {
      if (!editCarouselImage.id) {
        // Új kép hozzáadása
        // Determine sort order for new image (add to the end)
        const maxSortOrder = Math.max(...carouselImages.map(img => img.sort_order || 0), -1);
        await addCarouselImage({ ...editCarouselImage, sort_order: maxSortOrder + 1 });
      } else {
        // Meglévő kép frissítése
        await updateCarouselImage(editCarouselImage.id, editCarouselImage);
      }

      const updatedImages = await fetchCarouselImages();
      setCarouselImages(updatedImages);
      setEditingCarouselImageIndex(null);
      setEditCarouselImage(null);
    } catch (error) {
      alert('Hiba történt a mentés során!');
      console.error(error);
    } finally {
      setLoadingCarouselImages(false);
    }
  };

  const handleCancelCarouselImageEdit = () => {
    setEditingCarouselImageIndex(null);
    setEditCarouselImage(null);
  };

  const handleAddCarouselImage = () => {
    setEditingCarouselImageIndex(null);
    // Set default sort_order to be the next in sequence
    const maxSortOrder = Math.max(0, ...carouselImages.map(img => img.sort_order || 0));
    setEditCarouselImage({ src: '', alt: '', sort_order: maxSortOrder + 1 });
  };

  // Manual sort order change handler for the list view
  const handleCarouselImageSortChange = async (id: string, newSortOrder: number) => {
     // Find the image by id and update its sort_order locally first
     const updatedImages = carouselImages.map(img => 
        img.id === id ? { ...img, sort_order: newSortOrder } : img
     );
     setCarouselImages(updatedImages); // Optimistic update

     // Find the image with the new sort order for Supabase update
     const imageToUpdate = updatedImages.find(img => img.id === id);
     if (imageToUpdate) {
        setLoadingCarouselImages(true); // Show loading indicator
        try {
            // Update only sort_order in DB - need to send the whole object basically
             // Let's refetch the latest state of this image first to avoid overwriting other changes
             const { data, error } = await supabase.from('carousel_images').select('*').eq('id', id).single();
             if (error || !data) throw error || new Error('Kép nem található');

             const imageWithLatestData: CarouselImage = data as any; // Type assertion

            await updateCarouselImage(id, { ...imageWithLatestData, sort_order: newSortOrder });
            // Refetch all images to ensure correct order in state after DB update
            const finalImages = await fetchCarouselImages();
            setCarouselImages(finalImages);
        } catch (error) {
            alert('Hiba történt a sorrend frissítése során!');
            console.error(error);
            // Revert optimistic update on error
            const originalImages = await fetchCarouselImages();
            setCarouselImages(originalImages);
        } finally {
            setLoadingCarouselImages(false);
        }
     }
  };

  // Carousel Images Visszaállítás
  const handleCarouselImagesResetClick = () => {
    if (window.confirm(
      'Biztosan visszaállítod a körhinta képeket az eredeti állapotra?\n' +
      'Ez a művelet törli az összes jelenlegi képet és nem vonható vissza!'
    )) {
      handleCarouselImagesResetConfirm();
    }
  };

  const handleCarouselImagesResetConfirm = async () => {
    setInitializingCarouselImages(true);
    try {
      await initializeCarouselImages();
      const updatedImages = await fetchCarouselImages();
      setCarouselImages(updatedImages);
      alert('A körhinta képek sikeresen visszaállítva az eredeti állapotra!');
    } catch (error) {
      alert('Hiba történt a visszaállítás során!');
      console.error(error);
    } finally {
      setInitializingCarouselImages(false);
    }
  };

  // Add this handler function
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadCarouselImage(file);
      setEditCarouselImage(prev => prev ? { ...prev, src: imageUrl } : null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Hiba történt a kép feltöltése során!');
    } finally {
      setUploadingImage(false);
    }
  };

  // Add auth state listener
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'Hiba történt a bejelentkezés során');
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setError(error.message || 'Hiba történt a kijelentkezés során');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) throw error;
      setResetSent(true);
    } catch (error: any) {
      setError(error.message || 'Hiba történt a jelszó visszaállítása során');
    } finally {
      setLoading(false);
    }
  };

  // Restore the package reset handlers
  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleResetConfirm = async () => {
    setShowResetConfirm(false);
    setInitializing(true);
    try {
      await initializePackageGroups();
      const groups = await fetchPackageGroupsWithItems();
      setPackageGroups(groups);
      alert('A csomagok sikeresen visszaállítva az eredeti állapotra!');
    } catch (error) {
      alert('Hiba történt a visszaállítás során!');
      console.error(error);
    } finally {
      setInitializing(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {!showResetPassword ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin belépés</h2>
                    <p className="text-gray-600">Jelentkezzen be a folytatáshoz</p>
                  </div>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email cím
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jelszó
                      </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi transition-colors"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                        loading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-kiwi hover:bg-kiwi-dark shadow-md hover:shadow-lg active:shadow-sm active:translate-y-0.5'
                      }`}
                    >
                      {loading ? 'Bejelentkezés...' : 'Belépés'}
                    </button>
        </form>
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowResetPassword(true)}
                      className="text-kiwi hover:text-kiwi-dark text-sm font-medium transition-colors"
                    >
                      Elfelejtett jelszó?
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Jelszó visszaállítása</h2>
                    <p className="text-gray-600">Adja meg email címét a visszaállításhoz</p>
                  </div>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}
                  {resetSent ? (
                    <div className="text-center">
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                        A jelszó visszaállító link elküldve a megadott email címre.
                      </div>
                      <button
                        onClick={() => {
                          setShowResetPassword(false);
                          setResetSent(false);
                          setResetEmail('');
                        }}
                        className="text-kiwi hover:text-kiwi-dark font-medium transition-colors"
                      >
                        Vissza a bejelentkezéshez
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email cím
                        </label>
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={e => setResetEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi transition-colors"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                          loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-kiwi hover:bg-kiwi-dark shadow-md hover:shadow-lg active:shadow-sm active:translate-y-0.5'
                        }`}
                      >
                        {loading ? 'Küldés...' : 'Visszaállító link küldése'}
                      </button>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setShowResetPassword(false)}
                          className="text-kiwi hover:text-kiwi-dark text-sm font-medium transition-colors"
                        >
                          Vissza a bejelentkezéshez
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url('/admin-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Logo and Logout */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Kijelentkezés
            </button>
            <div className="flex items-center">
              {navbarLogoConfig.icon.type === 'image' && navbarLogoConfig.icon.image && (
                <img 
                  src={navbarLogoConfig.icon.image.src} 
                  alt={navbarLogoConfig.icon.image.alt} 
                  width={navbarLogoConfig.icon.image.width}
                  height={navbarLogoConfig.icon.image.height}
                  className="h-12 w-auto object-contain"
                />
              )}
              <div className="flex flex-col ml-3">
                {navbarLogoConfig.text.primary && (
                  <span className={`${navbarLogoConfig.text.primary.fontSize} ${navbarLogoConfig.text.primary.fontWeight} text-gray-800`}>
                    {navbarLogoConfig.text.primary.text}
                  </span>
                )}
                {navbarLogoConfig.text.secondary && (
                  <span className={`${navbarLogoConfig.text.secondary.fontSize} ${navbarLogoConfig.text.secondary.fontWeight} text-gray-600`}>
                    {navbarLogoConfig.text.secondary.text}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.key
                      ? 'border-kiwi text-kiwi'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.key === 'packages' && <Package size={16} className="inline-block mr-2" />}
                  {tab.key === 'references' && <FileText size={16} className="inline-block mr-2" />}
                  {tab.key === 'carousel' && <ImageIcon size={16} className="inline-block mr-2" />}
              {tab.label}
            </button>
          ))}
            </nav>
        </div>
        </div>

        {/* Content Area */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
            backdropFilter: 'blur(10px)', // Glassmorphism blur effect
            WebkitBackdropFilter: 'blur(10px)', // For Safari support
          }}
        >
          {activeTab === 'packages' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Csomagok kezelése</h2>
                <div className="flex space-x-3">
                <button
                  onClick={handleAddGroup}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-kiwi text-white hover:bg-kiwi-dark transition-colors"
                >
                    <Plus size={18} className="mr-2" />
                  Új csoport
                </button>
                <button
                  onClick={handleResetClick}
                  disabled={initializing}
                    className={`p-2 rounded-lg transition-colors ${
                    initializing
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                  title="Visszaállítás az eredeti állapotra"
                >
                    <RotateCcw size={18} />
                </button>
                </div>
              </div>

              {/* Reset Confirmation Modal */}
              {showResetConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Visszaállítás megerősítése</h3>
                    <p className="text-gray-600 mb-6">
                        Biztosan visszaállítja a csomagokat az eredeti állapotra?
                      Ez a művelet törli az összes módosítást és nem vonható vissza!
                    </p>
                      <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowResetConfirm(false)}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Mégse
                      </button>
                      <button
                        onClick={handleResetConfirm}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Visszaállítás
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Package Groups List or Editor */}
              {editGroup ? (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Csoport címe</label>
                    <input
                      type="text"
                      value={editGroup.title}
                      onChange={e => setEditGroup({ ...editGroup, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sorrend</label>
                    <input
                      type="number"
                      min="0"
                      value={editGroup.sort_order || 0}
                      onChange={e => setEditGroup({ ...editGroup, sort_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ikon</label>
                    <select
                      value={getLucideIconName(editGroup.icon)}
                      onChange={e => setEditGroup({ ...editGroup, icon: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                    >
                      {LUCIDE_ICONS.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Csomagok</label>
                      <div className="space-y-3">
                    {editGroup.items.map((item, idx) => (
                          <div key={item.id || idx} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={e => handleEditItem(idx, 'name', e.target.value)}
                          placeholder="Név"
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                        />
                        <input
                          type="text"
                          value={item.description}
                          onChange={e => handleEditItem(idx, 'description', e.target.value)}
                          placeholder="Leírás"
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                        />
                        <input
                          type="text"
                          value={item.price}
                          onChange={e => handleEditItem(idx, 'price', e.target.value)}
                          placeholder="Ár"
                              className="w-32 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                            />
                            <button
                              onClick={() => handleDeleteItem(idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                      </div>
                    ))}
                        <button
                          onClick={handleAddItem}
                          className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-kiwi hover:text-kiwi transition-colors"
                        >
                          <Plus size={18} className="inline-block mr-2" />
                          Új csomag hozzáadása
                        </button>
                  </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Mégse
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 rounded-lg bg-kiwi text-white hover:bg-kiwi-dark transition-colors"
                      >
                        Mentés
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {packageGroups.map((group, idx) => (
                    <div
                      key={group.id || idx}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                      <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{group.title}</h3>
                            <div className="text-sm text-gray-500 mb-4">
                          Sorrend: {group.sort_order || 0} | Ikon: {getLucideIconName(group.icon)}
                        </div>
                            <ul className="space-y-2">
                          {group.items.map((item, i) => (
                                <li key={item.id || i} className="flex items-center text-gray-600">
                                  <span className="w-2 h-2 bg-kiwi rounded-full mr-2"></span>
                                  {item.name} – {item.description}
                                  <span className="ml-2 font-semibold text-gray-800">{item.price}</span>
                                </li>
                          ))}
                        </ul>
                      </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditGroup(idx)}
                              className="p-2 text-kiwi hover:bg-kiwi/10 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteGroup(idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'references' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Referenciák kezelése</h2>
                <div className="flex space-x-3">
                <button
                  onClick={handleAddReference}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-kiwi text-white hover:bg-kiwi-dark transition-colors"
                >
                    <Plus size={18} className="mr-2" />
                  Új referencia
                </button>
                <button
                  onClick={handleRefResetClick}
                  disabled={initializingReferences}
                    className={`p-2 rounded-lg transition-colors ${
                    initializingReferences
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                  title="Visszaállítás az eredeti referenciákra"
                >
                    <RotateCcw size={18} />
                </button>
                </div>
              </div>

              {/* Reset Confirmation Modal */}
              {showRefResetConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Referenciák visszaállításának megerősítése</h3>
                    <p className="text-gray-600 mb-6">
                        Biztosan visszaállítja a referenciákat az eredeti állapotra?
                      Ez a művelet törli az összes jelenlegi referenciát és nem vonható vissza!
                    </p>
                      <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowRefResetConfirm(false)}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Mégse
                      </button>
                      <button
                        onClick={handleRefResetConfirm}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Visszaállítás
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {editReference ? (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cím</label>
                    <input
                      type="text"
                      value={editReference.title}
                      onChange={e => setEditReference({ ...editReference, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rövid leírás</label>
                    <input
                      type="text"
                      value={editReference.description}
                      onChange={e => setEditReference({ ...editReference, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fő kép</label>
                      <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={editReference.imageUrl}
                      onChange={e => setEditReference({ ...editReference, imageUrl: e.target.value })}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          disabled={uploadingRefImage}
                          className="hidden"
                          id="reference-main-image-upload"
                        />
                        <label
                          htmlFor="reference-main-image-upload"
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium cursor-pointer whitespace-nowrap transition-colors ${
                            uploadingRefImage
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Upload size={18} className="mr-2" />
                          {uploadingRefImage ? 'Feltöltés...' : 'Fő kép feltöltése'}
                        </label>
                  </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Videó URL (opcionális)</label>
                    <input
                      type="text"
                      value={editReference.videoUrl || ''}
                      onChange={e => setEditReference({ ...editReference, videoUrl: e.target.value === '' ? null : e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                      placeholder="pl. https://www.youtube.com/embed/... vagy /videos/my-video.mp4"
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teljes leírás</label>
                    <textarea
                      value={editReference.fullDescription}
                      onChange={e => setEditReference({ ...editReference, fullDescription: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                        rows={4}
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Galéria képek</label>
                  <div className="mb-4">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryImagesUpload}
                          disabled={uploadingGalleryImages}
                          className="hidden"
                          id="reference-gallery-upload"
                        />
                        <label
                          htmlFor="reference-gallery-upload"
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                            uploadingGalleryImages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Upload size={18} className="mr-2" />
                          {uploadingGalleryImages ? 'Feltöltés...' : 'Több kép feltöltése'}
                        </label>
                        <span className="ml-3 text-sm text-gray-500">
                          (Több kép kiválasztása lehetséges)
                        </span>
                      </div>
                      <div className="space-y-3">
                    {(editReference.images || []).map((img, idx) => (
                          <div key={img.id || idx} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={img.src}
                          onChange={e => handleEditGalleryImage(idx, 'src', e.target.value)}
                          placeholder="Kép URL"
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                        />
                        <input
                          type="text"
                          value={img.alt}
                          onChange={e => handleEditGalleryImage(idx, 'alt', e.target.value)}
                          placeholder="Alt szöveg"
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                        />
                         <input
                          type="text"
                          value={img.description || ''}
                          onChange={e => handleEditGalleryImage(idx, 'description', e.target.value)}
                          placeholder="Leírás (opcionális)"
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                            />
                            <button
                              onClick={() => handleDeleteGalleryImage(idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                      </div>
                    ))}
                        <button
                          onClick={handleAddGalleryImage}
                          className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-kiwi hover:text-kiwi transition-colors"
                        >
                          <Plus size={18} className="inline-block mr-2" />
                          Új kép hozzáadása
                        </button>
                  </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleCancelReference}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Mégse
                      </button>
                      <button
                        onClick={handleSaveReference}
                        disabled={loadingReferences}
                        className="px-4 py-2 rounded-lg bg-kiwi text-white hover:bg-kiwi-dark transition-colors disabled:bg-gray-400"
                      >
                        Mentés
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {references.map((ref, idx) => (
                    <div
                      key={ref.id || idx}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start space-x-6">
                          <img
                            src={ref.imageUrl}
                            alt={ref.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{ref.title}</h3>
                            <p className="text-gray-600 mb-3">{ref.description}</p>
                          {ref.images && ref.images.length > 0 && (
                              <div className="text-sm text-gray-500">
                                {ref.images.length} galéria kép
                              </div>
                          )}
                        </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditReference(idx)}
                              className="p-2 text-kiwi hover:bg-kiwi/10 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteReference(idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                      </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'carousel' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Körhinta képek kezelése</h2>
                <div className="flex space-x-3">
                   <button
                     onClick={handleAddCarouselImage}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-kiwi text-white hover:bg-kiwi-dark transition-colors"
                   >
                    <Plus size={18} className="mr-2" />
                     Új kép hozzáadása
                   </button>
                   <button
                     onClick={handleCarouselImagesResetClick}
                     disabled={initializingCarouselImages}
                    className={`p-2 rounded-lg transition-colors ${
                      initializingCarouselImages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                     title="Visszaállítás az eredeti körhinta képekre"
                   >
                    <RotateCcw size={18} />
                   </button>
                 </div>
              </div>

              {editCarouselImage ? (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kép</label>
                      <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={editCarouselImage.src}
                      onChange={e => setEditCarouselImage({ ...editCarouselImage, src: e.target.value })}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                          id="carousel-image-upload"
                        />
                        <label
                          htmlFor="carousel-image-upload"
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                            uploadingImage
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Upload size={18} className="mr-2" />
                          {uploadingImage ? 'Feltöltés...' : 'Kép feltöltése'}
                        </label>
                  </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alt szöveg (SEO)</label>
                    <input
                      type="text"
                      value={editCarouselImage.alt || ''}
                      onChange={e => setEditCarouselImage({ ...editCarouselImage, alt: e.target.value === '' ? null : e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                      placeholder="Kép leírása keresőmotoroknak"
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sorrend</label>
                     <input
                        type="number"
                        min="0"
                        value={editCarouselImage.sort_order}
                        onChange={e => setEditCarouselImage({ ...editCarouselImage, sort_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi"
                     />
                  </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={handleCancelCarouselImageEdit}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Mégse
                      </button>
                      <button
                        onClick={handleSaveCarouselImage}
                        disabled={loadingCarouselImages}
                        className="px-4 py-2 rounded-lg bg-kiwi text-white hover:bg-kiwi-dark transition-colors disabled:bg-gray-400"
                      >
                        Mentés
                      </button>
                  </div>
                </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {carouselImages.map((image, idx) => (
                    <div
                      key={image.id || idx}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start space-x-6">
                          <img
                            src={image.src}
                            alt={image.alt || 'Nincs alt szöveg'}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="text-sm text-gray-500 mb-2 truncate">{image.src}</div>
                            <div className="text-gray-600 mb-1">
                              Alt: {image.alt || 'Nincs megadva'}
                         </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500">Sorrend:</span>
                          <input
                             type="number"
                             min="0"
                             value={image.sort_order}
                             onChange={e => handleCarouselImageSortChange(image.id!, parseInt(e.target.value) || 0)}
                                className="w-20 px-2 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-kiwi focus:border-kiwi text-center"
                             title="Sorrend módosítása"
                          />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCarouselImage(idx)}
                              className="p-2 text-kiwi hover:bg-kiwi/10 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteCarouselImage(idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin; 