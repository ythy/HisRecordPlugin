var fs = require('fs'); 
var path = require('path'); 
var svnCheck = require('./lib/svnCheck');

function HistoryRecordPlugin( option  ){
  this.options = option || {};
}


function readHistoryFile(stats){
  var workingDir = process.cwd();
  var historyPath = path.join(workingDir, this.options.history);
  fs.readFile(historyPath, 'utf8', (err, data) => {
    if (err) throw err;
    if(data){
      var topStr = data.toString().split('\n')[0];
      var topStrDate = data.toString().split('\n')[2];
      var currentDate = getDate();
      var regExp = new RegExp("^##(\\s+)" + this.options.version + "(\\s*)[\\r]?$");  
      var regExpDate = new RegExp("^`" + currentDate + "`[\\r]?$");  
      if(regExp.test(topStr) && regExpDate.test(topStrDate) && svnCheck(historyPath))
        return;
      var statsObj = stats.toJson();
      if(statsObj.assetsByChunkName){
        for(var chunks in statsObj.assetsByChunkName){
          var output =  statsObj.assetsByChunkName[chunks];
          if(typeof output === 'string')
            deleteFile.call(this, output);
          else if(typeof output === 'object'){
            for(var i = 0; i < output.length; i++){
              deleteFile.call(this, output[i]);
            }
          }        
        }
        console.log('\x1b[31m', 'Built error!!! Check history file!!!','\x1b[0m');
        console.log('\x1b[31m', 'Built error!!! Check history file!!!','\x1b[0m');
        console.log('\x1b[31m', 'Built error!!! Check history file!!!','\x1b[0m');
      }
    }
  });
}

function deleteFile(file){
  fs.unlinkSync(path.join(process.cwd(), this.options.output, file));
}

function getDate(){
  var date = new Date();
  return date.getFullYear() + "-" + formatNumber( date.getMonth() + 1 ) + "-" + formatNumber(date.getDate());
}

function formatNumber(input){
  return input < 10 ? '0' + input : input;
}


HistoryRecordPlugin.prototype.apply = function(compiler) {
  if(this.options.debug)
    return;
  var _this = this;
  compiler.plugin("done", function(stats) {
    readHistoryFile.call(_this, stats);    
  });
};

module.exports = HistoryRecordPlugin;