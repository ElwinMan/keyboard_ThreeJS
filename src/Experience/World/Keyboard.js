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

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
         this.geometry = new THREE.PlaneGeometry(42.75, 14.6)
    }

    setMaterial()
    {
         this.material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI / 2
        this.mesh.position.set(0, 0, 0)
        this.mesh.receiveShadow = true

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
