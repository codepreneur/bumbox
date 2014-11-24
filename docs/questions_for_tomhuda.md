Other frameworks work with POJOs but Ember uses Ember Objects. What are the
tradeoffs of having Ember.Object? Is it still a decision you stand by? How will
Ember Object change over time as JavaScript and browsers evolve?

In the custom helpers step we created a duration helper rather than a duration
computed property on a model. What are the right use cases for helpers vs
computed properties. Would it even make sense to use a component?

Something about what to pass into components. Are components big or small?

Components are isolated but they do have the ability to talk to views around
them with targetObject and parentView. Should components not use these methods?
How would you recreate a `<select>` component with `<options>`?

How important is it to bring other testing frameworks like Mocha and Jasmine on
board?

Talk about event delegation. What does it buy us?
