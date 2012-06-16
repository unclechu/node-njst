/**
 * @overview Regular expressions for template inserts.
 */

module.exports = {
	// #{...} simple construction
	simple: {
		all: /#{([^;\n]*?)}/g,
		first: /#{([^;\n]*?)}/,
		only: /^#{([^;\n]*?)}$/,

		escapeChars: [
			{reg:/\r/g, val:'\\r'},
			{reg:/\n/g, val:'\\n'},
			{reg:/\t/g, val:'\\t'},
		],
	},

	// #> ... <# compile construction
	compile: {
		all: /#>([^\0]*?)<#/g,
		first: /#>([^\0]*?)<#/,
		only: /^#>([^\0]*?)<#$/,

		escapeChars: [
			{reg:/\\/g, val:'\\\\'},
			{reg:/\r/g, val:'\\r'},
			{reg:/\n/g, val:'\\n'},
			{reg:/\t/g, val:'\\t'},
			{reg:/'/g, val:"\\'"},
		],

		unescapeChars: [
			{reg:/\\\\/g, val:'\\'},
			{reg:/\\r/g, val:'\r'},
			{reg:/\\n/g, val:'\n'},
			{reg:/\\t/g, val:'\t'},
			{reg:/\\'/g, val:"'"},
		],
	},
};