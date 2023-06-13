var nexpect = require('nexpect');

let login, password, code;

process.argv.slice(2).forEach(function (val, index, array) {
  let parts = val.toString().split(' ');

  login = parts[0];
  password = parts[1];
  code = parts[2];
});


nexpect.expect("openconnect --user=" + username + " --background sslvpn.aton.ru --authgroup=VPN_CRMUSER_2FA")
  .run(function (err, stdout, exitcode) {
    if (!err) {
      console.log("hello was echoed");
    }
  });