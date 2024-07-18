import { spawn, execSync } from 'child_process';

let login, password;
let debug = true;

export const connect = function (code = '')
{
  const openconnect = spawn('openconnect', [
    'oc-test02.socksprotect.com',
    '--background',
    '--user=' + login
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
    } else if(data.includes('Connected as')){
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
  }
});

connect()



