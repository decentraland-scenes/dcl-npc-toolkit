import { engine } from "@dcl/sdk/ecs";
import { IsFollowingPath, IsTypingDialog } from "./components";
import { walkingTimers } from "./npc";
import { npcDialogComponent, npcDialogTypingSystems } from "./dialog";

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
                //engine.removeSystem(npcDialogTypingSystems.get(entity))
            }

            dialogData.visibleText = dialogData.fullText.substr(0, dialogData.visibleChars)
        }
    }
  }