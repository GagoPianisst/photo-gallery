import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem'; // Cambiado de '@capacitor/fileSystem' a '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';


const photos = ref<UserPhoto[]>([]);
const PHOTO_STORAGE = "photos";
const convertBlobToBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result as string); 
        };
        reader.readAsDataURL(blob);
    });
const savePicture = async(photo: Photo, fileName: string): Promise<UserPhoto> => {
    let base64Data: string | Blob;
    if (isPlatform('hybrid')) {
        const file = await Filesystem.readFile({
            path: photo.path!,
        });
        base64Data = file.data;
    } else {
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
        base64Data = await convertBlobToBase64(blob); // Esperar la promesa convertBlobToBase64
    }
    const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
    });

    if (isPlatform('hybrid')) {
        return {
            filepath: fileName,
            webviewPath: photo.webPath,
        };
    } else {
        return {
            filepath: fileName,
            webviewPath: photo.webPath,
        };
    }
};

const cachePhotos = () => {
    Preferences.set({
        key: PHOTO_STORAGE,
        value: JSON.stringify(photos.value),
    });
};

const loadSaved = async () => {
    const photoList = await Preferences.get({ key: PHOTO_STORAGE });
    const photosInPreferences = photoList.value ? JSON.parse(photoList.value) : [];

    if (!isPlatform('hybrid')) {
        for (const photo of photosInPreferences) {
            const file = await Filesystem.readFile({
                path: photo.filepath,
                directory: Directory.Data,
            });
            photo.webviewPath = `data:image/jpeg;base64,${file.data}`; // Cambiado de image-jpeg a jpeg
        }
    }
    photos.value = photosInPreferences;
};

onMounted(loadSaved);

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

export const usePhotoGallery = () => {
    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        const fileName = Date.now() + '.jpeg';
        const savedFileImage = await savePicture(photo, fileName);
    
        photos.value = [savedFileImage, ...photos.value];
    };

    return {
        photos,
        takePhoto,
    };
};
