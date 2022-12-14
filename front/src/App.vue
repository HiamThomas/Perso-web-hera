<template>
  <ImageViewer/>
</template>

<script>
import ImageViewer from './components/ImageViewer.vue'

export default {
  name: 'App',
  components: {
    ImageViewer
  }
}
</script>

<style>
  *{
    margin: 0;
  }
  #app{
    height: 100%;
    width: 100%;
  }
</style>
