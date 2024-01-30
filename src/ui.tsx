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
  skipDialogs,
  getWindowHeight
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

export let darkButtonCorner = {
  ...sourcesComponentsCoordinates.buttons.buttonFCorner,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let darkButtonEdge = {
  ...sourcesComponentsCoordinates.buttons.buttonFEdge,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let redButtonSection = {
  ...sourcesComponentsCoordinates.buttons.buttonE,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let redButtonCorner = {
  ...sourcesComponentsCoordinates.buttons.buttonECorner,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth
}

export let redButtonEdge = {
  ...sourcesComponentsCoordinates.buttons.buttonEEdge,
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
function getScaledButtonWidth(button: number) {
  return typeof (getbuttonSize(button)) === 'number' ? getScaledSize(getbuttonSize(button) as number) : 'auto'
}

export const NpcUtilsUi = () => {
  const width = getScaledSize(realWidth(700))
  const height = getScaledSize(realHeight(284))

  return (
    <UiEntity
      uiTransform={{
        display: displayDialog() ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        positionType: 'absolute',
        position: { bottom: '10%', left: '50%' },
        margin: { top: -height / 2, left: -width / 2 },
        padding: { top: 40, bottom: 40 },
        width,
        height: typeof (getWindowHeight()) === 'number' ? getWindowHeight() as number : 'auto'
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
          height: 'auto',
          width: 'auto',
          alignSelf: 'flex-start',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          position: getTextPosition(),
          display: 'flex',
          flexGrow: 1,
          minHeight: 100
        }}
        uiText={{
          value: getText(),
          color: getTextColor(),
          fontSize: getScaledFontSize(getFontSize()),
          textAlign: 'middle-left'
        }}
      />

      <UiEntity
        uiTransform={{
          width: getScaledButtonWidth(450),
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          display: displayFirstButtonContainer() ? 'flex' : 'none',
        }}
      >
        {/* Button1 (Top-Left) */}
        <UiEntity>
          <UiEntity
            uiTransform={{
              height: 'auto',
              width: getScaledSize(12)
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(darkButtonCorner)
            }}
          />
          <UiEntity
            uiTransform={{
              width: getScaledButtonWidth(0),
              maxWidth: getScaledSize(300),
              height: getScaledSize(45),
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
            onMouseDown={() => {
              buttonClick(0)
            }}
          >
            <UiEntity
              uiTransform={{
                width: getScaledSize(25),
                height: getScaledSize(25),
                margin: { right: getScaledSize(5) },
                positionType: 'absolute'
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                  src: getTheme()
                },
                uvs: getImageAtlasMapping(secondaryButtonSection)
              }}
            />
            <UiEntity
              uiTransform={{
                width: 'auto',
                overflow: 'hidden',
                maxWidth: getScaledSize(217),
                padding: { right: 5 },
                margin: { left: getScaledSize(30) }
              }}
              uiText={{ value: getButtonText(0), fontSize: getScaledFontSize(16), textAlign: 'middle-left' }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              height: 'auto',
              width: getScaledSize(12),
              margin: { right: '5%' },
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(darkButtonEdge)
            }}
          />
        </UiEntity>

        {/* Button2 (Top-Right) */}
        <UiEntity>
          <UiEntity
            uiTransform={{
              height: 'auto',
              width: getScaledSize(12)
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(redButtonCorner)
            }}
          />
          <UiEntity
            uiTransform={{
              width: getScaledButtonWidth(1),
              maxWidth: getScaledSize(300),
              height: getScaledSize(45),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              alignContent: 'flex-start',
              display: displayButton(2) ? 'flex' : 'none',
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(redButtonSection)
            }}
            onMouseDown={() => {
              buttonClick(1)
            }}
          >
            <UiEntity
              uiTransform={{
                width: getScaledSize(25),
                height: getScaledSize(25),
                margin: { right: getScaledSize(5) },
                positionType: 'absolute',
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                  src: getTheme()
                },
                uvs: getImageAtlasMapping(primaryButtonSection)
              }}
            />
            <UiEntity
              uiTransform={{
                width: 'auto',
                maxWidth: getScaledSize(217),
                overflow: 'hidden',
                padding: { right: 5 },
                margin: { left: getScaledSize(30) }
              }}
              uiText={{ value: getButtonText(1), fontSize: getScaledFontSize(16), textAlign: 'middle-left' }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              height: 'auto',
              width: getScaledSize(12)
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(redButtonEdge)
            }}
          />
        </UiEntity>
      </UiEntity>

      {/* Second row of buttons */}
      <UiEntity
        uiTransform={{
          width: getScaledButtonWidth(450),
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          margin: { top: getScaledSize(20) },
          display: displaySecondButtonContainer() ? 'flex' : 'none',
        }}
      >
        {/* Button3 */}
        <UiEntity>
          <UiEntity
            uiTransform={{
              height: 'auto',
              width: getScaledSize(12),
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(darkButtonCorner)
            }}
          />
          <UiEntity
            uiTransform={{
              width: getScaledButtonWidth(2),
              maxWidth: getScaledSize(300),
              overflow: 'hidden',
              height: getScaledSize(45),
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
            onMouseDown={() => {
              buttonClick(3)
            }}
          >
            <UiEntity
              uiTransform={{
                width: 'auto',
                maxWidth: getScaledSize(252),
                overflow: 'hidden',
              }}
              uiText={{ value: getButtonText(2), fontSize: getScaledFontSize(16), textAlign: 'middle-left' }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              height: 'auto',
              width: getScaledSize(12),
              margin: { right: '5%' },
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(darkButtonEdge)
            }}
          />
        </UiEntity>

        {/* Button4 */}
        <UiEntity>
          <UiEntity
            uiTransform={{
              height: 'auto',
              width: getScaledSize(12),
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(darkButtonCorner)
            }}
          />
          <UiEntity
            uiTransform={{
              width: getScaledButtonWidth(3),
              maxWidth: getScaledSize(300),
              overflow: 'hidden',
              height: getScaledSize(45),
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'flex-start',
              display: displayButton(4) ? 'flex' : 'none',
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(darkButtonSection)
            }}
            onMouseDown={() => {
              buttonClick(4)
            }}
          >
            <UiEntity
              uiTransform={{
                width: 'auto',
                maxWidth: getScaledSize(252),
                overflow: 'hidden',
              }}
              uiText={{ value: getButtonText(3), fontSize: getScaledFontSize(16), textAlign: 'middle-left' }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              height: 'auto',
              width: getScaledSize(12),
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme()
              },
              uvs: getImageAtlasMapping(darkButtonEdge)
            }}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}
