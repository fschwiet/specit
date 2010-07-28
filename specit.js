(function() {
  function checkExpectation(that, expectation, args) {
    var args = $.makeArray(args),
        matcherAndArgs = [args.shift()];
    $.each(args, function(i, item) { matcherAndArgs.push(item); });
    return SpecIt.expectations(that)[expectation].apply(that, matcherAndArgs);
  }

  window.verify = function(target) {
    return {
        should : function() {
            checkExpectation(target, "should", arguments);
        },
        shouldNot : function() {
            checkExpectation(target, "shouldNot", arguments);
        },
    };
  }

  var SpecIt = {
    currentExpectation: 'should',
    describe: function(description, body) {
      this.currentTests = [];
      this.currentBefore = function() {};
      this.currentAfter  = function() {};
      body();
      module(description, {setup: this.currentBefore, teardown: this.currentAfter});
      $.each(this.currentTests, function(i, currentTest) { currentTest(); });
    },
    it: function(description, body) {
      currentTests.push(function() { test(description, body); });
    },
    asyncIt: function(description, body) {
      currentTests.push(function() { asyncTest(description, body); });
    },
    before: function(callback) { this.currentBefore = callback; },
    after:  function(callback) { this.currentAfter  = callback; },
    expectations: function(current) {
      var expect = function(expectation, args) {
        var args = $.makeArray(args);
        SpecIt.currentExpectation = expectation;
        
        args.shift().apply(null, [current].concat(args));
      };
      return {
        should:    function() { return expect("should",    arguments); },
        shouldNot: function() { return expect("shouldNot", arguments); }
      }
    },
  };

  var Matcher = function(expectation, assertion, options) {
    var expected = options.expected.value,
        actual   = options.actual.value,
        assert   = options.assert,
        messageOptions = {},
        message = SpecIt.expectationMessage(expectation,
                                            expected,
                                            options.actual.messageValue || actual,
                                            messageOptions);

    if(SpecIt.currentExpectation === "shouldNot") {
      switch(assertion) {
        case "equal":     assertion = "notEqual";     break;
        case "equals":    assertion = "notEqual";     break;
        case "ok":        assertion = "ok";           break;
        case "deepEqual": assertion = "notDeepEqual"; break;
      }
      if(assertion === "ok") { assert = !assert; }
    }

    if(assertion === "ok") {
      window[assertion](assert, message);
    } else {
      window[assertion](actual, expected, message);
    }
  };

  $.extend(SpecIt, {
    expectationMessage: function(matcher, expected, actual) {
      var matcherMessages = {
        include:                "Expected {actual} {not} to include {expected}",
        eql:                    "Expected {actual} {not} to equal",
        beSimilarTo:            "Expected {actual} {not} to be the same as",
        be:                     "Expected {actual} {not} to be true",
        beA:                    "Expected {actual} {not} to be a",
        beAn:                   "Expected {actual} {not} to be an",
        match:                  "Expected {actual} {not} to match {expected}",
        respondTo:              "Expected {expected} {not} to be a method of {actual}",
        beLessThan:             "Expected {actual} {not} to be less than {expected}",
        beLessThanOrEqualTo:    "Expected {actual} {not} to be less than or equal to {expected}",
        beGreaterThan:          "Expected {actual} {not} to be greater than {expected}",
        beGreaterThanOrEqualTo: "Expected {actual} {not} to be greater than or equal to {expected}",
        beOnThePage:            "Expected {actual} {not} to be on the page",
        beEmpty:                "Expected {actual} {not} to be empty",
        beToTheLeftOf:          "Expected {actual} {not} to be to the left of {expected}",
        beToTheRightOf:         "Expected {actual} {not} to be to the right of {expected}",
        beAbove:                "Expected {actual} {not} to be above {expected}",
      }, message, options = arguments[3];

      message = matcherMessages[matcher];

      message = message.replace("{expected}", expected).replace("{actual}", JSON.stringify(actual));

      if(SpecIt.currentExpectation === "should") {
        message = message.replace("{not} ", "");
      } else {
        message = message.replace("{not}", "not");
      }

      return message;
    },
    matchers: {
      include: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        var args = $.makeArray(args), expectation = true, actual = that;
        $.each(args, function(i, item) {
          if(actual.constructor == Object && actual.length == undefined) {
            expectation = false;
            if(item in actual) { expectation = true; }
          } else {
            if(actual.indexOf(item) < 0) { expectation = false; }
          }
        });

        Matcher("include", "ok",
                {assert:   expectation,
                 expected: {value: args,   parse: true},
                 actual:   {value: actual, parse: true}});
      },
      eql: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();

        Matcher("eql", "equal",
                {expected: {value: args[0], parse: true},
                 actual:   {value: that,         parse: true}});
      },
      beSimilarTo: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("beSimilarTo", "deepEqual",
                {expected: {value: args[0], parse: true},
                 actual:   {value: that,         parse: true}});
      },
      be: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("be", "ok",
                {assert:   JSON.parse(JSON.stringify(that)),
                 expected: {value: true, parse: true},
                 actual:   {value: that, parse: true}});
      },
      beA: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
        
        var actual = null;
        
        if (that != null)
            actual = that.constructor.name;
      
        Matcher("beA", "equals",
                {expected: {value: args[0].name.toString(), parse: true},
                 actual:   {value: actual,        parse: true, messageValue: that}});
      },
      beAn: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("beAn", "equals",
                {expected: {value: args[0].name.toString(), parse: true},
                 actual:   {value: that.constructor.name,        parse: true, messageValue: that}});
      },
      match: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("match", "ok",
                {assert:   args[0].test(that),
                 expected: {value: args[0], parse: true},
                 actual:   {value: that,         parse: true}});
      },
      respondTo: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("respondTo", "ok",
                {assert: typeof that[args[0]] === "function",
                 expected: {value: args[0], parse: true},
                 actual:   {value: that, parse: true}});
      },
      beLessThan: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("beLessThan", "ok",
                {assert: that < args[0],
                 expected: {value: args[0], parse: true},
                 actual:   {value: that, parse: true}});
      },
      beLessThanOrEqualTo: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("beLessThanOrEqualTo", "ok",
                {assert: that <= args[0],
                 expected: {value: args[0], parse: true},
                 actual:   {value: that, parse: true}});
      },
      beGreaterThan: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("beGreaterThan", "ok",
                {assert: that > args[0],
                 expected: {value: args[0], parse: true},
                 actual:   {value: that, parse: true}});
      },
      beGreaterThanOrEqualTo: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("beGreaterThanOrEqualTo", "ok",
                {assert: that >= args[0],
                 expected: {value: args[0], parse: true},
                 actual:   {value: that, parse: true}});
      },
      beOnThePage: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("beOnThePage", "ok",
                {assert: $(that).length > 0,
                 expected: {value: args[0], parse: true},
                 actual:   {value: $(that).selector, parse: true}});
      },
      beEmpty: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        var empty = true;
        if (that.constructor == Object && that.length == undefined) {
          for(var key in that) {
            if(!/should|shouldNot/.test(key)) { empty = false; }
          }
        } else {
          if(that.length > 0) { empty = false; }
        }

        Matcher("beEmpty", "ok",
                {assert: empty,
                 expected: {value: args[0], parse: true},
                 actual:   {value: that, parse: true}});
      },
      beToTheLeftOf: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("beToTheLeftOf", "ok",
                {assert: $(that).offset().left < $(args[0]).offset().left,
                 expected: {value: $(args[0]).selector, parse: true},
                 actual:   {value: $(that).selector, parse: true}});
      },
      beToTheRightOf: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("beToTheRightOf", "ok",
                {assert: ($(that).offset().left > ($(args[0]).offset().left + $(arguments[0]).width())),
                 expected: {value: $(args[0]).selector, parse: true},
                 actual:   {value: $(that).selector, parse: true}});
      },
      beAbove: function() {
        var args = $.makeArray(arguments);
        var that = args.shift();
      
        Matcher("beAbove", "ok",
                {assert: $(that).offset().top < $(args[0]).offset().top,
                 expected: {value: $(args[0]).selector, parse: true},
                 actual:   {value: $(that).selector, parse: true}});
      },
    }
  });

  for(var matcher in SpecIt.matchers) {
    window[matcher] = SpecIt.matchers[matcher];
  }

  window.describe = SpecIt.describe;
  window.it       = SpecIt.it;
  window.asyncIt  = SpecIt.asyncIt;
  window.before   = SpecIt.before;
  window.after    = SpecIt.after;
})();
