So let's go into our index template. We're going to replace this anchor tag
with Ember's `{{link-to}}` helper.

So the first argument here is the name of the route that we're using, in this
case 'album'. The next argument is the model. When we're inside of this
`{{each}}` block, the model is the current context: `this`.

Now that we've added this link, users can navigate from the index page to the
album pages. Of course we don't have any visible markup on the album pages, but
we'll fix that soon.

And now all of our tests are passing for this step.
