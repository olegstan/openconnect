import {getCode} from "index";

let login, password, group = 'CRM', imgPath;

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

console.log(getCode());

