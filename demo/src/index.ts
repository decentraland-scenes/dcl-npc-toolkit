import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { InputAction, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import * as npc from '../../src/index'
// export all the functions required to make the scene work
export * from '@dcl/sdk'

// let path = [
//   Vector3.create(5, 0, 5),
//   Vector3.create(5, 0, 11),
//   Vector3.create(11, 0, 11),
//   Vector3.create(11, 0, 5)
// ]

// export let myNPC = npc.create({position:  Vector3.create(1,1,8)},
// //NPC Data Object
// { 
// 	type: npc.NPCType.CUSTOM,
//   model: "models/alice.glb",
// 	onActivate:()=>{
//     console.log('npc activated');
//     npc.talk(myNPC, ILoveCats)
//     npc.playAnimation(myNPC, `Hello`, true, 1.20)
//   },
//   onWalkAway:()=>{console.log('test on walk away function')},
//   idleAnim:"idle1",
//   faceUser: true
// }
// )
// npc.showDebug(true)

// // let testpcs = npc.create({position: Vector3.create(12,0,8), rotation:Quaternion.Zero(), scale: Vector3.create(1,1,1)}, {
// // 	type: npc.NPCType.CUSTOM,
// //   model: "models/humanoid.glb",
// //   faceUser: true,
// //   reactDistance: 3,
// //   idleAnim: "idle1",
// //   walkingAnim: "walk1",
// //   hoverText: "Activate",
// //   onActivate:()=>{
// //     console.log("test onctivate function")
// //     npc.talk(
// //       testpcs, 
// //       [{text:"This is a label and this is a really long dialog and i want it to be multiple line sbut im not sure how to make that happen with this new ui system because there is not out of box wrapping unless i missed something, so i added a line break function", typeSpeed:0}, {text:'ok here we go', fontSize: 10, isEndOfDialog:true}]
// //       )
// //   },
// //   onWalkAway:()=>{console.log('test on walk away function')},
// //   // pathData:{
// //   //   path:path,
// //   //   loop:true,
// //   //   pathType: NPCPathType.RIGID_PATH,
// //   //   onFinishCallback:()=>{console.log('path is done')},
// //   //   onReachedPointCallback:()=>{console.log('ending oint')},
// //   //   totalDuration: 20
// //   // }//
// // })

// // let box = engine.addEntity()
// // Transform.create(box,{position:Vector3.create(10,1,3)})
// // MeshRenderer.setBox(box)
// // MeshCollider.setBox(box)
// // pointerEventsSystem.onPointerDown(
// //   box,
// //   function () {
// //     // npc.activate(testpcs)
// //     // npc.stopWalking(testpcs, 3)
// //     // npc.playAnimation(testpcs, 'deathSlow', false, 2)
// //     // npc.followPath(testpcs)
// //     // npc.followPath(testpcs,{
// //     //   path:path,
// //     //   loop:true,
// //     //   pathType: NPCPathType.RIGID_PATH,
// //     //   onFinishCallback:()=>{console.log('path is done')},
// //     //   onReachedPointCallback:()=>{console.log('ending oint')},
// //     //   totalDuration: 20
// //     // })
// //     console.log(npc.getData(testpcs))
// //     npc.changeIdleAnim(testpcs, 'idleFem', true)
// //     //npc.playAnimation()
// //   },
// //   {
// //     button: InputAction.IA_POINTER,
// //     hoverText: 'Start Path'
// //   }
// //)


// export let ILoveCats: npc.Dialog[] = [
// 	{
// 		text: `I really lo-ove cats`,
// 		isEndOfDialog: true
// 	}
// ]

export let bob = npc.create(
	{
		position: Vector3.create(9, 0, 8),
		rotation: Quaternion.fromEulerDegrees(0, 180, 0),
		scale: Vector3.create(1, 1, 1)
	},
	{
		type: npc.NPCType.CUSTOM,
		model: 'models/BobOctorossV46.glb',
		//idleAnim: 'TalkLoop',
		onActivate: () => {
			console.log('npc activated')
			npc.talk(bob, [{text: "hey there!", isEndOfDialog:true}])
			//npc.playAnimation(bob, `Hello`, true, 1.20)
			npc.changeIdleAnim(bob, 'TalkLoop')
      npc.playAnimation(bob, 'TalkIntro', true, 0.63)

			//.npc.talk(bob, ILoveCats, 0)
		},
		onWalkAway: () => { console.log('test on walk away function') 
	}
	}
)