import Ember from 'ember';

function formatDuration(duration) {
  var minutes = Math.floor(duration / 60),
      seconds = duration % 60,
      formattedSeconds = (seconds < 10) ? "0" + seconds : seconds;

  return minutes + ":" + formattedSeconds;
}

export default Ember.Handlebars.makeBoundHelper(formatDuration);

