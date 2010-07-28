loadHtmlFile("SpecIt.tests.html");

describe("SpecIt", function() {
  it("should match on inclusion", function() {
    [1, 2].should(include, 1);
    [1, 2].should(include, 1, 2);
    ({one: 1, two: 2}).should(include, "one");

    [1, 2].shouldNot(include, [1, 2]);
    [1, 2].shouldNot(include, [1, 2], 1, 2);
    [1, 2].shouldNot(include, 3);
    [1, 2].shouldNot(include, 3, 4);
    ({one: 1}).shouldNot(include, "two");

    "string".should(include, "string");
    "string".should(include, "ring");
    "string".should(include, "tr");

    "string".shouldNot(include, "  string");
    "string".shouldNot(include, "string ");
    "string".shouldNot(include, "cat");
  });

  it("should match on equality", function() {
    "string".should(eql, "string");
    (1).should(eql, 1);
    true.should(eql, true);

    "string".shouldNot(eql, "junk");
    [].shouldNot(eql, []);
    ["tree"].shouldNot(eql, ["tree"]);
    ({}).shouldNot(eql, {});
    true.shouldNot(eql, false);
  });

  it("should match on similarity", function() {
    "string".should(beSimilarTo, "string");
    (1).should(beSimilarTo, 1);
    true.should(beSimilarTo, true);
    [].should(beSimilarTo, []);
    ["tree"].should(beSimilarTo, ["tree"]);
    ({}).should(beSimilarTo, {});
    ({a: 1}).should(beSimilarTo, {"a": 1});

    "string".shouldNot(beSimilarTo, "junk");
    true.shouldNot(beSimilarTo, false);
    ({a: 1}).shouldNot(beSimilarTo, {b: 1});
  });

  it("should match on truthiness", function() {
    "string".should(be);
    true.should(be);
    (1).should(be);

    "".shouldNot(be);
    false.shouldNot(be);
    (0).shouldNot(be);
  });

  it("should match by type comparison", function() {
    "string".should(beA, String);
    (function() {}).should(beA, Function);
    true.should(beA, Boolean);
    ({}).should(beAn, Object);
    [].should(beAn, Array);
    (1).should(beA, Number);
    /regular-expression/.should(beA, RegExp);

    "string".shouldNot(beAn, Object);
    "string".shouldNot(beA, Number);
    [].shouldNot(beAn, Object);
  });

  it("should match against regular expressions", function() {
    "string".should(match, /string/);
    "202-555-1212".should(match, /\d{3}.\d{3}.\d{4}/);
    "string".shouldNot(match, /\w{10}/);
  });

  it("should match on method presence", function() {
    var myObject = {
      attribute1: 1,
      booleanAttr: true,
      methodAttr: function() {}
    };

    myObject.should(respondTo, "methodAttr");
    myObject.shouldNot(respondTo, "attribute1");
    myObject.shouldNot(respondTo, "booleanAttr");
    myObject.shouldNot(respondTo, "junkMethod");

    var Person = function(options) {
      this.name = options.name || "";
      this.age = options.age || 13;
      this.sayHi = function() {
        return "Hello; my name is " + this.name;
      };
      return this;
    };

    var john = new Person({name: "John Doe", age: 35});
    john.should(respondTo, "sayHi");
    john.shouldNot(respondTo, "name");
    john.shouldNot(respondTo, "age");
    john.shouldNot(respondTo, "sayGoodbye");
  });

  it("should match on less than", function() {
    (  2).should(beLessThan, 5);
    ( -5).should(beLessThan, 0);
    (  0).should(beLessThan, 0.1);
    "awesome".should(beLessThan, "great");
    (  5).shouldNot(beLessThan, 3);
    (0.1).shouldNot(beLessThan, 0);
    (0.1).shouldNot(beLessThan, 0.05);
    (  5).shouldNot(beLessThan, 5);
  });

  it("should match on less than or equal to", function() {
    (  2).should(beLessThanOrEqualTo, 5);
    ( -5).should(beLessThanOrEqualTo, 0);
    (  0).should(beLessThanOrEqualTo, 0.1);
    (  5).should(beLessThanOrEqualTo, 5);
    "awesome".should(beLessThanOrEqualTo, "great");
    "great".should(beLessThanOrEqualTo, "great");
    (0.1).should(beLessThanOrEqualTo, 0.1);

    (  5).shouldNot(beLessThanOrEqualTo, 3);
    (0.1).shouldNot(beLessThanOrEqualTo, 0);
    (0.1).shouldNot(beLessThanOrEqualTo, 0.05);
  });

  it("should match on greater than", function() {
    (  2).should(beGreaterThan, 1);
    ( -5).should(beGreaterThan, -10);
    (  0).should(beGreaterThan, -0.1);
    "awesome".should(beGreaterThan, "absolute");
    (  5).shouldNot(beGreaterThan, 30);
    (0.1).shouldNot(beGreaterThan, 0.2);
    (0.01).shouldNot(beGreaterThan, 0.05);
    (  5).shouldNot(beGreaterThan, 5);
  });

  it("should match on greater than or equal to", function() {
    (  2).should(beGreaterThanOrEqualTo, 1);
    ( -5).should(beGreaterThanOrEqualTo, -10);
    (  0).should(beGreaterThanOrEqualTo, -0.1);
    (  5).should(beGreaterThanOrEqualTo, 5);
    "awesome".should(beGreaterThanOrEqualTo, "awesome");
    (  5).shouldNot(beGreaterThanOrEqualTo, 30);
    (0.1).shouldNot(beGreaterThanOrEqualTo, 0.2);
    (0.01).shouldNot(beGreaterThanOrEqualTo, 0.05);
  });

  it("should match on emptiness", function() {
    [].should(beEmpty);
    ({}).should(beEmpty);
    (0).should(beEmpty);
    (5).should(beEmpty);
    "".should(beEmpty);
    [1, 2].shouldNot(beEmpty);
    ({one: 1}).shouldNot(beEmpty);
    "one".shouldNot(beEmpty);
  });

  it("should match on elements on a page", function() {
   $(".workspace").append("<div class='great'>");
   $(".workspace .great").should(beOnThePage);
   $(".workspace .non-existant").shouldNot(beOnThePage);
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
    jane.age = 26;
  });

  it("should run before every test", function() {
    equals(john.name, "John Doe");
  });

  it("should not know attributes from another before callback", function() {
    equals(john.age, undefined);
  });

  it("should not modify attributes on a local object if untouched in before", function() {
    equals(jane.age, 26);
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
    $("#crazy:contains(awesome div)").should(beOnThePage);
  });

  it("should run after callbacks correctly", function() {
    $("#crazy").length.should(eql, 1);
    $("#crazy:contains(awesome div)").shouldNot(beOnThePage);
  });
});

describe("SpecIt should know relative positions", function() {
  it("should know if an element is to the left of another", function() {
    $(".left-right-correct .left").should(beToTheLeftOf, ".left-right-correct .right");
    $(".left-right-correct .text-1").should(beToTheLeftOf, ".left-right-correct .text-2");

    $(".left-right-correct .right").shouldNot(beToTheLeftOf, ".left-right-correct .left");
    $(".left-right-broken .left").shouldNot(beToTheLeftOf, ".left-right-broken .right");
  });

  it("should know if an element is to the right of", function() {
    $(".left-right-correct .right").should(beToTheRightOf, ".left-right-correct .left");
    $(".left-right-correct .text-2").shouldNot(beToTheRightOf, ".left-right-correct .text-1");

    $(".left-right-correct .left").shouldNot(beToTheRightOf, ".left-right-correct .right");
    $(".left-right-broken .right").shouldNot(beToTheRightOf, ".left-right-broken .left");
  });

  it("should know if an element is to the above", function() {
    $(".left-right-broken .left").should(beAbove, ".left-right-broken .right");
    $(".left-right-correct .text-2").shouldNot(beAbove, ".left-right-correct .text-1");

    $(".left-right-correct .left").shouldNot(beAbove, ".left-right-correct .right");
    $(".left-right-correct .right").shouldNot(beAbove, ".left-right-correct .left");
  });
});
