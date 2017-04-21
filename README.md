# Inputer
Manage the inputs and their validation with this simplified JS import!

# Usage
	<body>
	<div id='ErrorBox'></div>
	<div id='inputContent'></div>
	
	<script src="InputerJS/inputer.js"></script>
	<script>
	var inp = new Inputer('ErrorBox', 'inputContent');
	
	inp.createInput("inpId1", "text",	"", "subID");
	inp.createInput("inpId2", "ip", 	"", "subID");
	inp.createInput("inpId3", "email",	"", "subID");
	inp.createInput("inpId4", "number", "", "subID");
	inp.createInput("inpId5", "password","","subID");
	inp.createInput("inpId6", "bool", 	"", "subID");
	
	</script>
	</body>

# Supported Types
Right now, Inputer can validate the following Data types:
- Email
- Bool
- Number
- Text
- Password
- IP
- Select (Options)