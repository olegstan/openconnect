import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

let login, password, group = 'CRM';

process.argv.slice(2).forEach(function (val, index, array) {
  let value = val.toString();

  switch (index)
  {
    case 0:
      login = value;
      break;
    case 1:
      password = value;
      break;
    case 2:
      group = value;
      break;
  }
});



var __dirname = fs.realpathSync('.');
var code = execSync('node ' + __dirname + '/../2fa/src/index.js ' + login, {'encoding': 'UTF-8'}).trim();

console.log(code)
console.log(code.length)

if(code.length === 6)
{
  connect(code)
}

var connect = function (code)
{
  const openconnect = spawn('openconnect', [
    'sslvpn.aton.ru',
    '--background',
    '--user=' + login,
    '--authgroup=' + group//VPN_CRMUSER_2FA or CRM
  ]);

  openconnect.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  openconnect.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);

    // Проверяем, запрашивается ли пароль
    if (data.includes('Password:')) {
      // Отправляем пароль вводом в stdin
      openconnect.stdin.write(password + '\n');
    }else if(data.includes('OTP')){
      openconnect.stdin.write(code + '\n');
    }else if(data.includes('Connected as')){

    }
  });

  openconnect.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });
}

