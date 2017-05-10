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
		inp.createInputWithLabel("Text Input",	 "inpId1", "text");
		inp.createInputWithLabel("IP Input",	 "inpId2", "ip");
		inp.createInputWithLabel("Email Input",	 "inpId3", "email");
		inp.createInputWithLabel("Number Input", "inpId4", "number");
		inp.createInputWithLabel("Password Input", "inpId5", "password");
		inp.createInputWithLabel("Bool Input",	 "inpId6", "bool");
		inp.createSubmitButton("formValidated");
		inp.render();
		
		function formValidated(){
			alert("Everything looks fine over here... aaargghh!!");
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