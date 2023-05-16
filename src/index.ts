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
    talkBubble
 } from "./npc";
import { talk } from "./dialog";
import { Dialog, NPCPathType, NPCType } from "./types";

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
    closeBubbleEndAll
}