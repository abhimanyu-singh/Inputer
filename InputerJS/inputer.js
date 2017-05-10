function Inputer(inputerID, defErrorContainer) {
	Inputer.instanceList[ inputerID ] = this;
	
	var inputContainerID		= inputerID;
	var _defErrorContainer		= defErrorContainer;
	var submitButtonId;			// @TODO: Create Method to Add Submit button and assign the Submit button ID here
	var inputList				= {};
	var submitButtonDependency	= {};
	var outputString			= "";
	var isOddRow				= true;
	var showAlertOnIncorrectParamIfErrorContainerNotFound = false;
	
	if (typeof(_defErrorContainer)	=== 'undefined') _defErrorContainer	= "";
	
	this.selectOption = function(inpID, options, selected){
		var selectOp = "<select id='" + inpID + "'>\n";
		for (var i = 0; i < options.length; i++){
			selectOp += "<option value='" + options[i].Value + "'";
			if(selected == options[i].Value) selectOp += " selected";
			selectOp += ">" + options[i].Display + "</option>\n";
		}
		selectOp += "</select>\n";
		outputString += selectOp;
		return selectOp;
	}
	
	this.createInputWithBR = function(inpId, inpType, defValue, submitButtonId, isManadatory, errorMsgContainerId, style, className, otherOptions) {
		this.createInput(inpId, inpType, defValue, submitButtonId, isManadatory, errorMsgContainerId, style, className, otherOptions);
		this.addLineBreak();
	}
	
	this.createInputWithLabel = function(displayName, inpId, inpType, defValue, submitButtonId, isManadatory, errorMsgContainerId, style, className, otherOptions) {
		var bgColorClass = "evenRowClass";
		if(isOddRow) bgColorClass = "oddRowClass";
		isOddRow = !isOddRow;
		
		outputString += "<div class='inputerDivContainer " + bgColorClass + "'>";
		outputString += "<div class='inputerLabelContainer " + bgColorClass + "'>" + displayName + "</div>";
		
		this.createInput(inpId, inpType, defValue, submitButtonId, isManadatory, errorMsgContainerId, style, className, otherOptions);
		// inputList[inpId].displayName = displayName;
		
		outputString += "</div>";
		this.addLineBreak();
	}
	
	this.createInput = function(inpId, inpType, defValue, submitButtonId, isManadatory, errorMsgContainerId, style, className, otherOptions) {
		//	this.submitButtonDependency[submitButtonId][inpId] = false;
		// Provide Default Values for Last few Params
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
			submitButton: submitButtonId,
			isMandatory	: isManadatory,
			errContainer: errorMsgContainerId
		};
		
		inputList[inpId] = inpInfo;	// Save the required Info
		
		outputString += inpStr;
		return inpStr;
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
		
		if (! inp) return;								// Object Not found
		
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
			errorStr	= inputList[inpID].displayName +" is Mandatory and Cannot be Left Blank.";
		}
		
		if(! validated) {
			document.getElementById( inpID ).className = 'inputBoxInvalid';
			// document.getElementById( inpID ).style.backgroundColor = '#F4DEDE';
			if(inp.errContainer != "")
				document.getElementById( inp.errContainer ).innerHTML = "<span style='color:red;'>"+errorStr+"</span>";
			else if (this.showAlertOnIncorrectParamIfErrorContainerNotFound)
				alert (errorStr);
		}
		else {
			// document.getElementById( inpID ).style.backgroundColor = '';
			document.getElementById( inpID ).className = 'inputBox';
			if(inp.errContainer != "")
				document.getElementById( inp.errContainer ).innerHTML = '';
		}
	}
	this.addLineBreak	= function()		{
		outputString += "</br>";
	}
	this.addToStream	= function(str)		{
		outputString += str;
	}
	this.render			= function()	{
		document.getElementById(inputContainerID).innerHTML = outputString;
	}
}

Inputer.instanceList	= {};
Inputer.getInstanceById	= function(inpID)	{
	return Inputer.instanceList[inpID];
}
Inputer.verifyInputValue = function(inputerID, inpID)	{
	Inputer.getInstanceById(inputerID).verifyInputValue(inpID);
}
