import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Animator, AudioSource, AvatarAttach, GltfContainer, Material, MeshCollider, Transform, VideoPlayer, VisibilityComponent, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { initAssetPacks } from '@dcl/asset-packs/dist/scene-entrypoint'
import { talk } from './dialog'
import { NPCType } from './types';
import { create } from './npc';
import { setupUi } from './uiComp';

initAssetPacks(engine, pointerEventsSystem, {
    Animator,
    AudioSource,
    AvatarAttach,
    Transform,
    VisibilityComponent,
    GltfContainer,
    Material,
    VideoPlayer
})

export function main() {

    setupUi()

    let myNPC = create(
        { position: Vector3.create(8, 1, 8), rotation: Quaternion.Zero(), scale: Vector3.create(1, 1, 1) },
        {
            type: NPCType.CUSTOM,
            model: 'models/hi.glb',
            portrait: { path: 'images/hi.png', height: 220, width: 220 },
            onActivate: () => {
                talk(myNPC, [
                    {
                        text: `Quest Overview: In the mystical realm of Eldoria, a sinister force has swept through the winter lands, freezing the hearts of magical creatures and stealing the essence of Frostfire Crystals - the source of warmth and magic. As a valiant hero, you are called upon to embark on a quest to restore balance and save the fantastical festivities.`,
                        isQuestion: true,
                        buttons: [
                            { label: `Restore magic!`, goToDialog: 2, size: 'auto'},
                            { label: `Crystal theft`, goToDialog: 1, size: 'auto'},
                            { label: `Icy crisis`, goToDialog: 1, size: 100},
                            { label: `Heroes darkness.`, goToDialog: 1 },
                        ],
                    }
                ])
            }
        }
    )
    MeshCollider.setBox(myNPC)
}
