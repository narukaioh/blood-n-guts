import { MODULE_TITLE } from '../constants';
import BrushConfig from '../classes/BrushConfig';
import { isFirstActiveGM } from './helpers';

/**
 * Add control buttons
 */
function handleGetSceneControlButtons(controls) {
  if (isFirstActiveGM()) {
    controls.push({
      name: 'blood',
      title: MODULE_TITLE,
      icon: 'fas fa-tint',
      layer: 'BloodLayer',
      tools: [
        {
          name: 'toggle',
          title: 'Toggle blood layer on/off',
          icon: 'fas fa-eye',
          onClick: () => {
            canvas.blood.toggle();
          },
          active: canvas?.blood?.visible || false,
          toggle: true,
        },
        {
          name: 'select',
          title: 'Select blood splats',
          icon: 'fas fa-expand',
        },
        {
          name: 'brush',
          title: 'Draw blood splats to the scene',
          icon: 'fas fa-paint-brush',
        },
        {
          name: 'brushConfig',
          title: 'Configure blood brush',
          icon: 'fas fa-cog',
          onClick: () => {
            // @ts-expect-error defintions wrong
            new BrushConfig().render(true);
          },
          button: true,
        },
        {
          name: 'wipe',
          title: 'Wipe blood',
          icon: 'fas fa-trash',
          onClick: () => {
            const dg = new Dialog({
              title: 'Wipe Blood',
              content: 'Are you sure? All blood splats will be deleted.',
              buttons: {
                blank: {
                  icon: '<i class="fas fa-trash"></i>',
                  label: 'Wipe',
                  callback: () => canvas.blood.wipeBlood(true),
                },
                cancel: {
                  icon: '<i class="fas fa-times"></i>',
                  label: 'Cancel',
                },
              },
              default: 'reset',
            });
            dg.render(true);
          },
          button: true,
        },
      ],
      activeTool: 'brush',
    });
  }
}

/**
 * Handles adding the custom brush controls pallet
 * and switching active brush flag
 */
function handleRenderSceneControls(controls) {
  // Switching to layer
  if (controls.activeControl === 'blood') {
    // Open brush tools if not already open
    if (!$('#brush-controls').length) {
      canvas.blood.createBrushControls();
    }
  }
  // Switching away from layer
  else {
    const bc = $('#brush-controls');
    if (bc) bc.remove();
    const bco = $('#brush-config');
    if (bco) bco.remove();
  }
}

/**
 * Sets Y position of the brush controls to account for scene navigation buttons
 */
function updateBrushControls() {
  // if scene has just been activated and blood control not present
  // // @ts-expect-error defintions wrong
  // const isBloodControlPresent = ui.controls.controls.find((control) => control.name === 'blood');

  // then add the blood control, for the case when a user has navigated to an inactive scene
  // and then activated it
  // if (canvas?.scene?.active && !isBloodControlPresent) {
  //   // @ts-expect-error defintions wrong
  //   handleGetSceneControlButtons(ui.controls.controls);
  //   // @ts-expect-error defintions wrong
  //   ui.controls.render(true);
  // }

  const bc = $('#brush-controls');
  if (bc) {
    const h = $('#navigation').height();
    bc.css({ top: `${h + 30}px` });
  }
}

Hooks.on('getSceneControlButtons', handleGetSceneControlButtons);
Hooks.on('renderSceneControls', handleRenderSceneControls);

// Reset position when brush controls are rendered or sceneNavigation changes
Hooks.on('renderBrushControls', updateBrushControls);
Hooks.on('renderSceneNavigation', updateBrushControls);
