function inputer() {
	this.aa_inputList = {};
	this.aa_submitButtonDependency = {};
	this.showAlertOnIncorrectParamIfErrorContainerNotFound = false;
	
	this.createInput = function(inpId, inpType, defValue, submitButtonId, errorMsgContainerId, isManadatory, style, className, otherOptions) {
		//	aa_submitButtonDependency[submitButtonId][inpId] = false;
		// Provide Default Values for Last few Params
		if (typeof(isManadatory)		==='undefined') isManadatory		= true;
		if (typeof(className)			==='undefined') className			= "";
		if (typeof(errorMsgContainerId)	==='undefined') errorMsgContainerId	= "";
		if (typeof(otherOptions)		==='undefined') otherOptions		= "";
		
		inpType = inpType.toLowerCase();							// Convert to Lower Case for Easy Comparison
		var inlineType = "text";
		
		var placeholder= "";
		if(inpType == "select")	return aa_selectOption(inpId, otherOptions, defValue);	// Select Works Differently
		if(inpType == "bool")	{
			if(defValue == "true"	|| defValue == true	|| defValue == 1) defValue = "1";
			if(defValue == "false"	|| defValue == false|| defValue == 0) defValue = "0";
			return aa_selectOption(inpId, [{Display:"Yes", Value:"1"},{Display:"No", Value:"1"}], defValue);	// Select Bool
		}
		
		if(inpType == "date")	placeholder= "dd-mm-yyyy";
		if(inpType == "ip")		placeholder= "128.0.0.0";
		if(inpType == "email")	placeholder= "someone@example.com";
		
		if(inpType == "number" ||
		   inpType == "hidden" ||
		   inpType == "password")
			inlineType = inpType;	// These Types will define Input box behavior as well
		
		var inpStr = "\n<input ";
		inpStr += "class='"	+ className	+ "' ";
		inpStr += "id='"	+ inpId		+ "' ";
		inpStr += "type='"	+ inlineType+ "' ";
		inpStr += "style='"	+ style+ "' ";
		inpStr += otherOptions;
		inpStr += "value='"	+ defValue	+ "' ";
		inpStr += "placeholder= '"	+ placeholder + "' ";
		inpStr += "onblur=aa_verifyInputValue('" + inpId + "') ";
		inpStr += "/>\n";
		
		if(inpType == "date")	{
			inpStr += "<script>$( function() {$( \"#" + inpId + "\" ).datepicker();} );</script>\n";
		}
		var inpInfo = {
			type		: inpType,
			value		: defValue,
			submitButton: submitButtonId,
			isMandatory	: isManadatory,
			errContainer: errorMsgContainerId
		};
		
		aa_inputList[inpId] = inpInfo;	// Save the required Info
		
		return inpStr;
	}
	
	
	/************************************************************
	 * Method: verifyInputValue is called whenever an Inputer
	 * input looses Focus. It then validates the input value.
	 ************************************************************/
	
	this.verifyInputValue = function(inpID) {
		var curVal		= document.getElementById(inpID).value;
		var inp			= aa_inputList[inpID];
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
			errorStr	= inpID +" is Mandatory and Cannot be Left Blank.";
		}
		
		if(! validated) {
			document.getElementById( inpID ).style.backgroundColor = '#F4DEDE';
			if(inp.errContainer != "")
				document.getElementById( inp.errContainer ).innerHTML = "<span style='color:red;'>"+errorStr+"</span>";
			else if (showAlertOnIncorrectParamIfErrorContainerNotFound)
				alert (errorStr);
		}
		else {
			document.getElementById( inpID ).style.backgroundColor = '';
			if(inp.errContainer != "")
				document.getElementById( inp.errContainer ).innerHTML = '';
		}
	}
	this.selectOption = function(inpID, options, selected){
		var selectOp = "<select id='" + inpID + "'>\n";
		for (var i = 0; i < options.length; i++){
			selectOp += "<option value='" + options[i].Value + "'";
			if(selected == options[i].Value) selectOp += " selected";
			selectOp += ">" + options[i].Display + "</option>\n";
		}
		selectOp += "</select>\n";
		return selectOp;
	}
}
