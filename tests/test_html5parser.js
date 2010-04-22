var HTML5 = require('html5');
var assert = require('assert');
var sys = require('sys');
var events = require('events');

var data = {
	trivial: {
		code: "<html><head><title>Hello!</title></head><body><p>Hi!</p><div>Testing</div></body></html>",
		output: { root: { name: 'html', children: [ 
			{ name: 'head', children: [ 
				{ name: 'title' , children: [ 
					{ value: 'Hello!' } ],
					attributes: [] }
			], attributes: [] }, 
			{ name: 'body' ,children: [ 
				{ value: 'Hi!' }, 
				{ name: 'p', children: [], attributes: {} }, 
				{ name: 'div', children: [ 
					{ value: 'Testing'} ], attributes: [] }
			], attributes: {} } ] }
		},
	},
	attr: {
		code: "<html><head profile='x'><title>Hello!</title></head><body class='test'></body></html>",
	},
	minimal: {
		code: "<p>Hi!</p>",
		errorCount: 1
	},
	unfinished: {
		code: "<html><head><title>Well then",
	},
};

function basic_parser_checks(p, d) {
	assert.ok(p);
	assert.ok(p.tree);
	assert.ok(p.tree.document);
	assert.ok(p.tree.document.documentElement);
	if(d.errorCount) assert.equal(p.errors.length, d.errorCount);
	// FIXME: circular objects if(d.output) assert.deepEqual(p.tree.document, d.output);
}

for(i in data) {
	//sys.puts("New test: " + i)
	p = new HTML5.Parser(data[i].code);
	basic_parser_checks(p, data[i]);
	sys.puts(p.tree.document.xml);
	//sys.puts(sys.inspect(p.errors, false, null));
}

var em = new events.EventEmitter();
p = new HTML5.Parser(em);
em.emit('data', '<p>This is a');
em.emit('data', ' test of the <e');
em.emit('data', 'm>emergency</em> broadcast system');
em.emit('end', '');
sys.puts(p.tree.document.xml);
