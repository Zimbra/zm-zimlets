DBG.println(AjxDebug.DBG1,"Loaded org_zimbra_samba.js");
function ZaSamAccount() {

}
ZaSamAccount.A_sambaSID = "sambaSID";
ZaSamAccount.A_sambaAcctFlags = "sambaAcctFlags";
ZaSamAccount.A_sambaBadPasswordCount = "sambaBadPasswordCount";
ZaSamAccount.A_sambaBadPasswordTime = "sambaBadPasswordTime";
ZaSamAccount.A_sambaDomainName = "sambaDomainName";
ZaSamAccount.A_sambaHomeDrive = "sambaHomeDrive";
ZaSamAccount.A_sambaHomePath = "sambaHomePath";
ZaSamAccount.A_sambaKickoffTime = "sambaKickoffTime";
ZaSamAccount.A_sambaLMPassword = "sambaLMPassword";
ZaSamAccount.A_sambaLogoffTime = "sambaLogoffTime";
ZaSamAccount.A_sambaLogonHours = "sambaLogonHours";
ZaSamAccount.A_sambaLogonScript = "sambaLogonScript";
ZaSamAccount.A_sambaLogonTime = "sambaLogonTime";
ZaSamAccount.A_sambaMungedDial = "sambaMungedDial";
ZaSamAccount.A_sambaNTPassword = "sambaNTPassword";
ZaSamAccount.A_sambaPasswordHistory = "sambaPasswordHistory";
ZaSamAccount.A_sambaPrimaryGroupSID = "sambaPrimaryGroupSID";
ZaSamAccount.A_sambaProfilePath = "sambaProfilePath";
ZaSamAccount.A_sambaPwdCanChange = "sambaPwdCanChange";
ZaSamAccount.A_sambaPwdLastSet = "sambaPwdLastSet";
ZaSamAccount.A_sambaPwdMustChange = "sambaPwdMustChange";
ZaSamAccount.A_sambaUserWorkstations = "sambaUserWorkstations";

if(ZaAccount.myXModel && ZaAccount.myXModel.items) {
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaSID,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaSID});			
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaAcctFlags,type:_STRING_, defaultValue:0,ref:"attrs/"+ZaSamAccount.A_sambaAcctFlags});	
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaBadPasswordCount,type:_NUMBER_, defaultValue:0,ref:"attrs/"+ZaSamAccount.A_sambaBadPasswordCount});
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaBadPasswordTime,type:_NUMBER_, defaultValue:0,ref:"attrs/"+ZaSamAccount.A_sambaBadPasswordTime});		
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaDomainName,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaDomainName});		
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaHomeDrive,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaHomeDrive});		
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaHomePath,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaHomePath});			
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaKickoffTime,type:_NUMBER_,ref:"attrs/"+ZaSamAccount.A_sambaKickoffTime});		
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaLMPassword,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaLMPassword});				
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaLogoffTime,type:_NUMBER_,ref:"attrs/"+ZaSamAccount.A_sambaLogoffTime});						
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaLogonHours,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaLogonHours});								
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaLogonScript,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaLogonScript});			
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaLogonTime,type:_NUMBER_,ref:"attrs/"+ZaSamAccount.A_sambaLogonTime});		
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaMungedDial,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaMungedDial});
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaNTPassword,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaNTPassword});				
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaPasswordHistory,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaPasswordHistory});		
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaPrimaryGroupSID,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaPrimaryGroupSID});		
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaProfilePath,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaProfilePath});		
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaPwdCanChange,type:_NUMBER_,ref:"attrs/"+ZaSamAccount.A_sambaPwdCanChange});		
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaPwdLastSet,type:_NUMBER_,ref:"attrs/"+ZaSamAccount.A_sambaPwdLastSet});		
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaPwdMustChange,type:_NUMBER_,ref:"attrs/"+ZaSamAccount.A_sambaPwdMustChange});			
		ZaAccount.myXModel.items.push({id:ZaSamAccount.A_sambaUserWorkstations,type:_STRING_,ref:"attrs/"+ZaSamAccount.A_sambaUserWorkstations});
}


if(ZaTabView.XFormModifiers["ZaAccountXFormView"]) {
	ZaSamAccount.AccountXFormModifier= function (xFormObject) {
		var cnt = xFormObject.items.length;
		var i = 0;
		for(i = 0; i <cnt; i++) {
			if(xFormObject.items[i].type=="switch") 
				break;
		}
		cnt = xFormObject.items[i].items.length;
		var sambaTabIx = ++ZaAccountXFormView.TAB_INDEX;
		
		var tabBar = xFormObject.items[1] ;
		tabBar.choices.push({value:sambaTabIx, label:"Samba Account"});		
		var sambaAccountTab={type:_ZATABCASE_, numCols:1, relevant:("instance[ZaModel.currentTab] == " + sambaTabIx),
					items: [
						{type:_ZAGROUP_, 
							items:[
								{ref:ZaSamAccount.A_sambaSID, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaSID,label:ZaSamAccount.A_sambaSID, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged},
								{ref:ZaSamAccount.A_sambaAcctFlags, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaAcctFlags,label:ZaSamAccount.A_sambaAcctFlags, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged},
								{ref:ZaSamAccount.A_sambaDomainName, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaDomainName,label:ZaSamAccount.A_sambaDomainName, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged},								
								{ref:ZaSamAccount.A_sambaNTPassword, type:_OUTPUT_, msgName:ZaSamAccount.A_sambaNTPassword,label:ZaSamAccount.A_sambaNTPassword, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged},
								{ref:ZaSamAccount.A_sambaLogonScript, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaLogonScript,label:ZaSamAccount.A_sambaLogonScript, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged},
								{ref:ZaSamAccount.A_sambaProfilePath, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaProfilePath,label:ZaSamAccount.A_sambaProfilePath, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged},
								{ref:ZaSamAccount.A_sambaHomeDrive, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaHomeDrive,label:ZaSamAccount.A_sambaHomeDrive, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged},
								{ref:ZaSamAccount.A_sambaHomePath, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaHomePath,label:ZaSamAccount.A_sambaHomePath, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged}								
							]
				}	]
			};
		xFormObject.items[i].items.push(sambaAccountTab);
	}
	ZaTabView.XFormModifiers["ZaAccountXFormView"].push(ZaSamAccount.AccountXFormModifier);	
}

if(ZaXDialog.XFormModifiers["ZaNewAccountXWizard"]) {
	
	ZaSamAccount.AccountXWizModifier= function (xFormObject) {
		var stepCounter = this.stepChoices.length;
		ZaNewAccountXWizard.SAMBA_ACC_STEP = stepCounter+1;			
		this.stepChoices.push({value:ZaNewAccountXWizard.SAMBA_ACC_STEP, label:"Samba Account"});
		this._lastStep = this.stepChoices.length;


		var cnt = xFormObject.items.length;
		var i = 0;
		for(i = 0; i <cnt; i++) {
			if(xFormObject.items[i].type=="switch") 
				break;
		}
		cnt = xFormObject.items[i].items.length;
		var j = 0;
		var gotAdvanced = false;
		var gotFeatures = false;		

		var sambaAccountStep={type:_CASE_, numCols:1, relevant:"instance[ZaModel.currentStep] == ZaNewAccountXWizard.SAMBA_ACC_STEP",		
					items: [
						{type:_ZAWIZGROUP_, 
							items:[
								{ref:ZaSamAccount.A_sambaSID, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaSID,label:ZaSamAccount.A_sambaSID, labelLocation:_LEFT_},
								{ref:ZaSamAccount.A_sambaAcctFlags, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaAcctFlags,label:ZaSamAccount.A_sambaAcctFlags, labelLocation:_LEFT_},
								{ref:ZaSamAccount.A_sambaDomainName, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaDomainName,label:ZaSamAccount.A_sambaDomainName, labelLocation:_LEFT_},								
								{ref:ZaSamAccount.A_sambaNTPassword, type:_OUTPUT_, msgName:ZaSamAccount.A_sambaNTPassword,label:ZaSamAccount.A_sambaNTPassword, labelLocation:_LEFT_},
								{ref:ZaSamAccount.A_sambaLogonScript, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaLogonScript,label:ZaSamAccount.A_sambaLogonScript, labelLocation:_LEFT_},
								{ref:ZaSamAccount.A_sambaProfilePath, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaProfilePath,label:ZaSamAccount.A_sambaProfilePath, labelLocation:_LEFT_},
								{ref:ZaSamAccount.A_sambaHomeDrive, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaHomeDrive,label:ZaSamAccount.A_sambaHomeDrive, labelLocation:_LEFT_},
								{ref:ZaSamAccount.A_sambaHomePath, type:_TEXTFIELD_, msgName:ZaSamAccount.A_sambaHomePath,label:ZaSamAccount.A_sambaHomePath, labelLocation:_LEFT_}								
							]
				}	]
			};
		xFormObject.items[i].items.push(sambaAccountStep);
	}
	ZaXDialog.XFormModifiers["ZaNewAccountXWizard"].push(ZaSamAccount.AccountXWizModifier);	
}
ZaSamAccount.loadMethod = function(by, val, withCos) {
	var soapDoc = AjxSoapDoc.create("GetSambaDomainsRequest", "urn:zimbraAdmin", null);	
	soapDoc.set("ldapSearchBase", "dc=ubuntu,dc=zimbra,dc=com");
	soapDoc.set("query", "objectClass=sambaDomain");	
	var modifyAccCommand = new ZmCsfeCommand();
	var params = new Object();
	params.soapDoc = soapDoc;	
	resp = modifyAccCommand.invoke(params).Body.GetSambaDomainsResponse;
}

if(ZaItem.loadMethods["ZaAccount"]) {
	ZaItem.loadMethods["ZaAccount"].push(ZaSamAccount.loadMethod);
}

ZaSamAccount.createMethod =
function(tmpObj, account, app) {
	if(tmpObj.attrs[ZaAccount.A_password] && tmpObj.attrs[ZaAccount.A_password].length > 0) {
		var soapDoc = AjxSoapDoc.create("ModifyAccountRequest", "urn:zimbraAdmin", null);
		soapDoc.set("id", account.id);
		var attr = soapDoc.set("a", ZaSambaUtil.hex_md4(tmpObj.attrs[ZaAccount.A_password]));
		attr.setAttribute("n", ZaSamAccount.A_sambaNTPassword);		
		var modifyAccCommand = new ZmCsfeCommand();
		var params = new Object();
		params.soapDoc = soapDoc;	
		resp = modifyAccCommand.invoke(params).Body.ModifyAccountResponse;
		account.initFromJS(resp.account[0]);
		account[ZaAccount.A2_confirmPassword] = null;		
	}
}

if(ZaItem.createMethods["ZaAccount"]) {
	ZaItem.createMethods["ZaAccount"].push(ZaSamAccount.createMethod);
}