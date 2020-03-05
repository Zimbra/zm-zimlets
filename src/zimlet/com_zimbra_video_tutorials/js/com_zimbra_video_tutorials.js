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
                        app.setContent("<div class='videotutorials'><div class='videoheading' id='headingdiv'>"+this.getMessage("heading")+"</div><div class='container' id='videoDataDiv'> </div></div>");
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

// Polyfill for Array.find
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
          value: function(predicate) {
           // 1. Let O be ? ToObject(this value).
            if (this == null) {
              throw new TypeError('"this" is null or not defined');
            }
      
            var o = Object(this);
      
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
      
            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
              throw new TypeError('predicate must be a function');
            }
      
            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];
      
            // 5. Let k be 0.
            var k = 0;
      
            // 6. Repeat, while k < len
            while (k < len) {
              // a. Let Pk be ! ToString(k).
              // b. Let kValue be ? Get(O, Pk).
              // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
              // d. If testResult is true, return kValue.
              var kValue = o[k];
              if (predicate.call(thisArg, kValue, k, o)) {
                return kValue;
              }
              // e. Increase k by 1.
              k++;
            }
      
            // 7. Return undefined.
            return undefined;
          },
          configurable: true,
          writable: true
        });
      }

var videoJSON = [{
        "id" : 1, 
        "videoTitle"   : "How to create  Briefcase",
        "videoPath" : "https://email.gov.in/videos/Create_a_Briefcase.mp4"
},
{
        "id" : 2, 
        "videoTitle"   : "How to create  Calendar Appointment",
        "videoPath" : "https://email.gov.in/videos/Create_a_Calendar_Appointment.mp4"
},
{
        "id" : 3, 
        "videoTitle"   : "How to create Task",
        "videoPath" : "https://email.gov.in/videos/Create_a_Task.mp4"
},
{
        "id" : 4, 
        "videoTitle"   : "How to create Tag",
        "videoPath" : "https://email.gov.in/videos/Create_a_Tag.mp4"
},
{
        "id" : 5, 
        "videoTitle"   : "Configure IMAP/POP/SMTPS over mobile",
        "videoPath" : "https://email.gov.in/videos/Mobile_Config_Tutorial_IMAP_POP_SMTP-00001.mp4"
},
{
        "id" : 6, 
        "videoTitle"   : "How to add/create Contacts",
        "videoPath" : "https://email.gov.in/videos/Create_Contact.mp4"
},
{
        "id" : 7, 
        "videoTitle"   : "How to Search mails and Saved Search",
        "videoPath" : "https://email.gov.in/videos/Search_Your_Content_and_Saved_Search_Tutorial.mp4"
},
{
        "id" : 8, 
        "videoTitle"   : "How to install kavach application on android mobile",
        "videoPath" : "https://email.gov.in/videos/android_mobile_user-manual.mp4"
},
{
        "id" : 9, 
        "videoTitle"   : "How to install kavach application on iPhone",
        "videoPath" : "https://email.gov.in/videos/iSO_Mobile.mp4"
},
{
        "id" : 10, 
        "videoTitle"   : "How to add/delete country policy for Geo fencing",
        "videoPath" : "https://email.gov.in/videos/kavach_add_and_delete_country_policy.mp4"
}
];

Com_Zimbra_Video_Tutorials.prototype.LoadVideos =
function() {
        var videoData = '';

        //TODO Don't remove this line, if client need any description we can uncomment it back
        //videoData = videoData + "<div class='description'>"+this.getMessage("description")+"</div>"

        videoData += "<div>"
        videoData += "<div class='videoContainer' id='videoContainer'>";
        videoData += "<center><span class='videoTitle'  id='span_video'>"+videoJSON[0].videoTitle+"</span></center>";
        videoData += "<div class='videoContent' id='videoContent_video'>";
        videoData += "<video class='videos' controls controlsList=' nodownload noremoteplayback' id='videoPlayer_video'>";
        videoData += "<source src='"+videoJSON[0].videoPath+"' type='video/mp4'>";
        videoData += "Your browser does not support the video tag.";
        videoData += "</video>";
        videoData += "</div>";
        videoData += "</div>";
        videoData += "<div class=videoList>";
        var noOfVideos = videoJSON.length;
        for (key in videoJSON) {
                var isLastItemInRow = (((key+1) % 3 === 0) || (key == (noOfVideos - 1)));
                var isFirstRow = ( key <= 2 );
                videoData += "<div class='videoLabel"+(isLastItemInRow? ' videoLabelLastItemInRow' : '') +(isFirstRow? ' videoLabelFirstRow' : '')+"' onclick='changeVideo("+videoJSON[key].id+")' ><b>" + videoJSON[key].id + "</b>. " + videoJSON[key].videoTitle+"</div>";        
        }
        videoData += "</div>"

    document.getElementById('videoDataDiv').innerHTML = videoData;
}

function changeVideo(id){
        var video = videoJSON.find(function(videoInfo){
                return videoInfo.id == id;
        })
        if(video){
                var videoLabel = document.getElementById("span_video");
                var videoPlayer = document.getElementById("videoPlayer_video");
                videoLabel.innerHTML = video.videoTitle;
                videoPlayer.src = video.videoPath;
                videoPlayer.play();
        }
}
