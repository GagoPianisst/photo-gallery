const photos = ref<UserPhoto[]>([]);
const convertBlobToBase64 = (blob: Blob) =>
    new Promise ((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
const savePicture = async(photo: Photo, fileName: string): Promise<UserPhoto> => {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = (await convertBlobToBase64(blob)) as string;

    const saveFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
    });

    return {
        filepath: fileName,
        webviewPath: photo.webPath,
    };
};

import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/fileSystem';
import { Preferences } from '@capacitor/preferences';

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
        
    };

    const fileName = Date.now() + '.jpeg';
    const savedFileImage = await savePicture(photo, fileName);

    photos.value = [savedFileImage, ...photos.value];

    return {
        photos,
        takePhoto,
    };
};