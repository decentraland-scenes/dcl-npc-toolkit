import { engine, MeshRenderer, TriggerArea, Material } from "@dcl/sdk/ecs"
import { Color3, Color4 } from "@dcl/sdk/math";

let __delayedId = 0;

export type DelayedHandle = {
  id: string
  cancel: () => void
}

export const delayedFunction = (cb: () => void, delayMs: number): DelayedHandle => {
    const id = `delayedFunction_${++__delayedId}`
    let timeMs = 0;
    let cancelled = false;

    const system = (dt: number) => {
      if (cancelled) {
        engine.removeSystem(id)
        return
      }
      timeMs += dt * 1000;
      if (timeMs < delayMs) return;
      timeMs = 0;
      engine.removeSystem(id);
      if (!cancelled) {
        cb && cb();
      }
    }

    engine.addSystem(system, undefined, id);

    const cancel = () => {
      cancelled = true
      engine.removeSystem(id)
    }

    return { id, cancel }
}

export function clearDelayedFunction(handleOrId: DelayedHandle | string | undefined | null) {
  if (!handleOrId) return
  if (typeof handleOrId === 'string') {
    // Best-effort cancel by id/name
    engine.removeSystem(handleOrId)
    return
  }
  handleOrId.cancel()
}



  export function debugTriggers(){

    for (const [entity] of engine.getEntitiesWith(TriggerArea)) {
      MeshRenderer.setSphere(entity)
      Material.setPbrMaterial(entity, {
        albedoColor: Color4.create(1, 0, 0, 0.3)
      })
    }



  }