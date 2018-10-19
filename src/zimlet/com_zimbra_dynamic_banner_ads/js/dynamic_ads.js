/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Zimlets
 * Copyright (C) 2010, 2011, 2013, 2014, 2016, 2018 Synacor, Inc. All Rights Reserved.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 *
 * ***** END LICENSE BLOCK *****
 */

Com_Zimbra_Dynamic_Banner_Ads = function () {
	if (this instanceof Com_Zimbra_Dynamic_Banner_Ads) {
		Com_Zimbra_Dynamic_Banner_Ads = this;
	}
};

Com_Zimbra_Dynamic_Banner_Ads.prototype = new ZmZimletBase();

Com_Zimbra_Dynamic_Banner_Ads.prototype.init = function () {
	var jsonObj = { GetInfoRequest: { _jsns: "urn:zimbraAccount" } };
	var params = {
		jsonObj: jsonObj,
		asyncMode: true,
		callback: (new AjxCallback(this, this._handleSOAPResponseJSON)),
		errorCallback: (new AjxCallback(this, this._handleSOAPErrorResponseJSON))
	};

	appCtxt.getAppController().sendRequest(params);
};

Com_Zimbra_Dynamic_Banner_Ads.prototype._handleSOAPResponseJSON = function(response) {
	var response = response._data.GetInfoResponse.attrs;

	if (response._attrs) {
		this.Ads = response._attrs.zimbraDynamicBannerImage || undefined;
		this.AdChangeInterval = response._attrs.zimbraDynamicBannerInterval || 5000;
		this.Ads && this.launchApp(); //don't bother launching the app if no images were set
	};
};

Com_Zimbra_Dynamic_Banner_Ads.prototype._handleSOAPErrorResponseJSON = function (errorResponse) {
	console.error(errorResponse);
};

/**
 * Launch point of Zimlet. Ad will load in the sidebar
 *
 * @param {string} currentView The current view of the app, usually the Mail tab.
 */
Com_Zimbra_Dynamic_Banner_Ads.prototype.launchApp = function () {
	this.showSidebarAd();
	this._updateAds();
};

/**
 * This method updates the current ad in the application, based on a defined interval
 */
Com_Zimbra_Dynamic_Banner_Ads.prototype._updateAds = function () {
	var adIndex = 0,
		adLength = this.Ads.length,
		self = this;

	function changeAd() {
		setInterval(function () {
			adIndex++;
			self.initAd(self.Ads[adIndex % adLength]);
		}, self.AdChangeInterval);
	}

	if (typeof self.Ads === "string") //means there's only a single ad
		self.initAd(self.Ads);
	else {
		self.initAd(self.Ads[0]);
		changeAd();
	}
};

/**
 * This method builds the ad and appends it to the correct dom container.
 *
 * @param {string} ad	The name of the ad
 */
Com_Zimbra_Dynamic_Banner_Ads.prototype.initAd = function (ad) {
	var sidebarAd = document.getElementById('skin_container_sidebar_ad'),
		sidebar = document.getElementById('skin_td_sidebar_ad'),
		bannerAdImg = document.getElementById('bannerAdImg');
	window.skin._showEl('skin_td_sidebar_app_sash', false);
	window.skin._showEl(sidebarAd);
	window.skin._showEl('skin_container_tree_bottom_ad_collapse', false);
	sidebarAd.style.width = "200px";
	sidebar.style.width = "200px";

	var bannerAdImg = document.getElementById('bannerAdImg');

	if (bannerAdImg) {
		bannerAdImg.setAttribute('src', ad);
	}
	else {
		bannerAdImg = document.createElement('img');
		bannerAdImg.setAttribute('src', ad);
		bannerAdImg.setAttribute('id', 'bannerAdImg');
		bannerAdImg.setAttribute('width', '200px');
		sidebarAd.appendChild(bannerAdImg);
	}

	window.skin._reflowApp();
};

/**
 * This method allows the sidebar to display
 */
Com_Zimbra_Dynamic_Banner_Ads.prototype.showSidebarAd = function () {
	var sidebar = document.getElementById('skin_td_sidebar_ad');
	window.skin._showEl('skin_td_sidebar_app_sash', false);
	window.skin._showEl(sidebar);
	sidebar.style.cssFloat = "right";
	window.skin._reflowApp();
};

