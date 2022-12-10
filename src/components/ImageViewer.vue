<template>
    <div class="wrapper">
        <div id="content1"></div>
        <div id="content2"></div>
    </div>
</template>

<script>
import * as cornerstone from 'cornerstone-core'
import * as cornerstoneWebImageLoader from 'cornerstone-web-image-loader'

cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstone.registerImageLoader('http', cornerstoneWebImageLoader.loadImage)
cornerstone.registerImageLoader('https', cornerstoneWebImageLoader.loadImage)
const imageId = "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg"

export default {
    name: 'ImageViewer',
    data() {
        return {
        }
    },
    methods: {
        async onLoad() {
            const element1 = document.getElementById('content1');
            const element2 = document.getElementById('content2');
            cornerstone.enable(element1);
            cornerstone.enable(element2);

            cornerstone.loadImage(imageId).then(function (image) {
                cornerstone.displayImage(element1, image)
            })
            cornerstone.loadImage(imageId).then(function (image) {
                cornerstone.displayImage(element2, image)
            })
        }
    },
    async mounted() {
        this.onLoad();
    }
}
</script>

<style scoped>
    #content1{
        width: 100%;
        height: 70%;
        align-self: center;
    }
    #content2{
        width: 100%;
        height: 70%;
        align-self: center;
    }
    .wrapper{
        display: flex;
        width: 100%;
        height: 100vh;
    }
</style>
