const { spawnSync } = require('child_process');


function checkSvnStatus(fileName){
  return spawnSync('svn', [ 'status', fileName ]).stdout.toString();
}

function isCommitted(fileName){
  return checkSvnStatus(fileName) === '';
}

module.exports = isCommitted;


// var path = require('path'); 
// var workingDir = process.cwd();
// var historyPath = path.join(workingDir, 'HISTORY_45.md');
// console.log(isCommitted(historyPath));
