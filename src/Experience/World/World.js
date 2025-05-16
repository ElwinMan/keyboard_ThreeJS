import Experience from '../Experience.js'
import Environment from './Environment.js'
import Keyboard from './Keyboard.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.environment = new Environment()

        this.resources.on('ready', () =>
        {
            // Setup
            this.Keyboard = new Keyboard()
        })
    }

    update()
    {
 
    }
}