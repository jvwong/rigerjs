var express = require('express');
var router = express.Router();
var spawn = require('child_process').spawn;
var _ = require('lodash');

// Create a csv to json transform

/*
* Helper enabling a function to operate only on
* chunks capped by a newline
* @param {function} handleChunk - the handler for the resulting line
* @param {array} headers - an ordered array of headers
* @returns {string}
*/
function newLineStream( handleChunk ) {
  const result = [];
  let fragment = '';
  return ( chunk, done ) => {
    let upper = 0, piece = '', lower = 0;
		fragment += chunk; // add new chunk to existing (if any)
		while ( ( upper = fragment.indexOf( '\n', lower )) !== -1 ) { // set i to the newline index
			piece = fragment.substr( lower, upper - lower ); // get segment, excluding upper
			lower = upper + 1; // push lower past upper
			result.push( handleChunk( piece ) );
		}
    fragment = fragment.substr( lower );
    if ( done ) return JSON.stringify( result );
	}
}

/*
* Convert a tab-delimited, newline capped string to JSON object
* @param {array} headers - an ordered array of headers
* @returns {function} -
*/
function handleCsvLine( headers ) {
  return line => {
    const out = {};
    const values = line.split( '\t', headers.length );
    headers.forEach( ( key, index ) => {
      out[ key ] = values[ index ];
    });
    return JSON.stringify( out );
	}
}

const { Transform } = require('stream');

class JsonToCsv extends Transform {
  constructor( keys, options ) {
    super( options );
    this.mapToJson = newLineStream( handleCsvLine( keys ) );
  }

  _transform ( data, encoding, callback ) {
    this.push( this.mapToJson( data ) );
    callback();
  }

  _flush ( cb ) {
    this.push( this.mapToJson( '', true ) );
    cb();
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
    'Content-Type': 'plain/text'
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
      res.end( message );
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
      if( !code ){
        console.log( 'OK');
      } else {
        console.log( 'Error');
      }
    }
  );

});

module.exports = router;
