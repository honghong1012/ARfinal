
AFRAME.registerComponent('rotation-reader', {
    /**
     * We use IIFE (immediately-invoked function expression) to only allocate one
     * vector or euler and not re-create on every tick to save memory.
     */
      tick: (function () {
          
          return function () {
              if (room.userHead) {
                  room.userHead.position.copy(this.el.object3D.position)
                  room.userHead.rotation.copy(this.el.object3D.rotation)
              }
  
          };
      })()
  });
  
  Vue.component("room-scene", {
      template: `<a-scene>
  
          
          <!--------- ASSETS ---------->
          <a-assets>
              <img id="sky" src="img/textures/sky-night.png">
              <img id="glow" src="https://cdn.glitch.global/44e8be34-cfe8-4e64-8092-2d51a3c000d6/glow.png?v=1651450524552">
              <a-asset-item id="tree1" src="models/arbol1/scene.gltf"></a-asset-item>
              <a-asset-item id="tree2" src="models/arbol2/scene.gltf"></a-asset-item>
              <a-asset-item id="anya" src="models/anya/scene.gltf"</a-asset-item>
  
          </a-assets>
          
          <!--------- CAMERA --------->
  
          <a-camera id="camera" rotation-reader>
              <a-cursor></a-cursor>
  
              <!-------- Output text ----->
              <a-text 
                  v-if="room.userHead"
                  width=".8"
                  color="black"
                  :value="room.userHead.position.toFixed(2)" 
                  position="-.7 .7 -1">
              </a-text>
              
              <a-text 
                  width="2"
                  color="black"
                  :value="room.titleText" 
                  position="-.7 .6 -1">
              </a-text>
              <a-text 
                  width="1"
                  color="black"
                  :value="room.detailText" 
                  position="-.7 .5 -1">
              </a-text>
              
          </a-camera>
          
          <obj-world :room="room" />
  
          
          <a-entity position="0 0 0">
              <a-entity text="value:hello;font:/fonts/helvetica-sdf.fnt; fontImage:/fonts/helvetica-sdf.png;width:10;color:black" position="0 1 0"></a-entity>
              
              <!--------- ALL THE OBJECTS YOU'VE MADE --------->
              <live-object  v-for="obj in room.objects" :key="obj.uid" :obj="obj" v-if="obj.room.userHead !== obj" />
          </a-entity>
  
  
      </a-scene>`,
  
      methods: {
          camtick() {
              console.log("cam")
          }
      },
      mounted() {
          // Create 
      },
  
      data() {
          return  {
              
          }
      },
  
      props: ["room"],
  })