import { Entity, Transform } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'

/**
 * Remaps a value from one range of values to its equivalent, scaled in proportion to another range of values, using maximum and minimum.
 *
 * @param value - value input number
 * @param min1 - min1 Minimum value in the range of the input.
 * @param max1 - max1 Maximum value in the range of the input.
 * @param min2 - min2 Minimum value in the range of the output.
 * @param max2 - max2 Maximum value in the range of the output.
 * @returns The resulting remapped value between the new min and max
 * @public
 */
export function remap(
  value: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number
) {
  let range1 = max1 - min1
  let range2 = max2 - min2
  return ((value - min1) / range1) * range2 + min2
}

/**
 * Returns the position of an entity that is a child of other entities, relative to the scene instead of relative to the parent. Returns a Vector3.
 *
 * @param entity - Entity to calculate position
 * @returns The Entity's global position relative to the scene's origin
 * @public
 */
export function getWorldPosition(entity: Entity): Vector3 {
  let transform = Transform.getOrNull(entity)


  if (!transform) return Vector3.Zero()

  let parent = transform.parent

  if (!parent) {
    return transform.position
  } else {
    let parentRotation = Transform.get(parent).rotation
    return Vector3.add(getWorldPosition(parent), Vector3.rotate(transform.position, getWorldRotation(parent)))
  }
}

/**
 * Returns the position of an entity that is a child of other entities, relative to the scene instead of relative to the parent. Returns a Vector3.
 *
 * @param entity - Entity to calculate position
 * @returns The Entity's global rotation in reference to the scene's origin
 * @public
 */
export function getWorldRotation(entity: Entity): Quaternion {
  let transform = Transform.getOrNull(entity)

  if (!transform)
    return Quaternion.Identity()

  let parent = transform.parent

  if (!parent) {
    return transform.rotation
  } else {
    return Quaternion.multiply(transform.rotation, getWorldRotation(parent))
  }
}

/**
 * @public
 */
export enum InterpolationType {
  LINEAR = 'linear',

  EASEINQUAD = 'easeinquad',
  EASEOUTQUAD = 'easeoutquad',
  EASEQUAD = 'easequad',

  EASEINSINE = 'easeinsine',
  EASEOUTSINE = 'easeoutsine',
  EASESINE = 'easeinoutsine',

  EASEINEXPO = 'easeinexpo',
  EASEOUTEXPO = 'easeoutexpo',
  EASEEXPO = 'easeinoutexpo',

  EASEINELASTIC = 'easeinelastic',
  EASEOUTELASTIC = 'easeoutelastic',
  EASEELASTIC = 'easeinoutelastic',

  EASEINBOUNCE = 'easeinbounce',
  EASEOUTEBOUNCE = 'easeoutbounce',
  EASEBOUNCE = 'easeinoutbounce',
}

/**
 * @public
 */
export function interpolate(type: InterpolationType, t: number): number {
  switch (type) {
    case InterpolationType.LINEAR:
      return InterpolateLinear(t)
    case InterpolationType.EASEINQUAD:
      return InterpolateEaseInQuad(t)
    case InterpolationType.EASEOUTQUAD:
      return InterpolateEaseOutQuad(t)
    case InterpolationType.EASEQUAD:
      return InterpolateEaseQuad(t)
	  case InterpolationType.EASEINSINE:
		  return InterpolateEaseInSine(t)
    case InterpolationType.EASEOUTSINE:
      return InterpolateEaseOutSine(t)
    case InterpolationType.EASESINE:
      return InterpolateEaseInOutSine(t)
    case InterpolationType.EASEINEXPO:
      return InterpolateEaseInExpo(t)
    case InterpolationType.EASEOUTEXPO:
      return InterpolateEaseOutExpo(t)
    case InterpolationType.EASEEXPO:
      return InterpolateEaseInOutExpo(t)
    case InterpolationType.EASEINELASTIC:
      return InterpolateEaseInElastic(t)
    case InterpolationType.EASEOUTELASTIC:
      return InterpolateEaseOutElastic(t)
    case InterpolationType.EASEELASTIC:
      return InterpolateEaseInOutElastic(t)
    case InterpolationType.EASEINBOUNCE:
      return InterpolateEaseInBounce(t)
    case InterpolationType.EASEOUTEBOUNCE:
      return InterpolateEaseOutBounce(t)
    case InterpolationType.EASEBOUNCE:
      return InterpolateEaseInOutBounce(t)
    default:
      return InterpolateLinear(t)
  }
}

function InterpolateLinear(t: number): number {
  return t
}

function InterpolateEaseInQuad(t: number): number {
  return t * t
}

function InterpolateEaseOutQuad(t: number): number {
  return t * (2 - t)
}

function InterpolateEaseQuad(t: number): number {
  return (t * t) / (2.0 * (t * t - t) + 1.0)
}

function InterpolateEaseInSine(t: number): number {
	return 1 - Math.cos((t * Math.PI) / 2)
}

function InterpolateEaseOutSine(t: number): number {
	return Math.sin((t * Math.PI) / 2)
}

function InterpolateEaseInOutSine(t: number): number {
	return -(Math.cos(Math.PI * t) - 1) / 2
}

function InterpolateEaseInExpo(t: number): number {
	return t === 0 ? 0 : Math.pow(2, 10 * t - 10)
}

function InterpolateEaseOutExpo(t: number): number {
	return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function InterpolateEaseInOutExpo(t: number): number {
	return t === 0
			? 0
			: t === 1
			? 1
			: t < 0.5
			? Math.pow(2, 20 * t - 10) / 2
			: (2 - Math.pow(2, -20 * t + 10)) / 2
}


function InterpolateEaseInElastic(t: number): number {
	const c4 = (2 * Math.PI) / 3

	return t === 0
			? 0
			: t === 1
			? 1
			: -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4)
}

function InterpolateEaseOutElastic(t: number): number {
	const c5 = (2 * Math.PI) / 3

	return t === 0
			? 0
			: t === 1
			? 1
			: Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c5) + 1
}

function InterpolateEaseInOutElastic(t: number): number {
	const c6 = (2 * Math.PI) / 4.5

	return t === 0
			? 0
			: t === 1
			? 1
			: t < 0.5
			? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c6)) / 2
			: (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c6)) / 2 + 1
}

function InterpolateEaseInBounce(t: number): number {
	return 1 - bounce(1 - t)
}

function InterpolateEaseOutBounce(t: number): number {
	return bounce(t)
}

function InterpolateEaseInOutBounce(t: number): number {
	return t < 0.5 ? (1 - bounce(1 - 2 * t)) / 2 : (1 + bounce(2 * t - 1)) / 2
}

function bounce(x: number) {
	const n1 = 7.5625
	const d1 = 2.75

	if (x < 1 / d1) {
		return n1 * x * x
	} else if (x < 2 / d1) {
		return n1 * (x -= 1.5 / d1) * x + 0.75
	} else if (x < 2.5 / d1) {
		return n1 * (x -= 2.25 / d1) * x + 0.9375
	} else {
		return n1 * (x -= 2.625 / d1) * x + 0.984375
	}
}

export function createCatmullRomSpline(points: Vector3[], nbPoints: number, closed?: boolean): Vector3[] {
	const catmullRom = new Array<Vector3>();
	const step = 1.0 / nbPoints;
	let amount = 0.0;
	if (closed) {
		const pointsCount = points.length;
		for (let i = 0; i < pointsCount; i++) {
			amount = 0;
			for (let c = 0; c < nbPoints; c++) {
				catmullRom.push(
					Vector3.catmullRom(points[i % pointsCount], points[(i + 1) % pointsCount], points[(i + 2) % pointsCount], points[(i + 3) % pointsCount], amount)
				);
				amount += step;
			}
		}
		catmullRom.push(catmullRom[0]);
	} else {
		const totalPoints = new Array<Vector3>();
		totalPoints.push(Vector3.clone(points[0]));
		Array.prototype.push.apply(totalPoints, points);
		totalPoints.push(Vector3.clone(points[points.length - 1]));
		let i = 0;
		for (; i < totalPoints.length - 3; i++) {
			amount = 0;
			for (let c = 0; c < nbPoints; c++) {
				catmullRom.push(Vector3.catmullRom(totalPoints[i], totalPoints[i + 1], totalPoints[i + 2], totalPoints[i + 3], amount));
				amount += step;
			}
		}
		i--;
		catmullRom.push(Vector3.catmullRom(totalPoints[i], totalPoints[i + 1], totalPoints[i + 2], totalPoints[i + 3], amount));
	}
	return catmullRom;
}

export function areAABBIntersecting(aMin: Vector3, aMax: Vector3, bMin: Vector3, bMax: Vector3): boolean {
	return (
		aMin.x <= bMax.x &&
		aMax.x >= bMin.x &&
		aMin.y <= bMax.y &&
		aMax.y >= bMin.y &&
		aMin.z <= bMax.z &&
		aMax.z >= bMin.z
	)
}

export function areSpheresIntersecting(aPos: Vector3, aRadius: number, bPos: Vector3, bRadius: number): boolean {
  const sqDist = Vector3.distanceSquared(aPos, bPos)
  const radiusSum = aRadius + bRadius
  return sqDist < radiusSum * radiusSum
}

export function areAABBSphereIntersecting(boxMin: Vector3, boxMax: Vector3, spherePos: Vector3, sphereRadius: number): boolean {
  let dmin = 0

  if (spherePos.x < boxMin.x)
    dmin += (boxMin.x - spherePos.x) * (boxMin.x - spherePos.x)
  if (spherePos.x > boxMax.x)
    dmin += (spherePos.x - boxMax.x) * (spherePos.x - boxMax.x)
  if (spherePos.y < boxMin.y)
    dmin += (boxMin.y - spherePos.y) * (boxMin.y - spherePos.y)
  if (spherePos.y > boxMax.y)
    dmin += (spherePos.y - boxMax.y) * (spherePos.y - boxMax.y)
  if (spherePos.z < boxMin.z)
    dmin += (boxMin.z - spherePos.z) * (boxMin.z - spherePos.z)
  if (spherePos.z > boxMax.z)
    dmin += (spherePos.z - boxMax.z) * (spherePos.z - boxMax.z)

  return dmin < sphereRadius * sphereRadius
}
