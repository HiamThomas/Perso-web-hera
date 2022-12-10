<template>
    <div class="container">
        <input type="file" @change="onFileSelected">
        <div class="wrapper">
            <div class="element">
                <div class="buttons">
                    <button id="zoomInElement1" type="button" @click="buttonToolInteraction(1, this.element1)">+</button>
                    <button id="zoomOutElement1" type="button" @click="buttonToolInteraction(2, this.element1)">-</button>
                    <button id="hFlip" type="button" @click="buttonToolInteraction(3, this.element1)">HFlip</button>
                    <button id="vFlip" type="button" @click="buttonToolInteraction(4, this.element1)">VFlip</button>
                    <button id="lRotate" type="button" @click="buttonToolInteraction(5, this.element1)">Rotate Left</button>
                    <button id="rRotate" type="button" @click="buttonToolInteraction(6, this.element1)">Rotate Right</button>
                    <button id="resetElement1" type="button" @click="resetTools(this.element1)">Reset</button>
                </div>
                <div class="content" id="content1">
                    <div class="zoom-text" id="zoom-text-content1">zoom:0</div>
                    <div class="ww-wl-text" id="ww-wl-text-content1"></div>
                </div>
            </div>
            <div class="element">
                <div class="buttons">
                    <button id="zoomInElement1" type="button" @click="buttonToolInteraction(1, this.element2)">+</button>
                    <button id="zoomOutElement1" type="button" @click="buttonToolInteraction(2, this.element2)">-</button>
                    <button id="hFlip" type="button" @click="buttonToolInteraction(3, this.element2)">HFlip</button>
                    <button id="vFlip" type="button" @click="buttonToolInteraction(4, this.element2)">VFlip</button>
                    <button id="lRotate" type="button" @click="buttonToolInteraction(5, this.element2)">Rotate Left</button>
                    <button id="rRotate" type="button" @click="buttonToolInteraction(6, this.element2)">Rotate Right</button>
                    <button id="resetElement1" type="button" @click="resetTools(this.element2)">Reset</button>
                </div>
                <div class="content" id="content2">
                    <div class="zoom-text" id="zoom-text-content2">zoom:0</div>
                    <div class="ww-wl-text" id="ww-wl-text-content2"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as cornerstone from 'cornerstone-core'
import * as cornerstoneWebImageLoader from 'cornerstone-web-image-loader'
import * as cornerstoneTools from 'cornerstone-tools'

cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstone = cornerstone;

cornerstone.registerImageLoader('http', cornerstoneWebImageLoader.loadImage)
cornerstone.registerImageLoader('https', cornerstoneWebImageLoader.loadImage)


const imageId = "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg"

export default {
    name: 'ImageViewer',
    data() {
        return {
            element1: null,
            element2: null,
            zoomScale: 0,
            selectedFile: null,
        }
    },
    methods: {
        addMouseEvent(element) {
            element.addEventListener('mousedown', function (e) {
                let lastX = e.pageX;
                let lastY = e.pageY;
                const mouseButton = e.which;

                function mouseMoveHandler(e) {
                    const deltaX = e.pageX - lastX;
                    const deltaY = e.pageY - lastY;
                    lastX = e.pageX;
                    lastY = e.pageY;

                    if (mouseButton === 1) {
                        let viewport = cornerstone.getViewport(element);
                        viewport.translation.x += (deltaX / viewport.scale);
                        viewport.translation.y += (deltaY / viewport.scale);
                        cornerstone.setViewport(element, viewport);
                    } else if (mouseButton === 3) {
                        let viewport = cornerstone.getViewport(element);
                        viewport.voi.windowWidth += (deltaX / viewport.scale);
                        viewport.voi.windowCenter += (deltaY / viewport.scale);
                        cornerstone.setViewport(element, viewport);
                    }
                }
                function mouseUpHandler() {
                    document.removeEventListener('mouseup', mouseUpHandler);
                    document.removeEventListener('mousemove', mouseMoveHandler);
                }
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            });

            const mouseWheelEvents = ['mousewheel', 'DOMMouseScroll'];
            mouseWheelEvents.forEach(function(eventType) {
                element.addEventListener(eventType, function (e) {
                    let viewport = cornerstone.getViewport(element);
                    if (e.wheelDelta < 0 || e.detail > 0) {
                        viewport.scale -= 0.25;
                    } else {
                        viewport.scale += 0.25;
                    }
                    cornerstone.setViewport(element, viewport);
                    return false;
                });
            });
        },
        buttonToolInteraction (tool, element) {
            const viewport = cornerstone.getViewport(element);
            switch(tool) {
                case 1 :
                    viewport.scale += 0.25;
                    break;
                case 2 :
                    viewport.scale -= 0.25;
                    break;
                case 3 :
                    viewport.hflip = !viewport.hflip;
                    break;
                case 4 :
                    viewport.vflip = !viewport.vflip;
                    break;
                case 5 :
                    viewport.rotation-=90;
                    break;
                case 6 :
                    viewport.rotation+=90;
                    break;
            }
            cornerstone.setViewport(element, viewport);
        },
        resetTools(element) {
            cornerstone.reset(element);
        },
        onFileSelected(event) {
            this.selectedFile = event.target.files[0];
            console.log("file: ",this.selectedFile);
            console.log("this.selectedFile.getWebkitRelativePath(): ",this.selectedFile.webkitRelativePath);
            
        },
        async load() {
            //=================== Load Image ===================
            const element1 = document.getElementById('content1');
            const element2 = document.getElementById('content2');
            cornerstone.enable(element1);
            cornerstone.enable(element2);

            element1.addEventListener('cornerstoneimagerendered', (e)=> {
                document.getElementById('ww-wl-text-content1').textContent = "WW/WL:" + Math.round(e.detail.viewport.voi.windowWidth) + "/" + Math.round(e.detail.viewport.voi.windowCenter);
                document.getElementById('zoom-text-content1').textContent = "Zoom:" + e.detail.viewport.scale.toFixed(2);
            });
            element2.addEventListener('cornerstoneimagerendered', (e)=> {
                document.getElementById('ww-wl-text-content2').textContent = "WW/WL:" + Math.round(e.detail.viewport.voi.windowWidth) + "/" + Math.round(e.detail.viewport.voi.windowCenter);
                document.getElementById('zoom-text-content2').textContent = "Zoom:" + e.detail.viewport.scale.toFixed(2);
            });

            cornerstone.loadImage(imageId).then((image) => { cornerstone.displayImage(element1, image) })
            cornerstone.loadImage(imageId).then((image) => { cornerstone.displayImage(element2, image) })
            this.element1 = element1;
            this.element2 = element2;

            //===================== TOOLS =====================
            this.element1.oncontextmenu = (e) => e.preventDefault();
            this.element2.oncontextmenu = (e) => e.preventDefault();
            this.addMouseEvent(this.element1);
            this.addMouseEvent(this.element2);
        },
    },
    async mounted() {
        await this.load();
    }
}
</script>

<style scoped>
    .buttons{
        display: flex;
    }
    .container{
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
    }
    .wrapper{
        display: flex;
        justify-content: space-around;
        width: 100%;
        height: 100%;
    }
    .element{
        height: 80%;
        width: 40%;
        margin: auto;
    }
    .content{
        position: relative;
        width: 100%;
        height: 100%;
    }
    .zoom-text{
        position: absolute;
        color: white;
        bottom: 0;
        right: 0;
    }
    .ww-wl-text{
        position: absolute;
        color: white;
        bottom: 0;
        left: 0;
    }
</style>
