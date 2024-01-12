import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Entity } from '@dcl/sdk/ecs'
import {
  buttonClick,
  confirmText,
  displayButton,
  displayDialog,
  displayFirstButtonContainer,
  displayImage,
  displayPortrait,
  displaySecondButtonContainer,
  displaySkipable,
  getButtonText,
  getbuttonSize,
  getFontSize,
  getImage,
  getImageAtlasMapping,
  getLeftClickTheme,
  getPortrait,
  getSkipableTheme,
  getText,
  getTextColor,
  getTextPosition,
  getTheme,
  handleDialogClick,
  imageHeight,
  imageWidth,
  portraitHeight,
  portraitWidth,
  positionImageX,
  positionImageY,
  positionPortaitX,
  positionPortaitY,
  positionTextX,
  positionTextY,
  realHeight,
  realWidth,
  skipDialogs
} from './dialog'
import { sourcesComponentsCoordinates } from './uiResources'
import { activeNPC } from './npc'

export let lightTheme = 'https://decentraland.org/images/ui/light-atlas-v3.png'
export let darkTheme = 'https://decentraland.org/images/ui/dark-atlas-v3.png'

export let bubblesTexture = 'https://decentraland.org/images/ui/dialog-bubbles.png'

export let section = {
  ...sourcesComponentsCoordinates.backgrounds.NPCDialog,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let skipButtonSection = {
  ...sourcesComponentsCoordinates.buttons.F,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let skipButtonSectionBlack = {
  ...sourcesComponentsCoordinates.buttons.FBlack,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let leftClickSection = {
  ...sourcesComponentsCoordinates.icons.ClickWhite,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let leftClickSectionbBlack = {
  ...sourcesComponentsCoordinates.icons.ClickDark,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let primaryButtonSection = {
  ...sourcesComponentsCoordinates.buttons.E,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let secondaryButtonSection = {
  ...sourcesComponentsCoordinates.buttons.F,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let darkButtonSection = {
  ...sourcesComponentsCoordinates.buttons.buttonF,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let redButtonSection = {
  ...sourcesComponentsCoordinates.buttons.buttonE,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

let modalScale = 1
let modelFontSizeScale = 1
let modalTextWrapScale = 1

export function setupNPCUiScaling(inModalScale: number, inFontSize: number, inModalTextWrapScale: number) {
  modalScale = inModalScale
  modelFontSizeScale = inFontSize
  modalTextWrapScale = inModalTextWrapScale
  console.log(
    'NPC-TOOLKIT',
    'Scale UI:',
    modalScale,
    'TextFontSize:',
    modelFontSizeScale,
    'TextWrapScaling:',
    modalTextWrapScale
  )
}

function getScaledSize(size: number): number {
  return size * modalScale
}
function getScaledFontSize(size: number): number {
  return size * modelFontSizeScale
}
function getScaledTextWrap(size: number): number {
  return size * modalTextWrapScale
}
function getScaledParentsButtonWidth(firstButton:number, secondButton:number) {
  return getScaledSize(getButtonText(firstButton).length * 16 + getButtonText(secondButton).length * 16) >= 300 && (getbuttonSize(firstButton) != '' || getbuttonSize(secondButton) != '')
  ? getScaledSize(
      (typeof(getbuttonSize(firstButton)) === 'number' ? getbuttonSize(firstButton) as number : getButtonText(firstButton).length * 14) 
      + (typeof(getbuttonSize(secondButton)) === 'number' ? getbuttonSize(secondButton) as number : getButtonText(secondButton).length * 14)) 
  : getScaledSize(300)
}
function getScaledButtonWidth(button:number) {
  return getbuttonSize(button) === 'auto' ? getScaledSize(getButtonText(button).length * 8 + 80) 
  : getScaledSize(typeof(getbuttonSize(button)) === 'number' ? getbuttonSize(button) as number : getScaledSize(150))
}
export const NpcUtilsUi = () => {
  const width = getScaledSize(realWidth(700))
  const height = getScaledSize(realHeight(225))

  return (
    <UiEntity
      uiTransform={{
        display: displayDialog() ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        positionType: 'absolute',
        position: { bottom: '10%', left: '50%' },
        margin: { top: (-height + getText().length / 2) / 2, left: -width / 2 },
        width,
        height: height + getText().length / 1.5
      }}
    >
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { top: 0, left: 0 },
          width: '100%',
          height: '100%'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: getTheme()
          },
          uvs: getImageAtlasMapping(section)
        }}
        onMouseDown={() => {
          handleDialogClick()
        }}
      />

      <UiEntity
        uiTransform={{
          display: displayPortrait() ? 'flex' : 'none',
          width: getScaledSize(portraitWidth()),
          height: getScaledSize(portraitHeight()),
          positionType: 'absolute',
          position: {
            bottom: getScaledSize(positionPortaitY()),
            left: getScaledSize(positionPortaitX())
          }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: getPortrait()
          }
          // uvs: getImageAtlasMapping(skipButtonSection),
        }}
      />

      <UiEntity
        uiTransform={{
          display: displayImage() ? 'flex' : 'none',
          width: getScaledSize(imageWidth()),
          height: getScaledSize(imageHeight()),
          positionType: 'absolute',
          position: { bottom: positionImageY(), right: positionImageX() }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: getImage()
          }
          // uvs: getImageAtlasMapping(skipButtonSection),
        }}
      />

      <UiEntity
        uiTransform={{
          display: displaySkipable() ? 'flex' : 'none',
          width: getScaledSize(15),
          height: getScaledSize(15),
          positionType: 'absolute',
          position: { bottom: '7%', left: '25%' }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: getTheme()
          },
          uvs: getImageAtlasMapping(getSkipableTheme())
        }}
        onMouseDown={() => {
          skipDialogs(activeNPC)
        }}
      >
        <UiEntity
          uiTransform={{
            display: 'flex',
            positionType: 'absolute',
            position: { left: '215%' }
          }}
          uiText={{
            value: 'Skip',
            color: getTextColor(),
            fontSize: getScaledFontSize(12)
          }}
        />
      </UiEntity>

      <UiEntity
        uiTransform={{
          display: 'flex',
          width: getScaledSize(24),
          height: getScaledSize(36),
          positionType: 'absolute',
          position: { bottom: '5%', right: '2%' }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: getTheme()
          },
          uvs: getImageAtlasMapping(getLeftClickTheme())
        }}
      />

      <UiEntity
        uiTransform={{
          alignSelf: 'flex-start',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          position: getTextPosition(),
          margin: {bottom: getText().length/10}
        }}
        uiText={{
          value: getText(),
          color: getTextColor(),
          fontSize: getScaledFontSize(getFontSize()),
          textAlign: 'middle-left'
        }}
      ></UiEntity>

      <UiEntity
        uiTransform={{
          width: getScaledParentsButtonWidth(0,1),
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          display: displayFirstButtonContainer() ? 'flex' : 'none',
          position: { top: getText().length / 4 }
        }}
      >
        {/* Button1 (Top-Left) */}
        <UiEntity
          uiTransform={{
            width: getScaledButtonWidth(0),
            height: getScaledSize(45),
            margin: { right: '5%' },
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
            display: displayButton(1) ? 'flex' : 'none',
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: getTheme()
            },
            uvs: getImageAtlasMapping(darkButtonSection)
          }}
          uiText={{ value: getButtonText(0), fontSize: getScaledFontSize(16) }}
          onMouseDown={() => {
            buttonClick(0)
          }}
        >
          <UiEntity
            uiTransform={{
              width: getScaledSize(25),
              height: getScaledSize(25),
              position: { left: getScaledSize(5) }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(secondaryButtonSection)
            }}
          ></UiEntity>
        </UiEntity>

        {/* Button2 (Top-Right) */}
        <UiEntity
          uiTransform={{
            width: getScaledButtonWidth(1),
            height: getScaledSize(45),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignContent: 'flex-start',
            display: displayButton(2) ? 'flex' : 'none'
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: getTheme()
            },
            uvs: getImageAtlasMapping(redButtonSection)
          }}
          uiText={{ value: getButtonText(1), fontSize: getScaledFontSize(16) }}
          onMouseDown={() => {
            buttonClick(1)
          }}
        >
          <UiEntity
            uiTransform={{
              width: getScaledSize(25),
              height: getScaledSize(25),
              position: { left: getScaledSize(5) }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(primaryButtonSection)
            }}
          ></UiEntity>
        </UiEntity>
      </UiEntity>

      {/* Second row of buttons */}
      <UiEntity
        uiTransform={{
          width: getScaledParentsButtonWidth(2,3),
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: { top: getScaledSize(20) },
          display: displaySecondButtonContainer() ? 'flex' : 'none',
          position: { top: getText().length / 4 }
        }}
      >
        {/* Button3 */}
        <UiEntity
          uiTransform={{
            width: getScaledButtonWidth(2),
            height: getScaledSize(45),
            margin: { right: '5%' },
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'flex-start',
            display: displayButton(3) ? 'flex' : 'none'
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: getTheme()
            },
            uvs: getImageAtlasMapping(darkButtonSection)
          }}
          uiText={{ value: getButtonText(2), fontSize: getScaledFontSize(16) }}
          onMouseDown={() => {
            buttonClick(3)
          }}
        ></UiEntity>

        {/* Button4 */}
        <UiEntity
          uiTransform={{
            width: getScaledButtonWidth(3),
            height: getScaledSize(45),
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'flex-start',
            display: displayButton(4) ? 'flex' : 'none'
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: getTheme()
            },
            uvs: getImageAtlasMapping(darkButtonSection)
          }}
          uiText={{ value: getButtonText(3), fontSize: getScaledFontSize(16) }}
          onMouseDown={() => {
            buttonClick(4)
          }}
        ></UiEntity>
      </UiEntity>
    </UiEntity>
  )
}
