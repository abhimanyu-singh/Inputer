# Inputer
Manage the inputs and their validation with this simplified JS import!

# Usage
<body>
<div id='ErrorBox'></div>
<div id='inputContent'></div>

<script>
var inp = new Inputer();

inp.createInput("inpId1", "bool", "", submitButtonId, isManadatory, errorMsgContainerId, style, className, otherOptions);

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