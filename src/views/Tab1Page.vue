<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Galería de Fotos</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="6" v-for="photo in photos" :key="photo.filepath">
            <ion-img :src="photo.webviewPath" @click="viewPhoto(photo)"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-modal v-if="selectedPhoto" @didDismiss="selectedPhoto = null">
        <img :src="selectedPhoto.webviewPath" alt="Selected Photo">
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePhotoGallery, UserPhoto } from '@/composables/usePhotoGallery';

const { photos } = usePhotoGallery();
const selectedPhoto = ref<UserPhoto | null>(null);

const viewPhoto = (photo: UserPhoto) => {
  selectedPhoto.value = photo;
};
</script>
