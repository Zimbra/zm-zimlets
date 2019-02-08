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
Com_Zimbra_Video_Tab = function () {
	if (this instanceof Com_Zimbra_Video_Tab) {
		Com_Zimbra_Video_Tab = this;
	}
};

/**
 * Makes the Zimlet class a subclass of ZmZimletBase.
 *
 */
Com_Zimbra_Video_Tab.prototype = new ZmZimletBase();

/**
* This method gets called by the Zimlet framework when the zimlet loads.
*
*/
Com_Zimbra_Video_Tab.prototype.init = function () {
	this._simpleAppName = this.createApp(this.getMessage("label"), "zimbraIcon", this.getMessage("description"));
};

/**
 * This method gets called by the Zimlet framework each time the application is opened or closed.
 *
 * @param       appName         the application name
 * @param       active          if true, the application status is open; otherwise, false
 */
Com_Zimbra_Video_Tab.prototype.appActive =
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
Com_Zimbra_Video_Tab.prototype.appLaunch =
function(appName) {
        switch (appName) {
                case this._simpleAppName: {
                        var app = appCtxt.getApp(appName);
                        break;
                }
        }
};

Com_Zimbra_Video_Tab.prototype.LoadVideos =
function() {
        var videoData = '';

        //TODO Don't remove this line, if client need any description we can uncomment it back
        //videoData = videoData + "<div class='description'>"+this.getMessage("description")+"</div>"

        var videoJSON = [{
                "id" : "1", 
                "videoTitle"   : "video label 1",
                "videpPath" : "assets/SearchYorContentSavedSearchTutorial.mp4"
        },
        {
                "id" : "2", 
                "videoTitle"   : "video label 2",
                "videpPath" : "assets/SearchYorContentSavedSearchTutorial.mp4"
        },
        {
                "id" : "3", 
                "videoTitle"   : "video label 3",
                "videpPath" : "assets/SearchYorContentSavedSearchTutorial.mp4"
        },
        {
                "id" : "4", 
                "videoTitle"   : "video label 4",
                "videpPath" : "assets/SearchYorContentSavedSearchTutorial.mp4"
        }
        ];

        for (key in videoJSON) {
                videoData = videoData + "<div class='videoContainer' id='videoContainer"+videoJSON[key].id+"'>";
                videoData = videoData + "<span class=\"videoLabel\" onclick=\"toggleVideos()\" id='span_video"+videoJSON[key].id+"'>"+videoJSON[key].videoTitle+"</span>";
                videoData = videoData + "<div class='videoContent' id='videoContent_video"+videoJSON[key].id+"'>";
                videoData = videoData + "<video class='videos' controls controlsList=' nodownload noremoteplayback' id='videoPlayer_video"+videoJSON[key].id+"'>";
                videoData = videoData + "<source src='"+this.getResource(videoJSON[key].videpPath)+"' type='video/mp4'>";
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
                document.getElementById("videoContent_"+clickIdSpan[1]).style.display = "block";
        }
}