/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Defines the Zimlet handler class.
 *
 */
function Com_Zimbra_Vidyo_Conference_HandlerObject() {

        this._linkClicked = false;
}
    
Com_Zimbra_Vidyo_Conference_HandlerObject.prototype = new ZmZimletBase();
Com_Zimbra_Vidyo_Conference_HandlerObject.prototype.constructor = Com_Zimbra_Vidyo_Conference_HandlerObject;

/**
 * Simplify handler object
 *
 */
var Com_Zimbra_Vidyo_Conference = Com_Zimbra_Vidyo_Conference_HandlerObject;

/**
 * This method gets called by the Zimlet framework when single-click is performed.
 *  
 */
Com_Zimbra_Vidyo_Conference.prototype.singleClicked =
function() {
        this._loadVCAppointment();
};

/**
 * This method gets called by the Zimlet framework when double-click is performed.
 *  
 */
Com_Zimbra_Vidyo_Conference.prototype.doubleClicked =
function() {
        this._loadVCAppointment();
};

/**
 * Displays Preferences dialog
 */
Com_Zimbra_Vidyo_Conference.prototype._loadVCAppointment = function() {

        /* TODO: This is DUMMY content for now, In next phase we will fetch content from backend API and remove it */
        var meetingContent = "Please join my room for VC meeting.\n\n";
        meetingContent = meetingContent + "Join 101356 at intranicvc.nic.in (Room PIN: 46056) using any of the following options:\n\n";
        meetingContent = meetingContent + "- To join as a guest user from your desktop or mobile device, Click http://intranicvc.nic.in/flex.html?roomdirect.html&key=NT8RkYYH2k\n";
        meetingContent = meetingContent + "- To join from a Studio based / H.323 endpoint 32101356<br\>\n\n";
        meetingContent = meetingContent + "For any issues, Register a complaint on https://servicedesk.nic.in or call on 1800 111 555\n";
        
        var msg = new ZmMailMsg();
        AjxDispatcher.require(["MailCore", "CalendarCore"]);
        msg._origMsg = meetingContent;

        var appt = new ZmAppt();
        appt.setTextNotes(meetingContent);
        AjxDispatcher.run("GetCalController").newAppointment(appt, null, null, null);
};