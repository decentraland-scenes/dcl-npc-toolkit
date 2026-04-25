import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import {
  buttonClick,
  displayButton,
  displayDialog,
  displayFirstButtonContainer,
  displayImage,
  displayPortrait,
  displaySecondButtonContainer,
  displaySkipable,
  getButtonText,
  getFontSize,
  getButtonFontSize,
  getImage,
  getImageAtlasMapping,
  getLeftClickTheme,
  getPortrait,
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

// Legacy section exports preserved for backwards compatibility. The library no
// longer renders the UI from these atlas slices — backgrounds and buttons are
// now drawn with solid colors and borderRadius — but external code that
// imports them will still resolve.
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

// Color palette extracted from the original atlas textures.
export const COLOR_DIALOG_BG_LIGHT = Color4.create(1, 1, 1, 1)
export const COLOR_DIALOG_BG_DARK = Color4.create(0.243, 0.220, 0.286, 1)
export const COLOR_PRIMARY_BUTTON = Color4.create(0.953, 0.180, 0.357, 1)
export const COLOR_SECONDARY_BUTTON = Color4.create(0.243, 0.220, 0.286, 1)
export const COLOR_BUTTON_TEXT = Color4.White()

const COLOR_KEY_ICON_BG_LIGHT = Color4.White()
const COLOR_KEY_ICON_BORDER_LIGHT = Color4.create(0.78, 0.78, 0.80, 1)
const COLOR_KEY_ICON_TEXT_LIGHT = Color4.create(0.15, 0.15, 0.18, 1)

const COLOR_KEY_ICON_BG_DARK = Color4.create(0.243, 0.220, 0.286, 1)
const COLOR_KEY_ICON_BORDER_DARK = Color4.create(0.78, 0.78, 0.80, 1)
const COLOR_KEY_ICON_TEXT_DARK = Color4.White()

function isDarkTheme(): boolean {
  return getTheme() === darkTheme
}

function getDialogBgColor(): Color4 {
  return isDarkTheme() ? COLOR_DIALOG_BG_DARK : COLOR_DIALOG_BG_LIGHT
}

function getKeyIconBgColor(): Color4 {
  return isDarkTheme() ? COLOR_KEY_ICON_BG_DARK : COLOR_KEY_ICON_BG_LIGHT
}

function getKeyIconBorderColor(): Color4 {
  return isDarkTheme() ? COLOR_KEY_ICON_BORDER_DARK : COLOR_KEY_ICON_BORDER_LIGHT
}

function getKeyIconTextColor(): Color4 {
  return isDarkTheme() ? COLOR_KEY_ICON_TEXT_DARK : COLOR_KEY_ICON_TEXT_LIGHT
}

const HOVER_BRIGHTEN = 0.4

function brighten(color: Color4, amount: number = HOVER_BRIGHTEN): Color4 {
  return Color4.create(
    Math.min(1, color.r + amount),
    Math.min(1, color.g + amount),
    Math.min(1, color.b + amount),
    color.a
  )
}

let hoveredButton: number | null = null

function buttonColor(buttonIdx: number, base: Color4): Color4 {
  return hoveredButton === buttonIdx ? brighten(base) : base
}

const DIALOG_WIDTH = 700
const DIALOG_HEIGHT = 284
const BUTTON_HEIGHT = 45
const BUTTON_RADIUS = 12
const DIALOG_RADIUS = 20
const KEY_ICON_SIZE = 25
const KEY_ICON_RADIUS = 6
const SKIP_KEY_ICON_SIZE = 15

export const NpcUtilsUi = () => {

  const width = realWidth(DIALOG_WIDTH)
  const height = realHeight(DIALOG_HEIGHT)

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
        height: typeof (getWindowHeight()) === 'number' ? getWindowHeight() as number : 'auto',
        minHeight: 25
      }}
    >
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { top: 0, left: 0 },
          width: '100%',
          height: '100%',
          borderRadius: DIALOG_RADIUS
        }}
        uiBackground={{
          color: getDialogBgColor()
        }}
        onMouseDown={() => {
          handleDialogClick()
        }}
      />

      <UiEntity
        uiTransform={{
          display: displayPortrait() ? 'flex' : 'none',
          width: portraitWidth(),
          height: portraitHeight(),
          positionType: 'absolute',
          position: {
            bottom: positionPortaitY(),
            left: positionPortaitX()
          }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: getPortrait()
          }
        }}
      />

      <UiEntity
        uiTransform={{
          display: displayImage() ? 'flex' : 'none',
          width: imageWidth(),
          height: imageHeight(),
          positionType: 'absolute',
          position: { bottom: positionImageY(), right: positionImageX() }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: {
            src: getImage()
          }
        }}
      />

      <UiEntity
        uiTransform={{
          display: displaySkipable() ? 'flex' : 'none',
          width: SKIP_KEY_ICON_SIZE,
          height: SKIP_KEY_ICON_SIZE,
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { bottom: '7%', left: '25%' },
          borderRadius: 3,
          borderWidth: 1,
          borderColor: getKeyIconBorderColor()
        }}
        uiBackground={{
          color: getKeyIconBgColor()
        }}
        uiText={{
          value: 'F',
          color: getKeyIconTextColor(),
          fontSize: 10
        }}
        onMouseDown={() => {
          skipDialogs(activeNPC)
        }}
      >
        <UiEntity
          uiTransform={{
            display: 'flex',
            positionType: 'absolute',
            alignSelf: 'center',
            position: { left: '110%' }
          }}
          uiText={{
            value: 'Skip',
            color: getTextColor(),
            fontSize: 12
          }}
        />
      </UiEntity>

      <UiEntity
        uiTransform={{
          display: 'flex',
          width: 24,
          height: 36,
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
          fontSize: getFontSize(),
          textAlign: 'middle-left'
        }}
      />

      <UiEntity
        uiTransform={{
          width: 300,
          height: 50,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-around',
          display: displayFirstButtonContainer() ? 'flex' : 'none',
        }}
      >
        {/* Button1 (Top-Left) — secondary/dark with F key prompt */}
        <UiEntity
          uiTransform={{
            display: displayButton(1) ? 'flex' : 'none',
            width: 'auto',
            maxWidth: 300,
            height: BUTTON_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            margin: { right: '5%' },
            padding: { left: 8, right: 16 },
            borderRadius: BUTTON_RADIUS
          }}
          uiBackground={{
            color: buttonColor(0, COLOR_SECONDARY_BUTTON)
          }}
          onMouseDown={() => {
            buttonClick(0)
          }}
          onMouseEnter={() => { hoveredButton = 0 }}
          onMouseLeave={() => { if (hoveredButton === 0) hoveredButton = null }}
        >
          <UiEntity
            uiTransform={{
              width: KEY_ICON_SIZE,
              height: KEY_ICON_SIZE,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: KEY_ICON_RADIUS,
              borderWidth: 1,
              borderColor: getKeyIconBorderColor()
            }}
            uiBackground={{
              color: getKeyIconBgColor()
            }}
            uiText={{
              value: 'F',
              color: getKeyIconTextColor(),
              fontSize: 14
            }}
          />
          <UiEntity
            uiTransform={{
              width: 'auto',
              overflow: 'hidden',
              maxWidth: 217,
              padding: { left: 10, right: 5 }
            }}
            uiText={{
              value: getButtonText(0),
              color: COLOR_BUTTON_TEXT,
              fontSize: getButtonFontSize(0),
              textAlign: 'middle-left',
              textWrap: 'nowrap'
            }}
          />
        </UiEntity>

        {/* Button2 (Top-Right) — primary/red with E key prompt */}
        <UiEntity
          uiTransform={{
            display: displayButton(2) ? 'flex' : 'none',
            width: 'auto',
            maxWidth: 300,
            height: BUTTON_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: { left: 8, right: 16 },
            borderRadius: BUTTON_RADIUS
          }}
          uiBackground={{
            color: buttonColor(1, COLOR_PRIMARY_BUTTON)
          }}
          onMouseDown={() => {
            buttonClick(1)
          }}
          onMouseEnter={() => { hoveredButton = 1 }}
          onMouseLeave={() => { if (hoveredButton === 1) hoveredButton = null }}
        >
          <UiEntity
            uiTransform={{
              width: KEY_ICON_SIZE,
              height: KEY_ICON_SIZE,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: KEY_ICON_RADIUS,
              borderWidth: 1,
              borderColor: getKeyIconBorderColor()
            }}
            uiBackground={{
              color: getKeyIconBgColor()
            }}
            uiText={{
              value: 'E',
              color: getKeyIconTextColor(),
              fontSize: 14
            }}
          />
          <UiEntity
            uiTransform={{
              width: 'auto',
              maxWidth: 217,
              overflow: 'hidden',
              padding: { left: 10, right: 5 }
            }}
            uiText={{
              value: getButtonText(1),
              color: COLOR_BUTTON_TEXT,
              fontSize: getButtonFontSize(1),
              textAlign: 'middle-left',
              textWrap: 'nowrap'
            }}
          />
        </UiEntity>
      </UiEntity>

      {/* Second row of buttons */}
      <UiEntity
        uiTransform={{
          width: 300,
          height: 50,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-around',
          margin: { top: 20 },
          display: displaySecondButtonContainer() ? 'flex' : 'none',
        }}
      >
        {/* Button3 — secondary/dark, no key prompt */}
        <UiEntity
          uiTransform={{
            display: displayButton(3) ? 'flex' : 'none',
            width: 'auto',
            maxWidth: 300,
            overflow: 'hidden',
            height: BUTTON_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center',
            margin: { right: '5%' },
            padding: { left: 20, right: 20 },
            borderRadius: BUTTON_RADIUS
          }}
          uiBackground={{
            color: buttonColor(3, COLOR_SECONDARY_BUTTON)
          }}
          onMouseDown={() => {
            buttonClick(3)
          }}
          onMouseEnter={() => { hoveredButton = 3 }}
          onMouseLeave={() => { if (hoveredButton === 3) hoveredButton = null }}
        >
          <UiEntity
            uiTransform={{
              width: 'auto',
              maxWidth: 252,
              overflow: 'hidden',
            }}
            uiText={{
              value: getButtonText(2),
              color: COLOR_BUTTON_TEXT,
              fontSize: getButtonFontSize(2),
              textAlign: 'middle-center',
              textWrap: 'nowrap'
            }}
          />
        </UiEntity>

        {/* Button4 — secondary/dark, no key prompt */}
        <UiEntity
          uiTransform={{
            display: displayButton(4) ? 'flex' : 'none',
            width: 'auto',
            maxWidth: 300,
            overflow: 'hidden',
            height: BUTTON_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center',
            padding: { left: 20, right: 20 },
            borderRadius: BUTTON_RADIUS
          }}
          uiBackground={{
            color: buttonColor(4, COLOR_SECONDARY_BUTTON)
          }}
          onMouseDown={() => {
            buttonClick(4)
          }}
          onMouseEnter={() => { hoveredButton = 4 }}
          onMouseLeave={() => { if (hoveredButton === 4) hoveredButton = null }}
        >
          <UiEntity
            uiTransform={{
              width: 'auto',
              maxWidth: 252,
              overflow: 'hidden',
            }}
            uiText={{
              value: getButtonText(3),
              color: COLOR_BUTTON_TEXT,
              fontSize: getButtonFontSize(3),
              textAlign: 'middle-center',
              textWrap: 'nowrap'
            }}
          />
        </UiEntity>
      </UiEntity>
    </UiEntity>
  )
}
