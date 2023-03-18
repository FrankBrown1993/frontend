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
  if (drunkness < 4) {
    steps.push(style({opacity: '0', offset: 0}));
    steps.push(style({opacity: '0', offset: 1}));
  } else if (drunkness === 4) {
    steps.push(style({opacity: '0.3', transform: 'rotate(2deg)', offset: 0.05}));
    steps.push(style({transform: 'rotate(-3deg)', offset: 0.25}));
    steps.push(style({opacity: '0.5', transform: 'rotate(5deg)', offset: 0.45}));
    steps.push(style({opacity: '0.5', transform: 'rotate(-3deg)', offset: 0.65}));
    steps.push(style({opacity: '0.3', transform: 'rotate(2deg)', offset: 0.85}));
    steps.push(style({opacity: '0.2', transform: 'rotate(-2deg)', offset: 0.95}));
  }
  return steps;
}

export const doubleVision = trigger('doubleVision', [
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


