import { AnimationViewer } from './AnimationViewer.js';

async function initFoxViewer() {
    const viewer = new AnimationViewer('#fox-canvas-container');
    
    await viewer.loadModel('mesh/fox.glb', 3);

    viewer.canScratch = true;

    viewer.addState('Default')
    .addState('WalkCycle')
    .addState('RunCycle', true, 2)
    .addState('Falling', false)
    .addEmote('Attack')
    .addEmote('Wake-Up')
    .createGUI('#fox-gui-container', 'WalkCycle');
}

async function initHareViewer() {
    const viewer = new AnimationViewer('#hare-canvas-container');
    
    await viewer.loadModel('mesh/white-hare.glb', 8);

    viewer.addState('Default')
    .addState('WalkCycle')
    .addState('RunCycle')
    .addEmote('Eat')
    .createGUI('#hare-gui-container', 'WalkCycle');
}

async function initPlayerViewer() {
    const viewer = new AnimationViewer('#player-canvas-container', 3, 0x222222, .01);
    
    await viewer.loadModel('mesh/player.glb', 1.2);
    
    viewer.addState('Idle')
    .addState('Walk')
    .addState('Walk-Backwards')
    .addState('Walk-Left')
    .addState('Walk-Right')
    .addState('QuickWalk', true, 1.5)
    .addState('Fall', false)
    .addState('StartBlocking', false)
    .addEmote('Drink')
    .addEmote('Drink-Empty')
    .addEmote('Interact')
    .addEmote('Death')
    .addEmote('Roll')
    .addEmote('Stagger-Front')
    .addEmote('Stagger-Back')
    .addEmote('Stagger-Left')
    .addEmote('Stagger-Right')
    .addEmote('WalkThroughFogGate')
    .addEmote('BlockHit')
    .addEmote('GuardBreak')
    .addAttack('LightAttack3')
    .addAttack('LightAttackCombo')
    .addAttack('LightAttackCombo2')
    .addAttack('ThrowSpell')
    .addAttack('HeavyAttack')
    .addAttack('HeavyAttackCombo')
    .createGUI('#player-gui-container', 'Idle',)
    .addBloom();
}

async function initEnemyViewer() {
    const viewer = new AnimationViewer('#enemy-canvas-container', 3, 0x222222, .01);
    
    await viewer.loadModel('mesh/enemy.glb', 1.2);
    
    viewer.addState('Idle')
    .addState('Walk')
    .addState('Walk-Backwards')
    .addState('Walk-Left')
    .addState('Walk-Right')
    .addState('QuickWalk', true, 1.5)
    .addEmote('Death')
    .addEmote('Stagger-Front')
    .addEmote('Stagger-Back')
    .addEmote('Stagger-Left')
    .addEmote('Stagger-Right')
    .addAttack('Attack1')
    .addAttack('Attack2')
    .addAttack('Attack2-Boss')
    .addAttack('Attack3')
    .addAttack('Attack3-Ex')
    .addAttack('Attack4')
    .addAttack('GroundShockwave')
    .addAttack('MeteorAttackLiftUp')
    .addAttack('MeteorAttack')
    .addAttack('AgileEliteAttack')
    .addAttack('AgileEliteAttack-Ext')

    .createGUI('#enemy-gui-container', 'Idle')
    .addBloom();
}

async function initRangedEnemyViewer() {
    const viewer = new AnimationViewer('#ranger-canvas-container', 3, 0x222222, .01);
    
    await viewer.loadModel('mesh/rangedEnemy.glb', 1.2);
    
    viewer.addState('Idle')
    .addState('Walk')
    .addState('Walk-Backwards')
    .addState('Walk-Left')
    .addState('Walk-Right')
    .addEmote('Death')
    .addEmote('Stagger-Front')
    .addEmote('Stagger-Back')
    .addEmote('Stagger-Left')
    .addEmote('Stagger-Right')
    .addAttack('Shoot')
    .addAttack('RollAttack')
    .addAttack('GunAttack')
    .createGUI('#ranger-gui-container', 'Idle')
    .addBloom();
}

initFoxViewer();
initHareViewer();
initPlayerViewer();
initEnemyViewer();
initRangedEnemyViewer();