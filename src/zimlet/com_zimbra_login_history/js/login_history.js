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
Com_Zimbra_Login_History = function () {
	if (this instanceof Com_Zimbra_Login_History) {
		Com_Zimbra_Login_History = this;
	}
};

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 *
 */
Com_Zimbra_Login_History.prototype = new ZmZimletBase();

/**
* This method gets called by the Zimlet framework when the zimlet loads.
*
*/
Com_Zimbra_Login_History.prototype.init = function () {
	this._simpleAppName = this.createApp(this.getMessage("label"), "zimbraIcon", this.getMessage("description"));
};

/**
 * This method gets called by the Zimlet framework each time the application is opened or closed.
 *
 * @param       appName         the application name
 * @param       active          if true, the application status is open; otherwise, false
 */
Com_Zimbra_Login_History.prototype.appActive =
function(appName, active) {
        switch (appName) {
                case this._simpleAppName: {
                        var app = appCtxt.getApp(appName);
                        app.setContent("<div style='color:red; width: 90%; padding: 10px;' id='loadingdiv'>"+this.getMessage("lodingText")+"</div><div style='width: 100%; float: left;' id='loginhistorycontent'> </div>");
                        var historyContent = this.GetHistory(this.getMessage("noDataFound"),this.getMessage("heading"), this.getMessage("serialNo"), this.getMessage("geoLocation"), this.getMessage("date"),this.getMessage("protocol"), this.getMessage("location"), this.getMessage("locationMessage"));
			break;
                }
        }
};

/**
 * This method gets called by the Zimlet framework when the application is opened for the first time.
 *
 * @param       appName         the application name
 */
Com_Zimbra_Login_History.prototype.appLaunch =
function(appName) {
        switch (appName) {
                case this._simpleAppName: {
                        var app = appCtxt.getApp(appName);
                        break;
                }
        }
};

Com_Zimbra_Login_History.prototype.GetHistory =
function(noDataLabel, headingLabel, serialNoLabel, geoLocationLabel, dateLabel, protocolLabel, locationLabel, locationMessage) {
        var userEmail =  appCtxt.getActiveAccount().getEmail();
        var historyData;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200 && this.responseText != null && this.responseText != "") {
                        document.getElementById('loadingdiv').style.display = "none";
                        if( this.responseText.trim().toLowerCase() == 'no records found' ) {
                                document.getElementById('loginhistorycontent').style.padding = '10px';
                                document.getElementById('loginhistorycontent').innerHTML = noDataLabel;
                        } else {
                                historyData = JSON.parse(this.responseText);
                                var content = "<div style='width: 90%; color:red; border:0px solid #000; background-color: #0087C3; font-size: 16px; '></div>";
                                content = content + "<div style='width: 100% background-color: #555; overflow: auto; display: block; border:1px solid #0087C3;'>";
                                content = content + "<button title='click here' style='font-size: 15px; font-weight: bold; font-family: monospace; width: 20%; background-color: #0087C3; color: #fff; cursor: pointer; border: none; padding: 5px;' type='button' name='all' id='protocolbutton_all' onClick='showData(name)'>All</button>";
                                content = content + "<button title='click here'style='font-size: 15px; font-weight: bold; font-family: monospace; width: 20%; background-color: #0087C3; color: #fff; cursor: pointer; border: none; padding: 5px;' type='button' name='soap' id='protocolbutton_soap' onClick='showData(name)'>WEB</button>";
                                content = content + "<button title='click here'style='font-size: 15px; font-weight: bold; font-family: monospace; width: 20%; background-color: #0087C3; color: #fff; cursor: pointer; border: none; padding: 5px;' type='button' name='imap' id='protocolbutton_imap' onClick='showData(name)'>IMAP</button>";
                                content = content + "<button title='click here'style='font-size: 15px; font-weight: bold; font-family: monospace; width: 20%; background-color: #0087C3; color: #fff; cursor: pointer; border: none; padding: 5px;' type='button' name='pop3' id='protocolbutton_pop3' onClick='showData(name)'>POP</button>";
                                content = content + "<button title='click here'style='font-size: 15px; font-weight: bold; font-family: monospace; width: 20%; background-color: #0087C3; color: #fff; cursor: pointer; border: none; padding: 5px;' type='button' name='smtp' id='protocolbutton_smtp' onClick='showData(name)'>SMTP</button>";
                                content = content + "</div>";
                                
                                content = content + "<div style='float: left; width: 100%; margin:auto; text-align: center; border:1px solid #0087C3;; display: inline-table;' >";
                                content = content + "<div style='float: left; width: 20%; display: inline-table; font-size: 16px; color: #0087C3; font-weight: 500;'> "+serialNoLabel+" </div>";
                                content = content + "<div style='float: left; width: 20%; display: inline-table; font-size: 16px; color: #0087C3; font-weight: 500;'>"+geoLocationLabel+"</div>";
                                content = content + "<div style='float: left; width: 20%; display: inline-table; font-size: 16px; color: #0087C3; font-weight: 500;'>"+dateLabel+"</div>";
                                content = content + "<div style='float: left; width: 20%; display: inline-table; font-size: 16px; color: #0087C3; font-weight: 500;'>"+protocolLabel+"</div>";
                                content = content + "<div style='float: left; width: 20%; display: inline-table; font-size: 16px; color: #0087C3; font-weight: 500;'>"+locationLabel+"</div>";
                                content = content + "</div>";
                                var array = ["all", "soap", "imap", "pop3", "smtp"];
                                
                                if (historyData) {
                                	for (var i = 0; i < array.length; i++) {
                                        var type = array[i];
                                        if(historyData[type].length > 0 ) {
	                                        content = content + "<div style='float: left; width: 100%; margin:auto; text-align: center; border: 1px solid #000; display:none; ' id='protocolcontent_"+type+"' class='protocolcontent' >";
	                                        for(var j =0; j< historyData[type].length; j++) {
	                                                content = content + "<div style='width: 100%; float: left; margin: 5px 0px;'>";
	                                                content = content + "<div style='float: left; width: 20%; display: inline-table; font-size: 15px;'>" + (j + 1) + "</div>";
	                                                content = content + "<div style='float: left; width: 20%; display: inline-table; font-size: 15px;'>" + historyData[type][j].ip + "</div>";
	                                                content = content + "<div style='float: left; width: 20%; display: inline-table; font-size: 15px;'>" + historyData[type][j].requestTime + "</div>";
	                                                content = content + "<div style='float: left; width: 20%; display: inline-table; font-size: 15px;'>" + historyData[type][j].protocol + "</div>";
	                                                content = content + "<div style='float: left; width: 20%; display: inline-table; font-size: 15px;'>" + historyData[type][j].location + "</div>";
	                                                content = content + "</div>";
	                                        }
	                                }
                                        content = content + "</div>"
									}
                                	content = content + "<div style='width: 100%;float: left; padding-top: 20px;font-size: 14px;color: red;'>"+locationMessage+"</div>"
                                	document.getElementById('loginhistorycontent').innerHTML = content;
                                	showData('all');
                                }
                        }
                }
        }
        xhttp.open("GET", "/public/historyProxy.jsp?useremail="+userEmail, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send();
        return historyData;
}

function showData(type) {
	var array = ["all", "soap", "imap", "pop3", "smtp"];
	for (var j = 0; j < array.length; j++) {
		if (type == array[j]) {
			document.getElementById('protocolbutton_' + array[j]).style.backgroundColor = "#FFFFFF";
			document.getElementById('protocolbutton_' + array[j]).style.color = "#000";
		} else {
			document.getElementById('protocolbutton_' + array[j]).style.backgroundColor = "#0087C3";
			document.getElementById('protocolbutton_' + array[j]).style.color = "#FFFFFF";
		}
	}
	
	var divsToHide = document.getElementsByClassName("protocolcontent");
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.visibility = "hidden"; 
        divsToHide[i].style.display = "none"; 
    }
    document.getElementById('protocolcontent_'+type).style.visibility = "visible";
    document.getElementById('protocolcontent_'+type).style.display = "block";
}
