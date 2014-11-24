So the first step is to look at our tests.

Again, two of our assertions are failing. This make sense because we're
not rendering the explicit warning for these last two albums.

I'm going to steal the markup needed here from the comments in test 2... and
I'll just paste that in the template. Now when we look back at the app we can
see that all of our albums are getting that markup and all have an EXPLICIT warning.

Finally I'll wrap this span in an if helper `{{#if}}` to only show this content
when the album is explicit.

```
{{#if isExplicit}}
  <span class='explicit'>EXPLICIT</span>
{{/if}}
```

And all of our tests are passing. Looking back at the home page I can see that
everything looks right and only the last two albums have the EXPLICIT warning.
