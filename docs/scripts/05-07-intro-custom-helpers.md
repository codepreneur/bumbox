We've seen some handlebars helpers already like `{{#each}}` and `{{#link-to}}`.

In this step we're going to create our own helper to format the duration of our
songs in this list.

Helpers
-------

Helpers offer a way to translate raw data values into friendlier, human-readable
values.

For instance:

* You might transform a date into a string of text saying how long ago it was.
* You could translate a raw number into a song duration as we're doing in this
  step.
* You could format currency in a specific way.

```
new Date => 3 days ago
316      => 5:16
-1200    => $ (1,200.00)
```

Helpers are usually simple functions that take a value and return
another formatted value. Let's take a look at a simple custom helper.

Here I have an application that takes a name and returns a secret code name.

In the template we have an input field that is bound to the name property on the
current model. We are also rendering the value of that name property into the
DOM.

When I type in a name, I see the same thing under "secret name".

Let's make a helper to format the secret name.

In the app/helpers directory I'm going to create a file called format-secret.
I'm purposefully using a hyphenated name because this helps ember-cli recognize
my custom helper. Helpers and, as we'll later see, components use hyphenated
names to differentiate themselves from properties and to adhere to the current
W3C specification for custom elements, which require element names with hyphens.

(lower third for http://w3c.github.io/webcomponents/spec/custom/)

```
import Ember from 'ember';

function formatSecret(value) {
  if (!value) { return ''; }
  return value.split('').reverse().join('');
}

export default Ember.Handlebars.makeBoundHelper(formatSecret);
```

First I'll import Ember for this file. Then I'm going to make a simple
function to do the formatting work. You may not be able to decipher this leet
cryptography algorithm here, but just know that it reverses the string that's
passed in.

We shouldn't assume that this incoming value will always be a string. When
someone first arrives on the page, the user hasn't entered a anything so the
value will be undefined. I'll put a guard at the top of this function to return
an empty string if the value's not there.

Finally I'm going to export a bound helper from this file which is my original
format function wrapped with `Handlebars.makeBoundHelper`.  Wrapping our
function this way is what provides the always-up-to-date behavior of our helper.

Now that I've created the helper I need to use it inside of my template so that
it can format the name.

Now when we look at the page, we can type a name in this input and get a secret
name on the other side.

Dependent Keys
--------------

You may have a case where you want your helper to work with an Ember object
whose properties might change. Let's say that we want to pass a user object into
our format-secret helper.

In this case I've updated my template to take both a firstName and a lastName
of the user. I'm passing `this` to the format secret helper which will act
as a user model with a first and last name.

```
<h2 id='title'>Get your secret name!</h2>

<div class='left'>
  <label>First Name</label>
  {{input type='text' value=FirstName}}

  <label>Last Name</label>
  {{input type='text' value=LastName}}
</div>

<div class='right'>
  <label>Secret Name</label>
  {{format-secret this}}
</div>
```

In the running app you can see both of the name fields.

To accommodate this user model, I'll need to update the `format-secret`.  Back
in the helper I'll rename our `formatSecret` function to 'reverse' to be used
later.

Next I'll have our format function take a user object instead of a raw value.

I'll pull the first and last names off of the user model into a variable called
names.

Then I'll map over these names with our reverse function and finally join them
together with a space.

This is the first time we've seen the `get` function in Ember. We'll talk more
about Ember objects soon, but for now know that `get` is used to get a
properties from an Ember object.

# RERECORD

Finally I'll make sure that we're exporting the new reverseNames function as our
bound helper.

```
import Ember from 'ember';

function reverse(value) {
  if (!value) { return ''; }
  return value.split('').reverse().join('');
}

function reverseNames(user) {
  var names = [user.get('firstName'), user.get('lastName')]
  return names.map(reverse).join(' ');
}

export default Ember.Handlebars.makeBoundHelper(format);
```

But now when I try to use my form nothing happens. What is different here?

Our helper doesn't know when to update because we haven't given it a new user,
rather the properties *on* the user have changed. We wouldn't want Ember to
update this helper when any property on the user changes either, so we need to
tell Ember what properties it should care about.

These properties are called "dependent keys", they indicate what properties the
helper depends on.

We can pass in dependent keys to the `makeBoundHelper` function after our
formatSecret function.

So we'll pass in 'firstName' and 'lastName' here to tell ember that this
helper needs to be updated if these properties on the user object change.

```
export default Ember.Handlebars.makeBoundHelper(format, 'firstName', 'lastName');
```

Now if we go back to our page, we can see that we're successfully updating the
secret name when the first and last names change.


Returning HTML
-------------

In some cases it might make sense to return HTML from a helper. Let's say, for
instance that we're making a markdown editor with a preview box next to it.

This time I have a textarea on the left and I'm showing the value from this
textarea on the right.

Looking at the template, we can see that the value from this textarea is 'body'
and the output on the right is 'body' as well.

```
<h2 id='title'>Edit your post</h2>

<div class='left'>
  <label>Post body</label>
  {{textarea value=body}}
</div>

<div class='right'>
  <label>Preview</label>
  {{body}}
</div>
```

Let's update this template to preview the HTML from a markdown parser. I'll start
by putting in the helper that I would like to have: `format-markdown`.

```
<div class='right'>
  <label>Preview</label>
  {{format-markdown body}}
</div>
```

Now let's create that helper file in app/helpers/format-markdown.js.

```
/*  global marked */
import Ember from 'ember';

function formatMarkdown(text) {
  if (!text) { return ''; }
  retun marked(text);
}

export default Ember.Handlebars.makeBoundHelper(formatMarkdown);
```

To accomplish this task I'm using a 3rd-party library called 'marked'. Checkout
the ember-cli documentation to learn how to install third-party libraries in
your application.

To make js-hint happy and to make it clear what dependencies this file has, I'm
putting this special `/* global marked */` comment at the top of the file,
indicating that I'm using a global variable called `marked`.

Our `formatMarkdown` function will take the raw markdown text as input.  Again,
we'll guard against missing input. And then finally we'll return the formatted
text that has been processed by the marked function.

At the bottom of the file we'll export our `formatMarkdown` function with
wrapped with `makeBoundHelper`.

Now let's look at our page -- this is not what we want. We're seeing the escaped
HTML in the preview. By default, Ember escapes user input for security reasons.

We need to explicitly tell Ember that it's okay to insert this html into our
markup.  We can do this with `htmlSafe()`.

In our helper I'll call `htmlSafe()` on this return value to let Ember know that
I don't want to escape this content.


```
/*  global marked */
import Ember from 'ember';

export function format(text) {
  if (!text) { return ''; }
  retun marked(text).htmlSafe();
}

export default Ember.Handlebars.makeBoundHelper(format);
```

Now our markdown preview is working the way we want. But it's important to
realize the security risk of putting unescaped user input on a page.

Let's say we save this form and then we use our `format-markdown` helper to show
the post somewhere else on the site. Users could put a script tag in this
textarea and use it to steal user sessions or generally mess up your site.

If I type a little message in here, with a script tag...

```
Nice website, bro.
<script>alert('pwnd')</script>
```

We can see that this JavaScript executes when we view the post page.


This Step
---------

In this step you'll update the album template to show the duration of the songs
in a friendlier format. Checkout the comments at the top of this step's tests
for guidance on how to turn the number of seconds into the minutes-seconds format.

See your tests fail, then create a helper to complete this step.
