import DS from 'ember-data';
import Ember from 'ember';

var attr = DS.attr,
    hasMany = DS.hasMany,
    computed = Ember.computed;

export default DS.Model.extend({
  artwork: attr('string'),
  name: attr('string'),
  artist: attr('string'),
  isExplicit: attr('boolean'),
  songs: hasMany('song'),

  songDurations: computed.mapBy('songs', 'duration'),
  totalDuration: computed.sum('songDurations'),
  songCount: computed.alias('songs.length')
});
