So let's walk through the changes that are needed to complete step one.

The only file that we need to edit here is our application template.

First I'll delete all of these albums in the template except for the first one.

Looking back at my browser, I can see that now I only have one... really big album.

---

Next I'm going to wrap the album markup that should repeat in the `{{#each}}`
block helper.

Looking back at the browser again, I can see that I'm rendering the album markup 4
times. Once for each object in my albums array.

---

Now I just need to add the album attributes to this static album markup.

So in the album markup I'll replace:

* and the image src url with `{{artwork}}`
* `Album Name` with `{{name}}`
* `Artist Name` with `{{artist}}`

In the browser we can see that we now have a dynamic list of albums. Let's take
a look at the tests.. and look, step 1 is passing.

---

From our perspective, we're just looping over an array in our template and
rendering simple attributes into the DOM, but what's happening here is really
powerful. Ember is doing all the heavy lifting here to create a dynamic list of
albums for us that always stays up-to-date with our data.

For instance, if I go into the Ember inspector and get access to our data by
clicking the `$E` next to our model, I can remove an item from the model using
`popObject()` and the DOM is instantly updated. I can also add another album
with `pushObject()`

```
  E$.pushObject({name: 'The Bound Arrays'})
```

And the new album instantly shows up on the page. Note that the each helper
will only work this way if you use Ember's binding-aware enumerable functions
like `pushObject()` and `popObject()`.  Using JavaScript's `push()` and `pop()`
won't work.

(show screenshot of enumerable documentation:
http://emberjs.com/api/classes/Ember.MutableArray.html)

You can read through API documentation for Ember MutableArray and see a list of
functions available on Ember arrays.
