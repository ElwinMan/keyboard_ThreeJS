import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Keycaps
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        // Resource
        this.resource = this.resources.items.keycapsModel

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene.children[0]
        this.model.scale.set(1, 1, 1)
        this.model.rotation.y = -Math.PI / 2
        this.model.position.set(-19.7, 1, -5.7)
        this.scene.add(this.model)
    }
    
    update()
    {
        
    }
}
