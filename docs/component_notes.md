example of a logout button that could be anywhere, playing a song from multiple
places

Until now, we've dealt with a pretty standard web app. Although we're able to
achieve a very fast-feeling application, everything we've done so far could
easily be accomplished using server-side rendering.

The pattern of setting up a resource, loading models in a route, and then
rendering a template fits this type of interface perfectly.

Now we're going to add a feature that requires client-side work. At the bottom
of this application we're going to show part of the UI that doesn't go away.
We're about to embark on a journey with components.

components can just show markup:

```
// in a template

{{my-component}}
```

```
// in the component template
<h1>COMPONENT!!!</h1>
```

You can pass values into a component:

```
{{my-component title="Hi!" body="so much text"}}
```

```
// in the component template
<h1>{{title}}</h1>
<div>{{body}}</div>
```

You can use yield to wrap content and use your component with a block.

```
{{#my-component title="Hi!"}}
  <div>so much text</div>
{{/my-component}}
```

```
// in the component template
<h1>{{title}}</h1>
<div>{{yield}}</div>
```

Responding to user actions requires a JavaScript component file.

```
<a href="#" {{action "toggle"}}>Toggle me</a>
{{#if isExpanded}}
  {{yield}}
{{/if}}
```

```
export default Ember.Component.extend({
  toggle: function() {
    this.toggleProperty('isExpanded');
  }
});
```

Components can send actions to allow the rest of your application to get
information from them.

...

Components are tied to elements that the browser understands. You can customize
the element that represents the component:

```
export default Ember.Component.extend({
  tagName: 'li',
  classNames: 'expander'
});
```

sendingActions

Breaking Out
------------

Your Ember application code lives in a world of bindings, but other JavaScript
libraries do not. Specifically, may libraries expect to have DOM already loaded
on the page that they can manipulate. `didInsertElement` is your way to bridge
the gap between these two worlds.

After `didInsertElement` is called, you'll have access to the part of the DOM
that the component owns.

```
export default Ember.Component.extend({
  didInsertElement: function() {
    console.log(this.$()[0]);
  }
});
```


Avoid passing in a model.

Showing the app working with the now playing at the bottom.

We want to create a part of the app that doesn't change as we move around
between the pages.

There is an outlet that changes and there is a bottom part that is always there.

Example of creating a sidebar template

How to put something on the screen that is always gong to be there.

Now playing footer element




Components
----------

Turn primitive events into semantic events

Should we refactor from a controller into a service?


