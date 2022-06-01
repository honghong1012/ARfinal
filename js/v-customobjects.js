const fakeBodyCount = 10
const fakeBodySteps = 500

// Decorate the head of our guests
Vue.component("obj-head", {
	template: `<a-entity>
		<a-sphere 
			shadow
			:radius="headSize"
			:color="obj.color.toHex()" 
				
			>
			<obj-axes scale=".1 .1 .1" v-if="true" />
		</a-sphere>

		<a-box v-for="(spike,index) in spikes"
			:depth="headSize*2"
			:height="headSize*.2"
			:width="headSize*2"
			:position="spike.position.toAFrame(0, .2, 0)"
			:rotation="spike.rotation.toAFrame()"
			:color="obj.color.toHex(Math.sin(index))" 
				
			>
		
		</a-box>
	</a-entity>
	`,
	computed: {
		color() {
			return this.obj.color.toHex?this.obj.color.toHex():this.obj.color
		},
		headSize() {
			return this.obj.size instanceof Vector ? this.obj.size.x : this.obj.size
		},
	},

	data() {
		let spikeCount = 5
		let spikes = []

		for (var i = 0; i < spikeCount; i++) {
			let h = .1
			let spike = new LiveObject(undefined, { 
				size: new THREE.Vector3(h*.2, h, h*.2),
				color: new Vector(noise(i)*30 + 140, 0, 40 + 20*noise(i*3))
			})
			let r = .2
			// Put them on the other side
			let theta = 2*noise(i*10) + 3
			spike.position.setToCylindrical(r, theta, h*.3)
			// Look randomly
			spike.lookAt(0, 3, 0)
			spikes.push(spike)
		}

		return {
			spikes: spikes
		}
	},

	mounted() {
		console.log(this.headSize)
	},
	props: ["obj"]
})


Vue.component("obj-fire", {
	template: `
	<a-entity>
		<a-sphere 
			color="grey"
			radius=2 
			scale="1 .3 1" 
			roughness=1
			segments-height="5"
			segments-width="10"
			theta-start=0
			theta-length=60
			position="0 -.4 0"
			>
		</a-sphere>
		<a-cone
			position="0 .2 0"
			@click="click"
			:animation="heightAnimation"
			:color="obj.color.toHex()"
			height=.2
			radius-bottom=".2"

			:scale="(obj.fireStrength*.2 + 1) + ' ' + .1*obj.fireStrength + ' ' + (obj.fireStrength*.2 + 1)"
			:material="fireMaterial">

		</a-cone>

		<a-light
			:animation="intensityAnimation"

			position="0 1 0"
			intensity="2"
			:color="obj.color.toHex()"
			type="point"
			:distance="obj.fireStrength*4 + 10"
			decay="2">
		</a-light>
	</a-entity>

	`,

	// Values computed on the fly
	computed: {
		fireMaterial() {
			return `emissive:${this.obj.color.toHex(.2)}`
		},
		
		animationSpeed() {
			return 500
		},
		intensityAnimation() {
			return `property: intensity; from:.3; to:.6; dir:alternate;dur: ${this.animationSpeed}; easing:easeInOutQuad;loop:true`
		},
		heightAnimation() {
			return `property: height; from:${this.obj.fireStrength};to:${this.obj.fireStrength*2}; dir:alternate;dur: 500; easing:easeInOutQuad;loop:true`
		}
	},

	methods: {
		click() {
			this.obj.fireStrength += 1
			this.obj.fireStrength = this.obj.fireStrength%10 + 1

			// Tell the server about this action
			this.obj.post()
		}
	},

	// this function runs once when this object is created
	mounted() {

	},



	props: ["obj"]


})



Vue.component("obj-world", {

	template: `
	<a-entity>
		<!--------- SKYBOX --------->
		<a-sky color="#270d2c"></a-sky>

		<a-plane 
			roughness="1"
			shadow 
			color="#52430e"
			height="100" 
			width="100" 
			rotation="-90 0 0">
		</a-plane>

		<!---- lights ----> 
		<a-entity light="type: ambient; intensity: 0.4;" color="white"></a-entity>
		<a-light type="directional" 
			position="0 0 0" 
			rotation="-90 0 0" 
			intensity="0.4"
			castShadow target="#directionaltarget">
			<a-entity id="directionaltarget" position="-10 0 -20"></a-entity>
		</a-light>
		
		<a-entity gltf-model="url(models/arbol1/scene.gltf)" 
		v-for="(tree,index) in trees"
			:key="'tree' + index"
			shadow 			
			:rotation="tree.rotation.toAFrame()"
			:position="tree.position.toAFrame()">
		</a-entity>

		<a-entity gltf-model="url(models/arbol1/scene.gltf)" position="0 10 0"></a-entity>
		<a-entity gltf-model="url(models/pine_tree/scene.gltf)" scale="0.7 0.7 0.7"
		v-for="(tree,index) in trees3"
			:key="'tree3' + index"
			shadow 			
			:rotation="tree.rotation.toAFrame()"
			:position="tree.position.toAFrame()">
		</a-entity>

		<a-entity gltf-model="url(models/night_mushrooms/scene.gltf)" scale="0.3 0.3 0.3"
		v-for="(mushroom,index) in mushrooms"
			:key="'mushroom' + index"
			shadow 			
			:rotation="mushroom.rotation.toAFrame()"
			:position="mushroom.position.toAFrame()">
		</a-entity>

		<a-entity gltf-model="url(models/arbol2/scene.gltf)" 
		v-for="(tree,index) in trees2"
			:key="'tree2' + index"
			shadow 			
			:rotation="tree.rotation.toAFrame()"
			:position="tree.position.toAFrame()">
		</a-entity>

		<a-entity gltf-model="url(models/wooden_stool/scene.gltf)" scale="0.02 0.02 0.02"
		v-for="(stool,index) in stools"
			:key="'stool' + index"
			shadow    
			:rotation="stool.rotation.toAFrame()"
			:position="stool.position.toAFrame()">
		</a-entity>

		<a-entity gltf-model="url(models/wooden_stool/scene.gltf)" scale="0.02 0.02 0.02"
		v-for="(stool,index) in stools2"
			:key="'stool' + index"
			shadow    
			:rotation="stool.rotation.toAFrame()"
			:position="stool.position.toAFrame()">
		</a-entity>


		<a-entity gltf-model="url(models/neon_serendipity_sign/scene.gltf)" 
			position="-1.5 2.5 -6"
			rotation = "0 30 0">
		</a-entity>

		<a-entity gltf-model="url(models/beer/scene.gltf)" 
			position="-1.6 0.82 -5"
			scale = "3 3 3"
			rotation = "0 0 0">
		</a-entity>

		<a-entity gltf-model="url(models/cocktail_martini/scene.gltf)" 
			position="-1 0.82 -5"
			scale = "2 2 2"
			rotation = "0 0 0">
		</a-entity>

		<a-entity gltf-model="url(models/table_and_chair/scene.gltf)" 
			position="-1 0 -5"
			scale = "1 1 1"
			rotation = "0 40 0">
		</a-entity>

		<a-entity gltf-model="url(models/restaurant_sign/scene.gltf)" 
			position="3 1 5"
			scale = "0.5 0.5 0.5"
			rotation = "0 30 0">
		</a-entity>

		<a-box 
			v-for="(rock,index) in rocks"
			:key="'rock' + index"
			shadow 

			roughness="1"

			:color="rock.color.toHex()"
			:width="rock.size.x" 
			:depth="rock.size.z" 
			:height="rock.size.y" 
			
			:rotation="rock.rotation.toAFrame()"
			:position="rock.position.toAFrame()">
		</a-box>
		<a-entity gltf-model="url(models/anya/scene.gltf)" 
			position="0 0 -10" 
			animation="property: rotation; to: 0 360 0; loop: true; dur: 1000; pauseEvents:click; "
			>
		</a-entity>

		<a-entity gltf-model="url(models/bar_house/scene.gltf)" 
			position="1 0 10"
			scale = "5 5 5"
			rotation = "0 160 0">
		</a-entity>

		<a-entity 
			v-for="(ball,index) in balls"
			:key="'ball' + index"
			:position="ball.position.toAFrame()">
			<a-sphere radius="0.2" material="emissive: yellow; emissive-intensity: 0.6;"></a-sphere>
			<a-image width="1" height="1" src="#glow" color="yellow" material="transparent: true; opacity: 1.0; alphaTest: 0.01;"></a-image>
		</a-entity>
	</a-entity>
		`,

	data() {
		// Where we setup the data that this *rendered scene needs*

		// EXAMPLE: Generated landscape
		// Make some random trees and rocks
		// Create a lot of LiveObjects (just as a way 
		//  to store size and color conveniently)
		// Interpret them as whatever A-Frame geometry you want!
		// Cones, spheres, entities with multiple ...things?
		// If you only use "noise" and not "random", 
		// everyone will have the same view. (Wordle-style!)
		let trees = []
		let count = 10
		for (var i = 0; i < count; i++) {
			let h = 6 + 4*noise(i) // Size from 1 to 3
			let tree = new LiveObject(undefined, { 
				size: new THREE.Vector3(.3, h, .3),
				color: new Vector(noise(i*50)*30 + 160, 100, 40 + 10*noise(i*10))
			})
			let r = 20 + 20*noise(i*30)
			let theta = 2*noise(i*20)
			tree.position.setToCylindrical(r, theta, h/2)
			tree.lookAt(0,1,0)
			trees.push(tree)
		}

		let trees2 = []
		let tree2Count = 10
		for (var i = 0; i < tree2Count; i++) {
			let h = 6 + noise(i * 10) // Size from 1 to 3
			let tree = new LiveObject(undefined, { 
				size: new THREE.Vector3(.3, h, .3),
				color: new Vector(noise(i*50)*30 + 160, 100, 40 + 10*noise(i*10))
			})
			let r = 5 + 20*noise(i)
			let theta = 20 * i + noise(i)
			tree.position.setToCylindrical(r, theta, h/2)
			tree.lookAt(0,2,0)
			trees2.push(tree)
		}

		let trees3 = []
		let tree3Count = 10
		for (var i = 0; i < tree3Count; i++) {
			let h = noise(i) // Size from 1 to 3
			let tree = new LiveObject(undefined, { 
				size: new THREE.Vector3(.3, h, .3),
				color: new Vector(noise(i*50)*30 + 160, 100, 40 + 10*noise(i*10))
			})
			let r = 20 + 15*noise(i)
			let theta = 18 * i + noise(i*20)
			tree.position.setToCylindrical(r, theta, h/2)
			tree.lookAt(0,0,0)
			trees3.push(tree)
		}

		let rocks = []
		let rockCount = 10
		for (var i = 0; i < rockCount; i++) {
			let h = 1.2 + noise(i*100) // Size from 1 to 3
			let rock = new LiveObject(undefined, { 
				size: new THREE.Vector3(h, h, h),
				color: new Vector(noise(i)*30 + 140, 0, 40 + 20*noise(i*3))
			})
			let r = 10 + 5*noise(i*1)
			// Put them on the other side
			let theta = 2*noise(i*10) + 3
			rock.position.setToCylindrical(r, theta, h*.3)
			// Look randomly
			rock.lookAt(Math.random()*100,Math.random()*100,Math.random()*100)
			rocks.push(rock)
		}

		let balls = []
		let ballCount = 50
		for (var i = 0; i < ballCount; i++) {
			let h = 4 + noise(i*50) // Size from 1 to 3
			let ball = new LiveObject(undefined, { 
				size: new THREE.Vector3(h, h, h),
				color: new Vector(noise(i)*30 + 140, 0, 40 + 20*noise(i*3))
			})
			let r = 30*noise(i*10)
			let theta = noise(i)*10 + 30
			ball.position.setToCylindrical(r, theta, h*2)
			// Look randomly
			ball.lookAt(Math.random()*100,Math.random()*100,Math.random()*100)
			balls.push(ball)
		}

		let mushrooms = []
		let mushroomsCount = 30
		for (var i = 0; i < mushroomsCount; i++) {
			let h = 0 // Size from 1 to 3
			let mushroom = new LiveObject(undefined, { 
				size: new THREE.Vector3(.3, h, .3),
				color: new Vector(noise(i*50)*30 + 160, 100, 40 + 10*noise(i*10))
			})
			let r =  15 + 20*noise(i)
			let theta = 20*i + noise(i*20)
			mushroom.position.setToCylindrical(r, theta, h/2)
			mushroom.lookAt(0,0,0)
			mushrooms.push(mushroom)
		}

		let stools = []
		let stoolsCount = 5
		for (var i = 0; i < stoolsCount; i++) {
		let h = 0 // Size from 1 to 3
			let stool = new LiveObject(undefined, { 
				size: new THREE.Vector3(.3, h, .3),
				color: new Vector(noise(i*50)*30 + 160, 100, 40 + 10*noise(i*10))
			})
			let r =  5 + 20*noise(i)
			let theta = 20*i + noise(i*20)
			stool.position.setToCylindrical(r - 5, 2, h/2)
			stool.lookAt(0,0,0)
			stools.push(stool)
		}

		let stools2 = []
		let stoolsCount2 = 10
		for (var i = 0; i < stoolsCount2; i++) {
		let h = 0 // Size from 1 to 3
			let stool = new LiveObject(undefined, { 
				size: new THREE.Vector3(.3, h, .3),
				color: new Vector(noise(i*50)*30 + 160, 100, 40 + 10*noise(i*10))
			})
			let r =  5 + 20*noise(i)
			let theta = 20*i + noise(i*20)
			stool.position.setToCylindrical(r, theta, h/2)
			stool.lookAt(0,0,0)
			stools2.push(stool)
		}


		return {
			trees: trees,
			trees2: trees2,
			trees3: trees3,
			rocks: rocks,
			balls: balls,
			mushrooms: mushrooms,
			stools: stools,
		}
	},

	mounted() {
		// Create a fire object
		// Attach this liveobject to the ROOM
		// and then the room deals with drawing it to AFRAME
		let fire = new LiveObject(this.room, {
			paritype: "fire",  // Tells it which type to use
			uid: "fire0",
			onUpdate({t, dt, frameCount}) {
				let hue = (noise(t*.02)+1)*180
				Vue.set(this.color.v, 0, hue)
				
				// console.log(this.color[0] )
			}
		})

		fire.position.set(1, 0, -2)
		fire.fireStrength = 1

		// let fire2 = new LiveObject(this.room, {
		// 	paritype: "fire",  // Tells it which type to use
		// 	uid: "fire2",
		// 	onUpdate({t, dt, frameCount}) {
		// 		let hue = (noise(t*.02)+1)*180
		// 		Vue.set(this.color.v, 0, hue)
				
		// 		// console.log(this.color[0] )
		// 	}
		// })

		// fire2.position.set(3, 0, -4)
		// fire2.fireStrength = 7

		
		let grammar = new tracery.createGrammar(  {
			songStyle : ", played as #song.a#, on #musicModifier# #instrument#",
			instrument : ["ukulele", "vocals", "guitar", "clarinet", "piano", "harmonica", "sitar", "tabla", "harp", "dulcimer", "violin", "accordion", "concertina", "fiddle", "tamborine", "bagpipe", "harpsichord", "euphonium"],
			musicModifier : ["heavy", "soft", "acoustic", "psychedelic", "light", "orchestral", "operatic", "distorted", "echoing", "melodic", "atonal", "arhythmic", "rhythmic", "electronic"],
			musicGenre : ["metal", "electofunk", "jazz", "salsa", "klezmer", "zydeco", "blues", "mariachi", "flamenco", "pop", "rap", "soul", "gospel", "buegrass", "swing", "folk"],
			musicPlays : ["echoes out", "reverberates", "rises", "plays"],
			musicAdv : ["too quietly to hear", "into dissonance", "into a minor chord", "changing tempo", "to a major chord", "staccatto", "into harmony", "without warning", "briskly", "under the melody", "gently", "becoming #musicGenre#"],
			song : ["melody", "dirge", "ballad", "poem", "beat poetry", "slam poetry", "spoken word performance", "hymn", "song", "tone poem", "symphony"],
			musicAdj : ["yielding", "firm", "joyful", "catchy", "folksy", "harsh", "strong", "soaring", "rising", "falling", "fading", "frantic", "calm", "childlike", "rough", "sensual", "erotic", "frightened", "sorrowful", "gruff", "smooth"],
        
		}, {})
		grammar.addModifiers(baseEngModifiers)

		const campfireSongs = ["Lonely Goatherd", "On top of spaghetti", "Princess Pat", "BINGO", "Old Mac Donald", "Going on a Bear Hunt", "The Green Grass Grew All Around", "Home on the Range", "John Jacob Jingleheimer Schmitt", "The Wheels on the Bus", "If I had a Hammer"]
		this.room.detailText = "Campfire time!"

		this.room.time.onSecondChange((second) => {
			// Change the song every minute (60 seconds)
			let rate = 10 // How many seconds between changes
			if (second%rate === 0) {
				let tick = second/rate
				let index = second % campfireSongs.length
				let song = campfireSongs[index]
				this.room.detailText =  song + grammar.flatten("#songStyle#")
			}
		})
	},

	props: ["room"]

})

