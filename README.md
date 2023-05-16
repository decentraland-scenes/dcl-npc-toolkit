
  

# NPC-library

  

A collection of tools for creating Non-Player-Characters (NPCs). These are capable of having conversations with the player, and play different animations.

  

Capabilities of the NPCs in this library:

  

- Start a conversation when clicked or when walking near

- Trigger any action when clicked or when walking near

- Trigger any action when the player walks away

- Turn around slowly to always face the player

- Play an animation in the NPC 3d model, optionally returning to loop the idle animation afterwards

  

The dialog messages can also require that the player chooses options, and any action can be triggered when the player picks an option or advances past a message.

## Using the UI utils library

  

To use any of the helpers provided by the utils library you must install it in your Decentrland project.

  

### Via the Decentraland Editor

  

Make sure you've [installed the Decentraland editor](https://docs.decentraland.org/creator/development-guide/sdk7/installation-guide/#the-decentraland-editor).

  

1) Open your scene's folder using Visual Studio Code.

  

>  **📔 Note**: The Visual Studio window must be at the root folder of the scene project.

2) Open the Decentraland Editor tab on Visual Studio. Note that the bottom section lists all of your project's currently installed dependencies.

  

3) Click the `+` icon on the header of the **Dependencies** view.

  

4) Visual Studio opens an input box at the top of the screen. Write `@dcl-sdk/npc-utils` and hit enter. The dependency is then installed to your scene.

  
  

5. Import the library into the scene's script. Add this line at the start of your `index.ts` file, or any other TypeScript files that require it:

  

```ts

import  *  as  npc  from  '@dcl-sdk/npc-utils'

```

  

6. In your TypeScript file, call the `create` function passing it a `TransformType` and a `NPCData` object. The `NPCData` object requires a minimum of a `NPCType` and a function to trigger when the NPC is activated:

  

```ts

export  let  myNPC = npc.create({position:  Vector3.create(8,0,8),rotation:Quaternion.Zero(), scale:  Vector3.create(1,1,1)},

//NPC Data Object

{

type:  npc.NPCType.CUSTOM,

model:  'models/npc.glb',

onActivate:()=>{console.log('npc activated');}

}

)

```

  

7. Write a dialog script for your character, preferably on a separate file, making it of type `Dialog[]`.

  

```ts

import { Dialog } from  '@dcl-sdk/npc-utils'

  

export  let  ILoveCats: Dialog[] = [

{

text:  `I really lo-ove cats`,

isEndOfDialog:  true

}

]

```

  
  

### Via the CLI

  

1. Install the library as an npm bundle. Run this command in your scene's project folder:

  

```

npm i @dcl-sdk/npc-utils

```

  

2. Run `npm run start` or `npm run build` so the dependencies are correctly installed.

  

3. Import the library into the scene's script. Add this line at the start of your `index.ts` file, or any other TypeScript files that require it:

  

```ts

import  *  as  npc  from  '@dcl-sdk/npc-utils'

```

  

4. In your TypeScript file, call the `create` function passing it a `TransformType` and a `NPCData` object. The `NPCData` object requires a minimum of a `NPCType` and a function to trigger when the NPC is activated:

  

```ts

export  let  myNPC = npc.create({position:  Vector3.create(8,0,8),rotation:Quaternion.Zero(), scale:  Vector3.create(1,1,1)},

//NPC Data Object

{

type:  npc.NPCType.CUSTOM,

model:  'models/npc.glb',

onActivate:()=>{console.log('npc activated');}

}

)

```

  

5. Write a dialog script for your character, preferably on a separate file, making it of type `Dialog[]`.

  

```ts

import { Dialog } from  '@dcl-sdk/npc-utils'

  

export  let  ILoveCats: Dialog[] = [

{

text:  `I really lo-ove cats`,

isEndOfDialog:  true

}

]

```

  

## NPC Default Behavior

  

NPCs at the very least must have:

  

-  `position`: (_TransformType_) Must include position, rotation and scale.

-  `NPCData`: (_Data Object_) with a minimum of two variables

-  `type`: (_NPCType_) you have the choice to use a custom GLB object or an `AvatarShape` for your npc

-  `NPCType.CUSTOM`

-  `NPCType.AVATAR`

-  `onActivate()`: (_()=> void_) A function to call when the NPC is activated.

  

*if you decide to use a `NPCType.CUSTOM` GLB model for your avatar, you must pass in a model object inside the `NPCData`*

-  `model`: (_string_) The path to a 3D model

  

```ts

export  let  myNPC = npc.create({position:  Vector3.create(8,0,8),rotation:Quaternion.Zero(), scale:  Vector3.create(1,1,1)},

//NPC Data Object

{

type:  npc.NPCType.CUSTOM,

model:  'models/npc.glb',

onActivate:()=>{console.log('npc activated');}

}

)

```

  

With this default configuration, the NPC behaves in the following way:

  

- The `onActivate()` function is called when pressing E on the NPC, and when the player walks near at a distance of 6 meters.

- Once activated, there's a cooldown period of 5 seconds, that prevents the NPC to be activated again.

- After walking away from the NPC, if its dialog window was open it will be closed, and if the NPC was rotating to follow the player it will stop.

- If the NPC already has an open dialog window, clicking on the NPC won't do anything, to prevent accidentally clicking on it while flipping through the conversation.

- If the NPC has an animation named 'Idle', it will play it in a loop. If other non-looping animations are played, it will return to looping the 'Idle' animation after the indicated duration.

  

Many of these behaviors can be overridden or tweaked with the exposed properties.

  

## NPC Additional Properties

  

To configure other properties of an NPC, add a fourth argument as an `NPCData` object. This object can have the following optional properties:

  

-  `idleAnim`: _(string)_ Name of the idle animation in the model. This animation is always looped. After playing a non-looping animation it returns to looping this one.

-  `faceUser`: _(boolean)_ Set if the NPC rotates to face the user while active.

-  `dialogSound`: _(string)_ Path to sound file to play once for every entry shown on the UI. If the dialog entry being shown has an `audio` field, the NPC will play the file referenced by the `audio` field instead.

-  `coolDownDuration`: _(number)_ Change the cooldown period for activating the NPC again. The number is in seconds.

-  `hoverText`: _(string)_ Set the UI hover feedback when pointing the cursor at the NPC. _TALK_ by default.

-  `onlyClickTrigger`: _(boolean)_ If true, the NPC can't be activated by walking near. Just by clicking on it or calling its `activate()` function.

-  `onlyETrigger`: _(boolean)_ If true, the NPC can't be activated by walking near. Just by pressing the E key on it or calling its `activate()` function.

-  `onlyExternalTrigger`: _(boolean)_ If true, the NPC can't be activated by clicking, pressing E, or walking near. Just by calling its `activate()` function.

-  `reactDistance`: _(number)_ Radius in meters for the player to activate the NPC or trigger the `onWalkAway()` function when leaving the radius.

-  `continueOnWalkAway`: _(boolean)_ If true,when the player walks out of the `reactDistance` radius, the dialog window stays open and the NPC keeps turning to face the player (if applicable). It doesn't affect the triggering of the `onWalkAway()` function.

-  `onWalkAway`: (_()=> void_) Function to call every time the player walks out of the `reactDistance` radius.

-  `walkingAnim`: _(string)_ Name of the walking animation on the model. This animation is looped when calling the `followPath()` function.

-  `walkingSpeed`: _(number)_ Speed of the NPC when walking. By default _2_.

-  `path`: _(Vector3)_ Default path to walk. If a value is provided for this field on NPC initialization, the NPC will walk over this path in loop from the start.
-  `bubbleHeight`: _(number)_ The height at which to display the speech bubble above the head of the NPC.
- `textBubble`: _(boolean)_ If true, NPC starts with a speech bubble object ready to be accessed from the start. Otherwise, they text bubble is only built on the first call to `talkBubble()` on the NPC.

-  `noUI`: _(boolean)_ If true, no UI object is built for UI dialogs for this NPC. This may help optimize the scene if this feature is not used.

  

```ts

export  let  myNPC = npc.create({position:  Vector3.create(8,0,8),rotation:Quaternion.Zero(), scale:  Vector3.create(1,1,1)},

//NPC Data Object

{

type:  npc.NPCType.CUSTOM,

model:  'models/npc.glb',

onActivate: ()=>{console.log('npc activated');},

onWalkAway: ()=>{console.log('test on walk away function')},

faceUser:  true,

reactDistance:  3,

idleAnim:  'idle1',

walkingAnim:  'walk1',

hoverText:  'Activate',

continueOnWalkAway:  true,

onlyClickTrigger:  false,

onlyExternalTrigger:  false

}

)

```

  

## Get NPC Data

  

```ts

npc.getData(myNPC)

```

  

There are several properties you can check on an NPC to know what its current state is:

  

-  `.state`: An enum value of type `NPCState`. Supported values are `NPCState.STANDING` (default), `NPCState.TALKING`, and `NPCState.FOLLOWPATH`. `TALKING` is applied when the dialog window is opened, and set back to `STANDING` when the window is closed. `FOLLOWPATH` is applied when the NPC starts walking, and set back to `STANDING` when the NPC finishes its path or is stopped.

-  `.introduced`: Boolean, false by default. Set to true if the NPC has spoken to the player at least once in this session.

-  `.visible`: Returns a Boolean, false by default. True if the dialog window for this NPC is currently open.

-  `.inCooldown`: Boolean, false by default. True if the NPC was recently activated and it's now in cooldown. The NPC won't respond to being activated till `inCooldown` is false.

  

> TIP: If you want to force an activation of the NPC in spite of the `inCooldown` value, you can force this value to true before activating.

  

## NPC Callable Actions

  

An NPC object has several callable functions that come with the class:

  

### Talk

  

To start a conversation with the NPC using the dialog UI, call the `talk()` function. The function takes the following **required** parameter:

  

-  `script`: _(Dialog[])_ This array contains the information to manage the conversation, including events that may be triggered, options to choose, etc.

  

It can also take the following optional parameters:

  

-  `startIndex`: _(number | string)_ The _Dialog_ object from the `script` array to open first. By default this is _0_, the first element of the array. Pass a number to open the entry on a given array position, or pass a string to open the entry with a `name` property matching that string.

-  `duration`: _(number)_ Number of seconds to wait before closing the dialog window. If no value is set, the window is kept open till the player reaches the end of the conversation or something else closes it.

  

```ts

npc.talk(myNPC,myScript, 0)

```

  

Learn how to build a script object for NPCs in a section below.

### Speech Bubbles

Besides the UI dialog window, NPCs can show speech bubbles over their heads. This alternative is less invasive to the player, but also non-interactive. Players can't alter the pace of the conversation or provide answers to questions.

For an NPC to talk with bubbles:

```ts
npc.talkBubble(myNPC, myScript, 0)
```

The function takes the following **required** parameter:
- `npc`: _(Entity)_ The NPC you would like to talk.

- `script`: _(Dialog[])_ This array contains the information to manage the conversation, including events that may be triggered, options to choose, etc.

It can also take the following optional parameters:

- `startIndex`: _(number | string)_ The _Dialog_ object from the `script` array to open first. By default this is _0_, the first element of the array. Pass a number to open the entry on a given array position, or pass a string to open the entry with a `name` property matching that string.

To interrupt the flow of an NPC's dialog windows, you can either:

- Run `npc.endInteraction(myNPC)` on the NPC
- Run `npc.closeBubble(myNPC)` on the NPC's `bubble` object
- Run `npc.closeBubbleEndAll(myNPC)` on the NPC's `bubble` object

The first two options keep running any `triggeredByNext()` functions associated to the dialogs being shown on the bubble, the third option prevents running these.

  

### Play Animations

  

By default, the NPC will loop an animation named 'Idle', or with a name passed in the `idleAnim` parameter.

  

Make the NPC play another animation by calling the `playAnimation()` function. The function takes the following **required** parameter:

  

-  `animationName`: _(string)_ The name of the animation to play.

  

It can also take the following optional parameters:

  

-  `noLoop`: _(boolean)_ If true, plays the animation just once. Otherwise, the animation is looped.

-  `duration`: _(number)_ Specifies the duration in seconds of the animation. When finished, it returns to playing the idle animation.

  

> Note: If `noLoop` is true but no `duration` is set, the model will stay still after playing the animation instead of returning to the idle animation.

  

```ts

npc.playAnimation(myNPC, `Head_Yes`, true, 2.63)

```

  

### Change idle animation

  

The NPC's idle animation is looped by default whenever the NPC is not playing any other animations. In some cases you may want to have different idle animations depending on the circumstances, like while in a conversation, or if the NPC changes its general attitude after some event.

  

You set the NPC's idle animation when creating the NPC, using the `idleAnim` field. To change this animation at some later time, use `changeIdleAnim()`.

  

The `changeIdleAnim()` function takes two arguments:

  

-  `animation`: The name of the new animation to set as the idle animation

-  `play`: Optionally pass this value as _true_ if you want this new animation to start playing right away.

  

```ts

npc.changeIdleAnim(myNPC,`AngryIdle`, true)

```

  

### Activate

  

The `activate()` function can be used to trigger the `onActivate()` function, as an alternative to pressing E or walking near.

  

```ts

npc.activate(myNPC)

```

  

The `activate()` function is callable even when in cool down period, and it doesn't start a new cool down period.

  

### Stop Walking

  

If the NPC is currently walking, call `stopWalking()` to stop it moving and return to playing its idle animation.

  

```ts

npc.stopWalking(myNPC)

```

  

`stopWalking()` can be called with no parameters, or it can also be called with:

  

-  `duration`: Seconds to wait before starting to walk again. If not provided, the NPC will stop walking indefinitely.

  

> Note: If the NPC is has its dialog window open when the timer for the `duration` ends, the NPC will not return to walking.

  

To make the NPC play a different animation from idle when paused, call `playAnimation()` after `stopWalking()`.

  

### Follow Path

  

Make an NPC walk following a path of `Vector3` points by calling `followPath()`. While walking, the NPC will play the `walkingAnim` if one was set when defining the NPC. The path can be taken once or on a loop.

  

`followPath()` can be called with no parameters if a `path` was already provided in the NPC's initialization or in a previous calling of `followPath()`. If the NPC was previously in the middle of walking a path and was interrupted, calling `followPath()` again with no arguments will return the NPC to that path.

  

```ts

npc.followPath(myNPC)

```

  

> Note: If the NPC is initialized with a `path` value, it will start out walking that path in a loop, no need to run `followPath()`.

  

`followPath()` has a single optional parameter of type `FollowPathData`. This object may have the following optional fields:

  

- path: Array of `Vector3` positions to walk over.

- speed: Speed to move at while walking this path. If no `speed` or `totalDuration` is provided, it uses the NPC's `walkingSpeed`, which is _2_ by default.

- totalDuration: The duration in _seconds_ that the whole path should take. The NPC will move at the constant speed required to finish in that time. This value overrides that of the _speed_.

- loop: _boolean_ If true, the NPC walks in circles over the provided set of points in the path. _false_ by default, unless the NPC is initiated with a `path`, in which case it starts as _true_.

- curve: _boolean_ If true, the path is traced a single smooth curve that passes over each of the indicated points. The curve is made out of straight-line segments, the path is stored with 4 times as many points as originally defined. _false_ by default.

- startingPoint: Index position for what point to start from on the path. _0_ by default.

- onFinishCallback: Function to call when the NPC finished walking over all the points on the path. This is only called when `loop` is _false_.

- onReachedPointCallback: Function to call once every time the NPC reaches a point in the path.

  

```ts

export  let  myNPC = npc.create({position:  Vector3.create(8,0,8),rotation:Quaternion.Zero(), scale:  Vector3.create(1,1,1)},

//NPC Data Object

{

type:  npc.NPCType.CUSTOM,

model:  'models/npc.glb',

onActivate: ()=>{console.log('npc activated');},

onWalkAway: ()=>{console.log('test on walk away function')},

faceUser:  true,

reactDistance:  3,

idleAnim:  'idle1',

walkingAnim:  'walk1',

hoverText:  "Activate"

}

)

  

npc.followPath(myNPC,

{

path:path,

loop:true,

pathType:  npc.NPCPathType.RIGID_PATH,

onFinishCallback:()=>{console.log('path is done')},

onReachedPointCallback:()=>{console.log('ending oint')},

totalDuration:  20

}

)

  

```

  

#### NPC Walking Speed

  

The following list of factors are used to determine speed in hierarchical order:

  

-  `totalDuration` parameter set when calling `followPath()` is used over the total distance travelled over the path.

-  `speed` parameter set when calling `followPath()`

-  `walkingSpeed` parameter set when initializing NPC

- Default value _2_.

  

#### Joining the path

  

If the NPC's current position when calling `followPath()` doesn't match the first position in the `path` array (or the one that matches the `startingPoint` value), the current position is added to the `path` array. The NPC will start by walking from its current position to the first point provided in the path.

  

The `path` can be a single point, and the NPC will then walk a from its current position to that point.

  

> Note: If the speed of the NPC is determined by a `totalDuration` value, the segment that the NPC walks to join into the path is counted as part of the full path. If this segment is long, it will increase the NPC walking speed so that the full path lasts as what's indicated by the `totalDuration`.

  

In this example the NPC is far away from the start of the path. It will first walk from _10, 0, 10_ to _2, 0, 2_ and then continue the path.

  

```ts

export  let  myNPC = npc.create({position:  Vector3.create(10,0,10),rotation:Quaternion.Zero(), scale:  Vector3.create(1,1,1)},

//NPC Data Object

{

type:  npc.NPCType.CUSTOM,

model:  'models/npc.glb',

onActivate: ()=>{console.log('npc activated');},

}

)

npc.followPath(myNPC,

{

path: [new  Vector3(2, 0, 2), new  Vector3(4, 0, 4), new  Vector3(6, 0, 6)]

})

```

  

#### Example Interrupting the NPC

  

In the following example, an NPC starts roaming walking over a path, pausing on every point to call out for its lost kitten. If the player activates the NPC (by pressing E on it or walking near it) the NPC stops, and turns to face the player and talk. When the conversation is over, the NPC returns to walking its path from where it left off.

  

```ts

export  let  myNPC = npc.create({position:  Vector3.create(10,0,10),rotation:Quaternion.Zero(), scale:  Vector3.create(1,1,1)},

//NPC Data Object

{

type:  npc.NPCType.CUSTOM,

model:  'models/npc.glb',

onActivate: ()=>{

npc.stopWalking(myNPC);

npc.talk(myNPC, lostCat, 0)

console.log('npc activated');

},

walkingAnim:  'walk1',

faceUser:true

}

)

  

npc.followPath(myNPC,

{

path: [new  Vector3(4, 0, 30), new  Vector3(6, 0, 29), new  Vector3(15, 0, 25)],

loop:  true,

onReachedPointCallback: () => {

npc.stopWalking(myNPC, 3)

npc.playAnimation(myNPC, `Cocky`, true, 2.93)

}

})

  

export  let  lostCat: Dialog[] = [

{

text:  `I lost my cat, I'm going crazy here`

},

{

text:  `Have you seen it anywhere?`

},

{

text:  `Ok, I'm gonna go back to looking for it`,

triggeredByNext: () => {

npc.followPath(myNPC)

},

isEndOfDialog:  true

}

]

```

  

### End interaction

  

The `endInteraction()` function can be used to abruptly end interactions with the NPC.

  

If applicable, it closes the dialog UI, hides speech bubbles, and makes the NPC stop rotating to face the player.

  

```ts

npc.endInteraction(myNPC)

```

  

As an alternative, you can call the `handleWalkAway()` function, which has the same effects (as long as `continueOnWalkAway` isn't set to true), but also triggers the `onWalkAway()` function.

  

## NPC Dialog Window

  

You can display an interactive dialog window to simulate a conversation with a non-player character (NPC).

  

The conversation is based on a script in JSON format. The script can include questions that can take you forward or backward, or end the conversation.

  

<img  src="screenshots/NPC1.png"  width="500">

  

### The NPC script

  

Each entry on the script must include at least a `text` field, but can include several more fields to further customize it.

  

Below is a minimal dialog.

  

```ts

export  let  NPCTalk: Dialog[] = [

{

text:  'Hi there'

},

{

text:  'It sure is nice talking to you'

},

{

text:  'I must go, my planet needs me',

isEndOfDialog:  true

}

]

```

  

The player advances through each entry by clicking the mouse button. Once the last is reached, clicking again closes the window, as it's marked as `isEndOfDialog`.

  

The script must adhere to the following schema:

  

```ts

class  Dialog {

text: string

fontSize?: number

typeSpeed?: number

isEndOfDialog?: boolean

isQuestion?:boolean

buttons?: ButtonData[]

audio?: string

triggeredByNext?: () =>  void

}

```

  

> Note: A `Dialog` object can be used as an input both for the `talk()` function (that is displayed in the UI), and the `talkBubble()` function (that is displayed in a floating bubble over the NPC). Properties marked with `*` are only applicable to UI dialogs.

  
  

You can set the following fields to change the appearance of a dialog:

  

-  `text`: The dialog text

-  `fontSize`: Size of the text

  

Other fields:

-  `buttons *`: An array of buttons to use in a question entry, covered in the next section.

-  `audio`: String with the path to an audio file to play once when this dialog is shown on the UI.

-  `typeSpeed`: The text appears one character at a time, simulating typing. Players can click to skip the animation. Tune the speed of this typing (30 by default) to go slower or faster. Set to _-1_ to skip the animation.

  

#### Questions and conversation trees

  

The script can include questions that prompt the player to pick between two or up to four options. These questions can branch the conversation out and trigger other actions in the scene.

  

<img  src="screenshots/NPC2.png"  width="500">

  

> Note: Questions are only used by UI dialogs. If used in a speech bubble, questions will be displayed as regular entries with no buttons or options.

  

To make an entry a question, set the `isQuestion` field to _true_. This displays a set of buttons rather than the click icon. It also disables the click to advance to the next entry.

  

The `buttons` property of an entry contains an array of `ButtonData` objects, each one of these defines one button.

  

When on a question entry, you must provide at least the following for each button:

  

-  `label`: _(string)_ The label to show on the button.

-  `goToDialog`: _(number | string)_ The index or name of the next dialog entry to display when activated.

  

> TIP: It's always better to refer to an entry by name, since the array index might shift if you add more entries and it can get hard to keep track of these references.

  

You can also set the following:

  

-  `triggeredActions`: _( () => void )_ An additional function to run whenever the button is activated

-  `fontSize`: _(number)_ Font size of the text

-  `offsetX`: _(number)_ Offset of the label on the X axis, relative to its normal position.

-  `offsetY`: _(number)_ Offset of the label on the Y axis, relative to its normal position.

  

All buttons can be clicked to activate them. Additionally, the first button in the array can be activated by pressing the _E_ key. The second button in the array can be activated by pressing the _F_ key,

  

<img  src="screenshots/NPC3.png"  width="500">

  

```ts

export  let  GemsMission: Dialog[] = [

{

text:  `Hello stranger`

},

{

text:  `Can you help me finding my missing gems?`,

isQuestion:  true,

buttons: [

{ label:  `Yes!`, goToDialog:  2 },

{ label:  `I'm busy`, goToDialog:  4 }

]

},

{

text:  `Ok, awesome, thanks!`

},

{

text:  `I need you to find 10 gems scattered around this scene, go find them!`,

isEndOfDialog:  true

},

{

text:  `Ok, come back soon`,

isEndOfDialog:  true

}

]

```

  

#### Triggering functions from the dialog

  

You can run functions that may affect any other part of your scene. These functions get triggered when the player interacts with the dialog window, or when the NPC displays speech bubbles.

  

-  `triggeredByNext`: Is executed when the player advances to the next dialog on a non-question dialog. The function also gets called if the dialog is the end of the conversation. It also gets called when a speech bubble advances to the next entry.

  

-  `triggeredActions`: This property is associated to a button and is executed on a question dialog if the player activates the corresponding button. You can have up to 4 different buttons per entry, each with its own actions.

  

```ts

export  let  GemsMission: Dialog[] = [

{

text:  `Hello stranger`,

triggeredByNext: () => {

// NPC plays animation to show a gem

}

},

{

text:  `Can you help me finding my missing gems?`,

isQuestion:  true,

buttons: [

{

label:  `Yes!`,

goToDialog:  2,

triggeredActions: () => {

// NPC plays an animation to celebrate

}

},

{

label:  `I'm busy`,

goToDialog:  4

triggeredActions: () => {

// NPC waves goodbye

}

},

]

},

{

text:  `Ok, awesome, thanks!`,

},

{

text:  `I need you to find 10 gems scattered around this scene, go find them!`,

isEndOfDialog:  true

triggeredByNext: () => {

// Gems are rendered all around the scene

}

},

{

text:  `Ok, come back soon`,

isEndOfDialog:  true

}

]

```

  
  

## Contribute

  

In order to test changes made to this repository in active scenes, do the following:

  

1. Run `npm run build` for the internal files of the library to be generated

2. Run `npm run link` on this repository

3. On a new Decentraland scene, import this library as you normally would and include the tests you need

4. On the scene directory, run `npm link @dcl-sdk/npc-utils`

  

> Note: When done testing, run `npm unlink` on both folders, so that the scene stops using the local version of the library.

  
  

## CI/CD

  

This repository uses `semantic-release` to automatically release new versions of the package to NPM.

  

Use the following convention for commit names:

  

`feat: something`: Minor release, every time you add a feature or enhancement that doesn’t break the api.

  

`fix: something`: Bug fixing / patch

  

`chore: something`: Anything that doesn't require a release to npm, like changing the readme. Updating a dependency is **not** a chore if it fixes a bug or a vulnerability, that's a `fix`.

  

If you break the API of the library, you need to do a major release, and that's done a different way. You need to add a second comment that starts with `BREAKING CHANGE`, like:

  

```

commit -m "feat: changed the signature of a method" -m "BREAKING CHANGE: this commit breaks the API, changing foo(arg1) to foo(arg1, arg2)"

```