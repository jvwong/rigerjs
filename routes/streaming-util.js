const { Transform } = require('stream');

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
  let isHeader = true;
  return ( chunk, done ) => {
    let upper = 0, piece = '', lower = 0;
		fragment += chunk; // add new chunk to existing (if any)
		while ( ( upper = fragment.indexOf( '\n', lower )) !== -1 ) { // set i to the newline index
			piece = fragment.substr( lower, upper - lower ); // get segment, excluding upper
      lower = upper + 1; // push lower past upper
      if( isHeader ){
        handleChunk( piece );
        isHeader = false;
      } else {
        result.push( handleChunk( piece ) );
      }
		}
    fragment = fragment.substr( lower );
    if ( done ) { return JSON.stringify( result) };
	}
}

/*
* Convert a tab-delimited, newline capped string to JSON object
* @returns {function} - processes line into object
*/
function handleCsvLine() {
  let isHeader = true;
  let headers = [];
  return line => {
    if( isHeader ){
      headers = line.split( '\t' );
      isHeader = false;
      return;
    }
    const out = {};
    const values = line.split( '\t', headers.length );
    headers.forEach( ( key, index ) => {
      out[ key ] = values[ index ];
    });
    return out;
	}
}

class Jsonify extends Transform {
  constructor( options ) {
    super( options );
    this.mapToJson = newLineStream( handleCsvLine( ) );
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


module.exports = { jsonifyer: new Jsonify() };
