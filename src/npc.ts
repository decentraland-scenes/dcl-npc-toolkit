import {
  Animator,
  AvatarShape,
  engine,
  Entity,
  GltfContainer,
  InputAction,
  MeshCollider,
  MeshRenderer,
  PBAvatarShape,
  PBGltfContainer,
  pointerEventsSystem,
  Transform,
  TransformType,
  PBAnimationState,
  TriggerArea, 
  triggerAreaEventsSystem
} from '@dcl/sdk/ecs'
import { Color3, Quaternion, Vector3 } from '@dcl/sdk/math'
import { bubbles, closeBubble, createDialogBubble, openBubble } from './bubble'
import { IsFollowingPath, TrackUserFlag } from './components'
import { addDialog, closeDialog, findDialogByName, npcDialogComponent, openDialog } from './dialog'
import { faceUserSystem, handleBubbletyping, handleDialogTyping, handlePathTimes, inputListenerSystem } from './systems'
import { Dialog, FollowPathData, ImageData, NPCData, NPCPathType, NPCState, NPCType, TriggerData } from './types'
import { darkTheme, lightTheme } from './ui'
import { debugTriggers, delayedFunction, clearDelayedFunction, DelayedHandle } from './utils/utils'
import { paths } from './utils/path'


type NPCDataFromEntity = Omit<NPCData, 'type'> & { type?: NPCType }

export const walkingTimers: Map<Entity, number> = new Map()
export const npcDataComponent: Map<Entity, any> = new Map()
export let NULL_NPC: Entity = 0 as Entity
export let activeNPC: Entity = NULL_NPC
export let blankDialog: number = 0

engine.addSystem(handlePathTimes)
engine.addSystem(handleDialogTyping)
engine.addSystem(handleBubbletyping)
engine.addSystem(faceUserSystem)
engine.addSystem(inputListenerSystem)

//TODO MAKE isCooldown and no longer have to track with map to remove memory leak issues
const isCooldown: Map<Entity, any> = new Map()
const onActivateCbs: Map<Entity, any> = new Map()
const onWalkAwayCbs: Map<Entity, any> = new Map()
const animTimers: Map<Entity, DelayedHandle> = new Map()
const pointReachedCallbacks: Map<Entity, any> = new Map()
const onFinishCallbacks: Map<Entity, any> = new Map()

export function showDebug(debug: boolean) {
  if(debug) {
    debugTriggers()
  }
}

export function getData(npc: Entity) {
  return npcDataComponent.get(npc)
}

export function create(transform: any, data: NPCData) {
  let npc = engine.addEntity()

  let t: TransformType = {
    position: transform.position ? transform.position : Vector3.create(0, 0, 0),
    rotation: transform.rotation ? transform.rotation : Quaternion.Zero(),
    scale: transform.scale ? transform.scale : Vector3.One()
  }
  Transform.create(npc, t)

  npcDataComponent.set(npc, {
    introduced: false,
    inCooldown: false,
    coolDownDuration: data && data.coolDownDuration ? data.coolDownDuration : 5,
    faceUser: data && data.faceUser ? data.faceUser : undefined,
    walkingSpeed: 2,
    walkingAnim: data && data.walkingAnim ? data.walkingAnim : undefined,
    pathData: data.pathData ? data.pathData : undefined,
    currentPathData: [],
    manualStop: false,
    pathIndex: 0,
    state: NPCState.STANDING,
    idleAnim: data && data.idleAnim ? data.idleAnim : 'Idle',
    bubbleHeight: data && data.textBubble && data.bubbleHeight ? data.bubbleHeight : undefined,
    bubbleSound: data.dialogSound ? data.dialogSound : undefined,
    hasBubble: data && data.textBubble ? true : false,
    turnSpeed: data && data.turningSpeed ? data.turningSpeed : 2,
    theme: data.darkUI ? darkTheme : lightTheme,
    bubbleXOffset: data.bubbleXOffset ? data.bubbleXOffset : 0,
    bubbleYOffset: data.bubbleYOffset ? data.bubbleYOffset : 0,
    volume: data && data.volume ? data.volume : 0.5
  })

  if (data && data.noUI) {
  } else if (data && data.portrait) {
    addDialog(
      npc,
      data && data.dialogSound ? data.dialogSound : undefined,
      typeof data.portrait === `string` ? { path: data.portrait } : data.portrait
    )
  } else {
    addDialog(npc, data && data.dialogSound ? data.dialogSound : undefined)
  }

  if (data && data.textBubble) {
    createDialogBubble(npc, npcDataComponent.get(npc).bubbleHeight)
  }

  onActivateCbs.set(npc, (other: Entity) => {
    data.onActivate(other)
  })

  if (data && data.hasOwnProperty('onWalkAway')) {
    onWalkAwayCbs.set(npc, (other: Entity) => {
      if (!data || !data.continueOnWalkAway) {
        if (npcDialogComponent.has(npc)) {
          npcDialogComponent.get(npc).visible = false
        }
      } else {
        if (npcDialogComponent.has(npc)) {
          npcDialogComponent.get(npc).visible = false
        }
      }
      data.onWalkAway!(other)
    })
  }

  addNPCBones(npc, data)
  addClickReactions(npc, data)
  addTriggerArea(npc, data)

  if (data && data.pathData && data.pathData.speed) {
    let npcData = npcDataComponent.get(npc)
    npcData.walkingSpeed = data.pathData.speed
  }

  if (data && data.coolDownDuration) {
    let npcData = npcDataComponent.get(npc)
    npcData.coolDownDuration = data.coolDownDuration
  }

  if (data && data.pathData) {
    let npcData = npcDataComponent.get(npc)
    npcData.pathData.loop = true
    followPath(npc, npcData.pathData)
  }

  return npc
}

export function createFromEntity(entity: Entity, data: NPCDataFromEntity) {
  const npc = entity

  const resolvedType = (data && data.type !== undefined ? data.type : NPCType.CUSTOM)

  if (!Transform.has(npc)) {
    console.log('createFromEntity: Provided entity is missing Transform component')
  }

  if (resolvedType === NPCType.CUSTOM && !GltfContainer.has(npc)) {
    console.log('createFromEntity: Expected a GltfContainer on CUSTOM NPC entity')
  }

  npcDataComponent.set(npc, {
    introduced: false,
    inCooldown: false,
    coolDownDuration: data && data.coolDownDuration ? data.coolDownDuration : 5,
    faceUser: data && data.faceUser ? data.faceUser : undefined,
    walkingSpeed: 2,
    walkingAnim: data && data.walkingAnim ? data.walkingAnim : undefined,
    pathData: data.pathData ? data.pathData : undefined,
    currentPathData: [],
    manualStop: false,
    pathIndex: 0,
    state: NPCState.STANDING,
    idleAnim: data && data.idleAnim ? data.idleAnim : 'Idle',
    bubbleHeight: data && data.textBubble && data.bubbleHeight ? data.bubbleHeight : undefined,
    bubbleSound: data.dialogSound ? data.dialogSound : undefined,
    hasBubble: data && data.textBubble ? true : false,
    turnSpeed: data && data.turningSpeed ? data.turningSpeed : 2,
    theme: data.darkUI ? darkTheme : lightTheme,
    bubbleXOffset: data.bubbleXOffset ? data.bubbleXOffset : 0,
    bubbleYOffset: data.bubbleYOffset ? data.bubbleYOffset : 0
  })

  if (data && data.noUI) {
  } else if (data && data.portrait) {
    addDialog(
      npc,
      data && data.dialogSound ? data.dialogSound : undefined,
      typeof data.portrait === `string` ? { path: data.portrait } : data.portrait
    )
  } else {
    addDialog(npc, data && data.dialogSound ? data.dialogSound : undefined)
  }

  if (data && data.textBubble) {
    createDialogBubble(npc, npcDataComponent.get(npc).bubbleHeight)
  }

  onActivateCbs.set(npc, (other: Entity) => {
    data.onActivate(other)
  })

  if (data && data.hasOwnProperty('onWalkAway')) {
    onWalkAwayCbs.set(npc, (other: Entity) => {
      if (!data || !data.continueOnWalkAway) {
        if (npcDialogComponent.has(npc)) {
          npcDialogComponent.get(npc).visible = false
        }
      } else {
        if (npcDialogComponent.has(npc)) {
          npcDialogComponent.get(npc).visible = false
        }
      }
      data.onWalkAway!(other)
    })
  }

  const dataWithType = { ...data, type: resolvedType } as NPCData
  // Attach visual components based on type
  if (resolvedType === NPCType.AVATAR) {
    if (GltfContainer.has(npc)) {
      GltfContainer.deleteFrom(npc)
    }
    if (!AvatarShape.has(npc)) {
      AvatarShape.create(
        npc,
        {
          id: 'npc',
          name: dataWithType && dataWithType.name ? dataWithType.name : 'NPC',
          bodyShape: dataWithType && dataWithType.bodyShape ? dataWithType.bodyShape : 'urn:decentraland:off-chain:base-avatars:BaseMale',
          emotes: [],
          wearables: (dataWithType.wearables && dataWithType.wearables.length > 0)
            ? dataWithType.wearables
            : [
              'urn:decentraland:off-chain:base-avatars:f_eyes_00',
              'urn:decentraland:off-chain:base-avatars:f_eyebrows_00',
              'urn:decentraland:off-chain:base-avatars:f_mouth_00',
              'urn:decentraland:off-chain:base-avatars:comfy_sport_sandals',
              'urn:decentraland:off-chain:base-avatars:soccer_pants',
              'urn:decentraland:off-chain:base-avatars:elegant_sweater'
            ],
          eyeColor: dataWithType && dataWithType.eyeColor ? dataWithType.eyeColor : undefined,
          skinColor: dataWithType && dataWithType.skinColor ? dataWithType.skinColor : undefined,
          hairColor: dataWithType && dataWithType.hairColor ? dataWithType.hairColor : undefined
        }
      )
    } else if (dataWithType.wearables && dataWithType.wearables.length > 0) {
      const avatar = AvatarShape.getMutable(npc)
      avatar.wearables = dataWithType.wearables
      if (dataWithType && dataWithType.name) {
        avatar.name = dataWithType.name
      }
      if (dataWithType.bodyShape) avatar.bodyShape = dataWithType.bodyShape
      if (dataWithType.eyeColor) avatar.eyeColor = dataWithType.eyeColor
      if (dataWithType.skinColor) avatar.skinColor = dataWithType.skinColor
      if (dataWithType.hairColor) avatar.hairColor = dataWithType.hairColor
    }
  } else if (resolvedType === NPCType.CUSTOM) {
    seedAnimatorForExisting(npc, dataWithType)
  }
  addClickReactions(npc, dataWithType)
  addTriggerArea(npc, dataWithType)

  if (data && data.pathData && data.pathData.speed) {
    let npcData = npcDataComponent.get(npc)
    npcData.walkingSpeed = data.pathData.speed
  }

  if (data && data.coolDownDuration) {
    let npcData = npcDataComponent.get(npc)
    npcData.coolDownDuration = data.coolDownDuration
  }

  if (data && data.pathData) {
    let npcData = npcDataComponent.get(npc)
    npcData.pathData.loop = true
    followPath(npc, npcData.pathData)
  }

  return npc
}

function addNPCBones(npc: Entity, data: NPCData) {
  const modelIsString = data && data.model && typeof data.model === `string`
  const modelAvatarData: PBAvatarShape | undefined = modelIsString
    ? undefined
    : data.model && (data.model as any).bodyShape
      ? (data.model as PBAvatarShape)
      : undefined
  const modelGLTFData: PBGltfContainer | undefined = modelIsString
    ? undefined
    : data.model && (data.model as any).src
      ? (data.model as PBGltfContainer)
      : undefined

  switch (data.type) {
    case NPCType.AVATAR:
      AvatarShape.create(
        npc,
        !data || !data.model || !modelAvatarData
          ? {
            id: 'npc',
            name: data && data.name ? data.name : 'NPC',
            bodyShape: data && data.bodyShape ? data.bodyShape : 'urn:decentraland:off-chain:base-avatars:BaseMale',
            emotes: [],
            wearables: (data && data.wearables && data.wearables.length > 0)
              ? data.wearables
              : [
                'urn:decentraland:off-chain:base-avatars:f_eyes_00',
                'urn:decentraland:off-chain:base-avatars:f_eyebrows_00',
                'urn:decentraland:off-chain:base-avatars:f_mouth_00',
                'urn:decentraland:off-chain:base-avatars:comfy_sport_sandals',
                'urn:decentraland:off-chain:base-avatars:soccer_pants',
                'urn:decentraland:off-chain:base-avatars:elegant_sweater'
              ],
            eyeColor: data && data.eyeColor ? data.eyeColor : undefined,
            skinColor: data && data.skinColor ? data.skinColor : undefined,
            hairColor: data && data.hairColor ? data.hairColor : undefined
          }
          : modelAvatarData
      )
      // If avatar data came from model, still honor provided name override
      if (data && data.name) {
        const avatar = AvatarShape.getMutable(npc)
        avatar.name = data.name
        if (data.bodyShape) avatar.bodyShape = data.bodyShape
        if (data.eyeColor) avatar.eyeColor = data.eyeColor
        if (data.skinColor) avatar.skinColor = data.skinColor
        if (data.hairColor) avatar.hairColor = data.hairColor
      }
      break

    case NPCType.CUSTOM:
      GltfContainer.create(
        npc,
        modelIsString && typeof data.model === `string` ? { src: data && data.model ? data.model : '' } : modelGLTFData
      )
      Animator.create(npc, {
        states: [
          {
            clip: data && data.idleAnim ? data.idleAnim : 'Idle',
            loop: true
          }
        ]
      })

      let npcData = npcDataComponent.get(npc)
      npcData.idleAnim = data && data.idleAnim ? data.idleAnim : 'Idle'
      npcData.lastPlayedAnim = npcDataComponent.get(npc).idleAnim

      Animator.playSingleAnimation(npc, npcDataComponent.get(npc).idleAnim)

      if (data && data.walkingAnim) {
        npcDataComponent.get(npc).walkingAnim = data.walkingAnim
        let animations = Animator.getMutable(npc)
        animations.states.push({ clip: data.walkingAnim, loop: true })
      }

      break

    case NPCType.BLANK:
      MeshRenderer.setBox(npc)
      MeshCollider.setBox(npc)
      break
  }
}

function seedAnimatorForExisting(npc: Entity, data: NPCData) {
  if (data.type !== NPCType.CUSTOM) return

  const idleClip = data && data.idleAnim ? data.idleAnim : 'Idle'

  if (!Animator.has(npc)) {
    Animator.create(npc, {
      states: [
        {
          clip: idleClip,
          loop: true
        }
      ]
    })
  } else {
    const animations = Animator.getMutable(npc)
    if (animations.states.filter((animation: PBAnimationState) => animation.clip === idleClip).length === 0) {
      animations.states.push({ clip: idleClip, loop: true })
    }
  }

  let npcData = npcDataComponent.get(npc)
  npcData.idleAnim = idleClip
  npcData.lastPlayedAnim = idleClip
  if (typeof idleClip === 'string' && idleClip.length > 0) {
    Animator.playSingleAnimation(npc, idleClip)
  }

  if (data && data.walkingAnim) {
    const animations = Animator.getMutable(npc)
    if (typeof data.walkingAnim === 'string' && data.walkingAnim.length > 0 && animations.states.filter((animation: PBAnimationState) => animation.clip === data.walkingAnim!).length === 0) {
      animations.states.push({ clip: data.walkingAnim!, loop: true })
    }
    if (typeof data.walkingAnim === 'string') {
      npcData.walkingAnim = data.walkingAnim
    }
  }
}

function addClickReactions(npc: Entity, data: NPCData) {
  let activateButton = data && data.onlyClickTrigger ? InputAction.IA_POINTER : InputAction.IA_PRIMARY

  /*
  pointerEventsSystem.onPointerDown(
      {
          entity: npc,
          opts: {
              button: activateButton,
              hoverText: data && data.hoverText ? data.hoverText : 'Talk',
              showFeedback: data && data.onlyExternalTrigger ? false : true
          }
      },
      () => {
          if (isCooldown.has(npc) || npcDialogComponent.get(npc).visible) return
          activate(npc, engine.PlayerEntity)
      },
  )
  */

  pointerEventsSystem.onPointerDown(
    npc,
    function () {
      if (isCooldown.has(npc) || npcDialogComponent.get(npc).visible) return
      activate(npc, engine.PlayerEntity)
    },
    {
      button: activateButton,
      hoverText: data && data.hoverText ? String(data.hoverText) : 'Talk',
      showFeedback: data && data.onlyExternalTrigger ? false : true
    }
  )

  if (data && data.onlyExternalTrigger) {
    pointerEventsSystem.removeOnPointerDown(npc)
  }
}

function addTriggerArea(npc: Entity, data: NPCData) {
  let triggerData: TriggerData = {}

  if (!data || (data && !data.onlyExternalTrigger && !data.onlyClickTrigger && !data.onlyETrigger)) {
    onActivateCbs.set(npc, (other: Entity) => {
      if (isCooldown.has(npc)) {
        console.log(npc, ' in cooldown')
        return
      } else if (
        (npcDialogComponent.has(npc) && npcDialogComponent.get(npc).visible) ||
        (data && data.onlyExternalTrigger) ||
        (data && data.onlyClickTrigger)
      ) {
        return
      }
      data.onActivate(other)
    })
    triggerData.onCameraEnter = onActivateCbs.get(npc)
  }

  // when exiting trigger
  if (!data || (data && !data.continueOnWalkAway)) {
    triggerData.onCameraExit = (other) => {
      handleWalkAway(npc, other)
    }
  }

  // when entering trigger
  if (!data || (data && !data.onlyExternalTrigger && !data.onlyClickTrigger && !data.onlyETrigger)) {
    triggerData.onCameraEnter = (other) => {
      if (isCooldown.has(npc)) {
        console.log(npc, ' in cooldown')
        return
      }
      // else if (
      //     (this.dialog && this.dialog.isDialogOpen) ||
      //     (data && data.onlyExternalTrigger) ||
      //     (data && data.onlyClickTrigger)
      // ) {
      //     return
      // }
      activate(npc, other)
    }
  }

  // add trigger

  if (triggerData.onCameraEnter || triggerData.onCameraExit) {


    let sphereScale = {
      x: data.reactDistance != undefined ? data.reactDistance : 6,
      y: data.reactDistance != undefined ? data.reactDistance : 6,
      z: data.reactDistance != undefined ? data.reactDistance : 6
    }

   let triggerSphere = engine.addEntity()

   Transform.create(triggerSphere, {
    position: Vector3.Zero(),
    rotation: Quaternion.Zero(),
    scale: sphereScale,
    parent: npc
   })

   TriggerArea.setSphere(triggerSphere)

    triggerAreaEventsSystem.onTriggerEnter(triggerSphere, function(result) {
      if (triggerData.onCameraEnter) {
        const entity = (result?.trigger?.entity ?? engine.PlayerEntity) as Entity
        triggerData.onCameraEnter(entity)
      }
    })

    triggerAreaEventsSystem.onTriggerExit(triggerSphere, function(result) {
      if (triggerData.onCameraExit) {
        const entity = (result?.trigger?.entity ?? engine.PlayerEntity) as Entity
        triggerData.onCameraExit(entity)
      }
    })
  }
}

export function followPath(npc: Entity, data?: FollowPathData) {
  let npcData = npcDataComponent.get(npc)
  let path: any[] = []

  if (npcData.faceUser) {
    if (TrackUserFlag.has(npc)) {
      TrackUserFlag.deleteFrom(npc)
    }
  }

  if (npcData.manualStop) {
    let duration = npcData.pathData.totalDuration
    let currentTimer: number = walkingTimers.get(npc)!
    //console.log('current time is', currentTimer)
    if (currentTimer) {
      duration -= currentTimer
    }

    let path: any[] = []
    npcData.pathData.path.forEach((p: any) => {
      path.push(p)
    })
    path.splice(0, npcData.pathIndex)

    let pos = Transform.get(npc).position
    path.unshift(Vector3.create(pos.x, pos.y, pos.z))
    walkNPC(
      npc,
      npcData,
      npcData.pathData.pathType,
      duration,
      path,
      pointReachedCallbacks.get(npc),
      onFinishCallbacks.get(npc)
    )
  } else {
    if (data) {
      npcData.pathData = data

      if (data.startingPoint) {
        data.path?.splice(0, data.startingPoint - 1)
      }

      let pos = Transform.get(npc).position
      path.push(Vector3.create(pos.x, pos.y, pos.z))
      data.path?.forEach((p) => {
        path.push(p)
      })

      onFinishCallbacks.set(npc, () => {
        //console.log('on finished callback')
        if (data && data.onFinishCallback && !data.loop) {
          data.onFinishCallback()
        }
        stopPath(npc)
      })

      pointReachedCallbacks.set(npc, () => {
        //console.log('on point reached callback')
        let data = npcDataComponent.get(npc)
        data.pathIndex += 1
        data.onReachedPointCallback ? data.onReachedPointCallback : undefined
      })
      walkNPC(
        npc,
        npcData,
        data.pathType!,
        data.totalDuration,
        path,
        pointReachedCallbacks.get(npc),
        onFinishCallbacks.get(npc)
      )
    } else {
      if (npcData.manualStop) {
        console.log('we have manual stop, need to pick back up where we left off')
      } else {
        console.log('we are trying to follow a path witout starting one prior')
      }
    }
  }
}

function walkNPC(
  npc: Entity,
  npcData: any,
  type: NPCPathType,
  duration: number,
  path: Vector3[],
  pointReachedCallback?: any,
  finishedCallback?: any
) {
  if (IsFollowingPath.has(npc)) {
    IsFollowingPath.deleteFrom(npc)
    walkingTimers.delete(npc)
  }
  IsFollowingPath.create(npc)

  if (type) {
    if (type == NPCPathType.RIGID_PATH) {
      paths.startStraightPath(
        npc,
        path,
        duration,
        true,
        () => {
          finishedCallback()
        },
        () => {
          pointReachedCallback()
        }
      )
    } else {
      paths.startSmoothPath(
        npc,
        path,
        duration,
        30,
        true,
        () => {
          finishedCallback()
        },
        () => {
          pointReachedCallback()
        }
      )
    }
  } else {
    paths.startSmoothPath(
      npc,
      path,
      duration,
      20,
      true,
      () => {
        finishedCallback()
      },
      () => {
        pointReachedCallback()
      }
    )
  }

  if (npcData.walkingAnim) {
    clearAnimationTimer(npc)
    Animator.playSingleAnimation(npc, npcDataComponent.get(npc).walkingAnim, true)
    npcData.lastPlayedAnim = npcDataComponent.get(npc).walkingAnim
  }
  npcData.state = NPCState.FOLLOWPATH
  npcData.manualStop = false
}

export function stopWalking(npc: Entity, duration?: number, finished?: boolean) {
  let npcData = npcDataComponent.get(npc)
  npcData.state = NPCState.STANDING
  npcData.manualStop = true

  stopPath(npc)

  if (duration) {
    delayedFunction(() => {
      if (npcData.path) {
        Animator.stopAllAnimations(npc, true)
        if (npcDataComponent.get(npc).walkingAnim) {
          clearAnimationTimer(npc)
          Animator.playSingleAnimation(npc, npcDataComponent.get(npc).walkingAnim, true)
          npcData.lastPlayedAnim = npcDataComponent.get(npc).walkingAnim
        }
        let duration = npcData.pathData.totalDuration
        let currentTimer: number = walkingTimers.get(npc)!
        console.log('current time is', currentTimer)
        if (currentTimer) {
          duration -= currentTimer
        }

        let path: any[] = []
        npcData.pathData.path.forEach((p: any) => {
          path.push(p)
        })
        path.splice(0, npcData.pathIndex)

        let pos = Transform.get(npc).position
        path.unshift(Vector3.create(pos.x, pos.y, pos.z))

        //npcData.manualStop = false
        walkNPC(
          npc,
          npcData,
          npcData.pathData.pathType,
          duration,
          path,
          pointReachedCallbacks.get(npc),
          onFinishCallbacks.get(npc)
        )
      }

    }, duration * 1000)
  }
}

export function stopPath(npc: Entity) {
  paths.stopPath(npc)
  IsFollowingPath.deleteFrom(npc)

  let npcData = npcDataComponent.get(npc)
  if (npcData.walkingAnim) {
    clearAnimationTimer(npc)
    Animator.playSingleAnimation(npc, npcDataComponent.get(npc).idleAnim)
    npcData.lastPlayedAnim = npcData.idleAnim
  }

  if (!npcData.manualStop) {
    if (npcData.pathData.loop) {
      npcData.pathIndex = 0
      walkingTimers.delete(npc)
      //console.log('we are looping path', npcData)
      followPath(npc, npcData.pathData)
      //console.log(npcData)
    }
  }
}

export function clearNPC() {
  activeNPC = NULL_NPC
}

export function setActiveNPC(npc: Entity) {
  activeNPC = npc
}

export function isActiveNpcSet() {
  return activeNPC && npcDialogComponent.has(activeNPC)
}

/**
 * Calls the NPC's activation function (set on NPC definition). If NPC has `faceUser` = true, it will rotate to face the player. It starts a cooldown counter to avoid reactivating.
 */
export function activate(npc: Entity, other: Entity) {
  if (activeNPC != 0) {
    //console.log('we have a current npc, needto remove')
    endInteraction(activeNPC)
    // closeDialog(activeNPC)
  }

  activeNPC = npc
  onActivateCbs.get(npc)(other)

  let npcData = npcDataComponent.get(npc)
  if (npcData.faceUser) {
    if (TrackUserFlag.has(npc)) {
      TrackUserFlag.deleteFrom(npc)
    }

    TrackUserFlag.create(npc, {
      lockXZRotation: true,
      active: true,
      rotSpeed: npcData.turnSpeed
    })
  }
  isCooldown.set(npc, true)
  npcData.inCooldown = true

  delayedFunction(() => 
    {
      isCooldown.delete(npc)
      npcDataComponent.get(npc).inCooldown = false
      //console.log("cooldown deleted")
    }, 1000 * npcData.coolDownDuration
  )

  //console.log('activated npc,', npcDataComponent.get(npc), "cooldown duration: ", npcData.coolDownDuration)
}

function endInteraction(npc: Entity) {
  let npcData = npcDataComponent.get(npc)
  npcData.state = NPCState.STANDING

  if (npcDialogComponent.has(npc)) {
    //} && npcDialogComponent.get(npc).visible) {
    closeDialog(npc)
  }

  if (npcData.faceUser) {
    if (TrackUserFlag.has(npc)) {
      TrackUserFlag.deleteFrom(npc)
    }
  }

  //console.log('ending interaction', npcData, bubbles.get(npc))
  if (npcData.hasBubble && bubbles.get(npc).isBubbleOpen) {
    closeBubble(npc)
  }
}

/**
 * Ends interaction and calls the onWalkAway function
 */
export function handleWalkAway(npc: Entity, other: Entity) {
  let npcData = npcDataComponent.get(npc)
  if (npcData.state == NPCState.FOLLOWPATH) {
    return
  }

  endInteraction(npc)

  if (onWalkAwayCbs.get(npc)) {
    onWalkAwayCbs.get(npc)(other)
  }
}

export function playAnimation(npc: Entity, anim: string, noLoop?: boolean, duration?: number) {
  const npcData = npcDataComponent.get(npc)
  if (!npcData) return

  // AvatarShape path: trigger emote by expressionTriggerId/expressionTriggerTimestamp
  if (AvatarShape.has(npc)) {
    if (npcData.state == NPCState.FOLLOWPATH) {
      paths.stopPath(npc)
    }
    clearAnimationTimer(npc)

    const triggerOnce = () => {
      const avatar = AvatarShape.getMutable(npc)
      ;(avatar as any).expressionTriggerId = anim
      ;(avatar as any).expressionTriggerTimestamp = (avatar as any).expressionTriggerTimestamp
        ? (avatar as any).expressionTriggerTimestamp + 1
        : 0
    }

    triggerOnce()

    if (!noLoop && duration && duration > 0) {
      const scheduleNext = () => {
        animTimers.set(
          npc,
          delayedFunction(() => {
            triggerOnce()
            scheduleNext()
          }, 1000 * duration)
        )
      }
      scheduleNext()
    }

    npcData.lastPlayedAnim = anim
    return
  }

  // GLTF/Animator path
  const animations = Animator.getMutable(npc)
  if (!animations) return

  if (animations.states && animations.states.filter((animation: PBAnimationState) => animation.clip === anim).length == 0) {
    animations.states.push({ clip: anim, loop: noLoop ? false : true })
  }

  if (npcData.state == NPCState.FOLLOWPATH) {
    paths.stopPath(npc)
  }

  clearAnimationTimer(npc)

  Animator.stopAllAnimations(npc, true)
  Animator.playSingleAnimation(npc, anim, true)
  if (duration) {
    clearAnimationTimer(npc)
    animTimers.set(
      npc,
      delayedFunction(() => {
        clearAnimationTimer(npc)
        Animator.stopAllAnimations(npc, true)
        if (npcData.idleAnim) {
          Animator.playSingleAnimation(npc, npcData.idleAnim)
          npcData.lastPlayedAnim = npcData.idleAnim
        }
      }, 1000 * duration)
    )
  }

  npcData.lastPlayedAnim = anim
}

export function changeIdleAnim(npc: Entity, animation: string, play?: boolean) {
  let npcData = npcDataComponent.get(npc)
  npcData.idleAnim = animation

  let animations = Animator.getMutable(npc)
  if (animations.states.filter((anim) => anim.clip === animation).length == 0) {
    animations.states.push({ clip: animation, loop: true })
  }

  if (play) {
    playAnimation(npc, animation, true)
    npcDataComponent.get(npc).lastPlayedAnim = animation
  }
}

export function talkBubble(npc: Entity, script: Dialog[], startIndex?: number | string) {
  openBubble(npc, script, startIndex)
}

export function createDialogWindow(defaultPortrait?: ImageData, sound?: string) {
  let dialog = engine.addEntity()
  addDialog(dialog, sound, defaultPortrait)
  return dialog
}

export function openDialogWindow(npc: Entity, dialog: Dialog[], startIndex?: number | string) {
  activeNPC = npc

  if (npcDialogComponent.has(npc)) {
    let index: any
    if (!startIndex) {
      index = 0
    } else if (typeof startIndex === 'number') {
      index = startIndex
    } else {
      index = findDialogByName(dialog, startIndex)
    }
    openDialog(npc, dialog, index)
  }
}

export function closeDialogWindow(window: Entity) {
  let dialog = npcDialogComponent.get(window)
  if (window) {
    closeDialog(dialog)
  }
}

function clearAnimationTimer(npc: Entity): boolean {
  if (animTimers.has(npc)) {
    clearDelayedFunction(animTimers.get(npc))
    animTimers.delete(npc)
    return true
  }
  return false
}
