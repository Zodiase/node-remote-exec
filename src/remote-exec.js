const fs = require('fs'),
      child_process = require('child_process');

/**
 * Escape single quotes.
 * @private
 * @param {string} cmd - Command to escape.
 * @return {string} - Escaped command.
 */
function escq (cmd) {

  return `'${Reflect.apply(String.prototype.replace, cmd, [/'/gm, "'\\''"])}'`;

}

/**
 * Log the given arguments to the log file specified by the last argument.
 * If the last argument is a boolean value, it will be used to decide whether or not to
 *   output the same log to stdout, while the second to last will be the log file.
 * @private
 * @returns {void}
 */
function log (...args) {

  const toStdOut = typeof args[args.length - 1] === 'boolean' ? args.pop() : false,
        logFile = args.pop(),
        logString = args.join(', ');

  fs.appendFileSync(logFile, `${logString}\n`, 'utf8');
  if (toStdOut) {

    Reflect.apply(console.log, console, args);

  }

}

/**
 * @typedef {Object} ExecuteResult
 * @property {string} stdout
 * @property {string} stderr
 * @property {number} status
 * @property {string} signal
 * @property {Error} error
 */

/**
 * Execute one or multiple commands remotely.
 * @param {object|string} remote - An object describing the remote. If a string is given, it is used as the remote host name.
 * @param {string} remote.host='127.0.0.1' - Remote host name.
 * @param {string} remote.user='root' - Remote user.
 * @param {string|Array.<string>} cmd - One or more commands to execute.
 * @param {object} options - Optional configurable options.
 * @param {string} options.cwd - Work directory for `child_process.execSync`.
 * @param {string} options.remoteCwd - Work directory for remote.
 * @param {string} options.log - Path for the local log file.
 * @param {string} options.remoteLog - Path for the remote log file.
 * @param {boolean} options.stdout - Whether to print the commands to stdout.
 * @return {ExecuteResult} Execution result.
 */
function remoteExecSync (remote, cmd, options) {

  const server = typeof remote === 'object' ? remote : { host: remote },
        host = server.host || '127.0.0.1',
        user = server.user || 'root',
        domain = `${user}@${host}`,
        cmdAry = Array.isArray(cmd) ? Reflect.apply(Array.prototype.slice, cmd, []) : [cmd],
        opts = typeof options === 'object' && options ? options : {},
        cmdDelimiter = ` && \\\n`;

  // If working directory is specified start with cd command.
  if (opts.remoteCwd) {

    cmdAry.unshift(`cd ${escq(opts.remoteCwd)}`);

  }

  // Use `&&` to join all the commands so the next one depends on the success of the last one.
  const nakedCmdString = cmdAry.join(cmdDelimiter),
        remoteCmdString = opts.remoteLog
          // Pipe to log but capture and return exit code.
          ? `( ${nakedCmdString} ) \\\n| tee -a ${escq(opts.remoteLog)} ; test \${PIPESTATUS[0]} -eq 0`
          : nakedCmdString;

  let cmdString = `ssh ${domain} ${escq(remoteCmdString)}`;

  if (opts.log) {

    // Write commands to the log file.
    log(`[${domain}]\$ ${nakedCmdString}`, opts.log, Boolean(opts.stdout));
    cmdString = `(${cmdString}) \\\n| tee -a ${escq(opts.log)} ; test \${PIPESTATUS[0]} -eq 0`;

  }

  try {

    return {
      stdout: child_process.execSync(cmdString, {
        cwd: opts.cwd,
        encoding: 'utf8'
      }),
      stderr: '',
      status: 0
    };

  } catch (err) {

    /**
     * @property {number} err.pid
     * @property {Array} err.output
     * @property {string} err.stdout
     * @property {string} err.stderr
     * @property {number} err.status
     * @property {string} err.signal
     * @property {Error} err.error
     */
    return {
      stdout: err.stdout,
      stderr: err.stderr,
      status: err.status,
      signal: err.signal,
      error: err.error
    };

  }

}

module.exports.sync = remoteExecSync;
