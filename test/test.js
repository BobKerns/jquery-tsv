(function() {
    function prepareTests() {
	function setupTests(performTests) {
	    var framework = {
		// When we started the framework
		startTime: undefined,
		// Start up the test process, passing in this framework.
		start: function start() {
		    // Record when we started the framework.
		    framework.startTime = new Date().getTime();
		    function doPerformTests() {
			performTests.call(this, framework);
		    }
		    setTimeout(doPerformTests, 10);
		    return framework;
		}
	    };
	    return framework.start();
	}
	var framework = setupTests(performTests);
	function performTests() {
	    describe("The browser", function browserTests() {
		    tsvTests(framework);
        });

	    describe("Final report", function finalReport() {
		$("#justDid").delay(750).show(1000);
		var currentTime = new Date().getTime();
		var elapsed = currentTime - framework.startTime;
		$(".testResults td.testElapsedTime").text("" + elapsed + " ms");
	    });

	    var jasmineEnv = jasmine.getEnv();
	    jasmineEnv.updateInterval = 250;

	    $('.testResults .tsvVersion').text($.tsv.version);
	    $('.testResults .jasmineVersion').text(jasmineEnv.versionString());
	    $('.testResults .browserVendor').text(navigator.vendor);
	    $('.testResults .browserUserAgent').text(navigator.userAgent);
	    $('.testResults .testDate').text(new Date().toUTCString());
	    $('.testResults .jQueryVersion').text(jQuery.fn.jquery);

	    // Create the HTMLReporter, which Jasmine calls to provide results of each spec and each suite. The Reporter is responsible for presenting results to the user.

	    var htmlReporter = new jasmine.HtmlReporter();
	    jasmineEnv.addReporter(htmlReporter);

	    // Delegate filtering of specs to the reporter. Allows for clicking on single suites or specs in the results to only run a subset of the suite.

	    jasmineEnv.specFilter = function specFilter(spec) {
		return htmlReporter.specFilter(spec);
	    };
	    execJasmine();

	  function execJasmine() {
	    jasmineEnv.execute();
	  }
	}
    }

// Run all of the tests when the page finishes loading and make sure to run any previous onload handler

  var currentWindowOnload = window.onload;
  window.onload = function windowOnLoadHandler() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    prepareTests();
  };
})();