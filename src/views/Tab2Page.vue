<script setup lang="ts">
import { usePhotoGallery, UserPhoto } from '@/composables/usePhotoGallery';
import { camera, trash, close } from 'ionicons/icons';
import {
  IonContent,
  IonCol,
  IonFab,
  IonFabButton,
  IonGrid,
  IonPage,
  IonHeader,
  IonIcon,
  IonImg,
  IonRow,
  IonTitle,
  IonToolbar,
  actionSheetController
} from '@ionic/vue';

const { photos, takePhoto, deletePhoto } = usePhotoGallery();

const showActionSheet = async (photo: UserPhoto) => {
  const actionSheet = await actionSheetController.create({
    header: 'Photos',
    buttons: [
      {
        text: 'Delete',
        role: 'destructive',
        icon: trash,
        handler: () => {
          deletePhoto(photo);
        },
      },
      {
        text: 'Cancel',
        icon: close,
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
        },
      },
    ],
  });
  await actionSheet.present();
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Galeria de Fotos Proyecto Final</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="photo in photos" :key="photo.filepath">
            <ion-img :src="photo.webviewPath" @click="showActionSheet(photo)"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>
