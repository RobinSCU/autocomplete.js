'use strict';

var zepto = require('npm-zepto');

// setup DOM element
var DOM = require('../common/dom.js');
DOM.element = zepto;

// setup utils functions
var _ = require('../common/utils.js');
_.isArray = zepto.isArray;
_.isFunction = zepto.isFunction;
_.isObject = zepto.isPlainObject;
_.bind = zepto.proxy;
_.each = function(collection, cb) {
  // stupid argument order for jQuery.each
  zepto.each(collection, reverseArgs);
  function reverseArgs(index, value) {
    return cb(value, index);
  }
};
_.map = zepto.map;
_.mixin = zepto.extend;

var Typeahead = require('../autocomplete/typeahead.js');
var EventBus = require('../autocomplete/event_bus.js');

function autocomplete(selector, options, datasets) {
  datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 2);
  var $input = zepto(selector);
  var eventBus = new EventBus({el: $input});
  var typeahead = new Typeahead({
    input: $input,
    eventBus: eventBus,
    hint: options.hint === undefined ? true : !!options.hint,
    minLength: options.minLength,
    autoselect: options.autoselect,
    openOnFocus: options.openOnFocus,
    templates: options.templates,
    debug: options.debug,
    datasets: datasets
  });

  var methods = {
    open: function open() {
      typeahead.open();
    },
    close: function close() {
      typeahead.close();
    },
    getVal: function getVal() {
      return typeahead.getVal();
    },
    setVal: function setVal(val) {
      return typeahead.setVal(val);
    },
    destroy: function destroy() {
      typeahead.destroy();
    },
    typeahead: typeahead
  };

  for (var k in methods) {
    if (methods.hasOwnProperty(k)) {
      typeahead.input.$input[k] = methods[k];
    }
  }

  return typeahead.input.$input;
}

autocomplete.sources = Typeahead.sources;

module.exports = autocomplete;
