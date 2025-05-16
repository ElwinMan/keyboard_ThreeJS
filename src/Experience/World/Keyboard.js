import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Keyboard
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('keyboard')
        }

        // Resource
        this.resource = this.resources.items.keyboardBaseModel

        this.setModel()

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(1, 1, 1)
        this.model.rotation.y = -Math.PI / 2
        this.model.position.y = 0.7
        this.scene.add(this.model)
    }

    setGeometry()
    {
         this.geometry = new THREE.PlaneGeometry(42.75, 14.6)
    }

    setTextures()
    {
        this.textures = {}

        this.textures.color = this.resources.items.keyboardShadowTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
        // this.textures.color.wrapS = THREE.RepeatWrapping
        // this.textures.color.wrapT = THREE.RepeatWrapping
        this.textures.color.needsUpdate = true

        this.textures.alpha = this.resources.items.keyboardShadowAlphaTexture
        this.textures.alpha.colorSpace = THREE.SRGBColorSpace
        // this.textures.alpha.wrapS = THREE.RepeatWrapping
        // this.textures.alpha.wrapT = THREE.RepeatWrapping
        this.textures.alpha.needsUpdate = true
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({ 
        transparent: true,
        opacity: 0.8,
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI / 2
        this.mesh.position.set(0, 0.01, 0)

        // Add to Scene
        this.scene.add(this.mesh)

        // Debug
        if (this.debug.active)
        {
            this.debugFolder.add(this.mesh.position, 'x').min(-20).max(20).step(0.1).name('Plane X')
            this.debugFolder.add(this.mesh.position, 'y').min(-20).max(20).step(0.1).name('Plane Y')
            this.debugFolder.add(this.mesh.position, 'z').min(-20).max(20).step(0.1).name('Plane Z')
        }
    }
    
    update()
    {
        
    }
}
