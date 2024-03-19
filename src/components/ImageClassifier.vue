<template>
  <div>
    <video autoplay ref="video"></video>
    <button @click="classify()">Classify!</button>
    <p v-if="label">{{label}}</p>
  </div>
</template>

<script>
import { createImageClassifier } from '../services/ml5Service.js';

export default {
  data() {
    return {
      classifier: null,
      label: null
    }
  },
  mounted() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: { facingMode: "user" },
      })
      .then(stream => {
        console.log('Video stream:', stream); // Log the stream behind accessed
        this.$refs.video.srcObject = stream;
        this.$refs.video.play();
        this.$nextTick(() => {
          this.createClassifier();
        });
      })
      .catch((err) => {
        console.error(`User Media Error: ${err}`);
      });
    } else {
      console.error("mediaDevices or getUserMedia not supported.");
    }
  },
  methods: {
    createClassifier() {
      this.classifier = createImageClassifier('MobileNet', this.$refs.video, {}, () => {
        console.log('Image Classifier model loaded');
      });
    },
    classify() {
      if (this.classifier) {
        console.log(this.$refs.video)
        this.classifier.predict(this.$refs.video, (err, results) => {
          if (err) {
            console.error(err);
            return;
          }
          this.label = results[0].className; // Show the first classification result
        });
      }
    }
  }
}
</script>