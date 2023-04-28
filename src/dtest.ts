import {Dialog} from './index2'

export let ILoveCats: Dialog[] = [
  {
    text: `Hello stranger`
  },
  {
    text: `Can you help me finding my missing gems?`,
    isQuestion: true,
    buttons: [
      { label: `Yes!`, goToDialog: 2 },
      { label: `I'm busy`, goToDialog: 4 },
      { label: `Leave me alone`, goToDialog: 4, triggeredActions:()=>{
        console.log('yes i clicked leave me alone')
      } }
    ]
  },
  {
    text: `Ok, awesome, thanks!`
  },
  {
    text: `I need you to find 10 gems scattered around this scene, go find them!`,
    isEndOfDialog: true
  },
  {
    text: `Ok, come back soon`,
    isEndOfDialog: true
  }
]