DBG.println(AjxDebug.DBG1,"Loaded zimbra_posixaccount.js");
function zimbra_posixaccount () {
	
}

function ZaPosixAccount() {

}
ZaPosixAccount.A_gidNumber = "gidNumber";
ZaPosixAccount.A_homeDirectory = "homeDirectory";
ZaPosixAccount.A_uidNumber = "uidNumber";
ZaPosixAccount.A_gecos = "gecos";
ZaPosixAccount.A_loginShell = "loginShell";
ZaPosixAccount.A_userPassword = "userPassword";
if(ZaAccount.myXModel && ZaAccount.myXModel.items) {

	ZaAccount.myXModel.items.push({id:ZaPosixAccount.A_gidNumber,type:_NUMBER_,ref:"attrs/"+ZaPosixAccount.A_gidNumber});
	ZaAccount.myXModel.items.push({id:ZaPosixAccount.A_homeDirectory,type:_STRING_,ref:"attrs/"+ZaPosixAccount.A_homeDirectory});
	ZaAccount.myXModel.items.push({id:ZaPosixAccount.A_uidNumber,type:_NUMBER_, defaultValue:1000,ref:"attrs/"+ZaPosixAccount.A_uidNumber});
	ZaAccount.myXModel.items.push({id:ZaPosixAccount.A_loginShell,type:_STRING_,ref:"attrs/"+ZaPosixAccount.A_loginShell});
	ZaAccount.myXModel.items.push({id:ZaPosixAccount.A_gecos,type:_STRING_,ref:"attrs/"+ZaPosixAccount.A_gecos});

}

if(ZaTabView.XFormModifiers["ZaAccountXFormView"]) {
	ZaPosixAccount.AccountXFormModifier= function (xFormObject) {
		var cnt = xFormObject.items.length;
		var i = 0;
		for(i = 0; i <cnt; i++) {
			if(xFormObject.items[i].type=="switch") 
				break;
		}
		cnt = xFormObject.items[i].items.length;
		var posixTabIx = ++ZaAccountXFormView.TAB_INDEX;
		
		var tabBar = xFormObject.items[1] ;
		tabBar.choices.push({value:posixTabIx, label:"Posix Account"});		
		var posixAccountTab={type:_ZATABCASE_, numCols:1, relevant:("instance[ZaModel.currentTab] == " + posixTabIx),
					items: [
						{type:_ZAGROUP_, 
							items:[
								{ref:ZaPosixAccount.A_gidNumber, type:_TEXTFIELD_, msgName:ZaPosixAccount.A_gidNumber,label:ZaPosixAccount.A_gidNumber, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged, cssClass:"admin_xform_number_input"},
								{ref:ZaPosixAccount.A_uidNumber, type:_TEXTFIELD_, msgName:ZaPosixAccount.A_uidNumber,label:ZaPosixAccount.A_uidNumber, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged, cssClass:"admin_xform_number_input"},
								{ref:ZaPosixAccount.A_homeDirectory, type:_TEXTFIELD_, msgName:ZaPosixAccount.A_homeDirectory,label:ZaPosixAccount.A_homeDirectory, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged, width:250},
								{ref:ZaPosixAccount.A_loginShell, type:_TEXTFIELD_, msgName:ZaPosixAccount.A_loginShell,label:ZaPosixAccount.A_loginShell, labelLocation:_LEFT_, onChange:ZaTabView.onFormFieldChanged, width:250}
							]
				}	]
			};
		xFormObject.items[i].items.push(posixAccountTab);
	}
	ZaTabView.XFormModifiers["ZaAccountXFormView"].push(ZaPosixAccount.AccountXFormModifier);	
}

ZaPosixAccount.getNextUid = function () {
	var params = { 	query: "",
					sortBy: ZaPosixAccount.A_uidNumber,
					limit : 1,
					applyCos: 0,
					attrs:[ZaPosixAccount.A_uidNumber],
					types: [ZaSearch.ACCOUNTS],
					sortAscending:0,
				 };
					
	var result = ZaSearch.searchDirectory(params).Body.SearchDirectoryResponse;
	var list = new ZaItemList(ZaAccount, null);
	list.loadFromJS(result);
	var arr = list.getArray();		
	var nextAccountId  = !isNaN(zimbra_posixaccount.uidBase) ?  parseInt(zimbra_posixaccount.uidBase) + 1 : 1001;
	if(arr.length) {
		nextAccountId = parseInt(arr[0].attrs[ZaPosixAccount.A_uidNumber]) + 1;
	}
	return nextAccountId;
}

if(ZaXDialog.XFormModifiers["ZaNewAccountXWizard"]) {
	
	ZaPosixAccount.AccountXWizModifier= function (xFormObject) {
		var stepCounter = this.stepChoices.length;
		ZaNewAccountXWizard.POSIX_ACC_STEP = stepCounter+1;			
		this.stepChoices.push({value:ZaNewAccountXWizard.POSIX_ACC_STEP, label:"Posix Account"});
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

		var posixAccountStep={type:_CASE_, numCols:1, relevant:"instance[ZaModel.currentStep] == ZaNewAccountXWizard.POSIX_ACC_STEP",		
					items: [
						{type:_ZAWIZGROUP_, 
							items:[
								{ref:ZaPosixAccount.A_gidNumber, type:_TEXTFIELD_, msgName:ZaPosixAccount.A_gidNumber,label:ZaPosixAccount.A_gidNumber, labelLocation:_LEFT_, cssClass:"admin_xform_number_input"},
								{ref:ZaPosixAccount.A_uidNumber, type:_TEXTFIELD_, msgName:ZaPosixAccount.A_uidNumber,label:ZaPosixAccount.A_uidNumber, labelLocation:_LEFT_, width:250,
									getDisplayValue:function () {
										var val = this.getInstanceValue();
										if(!val)
											val = ZaPosixAccount.getNextUid();
										return val;
									}
								},
								{ref:ZaPosixAccount.A_homeDirectory, type:_TEXTFIELD_, msgName:ZaPosixAccount.A_homeDirectory,label:ZaPosixAccount.A_homeDirectory, labelLocation:_LEFT_, width:250},								
								{ref:ZaPosixAccount.A_loginShell, type:_TEXTFIELD_, msgName:ZaPosixAccount.A_loginShell,label:ZaPosixAccount.A_loginShell, labelLocation:_LEFT_, width:250}
							]
				}	]
			};
		xFormObject.items[i].items.push(posixAccountStep);
	}
	ZaXDialog.XFormModifiers["ZaNewAccountXWizard"].push(ZaPosixAccount.AccountXWizModifier);	
}
ZaPosixAccount.loadMethod = function(by, val, withCos) {
	
}

if(ZaItem.loadMethods["ZaAccount"]) {
	ZaItem.loadMethods["ZaAccount"].push(ZaPosixAccount.loadMethod);
}


zimbra_posixaccount.initSettings= function () {
	try {
		var soapDoc = AjxSoapDoc.create("GetAdminExtensionZimletsRequest", "urn:zimbraAdmin", null);	
		var command = new ZmCsfeCommand();
		var params = new Object();
		params.soapDoc = soapDoc;	
		var resp = command.invoke(params);
		var zimlets = null;
		try {
			if(resp && resp.Body && resp.Body.GetAdminExtensionZimletsResponse && resp.Body.GetAdminExtensionZimletsResponse.zimlets && resp.Body.GetAdminExtensionZimletsResponse.zimlets.zimlet) {
				zimlets = resp.Body.GetAdminExtensionZimletsResponse.zimlets.zimlet;
			}
		} catch (ex) {
			//go on
		}
		if(zimlets && zimlets.length > 0) {
			var cnt = zimlets.length;
			for(var ix = 0; ix < cnt; ix++) {
				if(zimlets[ix] && zimlets[ix].zimlet && zimlets[ix].zimlet[0] && zimlets[ix].zimletContext && zimlets[ix].zimletContext[0]) {
					var zimletConfig = zimlets[ix].zimletConfig[0];					
					if(zimletConfig.name=="zimbra_posixaccount") {
						var global = zimletConfig.global[0];
						if(global) {
							var properties = global.property;
							var cnt2 = properties.length;							
							for (var j=0;j<cnt2;j++) {
								zimbra_posixaccount[properties[j].name] = properties[j]._content;
							}
						}
						break;
					}
				} else {
					continue;
				}
			}
		}	
	} catch (ex) {
		//do nothing, do not block the app from loading
	}
}

if(ZaSettings.initMethods)
	ZaSettings.initMethods.push(zimbra_posixaccount.initSettings);
