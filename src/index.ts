import {
    activate,
    stopWalking,
    followPath,
    create,
    handleWalkAway,
    playAnimation,
    showDebug,
    getData,
    changeIdleAnim,
    talkBubble,
    createDialogWindow,
    openDialogWindow,
    closeDialogWindow
} from "./npc";
import { talk } from "./dialog";
import { Dialog, NPCPathType, NPCType } from "./types";
import { NpcUtilsUi } from './ui'

import { closeBubble, closeBubbleEndAll } from "./bubble";

export {
    activate,
    stopWalking,
    followPath,
    create,
    handleWalkAway,
    playAnimation,
    showDebug,
    talk,
    Dialog,
    getData,
    NPCPathType,
    NPCType,
    changeIdleAnim,
    talkBubble,
    closeBubble,
    closeBubbleEndAll,
    createDialogWindow,
    openDialogWindow,
    closeDialogWindow,
    NpcUtilsUi
}

export const debugLabel: string = 'NPC-Toolkit'