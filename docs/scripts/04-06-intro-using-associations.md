Earlier we used Ember Data to setup a many-to-one relationship between albums
and songs. This association means that an album has many songs while a song
belongs to an album.

Once you've established this connection you can use `get` in a JavaScript file
to get an array of comments from a post or to get the parent post from a
comment.

```
// In a JavaScript file:

post.get('comments') //=> returning an array of comments
comment.get('post') //=> returning a single post model
```

Inside of a template where the model is a post we have access to the comments
array.

```
// In a template with post as the model

You have {{comments.length}} comments.

{{#each comments}}
  {{body}}
{{/each}}
```

And if we have a template where the model is a comment, we can get access to
that comment's post.

```
// In a template with a comment as the model

This is a comment for {{post.title}}
```

Let's use this association between albums and songs to render an album template
on this blank album page. Right now we just have a blank page, but when we're
finished, this page will show some details about the album and a list of the
songs in that album.

There's markup in the comment header of the test for this step that will help
you get started.  You should just copy this markup and paste it into the album
template so that you have some place to start.

Now when we look at an album page in the app we have static markup for this
page that looks a little broken.

In this step you'll use your knowledge of templating to fill in the album
information and loop over the songs filling in track number, song name, and
duration of each.

Take a look at the failing tests for this step and give it a try.

