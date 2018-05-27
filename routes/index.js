var express = require('express');
var router = express.Router();
var spawn = require('child_process').spawn;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/riger', function(req, res, next) {
  var prc = spawn('java', ['-jar',
   '/Users/jeffreywong/Projects/PathwayCommons/guide/rigerj/target/rigerj-2.0.2-assembly.jar',
   '-inputFile',
  '/Users/jeffreywong/Sync/bader_jvwong/Guide/primers/data_analysis/rnai_gene_enrichment_ranking/RIGERJ/resources/inputFileHairpinWeights.txt']);

  prc.stdout.pipe(res);

});

module.exports = router;
