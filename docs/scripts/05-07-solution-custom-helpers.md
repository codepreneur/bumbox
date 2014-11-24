Looking at our tests, I can see that we're missing our `format-duration` helper
so I'll start by defining that in `app/helpers/format-duration.js`.

```
import Ember from 'ember';

export function formatDuration() {
}

export default Ember.Handlebars.makeBoundHelper(formatDuration);
```

First I'm importing ember. Then I'm making a function called formatDuration
that can be used to translate seconds into our desired format. Finally I'm
exporting the helper, which is our `formatDuration` function wrapped by
`makeBoundHelper`.

Now when I look at my tests, I see that the next step is to handle the different
cases for converting seconds to the new format.

I'm going copy the algorithm directions from the test into my helper so that I
can follow along.

1. First I'll add `duration` as the incoming argument.
2. Next I'll get the minutes by dividing the seconds by 60 and flooring the
   result.
3. Then I'll use the remainder operator to get seconds component of our
   formatted duration.
4. I also need to make a formattedSeconds variable, which is seconds with a
   leading zero if they're less than 10.
5. Finally I'll return the minutes and seconds with a colon between them.

I'm also going to delete the comments before I move on.

```
export function formatDuration(duration) {
  // 1. Divide the number of seconds by 60, and floor the result using Math.floor().
  //    This is the number of whole minutes.
  // 2. Get the remaining number of seconds by using the remainder (`%`) operator.
  // 3. If the remainder is less than 10, construct the formatted seconds by
  //    prepending a "0" to it. Otherwise, the formatted seconds is just the
  //    remainder.
  // 4. The formatted string is the number of minutes, followed by a ":", followed
  //    by the formatted seconds.
  // 5. Return the formatted string.

  var minutes = Math.floor(duration / 60),
      seconds = duration % 60,
      formattedSeconds = (seconds < 10) ? "0" + seconds : seconds;

  return minutes + ":" + formattedSeconds;
}

export default Ember.Handlebars.makeBoundHelper(formatDuration);
```

Looking back at my tests again I can see that the formatting is working
correctly.  I just need to update the album template to actually use the helper.

This is the easy part. In the album template I'll just use the `format-duration`
helper in front of the song duration property.

```
<td class="song-duration">{{format-duration duration}}</td>
```

Now all of my tests are passing. And if we look at the first album in the app we
see that the song durations are formated in a nicer way.
