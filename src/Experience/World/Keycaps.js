import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class Keycaps {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // State
        this.keycaps = new Map() // Map of keyName -> Keycap Mesh
        this.isPressed = {}
        this.resource = this.resources.items.keycapsModel

        // Debug
        if (this.debug?.active) {
            this.debugFolder = this.debug.ui.addFolder('keycaps');
            this.setupDebug()
        }

        // Load models
        this.setModel()
        this.createKeyboardLayout()

        // Initialize text display data
        this.displayedText = ""
        this.font = null

        // Load font asynchronously, then create display screen
        const fontLoader = new FontLoader()
        fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
            this.font = font
            this.createDisplayScreen()
            this.updateDisplayScreen()
        })

        this.setEventListeners()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(1, 1, 1)
        this.model.rotation.y = -Math.PI / 2

        // Store base models
        this.baseModels = {
            basic: this.model.getObjectByName('Keycap'),
            shift: this.model.getObjectByName('ShiftKey'),
            caps: this.model.getObjectByName('CapsKey'),
            space: this.model.getObjectByName('SpacebarKey')
        }

        Object.values(this.baseModels).forEach((model) => {
            if (model) model.rotation.y = -Math.PI / 2
        })
    }

    createKeyboardLayout() {
        const startX = -20.6;

        const rows = [
            { 
                keys: [
                    'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 
                    'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 
                    'Digit0', 'Minus', 'Equal', 'Backspace'
                ], 
                z: -2.4,
                types: ['basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'shift'] 
            },
            {
                keys: [
                    'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 
                    'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 
                    'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'
                ],
                z: -0.4,
                types: ['caps', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'caps']
            },
            {
                keys: [
                    'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 
                    'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 
                    'Semicolon', 'Quote', 'Enter'
                ],
                z: 1.6,
                types: ['caps', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'shift']
            },
            {
                keys: [
                    'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 
                    'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 
                    'Slash', 'ShiftRight'
                ],
                z: 3.6,
                types: ['shift', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'basic', 'shift']
            },
            {
                keys: [
                    'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight'
                ],
                z: 5.6,
                types: ['basic', 'basic', 'basic', 'space', 'basic', 'basic', 'basic', 'basic']
            }
        ]

        const keyWidths = {
            basic: 2,
            shift: 4.8,
            caps: 3.5,
            space: 14,
        }

        rows.forEach((row) => {
            let currentX = startX + (keyWidths[row.types[0]] / 2);

            row.keys.forEach((key, index) => {
                const type = row.types[index];
                const baseModel = this.baseModels[type];

                if (baseModel) {
                    const keycap = baseModel.clone();

                    keycap.rotation.y = -Math.PI / 2;
                    keycap.position.set(currentX, 1, row.z);

                    this.scene.add(keycap);

                    this.keycaps.set(key, {
                        mesh: keycap,
                        originalPosition: keycap.position.clone()
                    });

                    this.isPressed[key] = false;

                    const currentWidth = keyWidths[type] || 2;
                    const nextType = row.types[index + 1];
                    const nextWidth = keyWidths[nextType] || 2;

                    currentX += (currentWidth / 2) + (nextWidth / 2);
                }
            });
        });
    }

    setEventListeners() {
        // Handle keydown
        window.addEventListener('keydown', (event) => {
            const key = event.code;

            // If it's a visible character or space, update display text
            if (key.startsWith('Key') || key.startsWith('Digit') || key === 'Space') {
                this.displayedText += event.key;
                this.updateDisplayScreen();
            }

            // Handle Backspace
            if (key === 'Backspace') {
                this.displayedText = this.displayedText.slice(0, -1);
                this.updateDisplayScreen();
            }

            // Handle Enter (clear text)
            if (key === 'Enter') {
                this.displayedText = "";
                this.updateDisplayScreen();
            }

            // Animate key press
            if (this.keycaps.has(key) && !this.isPressed[key]) {
                this.isPressed[key] = true;
                this.animateKeycapPress(key);
            }
        });

        // Handle keyup
        window.addEventListener('keyup', (event) => {
            const key = event.code;
            if (this.keycaps.has(key) && this.isPressed[key]) {
                this.isPressed[key] = false;
                this.animateKeycapRelease(key);
            }
        });
    }

    animateKeycapPress(key) {
        const keycap = this.keycaps.get(key)
        if (!keycap) return

        gsap.to(keycap.mesh.position, {
            y: keycap.originalPosition.y - 0.3,
            duration: 0.05,
            ease: "power1.out"
        })
    }

    animateKeycapRelease(key) {
        const keycap = this.keycaps.get(key)
        if (!keycap) return

        gsap.to(keycap.mesh.position, {
            y: keycap.originalPosition.y,
            duration: 0.05,
            ease: "power1.out"
        })
    }

    createDisplayScreen() {
        // Panel (background)
        const panelGeometry = new THREE.PlaneGeometry(30, 10);
        const panelMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
        this.displayPanel = new THREE.Mesh(panelGeometry, panelMaterial);
        this.displayPanel.position.set(0, 5, -12);
        this.scene.add(this.displayPanel);

        // Text mesh with empty geometry for now
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.textMesh = new THREE.Mesh(new THREE.BufferGeometry(), textMaterial);
        this.textMesh.position.set(-12, 6, -11.9);
        this.scene.add(this.textMesh);
    }

    updateDisplayScreen() {
        if (!this.font) return;  // Font not loaded yet

        if (this.displayedText.length > 20) {
            this.displayedText = this.displayedText.slice(-20);
        }

        const textGeometry = new TextGeometry(this.displayedText, {
            font: this.font,
            size: 1,
            depth: 0.01,
        });

        if (this.textMesh.geometry) {
            this.textMesh.geometry.dispose();
        }
        this.textMesh.geometry = textGeometry;
    }

    setupDebug() {
        this.colorParams = { keycapColor: '#ffffff' };
        const self = this;

        this.debugFolder
            .addColor(this.colorParams, 'keycapColor')
            .name('Keycaps Color')
            .onChange(function(value) {
                self.setKeycapColor(value);
            });
    }

    setKeycapColor(color) {
        this.keycaps.forEach(({ mesh }) => {
            if (mesh.material) {
                mesh.material.color.set(color);
            }
        });
    }

}
