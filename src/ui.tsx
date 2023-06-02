import { Color4 } from "@dcl/sdk/math";
import ReactEcs, {
  Button,
  Label,
  ReactEcsRenderer,
  UiEntity,
} from "@dcl/sdk/react-ecs";
import { Entity } from "@dcl/sdk/ecs";
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
} from "./dialog";
import { sourcesComponentsCoordinates } from "./uiResources";
import { activeNPC } from "./npc";

export let lightTheme = "https://decentraland.org/images/ui/light-atlas-v3.png";
export let darkTheme = "https://decentraland.org/images/ui/dark-atlas-v3.png";

export let bubblesTexture =
  "https://decentraland.org/images/ui/dialog-bubbles.png";

export let section = {
  ...sourcesComponentsCoordinates.backgrounds.NPCDialog,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth,
};

export let skipButtonSection = {
	...sourcesComponentsCoordinates.buttons.F,
	atlasHeight: sourcesComponentsCoordinates.atlasHeight,
	atlasWidth: sourcesComponentsCoordinates.atlasWidth,
  };

export let skipButtonSectionBlack = {
	...sourcesComponentsCoordinates.buttons.FBlack,
	atlasHeight: sourcesComponentsCoordinates.atlasHeight,
	atlasWidth: sourcesComponentsCoordinates.atlasWidth,
  };

export let leftClickSection = {
	...sourcesComponentsCoordinates.icons.ClickWhite,
	atlasHeight: sourcesComponentsCoordinates.atlasHeight,
	atlasWidth: sourcesComponentsCoordinates.atlasWidth,
  };

export let leftClickSectionbBlack = {
	...sourcesComponentsCoordinates.icons.ClickDark,
	atlasHeight: sourcesComponentsCoordinates.atlasHeight,
	atlasWidth: sourcesComponentsCoordinates.atlasWidth,
  };

export let primaryButtonSection = {
  ...sourcesComponentsCoordinates.buttons.E,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth,
  };

export let secondaryButtonSection = {
  ...sourcesComponentsCoordinates.buttons.F,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth,
  };

export let darkButtonSection = {
  ...sourcesComponentsCoordinates.buttons.dark,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth,
  };

export let redButtonSection = {
  ...sourcesComponentsCoordinates.buttons.red,
  atlasHeight: sourcesComponentsCoordinates.atlasHeight,
  atlasWidth: sourcesComponentsCoordinates.atlasWidth,
  };

export const NpcUtilsUi = () => {
  const width = realWidth(700);
  const height = realHeight(225);

return(
  <UiEntity
  uiTransform={{
    display: displayDialog() ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    positionType: 'absolute',
    position: { bottom: '15%', left: '50%' },
    margin: { top: -height / 2, left: -width / 2 },
    width,
    height,
  }}
>
  <UiEntity
    uiTransform={{
      positionType: 'absolute',
      position: { top: 0, left: 0 },
      width: '100%',
      height: '100%',
    }}
    uiBackground={{
      textureMode: 'stretch',
      texture: {
        src: getTheme(),
      },
      uvs: getImageAtlasMapping(section),
    }}
    onMouseDown={() => {
          handleDialogClick();
    }}
  />

      <UiEntity
          uiTransform={{
            display: displayPortrait() ? 'flex' : 'none',
            width: portraitWidth(),
            height: portraitHeight(),
            positionType: "absolute",
            position: { bottom: positionPortaitY(), left:positionPortaitX() },
          }}
          uiBackground={{
            textureMode: "stretch",
			texture: {
				src: getPortrait(),
			  },
			  // uvs: getImageAtlasMapping(skipButtonSection),
          }}
        />

      <UiEntity
          uiTransform={{
            display: displayImage() ? 'flex' : 'none',
            width: imageWidth(),
            height: imageHeight(),
            positionType: "absolute",
            position: { bottom: positionImageY(), right:positionImageX() },
          }}
          uiBackground={{
            textureMode: "stretch",
			texture: {
				src: getImage(),
			  },
			  // uvs: getImageAtlasMapping(skipButtonSection),
          }}
        />

      <UiEntity
          uiTransform={{
            display: displaySkipable() ? 'flex' : 'none',
            width: 15,
            height: 15,
            positionType: "absolute",
            position: { bottom: '7%', left:'25%' },
          }}
          uiBackground={{
            textureMode: "stretch",
			  texture: {
          src: getTheme(),
          },
          uvs: getImageAtlasMapping(getSkipableTheme()),
          }}
          onMouseDown={() => {
              skipDialogs(activeNPC as Entity);
          }}
          >

          <UiEntity
          uiTransform={{
            display: 'flex',
            positionType: "absolute",
            position: { left: '215%'},
          }}
          uiText={{
            value: 'Skip',
            color: getTextColor(),
            fontSize: 12,
          }}
        />
        </UiEntity>

   	<UiEntity
          uiTransform={{
            display:'flex',
            width: 24,
            height: 36,
            positionType: "absolute",
            position: { bottom: '5%', right:'2%' },
          }}
          uiBackground={{
            textureMode: "stretch",
			texture: {
				src: getTheme(),
			  },
			  uvs: getImageAtlasMapping(getLeftClickTheme()),
          }}
        />

        <UiEntity
          uiTransform={{
            alignSelf:"flex-start",
            alignItems: "flex-start",
            justifyContent:'flex-start',
            flexDirection: "row",
            position: getTextPosition(),
          }}
          uiText={{
            value: getText(),
            color: getTextColor(),
            fontSize: getFontSize(),
            textAlign:'middle-left'
          }}
        ></UiEntity>

        <UiEntity
          uiTransform={{
            width: "300px",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            display: displayFirstButtonContainer() ? "flex" : "none",
            position:{top: '20%'}
          }}
        >
          {/* Button1 */}
          <UiEntity
            uiTransform={{
              width: "150px",
              height: "45px",
              margin:{right:'5%'},
              alignItems: "center",
              justifyContent: "center",
              alignContent: "flex-start",
              display: displayButton(1) ? "flex" : "none",
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme(),
              },
              uvs: getImageAtlasMapping(darkButtonSection),
            }}
            uiText={{ value: getButtonText(0), fontSize: 16 }}
            onMouseDown={() => {
              buttonClick(0);
            }}
          ></UiEntity>

          {/* Button2 */}
          <UiEntity
            uiTransform={{
              width: "150px",
              height: "45px",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "flex-start",
              display: displayButton(2) ? "flex" : "none",
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme(),
              },
              uvs: getImageAtlasMapping(redButtonSection),
            }}
            uiText={{ value: getButtonText(1), fontSize: 16 }}
            onMouseDown={() => {
              buttonClick(1);
            }}
          ></UiEntity>
        </UiEntity>

        {/* Second row of buttons */}
        <UiEntity
          uiTransform={{
            width: "300px",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: { top: 20 },
            display: displaySecondButtonContainer() ? "flex" : "none",
            position:{top: '15%'}

          }}
        >
          {/* Button3 */}
          <UiEntity
            uiTransform={{
              width: "150px",
              height: "45px",
              margin:{right:'5%'},
              alignItems: "center",
              justifyContent: "center",
              alignContent: "flex-start",
              display: displayButton(3) ? "flex" : "none",
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme(),
              },
              uvs: getImageAtlasMapping(darkButtonSection),
            }}
            uiText={{ value: getButtonText(2), fontSize: 16 }}
            onMouseDown={() => {
              buttonClick(3);
            }}
          ></UiEntity>

          {/* Button4 */}
          <UiEntity
            uiTransform={{
              width: "150px",
              height: "45px",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "flex-start",
              display: displayButton(4) ? "flex" : "none",
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: {
                src: getTheme(),
              },
              uvs: getImageAtlasMapping(darkButtonSection),
            }}
            uiText={{ value: getButtonText(3), fontSize: 16 }}
            onMouseDown={() => {
              buttonClick(4);
            }}
          ></UiEntity>
        </UiEntity>
      </UiEntity>
  
)
};
