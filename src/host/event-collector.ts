import {
  WorldInterface,
  Events,
  BodyInterface,
  ColliderInterface,
} from 'rb-phys2d';

export interface EventCollectorInterface<T = unknown> extends Iterable<T> {
  readonly collecting: boolean;
  listen(world: WorldInterface): void;
  stop(): void;
  reset(): void;
}

export abstract class EventCollector<T> implements EventCollectorInterface<T> {
  protected readonly collection = new Set<T>();

  protected world: WorldInterface;

  constructor(readonly event: keyof typeof Events) {}

  get collecting(): boolean {
    return Boolean(this.world);
  }

  listen(world: WorldInterface): void {
    if (!this.world) {
      this.world = world;
      world.on(this.event, this.listener);
    }
  }

  stop(): void {
    this.world.off(this.event, this.listener);
    this.world = null;
  }

  reset(): void {
    this.collection.clear();
  }

  *[Symbol.iterator](): Iterator<T> {
    yield* this.collection;
  }

  protected readonly listener = (...args: unknown[]): void =>
    this.addToCollection(...args);

  protected abstract addToCollection(...args: unknown[]): void;
}

export class BodyEventCollector extends EventCollector<number> {
  protected addToCollection(body: BodyInterface): void {
    this.collection.add(body.id);
  }
}

export class CollisionEventCollector extends EventCollector<[number, number]> {
  protected addToCollection(
    collider0: ColliderInterface,
    collider1: ColliderInterface
  ): void {
    this.collection.add([collider0.body.id, collider1.body.id]);
  }
}
