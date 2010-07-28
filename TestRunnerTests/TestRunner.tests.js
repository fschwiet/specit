

loadJsFile("TestRunnerTests/TestRunner.tests.aux.js");
loadHtmlFile("TestRunnerTests/TestRunner.tests.html");

//TestRunner.tests.aux.js contains:
//
//    TestRunner_tests_auxillary_value = "12345";
//

//TestRunner.tests.html contains:
//
//    <p class="TestRunner_tests_auxillary_value">
//        Hello, world
//    </p>
//

describe("TestRunner loads external references", function () {

    it("can load other js", function () {

        verify(TestRunner_tests_auxillary_value).should(eql, "12345");
    });

    it("can load other xml", function () {

        verify($('p.TestRunner_tests_auxillary_value').length).should(eql, 1);
    });
});

