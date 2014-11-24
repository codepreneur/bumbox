To complete this step, I'm going to start by creating an index.hbs template and
moving the markup for listing albums in there.

So I'm grabbing all of this markup for the  "album-list", creating a new file
called index.hbs, and pasting that markup in here.

Now if I take a look at the app in my browser, I see the header and the footer,
but the list of albums is missing. Looking at Routes section of the Ember
Inspector and only showing my current routes I can that I'm using the
application route and application template. Nested inside of that route is the
index route and template. Why am I not seeing the list of songs in the index
template that I created?

Let's think about the current state of our application at this point:

We're rending the application template with the header and the footer.
Inside of the application template we are rendering our index route.

Although Ember knows that the index template should be rendered inside of the
application template, it doesn't know where in application template to render
it. Should it render it at the very top? the middle? the bottom?

We can use an `{{outlet}}` to tell Ember where to render nested templates.

Heading back to application.hbs, when I put `{{outlet}}` between the header and
the footer, I can see my list of albums again.

At this point we've divided the application layout markup, from what we're
calling the index page. This works, but what we're doing in the application
route is a little weird. Because we're loading a list of albums in the
application route we're saying that everywhere in our application we always need
to load the list of albums.

Because the index route doesn't have a model, it looks to its parent route (the
application route) for a model.

In the Ember inspector we can see that the model for the application route and
the index route is the same.

This behavior can be handy, but let's be more explicit and actually load the
list of albums when we visit the index route rather than loading them in the
application route.

This can easily be accomplished by renaming our application route to index.js,
since it does everything that we want our index route to do.

Now, looking at the Ember inspector I see that the application route doesn't
have a model, but the index route does. This is what we want.

Looking at our tests, we see that when we visit '/album/1' we expect render an
album template. Currently we’re just getting an error saying that we don’t have
a route that matches ‘/album/1’ in out application. If we look at our list of
routes in the Ember inspector, we can confirm that indeed, there is no route
with a URL that would match ‘/album/1’.

So let’s fix this error by making a change in our router.

Let's edit our map function call to include:

```
this.resource('album', {path: '/album/:album_id'});
```

this... resource... the name of the resource... album, and the path /album/:album_id

And then when we look back at our list of routes in the Ember inspector, we can
see that we have this new album route here. Also we’ve gotten past the routing
error in our tests.

If we just try visiting our URL now, we'll get an error from Ember saying that
it can't find an Album model. Behind the scenes Ember is trying to help us out
with some default behavior, by looking for a data model called Album. However,
we're still handling our behavior with fixture data. We need to create a
Route so that Ember knows what to do when people visit this URL.

In the routes directory, I'll create a route called 'album'. This needs to
import Ember of course, and we'll also want to import our fixture data again so
that we can lookup a specific album.  For now I'll give it an empty model hook.

```
import Ember from 'ember';
import albums from 'bumbox/models/album-fixtures';

export default Ember.Route.extend({
  model: function() {

  }
});
```

So in this model hook I have to tell Ember what data to return.

First remember that we have a params object coming into this function that has
our `album_id` on it.

```
export default Ember.Route.extend({
  model: function(params) {

  }
});
```

In this function we're going to use the findBy method that we saw earlier to
return the model that has the given `album_id`.

```
export default Ember.Route.extend({
  model: function(params) {
    return albums.findBy('id', params.album_id);
  }
});
```

Finally let's create the template for album. We'll make a file in
'app/templates/' called 'album.hbs'. To satisfy the test I'm just going to put a
div in there with class 'album-info'.

Now when I look at the Ember Inspector View Tree, I can see that I'm rendering
an album template, and that template is backed by a model representing the second album. And my tests for this step are passing.

Of course having users visit these URLs directly isn't very friendly. In the
next step we'll setup links so that users can go from the index page to the
album pages.

