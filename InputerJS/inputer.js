function Inputer(inputerID, defErrorContainer) {
	Inputer.instanceList[ inputerID ] = this;
	
	var inputContainerID		= inputerID;
	var _defErrorContainer		= defErrorContainer;
	var submitButtonId;			// @TODO: Create Method to Add Submit button and assign the Submit button ID here
	var inputList				= {};
	var submitButtonDependency	= {};
	var outputString			= "";
	var isOddRow				= true;
	var callbackFunction		= "";
	var formDeclared			= false;
	var showAlertOnIncorrectParamIfErrorContainerNotFound = false;
	
	var highlightColor			= "#BE3A34";
	
	if (typeof(_defErrorContainer)	=== 'undefined') _defErrorContainer	= "";
	
	this.createForm = function(method, target, formID){
		if (typeof(method)	=== 'undefined') method	= "POST";
		if (typeof(target)	=== 'undefined') target	= "";
		if (typeof(formID)	=== 'undefined') formID	= inputContainerID+"_Form";
		
		outputString += "<form target='"+target+"' method='"+method+"' id='" + formID + "'>";
		formDeclared  = true;
	}
	
	this.isArray = function(arr) { return arr instanceof Array; }
	
	this.loadFormJSON = function(jsonObj){
		var inputItemsFoundStatus = 0;
		if(jsonObj.hasOwnProperty("inputs")){
			inputItemsFoundStatus = 1;
			if(this.isArray(jsonObj.inputs)){
				inputItemsFoundStatus = 2;
				if(jsonObj.inputs.length > 0)
					inputItemsFoundStatus = 3;
			}
		}
		if(inputItemsFoundStatus != 3){
			if(inputItemsFoundStatus == 0) alert("Input Array not found! JSONERR:0");
			if(inputItemsFoundStatus == 1) alert("Input List is not an Array! JSONERR:1");
			if(inputItemsFoundStatus == 2) alert("Input Array is Empty! JSONERR:2");
			return false;
		}
		
		var objKeys = Object.keys(jsonObj);
		for(var i = 0; i < objKeys.length; i++){
			if(objKeys[i] == "form"){
				var method = jsonObj.form.method;
				var target = jsonObj.form.target;
				var formID = jsonObj.form.formID;
				if(typeof(method)	=== "undefined") method = "";
				if(typeof(target)	=== "undefined") target = "";
				if(typeof(formID)	=== "undefined") formID = "";
				this.createForm(method, target, formID);
			}
			if(objKeys[i] == "inputs"){
				for(var j = 0; j < jsonObj.inputs.length; j++){
					if( ! jsonObj.inputs[j]) continue;
					var inpDispName = jsonObj.inputs[j].dispName;
					var inpID		= jsonObj.inputs[j].id;
					var inpType		= jsonObj.inputs[j].type;
					if(typeof(inpDispName)	=== "undefined") inpDispName = inpID;
					if(typeof(inpID)		=== "undefined" ||
					   typeof(inpType)		=== "undefined") {
						alert("Input ID or Type Missing for item " + j + "! JSONERR:3");
						return false;
					}
					else this.createInputWithLabel (inpDispName, inpID, inpType);
				}
			}
			if(objKeys[i] == "SubmitButton")
				this.createSubmitButton (jsonObj.SubmitButton);
		}
	}
	this.selectOption = function(inpID, options, selected, className){
		if (typeof(className)	=== 'undefined') className	= "inputBox";
		
		var selectOp = "\n<select id='" + inpID + "' class='" + className + "'>\n";
		for (var i = 0; i < options.length; i++){
			selectOp += "<option value='" + options[i].Value + "'";
			if(selected == options[i].Value) selectOp += " selected";
			selectOp += ">" + options[i].Display + "</option>\n";
		}
		selectOp += "</select>\n";
		outputString += selectOp;
		return selectOp;
	}
	this.createInputWithBR = function(inpId, inpType, defValue, isManadatory, errorMsgContainerId, style, className, otherOptions) {
		this.createInput(inpId, inpType, defValue, isManadatory, errorMsgContainerId, style, className, otherOptions);
		this.addLineBreak();
	}
	this.createInputWithLabel = function(displayName, inpId, inpType, defValue, isManadatory, errorMsgContainerId, style, className, otherOptions) {
		if (typeof(isManadatory)		=== 'undefined') isManadatory			= true;
		
		var bgColorClass = "evenRowClass";
		if(isOddRow) bgColorClass = "oddRowClass";
		isOddRow = !isOddRow;
		
		outputString += "<div class='inputerDivContainer " + bgColorClass + "'>";
		outputString += "<div class='inputerLabelContainer " + bgColorClass + "'>" + displayName;
		if(isManadatory) outputString += "<span style='color:"+highlightColor+";'> *<span>";
		outputString += "</div>";
		
		this.createInput(inpId, inpType, defValue, isManadatory, errorMsgContainerId, style, className, otherOptions);
		if( inputList[inpId] ) inputList[inpId].displayName = displayName;
		
		outputString += "</div>";
		this.addLineBreak();
	}
	this.createInput = function(inpId, inpType, defValue, isManadatory, errorMsgContainerId, style, className, otherOptions) {
		//	this.submitButtonDependency[inputContainerID][inpId] = false;
		// Provide Default Values for Last few Params
		if (typeof(defValue)			=== 'undefined') defValue				= "";
		if (typeof(isManadatory)		=== 'undefined') isManadatory			= true;
		if (typeof(className)			=== 'undefined') className				= "inputBox";
		if (typeof(errorMsgContainerId)	=== 'undefined') errorMsgContainerId	= _defErrorContainer;
		if (typeof(otherOptions)		=== 'undefined') otherOptions			= "";
		if (typeof(style)				=== 'undefined') style					= "";
		
		inpType = inpType.toLowerCase();							// Convert to Lower Case for Easy Comparison
		var inlineType = "text";
		
		var placeholder= "";
		if(inpType == "select")	return this.selectOption(inpId, otherOptions, defValue);	// Select Works Differently
		if(inpType == "bool")	{
			if(defValue == "true"	|| defValue == true	|| defValue == 1) defValue = "1";
			if(defValue == "false"	|| defValue == false|| defValue == 0) defValue = "0";
			return this.selectOption(inpId, [{Display:"Yes", Value:"1"},{Display:"No", Value:"0"}], defValue);	// Select Bool
		}
		
		if(inpType == "date")	placeholder= "dd-mm-yyyy";
		if(inpType == "ip")		placeholder= "128.0.0.0";
		if(inpType == "email")	placeholder= "someone@example.com";
		
		if(inpType == "number" ||
		   inpType == "hidden" ||
		   inpType == "password")
			inlineType = inpType;	// These Types will define Input box behavior as well
		
		var inpStr = "\n<input ";
		
		inpStr += "class='"	+ className + "' ";
		inpStr += "id='"	+ inpId		+ "' ";
		inpStr += "type='"	+ inlineType+ "' ";
		inpStr += "style='"	+ style+ "' ";
		inpStr += otherOptions;
		inpStr += "value='"	+ defValue	+ "' ";
		inpStr += "placeholder= '"	+ placeholder + "' ";
		inpStr += "onblur=\"Inputer.verifyInputValue('" + inputContainerID + "', '" + inpId + "')\" ";
		inpStr += "/>\n";
		
		if(inpType == "date")	{
			inpStr += "<script>$( function() {$( \"#" + inpId + "\" ).datepicker();} );</script>\n";
		}
		var inpInfo = {
			displayName	: inpId,
			type		: inpType,
			value		: defValue,
			isMandatory	: isManadatory,
			errContainer: errorMsgContainerId
		};
		
		inputList[inpId] = inpInfo;	// Save the required Info
		
		outputString += inpStr;
		return inpStr;
	}
	this.createSubmitButton = function(callbackFunc, displayName, style, className, otherOptions) {
		if (typeof(callbackFunc) !== 'undefined') callbackFunction	= callbackFunc;
		if (typeof(displayName)	 === 'undefined') displayName	= "Submit";
		if (typeof(style)		 === 'undefined') style			= "";
		if (typeof(className)	 === 'undefined') className		= "inputTypeSubmit";
		if (typeof(otherOptions) === 'undefined') otherOptions	="";
		
		outputString += "\n<input id='" + inputContainerID + "_SubmitButton' "+
						"style='"+style+"' type='submit' class='"+className+"'"+
						"value='"+displayName+"' "+
						"onclick=\"return Inputer.validateFormAndCommit('"+inputContainerID+"')\" "+
						otherOptions+" />";
	}
	this.validateFormAndCommit = function() {
		// Validate All Fields
		var inpKey = Object.keys(inputList);
		var allValidated = true;
		for(var i = 0; i < inpKey.length; i++){
			if( ! this.verifyInputValue( inpKey[i] ))
				allValidated = false;
		}
		if( ! allValidated) {	// Validation Failed
			if(_defErrorContainer != "")
				document.getElementById(_defErrorContainer).innerHTML = "<span style='color:"+highlightColor+";'>Please fill <b>All</b> highlighted mandatory fields!<span>";
			else alert("Please fill All highlighted mandatory fields!");
			return false;
		}
		
		
		// Form Validated, Call requested Function, or just return True for Normal Form Submission
		if(callbackFunction != "") {
			window[callbackFunction]();
			if(! formDeclared) return false;
		}
		return true;
	}
	/************************************************************
	 * Method: verifyInputValue is called whenever an Inputer
	 * input looses Focus. It then validates the input value.
	 ************************************************************/
	
	this.verifyInputValue = function(inpID)	{
		var curVal		= document.getElementById(inpID).value;
		var inp			= inputList[inpID];
		var validated	= true;
		var errorStr	= "Incorrect Value";
		
		if (! inp) return false;								// Object Not found
		
		if (curVal.search("'") >= 0 || curVal.search('"') >= 0) {
			validated	= false;
			errorStr	= "Single or Double Quotes are not allowed.";
		}
		if (inp.type == "ip")	 {							// IP Address
			if( ! /\d+\.\d+\.\d+\.\d+/.test(curVal)) {
				validated	= false;
				errorStr	= "Incorrect Format. Please enter a Proper IP address. e.g. '128.0.0.0'";
			}
		}
		if (inp.type == "number"){						// Number (includes plus, minus and decimal values)
			if( ! /^-?\d*\.?\d*$/.test(curVal)) {
				validated	= false;
				errorStr	= "Incorrect Format. Please enter numbers only. e.g. '128' or '-12.16'";
			}
		}
		if (inp.type == "email") {						// Email
			if( ! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(curVal)) {
				validated	= false;
				errorStr	= "Incorrect Format. Please enter an Email Id. e.g. 'someone@example.com'";
			}
		}
		if (inp.type == "date")	 {						// Date
			var t = new Date(curVal);
			validated = !isNaN(t.valueOf());
			
			if( ! validated)
				errorStr	= "Incorrect Value. Please enter a proper Date. e.g. '23-3-2017'";
		}
		
		if(inp.isMandatory && curVal == ""){
			validated	= false;
			errorStr	= "<b>'" + inputList[inpID].displayName +"'</b> is Mandatory and Cannot be Left Blank.";
		}
		
		if(! validated) {
			document.getElementById( inpID ).className = 'inputBoxInvalid';
			// document.getElementById( inpID ).style.backgroundColor = '#F4DEDE';
			if(inp.errContainer != "")
				document.getElementById( inp.errContainer ).innerHTML = "<span style='color:"+highlightColor+";'>"+errorStr+"</span>";
			else if (this.showAlertOnIncorrectParamIfErrorContainerNotFound)
				alert (errorStr);
			return false;
		}
		else {
			// document.getElementById( inpID ).style.backgroundColor = '';
			document.getElementById( inpID ).className = 'inputBox';
			if(inp.errContainer != "")
				document.getElementById( inp.errContainer ).innerHTML = '';
			return true;
		}
	}
	this.addLineBreak	= function()		{
		outputString += "</br>";
	}
	this.addToStream	= function(str)		{
		outputString += str;
	}
	this.render			= function()		{
		document.getElementById(inputContainerID).innerHTML = outputString;
	}
}

Inputer.instanceList	= {};
Inputer.getInstanceById	= function(inpID)	{
	return Inputer.instanceList[inpID];
}
Inputer.validateFormAndCommit = function(inputerID)	{
	return Inputer.getInstanceById(inputerID).validateFormAndCommit();
}
Inputer.verifyInputValue = function(inputerID, inpID)	{
	return Inputer.getInstanceById(inputerID).verifyInputValue(inpID);
}
