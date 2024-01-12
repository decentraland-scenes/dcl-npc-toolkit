import { Schemas, Transform, engine } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"


let faceUserAdded: boolean = false

export function addFaceUserSystem() {
  faceUserAdded = true

  engine.addSystem(faceUserSystem)
}

export const TrackUserFlag = engine.defineComponent(
	"npcutils::trackUserFlag",
	{
		lockXZRotation: Schemas.Boolean,
		active: Schemas.Boolean,
    rotSpeed: Schemas.Number
	})

export function faceUserSystem(dt: number) {
  for (const [entity, track] of engine.getEntitiesWith(TrackUserFlag)) {
    if (track.active) {
      const player = Transform.get(engine.PlayerEntity)
      let lookAtTarget = Vector3.create(player.position.x, player.position.y, player.position.z)
      let direction = Vector3.subtract(lookAtTarget, Transform.get(entity).position)

      let transform = Transform.getMutable(entity)
      transform.rotation = Quaternion.slerp(player.rotation, Quaternion.lookRotation(direction), dt * track.rotSpeed)

      if (track.lockXZRotation) {
        transform.rotation.x = 0
        transform.rotation.z = 0
      }
    }
  }
}
