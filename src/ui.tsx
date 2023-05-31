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
  displayPortrait,
  displaySecondButtonContainer,
  getButtonText,
  getFontSize,
  getImageAtlasMapping,
  getPortrait,
  getText,
  getTextColor,
  getTextPosition,
  getTheme,
  handleDialogClick,
  portraitHeight,
  portraitWidth,
  positionPortaitX,
  positionPortaitY,
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
	...sourcesComponentsCoordinates.icons.ClickWhite,
	atlasHeight: sourcesComponentsCoordinates.atlasHeight,
	atlasWidth: sourcesComponentsCoordinates.atlasWidth,
  };

  export let buttonSection = {
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
			  uvs: getImageAtlasMapping(skipButtonSection),
          }}
		  onMouseDown={() => {
            skipDialogs(activeNPC as Entity);
          }}
        />

        <UiEntity
          uiTransform={{
            alignSelf:"flex-start",
            alignItems: "flex-start",
            justifyContent:'flex-start',
            flexDirection: "row",
            position: { left: '22%' },
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
            position:{top: '15%'}
          }}
        >
          {/* Button1 */}
          <UiEntity
            uiTransform={{
              width: "125px",
              height: "50px",
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
              uvs: getImageAtlasMapping(buttonSection),
            }}
            uiText={{ value: getButtonText(0), fontSize: 16 }}
            onMouseDown={() => {
              buttonClick(0);
            }}
          ></UiEntity>

          {/* Button2 */}
          <UiEntity
            uiTransform={{
              width: "125px",
              height: "50px",
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
              uvs: getImageAtlasMapping(buttonSection),
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
            width: "125px",
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
              width: "125px",
              height: "50px",
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
              uvs: getImageAtlasMapping(buttonSection),
            }}
            uiText={{ value: getButtonText(2), fontSize: 16 }}
            onMouseDown={() => {
              buttonClick(3);
            }}
          ></UiEntity>

          {/* Button4 */}
          <UiEntity
            uiTransform={{
              width: "125px",
              height: "50px",
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
              uvs: getImageAtlasMapping(buttonSection),
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
