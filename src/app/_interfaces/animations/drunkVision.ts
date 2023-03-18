import {
  style,
  animate,
  trigger,
  transition,
  keyframes,
  animation,
  AnimationReferenceMetadata, AnimationKeyframesSequenceMetadata, AnimationStyleMetadata
} from '@angular/animations';

function getDrunkAnimation(seconds: number, intensity: number): AnimationReferenceMetadata {
  const transitionAnimation = animation([
    animate(seconds + 's', keyframes(
      getDrunkStyle(intensity)
    ))
  ]);
  return transitionAnimation;
}

function getDrunkStyle(drunkness: number): AnimationStyleMetadata[] {
  const steps = [];
  steps.push(style({filter: 'blur(0px)', offset: 0}));
  steps.push(style({filter: 'blur(' + Math.floor(drunkness * 0.25) + 'px)', offset: 0.2}));
  steps.push(style({filter: 'blur(' + Math.floor(drunkness * 1.25) + 'px)', offset: 0.24}));
  steps.push(style({filter: 'blur(' + Math.floor(drunkness * 0.5) + 'px)', offset: 0.26}));
  steps.push(style({filter: 'blur(' + Math.floor(drunkness * 1.25) + 'px)', offset: 0.28}));
  steps.push(style({filter: 'blur(' + Math.floor(drunkness * 0.45) + 'px)', offset: 0.3}));
  steps.push(style({filter: 'blur(' + (Math.floor(drunkness * 0.45) * 2) + 'px)', offset: 0.6}));
  steps.push(style({filter: 'blur(' + Math.ceil(drunkness * (4.0/3.0)) + 'px)', offset: 0.62}));
  steps.push(style({filter: 'blur(' + Math.ceil(drunkness * (1.0 / 3.0)) + 'px)', offset: 0.65}));
  steps.push(style({filter: 'blur(' + Math.floor(drunkness * 0.45) + 'px)', offset: 0.67}));
  steps.push(style({filter: 'blur(' + Math.floor(drunkness * 0.5) + 'px)', offset: 0.8}));
  steps.push(style({filter: 'blur(' + (Math.floor(drunkness * 0.45) * 2) + 'px)', offset: 0.85}));
  steps.push(style({filter: 'blur(' + Math.floor(drunkness * 1.25) + 'px)', offset: 0.88}));
  steps.push(style({filter: 'blur(0px)', offset: 0.9}));
  return steps;
}

export const drunkVision = trigger('drunkVision', [
  transition('* => drunk1', [
    getDrunkAnimation(20, 1)
  ]),
  transition('* => drunk2', [
    getDrunkAnimation(20, 2)
  ]),
  transition('* => drunk3', [
    getDrunkAnimation(20, 3)
  ]),
  transition('* => drunk4', [
    getDrunkAnimation(20, 4)
  ]),
  transition('* => done', [
    getDrunkAnimation(0.1, 0)
  ])
]);


