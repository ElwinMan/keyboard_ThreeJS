import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Keyboard {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Resource
        this.resource = this.resources.items.keyboardBaseModel

        this.setModel()

        // Debug
        if (this.debug?.active) {
            this.setupDebug()
        }
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(1, 1, 1)
        this.model.rotation.y = -Math.PI / 2
        this.model.position.y = 0.7

        // Find the mesh inside the model group
        this.mesh = this.model.children.find(child => child.isMesh)
        if (!this.mesh) {
            console.error('Mesh not found inside model')
            return
        }

        this.scene.add(this.model)
    }

    setupDebug() {
        this.colorParams = { color: '#ffffff' }

        this.debugFolder = this.debug.ui.addFolder('keyboard')

        this.debugFolder
            .addColor(this.colorParams, 'color')
            .name('Color')
            .onChange((value) => {
                this.mesh.material.color.set(value)
            })
    }
}