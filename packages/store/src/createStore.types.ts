export type Subscriber<T> = (value: T) => unknown

export type Unsubscriber = () => void

export interface Subscribable<T extends object> {
  /**
   * A function that is used to add a subscriber to the store.
   * @param subscriber A subscriber callback.
   * @returns An unsubscribe function.
   */
  subscribe: (subscriber: Subscriber<T>) => Unsubscriber
}

export type Updater<T extends object> = (currentState: T) => T

export interface Store<T extends object> extends Subscribable<T> {
  /**
   * A function that returns a copy of the current state.
   * 
   * Test
   * @returns A copy of the current state.
   */
  current: () => T,
  /**
   * A function that updates the current state.
   * @param updater A callback that gets passed the current state and returns the new one.
   */
  update: (updater: Updater<T>) => void,
}
