Intro
-----

To get started with this course there are few things you should know about
to have a good experience:

1. Using Git for source control
1. Running the application with ember-cli
1. Writing code with ES6 modules
1. Running the tests for the application

Git
---

The code for this online course is provided in a git repository. If you're
unfamiliar with git, that's okay, there are just a few simple commands that can
help as you work through the course.

First make sure you have git installed by typing `git` at the command line. If you see
the usage information for git like this, then you have it installed.

If you need to install git, one popular way on OS X is to use homebrew and
type:

    brew install git

Otherwise you can visit the git website and follow the instructions there.

As you're working through the sections in this course you can commit your work
using:

   git add . # add all of your new files to get
   git commit -a # commit all of your changes

Also if you get stuck or just want to see the solution for a section, you can
look at the completed code at each step by using the command:

   git checkout step-02 # Or whatever step you want to look at

In order to checkout a specific step while working you may need to stash your
changes and then apply them later when you're ready to start working again:

   git stash # stash and save your changes
   git checkout step-02 # Look at code solution
   git checkout master # Go back to your working branch
   git stash pop # apply your stashed changes back

It may also be helpful to use a tool with a GUI like gitx, hub, or source tree
to look through changes. I like using the rowanj fork of gitx.


Bumbox
------

Throughout this course we'll be working on an application called Bumbox. Bumbox
let's you navigate through albums and play music online. On the first page you
pick the album you want to listen to.  Then you can see all of the songs that
are in the album. From there you can play one of the songs. After that you can
navigate through the application while the song continues to play and
eventually choose another song to play.

This application will touch on all of the major concepts you'll need to learn
when getting started with Ember. But when we're done with the application, you
might be surprised at how little code was required to build this app.


ember-cli
---------

Ember applications can be developed very simply by just including the Ember
library in a web page and writing your templates in a single page of markup.
However, to build and deploy any non-trivial application it's nice to be able
to split our code into different files for organization.

Ember-cli is a full-featured build tool for front-end development that we'll be
using in this course.

The most important directory for you to know about is `/app`. This is where all
of your application code will live. Each folder inside represents a different
type of file for your Ember application. As we work through the course, we'll be
covering what goes in these folders.

For now all you need to know is how to run your application and continuously
build it while you're developing. Just run:

    ember serve

Inside of the project directory and now you can visit your app at
http://localhost:4200. To stop the server you can press control-c.


ES6 modules
-----------

ember-cli uses ES6 modules to help us organize and require javascript
modules in different files. Here is the syntax you'll need to know when
using libraries or other modules in new file:

    import Ember from 'ember';
    import Song from 'bumbox/models/song';

You can require libraries like Ember using their namespace or you can require
your own code by referring to their location under our 'bumbox' namespace.

Just as we need to import files to use them, we need to export objects and
functions in our files to make them available elsewhere.

    export default Ember.ObjectController.extend({});

The only type of export you'll need to do in this course is exporting objects
as default.  The ES6 modules have more features than this, but this is
all you'll need to know to get started.


Running the Tests
-----------------

Our Bumbox app comes with a test suite to help guide you through your
development in the course.  You can run the test by starting up the app:

  ember serve

And then visiting http://localhost:4200/tests

There are a few features in the header of the QUnit test runner that will help
us.

First, take a look at this select control labled "Up to step". This is a QUnit
configuration custom-made for this course. When you first get started you'll
have a lot of failing tests because you haven't implemented anything yet. You
can set this field to a specific step in the course and run all the tests up to
that point.

So let's say I'm on step 3, I can set this to step 3 and see the tests for
steps 1, 2, and 3.

The "Module" select control is also useful to scope the tests that you're running. In this
case you can pick a specific module and only run those tests.

A few other options that I use a lot are "No try-catch" and "Hide container".

If you're getting an error in a test, QUnit will show you a stack trace in the
test runner to let you know where the error occurred.  However, I usually find
it more useful to let the Chrome debugger get a hold of the error. If you
check the "No try-catch" option QUnit will not catch these kind of errors.

Now I can look through code quickly by clicking on parts of the stack trace and I can
set breakpoints if needed. I can also let Chrome catch this unhanded exception so I can
look around with the debugger.

Finally, although it's cool to see your application in this little container
down here the novelty will quickly wear off and it often gets in the way. If
you check the "Hide Container" option you can hide it while your tests are
running.


Outro
-----

That should be all you need to get started with the course. Make sure you have the app
running on your computer with `ember serve` and let's start learning about templating
in Ember.
