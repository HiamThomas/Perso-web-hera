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
                    <button @click="disableFreeHandRoi(this.element1)">Draw</button>
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
                    <button @click="disableFreeHandRoi(this.element2)">Draw</button>
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
import cornerstone from 'cornerstone-core'
import cornerstoneWebImageLoader from 'cornerstone-web-image-loader'
import cornerstoneTools from 'cornerstone-tools'
import cornerstoneMath from 'cornerstone-math';
import Hammer from 'hammerjs';

cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.init({
    mouseEnabled: true,
    touchEnabled: true,
    globalToolSyncEnabled: false,
    showSVGCursors: false,
});

cornerstone.registerImageLoader('http', cornerstoneWebImageLoader.loadImage)
cornerstone.registerImageLoader('https', cornerstoneWebImageLoader.loadImage)

const imageIds = [
    'https://i.postimg.cc/VNQJz0tX/1-01-dcm.png',
    'https://i.postimg.cc/CKGz5MCX/1-02-dcm.png',
    'https://i.postimg.cc/B6JtKWM6/1-03-dcm.png',
    'https://i.postimg.cc/1XttvGx1/1-04-dcm.png',
    'https://i.postimg.cc/PxKJb6RM/1-05-dcm.png',
    'https://i.postimg.cc/5tR852Q0/1-06-2-dcm.png',
    'https://i.postimg.cc/vBxf0w5v/1-07-2-dcm.png',
    'https://i.postimg.cc/d3MdXNBc/1-08-2-dcm.png',
    'https://i.postimg.cc/prD8tQGh/1-09-2-dcm.png',
    'https://i.postimg.cc/28Dh7Jy4/1-10-2-dcm.png',
    'https://i.postimg.cc/Wpr0rjNN/1-11-2-dcm.png',
    'https://i.postimg.cc/8zkvq6hc/1-12-2-dcm.png',
    'https://i.postimg.cc/zGdh5Gjj/1-13-2-dcm.png',
    'https://i.postimg.cc/J45J6qHS/1-14-2-dcm.png',
    'https://i.postimg.cc/N05H0vCw/1-15-2-dcm.png',
];

export default {
    name: 'ImageViewer',
    data() {
        return {
            element1: null,
            element2: null,
            zoomScale: 0,
            selectedFile: null,
            freehandRoi: false,
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

                    if (mouseButton === 2) {
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

            const mouseWheelEvents = ['leftClick', 'DOMLeftClick'];
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
        disableFreeHandRoi(element) {
            if (this.freehandRoi) {
                cornerstoneTools.setToolDisabledForElement(element, 'FreehandRoi');
                cornerstoneTools.setToolActiveForElement(element, 'Zoom', { mouseButtonMask: 1 })
            }
            else {
                cornerstoneTools.setToolActiveForElement(element, 'FreehandRoi', { mouseButtonMask: 1 })
                cornerstoneTools.setToolDisabledForElement(element, 'Zoom');
            }
            this.freehandRoi = !this.freehandRoi;
        },
        resetTools() {
            cornerstoneTools.setToolActive('Zoom');
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
            
            const stack = {
                currentImageIdIndex: 0,
                imageIds
            }
            cornerstone.loadImage(imageIds[0]).then((image) => {
                cornerstone.displayImage(element1, image)
                cornerstoneTools.addStackStateManager(element1, ['stack'])
                cornerstoneTools.addToolState(element1, 'stack', stack)
            })
            cornerstone.loadImage(imageIds[0]).then((image) => {
                cornerstone.displayImage(element2, image)
                cornerstoneTools.addStackStateManager(element2, ['stack'])
                cornerstoneTools.addToolState(element2, 'stack', stack)
            })
            this.element1 = element1;
            this.element2 = element2;

            //===================== TOOLS =====================
            cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
            cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 })
            cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool)
            cornerstoneTools.setToolActive('StackScrollMouseWheel', { })
            cornerstoneTools.addTool(cornerstoneTools.FreehandRoiTool)
            cornerstoneTools.setToolDisabled('FreehandRoi');
            this.element1.oncontextmenu = (e) => e.preventDefault();
            this.element2.oncontextmenu = (e) => e.preventDefault();
            this.addMouseEvent(this.element1);
            this.addMouseEvent(this.element2);
        },
    },
    async mounted() {
        await this.load();
        console.log(this.element1);
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
