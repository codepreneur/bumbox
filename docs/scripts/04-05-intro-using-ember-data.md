Pretty soon we're going to be asking a little more from our album models.
Specifically we want to model a one-to-many relationship where an album has many
songs and we'll want to create some additional properties and behaviors on these
models.

(diagram showing album-song relationship and "totalDuration" and "song count")


Our Development Server
----------------------

Now is a good time to say farewell to our fixture data and start loading our
albums from a server. Luckily, we already have a simple Node Express server
provided in ember-cli.

Let's explore the API in the Chrome console.

This is just a snippet to get '/api/albums' and print it nicely on the screen.

```
$.getJSON('/api/albums').then(function(json) {
  console.log(JSON.stringify(json, null, 2))
})
```

(lower-third to emphasize ULR)

When we do a GET request to '/api/albums' with the correct headers, we can see
that the server will return the same album data that we had nested under the
"albums" key in our fixture file.

Looking down a little further we can see that the server is also returning all
the songs that are associated with these albums.

(slide showing album 1 data and one of it's songs)

Each of these albums has a list of song IDs that belong to it. Likewise, each
song has a single album that it belongs to. Ember data can use these IDs to
maintain relationships between our models.

You may be used to JSON APIs where objects are embedded inside of each other
like this:

(slide showing songs embedded in album)

Ember can be configured to accommodate this type of data, but when possible you
should lean towards this other style, which is called "side-loading".

When you side load your data it isn't nested. Instead the JSON is in a flat
structure. This can eliminate duplicate objects that may be repeated in the
payload of a nested structure.

It also provides a clean way to pass any model data from the server that the client
will happily store, even if there  are no relationships between the models. This
behavior can save you multiple requests to your server.

Now let's see what happens when we ask the API for a single album using the URL
/api/albums/1.

```
$.getJSON('/api/albums/1').then(function(json) {
  console.log(JSON.stringify(json, null, 2))
})
```

(lower-third to emphasize ULR)

As you might expect, we get only the album that we asked for and all of its
associated songs.

If you want to see how this server is implemented you can take a look at the
`server` folder in our `ember-cli` app, but going over these specific
`ember-cli` features is beyond the scope of this course.

(lower-third showing-location to server folder)


Adapters and Serializers
------------------------

I'll also mention that in this example we've configured Ember to use the basic
RESTAdapter and the RESTSerializer that comes with Ember data. You can see how
we've configured the adapter in 'app/adapters/application.js' and you can see
the configuration for the serializer in 'app/serializers/application.js'.

Adapters tell Ember Data how to make requests to your server and Serializers
tell Ember Data how to turn server responses into models. These adapters and
serializers are very customizable, but luckily we have a simple API to deal with
so we don't need to anything custom here.


Anatomy of an Ember Data Model
------------------------------

An Ember Data Model is an object that represents a domain model in your
application. It's backed by persistent data. In Bumbox, we have two data models:
Album and Song.

Let's walk through an example of setting up a model. Let's say we want a user
model and we have this data that comes from our server:

```
{
  id: 5,
  name: 'Tomster',
  age: 78,
  preferredMember: true,
  posts: [1, 2, 3]
}
```

First, notice that all of the models that we're dealing with have a unique ID.
It's important that data models have a unique ID, because models represent
entities in our application that need to be identified on both the server
and the client even if their attributes change.

Also look at the array of numbers in posts. We're taking this to mean that
Tomster has three posts that he's written in his prolific career.

Let's see what an Ember Data model for this might look like:

```
// inside app/models/user

import DS from 'ember-data';
var attr = DS.attr,
    hasMany = DS.hasMany;

export default DS.Model.extend({
  name: attr('string'),
  age: attr('number'),
  preferedMember: attr('boolean'),
  posts: hasMany('post')
});

```

At the top of the file we're declaring all of our dependencies that we'll use.

Next notice, that we don't declare the ID property -- this is implicitly
included by Ember Data. An ID is always required.

Using the `attr` function we're declaring the properties of our model with a
given type. For instance, we expect name to be a 'string' and age to be a
'number'.  Ember data will use this information to coerce our data to the
correct type.

Finally we're using 'hasMany' to indicate that a user has many posts. We can't
really tell Ember Data that a user has a relationship to a 'post' and not have a
post model, so let's look at what the other side of this relationship could look
like:

```
// inside app/models/post

import DS from 'ember-data';
var attr = DS.attr,
    belongsTo = DS.belongsTo;

export default DS.Model.extend({
  name: attr('string'),
  body: attr('string'),
  user: belongsTo('user')
});

```

Again we declare our dependencies and attributes, but the interesting part of
this model is the `user` property which indicates that this model `belongsTo` a
user. By declaring the `hasMany` relationship on the user and the `belongsTo`
relationship on the post, we've given Ember data all the information it needs to
maintain the association.

Now that we've seen how to setup our data models let's look at how we can use
Ember Data in our Routes.


The Store
---------

When you are using ember data you will have an object called store that will
be available in your Routes and Controllers.

The store acts as your CRUD liaison between your client application and your
server. This means that when you want to

C - Create
R - Read
U - Update
D - Delete

... your models you should use the store. The store will manage the requests
to your server and act as a caching layer to avoid redundant requests.

For our purposes we want to use the store inside of our Route model hooks in
order to get access to our models. Let's take a look at how we can use the
store.

```
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    this.store.find('user', 1);
  }
});
```

Here we're looking at route that gets a user object. Inside of the model hook we
tell the store to find a user with an ID of 1.

```
GET /users/1
```

When that function is called, Ember Data makes a GET request to /users/1

Let's say that that request returns the user and a list of their posts. Again
notice that the posts ids are included in the user payload.

```
user: {
  id: 5,
  name: 'Tomster',
  age: 78,
  preferredMember: true,
  posts: [1, 2, 3]
},

posts: [
  {
    id: 1
    name: "Running on my Wheel",
    body: "Keeps me looking young",
    user: 5
  },

  ...
]
```

Now let's look at a template where we render these posts. Then we can ask for
the user's posts using this each helper, we won't make another request to the server:

```
Author: {{name}}

{{#each posts}}
  <h2>{{title}}</h2>
  <section>{{body}}</section>
{{/each}}
```

Here the model of the template is the user. In our `{{each}}` block helper we
can access our array of posts and render each one.

Now let's say we have a 'posts' index page where we want to see all of the posts
together. First we would need a route to get all of those posts.

```
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    this.store.find('post');
  }
});
```

Using find without an ID here will make a GET request to your server for posts.

```
GET /posts
```

... and that request will return an array of posts from the server.

You may wonder what happens when we have thousands of posts and we don't want to
return them all to the client. `find` can take additional arguments to help the
server limit the results:

```
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    this.store.find('post', {page: 2, per_page: 20});
  }
});
```

In this case we give find an object of additional parameters to pass to the
server. Here we're specifying the page and the number of posts per page.

This results in a get request with these parameters in a query string.

```
GET /posts?page=2&per_page=20
```

This additional information will give your server a chance to return only a
subset of the posts.

The store provides a lot more functionality that we won't cover in this course,
but you can learn more by digging through the Ember Data Store documentation:

    http://emberjs.com/api/data/classes/DS.Store.html


In This Step
------------

In this step you'll create two Ember Data models: 'Album' and 'Song'. Once you
create these, you can then modify your routes to use the store rather than the
fixture data to get your models.

Start by taking a look at the failing tests for this step and then begin
integrating Ember Data into Bumbox.
