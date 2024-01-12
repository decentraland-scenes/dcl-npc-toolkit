import * as utils from '@dcl-sdk/utils'

import { AudioSource, Entity, engine } from "@dcl/sdk/ecs";
import { activeNPC, clearNPC, closeDialogWindow, followPath, isActiveNpcSet, npcDataComponent, setActiveNPC, stopPath, stopWalking } from "./npc";
import { IsTypingDialog } from "./components";
import { handleDialogTyping } from "./systems";
import { Dialog, ImageData, NPCState } from "./types";
import { leftClickSection, leftClickSectionbBlack, lightTheme, section, skipButtonSection, skipButtonSectionBlack } from './ui';
import { getBubbleTextLength } from './bubble';
import { Color4 } from '@dcl/sdk/math';


export const npcDialogComponent: Map<Entity, any> = new Map()
export const npcDialogTypingSystems: Map<Entity, any> = new Map()
export const npcDialogInputListener: Map<Entity,any> = new Map()

export enum ConfirmMode {
    Confirm = 0,
    Cancel = 1,
    Next = 2,
    Button3 = 3,
    Button4 = 4
  }

export let UIscaleMultiplier = 0.75

let portraitXPos = -50 * UIscaleMultiplier 
let portraitYPos = 20 * UIscaleMultiplier

let imageXPos = 350 * UIscaleMultiplier
let imageYPos = 50 * UIscaleMultiplier

let portraitScale = 256 * UIscaleMultiplier 
let imageScale = 256 * UIscaleMultiplier 

let textSize = 24 * UIscaleMultiplier
let textYPos = 10 * UIscaleMultiplier

let buttonWidth = 174* UIscaleMultiplier
let buttonHeight = 46* UIscaleMultiplier


let buttonTextSize = 20 * UIscaleMultiplier

let button1XPos = 150 * UIscaleMultiplier
let button2XPos = -80 * UIscaleMultiplier
let button3XPos = -80 * UIscaleMultiplier
let button4XPos = 150 * UIscaleMultiplier

let button1YPos = -65 * UIscaleMultiplier
let button2YPos = -65 * UIscaleMultiplier
let button1YPos4 = -20 * UIscaleMultiplier
let button2YPos4 = -20 * UIscaleMultiplier
let button3YPos = -80 * UIscaleMultiplier
let button4YPos = -80 * UIscaleMultiplier

let skipButtonXPos = -300 * UIscaleMultiplier
let skipButtonYPos = -100 * UIscaleMultiplier

let buttonIconWidth = 26 * UIscaleMultiplier
let buttonIconHeight = 26 * UIscaleMultiplier

//

export function addDialog(npc:Entity, sound?:string, defaultPortrait?:ImageData){
    console.log('adding dialog for npc', npc)
    npcDialogComponent.set(npc, {
        typing:true,
        visible:false,
        visibleText:"",
        visibleChars:0,
        fullText:"",
        timer:0,
        speed:30,
        originalScript:[],
        script:[],
        index:0,
        sound: sound ? sound : undefined,
        soundPlayer: sound ? engine.addEntity() : undefined,
        fontSize:22,
        isQuestion:false,
        buttons:0,
        displayPortrait: defaultPortrait ? true : false,
        defaultPortrait: defaultPortrait ? defaultPortrait : null,
        defaultPortraitTexture: defaultPortrait ? defaultPortrait.path : lightTheme,
        currentPortrait: defaultPortrait ? defaultPortrait.path : lightTheme,
        portraitWidth: defaultPortrait && defaultPortrait.width ? defaultPortrait.width * UIscaleMultiplier : portraitScale,
        portraitHeight: defaultPortrait && defaultPortrait.height ? defaultPortrait.height * UIscaleMultiplier : portraitScale,
        portraitX: defaultPortrait && defaultPortrait.offsetX ? defaultPortrait.offsetX * UIscaleMultiplier + portraitXPos : portraitXPos,
        portraitY:  defaultPortrait && defaultPortrait.offsetY ? defaultPortrait.offsetY * UIscaleMultiplier + portraitYPos : portraitYPos,
        portaitSHeight: defaultPortrait && defaultPortrait.section && defaultPortrait.section.sourceHeight ? defaultPortrait.section.sourceHeight : 256,
        portraitSWidth: defaultPortrait && defaultPortrait.section && defaultPortrait.section.sourceWidth ? defaultPortrait.section.sourceWidth : 256,
        portaitSTop: defaultPortrait && defaultPortrait.section && defaultPortrait.section.sourceTop ? defaultPortrait.section.sourceTop : 0,
        portraitSLeft: defaultPortrait && defaultPortrait.section && defaultPortrait.section.sourceLeft ? defaultPortrait.section.sourceLeft : 0
    })
}

export function displayImage(){
  return !isActiveNpcSet() ? false : npcDialogComponent.get(activeNPC).displayImage
}

export function displayPortrait(){
  return !isActiveNpcSet() ? false : npcDialogComponent.get(activeNPC).displayPortrait
}

export function displaySkipable(){
  return !isActiveNpcSet() ? false : npcDialogComponent.get(activeNPC).skipable
}

export function getSkipableTheme(){
  return !isActiveNpcSet() ? skipButtonSectionBlack : npcDataComponent.get(activeNPC).theme == lightTheme ? skipButtonSectionBlack : skipButtonSection
}

export function getLeftClickTheme(){
  return !isActiveNpcSet() ? leftClickSection : npcDataComponent.get(activeNPC).theme == lightTheme ? leftClickSection : leftClickSectionbBlack
}

export function positionTextX(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).positionX
}

export function positionTextY(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).positionY
}

export function positionPortaitX(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).portraitX
}

export function positionPortaitY(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).portraitY
}

export function portraitWidth(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).portraitWidth
}

export function portraitHeight(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).portraitHeight
}

export function positionImageX(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).imageX
}

export function positionImageY(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).imageY
}

export function imageWidth(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).imageWidth
}

export function imageHeight(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).imageHeight
}

export function getPortrait(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).currentPortrait
}

export function getImage(){
  return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).dialogImageTexture
}

export function getText(){
    return !isActiveNpcSet() ? "" : npcDialogComponent.get(activeNPC).visibleText
}

export function getTextColor(){
  return !isActiveNpcSet() ? Color4.Black() : npcDataComponent.get(activeNPC).theme == lightTheme ? Color4.Black() : Color4.White()
}

export function getTheme(){
  return !isActiveNpcSet() ? lightTheme : npcDataComponent.get(activeNPC).theme
}

export function getButtonText(button:number){
    let text = ""

    if(activeNPC != 0 && npcDialogComponent.has(activeNPC)){
        let dialogData = npcDialogComponent.get(activeNPC)
        if(dialogData.isQuestion && dialogData.buttons > button){
            text = dialogData.script[dialogData.index].buttons[button].label
            text = text.slice(0, 15)
        }
    }
    return text
}

export function getbuttonSize(button:number) {
  let ButtonSize: number | string | undefined
  if (activeNPC != 0 && npcDialogComponent.has(activeNPC)) {
      let dialogData = npcDialogComponent.get(activeNPC);
      if (dialogData.isQuestion && dialogData.buttons > button) {
          if (dialogData.script[dialogData.index].buttons[button].size !== undefined) {
              ButtonSize = dialogData.script[dialogData.index].buttons[button]?.size;
          }
      }
  }
  return ButtonSize
}

export function getFontSize(){
    return !isActiveNpcSet() ? 22 : npcDialogComponent.get(activeNPC).fontSize
}

export function displayDialog(){
    return !isActiveNpcSet() ? false :  npcDialogComponent.get(activeNPC).visible
}

export function displayButton(button:number){
    return !isActiveNpcSet() ? false :  npcDialogComponent.get(activeNPC).isQuestion && npcDialogComponent.get(activeNPC).buttons >= button
}

export function displayFirstButtonContainer(){
    return !isActiveNpcSet() ? false :  npcDialogComponent.get(activeNPC).isQuestion && npcDialogComponent.get(activeNPC).buttons >= 1
}

export function displaySecondButtonContainer(){
    return !isActiveNpcSet() ? false :  npcDialogComponent.get(activeNPC).isQuestion && npcDialogComponent.get(activeNPC).buttons >= 3
}

export function getTextPosition(){
    //console.log(npcDialogComponent.get(activeNPC).buttons)
    return !isActiveNpcSet() ? {top:0, left:0} : {top:npcDialogComponent.get(activeNPC).margin + npcDialogComponent.get(activeNPC).positionY, left: npcDialogComponent.get(activeNPC).positionX}
}

export function buttonClick(button:number){
    if(isActiveNpcSet()){
        confirmText(activeNPC, button)
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
    dialogData.script.length = 0
    dialogData.buttons = 0
    dialogData.margin = 0
    dialogData.displayPortrait = false
    dialogData.skipable = false
    dialogData.displayImage = false
    console.log('dialog data is now ', dialogData)

    if(IsTypingDialog.has(npc)){
      IsTypingDialog.deleteFrom(npc)
    }
    // if(npcDataComponent.get(npc).manualStop){
    //   console.log('dialog ended, needto walk again')
    //   followPath(npc)
    // }
    clearNPC()
}

export function talk(npc:Entity, dialog:Dialog[], startIndex?:number | string, duration?:number){
    npcDataComponent.get(npc).introduced = true
    if(npcDialogComponent.has(npc)){

        setActiveNPC(npc)
        if(npcDataComponent.get(npc).state == NPCState.FOLLOWPATH){
          console.log("speaking dialog, need to stop path")
          stopWalking(npc)
        }

        npcDataComponent.get(npc).state = NPCState.TALKING


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

export function openDialog(npc:Entity, dialog:Dialog[], startIndex:number){
    console.log('script to talk is', dialog)
    let dialogData = npcDialogComponent.get(npc)
    dialogData.script = dialog.slice()
    dialogData.index = startIndex

    console.log('dialog data is now', dialogData)
    
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
    //set image on the right
    //set text
    beginTyping(npc)
} 

export function addLineBreak(text:string, bubble?:boolean){
  return lineBreak(text, bubble? getBubbleTextLength(text)! : 45)
}

function beginTyping(npc:Entity){
    let dialogData = npcDialogComponent.get(npc)
    dialogData.fullText = addLineBreak(dialogData.script[dialogData.index].text) //dialogData.script[dialogData.index].text
    dialogData.visible = true
    dialogData.typing = true
    dialogData.visibleText = ""
    dialogData.visibleChars = 0
    dialogData.timer = 0
    dialogData.isQuestion = false
    dialogData.buttons = 0
    dialogData.displayPortrait = false
    dialogData.displayImage = false
    dialogData.skipable = false

    let currentText: Dialog = dialogData.script[dialogData.index] ? dialogData.script[dialogData.index] : { text: '' }
    if(currentText.portrait){
      dialogData.currentPortrait = currentText.portrait.path

      dialogData.portraitX = currentText.portrait.offsetX
      ? currentText.portrait.offsetX * UIscaleMultiplier + portraitXPos
      : portraitXPos

      dialogData.portraitY = currentText.portrait.offsetY
      ? currentText.portrait.offsetY * UIscaleMultiplier + portraitYPos
      : portraitYPos

      dialogData.portraitWidth = currentText.portrait.width ? currentText.portrait.width * UIscaleMultiplier : portraitScale

      dialogData.portraitHeight = currentText.portrait.height ? currentText.portrait.height * UIscaleMultiplier : portraitScale
      dialogData.displayPortrait = true
    }else if(dialogData.defaultPortrait){
      dialogData.currentPortrait = dialogData.defaultPortraitTexture
      dialogData.displayPortrait = true
    }
    else{
      dialogData.displayPortrait = false
    }

    if(dialogData.script[dialogData.index].isQuestion){
        dialogData.buttons = dialogData.script[dialogData.index].buttons.length
        if(dialogData.buttons >= 3){
            dialogData.margin = -25
        }
        else if(dialogData.buttons >=1){
            dialogData.margin = -25
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

    if(dialogData.script[dialogData.index].skipable){
      dialogData.skipable = true
    }
    else{
      dialogData.skipable = false
    }

    if(dialogData.script[dialogData.index].image){
      dialogData.dialogImageTexture = dialogData.script[dialogData.index].image.path
      dialogData.imageX = dialogData.script[dialogData.index].image.offsetX ? dialogData.script[dialogData.index].image.offsetX * UIscaleMultiplier + imageXPos : -40
      dialogData.imageY = dialogData.script[dialogData.index].image.offsetY ? dialogData.script[dialogData.index].image.offsetY * UIscaleMultiplier + imageYPos : 40
      dialogData.imageHeight = dialogData.script[dialogData.index].image.height ? dialogData.script[dialogData.index].height * UIscaleMultiplier : imageScale
      dialogData.imageWidth = dialogData.script[dialogData.index].image.width ? dialogData.script[dialogData.index].width * UIscaleMultiplier : imageScale
      dialogData.displayImage = true
    }

    dialogData.positionX = dialogData.script[dialogData.index].offsetX ? dialogData.script[dialogData.index].offsetX * UIscaleMultiplier : '22%'
    dialogData.positionY = dialogData.script[dialogData.index].offsetY ? dialogData.script[dialogData.index].offsetY * UIscaleMultiplier + textYPos : textYPos
    
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

export function addLineBreaks(dialog:Dialog[], bubble?:boolean){
    let cleaned:Dialog[] = dialog.slice()
    cleaned.forEach((d)=>{
      d.text = lineBreak(d.text, bubble? getBubbleTextLength(d.text)! : 50)
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
  console.log('handling click')
    let npc = activeNPC
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

export function rushText(npc:Entity){
    let dialogData = npcDialogComponent.get(npc)
    dialogData.typing = false
    dialogData.timer = 0
    dialogData.visibleChars = dialogData.fullText.length
    dialogData.visibleText = dialogData.fullText
    //engine.removeSystem(npcDialogTypingSystems.get(npc))
}

export function confirmText(npc:Entity, mode: ConfirmMode): void {
  console.log('confirm text')
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

export function skipDialogs(npc:Entity) {
  let dialogData = npcDialogComponent.get(npc)
  if (!dialogData.visible || +Date.now() - dialogData.openTime < 100) return

  while (
    dialogData.script[dialogData.index] &&
      dialogData.script[dialogData.index].skipable &&
        dialogData.script[dialogData.index].isQuestion
  ){
    if(dialogData.script[dialogData.index].triggeredByNext){
      dialogData.script[dialogData.index].triggeredByNext()
    }

    if(dialogData.script[dialogData.index].skipable &&
      dialogData.script[dialogData.index].isEndOfDialog
      ){
        closeDialogWindow(npc)
        return
      }
    
      dialogData.index += 1
  }
  confirmText(npc, ConfirmMode.Next)
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

  export function findDialogByName(dialogs: Dialog[], name: string) {
    for (let i = 0; i < dialogs.length; i++) {
      if (dialogs[i].name && dialogs[i].name == name) {
        return i
      }
    }
    return 0
  }



export function closeTag(dialogData:any, newChars: number){
  if(dialogData.visibleChars == 0 || newChars ==0 ) return

let openTag: boolean = false
let closeTag : boolean = false
for(let i = dialogData.visibleChars-newChars; i < dialogData.visibleChars ; i++){
  
  if(!openTag){
    if(dialogData.fullText.substr(i, 1) == '<'){
      openTag= true
      
    }
  } else {
    if(dialogData.fullText.substr(i, 1) == '>'){
      closeTag= true
      
    }
  }
}

if(!openTag || closeTag){	
  return
}

while(dialogData.visibleChars < dialogData.fullText.length && dialogData.fullText.substr(dialogData.visibleChars-1, 1) != '>'){
  dialogData.visibleChars+=1
}
return
}