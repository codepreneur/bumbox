Now that we have our route setup to see individual albums, we're going to
create links on the index page so that users can click on an album and see the
details about that album.

Ember has a `{{link-to}}` helper to help us dynamically create URLs.

Before we talked about how a URL becomes a model in your application.

1. Let's say you have a URL like 'photo/cat'
2. The router looks through the available paths and finds one that matches that
	 URL.
3. Then we get the associated route and the model hook gets params data based on
	 the dynamic segment of the URL.
4. Finally we use the model hook to find a model inside of our route.

`{{link-to}}` helps us do the reverse of this process -- take a model in our
templates and turn it into a URL.

1. Given a model with data that looks like this
2. We can give that model to the link-to helper along with the name of the route
3. Ember can match our route name to path
4. And replace the photo_id in the path with the unique ID of the model: 'cat'

As you can tell from pound # `{{link-to}}` is another block helper.

So again, we can give it the route name ('photo') and the model as arguments.
Then inside of the block we give provide the content that goes inside of the
anchor tag.

So given a link-to setup like this...

```
{{#link-to 'photo' model}}Grumpy Cat{{/link-to}}
```

We'll end up with markup that looks like this.

```
<a href='/photo/cat'>Grumpy Cat</a>
```

Before you get started, I want to give you one quick pointer about using each to
help you with this step:

You'll need to get access to each model in your loop in when editing
index.hbs. When we're inside of our each block we can get access to the current
model by using this. So to go back to the cat photo example:

(slide showing change from model to this)

If we are inside of an each block, instead using using model here, we can use
this.

Looking at our tests for this step, we have one assertion that's already passing
since we have all of the album links hardcoded to '/album/1'.

Try adding links to the index page so that when a user clicks on an album image, they
are taken to the page for that album.

