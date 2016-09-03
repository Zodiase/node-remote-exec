Execute Shell Commands on Remote Server
===============================================================================

Install
-------------------------------------------------------------------------------
```Bash
npm install @xch/node-remote-exec
```

Quick Example
-------------------------------------------------------------------------------

```JavaScript
const execSync = require('@xch/node-remote-exec');

const execResult = execSync('some-server', [
  'echo "Hello World!"',
  'ls -al',
  'exit 1'
]);
```

Equivalent to:

```Bash
$ ssh root@some-server 'echo "Hello World!" && \
ls -al && \
exit 1'
```

Complete Example
-------------------------------------------------------------------------------

```JavaScript
const execSync = require('@xch/node-remote-exec');

const execResult = execSync({
  host: 'some-server',
  user: 'some-user'
}, [
  'echo "Hello World!"',
  'ls -al',
  'exit 1'
], {
  cwd: '/path/of/local/work/directory',
  log: '/path/of/local/log/file',
  remoteCwd: '/path/of/remote/work/directory',
  remoteLog: '/path/of/remote/log/file',
  stdout: true // Print commands to stdout.
});
```

Equivalent to:

```Bash
$ ( ssh some-user@some-server '( cd '\''/path/of/remote/work/directory'\'' && \
echo "Hello World!" && \
ls -al && \
exit 1 ) \
| tee -a '\''/path/of/remote/log/file'\'' ; test ${PIPESTATUS[0]} -eq 0' ) \
| tee -a '/path/of/local/log/file' ; test ${PIPESTATUS[0]} -eq 0
```
