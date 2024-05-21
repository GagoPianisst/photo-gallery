<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Ajustes</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-label>Calidad de la imagen</ion-label>
          <ion-select v-model="quality" @ionChange="saveQuality">
            <ion-select-option value="low">Baja</ion-select-option>
            <ion-select-option value="medium">Media</ion-select-option>
            <ion-select-option value="high">Alta</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Sincronizar con la nube</ion-label>
          <ion-toggle v-model="syncWithCloud" @ionChange="toggleSync"></ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Preferences } from '@capacitor/preferences';

const quality = ref('high');
const syncWithCloud = ref(false);

const saveQuality = async () => {
  await Preferences.set({ key: 'quality', value: quality.value });
};

const toggleSync = async () => {
  await Preferences.set({ key: 'syncWithCloud', value: syncWithCloud.value.toString() });
};

// Load initial settings
const loadSettings = async () => {
  const qualitySetting = await Preferences.get({ key: 'quality' });
  if (qualitySetting.value) {
    quality.value = qualitySetting.value;
  }

  const syncSetting = await Preferences.get({ key: 'syncWithCloud' });
  if (syncSetting.value) {
    syncWithCloud.value = syncSetting.value === 'true';
  }
};

loadSettings();
</script>

