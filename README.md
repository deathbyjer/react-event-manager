Event Manager for React
=======================

Yet another custom event manager for React.

### Why an Event Manager?
React handles events by sending event listeners, as properties, to child components. The children call the listeners and the parent responds!

This can get rather trying if we are pushing down beyond a single level. It is especially difficult if you was completely separate components talking to each other. To handle a situation like that, we need an external error manager.

### What Makes this EM different from all other EMs?
This is not the first attempt at a solution to this problem. Here are a couple other solutions:
 - react-event-listner
 - react-custom-events 

What makes this solution different are a coulpe of key details:

#### This Solution Supports both Class and Functional Components.
While functional components are all the rage, there are still cases that can be made for class components, specifically if maintaining non-state instance variables are required. This library can easily support both.

#### Conditional Callbacks
This module implements an interesting feature that allows components not only attach themselves to listen to callbacks, but also vote whether a callback should be executed at all. (For example, a user might push a button in one component, but another component may not want the action to execute. Instead of cluttering up the state space with monitoring variables, other components to manage it themselves).

#### Simple Syntax for Multiple Listeners
Sometimes your system may maintain a web of different actions and queues that your components will want to listen to, and handling the addition and removal of the listeners can be quite tedious. This module offers a way to generate multiple listeners at the same time.

#### Context-based
This function uses pure javascript and React Contexts, so it should not require the existence of the DOM.

Installation
------------

Using NPM:
```
npm install --save @deathbyjer/react-event-manager
```

Using YARN
```
yarn add  @deathbyjer/react-event-manager
```

Usage
-----


#### Setup
FIrst, we will need to set up a root context for the event manager. If you have used Redux before, you'll find this rather similar.


```jsx
import React from 'react'
import { Provider as EventProvider } from '@deathbyjer/react-event-manager'

function Foo(props) {
  return "Bar"
}

export default function(props) {
  return <EventProvider>
    <Foo />
  </EventProvider>
}
```

#### Registering to Events

To register and unregister for events, we can make use of the `addEventListener(event, listener)` and `removeEventListener(event, listener)` methods. 

##### Functional Components
With functional components, we can make use of the `useEventManager()` hook to grab the event manager we'll be adding / removing events from.

```
import React, { useState } from 'react'
import { useEventManager } from '@deathbyjer/react-event-manager'

function EventAdder(props) {
  const [outside, setOutside] = useState(null)
  const events = useEventManager()

  const listener = str => setOutside(str)
  events.addEventListener('foo', listener)
  
  useEffect(() => {
    return () => events.removeEventListener('foo', listener)
  })
}

export EventAdder
```

We add the addEventListener to the manager and then pop the listener off from the manager when the component is being cleaned up (which we have access to using the useEffect hook.
