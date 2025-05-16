import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

export default class Keycaps
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        // State
        this.isPressed = false
        this.originalPosition = new THREE.Vector3()

        // Resource
        this.resource = this.resources.items.keycapsModel

        this.setModel()
        this.setEventListeners()
    }

    setModel()
    {
        this.model = this.resource.scene.children[0]
        this.model.scale.set(1, 1, 1)
        this.model.rotation.y = -Math.PI / 2
        this.model.position.set(-19.7, 1, -5.7)
        this.scene.add(this.model)

        this.originalPosition.copy(this.model.position)
    }
    
    setEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'q' && !this.isPressed) {
                this.isPressed = true
                this.animateKeycapPress()
            }
        })

        window.addEventListener('keyup', (event) => {
            if (event.key.toLowerCase() === 'q' && this.isPressed) {
                this.isPressed = false
                this.animateKeycapRelease()
            }
        })
    }

    animateKeycapPress() {
        if (!this.model) return
        gsap.to(this.model.position, {
            y: this.originalPosition.y - 0.3, // Moves downwards
            duration: 0.05,
            ease: "power1.out"
        })
    }

    animateKeycapRelease() {
        if (!this.model) return
        gsap.to(this.model.position, {
            y: this.originalPosition.y, // Moves back up
            duration: 0.05,
            ease: "power1.out"
        })
    }
}
