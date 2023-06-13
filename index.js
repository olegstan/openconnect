import { spawn } from 'child_process';

let login, password, code;

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
      code = value;
      break;
  }
});

const openconnect = spawn('openconnect', [
  'sslvpn.aton.ru',
  '--background',
  '--user=' + login,
  '--authgroup=VPN_CRMUSER_2FA'
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
  }
});

openconnect.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});