
import { Animator, AudioSource, AvatarShape, Billboard, BillboardMode, engine, Entity, Font, GltfContainer, InputAction,Material,MeshCollider,MeshRenderer,pointerEventsSystem,TextAlignMode,TextShape,Transform, TransformType, VisibilityComponent } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { Dialog, ImageSection } from './types'
import { Color3,Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { addLineBreak, addLineBreaks, findDialogByName } from './dialog'
import { IsTypingBubble } from './components'
import { npcDataComponent } from './npc'

export let bubblesTexture = 'https://decentraland.org/images/ui/dialog-bubbles.png'

export let bubbles: Map<Entity, any> = new Map()

let textSize = 1
let textYPos = 0    

let maxLengthShortBubble = 8
let maxLengthNormalBubble = 25
let maxLengthLongBubble = 50
let maxLengthHugeBubble = 100

let shortBubbleXOffset = 0.1
let normalBubbleXOffset = 0.5
let longBubbleXOffset = 0.8
let hugeBubbleXOffset = 0.8

let shortBubbleYOffset = -0.2
let normalBubbleYOffset = -0.2
let longBubbleYOffset = 0
let hugeBubbleYOffset = 0.2

let shortBubbleTextWidth = 0.7
let normalBubbleTextWidth = 1.5
let longBubbleTextWidth = 2
let hugeBubbleTextWidth = 1.5

let shortBubbleX = 116 * 0.005
let shortBubbleY = 84 * 0.005

let normalBubbleX = 286 * 0.005
let normalBubbleY = 84 * 0.005

let longBubbleX = 497 * 0.005
let longBubbleY = 153 * 0.005

let hugeBubbleX = 497 * 0.005
let hugeBubbleY = 239 * 0.005

let defaultYOffset = 2.5



export function createDialogBubble(npc:Entity, height?:number, sound?:string){
    let baseYOffset = height ? height : defaultYOffset

    let root = engine.addEntity()
    Billboard.create(root,{
        billboardMode:BillboardMode.BM_Y
    })

    Transform.create(root,{
        parent:npc
    })

    let container = engine.addEntity()
    Transform.create(container,{
        parent:root,
        position:Vector3.create(shortBubbleXOffset,baseYOffset,0)
    })

    let panel = engine.addEntity()
    Transform.create(panel,{
        parent:container,
        scale: Vector3.create(2,1,1),
        //rotation:Quaternion.fromEulerDegrees(0,0,90)
    })
    MeshRenderer.setPlane(panel,
        setUVSection(
        bubbleOptions.normal,
        1024,
        1024
      ))

    VisibilityComponent.create(panel, {visible: false})

    Material.setBasicMaterial(panel, {
        texture: Material.Texture.Common({
          src: bubblesTexture
        }),
        alphaTexture: Material.Texture.Common({
          src: bubblesTexture
        }),
        alphaTest: 0.5
      })

    let text = engine.addEntity()
    Transform.create(text,{
        position:Vector3.create(0,textYPos, -.05),
        parent:container
    })
    TextShape.create(text, {
        text:"", 
        fontSize:textSize,
        font: Font.F_SANS_SERIF,
        textColor: Color4.create(0,0,0,1),
        textAlign:TextAlignMode.TAM_MIDDLE_CENTER
    })
    VisibilityComponent.create(text, {visible: false})

    bubbles.set(npc, {
        container:container,
        panel:panel,
        text:text,
        baseYOffset: baseYOffset,
        isBubbleOpen:false,
        typing:false,
        visibleText:"",
        visibleChars:0,
        fullText:"",
        timer:0,
        speed:30,
        script:[],
        index:0,
        sound: sound ? sound : undefined,
        soundPlayer: sound ? engine.addEntity() : undefined,
    })
}

export function openBubble(npc:Entity, dialog:Dialog[], startIndex?:number | string){
    let bubble = bubbles.get(npc)

    bubble.script = dialog.slice()
    let index:any
    if (!startIndex) {
      index = 0
    } else if (typeof startIndex === 'number') {
      index = startIndex
    } else {
      index = findDialogByName(dialog, startIndex)
    }

    bubble.index = index
    
    let currentText: Dialog = dialog[bubble.index] ? dialog[bubble.index] : { text: '' }
    bubble.currentText = currentText

    if (currentText.audio) {
        AudioSource.createOrReplace(bubble.soundPlayer, {
            audioClipUrl: currentText.audio,
            loop: false,
            playing: false
        })
        let audio = AudioSource.getMutable(bubble.soundPlayer)
        audio.volume = 0.5
        audio.playing = true
    } else if (bubble.sound) {
        AudioSource.createOrReplace(bubble.soundPlayer, {
            audioClipUrl: bubble.sound,
            loop: false,
            playing: false
        })
        let audio = AudioSource.getMutable(bubble.soundPlayer)
        audio.volume = 0.5
        audio.playing = true
    }

    let text = bubble.text
    TextShape.getMutable(text).fontSize = currentText.fontSize ? currentText.fontSize : textSize
    Transform.getMutable(text).position.y = currentText.offsetY ? currentText.offsetY + textYPos : textYPos
    Transform.getMutable(text).position.x = currentText.offsetX ? currentText.offsetX : 0

    VisibilityComponent.getMutable(bubble.panel).visible = true

    if (currentText.text.length < maxLengthHugeBubble) {
        currentText.text.slice(0, maxLengthHugeBubble)
      }

    beginTyping(
        npc,
        currentText.text,
        bubble.index,
        currentText.timeOn ? currentText.timeOn : undefined,
        currentText.typeSpeed ? currentText.typeSpeed : undefined 
    )

    adjustBubble(npc, currentText.text.length)
    layoutDialogWindow(npc, bubble.index)
    bubble.isBubbleOpen = true
}

export function closeBubble(npc:Entity){
    let bubble = bubbles.get(npc)
        bubble.isBubbleOpen = false
        bubble.typing = false
        bubble.visibleText = ""
        bubble.visibleChars = 0
        bubble.fullText = ""
        bubble.timer = 0
        bubble.index = 0
        bubble.script = []
        bubble.buttons = 0
        bubble.margin = 0
        bubble.currentText = null
        TextShape.getMutable(bubble.text).text = ""
        VisibilityComponent.getMutable(bubble.text).visible = false
        VisibilityComponent.getMutable(bubble.panel).visible = false
}

export function closeBubbleEndAll(npc:Entity): void {
    let bubble = bubbles.get(npc)
    if (bubble.isBubbleOpen) {
        bubble.done = true
        closeBubble(npc)
    }
  }

const DEFAULT_SPEED = 45

const DEFAULT_TIME_ON = 3

function beginTyping(npc:Entity, text:string, textId:number, timeOn?:number, speed?:number){
    let dialogData = bubbles.get(npc)
    dialogData.fullText = addLineBreak(dialogData.script[dialogData.index].text, true)
    dialogData.typing = true
    dialogData.done = false
    dialogData.visibleText = ""
    dialogData.visibleChars = 0
    dialogData.timer = 0
    dialogData.buttons = 0
    dialogData.timeOn = timeOn ? timeOn : DEFAULT_TIME_ON
    dialogData.speed = speed ? speed : DEFAULT_SPEED

    dialogData.openTime = Math.floor(Date.now())

    if(dialogData.speed <= 0){
        rushText(npc)
    }
    else{
        if(!IsTypingBubble.has(npc)){
            console.log('creating typuing bubble')
            IsTypingBubble.create(npc)
        }
    }
}

function rushText(npc:Entity){
    let dialogData = bubbles.get(npc)
    dialogData.typing = false
    dialogData.timer = 0
    dialogData.visibleChars = dialogData.fullText.length
    dialogData.visibleText = dialogData.fullText
}

function adjustBubble(npc:Entity, textLength:number){
    let bubble = bubbles.get(npc)
    let npcData = npcDataComponent.get(npc)

    if (textLength < maxLengthShortBubble) {
        MeshRenderer.setPlane(bubble.panel,
            setUVSection(
            bubbleOptions.short,
            1024,
            1024
          ))

        Transform.getMutable(bubble.panel).scale.x = shortBubbleX
        Transform.getMutable(bubble.panel).scale.y = shortBubbleY
        Transform.getMutable(bubble.container).position.x = shortBubbleXOffset + npcData.bubbleXOffset
        Transform.getMutable(bubble.container).position.y = bubble.baseYOffset + shortBubbleYOffset + npcData.bubbleYOffset
        TextShape.getMutable(bubble.text).width = shortBubbleTextWidth
      } else if (textLength < maxLengthNormalBubble) {
        MeshRenderer.setPlane(bubble.panel,
            setUVSection(
            bubbleOptions.normal,
            1024,
            1024
          ))

        Transform.getMutable(bubble.panel).scale.x = normalBubbleX
        Transform.getMutable(bubble.panel).scale.y = normalBubbleY
        Transform.getMutable(bubble.container).position.x = normalBubbleXOffset + npcData.bubbleXOffset
        Transform.getMutable(bubble.container).position.y = bubble.baseYOffset + normalBubbleYOffset + npcData.bubbleYOffset
        TextShape.getMutable(bubble.text).width = normalBubbleTextWidth
      } else if (textLength < maxLengthLongBubble) {
        MeshRenderer.setPlane(bubble.panel,
            setUVSection(
            bubbleOptions.long,
            1024,
            1024
          ))

        Transform.getMutable(bubble.panel).scale.x = longBubbleX
        Transform.getMutable(bubble.panel).scale.y = longBubbleY
        Transform.getMutable(bubble.container).position.x = longBubbleXOffset + npcData.bubbleXOffset
        Transform.getMutable(bubble.container).position.y = bubble.baseYOffset + longBubbleYOffset + npcData.bubbleYOffset
        TextShape.getMutable(bubble.text).width = longBubbleTextWidth
      } else {
        MeshRenderer.setPlane(bubble.panel,
            setUVSection(
            bubbleOptions.huge,
            1024,
            1024
          ))
        Transform.getMutable(bubble.panel).scale.x = hugeBubbleX
        Transform.getMutable(bubble.panel).scale.y = hugeBubbleY
        Transform.getMutable(bubble.container).position.x = hugeBubbleXOffset + npcData.bubbleXOffset
        Transform.getMutable(bubble.container).position.y = bubble.baseYOffset + hugeBubbleYOffset + npcData.bubbleYOffset
        TextShape.getMutable(bubble.text).width = hugeBubbleTextWidth
      }
}

// Adds the buttons or mouse icon depending on the type of window
function layoutDialogWindow(npc:Entity, textId: number): void {
    let bubble = bubbles.get(npc)
    let currentText: Dialog = bubble.script[textId]
      ? bubble.script[textId]
      : { text: '' }

    // Update text
    let textY = currentText.offsetY ? currentText.offsetY + textYPos : textYPos

    if (currentText.buttons && currentText.buttons.length >= 3) {
      textY += 50
    } else if (currentText.buttons && currentText.buttons.length >= 1) {
      textY += 24
    }
    TextShape.getMutable(bubble.text).fontSize = currentText.fontSize
    ? currentText.fontSize
    : textSize
    
    VisibilityComponent.getMutable(bubble.text).visible = true
    Transform.getMutable(bubble.text).position.y = textY

    if (currentText.audio) {
        AudioSource.createOrReplace(bubble.soundPlayer, {
            audioClipUrl: currentText.audio,
            loop: false,
            playing: false
        })
        let audio = AudioSource.getMutable(bubble.soundPlayer)
        audio.volume = 0.5
        audio.playing = true
    } else if (bubble.sound) {
        AudioSource.createOrReplace(bubble.soundPlayer, {
            audioClipUrl: bubble.sound,
            loop: false,
            playing: false
        })
        let audio = AudioSource.getMutable(bubble.soundPlayer)
        audio.volume = 0.5
        audio.playing = true
    }

  }

// Progresses text
export function next(npc:Entity): void {
    let bubble = bubbles.get(npc)

    if(bubble.isBubbleOpen){
      let currentText = bubble.script[bubble.index]

      if(!currentText){
        currentText = bubble.script[bubble.index-1]
      }
    
        if (currentText.triggeredByNext) {
          currentText.triggeredByNext()
        }
    
        if (currentText.isEndOfDialog) {
          closeBubble(npc)
          return
        }
       
       // Update active text
         bubble.index++
    
        // Update active text with new active text
        currentText = bubble.script[bubble.index]
    
        if (currentText.text.length < maxLengthHugeBubble) {
          currentText.text.slice(0, maxLengthHugeBubble)
        }
    
        TextShape.getMutable(bubble.text).text = ""
    
        adjustBubble(npc, currentText.text.length)
    
        beginTyping(
            npc,
            currentText.text,
            bubble.index,
            currentText.timeOn ? currentText.timeOn : undefined,
            currentText.typeSpeed ? currentText.typeSpeed : undefined 
        )
      layoutDialogWindow(npc, bubble.index)
    }

    
  }

function setUVSection(
	section: ImageSection,
	sizeX: number,
	sizeY: number
  ) {
	return setUVs(
        {x:  section.sourceLeft! / sizeX, y: (sizeY - section.sourceTop! - section.sourceHeight) / sizeY},
        {x:  (section.sourceLeft! + section.sourceWidth) / sizeX, y: (sizeY - section.sourceTop! - section.sourceHeight) / sizeY},
        {x:  (section.sourceLeft! + section.sourceWidth) / sizeX, y:  (sizeY - section.sourceTop!) / sizeY},
        {x:  section.sourceLeft! / sizeX, y: (sizeY - section.sourceTop!) / sizeY},
	)
  }

function setUVs(
	_uv00: any,
	_uv10: any,
	_uv11: any,
	_uv01: any
  ) {

	return [
	  _uv00.x,
	  _uv00.y,
  
    _uv01.x,
	  _uv01.y,
  
	  _uv11.x,
	  _uv11.y,

    _uv10.x,
	  _uv10.y,

	  
	  //----
	  _uv00.x,
	  _uv00.y,

    _uv01.x,
	  _uv01.y,
    
    _uv11.x,
	  _uv11.y,
    
	  _uv10.x,
	  _uv10.y,
  
	 
  
	 
	]
  }

  let bubbleOptions:any = {
    short: {
      sourceWidth: 116 * 2,
      sourceHeight: 84 * 2,
      sourceLeft: 305 * 2,
      sourceTop: 417 * 2,
    },
    normal: {
      sourceWidth: 286 * 2,
      sourceHeight: 84 * 2,
      sourceLeft: 8 * 2,
      sourceTop: 417 * 2,
    },
    long: {
      sourceWidth: 497 * 2,
      sourceHeight: 153 * 2,
      sourceLeft: 6 * 2,
      sourceTop: 254 * 2,
    },
    huge: {
      sourceWidth: 497 * 2,
      sourceHeight: 239 * 2,
      sourceLeft: 6 * 2,
      sourceTop: 7 * 2,
    },
}


export function getBubbleTextLength(text:string){
    if(text.length >= maxLengthHugeBubble){
        return 40
    }
    else if(text.length >= maxLengthLongBubble){
        return 40
    }
    else if(text.length >= maxLengthNormalBubble){
        return 40
    }
    else if(text.length >= maxLengthShortBubble){
        return 40
    }
  }