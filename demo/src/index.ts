import * as npc from 'dcl-npc-toolkit'
import { MeshCollider } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { setupUi } from './uiComp'

export function main() {

    setupUi()

    let myNPC = npc.create(
        { position: Vector3.create(8, 1, 8), rotation: Quaternion.Zero(), scale: Vector3.create(1, 1, 1) },
        {
            type: npc.NPCType.CUSTOM,
            model: 'models/hi.glb',
            portrait: { path: 'images/hi.png', height: 220, width: 220 },
            onActivate: () => {
                npc.talk(myNPC, [
                    {
                        text: `Quest Overview: In the mystical realm of Eldoria, a sinister force has swept through the winter lands, freezing the hearts of magical creatures and stealing the essence of Frostfire Crystals - the source of warmth and magic. As a valiant hero, you are called upon to embark on a quest to restore balance and save the fantastical festivities. `,
                        windowHeight: 'auto',
                        isQuestion: true,
                        buttons: [
                            { label: `Restore magic!`, goToDialog: 0, size: 'auto'},
                            { label: `Crystal theft`, goToDialog: 0, size: 'auto'},
                            { label: `Icy crisis`, goToDialog: 0, size: 100},
                            { label: `Heroes darkness.`, goToDialog: 0 },
                        ],
                    }
                ])
            }
        }
    )
    MeshCollider.setBox(myNPC)
}
