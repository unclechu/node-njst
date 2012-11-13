<#if (params.debug) {#><pre>

	nJSt #{errorTitle.toLowerCase()}: #{errorMessage}<#
		if (initLog.length > 0) show('\n\tInit log:');
		initLog.forEach(function (val) {
			show('\n\t\t' + val + '');
		});
	#>
	Error:
		#{error}

</pre><#} else if (params.liteDebug) {#><pre>

	nJSt #{errorTitle.toLowerCase()}: #{errorMessage}

</pre><#} else {#>

	Template #{errorTitle}.

<#}#>