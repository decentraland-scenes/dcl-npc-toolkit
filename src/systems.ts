import { TextShape, engine } from "@dcl/sdk/ecs";
import { IsFollowingPath, IsTypingBubble, IsTypingDialog } from "./components";
import { walkingTimers } from "./npc";
import { npcDialogComponent } from "./dialog";
import { bubbles, next } from "./bubble";

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
            return
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