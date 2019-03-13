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
Com_Zimbra_Video_Tutorials = function () {
	if (this instanceof Com_Zimbra_Video_Tutorials) {
		Com_Zimbra_Video_Tutorials = this;
	}
};

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 *
 */
Com_Zimbra_Video_Tutorials.prototype = new ZmZimletBase();

/**
* This method gets called by the Zimlet framework when the zimlet loads.
*
*/
Com_Zimbra_Video_Tutorials.prototype.init = function () {
	this._simpleAppName = this.createApp(this.getMessage("label"), "zimbraIcon", this.getMessage("description"));
};

/**
 * This method gets called by the Zimlet framework each time the application is opened or closed.
 *
 * @param       appName         the application name
 * @param       active          if true, the application status is open; otherwise, false
 */
Com_Zimbra_Video_Tutorials.prototype.appActive =
function(appName, active) {
        switch (appName) {
                case this._simpleAppName: {
                        var app = appCtxt.getApp(appName);
                        app.setContent("<div class='heading' id='loadingdiv'>"+this.getMessage("heading")+"</div><div class='container' id='videoDataDiv'> </div>");
                        var historyContent = this.LoadVideos();
			break;
                }
        }
};

/**
 * This method gets called by the Zimlet framework when the application is opened for the first time.
 *
 * @param       appName         the application name
 */
Com_Zimbra_Video_Tutorials.prototype.appLaunch =
function(appName) {
        switch (appName) {
                case this._simpleAppName: {
                        var app = appCtxt.getApp(appName);
                        break;
                }
        }
};

Com_Zimbra_Video_Tutorials.prototype.LoadVideos =
function() {
        var videoData = '';

        //TODO Don't remove this line, if client need any description we can uncomment it back
        //videoData = videoData + "<div class='description'>"+this.getMessage("description")+"</div>"

        var videoJSON = [{
                "id" : "1", 
                "videoTitle"   : "How to create  Briefcase",
                "videpPath" : "https://video.nic.in/Create_a_Briefcase.mp4"
        },
        {
                "id" : "2", 
                "videoTitle"   : "How to create  Calendar Appointment",
                "videpPath" : "https://video.nic.in/Create_a_Calendar_Appointment.mp4"
        },
        {
                "id" : "3", 
                "videoTitle"   : "How to create Task",
                "videpPath" : "https://video.nic.in/Create_a_Task.mp4"
        },
        {
                "id" : "4", 
                "videoTitle"   : "How to create Tag",
                "videpPath" : "https://video.nic.in/Create_a_Tag.mp4"
        },
        {
                "id" : "5", 
                "videoTitle"   : "Configure IMAP/POP/SMTPS over mobile",
                "videpPath" : "https://video.nic.in/Mobile_Config_Tutorial_IMAP_POP_SMTP-00001.mp4"
        },
        {
                "id" : "6", 
                "videoTitle"   : "How to add/create Contacts",
                "videpPath" : "https://video.nic.in/Create_Contact.mp4"
        },
        {
                "id" : "7", 
                "videoTitle"   : "How to Search mails and Saved Search",
                "videpPath" : "https://video.nic.in/Search_Your_Content_and_Saved_Search_Tutorial.mp4"
        },
        {
                "id" : "8", 
                "videoTitle"   : "Mobile user-manual",
                "videpPath" : "https://video.nic.in/android_mobile_user-manual.mp4"
        },
        {
                "id" : "9", 
                "videoTitle"   : "IOS Mobile",
                "videpPath" : "https://video.nic.in/iSO_Mobile.mp4"
        },
        {
                "id" : "10", 
                "videoTitle"   : "How to add and delete country policy",
                "videpPath" : "https://video.nic.in/kavach_add_and_delete_country_policy.mp4"
        }
        ];

        for (key in videoJSON) {
                videoData = videoData + "<div class='videoContainer' id='videoContainer"+videoJSON[key].id+"'>";
                videoData = videoData + "<span class=\"videoLabel\" onclick=\"toggleVideos()\" id='span_video"+videoJSON[key].id+"'>"+videoJSON[key].videoTitle+"</span>";
                videoData = videoData + "<div class='videoContent' id='videoContent_video"+videoJSON[key].id+"'>";
                videoData = videoData + "<video class='videos' controls controlsList=' nodownload noremoteplayback' id='videoPlayer_video"+videoJSON[key].id+"'>";
                videoData = videoData + "<source src='"+videoJSON[key].videpPath+"' type='video/mp4'>";
                videoData = videoData + "Your browser does not support the video tag.";
                videoData = videoData + "</video>";
                videoData = videoData + "</div>";
                videoData = videoData + "</div>";
        }

    document.getElementById('videoDataDiv').innerHTML = videoData;
}

function toggleVideos(e) {
        e = e || window.event;
        e = e.target || e.srcElement;
        var clickId = e.id;
        var clickIdSpan = clickId.split("span_");

        if(document.getElementById("videoContent_"+clickIdSpan[1]).style.display == "block") {
                var videoPlayer = document.getElementById('videoPlayer_'+clickIdSpan[1]);
                videoPlayer.pause();
                document.getElementById("videoContent_"+clickIdSpan[1]).style.display = "none";
        } else {
                hideElements(document.querySelectorAll('.videoContent'));
                document.getElementById("videoContent_"+clickIdSpan[1]).style.display = "block";
        }
}

function hideElements(elements) {
        elements = elements.length ? elements : [elements];
        for (var index = 0; index < elements.length; index++) {
                elements[index].style.display = 'none';
        }
}