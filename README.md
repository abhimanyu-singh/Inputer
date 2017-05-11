# Inputer
Manage the inputs and their validation with this simplified JS import!

# Output
![ScreenShot](https://github.com/abhimanyu-singh/Inputer/blob/master/Sample_Images/SampleScreenShot.png)

# Usage

```html
<!DOCTYPE html>
<body>
	<script src="InputerJS/inputer.js"></script>
	<link rel="stylesheet" type="text/css" href="InputerJS/inputer.css"/>
	
	<div id='inputContent'></div>
	<div id='ErrorBox'></div>
	
	<script>
	var inp = new Inputer('inputContent', 'ErrorBox');
	
	inp.createForm();
	
	inp.createInputWithLabel("Text Input",		"TextInput",	 "text");
	inp.createInputWithLabel("IP Input",		"IPInput",		 "ip");
	inp.createInputWithLabel("Email Input",		"EmailInput",	 "email");
	inp.createInputWithLabel("Number Input",	"NumberInput",	 "number");
	inp.createInputWithLabel("Password Input",	"PasswordInput", "password");
	inp.createInputWithLabel("Bool Input",		"BoolInput",	 "bool");
	inp.createSubmitButton	("formValidated");
	
	inp.render();
	
	function formValidated(){
		alert("Everything looks fine over here... aaargghh!!");
	}
	</script>
</body>
```

You can alternatively use JSON to load the same form, as shown below:

```html
<!DOCTYPE html>
<body>
	<script src="InputerJS/inputer.js"></script>
	<link rel="stylesheet" type="text/css" href="InputerJS/inputer.css"/>
	
	<div id='inputContent'></div>
	<div id='ErrorBox'></div>
	
	<script>
	var inp = new Inputer('inputContent', 'ErrorBox');
	
	inp.loadFormJSON({
		inputs:[,
			{dispName:"Text Input",		id:"TextInput",		type:"text"},
			{dispName:"IP Input",		id:"IPInput",		type:"ip"},
			{dispName:"Email Input",	id:"EmailInput",	type:"email"},
			{dispName:"Number Input",	id:"NumberInput",	type:"number"},
			{dispName:"Password Input",	id:"PasswordInput",	type:"password"},
			{dispName:"Bool Input",		id:"BoolInput",		type:"bool"}
		],
		SubmitButton:"formValidated"
	});
	
	inp.render();
	
	function formValidated(){
		alert("Everything looks fine over here!");
	}
	</script>
</body>
```


# Supported Types
Right now, Inputer can validate the following Data types:
- Email
- Bool
- Number
- Text
- Password
- IP
- Select (Options)