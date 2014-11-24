Total Duration
-------------

As always we'll start by looking at our failing tests for this step.

The first failing test is telling me that the `totalDuration` property of album
is undefined. This makes sense since we haven't created this property yet.

Inside of the album model, we'll make a property called `totalDuration`.

```
totalDuration: function() {
  var total = 0;
  this.get('songs').forEach(function(song) {
    total += song.get('duration');
  });
  return total;
}.property('songs.@each.duration')
```

* First I'll set a `total` variable that starts at zero.
* Next I'll get the array of songs and for each one add onto the total variable
* Then I'll return that total.
* Inside of the property I'm going to use the `each` syntax to watch the
  duration on each song.

And looking at our tests, everything passes.

Before we move on, I'd like to do a minor refactor and take advantage of the
Enumerable reduce function.

```
totalDuration: function() {
  return this.get('songs').reduce(function(total, song) {
    return total + song.get('duration');
  }, 0)
}.property('songs.@each.duration')
```

* In this case we won't need a local variable and we'll return the result of our
reduce function.
* The function that we pass to reduce takes our running total and a single song.
* Inside of this function we return the total plus the current song's duration.
* Finally we pass the initial value for the reduce function.

And we can see that our tests are still passing.

Now to take it one step further, I want to show you how we can do this with a
computed macros.

```
songDurations: computed.mapBy('songs', 'duration')
totalDuration: computed.sum('songDurations')
```

We can use the computed `sum` macro to add up an array of items, but first we
need to get all of the song durations together so that we can add them together.

So first I'll make a `songDurations` property and use `mapBy` to make an array
of all the song durations.

Then I'll use computed `sum` to add them together. And my tests are still
passing. You can always get by using computed properties built with functions
but I find solving these problems with computed macros really fun and
expressive.

To make the last test pass, let's plug the total duration into our Album
template:

```
<td class="total-duration" colspan="3">Total Time: {{format-duration totalDuration}}</td>
```

Don't forget to use the format-duration helper to get our duration in the
correct format.

Song Count
----------

Now let's make these `songCount` tests pass.

Back in the album model we'll add a property called `songCount`,

```
songCount: function() {
  return this.get('songs.length');
}.property('songs.length')
```

This computed property will return the length of the songs array, and to make
sure it stays up-to-date well give it `songs.length` as the dependent key.

Now all my tests are passing, but you can probably guess that I want to use
another computed macro to count the songs.

When we have a computed property that just delegates to another object like this
we can use computed `alias`.

I really like how this model looks with these computed macros. We were able to
do some pretty sophisticated state management with just three lines of code.
