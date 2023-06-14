import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

let login, password, group = 'CRM', imgPath;

var getCode = function ()
{
  var __dirname = fs.realpathSync('.');
  return execSync('node ' + __dirname + '/../2fa/src/index.js ' + imgPath, {'encoding': 'UTF-8'}).trim();
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
    // console.log(`stdout: ${data}`);
  });

  openconnect.stderr.on('data', (data) => {
    // Проверяем, запрашивается ли пароль
    if (data.includes('Password:')) {
      // Отправляем пароль вводом в stdin
      openconnect.stdin.write(password + '\n');
    }else if(data.includes('OTP')){
      openconnect.stdin.write(code + '\n');
    }else if(data.includes('Connected as')){
      return true;
    }
  });

  openconnect.on('close', (code) => {
    // console.log(`Child process exited with code ${code}`);
  });
}


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





// console.log(code)
// console.log(code.length)
let code = getCode();

if(code.length === 6)
{
  let result = connect(code);

  if(result !== true)
  {
    let code = getCode();

    if(code.length === 6)
    {
      result = connect(code);
    }
  }
}
