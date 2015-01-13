import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',
  classNameBindings: ['isCurrentSong'],

  song: null,

  player: inject.service(),

  actions: {
    play: function() {
      this.get('player').play(this.get('song'));
    },

    pause: function() {
      this.get('player').pause();
    }
  },

  isCurrentSong: function() {
    return this.get('player.song') === this.get('song');
  }.property('player.song', 'song'),

  isPlaying: function() {
    return this.get('isCurrentSong') && this.get('player.isPlaying');
  }.property('isCurrentSong', 'player.isPlaying')
});
