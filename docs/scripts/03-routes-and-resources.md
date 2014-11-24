We're going to talk a little more about using resources and routes in an Ember
router.

Nested Resources
----------------

At this point we've implemented a single resource in our router

```
Router.map(function() {
  this.resource('album', {path: '/album/:album_id'});
});
```

For the design of Bumbox, we move between pages when the user clicks an album,
but as you continue on your Ember journey past this course, you'll likely come
across cases where you will want to use your router to render a resource inside
of another. A common use case for this is a master-detail view where clicking on
a link in the outer template changes the inner template.

(show old mater-detail mockup)

I'll use the completed Bumbox app to show you how this might work.

I've done a little styling work to get the albums to display along the left
here. But you can see that when I click on one of these albums we have the same
behavior from before we navigate to another page for the album.

When I click on an album, rather than going to a "new page" for the album
details we're going to render the album details in this space on the right.

These types of changes are surprising easy to do with Ember.

Remember that when we look at the list of albums we're on the 'index' page as we
can see here in the Ember Inspector. We never declared this resource in our
router because Ember generates index pages automatically.

To make this change first I'm going to declare this index resource explicitly in
the router.

```
Router.map(function() {
  this.resource('index', {path: '/'});
  this.resource('album', {path: '/album/:album_id'});
});
```

So at this point we've just filled in our router map with the default Ember
behavior.

To setup our new master-detail UI, I'm going to move the album resource inside
of the index resource:

```
Router.map(function() {
  this.resource('index', {path: '/'}, function() {
    this.resource('album', {path: '/album/:album_id'});
  });
});
```

You can see that the third argument to `resource` is a function used to nest
other resources or routes. This is saying, "instead of replacing the index
template with the album, render the album template inside of the index template"

Note that this nesting organization is all about the templates and routes in
your application. This nesting has nothing to do with the URLs that your
application users to get data from your server API.

The final piece of the puzzle here to to tell Ember where to render the album
template in the index template. Remember that we do that with {{outlet}}.

Now that I've added the outlet, when I click on one of these albums on the left
I get the details of that album on the right. You can also see how these nested
routes are setup by using the Ember Inspector. Notice that the album route is
now nested inside of the index route.

Because we're using routes to control this flow, we also get the benefit of URL
history and the ability to visit each album directly. So the back and forward
buttons will work to move between albums and if I share a URL with a friend I
can get to the correct page.

(diagram showing nested boxes for old design)

So before we had both index template inside of the application template. And
also rendering the album template inside the application template.

(diagram showing new nested boxes for master-detail)

And now we have the index template nested inside of application template and the
album template nested inside of the index template. To accomplish this we didn't
have to change our links or substantially change our markup. We just took our
router from a flat structure like this

```
Router.map(function() {
  this.resource('index', {path: '/'});
  this.resource('album', {path: '/album/:album_id'});
});
```

to a nested structure like this:

```
Router.map(function() {
  this.resource('index', {path: '/'}, function() {
    this.resource('album', {path: '/album/:album_id'});
  });
});
```

So let's walk through how Ember handles our album URL now:

(/album/1)

1. It renders the application template because that template is always rendered
2. It looks at the next part of the URL and sees that it matches the index
   resource.
3. It looks past the root slash and sees that '/album/1' matches a route nested
   inside of the index resource. This matching album template is rendered inside
   of the index template.

There is no limit to the amount of nesting you can do with your routes. It's up
to you to decide when you have too many templates and models on the screen.

(slides showing adding '/album/1/song/12/comments')

For instance, here is a router setup that handles nested albums, songs, and
comments.

```
Router.map(function() {
  this.resource('index', {path: '/'}, function() {
    this.resource('album', {path: '/album/:album_id'}, function() {
      this.resource('song', {path: '/song/:song_id'}, function() {
        this.resource('comments');
      });
    });
  });
});
```

There are a couple of things to learn from this code example. First notice that
the paths are concatenated together as we nest. So we don't need to keep
repeating the '/album' part of the path -- each path builds on its parents.

Secondly, you can see that we didn't need to provide a path to the comments
resource. By default Ember uses the name of the resource as the path if we don't
provide one.


Routes
------

Now that we've covered nesting resources, let's talk about using routes in your
router.

Album is a unique resource in Bumbox that exists on the client and on the
server. Besides these resources in our application, it's common to have verbs or
adjectives that describe different ways of looking at a resource.

So let's go back to our original code for Bumbox and say that we want an edit
page for an album like '/album/1/edit'. Let's see what happens when we use
another nested resource for this:

```
Router.map(function() {
  this.resource('album', {path: '/album/:album_id'}, function() {
    this.resource('edit');
  });
});
```

So I'm adding a nested resource called 'edit' here. I actually don't need to set
the path because remember by default Ember just uses the name of the resource.

Also note that we don't need to worry about making an new edit route file for
the edit resource because, by default nested routes will inherit their parent's
model. In this case edit route will inherit the album model from the album route.

Looking at our routes in the Ember inspector I can see that inside of the
'album' route I have both an 'edit' route and an 'index' route. The 'index'
route is generated automatically and will be the active route when users visit
'/album/1'.

To flesh out this example, I'm going make some changes to our templates.

First, album.hbs is going to become an empty template with an `{{outlet}}`. It's
just going to be responsible for rendering album index and album edit inside of
itself.

All of the markup that was in album.hbs is going into /album/index.hbs. So I'm
creating an album directory inside of templates and in that directory I'll
create this new index.hbs template. This template will render when we visit the
URL '/album/1'.

The one addition I'll make in this template is to add link so that we can get to
the edit template.

```
<p>{{#link-to 'edit' this}}Edit this album{{/link-to}}</p>
<br/>
```

Now let's make the template for the '/album/1/edit' URL. Logically, this
template would go into the album template folder as well.

```
// in app/templates/edit.hbs

<p>{{#link-to 'album' this}}Back to this album{{/link-to}}</p>
<br/>

<h2>Edit this album</h2>

<p>
  {{input type="text" value=name}}
</p>

```

This is just a really simple template that starts with a link to get back to the
main album page and also includes an input that is bound to the name of the
album.

So let's see what we've got in our running application. When I click on an album
I get our new album/index page. But when we try to edit that album, the
album/edit page isn't rendered. Why is this happening?

The answer has to do with a key property of 'resources'.

When we use a nested resource we're "resetting" the namespace in our route
hierarchy. This route is actually looking for an 'edit' template in the
top-level namespace. If I move my edit template out of the album folder, and
into the top-level of the template directory...

(moving template)

Then we can see that the page renders just fine.

However, you can see that 'Edit' is a little out of place here. For instance, if
we later want to edit a song, you can see that we've already used up our edit
template.

To fix this issue we're going to change the 'edit' resource to a route.

```
Router.map(function() {
  this.resource('album', {path: '/album/:album_id'}, function() {
    this.route('edit');
  });
});
```

Now I can put my template in a place that makes more sense: back inside of the
album folder:

(move edit back into album folder)

And when I refer to the route name in my link to the edit page, I need to
use the album namespace.

```
<p>{{#link-to 'album.edit' this}}Edit this album{{/link-to}}</p>
<br/>
```

Now when I visit '/album/1/edit', I can use this text field to change the name
of the album and I can switch back to the album template.

Why do resources do this?
-------------------------

You might be wondering why using resources "resets" their namespace like this.

Usually you don't want to worry about how your URLs are structured when looking
up resources. So if we have links for songs we want to be able to just link to
a song using:

```
{{#link-to 'song' song}}Song{{/link-to}}
```

and not have to worry that songs might be nested under other resources.

Having a URL like

```
/user/1/album/12/song/3
```

Provides a lot of useful information to our application. It means that first we
need to load user model, then we need the album, and then we can load the song
model. It also tells our templates how to render:

```
-> User template
  -> Album template
    -> Song template
```

A page like this could show the user's name at the top, some album information,
and then the details about a song.

But we don't want to have to worry about this nesting when creating links.

```
{{#link-to 'user.album.song' song}}Song{{/link-to}}
```

```
{{#link-to 'song' song}}Song{{/link-to}}
```

Because we can just refer to 'song' in our links we can easily refactor the way
our data is loaded and our templates are rendered. This reseting behavior is
what made it so easy for us to change our UI from using separate "pages" for the
album list and the album details to nesting the album details inside of the
album list.

There might be times where you do want to nest resources and refer to them in a
different namespace.

Let's say that we have a comments resource for albums and
a comments resource for songs:

```
Router.map(function() {
  this.resource('album', {path: '/album/:album_id'}, function() {
    this.resource('comments');
  });

  this.resource('song', {path: '/song/:song_id'}, function() {
    this.resource('comments');
  });
});
```

We have a naming collision here because we can't have two different
CommentsRoutes with the same name. In this case you can explicitly namespace
these resources yourself:

```
Router.map(function() {
  this.resource('album', {path: '/album/:album_id'}, function() {
    this.resource('album.comments');
  });

  this.resource('song', {path: '/song/:song_id'}, function() {
    this.resource('song.comments');
  });
});
```

When you setup your routes this way you'll use the namespaced route name in your
link-to helpers:

```
{{#link-to 'album.comments'}}See the album comments{{/link-to}}
{{#link-to 'song.comments'}}See the song comments{{/link-to}}
```

And you'll put your route files in directories that reflect this namespace:

```
/app
  /routes
    /album
      comments.js
    /song
      comments.js
```

Relax
-----

At this point you might be feeling a little overwhelmed by routing. I know I am
after putting this screencast together. The good news is you usually don't need
to be thinking about all these technical nuances when you're building an app.

Just keep these two concepts in mind:

1. Think about 'resources' as the nouns in your application and think of
   'routes' as refinements like 'edit', 'approve', 'new', or 'favorited'

2. Use nesting in your router to create nested URLs that reflect the UI that a
   user should see when using the app.

With a little experience, setting up your routes will feel natural and will
probably help you conceptualize and understand your application better.

