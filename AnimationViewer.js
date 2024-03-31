import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export class AnimationViewer {
    states = [];
    emotes = [];
    attacks = [];
    constructor(containerTag, orbitTargetHeight = .5, backgroundColor = 0xa0a0a0, lightIntensity = 3) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 4 / 3, 0.1, 100);
        this.scene = scene;
        this.camera = camera;


        const renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer = renderer;
        
        document.querySelector(containerTag).appendChild(renderer.domElement);


        const clock = new THREE.Clock();
        this.clock = clock;

        const actions = {};
        this.actions = actions;

        renderer.setPixelRatio(window.devicePixelRatio);
        window.addEventListener("resize", (e) => this.resizeCanvas());
        this.resizeCanvas();
        scene.background = new THREE.Color(backgroundColor);
        scene.fog = new THREE.Fog(backgroundColor, 10, 50);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, lightIntensity);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        // ground

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0xAAAAAA, depthWrite: false }));
        plane.rotation.x = - Math.PI / 2;
        plane.receiveShadow = true;
        scene.add(plane);

        const dirLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
        dirLight.position.set(3, 10, 10);
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 100;
        

        scene.add(dirLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI / 2;
        controls.target.set(0, orbitTargetHeight, 0);
        controls.minDistance = 2;
        controls.maxDistance = 15;

        this.controls = controls;

        //controls.update() must be called after any manual changes to the camera's transform
        camera.position.set(5, 5, 0);
        controls.update();

        camera.position.z = 5;

        this.animate();
    }
    /**
     * 
     * @param {string} modelPath 
     * @param {number} scale 
     */
    async loadModel(modelPath, scale = 1) {
        const loader = new GLTFLoader();
        let resolvePromise;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        loader.load(
            modelPath,
            (gltf) =>
            {
                const model = gltf.scene;
                model.scale.set(scale, scale, scale);
                this.model = model;
                this.animations = gltf.animations;
                model.traverse(function (object)
                {
                    if (object.isMesh)
                    {
                        object.castShadow = false;
                        object.receiveShadow = false;
                    }

                });
                this.scene.add(model);

                this.mixer = new THREE.AnimationMixer(model);

                for (let i = 0; i < this.animations.length; i++) {
                    const clip = this.animations[i];
                    const action = this.mixer.clipAction(clip);
                    this.actions[clip.name] = action;
                }
                resolvePromise();
            },
            undefined,
            (error) => console.log(error),
        );
        await promise;
    }
    /**
     * 
     * @param {string} name 
     * @param {boolean} loop 
     * @param {number} timescale 
     * @returns 
     */
    addState(name, loop = true, timescale = 1) {
        const action = this.actions[name];
        if (!loop) {
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
        }
        action.timeScale = timescale;
        this.states.push(name);
        return this;
    }
    
    /**
     * 
     * @param {string} name 
     * @param {number} timescale 
     * @returns 
     */
    addEmote(name, timescale = 1) {
        if (this.actions[name] == undefined) throw(name + " doesn't exist");
        const action = this.actions[name];
        action.timeScale = timescale;
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
        this.emotes.push(name);
        return this;
    }

    /**
     * 
     * @param {string} name 
     * @param {number} timescale 
     * @returns 
     */
    addAttack(name, timescale = 1) {
        if (this.actions[name] == undefined) throw(name + " doesn't exist");
        const action = this.actions[name];
        action.timeScale = timescale;
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
        this.attacks.push(name);
        return this;
    }

    createGUI(containerTag, defaultState)
    {
        const gui = new GUI({
            autoPlace: false,
            width: 300,
        });
        const api = {
            State: defaultState,
            'Playback Speed': 1,

        };
        document.querySelector(containerTag).append(gui.domElement);

        // states
        const statesFolder = gui.addFolder('States');

        const clipCtrl = statesFolder.add(api, 'State').options(this.states);

        clipCtrl.onChange(() => {
            this.fadeToAction(api.State, 0.5);
        });

        statesFolder.open();

        // emotes
        const emoteFolder = gui.addFolder('Actions');

        const createEmoteCallback = function(name) {
            api[name] = function() {
                this.fadeToAction(name, 0.2);

                this.mixer.addEventListener('finished', restoreState);
            }.bind(this);

            emoteFolder.add(api, name);
        }.bind(this)
        const restoreStateNoBlending = function() {
            this.mixer.removeEventListener('finished', restoreStateNoBlending);

            this.fadeToAction(api.State, 0);
        }.bind(this);

        const restoreState = function() {
            this.mixer.removeEventListener('finished', restoreState);

            this.fadeToAction(api.State, 0.2);
        }.bind(this);

        const setUpScatch = function() {
            const action = this.actions['Scratch'];
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
            const action2 = this.actions['Sitting'];
            action2.clampWhenFinished = true;
            action2.loop = THREE.LoopOnce;
            api['Scratch'] = () => {
                this.fadeToAction('Sitting', 0.1);
                this.mixer.addEventListener('finished', scratch);
            }
            const scratch = function() {
                this.mixer.removeEventListener('finished', scratch);
                this.mixer.addEventListener('finished', restoreState);
                this.fadeToAction('Scratch', 0.1);  
            }.bind(this);
        }.bind(this);

        if (this.canScratch) {
            setUpScatch();
            emoteFolder.add(api, 'Scratch');
        }

        for (let i = 0; i < this.emotes.length; i++) {
            createEmoteCallback(this.emotes[i]);
        }

        if (this.attacks.length > 0) {
            const createAttackCallback = function(name) {
                api[name] = function() {
                    this.fadeToAction(name, 0.2);
    
                    this.mixer.addEventListener('finished', restoreState);
                }.bind(this);
    
                attacksFolder.add(api, name);
            }.bind(this);

            const attacksFolder = gui.addFolder('Attacks');

            for (const attack of this.attacks) {
                createAttackCallback(attack);
            }
            // attacksFolder.close();
        }


        this.activeAction = this.actions[defaultState];
        this.activeAction.play();

        emoteFolder.open();

        const speedFolder = gui.addFolder('Playback Speed');
        speedFolder.add(api, 'Playback Speed', 0, 2, 0.01).onChange(this.modifyTimeScale.bind(this));
        speedFolder.open();
        

        return this;
    }

    fadeToAction(name, duration ) {

        this.previousAction = this.activeAction;
        this.activeAction = this.actions[name];

        if (this.previousAction !== this.activeAction) {

            this.previousAction.fadeOut(duration);

        }

        this.activeAction
        .reset()
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();

    }
    resizeCanvas() {
        let width = Math.min(document.body.clientWidth - 26, 680);
        if (window.innerWidth > 1000) {
            width = 850;
        }
        const height = width * 3 / 4;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
    }

    animate() {
        const dt = this.clock.getDelta();

        if (this.mixer) this.mixer.update(dt);
        
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        if (this.composer) this.composer.render();
        else (this.renderer.render(this.scene, this.camera));
    }
    modifyTimeScale(speed) {
        this.mixer.timeScale = speed;
    }

    addBloom() {
        const renderScene = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85 );
		bloomPass.threshold = 0;
		bloomPass.strength = .2;
		bloomPass.radius = 0;

		const outputPass = new OutputPass();

		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(renderScene);
		this.composer.addPass(bloomPass);
		this.composer.addPass(outputPass);
    }
}

