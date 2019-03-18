/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2011, 2013, 2014, 2016, 2019 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2011, 2013, 2014, 2016, 2019 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Defines the Zimlet handler class.
 *
 */

Com_Zimbra_Tos = function () {
	if (this instanceof Com_Zimbra_Tos) {
		Com_Zimbra_Tos = this;
	}
};

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 *
 */

Com_Zimbra_Tos.prototype = new ZmZimletBase();

/**
* This method gets called by the Zimlet framework when the zimlet loads.
*
*/
Com_Zimbra_Tos.prototype.init = function() {
	this._showPreferenceDlg();

};

/**
 * Display Terms Of Services Dialog.
 *
 */
Com_Zimbra_Tos.prototype._showPreferenceDlg =
 function() {
	//if zimlet dialog already exists...
	if (this._preferenceDialog) {
		this._preferenceDialog.popup();
		return;
	}
	this._preferenceView = new DwtComposite(this.getShell());
	this._preferenceView.getHtmlElement().style.overflow = "auto";
	this._preferenceView.getHtmlElement().innerHTML = this._createPrefView();
	this._preferenceDialog = this._createDialog({title: this.getMessage("TosZimlet_label"), view: this._preferenceView, standardButtons: [DwtDialog.OK_BUTTON], id: "TosZimletPref"});
	this._preferenceDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okPreferenceBtnListener));
	this._preferenceDialog.setButtonEnabled(DwtDialog.OK_BUTTON, false);
	
	this.acceptedtos = Boolean(this.getUserProperty("terms_services_accepted"));

	document.getElementById("tos_accept_div1").checked = this.acceptedtos;
	if (!this.acceptedtos) {
		this._preferenceDialog.popup();
	}
 }
 
/**
 * Creates preferences view
 */
Com_Zimbra_Tos.prototype._createPrefView =
function() {
	return [
		"<div class='toscontent'>",
		this.getMessage("TosZimlet_content"),
		"</div>",
		"<div class='tosDialog'>",
		"<input id='tos_accept_div1' type='checkbox' onchange='tosChecked(this);' />",
		this.getMessage("TosZimlet_description"),
		"</div>"
	].join("");
};

/**
 * Listens for the OK preferences button.
 * 
 */
Com_Zimbra_Tos.prototype._okPreferenceBtnListener =
function() {
	this._preferenceDialog.popdown();
	var domVal = document.getElementById("tos_accept_div1").checked;
	this.setUserProperty("terms_services_accepted", domVal, true);
	document.getElementById("tos_accept_div1").setAttribute("disabled","true");
};

/**
 * Listens for the Checkbox.
 * 
 */
function tosChecked(checkbox) {
	if(document.getElementById("tos_accept_div1").checked) {
		Com_Zimbra_Tos._preferenceDialog.setButtonEnabled(DwtDialog.OK_BUTTON, true);
	}
};
