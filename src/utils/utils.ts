import { engine, MeshRenderer, TriggerArea, Material } from "@dcl/sdk/ecs"
import { Color3, Color4 } from "@dcl/sdk/math";

export const delayedFunction = (cb: () => void, delaySeconds: number) => {
    let time = 0;
  
    engine.addSystem((dt: number) => {
      time += dt;
      if (time < delaySeconds) return;
      time = 0;
      cb && cb();
      engine.removeSystem("delayedFunction");
  
    }, undefined, 'delayedFunction');
  
  }



  export function debugTriggers(){

    for (const [entity] of engine.getEntitiesWith(TriggerArea)) {
      MeshRenderer.setSphere(entity)
      Material.setPbrMaterial(entity, {
        albedoColor: Color4.create(1, 0, 0, 0.3)
      })
    }



  }