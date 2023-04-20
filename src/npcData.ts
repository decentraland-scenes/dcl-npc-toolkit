import { Schemas, engine } from "@dcl/sdk/ecs";
export const NPCDataComponent = engine.defineComponent(
	"npcdatacomponent",
	{
		introduced: Schemas.Boolean,
		inCooldown: Schemas.Boolean,
        coolDownDuration: Schemas.Number,
        faceUser: Schemas.Boolean,
        walkingSpeed: Schemas.Number,
        bubbleHeight: Schemas.Number,
        state: Schemas.String,
        walkingAnim: Schemas.String,
        idleAnim: Schemas.String,
        lastPlayedAnim: Schemas.String,
        path:Schemas.Array(Schemas.Vector3)
	})