Event Manager for React
=======================

Yet another custom event manager for React.

### Why an Event Manager?
React handles events by sending event listeners, as properties, to child components. The children call the listeners and the parent responds!

This can get rather trying if we are pushing down beyond a single level. It is especially difficult if you was completely separate components talking to each other. To handle a situation like that, we need an external error manager.

### What Makes this EM different from all other EMs?
This is not the first attempt at a solution to this problem. Here are two other solutions:
 - react-event-listner
 - react-custom-events 

However, this module has several key differences:

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

```javascript
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

export default EventAdder
```

We add the addEventListener to the manager and then pop the listener off from the manager when the component is being cleaned up (which we have access to using the useEffect hook.

If we are registering more than one event, we also have the option of using the `bindListeners` and `removeBoundListeners` helper functions.

```javascript
import React, { useState } from 'react'
import { useEventManager, bindListeners, removeBoundListeners } from '@deathbyjer/react-event-manager'

function EventAdder(props) {
  const [outside, setOutside] = useState(null)
  const events = useEventManager()

  const listener = str => setOutside(str)
  const boundListeners = bindListeners(events, null, {
    'foo': () => setOutside("foo"),
    'bar': [
      () => setOutside("bar"),
      () => console.log("Easily Removed Later")
    ]
  })
  
  useEffect(() => {
    return () => removeBoundListeners(boundListeners)
  })
  
  return <div>{outside}</div>
}

export default EventAdder
```

We can also send an array of functions to each event inside the `boundListeners`. This allows us to use multiple smaller, more concise function than a single behemonth that performs a slew of different tasks (while still making cleanup a breeze!)

#### Class Components
If you've used react-redux before, then should be simple. We can use the function `connectToEventManager` to wrap the component and provide a `this.props.events` attribute that will contain the instance of the event manager for us to add / remove events.

```javascript
import React from 'react'
import { connectToEventManager } from '@deathbyjer/react-event-manager`

class EventAdder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    
    this.listener = () => this.setState({foo: "foo"})
  }
  
  componentDidMount() {
    this.props.events.addEventListener("foo", this.listener)
  }
  
  componentWillUnmount() {
    this.props.events.removeEventListener("foo", this.listener)
  }
  
  render() {
    return <div>{this.state.foo}</div>
  }
}

export default connectToEventManager(EventAdder)
```

You'll note that in this example, we specify the event in the `componentDidMount`. That is just because we want to make sure that for every `addEventListener` we have a paired `removeEventListener`. 

And just as before, we can also use the `bindListeners` and `removeBoundListeners` to make our lives a bit easier.



```javascript
import React from 'react'
import { connectToEventManager, bindListeners, removeBoundListeners } from '@deathbyjer/react-event-manager'

class EventAdder extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }
  
  componentDidMount() {
    this.bound_listeners = bindListeners(this.props.events, this, {
      'foo': () => this.setState({foor: 'foo'})
      'bar': [
        () => this.setState({foo: 'bar'}),
        () => console.log("Barred!")
      ]
    })
  }
  
  componentWillUnmount() {
    removeBoundListeners(this.bound_listeners)
  }
  
  render() {
    return <div>{this.state.foo}</div>
  }
}

export default connectToEventManager(EventAdder)
```
