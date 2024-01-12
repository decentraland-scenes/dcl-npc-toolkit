import { Schemas, Transform, engine } from "@dcl/sdk/ecs"

export const IsFollowingPath = engine.defineComponent("npcutils::isFollowingPath", {})
export const IsTypingDialog = engine.defineComponent("npcutils::isTypingDialog", {})
export const IsTypingBubble = engine.defineComponent("npcutils::isTypingBubble", {})

export const TrackUserFlag = engine.defineComponent(
	"npcutils::trackUserFlag",
	{
		lockXZRotation: Schemas.Boolean,
		active: Schemas.Boolean,
        rotSpeed: Schemas.Number
	})


