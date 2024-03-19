<script lang="ts" setup>
import { imageClassifier } from 'ml5'
import p5 from 'p5'
import { onMounted, ref } from 'vue'

let classifier
let puffin
let sketchInstance
let label = ref('')

function drawImage () {
  sketchInstance.clear()
  sketchInstance.image(puffin, 0, 0, sketchInstance.width, sketchInstance.height)
}

function setupP5Instance (p5Object) {
  let canvas = p5Object.createCanvas(640, 480)
  canvas.parent('canvas-container')
  p5Object.fill(0)
  p5Object.background(0)
}

function gotPredictionResults (error, results) {
  if (error) console.error('ERROR', error)
  else label.value = results[0]?.label
}

async function classifyImage () {
  console.log('Model ready')
  classifier.predict(puffin, gotPredictionResults)
}

onMounted(async () => {
  puffin = new p5.Image()
  const p5Init = p5Object => {
    sketchInstance = p5Object
    p5Object.setup = function () {
      setupP5Instance(p5Object)
    }
  }

  new p5(p5Init) // Instantiate new p5 object
  classifier = await imageClassifier('MobileNet') // Initialize image classifier
})

const loadImage = (url) => new Promise((resolve) => {
  puffin = sketchInstance.loadImage(url, () => {
    drawImage()
    resolve()
  })
})

const onImageUrlChange = async event => {
  await loadImage(event.target.value)
  classifyImage()
}
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div id="canvas-container"></div>
    <input placeholder="Enter image URL" type="text" @change="onImageUrlChange">
    <h2>
      {{ label }}
    </h2>
  </div>
</template>