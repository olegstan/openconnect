import { spawn, execSync } from 'child_process';

let login, password, group = 'CRM', imgPath;
let debug = true;

export const getCode = function (path)
{
  return execSync('node /var/www/2fa/src/index.js ' + path, {'encoding': 'UTF-8'}).trim();
}

export const connect = function (code = '')
{
  const openconnect = spawn('openconnect', [
    'sslvpn.aton.ru',
    '--background',
    '--user=' + login,
    '--authgroup=' + group//VPN_CRMUSER_2FA or CRM
  ]);

  openconnect.stdout.on('data', (data) => {
    if(debug)
    {
      console.log(`stdout: ${data}`);
    }
  });

  openconnect.stderr.on('data', (data) => {
    if(debug)
    {
      console.log(`stderr: ${data}`);
    }

    // Проверяем, запрашивается ли пароль
    if (data.includes('Password:')) {
      // Отправляем пароль вводом в stdin
      openconnect.stdin.write(password + '\n');
    }else if(data.includes('OTP')){
      openconnect.stdin.write(code + '\n');
    }else if(data.includes('Connected as')){
      openconnect.unref();
    }
  });

  openconnect.on('close', (code) => {
    if(debug)
    {
      console.log(`Child process exited with code ${code}`);
    }
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
    case 3:
      imgPath = value;
      break;
  }
});





// console.log(code)
// console.log(code.length)

if(group === 'VPN_CRMUSER_2FA')
{
  let code = getCode(imgPath);

  if(code.length === 6)
  {
    connect(code);
  }
}else{
  connect()
}


