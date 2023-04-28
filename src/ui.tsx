


import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Entity } from '@dcl/sdk/ecs'
import { buttonClick, confirmText, displayButton, displayDialog, displayFirstButtonContainer, displaySecondButtonContainer, getButtonText, getFontSize, getText, getTextPosition, handleDialogClick } from './dialog'

export let lightTheme = ('https://decentraland.org/images/ui/light-atlas-v3.png')
export let darkTheme = ('https://decentraland.org/images/ui/dark-atlas-v3.png')

export let bubblesTexture = ('https://decentraland.org/images/ui/dialog-bubbles.png')

export let dialogs:Map<Entity, any> = new Map()

export function createDialog(npc:Entity){//
	// console.log('creating dialog for npc', npc)
	// dialogs.set(npc,
	ReactEcsRenderer.setUiRenderer(() => (
		<UiEntity
		uiTransform={{
		  width: '100%',
		  height: '300px',
		  display: displayDialog() ? 'flex' :'none',
		  justifyContent: 'center',
		  flexDirection:'row',
		  alignItems:'flex-end',
		  alignSelf:'auto',
		  positionType:'absolute',
		  position:{top:'50%'}
		}}
	  >
		<UiEntity
		  uiTransform={{
			width: '700px',
			height: '225px',
			alignItems: 'center',
			justifyContent:'center',
			alignContent:'flex-start',
			flexDirection:'column'
		  }}
		  uiBackground={{ color: Color4.White() }}
		  onMouseDown={() => { handleDialogClick() } }
		  >
		<UiEntity
				uiTransform={{
					width: '100px',
					height: '50px',
					alignItems: 'center',
				}}
				uiText={{value: getText(),color:Color4.Black(), fontSize: getFontSize()}}
				>
			</UiEntity>

		<UiEntity
		  uiTransform={{
			width: '300px',
			alignItems: 'center',
			flexDirection:'row',
			justifyContent:'space-between',
			display: displayFirstButtonContainer() ? 'flex' :'none',
		  }}
		  >
		
		{/* Button1 */}
		<UiEntity
		  uiTransform={{
			width: '125px',
			height: '50px',
			alignItems: 'center',
			justifyContent:'center',
			alignContent:'flex-start',
			display: displayButton(1) ? 'flex' :'none',
		  }}
		  uiBackground={{ color: Color4.Red() }}
		  uiText={{value: getButtonText(0), fontSize: 16}}
		  onMouseDown={() => { buttonClick(0) } }
		  >
		  </UiEntity>


			{/* Button2 */}
		<UiEntity
		  uiTransform={{
			width: '125px',
			height: '50px',
			alignItems: 'center',
			justifyContent:'center',
			alignContent:'flex-start',
			display: displayButton(2) ? 'flex' :'none',
		  }}
		  uiBackground={{ color: Color4.Red() }}
		  uiText={{value: getButtonText(1), fontSize: 16}}
		  onMouseDown={() => { buttonClick(1) } }
		  ></UiEntity>

		 </UiEntity>


		 <UiEntity
		  uiTransform={{
			width: '125px',
			alignItems: 'center',
			flexDirection:'row',
			justifyContent:'space-between',
			margin:{top:20},
			display: displaySecondButtonContainer() ? 'flex' :'none',
		  }}
		  >
		
		{/* Button3 */}
		<UiEntity
		  uiTransform={{
			width: '125px',
			height: '50px',
			alignItems: 'center',
			justifyContent:'center',
			alignContent:'flex-start',
			display: displayButton(3) ? 'flex' :'none',
		  }}
		  uiBackground={{ color: Color4.Red() }}
		  uiText={{value: getButtonText(2), fontSize: 16}}
		  onMouseDown={() => { buttonClick(3) } }
		  >
		  </UiEntity>


			{/* Button4 */}
		<UiEntity
		  uiTransform={{
			width: '125px',
			height: '50px',
			alignItems: 'center',
			justifyContent:'center',
			alignContent:'flex-start',
			display: displayButton(4) ? 'flex' :'none',
		  }}
		  uiBackground={{ color: Color4.Red() }}
		  uiText={{value: getButtonText(3), fontSize: 16}}
		  onMouseDown={() => { buttonClick(4) } }
		  ></UiEntity>

		 </UiEntity>
		 

		 </UiEntity>



	  </UiEntity>
	))
}
