import { create_custom_evt, get_event_listener_name } from "./utils"

export type Handlers<T> = {
    [Property in keyof T as Property extends `on${infer EventName}` ? Uncapitalize<EventName> : never]: T[Property]
}

type DispatcherOptions = {
  cancelable: boolean,
}

export type Dispatcher<T> = ReturnType<(typeof createEventDispatcher<T>)>

export function createEventDispatcher<Props>(props: Props) {
  return function<N extends keyof Handlers<Props> & string>(
    ...args: Handlers<Props>[N] extends (undefined | ((evt?: CustomEvent<infer D> | undefined) => any)) ?
      [
        eventName: N,
        payload?: D | undefined,
        dispatcherOptions?: DispatcherOptions,
      ]
    : Handlers<Props>[N] extends (undefined | ((evt: CustomEvent<infer D>) => any)) ?
      [
        eventName: N,
        payload: D,
        dispatcherOptions?: DispatcherOptions,
      ]
    :
      [
        eventName: N,
        payload?: any,
        dispatcherOptions?: DispatcherOptions,
      ]
  ): boolean {
    const [eventName, payload, dispatcherOptions] = args
    const propName = get_event_listener_name(eventName) as string & keyof Props
    const cb = props[propName]

    if (typeof cb !== 'function') return true

    const customEvt = create_custom_evt(eventName, payload, dispatcherOptions?.cancelable ?? false)
    cb(customEvt)

    return !customEvt.defaultPrevented
  }
}
