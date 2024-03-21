<template>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div id="canvas-container" @drop="onDrop" @mousedown="startDrawing" @mouseleave="stopDrawing" @mousemove="draw"
         @mouseup="stopDrawing" @dragover.prevent></div>
    <button @click="clearCanvas">Clear Canvas</button>
    <h2>
      Drawing: {{ label }} (Confidence: {{ confidence }} %)
    </h2>
  </div>
</template>

<script lang="ts" setup>
import { imageClassifier } from 'ml5'
import p5 from 'p5'
import { onMounted, ref } from 'vue'

let classifier
let sketchInstance
let label = ref('')
let confidence = ref('')
let drawing = false
let previousX
let previousY

function draw () {
  if (!drawing) return
  const currentX = sketchInstance.mouseX
  const currentY = sketchInstance.mouseY
  sketchInstance.strokeWeight(16)
  sketchInstance.line(previousX, previousY, currentX, currentY)
  previousX = currentX
  previousY = currentY
  classifyImage()
}

function startDrawing () {
  drawing = true
  previousX = sketchInstance.mouseX
  previousY = sketchInstance.mouseY
}

function stopDrawing () {
  drawing = false
}

function clearCanvas () {
  sketchInstance.background(255)
  label.value = ''
  confidence.value = ''
}

function setupP5Instance (p5Object) {
  let canvas = p5Object.createCanvas(400, 400)
  canvas.parent('canvas-container')
  p5Object.background(255)
}

function gotPredictionResults (error, results) {
  if (error) console.error('ERROR', error)
  else {
    label.value = results[0]?.label
    confidence.value = results[0]?.confidence.toFixed(2) * 100
  }
}

async function classifyImage () {
  classifier.classify(sketchInstance.get(), gotPredictionResults)
}

onMounted(async () => {
  const p5Init = p5Object => {
    sketchInstance = p5Object
    p5Object.setup = function () {
      setupP5Instance(p5Object)
    }
  }

  new p5(p5Init) // Instantiate new p5 object
  classifier = await imageClassifier('DoodleNet') // Initialize image classifier
})

const loadImage = (url) => {
  sketchInstance.loadImage(url, () => {
    classifyImage()
  })
}
</script>
