//Zimlet Class
function com_zimbra_zss_HandlerObject() {
	
}

//Make Zimlet class a subclass of ZmZimletBase class - this is what makes a JS class a Zimlet
com_zimbra_zss_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_zss_HandlerObject.prototype.constructor = com_zimbra_zss_HandlerObject;


var ZssZimlet = com_zimbra_zss_HandlerObject;

ZssZimlet.prototype.init = function(){
	this.vaultPath = this.getUserProperty("zss_url");
	
	this.messages = {
		menuItemTxt: this.getMessage('menuItem'),
		noFilesFound: this.getMessage('noFilesFound'),
		fetchingContentMsg: this.getMessage('fetchingContent'),
		addFilesAsAttachment: this.getMessage('addFileAsAttachment'),
		attachingFileNotification : this.getMessage('attachingFileNotification'),
		selectFilesDialogTitle : this.getMessage('selectFilesDialogTitle'),
		chooseFolderDialogTitle : this.getMessage('chooseFolderDialogTitle'),
		fileSavedToVault: this.getMessage('fileSavedToVault'),
		saveToVaultLink: this.getMessage('saveToVaultLink'),
		refreshFolderBtnText: this.getMessage('refreshFolderBtnText')
	};
	

	// Add Save Attachment to Vault options in email
	if (appCtxt.get(ZmSetting.MAIL_ENABLED)) {
		AjxPackage.require({name:"MailCore", callback:new AjxCallback(this, this.addAttachmentHandler)});
	}
}

/*
	Add Zimbra Sync and Share option to attach menu
*/
ZssZimlet.prototype.initializeAttachPopup =
function(menu, controller) {
	var mi = controller._createAttachMenuItem(menu,this.messages.menuItemTxt,
			new AjxListener(this, this.showVaultFileChooser));
};




/*
	ADD VAULT FILE AS AN ATTACHMENT
*/

// code for showing Vault file chooser in a dialog and 
// providing user the ability to select file.
// provide ability to select whether to save vault file as an attachment or a link?
// call -> processSelectedVaultFile
ZssZimlet.prototype.showVaultFileChooser =
function() {
	if(this.dialog){
		this.fileExplorer.clearSelection();
		//FUNC: uncomment this if add as attachment is enabled
		// this.addAsAttachmentCheckbox.setSelected(false);
		this.dialog.popup();
		return;
	}	

	this.dialogView = new DwtComposite(this.getShell());
	this.dialogView.setSize(560, 320); //set width and height
	this.dialogView.getHtmlElement().style.overflow = "hidden"; //adds scrollbar
	
	
	this.dialog = this._createDialog({
							title: this.messages.selectFilesDialogTitle,
							view:this.dialogView, 	
							standardButtons:[
								DwtDialog.OK_BUTTON, 
								DwtDialog.CANCEL_BUTTON
							]
						});

	this.dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._processSelectedVaultFile));

	if(!this.fileExplorer){
		this.fileExplorer = new com_zimbra_zss_Explorer({
			rootContainer : this.dialogView,
			vaultPath: this.vaultPath,
			dialog: this.dialog,
			noFilesMsg: this.messages.noFilesFound,
			fetchingContentMsg: this.messages.fetchingContentMsg,
			refreshFolderBtnText: this.messages.refreshFolderBtnText

		});
	}
	
	//FUNC: uncomment this if add as attachment is enabled
	// this.addAsAttachmentCheckbox = new DwtCheckbox({
	// 	parent: this.dialogView,
	// 	style: DwtCheckbox.TEXT_RIGHT,
	// 	name: 'zss_add_as_attachment',
	// 	id: Dwt.getNextId()
	// });
	// this.addAsAttachmentCheckbox.setText(this.messages.addFilesAsAttachment);

	//show the dialog
	this.dialog.popup();
};

// Get the info of the file selected by the user 
// addFileAsAttachment == true? (addFilesAsAttachment)
// else add the link to the message. (addFilesAsLinkInMsg)
ZssZimlet.prototype._processSelectedVaultFile =
function() {
	this.dialog.popdown();
	var selectedFiles = this.fileExplorer.getSelection();
	if( selectedFiles.length ) {
		//FUNC: uncomment this if add as attachment is enabled
		//var insertAsAttachment = this.addAsAttachmentCheckbox.isSelected();
		
		var insertAsAttachment = false;
		if(insertAsAttachment) {
			this.addFilesAsAttachment(selectedFiles);
		}
		else {
			this.addFilesAsLinkInMsg(selectedFiles);
		}
	}
};

// add the file path as a link
ZssZimlet.prototype.addFilesAsLinkInMsg =
function(files) {
	var view = appCtxt.getCurrentView();
	var editor = view.getHtmlEditor();
	var editorContent =  editor.getContent();
	var isHtml = view && view.getComposeMode() === "text/html";
	if (isHtml) {
		var ed = editor.getEditor();
		for(var i = 0, len = files.length; i < len; i++) {
			var div = generateHTML(files[i]);
			//tinymce modifies the source when using mceInsertContent
			ed.execCommand('mceInsertRawHTML', false, div, {skip_undo : 1});
		}
	} else {
		for(var i = 0, len = files.length; i < len; i++) {
			view.getHtmlEditor().setContent(editorContent + "\n" + files[i].name + " : " + files[i].path + "\n");
		}
	}	

	this.addGeneratedLinksToMsgMetadata(files);
	
	function generateHTML(file){
		var thumbnail = file.content.file.thumbnail.uri;
		var fileName = file.content.file.name;
		var filePath = file.content.file.content.uri;

		var div = '<div style="background-color:rgb(245, 245, 245); padding:10px 14px; margin-right:10px; color:rgb(34, 34, 34);display:inline-block;margin-left:10px; '; 
			div+='font-family:arial; font-style:normal; font-weight:bold; font-size:13px; cursor:default; border:1px solid rgb(221, 221, 221); float:left;text-align: center;">';
			div+='<a href="' + filePath + '/inline/" target="_blank"><img style="margin-bottom:7px; border:none;" height="64" src="' + thumbnail + '?s=preview"></a>';
			div+='<div dir="ltr" title="' + fileName + '" style="color:rgb(17, 85, 204); text-decoration:initial; vertical-align:bottom;">';
			div+='<a href="' + filePath + '/inline/" target="_blank" style=" display:inline-block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-decoration:none; text-align:center; cursor:pointer;padding:1px 0; border:none; max-width:200px;">' + fileName + '</div></a>';
			div+='</div><div style="clear:both"><br/></div>';

		return div;
	}
};

//save metadata info about the links to message draft
ZssZimlet.prototype.addGeneratedLinksToMsgMetadata = 
function(files) {
	//first we have to save the draft and get a messageID
	var view = appCtxt.getCurrentView();
	var callback = new AjxCallback(this, this._handleSaveDraftCallback,[files]);
	
	// Need to save the msg as draft to add the attachment
	view._controller.saveDraft(ZmComposeController.DRAFT_TYPE_MANUAL, null, null, callback, null);
}

ZssZimlet.prototype._handleSaveDraftCallback =
function(files,resp) {
	//Enable attach button.
	if(files && resp) {
		var response = resp.getResponse();
		if(response && response.m && response.m.length && response.m[0] && response.m[0].id) {
			
			var metaData = new ZmMetaData(appCtxt.getActiveAccount(), response.m[0].id);
			var keyVals = [];
			var linkSecurityMeta = [];
			var secureFiles = [];
			var publicFiles = [];
			for(var i = 0, len = files.length; i < len; i++) {
				if(files[i] && files[i].content && files[i].content.file && files[i].content.file.content && files[i].content.file.name && files[i].content.file.content.uri) {
					keyVals[files[i].content.file.name] = files[i].content.file.content.uri;
					//TODO: check if file is being attached as secure link or as public link and add to appropriate array 
					secureFiles.push(files[i].content.file.name);
				}
			}
			
			metaData.set("zssLinkList", keyVals, null, null, null, false);
			
			//now set metadata about secucity 
			//TODO: add a checkbox "set secure" to the file selector and set this value based on the checkbox
			
			linkSecurityMeta["secureFiles"] = secureFiles.join(",");
			linkSecurityMeta["publicFiles"] = publicFiles.join(",");
			metaData.set("zssLinkSecurity", linkSecurityMeta, null, null, null, false);
		}
	}
	//Add error handling here.
};


// send file details to the server to download it and create an attachmentId.
ZssZimlet.prototype.addFilesAsAttachment =
function(selectedFiles) {
	if(selectedFiles.length) {
		//Get the collection of Attachment Requests
		var requests = this._createAttachmentRequests(selectedFiles);
		var jsonObj = {
			BatchRequest: {
				_jsns: "urn:zimbra",
				AttachMezeoFileRequest: requests
			}
		}
	   var params = {
	        jsonObj: jsonObj,
	        asyncMode: true,
	        callback: (new AjxCallback(this, this._addGeneratedAttachmentIdsToMsg)),
	        errorCallback: (new AjxCallback(this, this._addGeneratedAttachmentIdsToMsgError))
	    };
		appCtxt.getAppController().setStatusMsg(this.messages.attachingFileNotification, ZmStatusView.LEVEL_INFO);
		appCtxt.getAppController().sendRequest(params);
		
	}
};

// Create Individual Attachment requests and return the array of requests
ZssZimlet.prototype._createAttachmentRequests = 
function (files) {
	var requests = [];

	for (var i = files.length - 1; i >= 0; i--) {
		var file = files[i];
		var AttachMezeoFileRequest = {
			"_jsns" : "urn:zimbraMail",
			attach : { 
				uri: file.path
			}
		};
		
		requests.push(AttachMezeoFileRequest);
	};
	return requests;
}

ZssZimlet.prototype._addGeneratedAttachmentIdsToMsg =
function(response) {
	response = response.getResponse();

	//To save multiple attachments in a draft we require a comma separated string of attachment ids.
	var attachmentIds = this._getAttachmentIdsFromResponse(response);
	var view = appCtxt.getCurrentView();
	var callback = new AjxCallback(this, this._handleSaveDraftCallback);
	
	// Need to save the msg as draft to add the attachment
	view._controller.saveDraft(ZmComposeController.DRAFT_TYPE_MANUAL, attachmentIds, null, callback, null);
};

// Returns a string of comma separated attachment ids
ZssZimlet.prototype._getAttachmentIdsFromResponse = 
function (response) {
	var attachmentIds = [];
	var attachMezeoFileResponse = response.BatchResponse.AttachMezeoFileResponse;
	for(var i = 0, len = attachMezeoFileResponse.length; i < len; i++) {
		var attachResponse = attachMezeoFileResponse[i];
		attachmentIds.push(attachResponse.attach.aid);
	}
	return attachmentIds.join(",");
}

ZssZimlet.prototype._addGeneratedAttachmentIdsToMsgError =
function(response) {
	// handle server errors if any while creating the attachment using mezeo path.
	appCtxt.getAppController().setStatusMsg(response.msg, ZmStatusView.LEVEL_WARNING);
};






/*
	SAVE ATTACHMENT FROM EMAIL TO VAULT
*/
ZssZimlet.prototype.addAttachmentHandler = function()
{
	this._msgController = AjxDispatcher.run("GetMsgController");
	var viewType = appCtxt.getViewTypeFromId(ZmId.VIEW_MSG);
	this._msgController._initializeView(viewType);

	for (var mimeType in ZmMimeTable._table ) {
		this._msgController._listView[viewType].addAttachmentLinkHandler(mimeType,"Vault",this.addVaultLink);
	}
	
};
ZssZimlet.prototype.addVaultLink = 
function(attachment) {
	var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_zss').handlerObject;
	var html =
			"<a href='#' class='AttLink' style='text-decoration:underline;' " +
					"onClick=\"ZssZimlet.saveAttachmentToVault('" + attachment.mid + "','" + attachment.part + "','" + attachment.label+ "', '" + attachment.ct + "')\">"+
					zimletInstance.messages.saveToVaultLink +
					"</a>";
	
	return html;
};

ZssZimlet.saveAttachmentToVault =
function(attachmentId, part, name) {
	var attachment = {
		id: attachmentId,
		part: part,
		name: name
	}
	var self = appCtxt._zimletMgr.getZimletByName('com_zimbra_zss').handlerObject;
 	
 	if(self.folderChooserDialog){
		self.folderExplorer.clearSelection();
		self.folderChooserDialog.popup();
		return;
	}	

	self.dialogFolderView = new DwtComposite(self.getShell());
	self.dialogFolderView.setSize(560, 320); //set width and height
	self.dialogFolderView.getHtmlElement().style.overflow = "hidden"; //adds scrollbar
	
	
	self.folderChooserDialog = self._createDialog({
							title: self.messages.chooseFolderDialogTitle,
							view:self.dialogFolderView, 	
							standardButtons:[
								DwtDialog.OK_BUTTON, 
								DwtDialog.CANCEL_BUTTON
							]
						});

	self.folderChooserDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(self, self._useSelectedVaultContainer, attachment));

	if(!self.folderExplorer){
		self.folderExplorer = new com_zimbra_zss_Explorer({
			rootContainer : self.dialogFolderView,
			vaultPath: self.vaultPath,
			dialog: self.dialog,
			isFolderExplorer: true,
			noFilesMsg: self.messages.noFilesFound,
			fetchingContentMsg: self.messages.fetchingContentMsg,
			refreshFolderBtnText: self.messages.refreshFolderBtnText
		});
	}
	self.folderChooserDialog.popup();
};

ZssZimlet.prototype._useSelectedVaultContainer =
function(attachment) {
	this.folderChooserDialog.popdown();
	var selectedContainer = this.folderExplorer.getSelection();
	if(selectedContainer.length) {
		// Send the details to the server to save the attachment to the selected vault container.
		var jsonObj = {SaveAttachmentToMezeoRequest: {"_jsns": "urn:zimbraMail"}};
		var request = jsonObj.SaveAttachmentToMezeoRequest;
		
		request.attach = {
							mid: attachment.id,
							part: attachment.part,
							name: attachment.name,
							uri: selectedContainer[0].path
						};

	    var params = {
	        jsonObj: jsonObj,
	        asyncMode: true,
	        callback: (new AjxCallback(this, this._handleSaveAttachmentToVaultResponse)),
	        errorCallback: (new AjxCallback(this, this._addGeneratedAttachmentIdsToMsgError))
	    };
	    appCtxt.getAppController().sendRequest(params);
	}
};

ZssZimlet.prototype._handleSaveAttachmentToVaultResponse =
function(response) {
	response = response.getResponse();
	// make this more robust
	if(response.SaveAttachmentToMezeoResponse.attach.uri) {
		appCtxt.getAppController().setStatusMsg(this.messages.fileSavedToVault, ZmStatusView.LEVEL_INFO);
	}
};
ZssZimlet.prototype._handleSaveAttachmentToVaultError =
function(error) {
	//handle save to vault error
	console.log(error);
};
