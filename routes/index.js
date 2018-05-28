var express = require('express');
var router = express.Router();
var spawn = require('child_process').spawn;

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

  // // stream input to subprocess
  // req.pipe( subprocess.stdin );

  // // stream from program to client
  // subprocess.stdout.pipe( res );

  // // handle child process errors
  // subprocess.stderr.on( 'data',
  //   data => {
  //     console.error(`stderr ${data}`);
  //     appErr = data;
  //   }
  // );

  // // basically happens when req streams to closed pipe...
  // subprocess.stdin.on( 'error',
  //   error => {
  //     console.error(`error stdin ${error}`
  //   );
  // });

  // subprocess.stdin.on( 'finish',
  //   () => { console.error('stdin finish');
  // });

  // // handle child process events
  // subprocess.on( 'exit',
  //   ( code, signal ) => {
  //     if( code !== 0 ) {
  //       console.log( `Program errors: ${appErr}`);
  //       console.log( `subprocess exit code: ${code}`);
  //     }
  // });

  // subprocess.on( 'error',
  //   ( error ) => {
  //     console.log(`subprocess error: ${error}`);
  // });

});

module.exports = router;
