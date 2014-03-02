<% if (params.debug) { %><pre>

    nJSt %{error.title.toLowerCase()}: %{error.message}<%
        if (initLog.length > 0) show('\n\tInit log:');
        init_log.forEach(function (val) {
            show('\n\t\t' + val + '');
        });
    %>
    Error:
        %{error.trace}

</pre><% } else if (params.liteDebug) { %><pre>

    nJSt %{error.title.toLowerCase()}: %{error.message}

</pre><% } else { %>

    Template %{error.title}.

<% } %>
