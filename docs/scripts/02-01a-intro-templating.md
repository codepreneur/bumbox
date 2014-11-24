Setup
-----

In this step you're going to get started with templating.

Let's take a look at our application template in app/template/application.hbs.
This page is the entry point to our application's templates. This application
template will always be shown to the use no matter where they are in the app or
what the current URL is. As you can see it's just static HTML right
now.

Now let's look at our tests for step 1 and see what's failing.  Notice that I
have my "Up to step" selector set to step 1 so that I only see the failing tests
that I care about right now.

Our static markup fulfills some of our test expectations already. First, we do have a
div with a class of 'album-list'.  Also we are showing 4 albums on the page.
These tests can help us catch regressions by ensuring that we render the
right template at the root URL and that we render the right number of albums.

Now let's look at our failing assertions. These assertions test we have the
correct album names, artist names, and artwork URLs. We need to dynamically
render the albums with the correct data to pass these tests.

Your goal in this step is to take this static markup in application.hbs and
turn it into a dynamic template that will allow us to render these albums based
on data that we would get from a server.

The data we're going to use for now in `app/models/album-fixtures`. Each object in
this array represents the data you would get from a JSON API. Later in this
course we'll be using Ember Data to get this information from a simple server,
but for now we're going to take a shortcut in order to get started with
templating.

Let's edit the application route together. This file is in
app/routes/application.js.

First we'll import our Albums data from the fixture file that I showed you.

Just type import albums from bumbox/models/albums-fixtures.

Inside of this model hook, return the array of album attributes. We'll talk
about routes in more depth later, but for now just know that putting this array
of objects here is going to make this data available to your application
template.

Once you have this setup you should be able to verify that this worked in your
browser using the Ember Inspector.

Search for the Ember inspector in the Chrome store if you don't have it yet and
watch the debugging appendix if you want to learn more about debugging now.

--

So visit the app, open the Ember Inspector and look at the View Tree. I can see
that I'm rendering the application template, with an array of objects as a
model. If I click on the model, then I can the fixture data that I returned in
the Route.

Now that that's working, let's talk about two templating concepts.

---

Templating - Attributes
---------------------

We are going to be using handlebars syntax to render the
dynamic portions of our templates.

So if we had some static markup like this:

```html
  <p>Hello, Tomhuda</p>
```

And we wanted to render different names based on our data, then we could use the
double curly braces to wrap a name attribute:

```html
  <p>Hello, {{name}}</p>
```

The content in the brackets tells Ember to render the name property from the
model that backs the template.

So if we say:

```html
  <p>Hello, {{name}}</p>
```

And the model for this template is:

```json
  { name: "Tomhuda" }
```

Then the result will be:

```html
  <p>Hello, Tomhuda</p>
```

But enough talk, let me show you a quick example with real code.

In a blank ember project I'll just write:

```html
  <h2>Hello, {{name}}</h2>
```

In the application template.

---

When I look at the page in my browser I can see that {{name}} is missing.

Each one of our templates will be backed by a model that serves as that
template's context.  We can see that there is no name on our current model,
which is just a blank object being returned in the route.


If I return a model with a name, like "Ember Superstar (that is what you are)"...
We can see it show up in our template.

When you render the album names, artist names, and artwork, you can use this syntax to
render these attributes on the page.

---

Templating - Each
-----------------

Often in templates we deal with lists of things that we want to render in a
similar way. For this step in the course, we want to render the same markup for
each album, but with different attributes.

In Ember you can use the `{{#each}}` helper to render a list of items.

```html
  <ul>
    {{#each}}
      <li>{{name}}</li>
    {{/each}}
  </ul>
```

So in this example template, we're iterating through a list of objects and
rending the name property of each one. One key thing to notice here is the '#'
and '/' prefixes on the each helpers. This means that these helpers are
wrapping other content. We'll see a few other helpers like this throughout the
course. We call them "Block" helpers because they take a block of content and
render it in a special way.

When you look at the `each` helper here you see that it doesn't take any
arguments. So what it is looping over?

```html
  <ul>
    {{#each this}}
      <li>{{name}}</li>
    {{/each}}
  </ul>
```

When `{{#each}}` doesn't have an argument after it, it uses `this`, the current
model. In the case of Bumbox and your application template, think of `this` as
your array of album data that you returned from the model hook in your route.

Onward
------

So armed with the `{{#each}}` helper and the basic `{{attribute}}` syntax, open
up your application.hbs file and take shot at rendering each album and getting
all the tests passing for step-01.
