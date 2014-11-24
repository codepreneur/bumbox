Looking at the completed app here you can see that some of these albums are
marked as explicit while others are not.  In the next step, you'll use template
helpers to conditionally show the EXPLICIT message on this page for each album.

In Ember we can use the `{{#if}}` helper to only show some content when a
condition is true.

```
{{#if isAdmin}}
  You're an admin.
{{/if}}
```

In this case we can show a message when a user is an admin.

We can use `{{else}}` to handle the condition when the user is not an admin.

```
{{#if isAdmin}}
  You're an admin.
{{else}}
  You're NOT an admin.
{{/if}}
```

Notice that there is no '#' in front of the else - that's because `{{else}}` is
a keyword and not a block helper.

You can use the `{{#unless}}` helper to show content when something isn't true.

```
{{#unless isAdmin}}
  You don't have access.
{{/unless}}
```

You can also use `{{else}}` with an `{{unless}}`, but that's a little confusing.

```
{{#unless isAdmin}}
  You're not an admin.
{{else}}
  You are an admin.
{{/unless}}
```

In this case you should just flip the logic to say "if you're an admin, say
you're an admin, otherwise say you're not an admin."

```
{{#if isAdmin}}
  You are an admin.
{{else}}
  You're not an admin.
{{/unless}}
```

Here is a list of values that conditional helpers will consider falsey:

Falsey Values
-------------

* Empty String - `""`
* Empty Array - `[]` // Different from normal JavaScript
* null or undefined values
* Zero - 0

These conditional helpers are close to the semantics of JavaScript truthy and
falsey values, with one difference: An empty array is considered falsey rather
than truthy.

It turns out that treating an empty array as falsey, is pretty useful for
templating.

For instance, let's take a look at using the `{{else}}` keyword inside of an
`{{#each}}` block:

```
<ul>
  {{#each}}
    <li>{{name}}</li>
  {{else}}
    <li>There are no people yet.</li>
  {{/each}}
</ul>
```

These falsey semantics allow us to use an `{{else}}` to render content when the
model we're iterating over is empty. This is a really useful pattern.

In this case we can render the name of each person in an array and show a
message if there are no people at all.

Let's see a live example.


Live Example
------------

We're going to explore these conditional helpers in a fresh ember-cli application.

I'm going to make a simple object with a name and an isAdmin property that we'll
treat as a person model.

```
  return {name: 'Thomas', isAdmin: true}
```

And I'll update the template to show the name and the isAdmin property.

```
<label>
  {{input type="checkbox" checked=isAdmin}}
  {{name}}
</label>
```

I'm using the input helper to show a checkbox that is bound to the isAdmin
property of this person. When I click on the checkbox, I'll be able to toggle
the value of `isAdmin` on the model.

Now let's try out our `{{#if}}` helper and show a message only when the user is
an admin.

```
<label>
  {{input type="checkbox" checked=isAdmin}}
  {{name}}
</label>

{{#if isAdmin}}
  <i>(You're an admin)</i>
{{/if}}
```

When I toggle this box you can see this message disappear and reappear.

Using the {{unless}} helper in place of the if helper inverts this logic:

Make sure that you change your closing if to an unless.

```
{{#unless isAdmin}}
  <i>(You're NOT an admin)</i>
{{/unless}}
```

We can use `{{else}}` to toggle between the two messages:

```
{{#if isAdmin}}
  <i>(You're an admin)</i>
{{else}}
  <i>(You're NOT an admin)</i>
{{/if}}
```

Now let's see how `{{else}}` works in the context of `{{each}}`. First we'll
return an array of users from the route, instead of just a single object:

I'll just paste in 2 objects in an array. One starts out as an admin and the
other does not.

```
return [
  {name: 'Thomas', isAdmin: true},
  {name: 'Yehuda', isAdmin: false}
];
```

And in the template we'll loop through the users using each. I'm going to use a
`p` tag here to make sure each user ends up on a new line.

```
{{#each}}
  <p>
    <label>
      {{input type="checkbox" checked=isAdmin}}
      {{name}}
    </label>

    {{#if isAdmin}}
      <i>(You're an admin)</i>
    {{else}}
      <i>(You're NOT an admin)</i>
    {{/if}}
  </p>
{{else}}
  <p>There are no people</p>
{{/each}}
```

Now we can see both users on the page.

Next I'll add an `{{else}}` to handle the case when the array of people is empty.

And if return an empty array from the route, we'll be able to see the "no people"
message.

```
return [];
```

Onward
------

Now that we've looked at using conditional helpers in Ember, try getting the
tests passing for step-02.

Looking at the tests we can see that two of our assertions are met because the
first two albums should not show the explicit warning, but the third and fourth
albums are missing their explicit warnings. Based on the album data that we have
loaded in the route, you should be able to conditionally show EXPLICIT warnings
on the albums.

