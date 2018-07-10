/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2011, 2013, 2014, 2016, 2018 Synacor, Inc. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 *
 * ***** END LICENSE BLOCK *****
 */

/**
 * Constructor.
 */
function Com_Zimbra_Email_Templates() {
}
Com_Zimbra_Email_Templates.prototype = new ZmZimletBase();
Com_Zimbra_Email_Templates.prototype.constructor = Com_Zimbra_Email_Templates;

//--------------------------------------------------------------------------------------------------
// INITIALIZE TOOLBAR MENU BUTTON
//--------------------------------------------------------------------------------------------------
Com_Zimbra_Email_Templates.prototype.initializeToolbar =
function(app, toolbar, controller, viewId) {

	if (!this._viewIdAndMenuMap) {
		this._viewIdAndMenuMap = [];
	}

	this.viewId = appCtxt.getViewTypeFromId(viewId);
    this._currentViewId = this.viewId;

	if (this.viewId.indexOf("COMPOSE") >= 0) {
		if (toolbar.getOp("EMAIL_TEMPLATES_ZIMLET_TOOLBAR_BUTTON")) {
			return;
		}
		//get the index of View menu so we can display it after that.
		var buttonIndex = 3;

		//create params obj with button details
		var buttonArgs = {
			text	: this.getMessage("label"),
			tooltip: this.getMessage("EmailTemplatesZimlet_tooltip"),
			index: buttonIndex, //position of the button
			image: "zimbraicon" //icon
		};

		//toolbar.createOp api creates the button with some id and  params containing button details.
		var button = toolbar.createOp("EMAIL_TEMPLATES_ZIMLET_TOOLBAR_BUTTON", buttonArgs);
		var menu = new ZmPopupMenu(button); //create menu
		button.setMenu(menu);//add menu to button
		button.noMenuBar = true;
		this._viewIdAndMenuMap[this.viewId] = {menu:menu, controller:controller, button:button};
		button.removeAllListeners();
		button.removeDropDownSelectionListener();
		button.addSelectionListener(new AjxListener(this, this._addMenuItems, [button, menu]));
		button.addDropDownSelectionListener(new AjxListener(this, this._addMenuItems, [button, menu]));
	}
};


//--------------------------------------------------------------------------------------------------
// GET TEMPLATE NAMES FOR USER BASED on LDAP ATTRIBUTES   (Domain + User Spcific)
//--------------------------------------------------------------------------------------------------
Com_Zimbra_Email_Templates.prototype._addMenuItems =
function(removeChildren, result) {
	var domainTemplateIds = appCtxt.getSettings().getInfoResponse.attrs._attrs.zimbraDomainTemplateID;
	var userTemplateIds   = appCtxt.getSettings().getInfoResponse.attrs._attrs.zimbraCustomTemplateID;

	var allTemplateIds = '';
	if(typeof(domainTemplateIds) != undefined ) {
		allTemplateIds += domainTemplateIds;
	}
	if(typeof(userTemplateIds) != undefined ) {
		if(allTemplateIds != '') { 
			allTemplateIds += ',';
		}
		allTemplateIds += userTemplateIds;
	}

	var menu = this._viewIdAndMenuMap[this._currentViewId].menu;

	// Prevents the situation of all the items being added twice to the menu
	if (menu.getItemCount() > 0) removeChildren = true;
	if (removeChildren) {
		menu.removeChildren();
	}

	if(allTemplateIds != "") {
		var hostname = window.location.origin;
		var jspUrl   = hostname + "/public/templatesProxy.jsp?id=" + allTemplateIds;
		var response = AjxRpc.invoke(null, jspUrl, null, null, true);

		if (response.success == true) {
			var jsonData = JSON.parse(response.text);
			if (jsonData.count > 0) {
				for (var i = 0; i < jsonData.count; i++) {
					var templateData = jsonData.result[i];
					var mi = menu.createMenuItem(templateData.Id, {image:"Edit", text:templateData.Template_Name});
					mi.addSelectionListener(new AjxListener(this, this.templateClick, templateData));
				}
			} else {
				menu.createMenuItem("No_Templates", {text: "No template assigned"});
			}
		} else {
			menu.createMenuItem("No_Templates", {text: "No template available"});
			console.log(response);
		}
	} else {
		menu.createMenuItem("No_Templates", {text: "No template assigned"});
	}

	var button = this._viewIdAndMenuMap[this._currentViewId].button;
	var bounds = button.getBounds();
	menu.popup(0, bounds.x, bounds.y + bounds.height, false);
};

//--------------------------------------------------------------------------------------------------
// GET TEMPLATE DATA BASED ON TEMPLATE AND UPDATE THE EDITOR CONTENT WITH TEMPLATE DATA
//--------------------------------------------------------------------------------------------------
Com_Zimbra_Email_Templates.prototype.templateClick = function(params) {
	var templateMsg = params.Template_Header + "<br/ ><br/ >";
	templateMsg += params.Template_Body + "<br/ ><br/ >";
	templateMsg += params.Template_Footer;
	
	var composeView = appCtxt.getCurrentView();
	composeView.getHtmlEditor().setContent(templateMsg);
};
