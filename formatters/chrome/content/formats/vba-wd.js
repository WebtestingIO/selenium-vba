/*
 * Formatter for Selenium 2 / WebDriver VBA client.
 */

this.name = "vba-wd";
this.testcaseExtension = ".cls";
this.suiteExtension = ".cls";
this.webdriver = true;

var subScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
subScriptLoader.loadSubScript('chrome://selenium-ide/content/formats/webdriver.js', this);

this.formatFooter = function(testCase) {
  var formatLocal = testCase.formatLocal(this.name);
  formatLocal.footer = options.footer.replace(/\$\{([a-zA-Z0-9_]+)\}/g, function(str, name) {
     return options[name];
  });
  return formatLocal.footer;
}

this.indents = function(num) {
  return "  ";
}

function testClassName(testName) {
  return testName.split(/[^0-9A-Za-z]+/).map(
      function(x) {
        return capitalize(x);
      }).join('');
}

function testMethodName(testName) {
  return testName.replace(/\s/, '_');
}

function nonBreakingSpace() {
  return "u\"\\u00a0\"";
}

function string(value) {
  value = value.replace(/\\/g, '\\\\');
  value = value.replace(/\"/g, '\\"');
  value = value.replace(/\r/g, '\\r');
  value = value.replace(/\n/g, '\\n');
  var unicode = false;
  for (var i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) >= 128) {
      unicode = true;
    }
  }
  return '"' + value + '"';
}

function array(value) {
  var str = 'Array(';
  for (var i = 0; i < value.length; i++) {
    str += string(value[i]);
    if (i < value.length - 1) str += ", ";
  }
  str += ')';
  return str;
}

notOperator = function() {
  return "Not ";
};

Equals.prototype.toString = function() {
  return this.e1.toString() + " = " + this.e2.toString();
};

Equals.prototype.assert = function() {
  return "Assert.Equals " + this.e1.toString() + ", " + this.e2.toString();
};

Equals.prototype.verify = function() {
  return 'Debug.Print Verify.Equals(' + this.e1.toString() + ", " + this.e2.toString() + ")";
};

NotEquals.prototype.toString = function() {
  return this.e1.toString() + " <> " + this.e2.toString();
};

NotEquals.prototype.assert = function() {
  return "Assert.NotEquals " + this.e1.toString() + ", " + this.e2.toString();
};

NotEquals.prototype.verify = function() {
  return 'Debug.Print Verify.NotEquals(' + this.e1.toString() + ", " + this.e2.toString() + ")";
};

function joinExpression(expression) {
  return "Join(" + expression.toString() + ', ",")';
}

function statement(expression) {
  return expression.toString();
}

function assignToVariable(type, variable, expression) {
  return variable + " = " + expression.toString();
}

function ifCondition(expression, callback) {
  return "If " + expression.toString() + " Then " + callback();
}

function assertTrue(expression) {
  return "Assert.True " + expression.toString();
}

function assertFalse(expression) {
  return "Assert.False " + expression.toString();
}

function verifyTrue(expression) {
  return "Debug.Print Verify.True " + expression.toString();
}

function verifyFalse(expression) {
  return "Debug.Print Verify.False " + expression.toString();
}

RegexpMatch.patternAsRawString = function(pattern) {
  if (pattern != null) {
    //value = value.replace(/^\s+/, '');
    //value = value.replace(/\s+$/, '');
    pattern = pattern.replace(/\\/g, '\\\\');
    pattern = pattern.replace(/\"/g, '""');
    pattern = pattern.replace(/\r/g, '\\r');
    pattern = pattern.replace(/\n/g, '(\\n|\\r\\n)');
    return '"' + pattern + '"';
  } else {
    return '""';
  }
};

RegexpMatch.prototype.patternAsRawString = function() {
  return RegexpMatch.patternAsRawString(this.pattern);
};

RegexpMatch.prototype.toString = function() {
  return "Utils.isMatch(" + this.expression + ", " + RegexpMatch.patternToString(this.pattern) + ")";
};

RegexpMatch.prototype.assert = function() {
  return 'Assert.Matches ' + this.expression + ", " + this.patternAsRawString();
};

RegexpMatch.prototype.verify = function() {
  return 'Debug.Print Verify.Matches(' + this.expression + ", " + this.patternAsRawString() + ")";
};

RegexpNotMatch.prototype.patternAsRawString = function() {
  return RegexpMatch.patternAsRawString(this.pattern);
};

RegexpNotMatch.prototype.assert = function() {
  return 'Assert.NotMatches ' + this.expression + ", " + this.patternAsRawString();
};

RegexpNotMatch.prototype.verify = function() {
  return 'Debug.Print Verify.NotMatches(' + this.expression + ", " + this.patternAsRawString() + ")";
};

function waitFor(expression) {
  return 'While Waiter.Wait(' + expression.toString() + '): DoEvents: Wend';
}

function assertOrVerifyFailure(line, isAssert) {
  return 'Err.Raise "erreur"';
}

function pause(milliseconds) {
  return 'While Waiter.Sleep(' + (parseInt(milliseconds, 10) / 1000) + '): DoEvents: Wend';
}

function echo(message) {
  return "Debug.Print " + xlateArgument(message);
}

function formatComment(comment) {
  return comment.comment.replace(/.+/mg, function(str) {
    return "' " + str;
  });
}

function keyVariable(key) {
  return "Keys." + key;
}

this.sendKeysMaping = {
  BKSP: "Backspace",
  BACKSPACE: "Backspace",
  TAB: "Tab",
  ENTER: "Enter",
  SHIFT: "Shift",
  CONTROL: "Control",
  CTRL: "Control",
  ALT: "Alt",
  PAUSE: "Pause",
  ESCAPE: "Escape",
  ESC: "Escape",
  SPACE: "Space",
  PAGE_UP: "PageUp",
  PGUP: "PageUp",
  PAGE_DOWN: "PageDown",
  PGDN: "PageDown",
  END: "End",
  HOME: "Home",
  LEFT: "Left",
  UP: "Up",
  RIGHT: "Right",
  DOWN: "Down",
  INSERT: "Insert",
  INS: "Insert",
  DELETE: "Delete",
  DEL: "Delete",
  SEMICOLON: "Semicolon",
  EQUALS: "Equal",

  NUMPAD0: "NumberPad0",
  N0: "NumberPad0",
  NUMPAD1: "NumberPad1",
  N1: "NumberPad1",
  NUMPAD2: "NumberPad2",
  N2: "NumberPad2",
  NUMPAD3: "NumberPad3",
  N3: "NumberPad3",
  NUMPAD4: "NumberPad4",
  N4: "NumberPad4",
  NUMPAD5: "NumberPad5",
  N5: "NumberPad5",
  NUMPAD6: "NumberPad6",
  N6: "NumberPad6",
  NUMPAD7: "NumberPad7",
  N7: "NumberPad7",
  NUMPAD8: "NumberPad8",
  N8: "NumberPad8",
  NUMPAD9: "NumberPad9",
  N9: "NumberPad9",
  MULTIPLY: "Multiply",
  MUL: "Multiply",
  ADD: "Add",
  PLUS: "Add",
  SEPARATOR: "Separator",
  SEP: "Separator",
  SUBTRACT: "Subtract",
  MINUS: "Subtract",
  DECIMAL: "Decimal",
  PERIOD: "Decimal",
  DIVIDE: "Divide",
  DIV: "Divide",

  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",

  META: "Meta",
  COMMAND: "Command"
};

/**
 * Returns a string representing the suite for this formatter language.
 *
 * @param testSuite  the suite to format
 * @param filename   the file the formatted suite will be saved as
 */
function formatSuite(testSuite, filename) {
    var suiteClass = /^(\w+)/.exec(filename)[1];
    suiteClass = suiteClass[0].toUpperCase() + suiteClass.substring(1);
    var formattedSuite = options["suiteTemplate"].replace(/\$\{name\}/g, suiteClass);
	var testTemplate = /.*\$\{tests\}.*\n/g.exec(formattedSuite)[0];
	var formatedTests='';
    for (var i = 0; i < testSuite.tests.length; ++i) {
        var testClass = testSuite.tests[i].getTitle();
        formatedTests += testTemplate.replace(/\$\{tests\}/g, testClass );
    }
    return formattedSuite.replace(/.*\$\{tests\}.*\n/g, formatedTests);
}

function defaultExtension() {
  return this.options.defaultExtension;
}

this.options = {
  receiver: "driver",
  showSelenese: 'false',
  environment: "firefox",
  header:
	'Public Sub ${methodName}()\n' +
	'  Dim ${receiver} As New SeleniumWrapper.WebDriver\n' +
	'  Dim By As New By, Assert As New Assert, Verify As New Verify, Waiter As New Waiter\n' +
	'  ${receiver}.start "${environment}", "${baseURL}"\n' +
	'  ${receiver}.setImplicitWait 5000\n\n',
  footer:
	'  \n' +
	'  ${receiver}.stop\n' +
	"End Sub",
  suiteTemplate:
	'Public Sub ${name}()\n' +
	'   Call ${tests}\n'+
	"End Sub",
  indent:  '1',
  initialIndents: '0',
  defaultExtension: "cls"
};

this.configForm =
    '<description>Variable for Selenium instance</description>' +
    '<textbox id="options_receiver" />' +
    '<description>Browser</description>' +
	'<textbox id="options_environment" />' +
	'<description>Header</description>' +
	'<textbox id="options_header" multiline="true" flex="1" rows="4"/>' +
	'<description>Footer</description>' +
	'<textbox id="options_footer" multiline="true" flex="1" rows="4"/>' +
	'<checkbox id="options_showSelenese" label="Show Selenese"/>';

WDAPI.Driver = function() {
  this.ref = options.receiver;
};

WDAPI.Driver.searchContext = function(locatorType, locator) {
  var locatorString = "(" + xlateArgument(locator);
  switch (locatorType) {
    case 'xpath':
      return 'ByXPath' + locatorString;
    case 'class_name':
      return 'ByClassName' + locatorString;
    case 'css':
      return 'ByCssSelector' + locatorString;
    case 'id':
      return 'ById' + locatorString;
    case 'link':
      return 'ByLinkText' + locatorString;
    case 'name':
      return 'ByName' + locatorString;
    case 'tag_name':
      return 'ByTagName' + locatorString;
  }
  throw 'Error: unknown strategy [' + locatorType + '] for locator [' + locator + ']';
};

WDAPI.Driver.searchContextArgs = function(locatorType, locator) {
  var locatorString = xlateArgument(locator);
  switch (locatorType) {
    case 'xpath':
      return 'By.XPATH, ' + locatorString;
    case 'css':
      return 'By.CSS_SELECTOR, ' + locatorString;
    case 'id':
      return 'By.ID, ' + locatorString;
    case 'link':
      return 'By.LINK_TEXT, ' + locatorString;
    case 'name':
      return 'By.NAME, ' + locatorString;
    case 'tag_name':
      return 'By.TAG_NAME, ' + locatorString;
  }
  throw 'Error: unknown strategy [' + locatorType + '] for locator [' + locator + ']';
};

WDAPI.Driver.prototype.back = function() {
  return this.ref + ".back";
};

WDAPI.Driver.prototype.close = function() {
  return this.ref + ".close";
};

WDAPI.Driver.prototype.findElement = function(locatorType, locator) {
  return new WDAPI.Element(this.ref + ".findElement" + WDAPI.Driver.searchContext(locatorType, locator) + ")");
};

WDAPI.Driver.prototype.findElements = function(locatorType, locator) {
  return new WDAPI.ElementList(this.ref + ".findElements" + WDAPI.Driver.searchContext(locatorType, locator) + ")");
};

WDAPI.Driver.prototype.getCurrentUrl = function() {
  return this.ref + ".Url";
};

WDAPI.Driver.prototype.get = function(url) {
  return this.ref + ".get " + url;
};

WDAPI.Driver.prototype.getTitle = function() {
  return this.ref + ".Title";
};

WDAPI.Driver.prototype.getAlert = function() {
  return "With " + this.ref + ".Alert: alerttext = .Text: .Accept: End With"
};

WDAPI.Driver.prototype.chooseOkOnNextConfirmation = function() {
  return this.ref + ".Alert.Accept";
};

WDAPI.Driver.prototype.chooseCancelOnNextConfirmation = function() {
  return this.ref + ".Alert.Dismiss";
};

WDAPI.Driver.prototype.refresh = function() {
  return this.ref + ".refresh";
};

WDAPI.Element = function(ref) {
  this.ref = ref;
};

WDAPI.Element.prototype.clear = function() {
  return this.ref + ".clear";
};

WDAPI.Element.prototype.click = function() {
  return this.ref + ".click";
};

WDAPI.Element.prototype.getAttribute = function(attributeName) {
  return this.ref + ".getAttribute(" + xlateArgument(attributeName) + ")";
};

WDAPI.Element.prototype.getText = function() {
  return this.ref + ".Text";
};

WDAPI.Element.prototype.isDisplayed = function() {
  return this.ref + ".IsDisplayed";
};

WDAPI.Element.prototype.isSelected = function() {
  return this.ref + ".IsSelected";
};

WDAPI.Element.prototype.sendKeys = function(text) {
  return this.ref + ".sendKeys " + xlateArgument(text);
};

WDAPI.Element.prototype.submit = function() {
  return this.ref + ".submit";
};

WDAPI.Element.prototype.select = function(label) {
  return this.ref + ".AsSelect.selectByText " + xlateArgument(label);
};

WDAPI.ElementList = function(ref) {
  this.ref = ref;
};

WDAPI.ElementList.prototype.getItem = function(index) {
  return this.ref + "(" + index + ")";
};

WDAPI.ElementList.prototype.getSize = function() {
  return "UBound(" + this.ref + ")";
};

WDAPI.ElementList.prototype.isEmpty = function() {
  return "UBound(" + this.ref + ") == 0";
};

WDAPI.Utils = function() {
};

WDAPI.Utils.isElementPresent = function(how, what) {
  return "driver.isElementPresent(" + WDAPI.Driver.searchContextArgs(how, what) + ")";
};
