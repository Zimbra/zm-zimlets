/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2022 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2022 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

function com_zimbra_gotourl_handlerObject() {
}

com_zimbra_gotourl_handlerObject.prototype = new ZmZimletBase();
com_zimbra_gotourl_handlerObject.prototype.constructor = com_zimbra_gotourl_handlerObject;

com_zimbra_gotourl_handlerObject.prototype.init =
function() {
    var text = this.getMessage("goToUrl");
    this._op = ZmOperation.registerOp(ZmId.OP_GO_TO_URL, {image:"URL", translatedText: text});
};

com_zimbra_gotourl_handlerObject.prototype._goToUrlListener =
function(controller, ev) {
    var addr = this._getAddress(controller._actionEv.address);
    var parts = addr.split("@");
    if (!parts.length) {
        return;
    }
    var domain = parts[1];
    var pieces = domain.split(".");
    var url = "https://" + (pieces.length <= 2 ? "www." + domain : domain);
    window.open(url, "_blank");
};

com_zimbra_gotourl_handlerObject.prototype._getAddress =
function(obj) {
    return obj.isAjxEmailAddress ? obj.address : obj;
};

com_zimbra_gotourl_handlerObject.prototype.onBubbleActionMenuOps =
function(controller, ops) {
    if (!controller || !ops) {
        return;
    }
    var newMsgIndex = -1;
    var contactIndex = -1;
    for (var i = 0; i < ops.length; i++) {
        if (ops[i] === ZmOperation.NEW_MESSAGE) {
            newMsgIndex = i;
        } else if (ops[i] === ZmOperation.CONTACT) {
            contactIndex = i;
        }
    }
    if (contactIndex > 0) {
        ops.splice(contactIndex + 1, 0, ZmOperation.GO_TO_URL);
    } else if (newMsgIndex > 0) {
        ops.splice(newMsgIndex + 1, 0, ZmOperation.GO_TO_URL);
    }
};

com_zimbra_gotourl_handlerObject.prototype.onBubbleActionMenu =
function(controller, menuItems, menu) {
    for (var i = 0; i < menuItems.length; i++) {
        var menuItem = menuItems[i];
        if (menuItem === ZmOperation.GO_TO_URL) {
            menu.addSelectionListener(menuItem, this._goToUrlListener.bind(this, controller));
            break;
        }
    }
};
