import { vec2 } from 'gl-matrix';
import {
  Box,
  Capsule,
  Circle,
  Ellipse,
  Mesh,
  MeshShape,
  Polygon,
  Shape,
} from 'rb-phys2d';

export enum ShapeType {
  Circle = 'Circle',
  Ellipse = 'Ellipse',
  Box = 'Box',
  Capsule = 'Capsule',
  Polygon = 'Polygon',
  Mesh = 'Mesh',
}

export interface ShapeDef {
  readonly type: keyof typeof ShapeType;
}

export class CircleShapeDef implements ShapeDef {
  readonly type = ShapeType.Circle;

  constructor(readonly radius: number) {}
}

export const isCircle = (shapeDef: ShapeDef): shapeDef is CircleShapeDef =>
  shapeDef.type === ShapeType.Circle;

export class EllipseShapeDef implements ShapeDef {
  readonly type = ShapeType.Ellipse;

  constructor(
    readonly a: number,
    readonly b: number,
    readonly subdivisions: number
  ) {}
}

export const isEllipse = (shapeDef: ShapeDef): shapeDef is EllipseShapeDef =>
  shapeDef.type === ShapeType.Ellipse;

export class BoxShapeDef implements ShapeDef {
  readonly type = ShapeType.Box;

  constructor(readonly width: number, readonly height: number) {}
}

export const isBox = (shapeDef: ShapeDef): shapeDef is BoxShapeDef =>
  shapeDef.type === ShapeType.Box;

export class CapsuleShapeDef implements ShapeDef {
  readonly type = ShapeType.Capsule;

  constructor(
    readonly radius: number,
    readonly height: number,
    readonly subdivisions: number
  ) {}
}

export const isCapsule = (shapeDef: ShapeDef): shapeDef is CapsuleShapeDef =>
  shapeDef.type === ShapeType.Capsule;

export class PolygonShapeDef implements ShapeDef {
  readonly type = ShapeType.Polygon;

  constructor(
    readonly points: Readonly<vec2[]>,
    readonly transformOrigin: boolean
  ) {}
}

export const isPolygon = (shapeDef: ShapeDef): shapeDef is PolygonShapeDef =>
  shapeDef.type === ShapeType.Polygon;

export class MeshShapeDef implements ShapeDef {
  readonly type = ShapeType.Mesh;

  constructor(
    readonly mesh: Readonly<Mesh>,
    readonly transformOrigin: boolean
  ) {}
}

export const isMesh = (shapeDef: ShapeDef): shapeDef is MeshShapeDef =>
  shapeDef.type === ShapeType.Mesh;

export const createShapeDef = (shape: Shape): ShapeDef => {
  if (shape instanceof Circle) {
    return new CircleShapeDef(shape.radius);
  } else if (shape instanceof Ellipse) {
    return new EllipseShapeDef(shape.a, shape.b, shape.subdivisions);
  } else if (shape instanceof Capsule) {
    return new CapsuleShapeDef(shape.r, shape.height, shape.subdivisions);
  } else if (shape instanceof Box) {
    return new BoxShapeDef(shape.width, shape.height);
  } else if (shape instanceof Polygon) {
    return new PolygonShapeDef(shape.points, shape.transformOrigin);
  } else if (shape instanceof MeshShape) {
    return new MeshShapeDef(shape.mesh, shape.transformOrigin);
  } else {
    throw new Error('Unknown shape');
  }
};

export const createShape = (shapeDef: ShapeDef): Shape => {
  if (isCircle(shapeDef)) {
    return new Circle(shapeDef.radius);
  } else if (isEllipse(shapeDef)) {
    return new Ellipse(shapeDef.a, shapeDef.b, shapeDef.subdivisions);
  } else if (isCapsule(shapeDef)) {
    return new Capsule(shapeDef.radius, shapeDef.height, shapeDef.subdivisions);
  } else if (isBox(shapeDef)) {
    return new Box(shapeDef.width, shapeDef.height);
  } else if (isPolygon(shapeDef)) {
    return new Polygon(shapeDef.points, shapeDef.transformOrigin);
  } else if (isMesh(shapeDef)) {
    return new MeshShape(shapeDef.mesh, shapeDef.transformOrigin);
  }
};
