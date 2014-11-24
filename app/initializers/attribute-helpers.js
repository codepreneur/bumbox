// Helpers from ember-better-attributes

import Ember from 'ember';

var normalizePath       = Ember.Handlebars.normalizePath,
    handlebarsGet       = Ember.Handlebars.get,
    schedule            = Ember.run.once,
    typeOf              = Ember.typeOf,
    classStringForValue = Ember.View._classStringForValue;

function assertValidAttribute(value) {
  var type = typeOf(value);
  Ember.assert("Attributes must be numbers, strings or booleans, not " + value + " (" + type + ")", value === null || value === undefined || type === 'number' || type === 'string' || type === 'boolean');
}

Ember.Handlebars.registerHelper('bind-class', function(path, options) {
  var normalized = normalizePath(this, path, options),
      root = normalized.root,
      id = options.data.scopedId,
      view = options.data.view,
      truthy = options.hash.truthy,
      falsy = options.hash.falsy;

  Ember.assert("If you pass `this` as the path to `bind-class`, you must specify class names to use for truthy and falsy values using the `truthy=` and `falsy=` hash parameter", path !== '' || (truthy && falsy));

  path = normalized.path;

  var value = (path === 'this') ? root : handlebarsGet(root, path, options);
  var classString = classStringForValue(path, value, truthy, falsy);

  function updateClass() {
    var newValue = handlebarsGet(root, path, options),
        elem = Ember.$('#' + id);

    if (classString) {
      elem.removeClass(classString);
    }

    classString = classStringForValue(path, newValue, truthy, falsy);
    elem.addClass(classString);
  }

  if (path !== 'this') {
    view.registerObserver(root, path, function() {
      schedule('render', updateClass);
    });
  }

  options.data.buffer.push(classString);
});

Ember.Handlebars.registerHelper('id', function(id, options) {
  if (arguments.length === 1) {
    options = id;
    id = "ember-" + (Ember.uuid());
    options.data.buffer.push('id="' + id + '" ');
  }

  options.data.scopedId = id;

  options.fn(this);

  delete options.data.generatedId;
});

Ember.Handlebars.registerHelper('bind-attribute', function(name, path, options) {
  function fullValue(value) {
    if (!prefix && !suffix) { return value; }

    var out = "";
    if (prefix) { out += prefix; }
    out += value;
    if (suffix) { out += suffix; }
    return out;
  }

  var normalized = normalizePath(this, path, options.data),
      root = normalized.root,
      id = options.data.scopedId,
      prefix = options.hash.prefix,
      suffix = options.hash.suffix,
      view = options.data.view;

  path = normalized.path;


  var value = (path === 'this') ? root : handlebarsGet(root, path, options);
  assertValidAttribute(value);

  function updateAttribute() {
    var newValue = handlebarsGet(root, path, options);
    assertValidAttribute(newValue);

    var elem = Ember.$('#' + id);
    Ember.View.applyAttributeBindings(elem, name, fullValue(newValue));
  }

  if (path !== 'this') {
    view.registerObserver(root, path, function() {
      schedule('render', updateAttribute);
    });
  }

  return fullValue(value);
});

export default {
  name: 'attribute-helpers',
  initialize: function() {}
};
