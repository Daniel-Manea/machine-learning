<template>
  <div>
    <button :class="{ active: context === 'image' }" @click="changeContext('image')">
      Image
    </button>
    <button :class="{ active: context === 'url' }" @click="changeContext('url')">
      URL
    </button>
    <button :class="{ active: context === 'video' }" @click="changeContext('video')">
      Video
    </button>
    <div v-if="context === 'image'">
      <ImageDropClassifier/>
    </div>
    <div v-else-if="context === 'url'">
      <!-- Display Image element here -->
      <ImageClassifier/>
    </div>
    <div v-else>
      <DrawingClassifier/>
    </div>
  </div>
</template>

<script setup>
import ImageClassifier from './components/ImageClassifier.vue';
import {ref} from 'vue';
import ImageDropClassifier from './components/ImageDropClassifier.vue';
import DrawingClassifier from './components/DrawingClassifier.vue';

let context = ref('image');

function changeContext(newContext) {
  context.value = newContext;
}
</script>

<style>
.active {
  background-color: lightblue;
}

button {
  margin-right: 10px;
}
</style>
