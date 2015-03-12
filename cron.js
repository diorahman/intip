var spawn = require('child_process').spawn;
var CronJob = require('cron').CronJob;
new CronJob('0 */5 * * *', function(){
  run();
}, null, true);

function run() {
  var job = spawn(__dirname + '/job');
  job.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });
  job.on('close', function(){
    console.log('close');
  });
}
