import { Store, Subscriber, Updater } from './createStore.types'

/**
 * A functions that creates a new store.
 * @param initialState The initial state of the store.
 * @returns The newly created store.
 */
const createStore = <T extends object>(initialState: T): Store<T> => {

  let state: T = initialState
  let subscribers: Subscriber<T>[] = []

  return {
    current: () => ({ ...state }),
    subscribe: (subscriber: Subscriber<T>) => {
      subscriber(initialState)
      subscribers.push(subscriber)

      return () => { subscribers = subscribers.filter(s => s !== subscriber) }
    },
    update: (updater: Updater<T>) => {
      const newState = updater({ ...state })

      state = newState
      subscribers.forEach(s => s(newState))
    },
  }
}

export default createStore
