/*
Copyright (C) 2015-2017 Barry de Graaff
The MIT License

Copyright (C) 2013, 2014, 2015 Dennis Ploeger
The MIT License

Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010 Zimbra, Inc.
The contents of this file are subject to the Zimbra Public License
Version 1.3 ("License")

 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010 Zimbra, Inc.
 *
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.3 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * ***** END LICENSE BLOCK *****
 * @author Raja Rao DV rrao@zimbra.com
 *
 * Checks for attach* word in email and also if there is an attachment.
 * If the email does not have an attachment, throws missing-attachment alert dialog
 */

/**
 * Constructor
 */
function tk_barrydegraaff_attachalert_HandlerObject() {
}

tk_barrydegraaff_attachalert_HandlerObject.prototype = new ZmZimletBase();
tk_barrydegraaff_attachalert_HandlerObject.prototype.constructor = tk_barrydegraaff_attachalert_HandlerObject;

/**
 * Simplify Zimlet handler name.
 */
var ConfigurableAttachAlertZimlet = tk_barrydegraaff_attachalert_HandlerObject;

/**
 * Defines the "zimlet name".
 */
ConfigurableAttachAlertZimlet.ZIMLET_NAME = "ConfigurableAttachAlertZimlet";

/**
 * Initializes the zimlet.
 *
 */
ConfigurableAttachAlertZimlet.prototype.init =
function() {
      //Load localization strings with fallback
   ConfigurableAttachAlertZimlet.prototype.lang();
   ConfigurableAttachAlertZimlet.AttachmentAlertKeywordsDefault = ConfigurableAttachAlertZimlet.lang[0];
   ConfigurableAttachAlertZimlet.keywords = this.getUserPropertyInfo('AttachmentAlertKeywords').value ? this.getUserPropertyInfo('AttachmentAlertKeywords').value : ConfigurableAttachAlertZimlet.AttachmentAlertKeywordsDefault;
};

ConfigurableAttachAlertZimlet.prototype.lang = function () {
   var english = [];
   english[0] = 'attach,bijlage,adjunto,fichero adjunto,env\u00EDo el fichero,allegat';
   english[1] = 'No attachment(s) found. Continue?';
   english[2] = 'Attachment Alert preferences';
   english[3] = 'Keywords to look for in the email body:';
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_attachmentalert').handlerObject;
   ConfigurableAttachAlertZimlet.lang = [];
   for (i = 0; i < 100; i++) {
         ConfigurableAttachAlertZimlet.lang[i] = zimletInstance.getMessage(i.toString());
   }
   
   if(ConfigurableAttachAlertZimlet.lang[1].indexOf('???') == 0)
   {
      //Seems we are running from dev folder on the server, but not passed ?dev=1 in the browser, fallback to english
      ConfigurableAttachAlertZimlet.lang = english;            
   }
}


/**
 * Initializes the regular expression.
 *
 */
ConfigurableAttachAlertZimlet.prototype._initializeRegEx =
function() {
	if (this._attachWordsRegEx)
		return;
	this._attachStr = ConfigurableAttachAlertZimlet.keywords;
	this._errorMsgStr = ConfigurableAttachAlertZimlet.lang[1];
	this._attachWordsList = this._attachStr.split(",");
	this._attachWordsRegEx = [];
	for (var n = 0; n < this._attachWordsList.length; n++) {
		this._attachWordsRegEx.push(new RegExp("\\b" + this._attachWordsList[n], "ig"));
	}
};

/**
 * This method is called when sending an email. This function checks and sets/pushes value to
 * boolAndErrorMsgArray indicating if there was an error or not. If there was an error(i.e. attachment is missing),
 * then it will push {hasError:true, errorMsg:"Attachment is missing", zimletName:"ConfigurableAttachAlertZimlet"} hash-object to boolAndErrorMsgArray array.
 *  If there are no errors, it will simply return <code>null</code>.
 *
 * @param {ZmMailMsg} mail 		the mail object
 * @param {array} boolAndErrorMsgArray	an array of hash objects
 */
ConfigurableAttachAlertZimlet.prototype.emailErrorCheck =
function(mail, boolAndErrorMsgArray) {  
   // check if we have attachments...
	if(mail._filteredFwdAttIds){
		if(mail._filteredFwdAttIds.length > 0)
			return null; // has attachments, do not bother
	}
	if(mail._forAttIds){
		if(mail._forAttIds.length > 0)
			return null; // has attachments, do not bother
	}

	this._initializeRegEx();
	this._ignoreWords = [];
	if (mail.isReplied || mail.isForwarded) {
		this._createIgnoreList(mail._origMsg);
	}
	var attachWordsThatExists = "";
	var newMailContent = mail.textBodyContent;

	var hasattachWordStr = false;
	for (var k = 0; k < this._attachWordsRegEx.length; k++) {
		var attachWord = this._attachWordsRegEx[k];
		var newMailArry = newMailContent.match(attachWord);
		if (!newMailArry)
			continue;

		var newMailLen = newMailArry.length;
		//if the number of attachWords in the new mail is same as origMail, skip it
		if (this._ignoreWords[attachWord] != undefined) {
			if (newMailLen <= this._ignoreWords[attachWord]) {
				hasattachWordStr = false;
				continue;
			}
		}
		hasattachWordStr = true;
		break;

	}

	if (!hasattachWordStr)
		return null;

	//there is a word "attach*" in new mail but not in old-mail
	var errParams = {
			hasError:true,
			errorMsg: this._errorMsgStr,
			zimletName:ConfigurableAttachAlertZimlet.ZIMLET_NAME
	};

	return boolAndErrorMsgArray.push(errParams);
};

/**
 * Creates an ignore list.
 *
 * @param {ZmMailMsg} origMail		the original Mail message that the user is replying/forwarding
 */
ConfigurableAttachAlertZimlet.prototype._createIgnoreList =
function(origMail) {
	var bodyContent = origMail.getBodyContent();
	if(!bodyContent) {//do null check
		return;
	}
	for (var k = 0; k < this._attachWordsRegEx.length; k++) {
		var attachWord = this._attachWordsRegEx[k];
		var mailArry = bodyContent.match(attachWord);
		if (!mailArry) {
			continue;
		}
		this._ignoreWords[attachWord] = mailArry.length;
	}
};

/**
 * Called when the zimlet is double-clicked.
 */
ConfigurableAttachAlertZimlet.prototype.doubleClicked = function() {
	this.singleClicked();
};

/**
 * Called when the zimlet is single-clicked.
 */
ConfigurableAttachAlertZimlet.prototype.singleClicked = function() {
	this._showPrefDialog();
};

/* Work-around 8.7.7 regression
*  Bug: https://bugzilla.zimbra.com/show_bug.cgi?id=107013
*  Fix: https://github.com/Zimbra/zm-ajax/pull/5
*/ 
DwtControl.prototype._position =
function(loc) {
      this._checkState();
      var sizeShell = this.shell.getSize();
      var sizeThis = this.getSize();
      var x, y;
      if(sizeThis)
      {
         if (!loc) {
            // if no location, go for the middle
            x = Math.round((sizeShell.x - sizeThis.x) / 2);
            y = Math.round((sizeShell.y - sizeThis.y) / 2);
         } else {
            x = loc.x;
            y = loc.y;
         }
         // try to stay within shell boundaries
         if ((x + sizeThis.x) > sizeShell.x) {
            x = sizeShell.x - sizeThis.x;
         }
         if ((y + sizeThis.y) > sizeShell.y) {
            y = sizeShell.y - sizeThis.y;
         }
         this.setLocation(x, y);
      }
};

/**
 * Shows the preferences dialog.
 *
 */
ConfigurableAttachAlertZimlet.prototype._showPrefDialog =
function() {
   this._dialog = new ZmDialog( { title:ConfigurableAttachAlertZimlet.lang[2], parent:this.getShell(), standardButtons:[DwtDialog.CANCEL_BUTTON,DwtDialog.OK_BUTTON], disposeOnPopDown:true } );
   this._dialog.setContent(ConfigurableAttachAlertZimlet.lang[3]+'<br><br><input type="text" id="ConfigurableAttachAlertZimletKeywords" style="width:350px" value="'+ ConfigurableAttachAlertZimlet.keywords +'"><br><br><button onclick="document.getElementById(\'ConfigurableAttachAlertZimletKeywords\').value=\'$disabled\'">'+ZmMsg['chatFeatureDisabled']+'</button><button onclick="document.getElementById(\'ConfigurableAttachAlertZimletKeywords\').value=\''+ConfigurableAttachAlertZimlet.AttachmentAlertKeywordsDefault+'\'">'+ZmMsg['restoreDefaults']+'</button><br><br>'+ZmMsg['afterReload']);
   this._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okBtnListner));
   this._dialog.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._cancelBtn));
   this._dialog._setAllowSelection();
   document.getElementById(this._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(this._dialog.__internalId+'_title').style.textAlign = 'center';
   this._dialog.popup();
};

/**
 * Listens for the OK button event.
 *
 * @see		_showPrefDialog
 */
ConfigurableAttachAlertZimlet.prototype._okBtnListner =
function() {   
   if(document.getElementById('ConfigurableAttachAlertZimletKeywords').value == '')
   {
      document.getElementById('ConfigurableAttachAlertZimletKeywords').value = '$disabled';
   }
   this.setUserProperty('AttachmentAlertKeywords', document.getElementById('ConfigurableAttachAlertZimletKeywords').value, true);
   ConfigurableAttachAlertZimlet.keywords = document.getElementById('ConfigurableAttachAlertZimletKeywords').value;
	try{
      this._dialog.popdown();
   } catch (err) { }
};

/* This method is called when the dialog "CANCEL" button is clicked
 */
ConfigurableAttachAlertZimlet.prototype._cancelBtn =
function() {
   try{
      this._dialog.setContent('');
      this._dialog.popdown();
   } catch (err) { }
};
