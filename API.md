## Functions

<dl>
<dt><a href="#remoteExecSync">remoteExecSync(remote, cmd, options)</a> ⇒ <code><a href="#ExecuteResult">ExecuteResult</a></code></dt>
<dd><p>Execute one or multiple commands remotely.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ExecuteResult">ExecuteResult</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="remoteExecSync"></a>

## remoteExecSync(remote, cmd, options) ⇒ <code>[ExecuteResult](#ExecuteResult)</code>
Execute one or multiple commands remotely.

**Kind**: global function  
**Returns**: <code>[ExecuteResult](#ExecuteResult)</code> - Execution result.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| remote | <code>object</code> &#124; <code>string</code> |  | An object describing the remote. If a string is given, it is used as the remote host name. |
| remote.host | <code>string</code> | <code>&quot;&#x27;127.0.0.1&#x27;&quot;</code> | Remote host name. |
| remote.user | <code>string</code> | <code>&quot;&#x27;root&#x27;&quot;</code> | Remote user. |
| cmd | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  | One or more commands to execute. |
| options | <code>object</code> |  | Optional configurable options. |
| options.cwd | <code>string</code> |  | Work directory for `child_process.execSync`. |
| options.remoteCwd | <code>string</code> |  | Work directory for remote. |
| options.log | <code>string</code> |  | Path for the local log file. |
| options.remoteLog | <code>string</code> |  | Path for the remote log file. |
| options.stdout | <code>boolean</code> |  | Whether to print the commands to stdout. |

<a name="ExecuteResult"></a>

## ExecuteResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| stdout | <code>string</code> | 
| stderr | <code>string</code> | 
| status | <code>number</code> | 
| signal | <code>string</code> | 
| error | <code>Error</code> | 

