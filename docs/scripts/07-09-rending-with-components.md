So far we only have very simple interactivity in our application. We've used the
`link-to` helper to let users click on an album and see the details of that
album. The `link-to` helper is great for moving between routes, but what if we
want more interactivity in our application besides navigation.

In the coming steps, we're going to implement a feature that let's us click on a
play button for an individual song and hear the audio playing back.

Up to this point our templates are mostly pulling data from the models that
they're given. We're going to learn how to flip this and push information for
our templates into the rest of our application.

```
{{#each}}
  {{input type="text" value=title}}
  <button {{action 'save' this}}>▶</button>
{{/each}}
```

In this example we're lopping over a list of models, giving the user a chance to
change the title of the model and then letting them click on a button to save an
individual model.

Inside of the markup we're using the `action` helper to send an action called
save along with `this`, the current model. Notice that 'save' is wrapped in
quotes. That's because save is just the name of an action that we want to send,
it's not a property on our current model.

When a user click on this span, the template will send the 'save' action with
the song.

But who is listening for this action?

The first type of object thats listening in this case is the controller.

`route -> model -> template`

So far we've only talked about routes, models, and templates, but really there
is one more piece of architecture that's been quietly sitting in this chain:
controllers.

`route -> controller(model) -> template`

Let's take a look at the album page in our current Bumbox app. Looking at the
Routes view we can see that the album Route has a controller associated with it
called 'AlbumController'.

Where does this controller come from? If we click on the controller here, the
Ember Inspector let's us know that this is a "generated" controller. Often we
don't needs any special behavior on our controllers, so Ember will generate them
for us automatically. This is similar to the way we saw Ember automatically
generate our album route.

Controllers wrap and decorate our models to give them functionality that is
specific to how they are displayed and interacted with in a certain place in our
application.

For instance let's say that we have a template for a post model and we want to
switch between an editing mode and a display only mode. We only have a few
things that need to change when we're editing so we don't want to render a
brand new template.

```
{{input type="checkbox" value=isEditing}}

<div class="title">
  {{#if isEditing}}
    {{input type="text" value=title}}
  {{else}}
    {{title}}
  {{/if}}
</div>

<div class="body">
  {{#if isEditing}}
    {{textarea value=body}}
  {{else}}
    {{body}}
  {{/if}}
</div>
```

Changing the `isEditing` value on the model might seem like an okay thing to do at
first glance. After all, it makes sense to say "we are now editing this post
model". But editing really only makes sense in the context of the template that
we're looking at. There is no concept of editing in our data, and the model
should represent domain data, not information about a particular view in our
application. If we later find ourself in a different context where we need to
use an `isEditing` property again, this information will bleed into this new
context.

Luckily, doing the right thing with Ember in this case is easy.

When we have a single model like a post, we're using an `ObjectController`.

An ObjectController acts as a proxy between the template and the model. If we try to
set the `isEditing` property on the controller, it first looks to see if it has
its own `isEditing` property. If it does, then it will use that, otherwise it
will try to set that property on the model.

So let's create our own controller instead of using the default generated
controller.

```
// in app/controllers/album.js

import Ember from 'ember';

export default Ember.ObjectController.extend({

});
```

The beginning of this file should look pretty familiar. We're importing Ember
and then extending a specific Ember Object. In this case we're extending an
`ObjectController` -- a controller that wraps a single model.

```
// in app/controllers/album.js

import Ember from 'ember';

export default Ember.ObjectController.extend({
  isEditing: false
});
```

If we define an `isEditing` property and set it to false, the template will no
longer get and set the `isEditing` property on the model, it will set it on the
controller. If we decided that this controller should start out in editing mode,
we could change our controller to:

```
// in app/controllers/album.js

import Ember from 'ember';

export default Ember.ObjectController.extend({
  isEditing: true
});
```

Now lets look at another type of controller: an `ArrayController`.

Our Index page is an example of an `ArrayController`. The model for this template
is actually a list of songs, not just a single model.

Let's say that we want to hide the explicit albums in this view.

```
<label>
  {{text type="checkbox" value=showSafeOnly}}
  Only show safe albums
</label>
```

In this case we don't have to worry about this property being proxied to the
model that it wraps, but it's nice to be explicit about what properties this
controller has and what their defaults are. Let's define an index controller.

```
//in app/controllers/index.js

export default Ember.ArrayController.extend({
  showSafeOnly: false
})
```

Now we can use this property in the index controller to return a computed
property that gives us the filtered list of albums.

```
//in app/controllers/index.js

export default Ember.ArrayController.extend({
  showSafeOnly: true,

  filteredAlbums: function() {
    if (this.get('showSafeOnly')) {
      return this.filterBy('isExplicit', false)
    } else {
      return this;
    }
  }.property('@each.isExplicit', 'showSafeOnly')
})
```

We've created a computed property that only returns non-explicit albums when
'showSafeOnly' is on and otherwise returns all the albums.

Our property needs to watch the array of models and their explicit flags as well
as the `showSafeOnly` property on the controller.

Now if we modify our each in the index template to use this new computed
property, we can selectively show and hide explicit albums.

```
...
<div class="album-list">
  {{#each filteredAlbums}}
    <div class="album">
...
```

Now that we've seen how controllers can be used to present properties to our
templates, let's look at how they can help use handle user interaction.

Back to our example of sending a save action.

```
{{#each}}
  {{input type="text" value=title}}
  <button {{action 'save' this}}>▶</button>
{{/each}}
```

When a user clicks on the save button, the save action is fired with the
current model (`this`) as an argument.

The controller is our first chance to handle this action. In this case we have a
controller called 'posts' that wraps the posts models in this template.

```
// in app/controllers/posts.js

export default Ember.ArrayController.extend({
  actions: {
    save: function(post) {
      post.save();
    }
  }
});
```

We can handle actions by putting a function inside of the `actions` object in the
controller. Here we're using the save method that we get from Ember Data to save
our post.

Now what if we have many places in the application where we want to be able to
handle an action? Let's say that we have a logout button that exists in several
places in the application. Putting this action in many controllers wouldn't be
fun.

After actions go through their immediate controller they take a ride through all
of the routes in their hierarchy.

So let's say that we trigger a save action when we're looking at an individual
post in the post template.

So if we don't handle the save action in our post controller, then the Post
Route gets a chance handle it, and the Posts Route gets and chance,
and finally the Application Route gets to weigh in. Keep in mind that these
actions flow through the controller and then up through the route hierarchy, they
don't bubble through the controllers.

```
Router.map(function() {
  this.resource('posts', function() {
    this.resource('post')
  });
});

//'save' => PostsController => PostRoute => PostsRoute => ApplicationRoute
```

We can even choose to handle the 'save' action in our Post controller and let
the action continue on its journey by returning true.

```
//in app/controllers/posts/post.js

export default Ember.ObjectController.extend({
  actions: {
    save: function() {
      this.get('model').save();
      return true;
    }
  }
});
```

In this step you're going to add a play button to the songs in the album, fire
a 'play' action from your template when the user clicks on it, and finally
handle this action with a blank handler in an album controller.

There is a snippet of markup at the top of the test file that you can use to get
started.

```
  {{input type="text" value=title}}
  {{textarea value=body}}
  <button {{action 'save' this}}>▶</button>
{{/each}}
```

Take a look at the failing tests for this step and get started.

