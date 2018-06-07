var timer;
var undoSendInstance;
it_wordpower_undosend_HandlerObject = function() {
};



it_wordpower_undosend_HandlerObject.prototype = new ZmZimletBase;
it_wordpower_undosend_HandlerObject.prototype.constructor = it_wordpower_undosend_HandlerObject;
it_wordpower_undosend_HandlerObject.prototype.init= function() {
	undoSendInstance = appCtxt._zimletMgr.getZimletByName('it_wordpower_undosend').handlerObject;
};



it_wordpower_undosend_HandlerObject.prototype.initializeToolbar= function(app,toolbar,controller,viewId) {
	var viewType = appCtxt.getViewTypeFromId(viewId);
	if (viewType == "COMPOSE") {	
		var sendButton=toolbar.getButton('SEND');
	
		if (sendButton)
		{
			console.log(sendButton);
			sendButton.removeSelectionListeners();
			sendButton.addSelectionListener(new AjxListener(undoSendInstance, undoSendInstance._sendDelayed, [controller]));
		}
		else
		{
			sendButton=toolbar.getButton('SEND_MENU');
			if (sendButton)
			{
				console.log(sendButton);
				sendButton.removeSelectionListeners();
				sendButton.addSelectionListener(new AjxListener(undoSendInstance, undoSendInstance._sendDelayed, [controller]));
			}
		}	
	

	}
	
	
};



function startTimer(seconds, display,controller) {
	display.textContent = seconds;
	seconds--;
	timer=setInterval(function () {
		display.textContent = seconds;

		if (--seconds < 0) {
			stopTimer();
			undoSendInstance._sendMessage(controller);	
		}
	}, 1000);
}

function stopTimer() {
	clearInterval(timer);
}

it_wordpower_undosend_HandlerObject.prototype._sendDelayed=function(controller)
{
	var en=undoSendInstance.getUserProperty("enabled");
	var se=undoSendInstance.getUserProperty("seconds");
	//console.log(en);
	//console.log(se);
	if(en == "1")
	{
		undoSendInstance._dialogDelay = new DwtDialog( { title:undoSendInstance.getMessage("lbl_title"), parent:undoSendInstance.getShell(), standardButtons:[DwtDialog.CANCEL_BUTTON,DwtDialog.OK_BUTTON], disposeOnPopDown:true } );
		undoSendInstance._dialogDelay.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(undoSendInstance, undoSendInstance._sendMessage,[controller]));
		undoSendInstance._dialogDelay.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(undoSendInstance, undoSendInstance._stopTimer,[controller]));
		undoSendInstance._dialogDelay.setContent('<div>'+undoSendInstance.getMessage("lbl_sending_email_start_at")+' <span id="time"></span> '+undoSendInstance.getMessage("lbl_sending_email_start_at_end")+'</div>');
	
		var seconds = undoSendInstance.getUserProperty("seconds");
		if(seconds<=0)
		{
			seconds=10;
		}
		display = document.querySelector('#time');
	    	startTimer(seconds, display,controller);
		undoSendInstance._dialogDelay.popup();
	}
	else
	{
		stopTimer();
		controller._send();
	}
	

};
	
it_wordpower_undosend_HandlerObject.prototype._sendMessage=function(controller)
{
	stopTimer();
	controller._send();
	undoSendInstance._dialogDelay.popdown();

};
it_wordpower_undosend_HandlerObject.prototype._stopTimer=function(controller)
{
	stopTimer();
	undoSendInstance._dialogDelay.popdown();

};

/************** PREFERENCES DIALOG **********************/
/**
 * Called when the zimlet is double-clicked.
 */
it_wordpower_undosend_HandlerObject.prototype.doubleClicked = function() {
	this._displayPrefDialog();
};



it_wordpower_undosend_HandlerObject.prototype._displayPrefDialog =function() {
	if(undoSendInstance.prefDlg)
	{
		undoSendInstance.prefDlg.popup();
		return;	
	}
	var seconds=undoSendInstance.getUserProperty("seconds");
	console.log(seconds);
	var enabled=undoSendInstance.getUserProperty("enabled");
	console.log(enabled);
	undoSendInstance.pView = new DwtComposite(undoSendInstance.getShell());
	undoSendInstance.pView.getHtmlElement().style.overflow = "auto";
	var html='<table style="min-width:250px;"><tr><td>'+undoSendInstance.getMessage("lbl_activate_zimlet")+'</td><td><input type="checkbox" id="undosend_enabled"  '+(enabled == "1"?'checked':'')+' /></td><tr><td>'+undoSendInstance.getMessage("lbl_num_seconds")+'</td><td><input onblur="return checkValue();" id="undosend_seconds" type="number" value="'+seconds+'" min="0" max="30" /></td></tr></table>';
	console.log(html);
	undoSendInstance.pView.getHtmlElement().innerHTML = html;
	
	undoSendInstance.prefDlg = undoSendInstance._createDialog({title:undoSendInstance.getMessage("lbl_setup"), view:undoSendInstance.pView, standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
	undoSendInstance.prefDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(undoSendInstance, undoSendInstance._prefOKBtnListener));
	undoSendInstance.prefDlg.popup();
};

function checkValue(){
	var zseconds=document.getElementById("undosend_seconds").value;
	var zenabled = document.getElementById("undosend_enabled").checked?"1":"0";
	//console.log(zseconds);
	//console.log(zenabled);
	if((zseconds<1)||(zseconds>30))
	{
		//alert(undoSendInstance.getMessage("lbl_min_value"));		
		showErrorNotification(undoSendInstance.getMessage("lbl_error"),undoSendInstance.getMessage("lbl_min_value"),"");
		if (zseconds<1) document.getElementById("undosend_seconds").value="1";
		if (zseconds>30) document.getElementById("undosend_seconds").value="30";
		document.getElementById("undosend_seconds").focus();
		return false;	
	}
	else {
		return true;
	}
}

it_wordpower_undosend_HandlerObject.prototype._prefOKBtnListener =function() {

	var zseconds=document.getElementById("undosend_seconds").value;
	var zenabled = document.getElementById("undosend_enabled").checked?"1":"0";
	
	var bool = checkValue();
	if (bool==false) return false;
	undoSendInstance.setUserProperty("seconds", zseconds, true);
	undoSendInstance.setUserProperty("enabled", zenabled, true);

	undoSendInstance.prefDlg.popdown();
};
/**************  DIALOG **********************/
function showErrorNotification(title,content,info)
{
	
	var dlg;
	dlg=appCtxt.getErrorDialog();
	dlg.reset();
	dlg.setMessage(content,info, DwtMessageDialog.CRITICAL_STYLE,title);
	
	dlg.popup();
	
}