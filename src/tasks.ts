import { vec2 } from 'gl-matrix';
import { BodyDef, Events, MaterialDef } from 'rb-phys2d';

import { IdentityInterface } from './identity';
import { Settings } from './settings';
import { ShapeDef } from './shape-def';
import { WorkerMessage, WorkerTask, WorkerTaskResult } from './task-queue';

export enum TaskName {
  CreateWorld = 'CreateWorld',
  CreateBody = 'CreateBody',
  DestroyBody = 'DestroyBody',
  AddDistanceJoint = 'AddDistanceJoint',
  AddPrismaticJoint = 'AddPrismaticJoint',
  AddRevoluteJoint = 'AddRevoluteJoint',
  AddWeldJoint = 'AddWeldJoint',
  AddWheelJoint = 'AddWheelJoint',
  AddSpring = 'AddSpring',
  AddMouseJoint = 'AddMouseJoint',
  AddMotor = 'AddMotor',
  RemoveJoint = 'RemoveJoint',
  AddCollider = 'AddCollider',
  RemoveCollider = 'RemoveCollider',
  UpdateTransform = 'UpdateTransform',
  Clear = 'Clear',
  Return = 'Return',
  On = 'On',
  Off = 'Off',
}

export class CreateWorldTask implements WorkerTask {
  readonly name = TaskName.CreateWorld;

  constructor(readonly settings: Readonly<Settings>) {}
}

export class CreateBodyTask implements WorkerTask {
  readonly name = TaskName.CreateBody;

  constructor(readonly bodyDef: Readonly<BodyDef>) {}
}

export class DestroyBodyTask implements WorkerTask {
  readonly name = TaskName.DestroyBody;

  constructor(readonly body: IdentityInterface) {}
}

export class AddDistanceJointTask implements WorkerTask {
  readonly name = TaskName.AddDistanceJoint;

  constructor(
    readonly bodyA: IdentityInterface,
    readonly pivotA: Readonly<vec2>,
    readonly bodyB: IdentityInterface,
    readonly pivotB: Readonly<vec2>,
    readonly distance: number
  ) {}
}

export class AddPrismaticJointTask implements WorkerTask {
  readonly name = TaskName.AddPrismaticJoint;

  constructor(
    readonly bodyA: IdentityInterface,
    readonly pivotA: Readonly<vec2>,
    readonly bodyB: IdentityInterface,
    readonly pivotB: Readonly<vec2>,
    readonly localAxis: Readonly<vec2>,
    readonly refAngle: number,
    readonly minDistance: number,
    readonly maxDistance: number
  ) {}
}

export class AddRevoluteJointTask implements WorkerTask {
  readonly name = TaskName.AddRevoluteJoint;

  constructor(
    readonly bodyA: IdentityInterface,
    readonly pivotA: Readonly<vec2>,
    readonly bodyB: IdentityInterface,
    readonly pivotB: Readonly<vec2>,
    readonly minAngle: number,
    readonly maxAngle: number,
    readonly stiffness: number,
    readonly damping: number
  ) {}
}

export class AddWeldJointTask implements WorkerTask {
  readonly name = TaskName.AddWeldJoint;

  constructor(
    readonly bodyA: IdentityInterface,
    readonly pivotA: Readonly<vec2>,
    readonly bodyB: IdentityInterface,
    readonly pivotB: Readonly<vec2>,
    readonly refAngle: number
  ) {}
}

export class AddWheelJointTask implements WorkerTask {
  readonly name = TaskName.AddWheelJoint;

  constructor(
    readonly bodyA: IdentityInterface,
    readonly pivotA: Readonly<vec2>,
    readonly bodyB: IdentityInterface,
    readonly pivotB: Readonly<vec2>,
    readonly localAxis: Readonly<vec2>,
    readonly minDistance: number,
    readonly maxDistance: number
  ) {}
}

export class AddSpringTask implements WorkerTask {
  readonly name = TaskName.AddSpring;

  constructor(
    readonly bodyA: IdentityInterface,
    readonly pivotA: Readonly<vec2>,
    readonly bodyB: IdentityInterface,
    readonly pivotB: Readonly<vec2>,
    readonly distance: number,
    readonly stiffness: number,
    readonly extinction: number
  ) {}
}

export class AddMouseJointTask implements WorkerTask {
  readonly name = TaskName.AddMouseJoint;

  constructor(
    readonly cursor: Readonly<vec2>,
    readonly body: IdentityInterface,
    readonly joint: Readonly<vec2>,
    readonly stiffness: number,
    readonly maxForce: number
  ) {}
}

export class AddMotorTask implements WorkerTask {
  readonly name = TaskName.AddMotor;

  constructor(
    readonly body: IdentityInterface,
    readonly speed: number,
    readonly torque: number
  ) {}
}

export class RemoveJointTask implements WorkerTask {
  readonly name = TaskName.RemoveJoint;

  constructor(readonly jointId: number) {}
}

export class AddColliderTask implements WorkerTask {
  readonly name = TaskName.AddCollider;

  constructor(
    readonly body: IdentityInterface,
    readonly shape: ShapeDef,
    readonly mask: number,
    readonly isVirtual: boolean,
    readonly material: MaterialDef
  ) {}
}

export class RemoveColliderTask implements WorkerTask {
  readonly name = TaskName.RemoveCollider;

  constructor(readonly collider: IdentityInterface) {}
}

export class ClearTask implements WorkerTask {
  readonly name = TaskName.Clear;
}

export class UpdateTransformTask implements WorkerTask {
  readonly name = TaskName.UpdateTransform;
}

export class ReturnTask implements WorkerTask {
  readonly name = TaskName.Return;

  readonly taskId = -1; // synthetic task id

  constructor(
    readonly bodiesBuffer: Float32Array,
    readonly eventsBuffer: Float32Array
  ) {}
}

export class OnTask implements WorkerTask {
  readonly name = TaskName.On;

  constructor(readonly event: keyof typeof Events) {}
}

export class OffTask implements WorkerTask {
  readonly name = TaskName.Off;

  constructor(readonly event: keyof typeof Events) {}
}

export class StepMessage implements WorkerMessage {
  readonly name = 'Step';

  constructor(
    readonly bodiesBuffer: Float32Array,
    readonly eventsBuffer: Float32Array,
    readonly frame: number,
    readonly time: number,
    readonly dt: number
  ) {}
}

export const ok = <T extends WorkerTask>(
  task: T,
  result: unknown = 'ok'
): WorkerTaskResult<T> => {
  return {
    name: `${task.name}Result`,
    timestamp: Date.now(),
    task,
    result,
  };
};

export const fail = <T extends WorkerTask>(
  task: T,
  error: unknown
): WorkerTaskResult<T> => {
  return {
    name: `${task.name}Result`,
    timestamp: Date.now(),
    task,
    error,
  };
};
