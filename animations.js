import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 4 / 3, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
document.querySelector('#fox-canvas-container').appendChild(renderer.domElement);

const clock = new THREE.Clock();

let mixer, previousAction, activeAction;
const actions = {};

renderer.setPixelRatio(window.devicePixelRatio);
window.addEventListener("resize", (e) => resizeCanvas());
resizeCanvas();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// ground

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = false;
scene.add(mesh);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(3, 10, 10);
dirLight.castShadow = false;
dirLight.shadow.bias = -0.003;

scene.add(dirLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0, .5, 0);
controls.minDistance = 2;
controls.maxDistance = 5;

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(5, 5, 0);
controls.update();

const loader = new GLTFLoader();
loader.load(
    'mesh/fox.glb',
    (gltf) =>
    {
        const model = gltf.scene;
        model.traverse(function (object)
        {
            if (object.isMesh)
            {
                object.castShadow = false;
                object.receiveShadow = false;
                object.material.flatShading = true;
                object.material.needsUpdate = true;
            }

        });
        createGUI(model, gltf.animations);
        scene.add(model);
    },
    undefined,
    (error) => console.log(error),
);

camera.position.z = 5;

function animate()
{
    const dt = clock.getDelta();

	if (mixer) mixer.update(dt);

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

function createGUI(model, animations)
{
    const states = ['Default', 'WalkCycle', 'RunCycle'];
    const emotes = ['Attack', 'Wake-Up', 'Scratch'];
    const gui = new GUI({
        autoPlace: false,
        width: 300,
    });
    document.querySelector('#fox-gui-container').append(gui.domElement);
    mixer = new THREE.AnimationMixer(model);
    const api = { state: 'WalkCycle' };

    for (let i = 0; i < animations.length; i++)
    {

        const clip = animations[i];
        const action = mixer.clipAction(clip);
        actions[clip.name] = action;
        if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4)
        {
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
        }

        switch(clip.name) {
            case 'RunCycle':
                action.timeScale = 2;
                break;
        }
    }
    // states

    const statesFolder = gui.addFolder('States');

    const clipCtrl = statesFolder.add(api, 'state').options(states);

    clipCtrl.onChange(function ()
    {

        fadeToAction(api.state, 0.5);

    });

    statesFolder.open();

    // emotes

    const emoteFolder = gui.addFolder('Emotes');

    function createEmoteCallback(name)
    {

        api[name] = function ()
        {

            fadeToAction(name, 0.2);

            mixer.addEventListener('finished', restoreState);

        };

        emoteFolder.add(api, name);

    }

    function restoreState()
    {

        mixer.removeEventListener('finished', restoreState);

        fadeToAction(api.state, 0.2);

    }

    for (let i = 0; i < emotes.length; i++)
    {

        createEmoteCallback(emotes[i]);

    }
    activeAction = actions[ 'WalkCycle' ];
    activeAction.play();


    emoteFolder.open();

}
function fadeToAction( name, duration ) {

    previousAction = activeAction;
    activeAction = actions[ name ];

    if ( previousAction !== activeAction ) {

        previousAction.fadeOut( duration );

    }

    activeAction
    .reset()
    .setEffectiveWeight( 1 )
    .fadeIn( duration )
    .play();

}
function resizeCanvas()
{
    const width = Math.min(window.innerWidth, 800);
    const height = width * 3 / 4;
    renderer.setSize(width, height);
}