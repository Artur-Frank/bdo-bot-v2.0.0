const config = require('./config.json');

const easyvk = require("easyvk");
const readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main (vk) {

}

async function logInWith2Auth (params) {
  return new Promise((_2faNeed) => {

	function relogIn (_2faCode = "") {

	  if (_2faCode) params.code = _2faCode

	  easyvk(params).then(main).catch((err) => {

		if (!err.easyvk_error) {
		  if (err.error_code == "need_validation") {
			_2faNeed({
			  err: err,
			  relogIn: relogIn
			});
		  }

		}

	  })
	}

	relogIn()

  })
}

logInWith2Auth({
  username: config.username,
  password: config.password,
  sessionFile: path.join(__dirname, '\\source\\cookies\\.my-session'),
  reauth: true,
}).then(({err: error, relogIn}) => {

  console.log(error.validation_type);

  rl.question(error.error + " ", (answer) => {

	let code = answer;
	relogIn(code);

	rl.close();

  });

})