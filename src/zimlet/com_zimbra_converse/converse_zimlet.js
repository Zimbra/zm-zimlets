function com_zimbra_converse_HandlerObject() {
}
com_zimbra_converse_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_converse_HandlerObject.prototype.constructor = com_zimbra_converse_HandlerObject;

/**
 * Simplify handler object
 *
 */
var ConverseZimlet = com_zimbra_converse_HandlerObject;

/**
 * Initializes the Zimlet.
 */
ConverseZimlet.prototype.init = function () {
	this._makeSpaceForConverseBar();
	//get pre-bind credentials
	var jsonObj = {GetBOSHSessionRequest:{_jsns:"urn:zimbraMail"}};
	appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, errorCallback:this._getSessionErrorCallack.bind(this), callback:this._getSessionCallack.bind(this)});
};

ConverseZimlet.prototype._getSessionCallack = function(response) {
	var resp = response.getResponse();
	var jid = resp.GetBOSHSessionResponse.XMPPSession.jid;
	var rid = resp.GetBOSHSessionResponse.XMPPSession.rid;
	var sid = resp.GetBOSHSessionResponse.XMPPSession.sid;
	var url = resp.GetBOSHSessionResponse.XMPPSession.bosh_url;
	
	//initialize ConverseJS
	require(['converse'], function (converse) {
		converse.initialize({
			prebind: true,
			bosh_service_url: "/http-bind/",
			show_controlbox_by_default:true,
			jid: jid,
			sid: sid,
			rid: rid
		});
	});
}

ConverseZimlet.prototype._getSessionErrorCallack = function() {
	appCtxt.getAppController().setStatusMsg(this.getMessage("prebind_error"), ZmStatusView.LEVEL_WARNING);
	return true;
}
define("jquery", [], function () { return jQuery; });

/**
 * Makes a div for converse in the skin
 */
ConverseZimlet.prototype._makeSpaceForConverseBar =
function () {
	var newDiv = document.getElementById("z_shell").appendChild(document.createElement('div'));
	newDiv.style.display = "block";
	newDiv.style.zIndex = 9000;
	newDiv.id = "conversejs";
	appCtxt.getAppViewMgr().fitAll();
};

