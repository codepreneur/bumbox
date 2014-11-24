So far, we've put all of our markup in a single template and we've only looked
at a single page. Building a complete web application usually involves moving
users to different "pages" or "screens".

For instance, in this mockup, if a user clicks on the puppy picture they're
taken to another screen showing more information about that photo.

(wireframe showing navigation between pages)

Another common pattern is to have users select an item and see more information
about that item on the same screen.

So in this case when the user selects the cat they see the details about that
photo without feeling like they've moved to a new part of the application.

Notice that in both of these mockups, part of the application (the header)
always remains on the screen.

(wireframe showing a master-detail view)

No matter how a UI is laid out, the Ember Router use keeps track of where
users are in the URL as they move through your application. In this section of
the course we're going to let users click on an album and navigate to a page
where they can see the list of songs in an album.

(show navigation in completed bumbox app)

In order to do this, we're going to create two different routes. One to load the
index page at the root URL and one to load the album at '/album/1'.

To map URLs in our applications to a route, we need to setup our router in
app/router.js

```
Router.map(function() {
  // resources and routes go here
});
```

When configuring your routes we start with the Router `map` function.


```
Router.map(function() {
  this.resource('photo', {
    path: '/photo/:photo_id'
  });
});
```

In this map function we can create a resource:

Think of resource as a URL that represents the nouns or domain models in your
application like photos, songs, albums, and users. Later we'll see that we can nest
other resources and routes under a resource, but for now we're going to deal
with the simple case of having a single resource.

Here we're saying there is a resource called 'photo' and there is a path
that represents the URL associated with a model. This URL has a dynamic segment:
'photo_id' which means that whatever value is passed here will be available to
the Route. This dynamic segment typically represents the unique ID of the
resource we're dealing with.

To explain this a little more, let's walk through an example of what happens
when a user visits a URL.

We'll say that a user visits '/photo/cat'. Ember will go though all of the routes
that it has and try to find one with with a path that matches that URL. In
this case it will find that '/photo/:photo_id' is a match. Because we have the
`:photo_id` dynamic segment, 'cat' will be extracted from the URL as `photo_id`.

Ember takes this `:photo_id` and puts it into a `params` object:

```json
{ photo_id: 'cat' }
```

And that params object will be passed to the model hook of your route.

```
export default Ember.Route.extend({
  model: function(params) {
    return photos.findBy('id', params.photo_id);
  }
});
```

In the model hook it's up to us to use the params data to find the right model
for this route. Here we're looking at an array of photos and using one of
Ember's enumerable functions to find the photo that has the id given in
params.photo_id.

Keep in mind that for any route we create, we always have the
application route and application template being used as the "root-most" route
and template. That means every other template is nested inside the application
template.

So in the case where our user hits '/photo/cat', Ember will:

2. Render the application template with it's model if it has one
3. Render the photo template inside of the application template

When a template is nested in another, we need to tell Ember where to insert that
nested markup. We do that by placing an outlet in the outer template:

Based on this outlet, the application template knows where to render the photo
template.

```
{{outlet}}
```

In the case that we don't have a dynamic segment in our route, everything works
the same, but we won't have any params data available in our route. For instance
if we know ahead of time that '/photo' should show a particular photo we could
use a resource with no dynamic segment.

```
Router.map(function() {
  this.resource('photo', {
    path: '/photo'
  });
});
```

and then in our 'photo' route we could return a photo model however we want. In
this case we're just getting the last photo from our array of photos.

```
export default Ember.Route.extend({
  model: function() {
    return photos.get('lastObject');
  }
});
```

Let's talk specifically about completing this step.

In this step of the course we're going to focus on the use case of visiting an
album URLs directly and worry about creating links to these URLs later.

Before you start setting up your resource in the router and creating your first
route, we need to talk about of application template. All of our markup is in
our application template and remember that the application template is always
rendered.

Thinking about our current application, we want to navigate from a page that
looks like this (showing album list) to a page that looks like this (showing
album detail page).

Some elements are always on the page -- the header and the footer. Some content
changes as we move between the pages -- the list of albums and the album
details. This means that the header and footer should stay in the application
template, but the other content needs to move somewhere else.

(use highlighting and screenshots to show the above info)

The list of albums that we've been looking at is the home page or in other
words, the page that we see when we are at the root URL. We call this the index page.

Looking at the list of albums we're at the root URL and we're using the index
route and the index template. Remember that this template is a child of the
application template and is rendered inside of its parent.

When we we navigate to '/album/1' we still render the application template, but
instead of the index template and route we want to render the album template and
route.

So in total to complete this step you'll need to do 4 things:

1. Move the album-specific markup out of application.hbs and into index.hbs.
2. In your router, make a resource for your new album page at
   `/album/:album_id`.
3. Make a route for your album page, that finds the correct model for the
   template.
4. Render an album template that satisfies the test.

Check out the failings tests for step-3 and Take a shot at completing this step
and getting the tests to pass.
