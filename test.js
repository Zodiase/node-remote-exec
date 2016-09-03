/* eslint-env node, mocha */
/*eslint func-names: "off"*/
/*eslint prefer-arrow-callback: "off"*/
/*eslint no-unused-expressions: "off"*/

const expect = require('chai').expect;
const escape = require('./dist/remote-exec.js').escq;
const execSync = require('./dist/remote-exec.js').sync;

describe('single quote escaping', function () {

  it('replaces each single quotes with the sequence: single quote, backslash, single quote, single quote, and wraps the whole string with single quotes.', function () {

    expect(escape("'")).to.equal("''\\'''");
    expect(escape("-'-")).to.equal("'-'\\''-'");

  });

});

describe('sync execution', function () {

  it('can connect to remote server or report error.', function () {

    const result = execSync({
      host: 'localhost',
      user: 'guest'
    }, [
      'ls -al'
    ]);

    if (result.status) {

      // Errored.
      expect(result.stderr).to.not.be.empty;

    } else {

      expect(result.stdout).to.not.be.empty;
      expect(result.stderr).to.be.empty;

    }

  });

});
