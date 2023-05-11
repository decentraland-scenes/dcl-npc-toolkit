import * as utils from '@dcl-sdk/utils'

import { AudioSource, Entity, engine } from "@dcl/sdk/ecs";
import { activeNPC, npcDataComponent } from "./npc";
import { IsTypingDialog } from "./components";
import { handleDialogTyping } from "./systems";
import { Dialog, NPCState } from "./types";
import { section } from './ui';


export const npcDialogComponent: Map<Entity, any> = new Map()
export const npcDialogTypingSystems: Map<Entity, any> = new Map()

export enum ConfirmMode {
    Confirm = 0,
    Cancel = 1,
    Next = 2,
    Button3 = 3,
    Button4 = 4
  }

export function addDialog(npc:Entity, sound?:string){
    console.log('adding dialog for npc', npc)
    npcDialogComponent.set(npc, {
        typing:true,
        visible:false,
        visibleText:"",
        visibleChars:0,
        fullText:"",
        timer:0,
        speed:30,
        script:[],
        index:0,
        sound: sound ? sound : undefined,
        soundPlayer: sound ? engine.addEntity() : undefined,
        fontSize:22,
        isQuestion:false,
        buttons:0
    })
}

export function getText(){
    return activeNPC == 0 || !npcDialogComponent.has(activeNPC as Entity) ? "" : npcDialogComponent.get(activeNPC as Entity).visibleText
}

export function getButtonText(button:number){
    let text = ""

    if(activeNPC != 0 && npcDialogComponent.has(activeNPC as Entity)){
        let dialogData = npcDialogComponent.get(activeNPC as Entity)
        if(dialogData.isQuestion && dialogData.buttons > button){
            text = dialogData.script[dialogData.index].buttons[button].label
        }
    }
    return text
}

export function getFontSize(){
    return activeNPC == 0 || !npcDialogComponent.has(activeNPC as Entity) ? 22 : npcDialogComponent.get(activeNPC as Entity).fontSize
}

export function displayDialog(){
    return activeNPC == 0 || !npcDialogComponent.has(activeNPC as Entity) ? false :  npcDialogComponent.get(activeNPC as Entity).visible
}

export function displayButton(button:number){
    return activeNPC == 0 || !npcDialogComponent.has(activeNPC as Entity) ? false :  npcDialogComponent.get(activeNPC as Entity).isQuestion && npcDialogComponent.get(activeNPC as Entity).buttons >= button
}

export function displayFirstButtonContainer(){
    return activeNPC == 0 || !npcDialogComponent.has(activeNPC as Entity) ? false :  npcDialogComponent.get(activeNPC as Entity).isQuestion && npcDialogComponent.get(activeNPC as Entity).buttons >= 1
}

export function displaySecondButtonContainer(){
    return activeNPC == 0 || !npcDialogComponent.has(activeNPC as Entity) ? false :  npcDialogComponent.get(activeNPC as Entity).isQuestion && npcDialogComponent.get(activeNPC as Entity).buttons >= 3
}

export function getTextPosition(){
    //console.log(npcDialogComponent.get(activeNPC as Entity).buttons)
    return activeNPC == 0 || !npcDialogComponent.has(activeNPC as Entity) ? {top:0} : {top:npcDataComponent.get(activeNPC as Entity).margin}
}

export function buttonClick(button:number){
    if(activeNPC != 0 && npcDataComponent.has(activeNPC as Entity)){
        confirmText(activeNPC as Entity, button)
    }
}

export function closeDialog(npc:Entity){
    let dialogData = npcDialogComponent.get(npc)
    dialogData.visible = false
    dialogData.typing = false
    dialogData.visibleText = ""
    dialogData.visibleChars = 0
    dialogData.fullText = ""
    dialogData.timer = 0
    dialogData.index = 0
    dialogData.script = []
    dialogData.buttons = 0
    dialogData.margin = 0
}

export function talk(npc:Entity, dialog:Dialog[], startIndex?:number, duration?:number){
    npcDataComponent.get(npc).introduced = true
    console.log('trying to talk npc')
    if(npcDialogComponent.has(npc)){
        console.log('we have npc dialog compoentn for ', npc)
        npcDataComponent.get(npc).state = NPCState.TALKING
        openDialog(npc,dialog, startIndex ? startIndex : 0)
    }
}

function openDialog(npc:Entity, dialog:any[], startIndex:number){
    let dialogData = npcDialogComponent.get(npc)
    dialogData.script = addLineBreaks(dialog)
    dialogData.index = startIndex
    
    let currentText: Dialog = dialog[startIndex] ? dialog[startIndex] : { text: '' }

    if (currentText.audio) {
        AudioSource.createOrReplace(dialogData.soundPlayer, {
            audioClipUrl: currentText.audio,
            loop: false,
            playing: false
        })
        let audio = AudioSource.getMutable(dialogData.soundPlayer)
        audio.volume = 0.5
        audio.playing = true
    } else if (dialogData.sound) {
        AudioSource.createOrReplace(dialogData.soundPlayer, {
            audioClipUrl: dialogData.sound,
            loop: false,
            playing: false
        })
        let audio = AudioSource.getMutable(dialogData.soundPlayer)
        audio.volume = 0.5
        audio.playing = true
    }

    //TODO
    //set portrait
    //set image on the right
    //set text
    //global button actions

    beginTyping(npc)
}

function beginTyping(npc:Entity){
    let dialogData = npcDialogComponent.get(npc)
    dialogData.fullText = dialogData.script[dialogData.index].text
    dialogData.visible = true
    dialogData.typing = true
    dialogData.visibleText = ""
    dialogData.visibleChars = 0
    dialogData.timer = 0
    dialogData.isQuestion = false
    dialogData.buttons = 0

    if(dialogData.script[dialogData.index].isQuestion){
        dialogData.buttons = dialogData.script[dialogData.index].buttons.length
        if(dialogData.buttons >= 3){
            dialogData.margin = -300
        }
        else if(dialogData.buttons >=1){
            dialogData.margin = -300
        }

        console.log(dialogData)
        utils.timers.setTimeout(
            function() {
                console.log('setting question to true')
                dialogData.isQuestion = true
            },
            700
          )
    }

    dialogData.openTime = Math.floor(Date.now())
    if(dialogData.script[dialogData.index].fontSize){
        dialogData.fontSize = dialogData.script[dialogData.index].fontSize
    }
    
    if(dialogData.script[dialogData.index].hasOwnProperty("typeSpeed")){
        dialogData.speed = dialogData.script[dialogData.index].typeSpeed
    }
    else{
        dialogData.speed = 30
    }

    if(dialogData.speed <= 0){
        rushText(npc)
    }
    else{
        if(!IsTypingDialog.has(npc)){
            IsTypingDialog.create(npc)
        }
    
        // if(!npcDialogTypingSystems.has(npc)){
        //     npcDialogTypingSystems.set(npc,engine.addSystem(handleDialogTyping))
        // }
    }
}

function addLineBreaks(dialog:Dialog[]){
    let cleaned:Dialog[] = []
    dialog.forEach((d)=>{
        d.text = lineBreak(d.text, 50)
        cleaned.push(d)
    })
    return cleaned
}

function lineBreak(text: string, maxLineLength: number): string {
    const words = text.split(' ');
    let currentLine = '';
    const lines = [];
  
    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxLineLength) {
        currentLine += `${word} `;
      } else {
        lines.push(currentLine.trim());
        currentLine = `${word} `;
      }
    }
    lines.push(currentLine.trim());
    return lines.join('\n');
}

export function handleDialogClick(){
    let npc = activeNPC as Entity
    if(npcDialogComponent.has(npc)){
        let dialogData = npcDialogComponent.get(npc)
        if(!dialogData.visible || (Math.floor(Date.now()) - dialogData.openTime  < 100)) return
        
        if(dialogData.typing){
            rushText(npc)
        }
        else{
            confirmText(npc, ConfirmMode.Next)
        }
    }
}

function rushText(npc:Entity){
    let dialogData = npcDialogComponent.get(npc)
    dialogData.typing = false
    dialogData.timer = 0
    dialogData.visibleChars = dialogData.fullText.length
    dialogData.visibleText = dialogData.fullText
    //engine.removeSystem(npcDialogTypingSystems.get(npc))
}
export function confirmText(npc:Entity, mode: ConfirmMode): void {
    let dialogData = npcDialogComponent.get(npc)
    dialogData.openTime = Math.floor(Date.now())

    let currentText = dialogData.script[dialogData.index]
    // Update active text
    if (mode == ConfirmMode.Next) {
        if (!currentText.isQuestion) {
            if (currentText.triggeredByNext) {
            currentText.triggeredByNext()
            }
            if (currentText.isEndOfDialog) {
            closeDialog(npc)
            return
            }
            dialogData.index++
        }
    }

    if (mode == ConfirmMode.Confirm) {
        if (currentText.buttons && currentText.buttons.length >= 1) {
          if (typeof currentText.buttons[0].goToDialog === 'number') {
            dialogData.index = currentText.buttons[0].goToDialog
          } 

          //TODO
          //allow dialogs to be index by name
        //   else {
        //     this.activeTextId = findDialogByName(this.NPCScript, currentText.buttons[0].goToDialog)
        //   }
          if (currentText.buttons[0].triggeredActions) {
            currentText.buttons[0].triggeredActions()
          }
        }
    }

    if (mode == ConfirmMode.Cancel) {
        if (currentText.buttons && currentText.buttons.length >= 1) {
          if (typeof currentText.buttons[1].goToDialog === 'number') {
            dialogData.index = currentText.buttons[1].goToDialog
          } 

          //TODO
          //allow dialogs to be index by name
        //   else {
        //     this.activeTextId = findDialogByName(this.NPCScript, currentText.buttons[0].goToDialog)
        //   }
          if (currentText.buttons[1].triggeredActions) {
            currentText.buttons[1].triggeredActions()
          }
        }
    }

    if (mode == ConfirmMode.Button3) {
        if (currentText.buttons && currentText.buttons.length >= 1) {
          if (typeof currentText.buttons[2].goToDialog === 'number') {
            dialogData.index = currentText.buttons[2].goToDialog
          } 

          //TODO
          //allow dialogs to be index by name
        //   else {
        //     this.activeTextId = findDialogByName(this.NPCScript, currentText.buttons[0].goToDialog)
        //   }
          if (currentText.buttons[2].triggeredActions) {
            currentText.buttons[2].triggeredActions()
          }
        }
    }

    if (mode == ConfirmMode.Button4) {
        if (currentText.buttons && currentText.buttons.length >= 1) {
          if (typeof currentText.buttons[3].goToDialog === 'number') {
            dialogData.index = currentText.buttons[3].goToDialog
          } 

          //TODO
          //allow dialogs to be index by name
        //   else {
        //     this.activeTextId = findDialogByName(this.NPCScript, currentText.buttons[0].goToDialog)
        //   }
          if (currentText.buttons[3].triggeredActions) {
            currentText.buttons[3].triggeredActions()
          }
        }
    }


    beginTyping(npc)
}

export type ImageAtlasData = {
    atlasWidth: number;
    atlasHeight: number;
    sourceWidth: number;
    sourceHeight: number;
    sourceLeft: number;
    sourceTop: number;
  }
  

export function getImageAtlasMapping(data?: ImageAtlasData): number[] {
    if (!data) return []
  
    const {
      atlasWidth,
      atlasHeight,
      sourceWidth,
      sourceHeight,
      sourceTop,
      sourceLeft,
    } = data
  
    return [
      sourceLeft / atlasWidth, (atlasHeight - sourceTop - sourceHeight) / atlasHeight,
      sourceLeft / atlasWidth, (atlasHeight - sourceTop) / atlasHeight,
      (sourceLeft + sourceWidth) / atlasWidth, (atlasHeight - sourceTop) / atlasHeight,
      (sourceLeft + sourceWidth) / atlasWidth, (atlasHeight - sourceTop - sourceHeight) / atlasHeight,
    ]
  }

  export function realWidth(width?:number): number {
    return width ? width : section.sourceWidth
  }

  export function realHeight(height?:number): number {
    return height ? height : section.sourceHeight
  }