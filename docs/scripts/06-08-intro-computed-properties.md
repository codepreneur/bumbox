Ember Objects
-------------

So far we've been working with ember objects in the form of models, and we've
used the `get` to get their properties, but we haven't said much about what is
going on under the hood and why we have to use a function like `get`.

Ember uses a construct called Ember Object as the basis for a JavaScript object
system. The Ember data models and the routes that we've created are all special
types of Ember objects.

If you're familiar with one of these languages, you can find analogous code for
Ember Objects.

Ember
-----

```
export default Ember.Object.extend({
});
```

Java
----

```
class Album extends Object {
}
```

Ruby
----

```
class Album < Object
end
```


Python
------

```
class Album(Object):
 pass
```

C++
---

```
class Album : public Object {
}
```

And here is how you would create instances of these objects:

Ember
-----

Album.create();

Java
----

new Album();

Ruby
----

Album.new

Python
------

Album()

C++
---

new Album()


Javascript already has a way of creating objects using it's prototype system:

```
Album = function(name) {
  this.name = name;
}

Album.prototype.sayName = function() {
  console.log(this.name);
}
```

So why does Ember go through the trouble of creating a custom object later? Let's
look at some JavaScript code and see where Ember Objects help us.

Let's say we we're building an app that has projects with many tasks. We're
working a feature where we need to show whether a task is ready to be worked on.

In this case we'll just say that isReadyForWork is a boolean property that comes
from our server. Using a JavaScript object we can easily get and set an
`isReadyForWork` property.

```
task.isReadyForWork = true;
task.isReadyForWork; //=> true
```

Now let's say that we need to add behavior to `isReadyForWork`. It's not just a
simple boolean property anymore -- we need to determine if this item is ready
for work based on a two factors: is this item assigned to someone and does it
have a description of what to do. Using JavaScript we have to make some tough
choices at this point.

Should we try to set the property when the task is first initialized? If so what
happens when one of these properties object is updated later?

```
export default function Task(attributes) {
  this.isReadyForWork = attributes.assignee && attributes.description;
}
```

Probably we would rather just compute the value when it's asked for, so we would
write a function to get this value.

```
Task.prototype.isReadyForWork = function() {
  return this.attributes.assignee && this.attributes.description;
}
```

Because we changed this implementation detail, now we need to change the way we
use this property throughout our application by calling it as a function. When
details about how a property is calculated leak into other parts of our
application it means we have bad encapsulation.

```
task.isReadyForWork   //=> function definition
task.isReadyForWork() //=> true
```

This problem can be addressed using ES5 getters as long as your application
doesn't need to support IE8 or below.

```
Object.defineProperty(Task.prototype, "isReadyForWork", {
  get: function() {
    return this.attributes.assignee && this.attributes.description;
  }
});
```

Now that we've defined `isReadyForWork` either as a plain function or with an
ES5 getter, we need to have a way to update the DOM when either the `assignee`
or `description` attributes change so the user can see the new status.

This is where JavaScript frameworks take very different approaches. One approach
is to periodically call the `isReadyForWork` function to see if the value
changes.

```
...
task.isReadyForWork //=> false
task.isReadyForWork //=> false
task.isReadyForWork //=> true => Update the DOM
```

Another approach is to leave it to the programmer to explicitly fire
events or call methods on view objects at the right time to tell them to
rerender.

```
task.update({description: "Mow the lawn"});,
task.render();
```

Ember uses an abstraction called called `Computed Properties` which use an
observer pattern to always keep the view layer up-to-date.

Here's an example of how we could implement the `isReadyForWork` property as a
computed property.

```
export default Ember.Object.extend({
  isReadyForWork: function() {
    return this.get('assignee') && this.get('description')
  }.property('description', 'assignee')
});
```

In Ember we can use the property method on a function to indicate that the
function should be treated as a property. We also pass the property dependent
keys which tells the function that the property needs to be recomputed whenever
the 'description' or 'assignee' properties change.

So this code is saying that `isReadyForWork` is a property that we can get from
this object. We're also saying that whenever the assignee or the description of
this object changes, this property needs to be updated.

So far Ember Objects have addressed these issues with the typical prototype
object system:

1. They provide a way to uniformly access properties with `get` whether they are simple
   properties or computed from other values.
2. They provide a way for the templating system to observe changes that happen
   and update the DOM

Let's look at a couple other benefits of Ember objects and computed properties:

Let's say we create a template that uses `isReadyForWork` several times:

```
{{isReadyForWork}}
{{isReadyForWork}}
{{isReadyForWork}}
```

If we had used a basic JavaScript getter, our `isReadyForWork` method would get
called three times.

(some kind of live demo here)

Let's see what happens when we actually use a function like this. Inside of our
`isReadyForWork` function I'll log each time the function is called.

```
export default Ember.Object.extend({
  ...

  isReadyForWork: function() {
    console.log("I was called!");
    return this.get('assignee') && this.get('description')
  }.property('description', 'assignee')
});
```

You can see that when we render the page the method is only called once.
Computed properties know based on the dependent keys that they are passed when
they need to recalculate, so we get a built-in caching layer for our application.

In the console I'll use the `set` method to update the description on the model.
Only when we update the property like the description do we see the function run
again.

Composing Computed Properties
-----------------------------

We haven't even touched on the killer feature of computed properties:
composability. Computed properties provide an expressive and efficient way to
compose intricate state in your application. Let's look at some ambitious
examples.

Let's say that tasks can now have multiple assignees, and a task is only assigned
if it has at least one assignee.

Also we realize that if a task has an empty string, it still behaves as if it
has a description. We need to fix that.

```
export default Ember.Object.extend({
  ...

  isReadyForWork: function() {
    return this.get('isAssigned') && this.get('hasDescription')
  }.property('description', 'isAssignee')

  isAssigned: function() {
    return assignees.get('length') > 0
  }.property('assignees.length')

  hasDescription: function() {
    return Ember.isPresent(this.get('description'));
  }.property('description')
});
```

We can easily compose two different computed properties so that the
`isReadyForWork` property updates when the number of assignees changes.

Let's take this even further. Let's say now we're working with a project and we
only want to show a list of tasks that are "ready for work".

```
export default Ember.Object.extend({
  ...

  tasksReadyForWork: function() {
    return tasks.filterBy('isReadyForWork');
  }.property('tasks.@each.isReadyForWork')
});
```

Here we're introduced new `@each` syntax in our property. This each says
"recompute this property if an item is added to tasks, an item is removed from
tasks or if the isReadyForWork property changes on a task.

As you become more familiar with computed properties, you should begin to
explore the Ember.computed namespace which contains computed property macros
that express common computed properties in a concise way. For instance, the code
that we wrote above can be rewritten as:

```
// Task Object
var computed = Ember.computed;

export default Ember.Object.extend({
  ...

  isReadyForWork: computed.and('isAssigned', 'description),
  isAssigned: computed.notEmpty('assignees')
});
```

```
// Project Object
var computed = Ember.computed;

export default Ember.Object.extend({
  ...

  tasksReadyForWork: computed.filterBy('tasks', 'isReadyForWork),
});
```

So on top of providing uniform access to properties and providing a way of
rendering DOM when a property changes, Ember Objects also give us:

1. A caching layer that can increase the performance of your application with
   with computed properties
2. A way of composing state to efficiently change through the user interface.


In this step
------------

In this step we're going to use computed properties to update 2 areas of our
application.

First we're going to update this album song count on the index page of our
application.  Then we're going to make the total duration that you see on the
bottom of the album page dynamic and actually show the true total duration of
the album based on the songs inside.
