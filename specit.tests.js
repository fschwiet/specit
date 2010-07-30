loadHtmlFile("SpecIt.tests.html");

var globallyUniqueIndex = 0;

var lastRecordedInitializationIndex = null;
var lastRecordedBeforeIndex = null;

describe("SpecIt", function() {
  it("should match on inclusion", function() {
    verify([1, null]).should(include, null);
    verify([1, 2]).should(include, 1);
    verify([1, 2]).should(include, 1, 2);
    verify({one: 1, two: 2}).should(include, "one");

    verify([1, 2]).shouldNot(include, null);
    verify([1, 2]).shouldNot(include, [1, 2]);
    verify([1, 2]).shouldNot(include, [1, 2], 1, 2);
    verify([1, 2]).shouldNot(include, 3);
    verify([1, 2]).shouldNot(include, 3, 4);
    verify({one: 1}).shouldNot(include, "two");

    verify("string").should(include, "string");
    verify("string").should(include, "ring");
    verify("string").should(include, "tr");

    verify("string").shouldNot(include, "  string");
    verify("string").shouldNot(include, "string ");
    verify("string").shouldNot(include, "cat");
  });

  it("should match on equality", function() {
    verify(null).should(eql, null);
    verify("string").should(eql, "string");
    verify(1).should(eql, 1);
    verify(true).should(eql, true);

    verify(null).shouldNot(eql, "junk");
    verify("junk").shouldNot(eql, null);
    verify("string").shouldNot(eql, "junk");
    verify([]).shouldNot(eql, []);
    verify(["tree"]).shouldNot(eql, ["tree"]);
    verify({}).shouldNot(eql, {});
    verify(true).shouldNot(eql, false);
  });

  it("should match on similarity", function() {
    verify(null).should(beSimilarTo, null);
    verify("string").should(beSimilarTo, "string");
    verify(1).should(beSimilarTo, 1);
    verify(true).should(beSimilarTo, true);
    verify([]).should(beSimilarTo, []);
    verify(["tree"]).should(beSimilarTo, ["tree"]);
    verify({}).should(beSimilarTo, {});
    verify({a: 1}).should(beSimilarTo, {"a": 1});

    verify("string").shouldNot(beSimilarTo, "junk");
    verify(true).shouldNot(beSimilarTo, false);
    verify({a: 1}).shouldNot(beSimilarTo, {b: 1});
  });

  it("should match on truthiness", function() {
    verify("string").should(be);
    verify(true).should(be);
    verify(1).should(be);

    verify(null).shouldNot(be);
    verify("").shouldNot(be);
    verify(false).shouldNot(be);
    verify(0).shouldNot(be);
  });

  it("should match by type comparison", function() {
    verify("string").should(beA, String);
    verify(function() {}).should(beA, Function);
    verify(true).should(beA, Boolean);
    verify({}).should(beAn, Object);
    verify([]).should(beAn, Array);
    verify(1).should(beA, Number);
    verify(/regular-expression/).should(beA, RegExp);

    verify("string").shouldNot(beAn, Object);
    verify("string").shouldNot(beA, Number);
    verify([]).shouldNot(beAn, Object);
    verify(null).shouldNot(beA, Object);
    verify(null).shouldNot(beA, String);
  });

  it("should match against regular expressions", function() {
    verify("string").should(match, /string/);
    verify("202-555-1212").should(match, /\d{3}.\d{3}.\d{4}/);
    verify("string").shouldNot(match, /\w{10}/);
  });

  it("should match on method presence", function() {
    var myObject = {
      attribute1: 1,
      booleanAttr: true,
      methodAttr: function() {}
    };

    verify(myObject).should(respondTo, "methodAttr");
    verify(myObject).shouldNot(respondTo, "attribute1");
    verify(myObject).shouldNot(respondTo, "booleanAttr");
    verify(myObject).shouldNot(respondTo, "junkMethod");

    var Person = function(options) {
      this.name = options.name || "";
      this.age = options.age || 13;
      this.sayHi = function() {
        return "Hello; my name is " + this.name;
      };
      return this;
    };

    var john = new Person({name: "John Doe", age: 35});
    verify(john).should(respondTo, "sayHi");
    verify(john).shouldNot(respondTo, "name");
    verify(john).shouldNot(respondTo, "age");
    verify(john).shouldNot(respondTo, "sayGoodbye");
  });

  it("should match on less than", function() {
    verify(  2).should(beLessThan, 5);
    verify( -5).should(beLessThan, 0);
    verify(  0).should(beLessThan, 0.1);
    verify("awesome").should(beLessThan, "great");
    verify(  5).shouldNot(beLessThan, 3);
    verify(0.1).shouldNot(beLessThan, 0);
    verify(0.1).shouldNot(beLessThan, 0.05);
    verify(  5).shouldNot(beLessThan, 5);
    verify(  null).should(beLessThan, 5);
  });

  it("should match on less than or equal to", function() {
    verify(  2).should(beLessThanOrEqualTo, 5);
    verify( -5).should(beLessThanOrEqualTo, 0);
    verify(  0).should(beLessThanOrEqualTo, 0.1);
    verify(  5).should(beLessThanOrEqualTo, 5);
    verify("awesome").should(beLessThanOrEqualTo, "great");
    verify("great").should(beLessThanOrEqualTo, "great");
    verify(0.1).should(beLessThanOrEqualTo, 0.1);

    verify(  5).shouldNot(beLessThanOrEqualTo, 3);
    verify(0.1).shouldNot(beLessThanOrEqualTo, 0);
    verify(0.1).shouldNot(beLessThanOrEqualTo, 0.05);
  });

  it("should match on greater than", function() {
    verify(  2).should(beGreaterThan, 1);
    verify( -5).should(beGreaterThan, -10);
    verify(  0).should(beGreaterThan, -0.1);
    verify("awesome").should(beGreaterThan, "absolute");
    verify(  5).shouldNot(beGreaterThan, 30);
    verify(0.1).shouldNot(beGreaterThan, 0.2);
    verify(0.01).shouldNot(beGreaterThan, 0.05);
    verify(  5).shouldNot(beGreaterThan, 5);
  });

  it("should match on greater than or equal to", function() {
    verify(  2).should(beGreaterThanOrEqualTo, 1);
    verify( -5).should(beGreaterThanOrEqualTo, -10);
    verify(  0).should(beGreaterThanOrEqualTo, -0.1);
    verify(  5).should(beGreaterThanOrEqualTo, 5);
    verify("awesome").should(beGreaterThanOrEqualTo, "awesome");
    verify(  5).shouldNot(beGreaterThanOrEqualTo, 30);
    verify(0.1).shouldNot(beGreaterThanOrEqualTo, 0.2);
    verify(0.01).shouldNot(beGreaterThanOrEqualTo, 0.05);
  });

  it("should match on emptiness", function() {
    verify([]).should(beEmpty);
    verify({}).should(beEmpty);
    verify(0).should(beEmpty);
    verify(5).should(beEmpty);
    verify("").should(beEmpty);
    verify([1, 2]).shouldNot(beEmpty);
    verify({one: 1}).shouldNot(beEmpty);
    verify("one").shouldNot(beEmpty);
  });

  it("should match on elements on a page", function() {
   $(".workspace").append("<div class='great'>");
   verify($(".workspace .great")).should(beOnThePage);
   verify($(".workspace .non-existant")).shouldNot(beOnThePage);
   $(".workspace").empty();
  });
});

var john, beforeCallbackTest, afterCallbackTest;

describe("SpecIt with a before callback", function() {
  var jane = {name: "Jane"};

  before(function() {
    beforeCallbackTest = true;
    john = {name: "John Doe"};
  });

  it("should support before", function() {
    ok(beforeCallbackTest);
    equal(afterCallbackTest, undefined);
  });

  it("should run before every test", function() {
    john.name = "Wrong name";
  });

  it("should run before every test", function() {
    equals(john.name, "John Doe");
  });

  it("should not know attributes from another before callback", function() {
    equals(john.age, undefined);
  });
});

describe("SpecIt runs initialization for each test", function () {

  var jane = {name: "Jane"};
  beforeCallbackTest = true;
  john = {name: "John Doe"};

  it("should support before", function() {
    ok(beforeCallbackTest);
    equal(afterCallbackTest, undefined);
  });

  it("should run before every test", function() {
    john.name = "Wrong name";
  });

  it("should run before every test", function() {
    equals(john.name, "John Doe");
  });

  it("should not know attributes from another before callback", function() {
    equals(john.age, undefined);
  });
});

describe("SpecIt maintains same scope across initialization as before() then each it()", function () {

    lastRecordedInitializationIndex = ++globallyUniqueIndex;

    before(function () {
        lastRecordedBeforeIndex = lastRecordedInitializationIndex;
    });

    it("should have consistent initialization", function () {

        verify(lastRecordedBeforeIndex).should(eql, lastRecordedInitializationIndex);
    });
});

// the john object will carry over, but the jane object will not
describe("SpecIt with a different before callback", function() {
  before(function() { john.age = 35; });

  it("should not run other describes' before callbacks", function() {
    john.name = "whatever";
    equals(john.age, 35);
  });

  it("should not run other describes' before callbacks", function() {
    equals(john.name, "whatever");
    equals(john.age, 35);
  });

  it("should not know of other objects in a different describe", function() {
    equals(typeof jane, "undefined");
  });
});

describe("SpecIt with an after callback", function() {
  var changedFromAfterCallback = "unchanged";

  after(function() {
    changedFromAfterCallback = "changed";
  });

  it("should not call after callback until after a test is run", function() {
    equals(changedFromAfterCallback, "unchanged");
  });

  it("should call the after callback the first test is run", function() {
    equals(changedFromAfterCallback, "changed");
    changedFromAfterCallback = "bogus";
  });

  it("should call the after callback after each test is run", function() {
    equals(changedFromAfterCallback, "changed");
  });
});

describe("SpecIt handling before and after", function() {
  before(function() { $("body").append("<div id='crazy'>"); });
  after (function() { $("#crazy").remove(); });

  it("should run before callbacks correctly", function() {
    $("#crazy").html("awesome div");
    verify($("#crazy:contains(awesome div)")).should(beOnThePage);
  });

  it("should run after callbacks correctly", function() {
    verify($("#crazy").length).should(eql, 1);
    verify($("#crazy:contains(awesome div)")).shouldNot(beOnThePage);
  });
});

describe("SpecIt should know relative positions", function() {
  it("should know if an element is to the left of another", function() {
    verify($(".left-right-correct .left")).should(beToTheLeftOf, ".left-right-correct .right");
    verify($(".left-right-correct .text-1")).should(beToTheLeftOf, ".left-right-correct .text-2");

    verify($(".left-right-correct .right")).shouldNot(beToTheLeftOf, ".left-right-correct .left");
    verify($(".left-right-broken .left")).shouldNot(beToTheLeftOf, ".left-right-broken .right");
  });

  it("should know if an element is to the right of", function() {
    verify($(".left-right-correct .right")).should(beToTheRightOf, ".left-right-correct .left");
    verify($(".left-right-correct .text-2")).shouldNot(beToTheRightOf, ".left-right-correct .text-1");

    verify($(".left-right-correct .left")).shouldNot(beToTheRightOf, ".left-right-correct .right");
    verify($(".left-right-broken .right")).shouldNot(beToTheRightOf, ".left-right-broken .left");
  });

  it("should know if an element is to the above", function() {
    verify($(".left-right-broken .left")).should(beAbove, ".left-right-broken .right");
    verify($(".left-right-correct .text-2")).shouldNot(beAbove, ".left-right-correct .text-1");

    verify($(".left-right-correct .left")).shouldNot(beAbove, ".left-right-correct .right");
    verify($(".left-right-correct .right")).shouldNot(beAbove, ".left-right-correct .left");
  });
});
