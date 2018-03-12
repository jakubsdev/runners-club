"use strict";

const express = require("express")
const app = express()
const fs = require("fs")
const bodyParser = require("body-parser")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"))

app.listen(process.env.PORT || 1337, () => console.log("Server is running!"))

app.post("/", function (req, res) {
	
	if(req.body.depositID != null) {
		let file = JSON.parse(fs.readFileSync('./public/customers.json').toString());
		file[parseInt(req.body.depositID)]["balance"] += parseInt(req.body.depositValue);
	
		fs.writeFile('./public/customers.json', JSON.stringify(file, null, 2), function(err) {
			if (err) throw err;
			console.log('Deposit made successfully!');
			res.end();
		});
	}
	else if(req.body.withdrawID != null) {
		let file = JSON.parse(fs.readFileSync('./public/customers.json').toString());
		file[parseInt(req.body.withdrawID)]["balance"] -= parseInt(req.body.withdrawValue);
	
		fs.writeFile('./public/customers.json', JSON.stringify(file, null, 2), function(err) {
			if (err) throw err;
			console.log('Withdraw made successfully!');
			res.end();
		});
	}
	else if(req.body.deleteID != null) {
		let file = JSON.parse(fs.readFileSync('./public/customers.json').toString());
		file.splice(parseInt(req.body.deleteID), 1);

		fs.writeFile('./public/customers.json', JSON.stringify(file, null, 2), function(err) {
			if (err) throw err;
			console.log('Deletion made successfully!');
			res.end();
		});
	}
	else if(req.body.reqID == "payMembership") {
		let file = JSON.parse(fs.readFileSync('./public/customers.json').toString());
		let membership = 50;
		let directDebit = 0.95;
		for(let i = 0; i < file.length; i++) {
			if(file[i].membership === true) {
				if(file[i].directDebit === true) {
					file[i].balance -= membership * directDebit;
				}
				else {
					file[i].balance -= membership;
				}	
			}
		}

		fs.writeFile('./public/customers.json', JSON.stringify(file, null, 2), function(err) {
			if (err) throw err;
			console.log('Payment taken successfully!');
			res.end();
		});
	}
	else if(req.body.depositID == null) {
		let file = JSON.parse(fs.readFileSync('./public/customers.json').toString());
		let customer = {
			"ID": req.body.fName.substr(0, 3) + req.body.lName.substr(0, 3),
			"fName": req.body.fName,
			"lName": req.body.lName,
			"balance": parseInt(req.body.balance),
			"directDebit": req.body.directDebit ? true : false,
			"membership": req.body.membership ? true : false
		}
		file.push(customer)
		fs.writeFile('./public/customers.json', JSON.stringify(file, null, 2), function(err) {
			if (err) throw err;
			console.log('Customer added successfully!');
			res.end();
		});
	}
});