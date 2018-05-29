var express = require('express');
var router = express.Router();
var spawn = require('child_process').spawn;

// Create a csv to json transform
const { Transform } = require('stream');

class JsonToCsv extends Transform {
  constructor( keys, options ) {
    super( options );
    this.keys = keys;
  }

  _transform ( data, encoding, callback ) {
    const keys = this.keys;
    const lines = data.toString().split('/n');
    lines.forEach( line => {
      const out = {};
      const vals = line.split('\t', 6);
      keys.forEach( ( key, index ) => {
        out[key] = vals[index];

      });
      this.push( JSON.stringify(out) );
    });
    // this.push( data );
    callback();
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/riger', function(req, res, next) {

  const args = [
    '-jar', // use stdin
    '/Users/jeffreywong/Projects/PathwayCommons/guide/rigerj/target/rigerj-2.0.2-assembly.jar'
  ];
  const opts = {};
  const subprocess = spawn('java', args , opts);

  const jsonify = new JsonToCsv([
    'Gene Rank',
    'Gene Name',
    'Score',
    'p-value',
    'p-value Rank',
    'Hairpin Ranks'
  ]);

  res.set({
    'Connection': 'close', // mui importante
    'Content-Type': 'text/plain'
  });

  // stream input to program
  req.pipe( subprocess.stdin );

  // stream from program to client
  subprocess.stdout.pipe( jsonify ).pipe( res );

  // handle child process errors
  subprocess.stderr.on( 'data',
    data => {
      const message = { error: data.toString() };;
      res.end( JSON.stringify( message ) );
      console.error( `stderr ${data}` );
    }
  );

  // basically happens when req streams to closed pipe...
  // How to stop writing to subprocess.stdin?
  subprocess.stdin.on( 'error',
    error => {
      console.error( `error stdin ${error}` );
  });

  // handle child process events
  subprocess.on( 'exit',
    ( code, signal ) => {
      if( code !== 0 ) {
        console.log( `Exit code: ${code}`);
      }
  });

});

module.exports = router;
