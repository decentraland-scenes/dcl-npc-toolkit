import ReactEcs from '@dcl/sdk/react-ecs'
import { Animator, AvatarShape, engine, Entity, GltfContainer, InputAction,MeshCollider,MeshRenderer,pointerEventsSystem,Transform, TransformType } from '@dcl/sdk/ecs'
import { Color3, Quaternion, Vector3 } from '@dcl/sdk/math'
import { Dialog, FollowPathData, ImageData, NPCData, NPCPathType, NPCState, NPCType, TriggerData } from './types';
import * as utils from '@dcl-sdk/utils'
import { IsFollowingPath, TrackUserFlag } from './components';
import { faceUserSystem, handleBubbletyping, handleDialogTyping, handlePathTimes, inputListenerSystem } from './systems';
import { addDialog, closeDialog, findDialogByName, npcDialogComponent, openDialog } from './dialog';
import { bubbles, closeBubble, createDialogBubble, openBubble } from './bubble';

export const walkingTimers: Map<Entity,number> = new Map()
export const npcDataComponent: Map<Entity, any> = new Map()
export let activeNPC:number = 0
export let blankDialog:number = 0

engine.addSystem(handlePathTimes)
engine.addSystem(handleDialogTyping)
engine.addSystem(handleBubbletyping)
engine.addSystem(faceUserSystem)
engine.addSystem(inputListenerSystem)

const isCooldown: Map<Entity, any> = new Map()
const onActivateCbs: Map<Entity, any> = new Map()
const onWalkAwayCbs: Map<Entity, any> = new Map()
const animTimers: Map<Entity,any> = new Map()
const pointReachedCallbacks: Map<Entity, any> = new Map()
const onFinishCallbacks: Map<Entity, any> = new Map()

export function showDebug(debug:boolean){
    utils.triggers.enableDebugDraw(debug)
}

export function getData(npc:Entity){
    return npcDataComponent.get(npc)
}

export function create(
    transform: any,
    data: NPCData
){
    let npc = engine.addEntity()

    let t:TransformType = {position: transform.position ? transform.position : Vector3.create(0,0,0), rotation: transform.rotation ? transform.rotation : Quaternion.Zero(), scale: transform.scale ? transform.scale : Vector3.One()}
    Transform.create(npc, t)

    npcDataComponent.set(npc,{
        introduced: false,
        inCooldown: false,
        coolDownDuration: data && data.coolDownDuration ? data.coolDownDuration : 5,
        faceUser: data && data.faceUser ? data.faceUser : undefined,
        walkingSpeed:2,
        walkingAnim: data && data.walkingAnim ? data.walkingAnim : undefined,
        pathData: data.pathData ? data.pathData : undefined,
        currentPathData: [],
        manualStop:false,
        pathIndex:0,
        state:NPCState.STANDING,
        idleAnim: data && data.idleAnim ? data.idleAnim : "Idle",
        bubbleHeight: data && data.textBubble && data.bubbleHeight ? data.bubbleHeight : undefined,
        bubbleSound: data.dialogSound ? data.dialogSound : undefined,
        hasBubble: data && data.textBubble ? true : false,
        turnSpeed: data && data.turningSpeed ? data.turningSpeed : 2
    })

    if(data && data.noUI){}
    else if(data && data.portrait){
            addDialog(npc, data && data.dialogSound ? data.dialogSound : undefined, typeof data.portrait === `string` ? { path: data.portrait } : data.portrait)
        }
    else{
        addDialog(npc, data && data.dialogSound ? data.dialogSound : undefined)
    }

    if (data && data.textBubble) {
        createDialogBubble(npc, npcDataComponent.get(npc).bubbleHeight)
      }

    onActivateCbs.set(npc, ()=>{
        data.onActivate()
    })

    if (data && data.hasOwnProperty("onWalkAway")) {
        onWalkAwayCbs.set(npc, ()=>{
            if(!data || !data.continueOnWalkAway){
                if(npcDialogComponent.has(npc)){
                    npcDialogComponent.get(npc).visible = false
                }
            }
            else{
                if(npcDialogComponent.has(npc)){
                    npcDialogComponent.get(npc).visible = false
                }
            }
            data.onWalkAway!()
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

    if (data && data.pathData){
        let npcData = npcDataComponent.get(npc)
        //npcData.currentPathData = npcData.pathData
        followPath(npc, npcData.pathData)
    }

    return npc
}

function addNPCBones(npc:Entity, data:NPCData){
    switch(data.type){
        case NPCType.AVATAR:
            AvatarShape.create(npc, {
                id: "npc",
                name: "NPC",
                bodyShape:"urn:decentraland:off-chain:base-avatars:BaseMale",
                emotes: [],
                wearables: [
                    "urn:decentraland:off-chain:base-avatars:f_eyes_00",
                    "urn:decentraland:off-chain:base-avatars:f_eyebrows_00",
                    "urn:decentraland:off-chain:base-avatars:f_mouth_00",
                    "urn:decentraland:off-chain:base-avatars:comfy_sport_sandals",
                    "urn:decentraland:off-chain:base-avatars:soccer_pants",
                    "urn:decentraland:off-chain:base-avatars:elegant_sweater",
                    ],
            })
            break;

        case NPCType.CUSTOM:
            GltfContainer.create(npc, { 
                src: data && data.model ? data.model : "" 
            })
            Animator.create(npc, {
                states:[{
                    name:data && data.idleAnim ? data.idleAnim : 'Idle',
                    clip:data && data.idleAnim ? data.idleAnim : 'Idle',
                    loop:true
                }]
            })

            let npcData = npcDataComponent.get(npc)
            npcData.idleAnim = data && data.idleAnim ? data.idleAnim : 'Idle'
            npcData.lastPlayedAnim = npcDataComponent.get(npc).idleAnim

            Animator.playSingleAnimation(npc, npcDataComponent.get(npc).idleAnim)


            if (data && data.walkingAnim) {
                npcDataComponent.get(npc).walkingAnim = data.walkingAnim
                let animations = Animator.getMutable(npc)
                animations.states.push({name:data.walkingAnim, clip: data.walkingAnim, loop:true})
            }

            break;

        case NPCType.BLANK:
            MeshRenderer.setBox(npc)
            MeshCollider.setBox(npc)
            break;

    }
}

function addClickReactions(npc:Entity, data:NPCData){
    let activateButton = data && data.onlyClickTrigger ? InputAction.IA_POINTER : InputAction.IA_PRIMARY

    pointerEventsSystem.onPointerDown(
        npc,
        function () {
            if (isCooldown.has(npc) || (npcDialogComponent.get(npc).visible)) return
            activate(npc)
        },
        {
            button: activateButton,
            hoverText: data && data.hoverText ? data.hoverText : 'Talk',
            showFeedback: data && data.onlyExternalTrigger ? false : true,
        }
        )

        if (data && data.onlyExternalTrigger) {
        pointerEventsSystem.removeOnPointerDown(npc)
        } 
}

function addTriggerArea(npc:Entity, data:NPCData){

        let triggerData: TriggerData = {}

        if (!data || (data && !data.onlyExternalTrigger && !data.onlyClickTrigger && !data.onlyETrigger)){
        onActivateCbs.set(npc, ()=>{
            if (isCooldown.has(npc)) {
                console.log(npc, ' in cooldown')
                return
            } 
            else if (
                (npcDialogComponent.has(npc) && npcDialogComponent.get(npc).visible) ||
                (data && data.onlyExternalTrigger) ||
                (data && data.onlyClickTrigger)
            ) {
                return
            }
            data.onActivate()
        })
        triggerData.onCameraEnter = onActivateCbs.get(npc)
        }

    // when exiting trigger
    if (!data || (data && !data.continueOnWalkAway)) {
        triggerData.onCameraExit = () => {
            handleWalkAway(npc)
        }
    }

    // when entering trigger
    if (
        !data ||
        (data && !data.onlyExternalTrigger && !data.onlyClickTrigger && !data.onlyETrigger)
    ) {
        triggerData.onCameraEnter = () => {
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
            activate(npc)
        }
    }

    // add trigger
    if (triggerData.onCameraEnter || triggerData.onCameraExit) {
        utils.triggers.addTrigger(npc,254,1,[{type:'sphere', position: Vector3.Zero(), radius: data.reactDistance != undefined ? data.reactDistance : 6}], triggerData.onCameraEnter ? triggerData.onCameraEnter : undefined, triggerData.onCameraExit ? triggerData.onCameraExit : undefined, Color3.Red())
    }
}

export function followPath(npc:Entity, data?:FollowPathData){
        
    let npcData = npcDataComponent.get(npc)
    let path:any[] =[]

    if(data){
        npcData.pathData = data

        if(npcData.faceUser){
            if(TrackUserFlag.has(npc)){
                TrackUserFlag.deleteFrom(npc)
            }
        }

        if(data.startingPoint){
            data.path?.splice(0,data.startingPoint - 1)
        }

        let pos = Transform.get(npc).position
        path.push(Vector3.create(pos.x, pos.y, pos.z))
        data.path?.forEach((p)=>{
            path.push(p)
        })

        onFinishCallbacks.set(npc,()=>{
            console.log('on finished callback')
            if(data && data.onFinishCallback && !data.loop){
                data.onFinishCallback
            }
            stopPath(npc)
        })

        pointReachedCallbacks.set(npc, ()=>{
            console.log('on point reached callback')
            let data = npcDataComponent.get(npc)
            data.pathIndex += 1
            data.onReachedPointCallback ? data.onReachedPointCallback : undefined
        })
        walkNPC(npc, npcData, data.pathType!, data.totalDuration, path, pointReachedCallbacks.get(npc), onFinishCallbacks.get(npc))
    }else{
        if(npcData.manualStop){
            console.log('we have manual stop, need to pick back up where we left off')
        }
        else{
            console.log('we are trying to follow a path witout starting one prior')
        }
    }
    }

function walkNPC(npc:Entity, npcData:any, type:NPCPathType, duration:number, path:Vector3[], pointReachedCallback?:any, finishedCallback?:any){
    
    if(IsFollowingPath.has(npc)){
        IsFollowingPath.deleteFrom(npc)
        walkingTimers.delete(npc)
    }
    IsFollowingPath.create(npc)

    if(type){
        if(type== NPCPathType.RIGID_PATH){
            utils.paths.startStraightPath(npc, path, duration,true,
                ()=>{finishedCallback()}, ()=>{pointReachedCallback()})
        }
        else{
            utils.paths.startSmoothPath(npc, path, duration, 30, true, 
                ()=>{finishedCallback()}, ()=>{pointReachedCallback()})
            }
    }
    else{
        utils.paths.startSmoothPath(npc, path, duration, 20, true, 
            ()=>{finishedCallback()}, ()=>{pointReachedCallback()})
    }   

    if (npcData.walkingAnim) {
        Animator.playSingleAnimation(npc, npcDataComponent.get(npc).walkingAnim, true)
        npcData.lastPlayedAnim = npcDataComponent.get(npc).walkingAnim
      }
    npcData.state = NPCState.FOLLOWPATH
    console.log('debug here')
}

export function stopWalking(npc:Entity, duration?: number, finished?:boolean) {
    let npcData = npcDataComponent.get(npc)
    npcData.state = NPCState.STANDING
    npcData.manualStop = true

    stopPath(npc)

    if (duration) {
        utils.timers.setTimeout(()=>{
            //if (this.dialog && this.dialog.isDialogOpen) return
            if(npcData.path){
                Animator.stopAllAnimations(npc, true)
                if(npcDataComponent.get(npc).walkingAnim){
                    Animator.playSingleAnimation(npc, npcDataComponent.get(npc).walkingAnim,true)
                    npcData.lastPlayedAnim = npcDataComponent.get(npc).walkingAnim
                }
                let duration = npcData.pathData.totalDuration
                let currentTimer:number = walkingTimers.get(npc)!
                console.log('current time is', currentTimer)
                if(currentTimer){
                    duration -= currentTimer
                }
    
                let path:any[] = []
                npcData.pathData.path.forEach((p:any)=>{
                    path.push(p)
                })
                path.splice(0,npcData.pathIndex)
    
                let pos = Transform.get(npc).position
                path.unshift(Vector3.create(pos.x, pos.y, pos.z))
    
                npcData.manualStop = false
                walkNPC(npc,npcData, npcData.pathData.pathType, duration, path, pointReachedCallbacks.get(npc), onFinishCallbacks.get(npc))    
            }

        },duration * 1000)
    }
}

function stopPath(npc:Entity){
    utils.paths.stopPath(npc)
    IsFollowingPath.deleteFrom(npc)

    let npcData = npcDataComponent.get(npc)
    if (npcData.walkingAnim) {
        Animator.playSingleAnimation(npc, npcDataComponent.get(npc).walkingAnim)
        npcData.lastPlayedAnim = npcData.idleAnim
    }

    if(!npcData.manualStop){
        if(npcData.pathData.loop){
            npcData.pathIndex = 0
            walkingTimers.delete(npc)
            console.log('we are looping path', npcData)
            followPath(npc, npcData.pathData)
            console.log(npcData)
        }
    }
}

/**
 * Calls the NPC's activation function (set on NPC definition). If NPC has `faceUser` = true, it will rotate to face the player. It starts a cooldown counter to avoid reactivating.
 */
export function activate(npc:Entity) {
    activeNPC = npc
    onActivateCbs.get(npc)()

    let npcData = npcDataComponent.get(npc)
    if (npcData.faceUser) {
        TrackUserFlag.create(npc,{
            lockXZRotation:true,
            active:true,
            rotSpeed:npcData.turnSpeed
        })
    }
    isCooldown.set(npc, true)
    npcData.inCooldown = true

    utils.timers.setTimeout(
        function() {
            isCooldown.delete(npc)
            npcDataComponent.get(npc).inCooldown = false
        },
        1000 * npcData.coolDownDuration
    )
    console.log('activated npc,', npcDataComponent.get(npc))
}

function endInteraction(npc:Entity) {
     let npcData = npcDataComponent.get(npc)
     npcData.state = NPCState.STANDING

        if (npcDialogComponent.has(npc) && npcDialogComponent.get(npc).visible) {
            closeDialog(npc)
        }

        if(npcData.faceUser){
            if(TrackUserFlag.has(npc)){
                TrackUserFlag.deleteFrom(npc)
            }
        }

        console.log('ending interaction', npcData, bubbles.get(npc))
        if(npcData.hasBubble && bubbles.get(npc).isBubbleOpen){
            closeBubble(npc)
        }
}

/**
 * Ends interaction and calls the onWalkAway function
 */
export function handleWalkAway(npc:Entity) {
    let npcData = npcDataComponent.get(npc)
    if (npcData.state == NPCState.FOLLOWPATH) {
        return
    }

    endInteraction(npc)

    if (onWalkAwayCbs.get(npc)) {
        onWalkAwayCbs.get(npc)()
    }
}

export function playAnimation(npc:Entity, anim:string, noLoop?:boolean, duration?:number){
    let animations = Animator.getMutable(npc)
    if(animations.states.filter((animation)=> animation.name === anim).length == 0){
        animations.states.push({name:anim, clip:anim, loop: noLoop? false : true})
    }

    let npcData = npcDataComponent.get(npc)
    if(npcData.state == NPCState.FOLLOWPATH){
        utils.paths.stopPath(npc)
    }

    if(animTimers.has(npc)){
        utils.timers.clearTimeout(animTimers.get(npc))
        animTimers.delete(npc)
    }

    Animator.stopAllAnimations(npc, true)
    Animator.playSingleAnimation(npc, anim, true)
    if(duration){
        console.log('have a duration to play animation')
        animTimers.set(npc, utils.timers.setTimeout(()=>{
            animTimers.delete(npc)
            Animator.stopAllAnimations(npc, true)
            if(npcData.idleAnim){
                Animator.playSingleAnimation(npc, npcData.idleAnim)
                npcData.lastPlayedAnim = npcData.idleAnim
            }
        }, 1000 * duration))//
    } 

    npcData.lastPlayedAnim = anim
}

export function changeIdleAnim(npc:Entity, animation:string, play?:boolean){
    let npcData = npcDataComponent.get(npc)
    npcData.idleAnim = animation

    let animations = Animator.getMutable(npc)
    if(animations.states.filter((anim)=> anim.name === animation).length == 0){
        animations.states.push({name:animation, clip:animation, loop: true})
    }

    if(play){
        playAnimation(npc, animation, true)
        npcDataComponent.get(npc).lastPlayedAnim = animation
    }
}

export function talkBubble(npc:Entity, script:Dialog[], startIndex?:number | string){
    openBubble(npc, script,startIndex)
}

export function createDialogWindow(defaultPortrait?:ImageData, sound?:string){
    let dialog = engine.addEntity()
    addDialog(dialog,sound, defaultPortrait)
    return dialog
}

export function openDialogWindow(npc:Entity, dialog:Dialog[], startIndex?:number | string){
    activeNPC = npc

    if(npcDialogComponent.has(npc)){
        let index:any
        if (!startIndex) {
          index = 0
        } else if (typeof startIndex === 'number') {
          index = startIndex
        } else {
          index = findDialogByName(dialog, startIndex)
        }
        openDialog(npc,dialog, index)
    }
}

export function closeDialogWindow(window:Entity){
    let dialog = npcDialogComponent.get(window)
    if(window){
        closeDialog(dialog)
    }
}