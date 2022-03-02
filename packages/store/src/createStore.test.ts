import createStore from './createStore'

describe('createStore', () => {
  it('Should have a subscribe function that accepts a subscriber callback and invokes the subscriber with the current state.', () => {
    const store = createStore(initialState)
    const subscriber = jest.fn()

    store.subscribe(subscriber)

    expect(subscriber).toHaveBeenCalledWith(initialState)
  })

  it('Should have a current function that returns the current state.', () => {
    const store = createStore(initialState)

    expect(store.current()).toEqual(initialState)
  })

  it('Should have an update function that accepts an updater callback as a parameter and invokes the updater with the current state.', () => {
    const store = createStore(initialState)
    const updater = jest.fn(
      () => ({ message: 'test' }),
    )

    store.update(updater)

    expect(updater).toHaveBeenCalledWith(initialState)
  })

  it('Should update the state with the object that an updater callback returns.', () => {
    const store = createStore(initialState)
    const updater = () => update1

    store.update(updater)

    expect(store.current()).toEqual(update1)
  })

  it('Should invoke any subscriber callbacks that where passed to the subscribe function when the state updates.', () => {
    const store = createStore(initialState)
    const subscriber1 = jest.fn()
    const subscriber2 = jest.fn()

    store.subscribe(subscriber1)
    store.subscribe(subscriber2)

    store.update(() => update1)

    expect(subscriber1).toHaveBeenLastCalledWith(update1)
    expect(subscriber2).toHaveBeenLastCalledWith(update1)
  })

  it('Should return an unsubscribe function when subscribe is invoked.', () => {
    const store = createStore(initialState)
    const subscriber1 = jest.fn()
    const subscriber2 = jest.fn()

    const unsubscriber = store.subscribe(subscriber1)
    store.subscribe(subscriber2)

    store.update(() => update1)

    expect(subscriber1).toHaveBeenLastCalledWith(update1)
    expect(subscriber2).toHaveBeenLastCalledWith(update1)

    unsubscriber()

    store.update(() => update2)

    expect(subscriber1).not.toHaveBeenLastCalledWith(update2)
    expect(subscriber2).toHaveBeenLastCalledWith(update2)
  })

  const initialState = { message: 'initial state' }
  const update1 = { message: 'new state' }
  const update2 = { message: 'newer state' }
})
