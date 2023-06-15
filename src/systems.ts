import { Entity, InputAction, PointerEventType, TextShape, Transform, engine, inputSystem } from "@dcl/sdk/ecs";
import { IsFollowingPath, IsTypingBubble, IsTypingDialog, TrackUserFlag } from "./components";
import { activeNPC, walkingTimers } from "./npc";
import { ConfirmMode, confirmText, npcDialogComponent, rushText, skipDialogs } from "./dialog";
import { bubbles, next } from "./bubble";
import { Quaternion, Vector3 } from "@dcl/sdk/math";

export function handlePathTimes(dt:number) {
    for (const [entity] of engine.getEntitiesWith(IsFollowingPath)) {
        if(walkingTimers.has(entity)){
            let elapsed:number = walkingTimers.get(entity)!
            elapsed += dt
            walkingTimers.set(entity, walkingTimers.get(entity)! + dt)
        }
        else{
            walkingTimers.set(entity, dt)
        }
    }
  }

export function handleDialogTyping(dt:number) {
    for (const [entity] of engine.getEntitiesWith(IsTypingDialog)) {
        let dialogData = npcDialogComponent.get(entity)
        if(!dialogData.typing){
            return
        }

        dialogData.timer += dt
        if (dialogData.timer >= 2 / dialogData.speed) {
            let charsToAdd = Math.floor(dialogData.timer / (1 / dialogData.speed))
            dialogData.timer = 0

            dialogData.visibleChars += charsToAdd

            if (dialogData.visibleChars >= dialogData.fullText.length) {
                dialogData.typing = false
                dialogData.visibleChars = dialogData.fullText.length
                IsTypingDialog.deleteFrom(entity)
            }

            dialogData.visibleText = dialogData.fullText.substr(0, dialogData.visibleChars)
        }
    }
  }

  export function handleBubbletyping(dt:number) {
    for (const [entity] of engine.getEntitiesWith(IsTypingBubble)) {
        let dialogData = bubbles.get(entity)
        if(dialogData.done){
            continue
        }

        dialogData.timer += dt

        if (!dialogData.typing) {
            if (dialogData.timer > dialogData.timeOn) {
                //dialogData.isBubbleOpen = false
                dialogData.done = true
                dialogData.typing = false
                dialogData.timer = 0
                next(entity)
            }
          }
       else if (dialogData.timer >= 2 / dialogData.speed) {
            let charsToAdd = Math.floor(dialogData.timer / (1 / dialogData.speed))
            dialogData.timer = 0
            dialogData.visibleChars += charsToAdd
        
            if (dialogData.visibleChars >= dialogData.fullText.length || dialogData.done) {
                dialogData.typing = false
                dialogData.visibleChars = dialogData.fullText.length
                IsTypingDialog.deleteFrom(entity)
            }
            TextShape.getMutable(dialogData.text).text = dialogData.fullText.substr(0, dialogData.visibleChars)
        }
    }
  }

export function faceUserSystem(dt: number) {
  for (const [entity, track] of engine.getEntitiesWith(TrackUserFlag)) {
    if (track.active) {
      const player = Transform.get(engine.PlayerEntity)
      let lookAtTarget = Vector3.create(player.position.x, player.position.y, player.position.z)
      let direction = Vector3.subtract(lookAtTarget, Transform.get(entity).position)

      let transform = Transform.getMutable(entity)
      transform.rotation = Quaternion.slerp(transform.rotation, Quaternion.lookRotation(direction), dt * track.rotSpeed)

      if (track.lockXZRotation) {
        transform.rotation.x = 0
        transform.rotation.z = 0
      }
    }
  }
}

export function inputListenerSystem(){
  const PET = inputSystem.isTriggered(InputAction.IA_PRIMARY,PointerEventType.PET_DOWN)
  const PEP = inputSystem.isPressed(InputAction.IA_PRIMARY)

  const PPET = inputSystem.isTriggered(InputAction.IA_POINTER,PointerEventType.PET_DOWN)
  const PPEP = inputSystem.isPressed(InputAction.IA_POINTER)

  const SET = inputSystem.isTriggered(InputAction.IA_SECONDARY,PointerEventType.PET_DOWN)
  const SEP = inputSystem.isPressed(InputAction.IA_SECONDARY)

  if(PPET && PPEP){
    if(activeNPC){
      let dialogData = npcDialogComponent.get(activeNPC)
      if(!dialogData.visible || Date.now() - dialogData.openTime < 100)return
      if(dialogData.typing){
        rushText(activeNPC)
      }else if(!dialogData.isQuestion){
        confirmText(activeNPC, ConfirmMode.Next)
      }
    }
  }

  if(SET && SEP){
    if(activeNPC){
      let dialogData = npcDialogComponent.get(activeNPC)
      if(!dialogData.visible || Date.now() - dialogData.openTime < 100)return
      if(dialogData.isQuestion){
        confirmText(activeNPC, ConfirmMode.Confirm)
      }else if(!dialogData.isQuestion){
        confirmText(activeNPC, ConfirmMode.Next)
      }
    }
  }

  if(PET && PEP){
    if(activeNPC){
      let dialogData = npcDialogComponent.get(activeNPC)
      if(!dialogData.visible || Date.now() - dialogData.openTime < 100)return
      if(dialogData.isQuestion){
        confirmText(activeNPC, ConfirmMode.Cancel)
      }else if(dialogData.script[dialogData.index].skipable && !dialogData.isFixedScreen){
        skipDialogs(activeNPC)
      }
    }
  }



//
}