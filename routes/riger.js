var spawn = require('child_process').spawn;
var streamUtil = require('./streaming-util.js');

/* Stream the data to and from RIGERJ. */
function rigerJ( req, res ) {

  const args = [
    '-jar', // use stdin
    '/Users/jeffreywong/Projects/PathwayCommons/guide/rigerj/target/rigerj-2.0.2-assembly.jar'
  ];
  const opts = {};
  const subprocess = spawn('java', args , opts);

  res.set({
    'Connection': 'close', // mui importante
    'Content-Type': 'application/json'
  });

  // stream input to program
  req.pipe( subprocess.stdin );

  // stream from program to client
  subprocess.stdout.pipe( streamUtil.jsonifyer ).pipe( res );

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

}

module.exports = { rigerJ };
