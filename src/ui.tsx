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
  getTextPosition,
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

const cardWidth = "700px";

export const NpcUtilsUi = () => {
  const width = realWidth(600);
  const height = realHeight(225);

  return (
    <UiEntity
      uiTransform={{
        width: cardWidth,
        height: "300px",
        display: displayDialog() ? "flex" : "none",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "flex-end",
        alignContent: "flex-end",
        alignSelf: "auto",
        positionType: "absolute",
        position: { bottom: "15%", left: "40%" },
      }}
    >
      <UiEntity
        uiTransform={{
          width: cardWidth,
          height: "225px",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
        uiBackground={{
        //   color: Color4.White(),
          textureMode: "stretch",
          texture: {
            src: lightTheme,
          },
          uvs: getImageAtlasMapping(section),
        }}
        onMouseDown={() => {
          handleDialogClick();
        }}
      >
        <UiEntity
          uiTransform={{
            display: displayPortrait() ? "flex" : "none",
            width: portraitWidth(),
            height: portraitHeight(),
            positionType: "absolute",
            position: { top: positionPortaitY(), left: positionPortaitX() },
          }}
          uiBackground={{
            textureMode: "stretch",
            texture: {
              src: getPortrait(),
            },
          }}
          onMouseDown={() => {
            handleDialogClick();
          }}
        />

		<UiEntity
          uiTransform={{
            display: displayPortrait() ? "flex" : "none",
            width: 24,
            height: 36,
            positionType: "absolute",
            position: { bottom: '5%', right:'2%' },
          }}
          uiBackground={{
            textureMode: "stretch",
			texture: {
				src: lightTheme,
			  },
			  uvs: getImageAtlasMapping(skipButtonSection),
          }}
		  onMouseDown={() => {
            skipDialogs(activeNPC as Entity);
          }}
        />

        <UiEntity
          uiTransform={{
            width: "100px",
            height: "50px",
            alignItems: "center",
            flexDirection: "row",
            position: { left: displayPortrait() ? 55 : 0 },
          }}
          uiText={{
            value: getText(),
            color: Color4.Black(),
            fontSize: getFontSize(),
          }}
        ></UiEntity>

        <UiEntity
          uiTransform={{
            width: "300px",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            display: displayFirstButtonContainer() ? "flex" : "none",
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
            uiBackground={{ color: Color4.Red() }}
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
            uiBackground={{ color: Color4.Red() }}
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
            uiBackground={{ color: Color4.Red() }}
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
            uiBackground={{ color: Color4.Red() }}
            uiText={{ value: getButtonText(3), fontSize: 16 }}
            onMouseDown={() => {
              buttonClick(4);
            }}
          ></UiEntity>
        </UiEntity>
      </UiEntity>
    </UiEntity>
  );
};
