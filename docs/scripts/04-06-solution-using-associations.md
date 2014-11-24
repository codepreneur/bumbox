The first failing test I have is telling me that I'm not rendering the artwork,
album name, or artist name so I'll fill those in in the template.

Keep in mind that the model we're working with is an album.

```
<div class="album-info">
  <img src="{{artwork}}">
  <h1>{{name}}</h1>
  <h2>{{artist}}</h2>
</div>
```

And now the next test is telling me that we need to show all the track numbers, names,
and durations for each song.

First we need to render one of these tables rows for each song in the collection.

To do this I'll wrap the row with an `{{each}}` helper. For now I'm not going to
give it any arguments. Remember that when each has no arguments, it uses `this`
to loop over.

```
<table class="album-listing">
  {{#each}}
    <tr>
      <td class="song-track">
        <span class="track-number"><!-- track number --></span>
      </td>
      <td class="song-name"><!-- song name --></td>
      <td class="song-duration"><!-- song duration --></td>
    </tr>
    <!-- end repeat -->
    <tr>
      <td class="total-duration" colspan="3">Total Time: 40:03</td>
    </tr>
  {{/each}}
</table>
```

If I look at my tests at this point, I see an error pop up:

    >The value that #each loops over must be an Array

An album isn't an array. What we really want to do is loop over the songs in the
album.

Let's update our template to loop over the songs instead.

```
<table class="album-listing">
  {{#each songs}}
    <tr>
      <td class="song-track">
        <span class="track-number"><!-- track number --></span>
      </td>
      <td class="song-name"><!-- song name --></td>
      <td class="song-duration"><!-- song duration --></td>
    </tr>
    <!-- end repeat -->
    <tr>
      <td class="total-duration" colspan="3">Total Time: 40:03</td>
    </tr>
  {{/each}}
</table>
```

Ok, at this point we're back to failing assertions about the track numbers, song
names and durations.

Inside of this `{{each}}` block our model is a song, so we can just access those
properties using curly braces.

```
<table class="album-listing">
  {{#each songs}}
    <tr>
      <td class="song-track">
        <span class="track-number">{{track}}</span>
      </td>
      <td class="song-name">{{name}}</td>
      <td class="song-duration">{{duration}}</td>
    </tr>
  {{/each}}
  <tr>
    <td class="total-duration" colspan="3">Total Time: 40:03</td>
  </tr>
</table>
```

I'm just adding the track number, the name of a song, and the duration of a
song.

And with that, all of our tests are passing. Now when we click on an album in
the app, we finally get a page showing us the album details.

