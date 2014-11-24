Setting up Models
-----------------

Starting out I have two failing tests telling me that I don't have any models
defined for album and song. Let's start by defining those:

First I'll create the album model in app/models/album

We'll just require ember data (using the variable DS) and then export an empty
model object.

```
// in app/models/album.js
import DS from 'ember-data';

export default DS.Model.extend({
});
```

Next let's create the song model in app/models/song.js. Again we're just
exporting an empty model object for now.

```
// in app/models/song.js
import DS from 'ember-data';

export default DS.Model.extend({
});
```

Just doing that has my first test passing, since it's only checking that these
models exist.

Let's peak at what the next test is doing.

In this next test we're building up a payload of JSON data and pushing it into
the store with `pushPayload`. This simulates data returning from our server and
entering the store.  Once we get this data, we expect to be able to find the
album in store. This album should have some properties as well as a song.

This next set of errors I see are telling me that I'm missing the artwork, name,
explicit flag, and artist attributes on my model. If an attriubte isn't defined
on a Data Model then it won't be stored. So let's define our attributes.

```
// in app/models/album.js
import DS from 'ember-data';
var attr = DS.attr;

export default DS.Model.extend({
  artwork: attr('string'),
  name: attr('string'),
  artist: attr('string')
  isExplicit: attr('boolean'),
});
```

I'm pulling `attr` off into a variable at the top of the file here to
approximate importing this function as an es6 module. Going forward, we're
likely to see more consistent use of es6 modules in Ember and this should
help ease the transition if we ever want to update our code to make greater use
of es6 modules.

Inside of the model, I've declared 'artwork', 'name', and 'artist' as string
attributes. I've declared 'isExplicit' as a boolean attribute because it should
only be true or false.

The next error I see in my tests is that the album does not have a 'song' in
its 'songs' collection.

The album should have many songs so I'm going to use the `DS.hasMany` function
to declare it.

Again I'll pull out hasMany into a variable at the top of the file. And then
I'll add songs which is a hasMany relationship with song.

```
import DS from 'ember-data';
var attr = DS.attr,
    hasMany = DS.hasMany;

export default DS.Model.extend({
  artwork: attr('string'),
  name: attr('string'),
  artist: attr('string'),
  isExplicit: attr('boolean'),
  songs: hasMany('song')
});
```

Now that I've setup this side of the relationship, all of my test failures have
to do with attributes on the song model, so let's add those.

Editing the file at app/models/song I'll set the attr variable again at the top.

Then I'll add track as a number, name as a string, duration as a number, and URL
as a string.

```
import DS from 'ember-data';
var attr = DS.attr;

export default DS.Model.extend({
  track: attr('number'),
  name: attr('string'),
  duration: attr('number'),
  url: attr('string')
});
```

Now that we've added those attributes, we're pretty close. We just need to make
sure that the song has a reference to the album to complete our many-to-one
relationship. For that we'll use the `belongsTo` function.

First I'll make a belongsTo variable at the top of the file..  and then use that
function to define album, which is a belongsTo relationship with the album
model.

```
import DS from 'ember-data';
var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
  track: attr('number'),
  name: attr('string'),
  duration: attr('number'),
  url: attr('string'),
  album: belongsTo('album')
});
```

And now we have our first two tests for this step passing.


Refactoring the Album Route
---------------------------

The next tests say that our routes are not actually returning Ember Data Models.
Now that we're using ember-data, we need to update our routes to use the
`store`.

In 'routes/album.js' we'll replace our old array lookup with the store `find`
function.

```
import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('album', params.album_id);
  }
});
```

In this `model` function we're telling the store to find an album with the album
id from our params object. Now my tests for the album Route are passing.

And now that we've written this code, we can just go ahead and delete the whole
file.

When you look at our setup it's 'album' all the way down:

* resource: album
* route: album
* model name: album
* params id: album_id

This pattern of finding a model by id on a route is so common that it's the
default behavior of Ember.

When this file is gone... my tests are still passing.


Refactoring the Index Route
---------------------------

Let's turn our sights to the index route for our next failing test. It looks
like all we need to do is return real Data Models from our model hook.

```
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('album');
  }
});
```

I'll get rid of our fixtures from the imports because we don't need that anymore
and I'll use the `find` function with only a model type to get all of the
albums.

To really keep things tidy, I'm going to delete the fixture data file from the
application.

And with that we have all of the tests passing.

Now is a good time to run all of our tests up to this point to make sure that we
don't have any regressions.  I'll set my module selector to run all the tests up
to this step.


Looking at Network Requests
---------------------------

Since everything is green we should be ready to move on to the next step. Before
we do, let's look at how the running application has changed.

Now when I hit the index page I can see in the Chrome inspector that I'm
actually hitting an API and I can see the list of albums and songs that I'm
getting back.

If I click on a link, I can see that my application didn't need to make any
other network requests. This is because the data for 'album/1' was already
loaded when I visited the index page earlier.

If I visit this URL directly, then was see the request for 'album/1'. And I only
got the data that I need for this page from the server.

By adding Ember data we have a sophisticated caching layer in-place that gives
us the kind of quick response times we expect from a modern JavaScript
application.

