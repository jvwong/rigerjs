const express = require('express');
const router = express.Router();
const spawn = require('child_process').spawn;
const streamUtil = require('./streaming-util.js');
const { rigerJ } = require('./rigerJ.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/riger', function(req, res, next) {
  res.set({
    // 'Connection': 'close', // mui importante
    'Content-Type': 'application/json'
  });
  rigerJ( req ).pipe( res );
});

module.exports = router;

// e.g. curl
// cat /Users/jeffreywong/Sync/bader_jvwong/Guide/primers/data_analysis/rnai_gene_enrichment_ranking/RIGERJ/resources/inputFileHairpinWeights.txt | curl --data-binary @- -H "Content-Type: text/plain" --request POST http://localhost:3000/riger
