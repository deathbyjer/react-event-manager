import React from "react"

class EventManager {

  /*
   * Event Conditions
   ********************/ 
  addEventCondition(event_type, event_condition) {
    if (typeof event_condition != "function")
      return

    this.__getEvents(event_type).conditions.push(event_condition)
  }

  removeEventCondition(event_type, event_condition) {
    const index = this.__getEvents(event_type).conditions.indexOf(event_condition)

    if (index >= 0)
      this.__getEvents(event_type).conditions.splice(index, 1)
  }

  /*
   * Event Listeners
   **********************/
  addEventListener(event_type, event_listener) {
    if (typeof event_listener != "function")
      return

    this.__getEvents(event_type).listeners.push(event_listener)
  }

  removeEventListener(event_type, event_listener) {
    const index = this.__getEvents(event_type).listeners.indexOf(event_listener)

    if (index >= 0)
      this.__getEvents(event_type).listeners.splice(index, 1)
  }

  /*  
   * Call the event listener
   ***************************/

  applyEventListeners(event_type, event_data) {
    for (let event_condition of this.__getEvents(event_type).conditions)
      if (!event_condition(event_data))
        return

    for (let event_listener of this.__getEvents(event_type).listeners)
      event_listener(event_data)
  }

  removeAllEventListeners(event_type) {
    const event = __getEvents(event_type)
    event.conditions.length = 0
    event.listeners.length = 0

    delete this.events[event_type]
  }

  __getEvents(event_type) {
    if (!this.events)
      this.events = {}

    if (!this.events[event_type])
      this.events[event_type] = {conditions: [], listeners: []}

    return this.events[event_type]
  }
}

const EventContext = React.createContext(new EventManager())

export function Provider(props) {
  const events = new EventManager()

  return React.createElement(EventContext.Provider, { value: events}, props.children)
}

export function useEventManager() {
  return React.useContext(EventContext)
}

export function connectToEventManager(Component) {
  return function(props) {
    const children = events => React.createElement(Component, Object.assign({ events: events }, props))
    return React.createElement(EventContext.Consumer, null, children)
  }
}


const METHOD_TYPES = ["conditions", "listeners"]
function ensureBoundObject(listeners) {
  // It can only be a function, an object or an array. Otherwise, it's wrong
  if (!["function", "object"].includes(typeof listeners)) 
    return { conditions: [], listeners: [] }

  // If it's a function, we're going to make it an array
  if (typeof listeners == "function")
    listeners = [ listeners ]

  // Now we're going to handle it not being a non-array object. 
  // The onlt other thing it could be is an array. So in that case
  // we'll turn it into an object
  if (Array.isArray(listeners))
    listeners = { listeners }

  // Now we are going to ensure the event object properly
  const event = listeners
  for (let attr of METHOD_TYPES) {
    // If the attribute is a function, make it an array
    if (typeof event[attr] == "function")
      event[attr] = [event[attr]]

    // If the attribute is not an array, then I don't care about it
    if (!Array.isArray(event[attr]))
      event[attr] = []

    // Ensure every element inside the array is a function
    event[attr] = event[attr].filter(method => typeof method == "function")
  }

  return event
}

export function bindListeners(event_manager, context, listeners) {
  const bound_listeners = { manager: event_manager, events: {} }
  const events = bound_listeners.events

  for (let event_type in listeners) {
    let event = ensureBoundObject(listeners[event_type])

    events[event_type] = {}
    for (let method_type of METHOD_TYPES) 
      events[event_type][method_type] = event[method_type].map(method => method.bind(context))

    for (let method of events[event_type].conditions)
      event_manager.addEventCondition(event_type, method)

    for (let method of events[event_type].listeners)
      event_manager.addEventListener(event_type, method)    
  }

  return bound_listeners
}

export function removeBoundListeners(bound_listeners) {
  const event_manager = bound_listeners.manager
  const events = bound_listeners.events

  for (let event_type in events) {
    for (let event_condition of events[event_type].conditions)
      event_manager.removeEventCondition(event_type, event_condition)

    events[event_type].conditions = 0

    for (let event_listener of events[event_type].listeners)
      event_manager.removeEventListener(event_type, event_listener)

    events[event_type].listeners = 0
    delete events[event_type]
  }
  
  delete bound_listeners.events
  delete bound_listeners.manager
}