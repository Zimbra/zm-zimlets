/**
This file is part of the RPost/RMail Zimlet
Copyright (C) 2014-2017  Barry de Graaff

Bugs and feedback: https://github.com/Zimbra-Community/rmail/issues

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
//Constructor
function com_rpost_rmail_HandlerObject() {
   com_rpost_rmail_HandlerObject.largeMailDefault = 10;
};


com_rpost_rmail_HandlerObject.prototype = new ZmZimletBase();
com_rpost_rmail_HandlerObject.prototype.constructor = com_rpost_rmail_HandlerObject;

com_rpost_rmail_HandlerObject.prototype.toString =
function() {
   return "com_rpost_rmail_HandlerObject";
};

/** 
 * Creates the Zimbra OpenPGP Zimlet, extends {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html ZmZimletBase}.
 * @class
 * @extends ZmZimletBase
 *  */
var RPost = com_rpost_rmail_HandlerObject;

/** 
 * This method gets called when Zimbra Zimlet framework initializes.
 */
RPost.prototype.init = function() {
   AjxPackage.require({name:"MailCore", callback:new AjxCallback(this, this._applyRequestHeaders)});

try {
   var soapDoc = AjxSoapDoc.create("GetSearchFolderRequest", "urn:zimbraMail");
   var search = soapDoc.set("search");
   appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:true, callback:RPost.prototype.createSearchFolder});
} catch (err)
{
   console.log('RPost.prototype.init: failed to create searchfolder');
}   

};

/** This method is called from init and makes a header available
 * See {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmMailMsg.html#.addRequestHeaders ZmMailMsg.html#.addRequestHeaders}.
 * */
RPost.prototype._applyRequestHeaders =
function() {   
   ZmMailMsg.requestHeaders["X-RPost-App"] = "X-RPost-App";
   ZmMailMsg.requestHeaders["X-RPost-LargeMail"] = "X-RPost-LargeMail";
};

/** Method to create a searchfolder
 * */
RPost.prototype.createSearchFolder = function (folders)
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;   
   var hasFolder = false;
   try 
   {
      for(var x=0; x < folders._data.GetSearchFolderResponse.search.length; x++)
      {
         if(folders._data.GetSearchFolderResponse.search[x].query == "from:receipt@r1.rpost.net")
         {
            hasFolder = true;
         }      
      }
   } catch (err)
   {
      hasFolder = false;
   }
   
   if (hasFolder == false)
   {
	   var soapDoc = AjxSoapDoc.create("CreateSearchFolderRequest", "urn:zimbraMail");
	   var search = soapDoc.set("search");
   	search.setAttribute("name",zimletInstance.getMessage('RPostZimlet_SearchFolder'));
      search.setAttribute("query","from:receipt@r1.rpost.net");
      search.setAttribute("l",1);
      search.setAttribute("types","message");
   	appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:true});
   
   }
};

/** This method is called when a message is viewed in Zimbra. 
 * See {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html#onMsgView}.
 * @param {ZmMailMsg} msg - an email in {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmMailMsg.html ZmMailMsg} format
 * @param {ZmMailMsg} oldMsg - unused
 * @param {ZmMailMsgView} msgView - the current ZmMailMsgView (upstream documentation needed)
 * */
RPost.prototype.onMsgView = function (msg, oldMsg, msgView) {
   try {
      var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;   
      var infoBarDiv = document.getElementById(msgView._infoBarId);      
      if (infoBarDiv) {
         if(msg.attrs)
         {
            if(msg.attrs['X-RPost-App'])
            {
               if(msg.isSent)
               {
                  var z = document.createElement('div');
                  z.innerHTML = zimletInstance.getMessage('RPostZimlet_SentWithBanner') + ' <div class="RPost-infobar-right"></div>';
                  z.className = 'RPost-infobar';
   
                  var y = document.createElement('div');
                  y.innerHTML = '<div id="'+msgView.__internalId+'RmailFileList" class="RmailFileList MessageHeaderAttachments attachments"></div>';
                  
                  infoBarDiv.insertBefore(y, infoBarDiv.firstChild);
                  infoBarDiv.insertBefore(z, infoBarDiv.firstChild);                  
                  //get the filelist from the sent item
                  if(msg.attrs['X-RPost-LargeMail'])
                  {
                     RPost.prototype.setFileList(msg, msgView.__internalId+'RmailFileList');
                  }
               }
            }
         }
      }
   } catch (err)
   {
      console.log('rmail zimlet onmsg err'+err);
   }
};   

RPost.prototype.setFileList = function(msg, domId) {  
   try {
      var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
      var url = [];
      var i = 0;
      var proto = location.protocol;
      var port = Number(location.port);
      url[i++] = proto;
      url[i++] = "//";
      url[i++] = location.hostname;
      if (port && ((proto == ZmSetting.PROTO_HTTP && port != ZmSetting.HTTP_DEFAULT_PORT) 
      || (proto == ZmSetting.PROTO_HTTPS && port != ZmSetting.HTTPS_DEFAULT_PORT))) {
      url[i++] = ":";
      url[i++] = port;
      }
      url[i++] = "/home/";
      url[i++]= AjxStringUtil.urlComponentEncode(appCtxt.getActiveAccount().name);
      url[i++] = "/message.txt?fmt=txt&id=";
      url[i++] = msg.id;
      
      var getUrl = url.join(""); 
      
      var xhr = new XMLHttpRequest();
      xhr.open( "GET", getUrl, true );
      xhr.send( );
      xhr.onreadystatechange = function (oEvent) 
      {  
         if (xhr.readyState === 4) 
         {  
            if (xhr.status === 200) 
            {
               var fileList = xhr.response.match(/<rmail-zimlet-filelist>[\s\S]*?<\/rmail-zimlet-filelist>/m);            
               //The use of innerText and innerHTML combined to avoid XSS
               try {
                  document.getElementById(domId).innerText = document.getElementById(domId).innerText + fileList[0].replace('<rmail-zimlet-filelist>','').replace('</rmail-zimlet-filelist>','');
                  document.getElementById(domId).innerHTML = '<b>'+ zimletInstance.getMessage('RPostZimlet_LargeMail') +' '+ZmMsg.files+':</b><br>' + document.getElementById(domId).innerHTML;
               } catch (err) 
               {
               }
            }
         }
      }
   } catch (err)
   {
   }
};

/** This method gets called by the Zimlet framework when single-click is performed.
 */
RPost.prototype.singleClicked =
function() {  
   this.prefDialog();
};

/** This method gets called by the Zimlet framework when double-click is performed.
 */
RPost.prototype.doubleClicked =
function() {
   this.prefDialog();
};

/** This method shows a `ZmToast` status message. That fades in and out in a few seconds.
 * @param {string} text - the message to display
 * @param {string} type - the style of the message e.g. ZmStatusView.LEVEL_INFO, ZmStatusView.LEVEL_WARNING, ZmStatusView.LEVEL_CRITICAL
 * */
RPost.prototype.status = function(text, type) {
   var transitions = [ ZmToast.FADE_IN, ZmToast.PAUSE, ZmToast.PAUSE, ZmToast.PAUSE, ZmToast.FADE_OUT ];
   appCtxt.getAppController().setStatusMsg(text, type, null, transitions);
}; 

RPost.prototype.prefDialog =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   try
   {
      var userSettings = JSON.parse(zimletInstance.getUserProperty("com_rpost_properties"));
      if(!userSettings.largeMailTreshold)
      {
         userSettings.largeMailTreshold = com_rpost_rmail_HandlerObject.largeMailDefault;
      }
      var password = userSettings.Password;
   } catch(err) {
      zimletInstance.registerDialog();
      return;      
   }
   zimletInstance._dialog = new ZmDialog( { title:zimletInstance.getMessage('RPostZimlet_label'), parent:this.getShell(), standardButtons:[DwtDialog.OK_BUTTON], disposeOnPopDown:true } );   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:160px;">'+
   '<img style="margin:10px;margin-left:0px;" src="'+zimletInstance.getResource("logo.png")+'">'+   
   '<table><tr><td>'+zimletInstance.getMessage('RPostZimlet_signedInWith')+':</td><td>'+userSettings.Email+'</td></tr>'+
   '<tr><td colspan="2">&nbsp;</td></tr>' +   
   '<tr><td>'+zimletInstance.getMessage('RPostZimlet_largeMailTreshold')+':&nbsp;</td><td><input id="RPostZimlet_largeMailTreshold" title="'+ZmMsg.afterReload+'" type="number" min="0" value="'+userSettings.largeMailTreshold+'"></td></tr>'+
   '</table>' +
   '<br><span id="RPostSignOut"><a id="RPostSignOut" href="#">'+ZmMsg.logOff+'</a></span><br><br>'+
   '</div>'
   );
   
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn));
   zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance._cancelBtn));   
   
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   var btnHaveAcct = document.getElementById("RPostSignOut");               
   btnHaveAcct.onclick = AjxCallback.simpleClosure(RPost.prototype._btnSignOut);
   zimletInstance._dialog.popup();  
};   

RPost.prototype._btnSignOut =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   zimletInstance.setUserProperty("com_rpost_properties", "", true);
   RPost.prototype.status(ZmMsg.ok, ZmStatusView.LEVEL_INFO);
   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {
   }
}; 

RPost.prototype.registerDialog =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   zimletInstance._dialog = new ZmDialog( { title:zimletInstance.getMessage('RPostZimlet_label'), parent:this.getShell(), standardButtons:[DwtDialog.CANCEL_BUTTON,DwtDialog.OK_BUTTON], disposeOnPopDown:true } );
   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:300px;">'+
   '<img style="margin:10px;margin-left:0px;" src="'+zimletInstance.getResource("logo.png")+'">'+
   '<br><span id="RPostFormDescr">'+zimletInstance.getMessage('RPostZimlet_registerAccount')+'.</span><br><br>'+
   '<table>'+
   '<tr><td>'+ZmMsg.emailLabel+'&nbsp;</td><td><input class="RPostInput" type="text" name="RPostEmail" id="RPostEmail" value="'+appCtxt.getActiveAccount().name+'"></td></tr>'+
   '<tr><td>'+ZmMsg.passwordLabel+'&nbsp;</td><td><input class="RPostInput" type="password" name="RPostPassword" id="RPostPassword"></td></tr>'+
   '<tr id="RPostConfirmPasswordTr"><td>'+ZmMsg.passwordConfirmLabel+'&nbsp;</td><td><input class="RPostInput" type="password" name="RPostConfirmPassword" id="RPostConfirmPassword"></td></tr>'+
   '<tr id="RPostFirstNameTr"><td>'+ZmMsg.firstNameLabel+'</td><td><input class="RPostInput" type="text" name="RPostFirstName" id="RPostFirstName"></td></tr>'+
   '<tr id="RPostLastNameTr"><td>'+ZmMsg.lastNameLabel+'</td><td><input class="RPostInput" type="text" name="RPostLastName" id="RPostLastName"></td></tr>'+
   '<tr><td colspan="2">&nbsp;</td></tr>' +
   '<tr><td>'+zimletInstance.getMessage('RPostZimlet_largeMailTreshold')+':&nbsp;</td><td><input class="RPostInput" style="min-width:260px" id="RPostZimlet_largeMailTreshold" title="'+ZmMsg.afterReload+'" type="number" min="0" value="'+com_rpost_rmail_HandlerObject.largeMailDefault+'"> '+ZmMsg.mb+'</td></tr>'+
   '</table>'+   
   '<br><br><span id="btnHaveAcctSp"><a id="btnHaveAcct" href="#">'+zimletInstance.getMessage('RPostZimlet_haveAccount')+'</a></span><br><br>'+
   '</div>'
   );
   
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance._registerAccountBtn));
   zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance._registerAccountBtn));
   zimletInstance._dialog.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn));
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostEmail'),0);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostPassword'),1);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostConfirmPassword'),2);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostFirstName'),3);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostLastName'),4);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById(zimletInstance._dialog._button[1].__internalId));
   zimletInstance._dialog._tabGroup.addMember(document.getElementById(zimletInstance._dialog._button[2].__internalId));
   zimletInstance._dialog._baseTabGroupSize = 7;        
   
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   var btnHaveAcct = document.getElementById("btnHaveAcct");               
   btnHaveAcct.onclick = AjxCallback.simpleClosure(RPost.prototype._btnHaveAcct);
   zimletInstance._dialog.popup();   
};

RPost.prototype._forgotPassword =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();
   xhr.open('POST', 'https://webapi.r1.rpost.net/api/v1/Account/ForgotPassword', false);
   xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
 
   var data = {};
   data['UserEmailAddress'] = document.getElementById('RPostEmail').value;
   data['FromEmailAddress'] = document.getElementById('RPostEmail').value;
   data['CallbackUrl'] = "https://portal.rpost.com/#/password/";

   // send the collected data as JSON
   xhr.send(JSON.stringify(data)); 
   var result = JSON.parse(xhr.response);  
   if(result.StatusCode == 200)
   {
      result.Message.forEach(function(message) {
         RPost.prototype.status(message.Message, ZmStatusView.LEVEL_INFO);
      });
   }
   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {
   }
};

RPost.prototype._resendActivationLink =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();
   xhr.open('POST', 'https://webapi.r1.rpost.net/api/v1/Account/ResendActivationLink', false);
   xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
 
   var data = {};
   data['Email'] = document.getElementById('RPostEmail').value;

   // send the collected data as JSON
   xhr.send(JSON.stringify(data)); 
   var result = JSON.parse(xhr.response);  
   if(result.StatusCode == 200)
   {
      result.Message.forEach(function(message) {
         RPost.prototype.status(message.Message, ZmStatusView.LEVEL_INFO);
      });
   }
   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {
   }
};

/** This method is called when the dialog "OK" button is clicked.
 * It pops-down the current dialog.
 */
RPost.prototype._registerAccountBtn =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();
   xhr.open('POST', 'https://webapi.r1.rpost.net/api/v1/Account/Register', false);
   xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
 
   var data = {};
   data['Email'] = document.getElementById('RPostEmail').value;
   data['Password'] = document.getElementById('RPostPassword').value;
   data['ConfirmPassword'] = document.getElementById('RPostConfirmPassword').value;
   data['FirstName'] = document.getElementById('RPostFirstName').value;
   data['LastName'] = document.getElementById('RPostLastName').value;
   data['PhoneNumber'] = null;
   data['AlternateEmail'] = null;
   data['ConfirmationCallbackUrl'] = null;
   data['RegistrationApp'] = 'Zimlet';
   data['Language'] = RPost.prototype.getLanguage();
   data['TimeZone'] = RPost.prototype.getTimezone();

   // send the collected data as JSON
   xhr.send(JSON.stringify(data));   
 
   var result = JSON.parse(xhr.response);  
   if(result.StatusCode == 200)
   {
      //only store values needed for zimlet
      var data = {};
      data['Email'] = document.getElementById('RPostEmail').value;
      data['Password'] = document.getElementById('RPostPassword').value;
      data['largeMailTreshold'] = document.getElementById('RPostZimlet_largeMailTreshold').value;
      
      zimletInstance.setUserProperty("com_rpost_properties", JSON.stringify(data), true);
      result.Message.forEach(function(message) {
         RPost.prototype.status(message.Message, ZmStatusView.LEVEL_INFO);
      });
      zimletInstance._dialog.setContent(zimletInstance.getMessage('RPostZimlet_activationLink'));
      zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn));
      zimletInstance._dialog.setButtonVisible(DwtDialog.CANCEL_BUTTON, false);
   }
   else
   {
      result.Message.forEach(function(message) {
         RPost.prototype.status(message.Message, ZmStatusView.LEVEL_WARNING);
      });
   }      
};

RPost.prototype._btnHaveAcct =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   document.getElementById('RPostConfirmPasswordTr').style.display = 'none';
   document.getElementById('RPostFirstNameTr').style.display = 'none';
   document.getElementById('RPostLastNameTr').style.display = 'none';
   
   document.getElementById('btnHaveAcct').innerText = zimletInstance.getMessage('RPostZimlet_forgotPassword');
   var btnHaveAcct = document.getElementById("btnHaveAcct");               
   btnHaveAcct.onclick = AjxCallback.simpleClosure(RPost.prototype._forgotPassword);
   
   document.getElementById('btnHaveAcctSp').appendChild(document.createTextNode(" | "));
   var resendA = document.createElement('a');
   resendA.id="RPostZimlet_resendActivationLink"
   resendA.href="#";
   document.getElementById('btnHaveAcctSp').appendChild(resendA);
   document.getElementById('RPostZimlet_resendActivationLink').innerText = zimletInstance.getMessage('RPostZimlet_resendActivationLink');
   document.getElementById('RPostZimlet_resendActivationLink').onclick = AjxCallback.simpleClosure(RPost.prototype._resendActivationLink);
   
   document.getElementById('RPostFormDescr').innerHTML = zimletInstance.getMessage('RPostZimlet_signIn');
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance._getInitialToken));
   zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance._getInitialToken));
};

RPost.prototype._getInitialToken =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();
   
   xhr.open('POST', 'https://webapi.r1.rpost.net/Token', false);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   
   var formData = 'grant_type=password&username='+
   encodeURIComponent(document.getElementById('RPostEmail').value)+'&Password='+ 
   encodeURIComponent(document.getElementById('RPostPassword').value);

   var data = {};
   data['Email'] = document.getElementById('RPostEmail').value;
   data['Password'] = document.getElementById('RPostPassword').value;
   data['largeMailTreshold'] = document.getElementById('RPostZimlet_largeMailTreshold').value;
   
   // send the collected data as JSON
   xhr.send(formData);   
   var result = JSON.parse(xhr.response);  
   if(result.userName == data['Email'])
   {
      zimletInstance.setUserProperty("com_rpost_properties", JSON.stringify(data), true);
      RPost.prototype.status(ZmMsg.twoStepAuthSuccess, ZmStatusView.LEVEL_INFO);
      try{
         zimletInstance._dialog.setContent('');
         zimletInstance._dialog.popdown();
      }
      catch (err) {
      }  
      
   }
   else
   {     
      RPost.prototype.status(result.error_description, ZmStatusView.LEVEL_WARNING);
   }
};

/** This method is called when the dialog "CANCEL" button is clicked.
 * It pops-down the current dialog.
 */
RPost.prototype._cancelBtn =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   try{
      var userSettings = JSON.parse(zimletInstance.getUserProperty("com_rpost_properties"));
   
      if((document.getElementById('RPostZimlet_largeMailTreshold')) && (userSettings.Password))
      {
         //only store values needed for zimlet
         var data = {};
         data['Email'] = userSettings.Email;
         data['Password'] = userSettings.Password;
         data['largeMailTreshold'] = document.getElementById('RPostZimlet_largeMailTreshold').value;
         zimletInstance.setUserProperty("com_rpost_properties", JSON.stringify(data), true);   
      }
   }
   catch (err) {}

   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {}
};

RPost.prototype._getRemainMessageCount =
function() {
   try {
      var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
      var userSettings = JSON.parse(zimletInstance.getUserProperty("com_rpost_properties"));
      if(!userSettings.largeMailTreshold)
      {
         userSettings.largeMailTreshold = com_rpost_rmail_HandlerObject.largeMailDefault;
      }
            
      var xhr = new XMLHttpRequest();  
      xhr.open('POST', 'https://webapi.r1.rpost.net/Token', false);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      var formData = 'grant_type=password&username='+
      encodeURIComponent(userSettings.Email)+'&Password='+ 
      encodeURIComponent(userSettings.Password);
      xhr.send(formData);  
      var result = JSON.parse(xhr.response);  
      
      //Show remaining monthly message count, only if the user is on trial and remaining is <= 5
      var xhr = new XMLHttpRequest();  
      xhr.open('GET', 'https://webapi.r1.rpost.net/api/v1/Users/UsageRemaining');
      xhr.setRequestHeader ("Authorization", "bearer " + result.access_token);
      xhr.send(formData);
      xhr.onreadystatechange = function (oEvent) 
      {  
         if (xhr.readyState === 4) 
         {  
            if (xhr.status === 200) 
            { 
               var result = JSON.parse(xhr.response);
               if(result.ResultContent.OnTrialPlan == true)
               {
                  if(result.ResultContent.UnitsRemaining <= zimletInstance._zimletContext.getConfig('trialUnitsRemainingTreshold'))
                  {
                     document.getElementById('RPostZimletRemainMessages').innerHTML = result.ResultContent.UnitsRemaining + ' ' + zimletInstance.getMessage('RPostZimlet_messagesRemaining') + '. ' + ZmMsg.reset + ': ' + result.ResultContent.PlanRange;
                     
                     //In case on trial and remain <= 5 show upgrade link
                     var xhr2 = new XMLHttpRequest();  
                     xhr2.open('GET', 'https://webapi.r1.rpost.net/api/v1/Users/UpgradeLink/zimlet?emailAddress='+userSettings.Email);
                     xhr2.send();
                     xhr2.onreadystatechange = function (oEvent) 
                     {  
                        if (xhr2.readyState === 4) 
                        {  
                           if (xhr2.status === 200) 
                           {
                              var result = JSON.parse(xhr2.response);  
                              
                              if(result.StatusCode == 200)
                              {
                                 document.getElementById('RPostZimletRemainMessages').innerHTML = document.getElementById('RPostZimletRemainMessages').innerHTML + '&nbsp;(<a target="_blank" href="'+result.ResultContent+'">'+zimletInstance.getMessage('RPostZimlet_upgrade') + '</a>)';
                              }   
                           }
                        }
                     }      
                  }   
               }               
            }
         }
      }
   } catch (err){};
};

/** Add encrypt and sign buttons to the toolbar in the compose tab. 
  * This method is called by the Zimlet framework when application toolbars are initialized.
  * See {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html#initializeToolbar ZmZimletBase.html#initializeToolbar}
  * 
  * @param	{ZmApp}				app				the application
  * @param	{ZmButtonToolBar}	toolbar			the toolbar
  * @param	{ZmController}		controller		the application controller
  * @param	{string}			   viewId			the view Id
 * */
RPost.prototype.initializeToolbar =
function(app, toolbar, controller, viewId) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   // bug fix #7192 - disable detach toolbar button
   toolbar.enable(ZmOperation.DETACH_COMPOSE, false);   
   
   if(viewId.indexOf("COMPOSE") >=0){
      if (toolbar.getButton('RPOST'))
      {
         //button already defined
         return;
      }
      var buttonArgs = {
         text    : ZmMsg.send + " " +  zimletInstance.getMessage('RPostZimlet_label'),
         index: 1,
         image: "com_rpost_rmail-panelIcon",
         showImageInToolbar: true,
         showTextInToolbar: true
      };
      var button = toolbar.createOp("RPOST", buttonArgs);
      button.addSelectionListener(new AjxListener(this, this.saveDraft, controller));
   }
};

RPost.prototype.saveDraft = function(controller) {
   //check if we have addresses, if not, Zimbra will not send the message, so need to try rmail.
   var composeView = appCtxt.getCurrentView();   
   var addrs = composeView.collectAddrs();
   if(!addrs.gotAddress)
   {
      RPost.prototype.status(ZmMsg.noAddresses, ZmStatusView.LEVEL_WARNING);
      return;
   }
   
   controller.saveDraft(ZmComposeController.DRAFT_TYPE_MANUAL, null, null, new AjxCallback(this, this.askSendOptions, [controller]));
};

RPost.prototype.askSendOptions =
function(controller) {    
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;

   //check if we have a subject, to avoid error pop-up on sending message
   var composeView = appCtxt.getCurrentView(); 
   if(!composeView._msg.subject)
   {
      RPost.prototype.status(ZmMsg.errorMissingSubject, ZmStatusView.LEVEL_WARNING);
      return;
   }
  
   //check if user is registered first and has the zimlet configured, if not do register
   try
   {
      var userSettings = JSON.parse(zimletInstance.getUserProperty("com_rpost_properties"));
      if(!userSettings.largeMailTreshold)
      {
         userSettings.largeMailTreshold = com_rpost_rmail_HandlerObject.largeMailDefault;
      }      
      var password = userSettings.Password;      
   } catch(err) { 
      zimletInstance.registerDialog();
      return;      
   }
   
   //Check if a large mail attachment is uploaded 
   var currentDraft = controller._draftMsg;
   var hasLargeMail = false;

   if(currentDraft)
   {
      currentDraft.attachments.forEach(function(attachment) {
         if(attachment.filename.match(/.rmail$/))
         {
            hasLargeMail = true;
         }
      });
   }
   zimletInstance._dialog = new ZmDialog( { title:zimletInstance.getMessage('RPostZimlet_label'), parent:this.getShell(), standardButtons:[DwtDialog.CANCEL_BUTTON,DwtDialog.OK_BUTTON], disposeOnPopDown:true } );
   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:325px;">'+
   '<img style="float:right;" src="'+zimletInstance.getResource("logo.png")+'">'+   
   '<br><span><b>'+zimletInstance.getMessage('RPostZimlet_trackProve')+'</b>'+
   '<br><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="radio" name="RPosttrackprove" value="marked" checked="checked" id="RPostMarked">'+zimletInstance.getMessage('RPostZimlet_trackProveMarked')+
   '<br><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="radio" name="RPosttrackprove" value="unmarked" id="RPostUnMarked">'+zimletInstance.getMessage('RPostZimlet_trackProveUnMarked')+'</span>'+
   '<hr class="rpostHr">' + 
   '<table><tr><td style="width:225px;"><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostencrypt" value="encrypt" id="RPostEncrypt"><b>'+zimletInstance.getMessage('RPostZimlet_encrypt')+'</b></td><td style="width:48%; text-align:right; padding-top:6px"><input title="'+zimletInstance.getMessage('RPostZimlet_encryptRPXtooltip')+'" onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostencryptRPX" value="encryptRPX" id="RPostEncryptRPX">'+zimletInstance.getMessage('RPostZimlet_encryptRPX')+'</td></tr></table>'+
   '<hr class="rpostHr">' +
   '<table><tr><td style="width:225px;"><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostESign" value="esign" id="RPostESign"><b>'+zimletInstance.getMessage('RPostZimlet_ESign')+'</b></td><td style="width:48%; text-align:right; padding-top:6px"><a href="#" id="rpostAdvancedLink" class="rpostAdvancedLinkDisabled" >'+ZmMsg.advanced+'</a></td></tr></table>'+
   '<hr class="rpostHr">' +
   '<span><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostLargeMail" value="largemail" id="RPostLargeMail"><b>'+zimletInstance.getMessage('RPostZimlet_LargeMail')+'</b><br><span id="RPostFormDescr"></span></span>'+
   '<hr class="rpostHr">' +
   '<span><b>'+zimletInstance.getMessage('RPostZimlet_SideNote')+'</b>'+   
   '<table><tr><td><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostSideNoteCC" value="sidenoteCC" id="RPostSideNoteCC">'+ZmMsg.cc+
   '<br><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostSideNoteBCC" value="sidenoteBCC" id="RPostSideNoteBCC">'+ZmMsg.bcc+'</span></td><td><textarea oninput="RPost.prototype.validateSideNote()" rows="4" placeholder="'+zimletInstance.getMessage('RPostZimlet_SideNotePlaceHolder')+'" class="RPostSideNote" id="RPostSideNote"></textarea><br></td></tr></table>'+   
   '<br><br><div style="color:#999999" id="RPostZimletRemainMessages"></div></div>'
   );
   
   if(hasLargeMail==true)
   {
      document.getElementById('RPostLargeMail').checked = true;
      document.getElementById('RPostLargeMail').disabled = true;
      document.getElementById('RPostESign').checked = false;
      document.getElementById("RPostESign").disabled = true;
      //make sure all attachments are in rpost
      RPost.prototype.checkServiceCompatiblity('largemail');
   }
   
   //cannot enable largemail if there are no attachments
   if(currentDraft.attachments.length == 0)
   {
      document.getElementById('RPostLargeMail').checked = false;
      document.getElementById('RPostLargeMail').disabled = true;      
   }
   
   try {
      if(currentDraft._addrs.CC._array.length > 0)
      {
         document.getElementById('RPostSideNoteCC').disabled = false;
      }
      else
      {
         document.getElementById('RPostSideNoteCC').disabled = true;
      }
   } catch (err)
   {
      document.getElementById('RPostSideNoteCC').disabled = true;
   }

   try {
      if(currentDraft._addrs.BCC._array.length > 0)
      {
         document.getElementById('RPostSideNoteBCC').disabled = false;
      }
      else
      {
         document.getElementById('RPostSideNoteBCC').disabled = true;
      }
   } catch (err)
   {
      document.getElementById('RPostSideNoteBCC').disabled = true;
   }   
   
   RPost.prototype._getRemainMessageCount();
   zimletInstance._dialog._button[2].setText(ZmMsg.send);
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, this.modifyMsg, [controller]));
   zimletInstance._dialog.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn));
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   zimletInstance._dialog.popup();   
};

// Work-around for Zimbra bug: https://bugzilla.zimbra.com/show_bug.cgi?id=108078
// Multiline values from addCustomMimeHeaders stripped by server
RPost.prototype.validateSideNote = function()
{
   document.getElementById('RPostSideNote').value = document.getElementById('RPostSideNote').value.replace(/[^0-9a-z %@!#$%^&*()?|\/-/.:+_-]/gmi, '');
};

RPost.prototype.checkServiceCompatiblity = function (clickedValue)
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   if(clickedValue=='largemail')
   {
      if(document.getElementById('RPostLargeMail').checked == true)
      {        
         document.getElementById('RPostESign').checked = false;
         document.getElementById("RPostESign").disabled = true;
         document.getElementById("RPostLargeMail").disabled = true;
         document.getElementById('RPostFormDescr').innerHTML = "<progress id='RPostLargeMailProgress'></progress>";
         zimletInstance._dialog.setButtonEnabled(DwtDialog.OK_BUTTON,false);

         //start transloading   
         zimletInstance.largeMailInProgress = true;
         RPost.prototype.nextFiletoUpload();
      
      }
      if(document.getElementById('RPostLargeMail').checked == false)
      {        
         document.getElementById("RPostESign").disabled = false;
      }
   }

   if(clickedValue=='encryptRPX')
   {
      if(document.getElementById('RPostEncryptRPX').checked == true)
      {
         document.getElementById('RPostEncrypt').checked = true;
         clickedValue = 'encrypt';
      }   
   }

   if(clickedValue=='encrypt')
   {
      if(document.getElementById('RPostEncrypt').checked == true)
      {
         document.getElementById('RPostUnMarked').disabled = true;
         document.getElementById('RPostUnMarked').checked = false;
      }
      else
      {
         if(document.getElementById('RPostESign').checked == false)
         {
            document.getElementById('RPostUnMarked').disabled = false;
         }   
         document.getElementById('RPostEncryptRPX').checked = false;
      }
   };

   if(clickedValue=='unmarked')
   {
      document.getElementById('RPostEncrypt').checked = false;
      document.getElementById('RPostEncryptRPX').checked = false;
      document.getElementById('RPostESign').checked = false;
      document.getElementById('RPostEncrypt').disabled = true;
      document.getElementById('RPostEncryptRPX').disabled = true;
      document.getElementById('RPostESign').disabled = true;
   };

   if(clickedValue=='marked')
   {
      document.getElementById('RPostEncrypt').disabled = false;
      document.getElementById('RPostEncryptRPX').disabled = false;
      document.getElementById('RPostESign').disabled = false;
   };

   if(clickedValue=='esign')
   {      
      if(document.getElementById('RPostESign').checked == true)
      {
         document.getElementById('rpostAdvancedLink').className = "rpostAdvancedLinkEnabled";
         document.getElementById('rpostAdvancedLink').href = "https://www.rmail.com/zimbra-rsign";
         document.getElementById('rpostAdvancedLink').target = "_blank";
         document.getElementById('RPostUnMarked').disabled = true;
         document.getElementById('RPostUnMarked').checked = false;
      }
      else
      {
         document.getElementById('rpostAdvancedLink').className = "rpostAdvancedLinkDisabled";
         document.getElementById('rpostAdvancedLink').href = "#";
         document.getElementById('rpostAdvancedLink').target = "";
         if(document.getElementById('RPostEncrypt').checked == false)
         {
            document.getElementById('RPostUnMarked').disabled = false;
         }   
         if(document.getElementById('RPostEncryptRPX').checked == false)
         {
            document.getElementById('RPostUnMarked').disabled = false;
         }  
      }
   };  
};

RPost.prototype.modifyMsg = function (controller)
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;   
   var composeView = appCtxt.getCurrentView();   
   var addrs = composeView.collectAddrs();

   var fieldValue = '';
	if(addrs.TO) {
		var to = addrs.TO.all;
		for(i = 0; i < to.size(); i++) {
			var address = to.get(i);
			if(address.getAddress().indexOf('.rpost.biz') < 0)
         {
            address.setAddress(address.getAddress() + '.rpost.biz');
         }   
			fieldValue += address.toString() + '; ';
		}
      composeView.setAddress(AjxEmailAddress.TO, '');
      composeView.setAddress(AjxEmailAddress.TO, fieldValue);
	}

   var fieldValue = '';
	if(addrs.CC) {
		var to = addrs.CC.all;
		for(i = 0; i < to.size(); i++) {
			var address = to.get(i);
			if(address.getAddress().indexOf('.rpost.biz') < 0)
         {
            address.setAddress(address.getAddress() + '.rpost.biz');
         }
			fieldValue += address.toString() + '; ';
		}
      composeView.setAddress(AjxEmailAddress.CC, '');
      composeView.setAddress(AjxEmailAddress.CC, fieldValue);
	}

   var fieldValue = '';   
	if(addrs.BCC) {
		var to = addrs.BCC.all;
		for(i = 0; i < to.size(); i++) {
			var address = to.get(i);
			if(address.getAddress().indexOf('.rpost.biz') < 0)
         {
            address.setAddress(address.getAddress() + '.rpost.biz');
         }
			fieldValue += address.toString() + '; ';
		}
      composeView.setAddress(AjxEmailAddress.BCC, '');
      composeView.setAddress(AjxEmailAddress.BCC, fieldValue);
	}


   var largeMailIds = [];
   var composeView = appCtxt.getCurrentView();
   composeView._partToAttachmentMap.forEach(function(attachment) {        
      if(attachment.label.match(/.rmail$/))
      {   
         var split = attachment.label.split('.');
         largeMailIds.push(split[split.length-2]);
      }
   });   

   //Check for and add large mail
   if(largeMailIds.length > 0)
   {
      //Get a fresh token
      var userSettings = JSON.parse(zimletInstance.getUserProperty("com_rpost_properties"));   
      if(!userSettings.largeMailTreshold)
      {
         userSettings.largeMailTreshold = com_rpost_rmail_HandlerObject.largeMailDefault;
      }      
      var xhr = new XMLHttpRequest();  
      xhr.open('POST', 'https://webapi.r1.rpost.net/Token', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      var formData = 'grant_type=password&username='+
      encodeURIComponent(userSettings.Email)+'&Password='+ 
      encodeURIComponent(userSettings.Password);
      xhr.send(formData);  
      xhr.onreadystatechange = function (oEvent) 
      {  
         if (xhr.readyState === 4) 
         {  
            if (xhr.status === 200) 
            {  
               var result = JSON.parse(xhr.response);  
               var access_token = result.access_token
               
               var _xhr = new XMLHttpRequest();  
               _xhr.open('POST', 'https://webapi.r1.rpost.net/api/v1/Mail/LargeFileTransfer', false);
               _xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
               _xhr.setRequestHeader ("Authorization", "bearer " + access_token);

               var data = {};
               data['Attachments'] = largeMailIds;
               data['SenderAddress'] = userSettings.Email;
               // send the collected data as JSON
               data = JSON.stringify(data);
               
               //there has to be a better way of adding an array (largeMailIds)...
               data = data.replace('"[','[');
               data = data.replace(']"',']');
               _xhr.send(data); 
               
               var result = JSON.parse(_xhr.response);  
               document.getElementById('RPostLargeMail').value = result.Key; 

               //remove rmail attachments
               var composeView = appCtxt.getCurrentView();
               var fileList = "";
               composeView._partToAttachmentMap.forEach(function(attachment) {        
                  if(attachment.label.match(/.rmail$/))
                  {   
                     fileList = fileList + attachment.label.replace(/\.[a-z0-9]{8}\.rmail$/,'') + "\n";
                     composeView._removeAttachedFile(attachment.spanId,attachment.part);
                  }
               });   
               var mimePart = new ZmMimePart();
               mimePart.setContentType('text/x-rmail-zimlet');
               mimePart.setContent('<rmail-zimlet-filelist>'+fileList+'</rmail-zimlet-filelist>');
               
               composeView.addMimePart(mimePart);

               controller.sendMsg();
            }
         }
      }      
   }
   else
   {
      controller.sendMsg();
   }
};

//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Type
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-App
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-TLS
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-SecuRmail
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-SecuRmail-AutoPassword
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-SendPassword
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Esign
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Sidenote-Text
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Sidenote-Bcc
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Sidenote-Cc
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-LargeMail
RPost.prototype.addCustomMimeHeaders =
function(customHeaders) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;   
   if(document.getElementById('RPostEncrypt'))
   {
      customHeaders.push({name:"X-RPost-App", _content:"zimlet"});

      if (document.getElementById('RPostEncryptRPX').checked == true)
      {        
         customHeaders.push({name:"X-RPost-SecuRmail", _content:"1"});
         customHeaders.push({name:"X-RPost-SecuRmail-AutoPassword", _content:"1"});
         customHeaders.push({name:"X-RPost-SendPassword", _content:"1"});
      }
      else if (document.getElementById('RPostEncrypt').checked == true)
      {        
         customHeaders.push({name:"X-RPost-TLS", _content:"1"});
         customHeaders.push({name:"X-RPost-SecuRmail", _content:"1"});
         customHeaders.push({name:"X-RPost-SecuRmail-AutoPassword", _content:"1"});
         customHeaders.push({name:"X-RPost-SendPassword", _content:"1"});
      }
      
      if (document.getElementById('RPostMarked').checked == true)
      {
         customHeaders.push({name:"X-RPost-Type", _content:"1"});
      }
      else if (document.getElementById('RPostUnMarked').checked == true)
      {
         customHeaders.push({name:"X-RPost-Type", _content:"2"});
      }

      if (document.getElementById('RPostESign').checked == true)
      {
         customHeaders.push({name:"X-RPost-Esign", _content:"1"});
      }
      
      if ( (document.getElementById('RPostSideNoteCC').checked)||(document.getElementById('RPostSideNoteBCC').checked)
      && (document.getElementById('RPostSideNote').value.length > 0)
      )
      {
         customHeaders.push({name:"X-RPost-Sidenote-Text", _content:document.getElementById('RPostSideNote').value});
         
         if(document.getElementById('RPostSideNoteCC').checked)
         {
            customHeaders.push({name:"X-RPost-Sidenote-Cc", _content:"1"});
         }
         else
         {
            customHeaders.push({name:"X-RPost-Sidenote-Cc", _content:"0"});
         }

         if(document.getElementById('RPostSideNoteBCC').checked)
         {
            customHeaders.push({name:"X-RPost-Sidenote-Bcc", _content:"1"});
         }
         else
         {
            customHeaders.push({name:"X-RPost-Sidenote-Bcc", _content:"0"});
         }                  
      }
     
      if(document.getElementById('RPostLargeMail').checked)
      {
         customHeaders.push({name:"X-RPost-LargeMail", _content:document.getElementById('RPostLargeMail').value});
      }
      
      if(!zimletInstance.largeMailInProgress == true)
      {
         setTimeout(function(){zimletInstance._cancelBtn(); }, 500);
      }         
   }   
};

/** Function to handle a show/hide button for password type input fields
 */
RPost.prototype.toggle_password = function (target) {
   var tag = document.getElementById(target);
   
   if (tag.getAttribute('type') == 'password')
   {
      tag.setAttribute('type', 'text');
   }
   else 
   {
      tag.setAttribute('type', 'password');   
   }
};

/** Method to match the Zimbra user langauge to the closest one in RPOST
 */
RPost.prototype.getLanguage = function () {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();   
   var userZimbraLang = appCtxt.get(ZmSetting.LOCALE_NAME).substring(0,2);
   var rpostLang = "en-us"; //default if no match was found
   try {
      xhr.open('GET', 'https://webapi.r1.rpost.net/api/v1/Lookup/Language', false);
      xhr.send(); 
      var result = JSON.parse(xhr.response);    
      if(result.StatusCode == 200)
      {        
         for(i = 0; i < result.ResultContent.length; i++) {
            if(result.ResultContent[i].Code.substring(0,2) == userZimbraLang)
            {
               console.log('RPost.prototype.getLanguage: success, returning language: ' + result.ResultContent[i].Code);
               rpostLang = result.ResultContent[i].Code;               
            }
         }               
      }
   }   
   catch (err)
   {
      console.log('RPost.prototype.getLanguage: Failed, network error, return fallback language en-us ' + err);
   }
   return rpostLang;
};

/** Method to match the Zimbra user timezone to the closest one in RPOST
 */
RPost.prototype.getTimezone = function () {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();   
   var userZimbraTimezone = appCtxt.get(ZmSetting.DEFAULT_TIMEZONE).split("/");
   userZimbraTimezone = userZimbraTimezone[1];
   var rpostTimezone = "US Eastern Standard Time"; //default if no match was found
   try {
      xhr.open('GET', 'https://webapi.r1.rpost.net/api/v1/Lookup/timezone', false);
      xhr.send(); 
      var result = JSON.parse(xhr.response);    
      if(result.StatusCode == 200)
      {        
         for(i = 0; i < result.ResultContent.length; i++) {
            if(result.ResultContent[i].Description.indexOf(userZimbraTimezone) > -1)
            {
               console.log('RPost.prototype.getTimezone: success, returning timezone: ' + result.ResultContent[i].Code);
               rpostTimezone = result.ResultContent[i].Code;               
            }
         }               
      }
   }   
   catch (err)
   {
      console.log('RPost.prototype.getTimezone: Failed, network error, return fallback getTimezone US Eastern Standard Time ' + err);
   }
   return rpostTimezone;
};

/** Method implements check to see if attachment is too large for SMTP and asks user to use rmail.
 * */
RPost.prototype.onShowView =
  function(view) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   //check if user is registered first and has the zimlet configured, if not, do not handle large mail
   try
   {
      var userSettings = JSON.parse(zimletInstance.getUserProperty("com_rpost_properties"));
      if(!userSettings.largeMailTreshold)
      {
         userSettings.largeMailTreshold = com_rpost_rmail_HandlerObject.largeMailDefault;
      }      
      var password = userSettings.Password;      
   } catch(err) { 
      return;      
   }
     
   //Check if Nextcloud/webdav zimlet is installed and deals with large attachments
   try {
      var zimletInstance = appCtxt._zimletMgr.getZimletByName('tk_barrydegraaff_owncloud_zimlet').handlerObject;
      if(zimletInstance._zimletContext.getConfig("owncloud_zimlet_disable_auto_upload_on_exceed")=="false")
      {
         //Let Nextcloud/webdav zimlet deal with large attachments
         return;
      }
   } catch(err){  } //Nextcloud/webdav zimlet not installed, continue
        
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var controller = appCtxt.getCurrentController();
   // Nothing to do except for mail compose view
   if(view.indexOf(ZmId.VIEW_COMPOSE) < 0) return;
   //Upload to rmail if the file exceed message size limit
   var currentView = appCtxt.getCurrentView();
   if(!currentView.isRPostModified) {
      currentView._submitMyComputerAttachmentsOrig = currentView._submitMyComputerAttachments;
      currentView._submitMyComputerAttachments = function(files, node, isInline)
      {
         if (!files)
            files = node.files;
         var size = 0;
         if (files) 
         {
            for (var j = 0; j < files.length; j++) {
               var file = files[j];
               //Check the total size of the files we upload this time
               size += file.size || file.fileSize /*Safari*/ || 0;
            }
            // Check if max exceeded         
            var max_size = appCtxt.get(ZmSetting.MESSAGE_SIZE_LIMIT);
            if(((max_size != -1 /* means unlimited */) && (size > max_size)) || (size > (userSettings.largeMailTreshold * 1024 * 1024))){
               zimletInstance.largeMailDialog(files);
            } 
            else {
               currentView._submitMyComputerAttachmentsOrig(files, node, isInline);
            }
         }
      };
      currentView.isRPostModified = true;
   }
};

/**
 * This method is called when sending an email. This function checks and sets/pushes value to
 * boolAndErrorMsgArray indicating if there was an error or not. If there was an error(i.e. attachment is missing),
 * then it will push {hasError:true, errorMsg:"Attachment is missing", zimletName:"ConfigurableAttachAlertZimlet"} hash-object to boolAndErrorMsgArray array.
 *  If there are no errors, it will simply return <code>null</code>.
 *
 * @param {ZmMailMsg} mail 		the mail object
 * @param {array} boolAndErrorMsgArray	an array of hash objects
 */
RPost.prototype.emailErrorCheck =
function(mail, boolAndErrorMsgArray) { 
   try {
      //the user clicked the Send RMail button, so no need for the warning
      if(document.getElementById('RPostEncrypt'))
      {
         return null;
      }
      var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
      
      var hasLargeMail = false;
      for (var k = 0; k < mail._origMsg.attachments.length; k++) {
         if(mail._origMsg.attachments[k].filename.match(/.rmail$/))
         {
            hasLargeMail = true;
            break;
         }
      }
   
      if (!hasLargeMail)
      {
         return null;
      }   
      
      //there is an .rmail attachment, but the user is not using the Send RMail button
      var errParams = {
            hasError:true,
            errorMsg: zimletInstance.getMessage('RPostZimlet_removeLargeMail'),
            zimletName:"RPost"
      };
   
      return boolAndErrorMsgArray.push(errParams);
   }
   catch(err)
   {
      return null;   
   }
};

/** Method asks the user to use Large Mail on too large attachment
 * */
RPost.prototype.largeMailDialog = function(files) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   zimletInstance._dialog = new ZmDialog( { title:zimletInstance.getMessage('RPostZimlet_LargeMail'), parent:this.getShell(), standardButtons:[DwtDialog.OK_BUTTON,DwtDialog.CANCEL_BUTTON], disposeOnPopDown:true } );   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:110px;">'+
   '<img style="margin:10px;margin-left:0px;" src="'+zimletInstance.getResource("logo.png")+'">'+
   '<br><span id="RPostFormDescr">'+zimletInstance.getMessage('RPostZimlet_TooLargeMsg')+'</span><br><br>'+
   '</div>'
   );   
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance._uploadFilesFromForm, [files]));
   zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance._uploadFilesFromForm, [files]));
   zimletInstance._dialog.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn));  
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   zimletInstance._dialog.popup(); 
};

/** Method gets a new token and adds progressbar for large mail uploads
 * */
RPost.prototype._uploadFilesFromForm = function (files) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   document.getElementById('RPostFormDescr').innerHTML = "<progress id='RPostLargeMailProgress'></progress>";
   zimletInstance._dialog.setButtonEnabled(DwtDialog.OK_BUTTON, false);

   //Get a fresh token
   var userSettings = JSON.parse(zimletInstance.getUserProperty("com_rpost_properties"));   
   if(!userSettings.largeMailTreshold)
   {
      userSettings.largeMailTreshold = com_rpost_rmail_HandlerObject.largeMailDefault;
   }   
   var xhr = new XMLHttpRequest();  
   xhr.open('POST', 'https://webapi.r1.rpost.net/Token', true);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   
   var formData = 'grant_type=password&username='+
   encodeURIComponent(userSettings.Email)+'&Password='+ 
   encodeURIComponent(userSettings.Password);
   xhr.send(formData);  
   xhr.onreadystatechange = function (oEvent) 
   {  
      if (xhr.readyState === 4) 
      {  
         if (xhr.status === 200) 
         {  
            var result = JSON.parse(xhr.response);  
            var access_token = result.access_token
            zimletInstance.uploadLargeMail(files[0], access_token);
         }
      }
   }   
};

/** Method uploads files to RPost
 * */
RPost.prototype.uploadLargeMail = function (file, access_token)
{
      try {
      var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
      var xhr = new XMLHttpRequest();  
      xhr.open('POST', 'https://webapi.r1.rpost.net/api/Upload', true);
      xhr.setRequestHeader ("Authorization", "bearer " + access_token);
   
      var formData = new FormData();
      formData.append('file', file, file.name);
         
      xhr.send(formData);
      xhr.onreadystatechange = function (oEvent) 
      {
         if (xhr.readyState === 4)
         { 
            if (xhr.status === 200) 
            {
               var result = JSON.parse(xhr.response);  
               if(xhr.response)
               {
                  zimletInstance.fakeAttachment(file.name, xhr.response);
               }   
            }
         }
      }
   } catch (err) {
      RPost.prototype.status(ZmMsg.uploadFailed + " " + file.name, ZmStatusView.LEVEL_WARNING);
   }
};

/** Method creates a fake attachment in Zimbra with the RPost upload id so we can attach it when sending
 * */
RPost.prototype.fakeAttachment = function (attachmentName, id) { 
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;

   //Check for duplicate filename   
   var composeView = appCtxt.getCurrentView();
   var conflictError = false;
   composeView._partToAttachmentMap.forEach(function(attachment) {        
      if(attachment.label.match(/.rmail$/))
      {
         if(attachment.label.toLowerCase().replace(/\.[a-z0-9]{8}\.rmail$/,'') == attachmentName.toLowerCase())
         {
            conflictError = true;
         }   
      }         
   });
   
   if(conflictError)
   {
      RPost.prototype.status(ZmMsg.errorAlreadyExists.replace('{1}',ZmMsg.file).replace('{0}',attachmentName), ZmStatusView.LEVEL_CRITICAL);
      document.getElementById('RPostFormDescr').innerHTML = ZmMsg.errorAlreadyExists.replace('{1}',ZmMsg.file).replace('{0}',attachmentName);
      return;
   }
   
   req = new XMLHttpRequest();
   req.open("POST", "/service/upload?fmt=extended,raw", true);        
   req.setRequestHeader("Cache-Control", "no-cache");
   req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
   req.setRequestHeader("Content-Type",  "text/plain" + ";");
   req.setRequestHeader("X-Zimbra-Csrf-Token", window.csrfToken);
   try {
      //works for ASCII file names
      req.setRequestHeader("Content-Disposition", 'attachment; filename="'+ attachmentName + '.' + id.replace(/"/g,'') + '.rmail"');
   }
   catch (err) {
      req.setRequestHeader("Content-Disposition", 'attachment; filename="'+ id + '.rmail"');
   }
   var myWindow = this;
   myWindow.attachment_ids = [];
   req.onload = function(e)
   {
      var resp = eval("["+req.responseText+"]");
      var respObj = resp[2];
      var attId = "";
      for (var i = 0; i < respObj.length; i++) 
      {
         if(respObj[i].aid != "undefined") {
            myWindow.attachment_ids.push(respObj[i].aid);            
            var attachment_list = myWindow.attachment_ids.join(",");
            var controller = appCtxt.getApp(ZmApp.MAIL).getComposeController(appCtxt.getApp(ZmApp.MAIL).getCurrentSessionId(ZmId.VIEW_COMPOSE));
            if(!document.getElementById('RPostLargeMail'))
            {
               controller.saveDraft(ZmComposeController.DRAFT_TYPE_MANUAL, attachment_list);
            }
            else
            {
               controller.saveDraft(ZmComposeController.DRAFT_TYPE_MANUAL, attachment_list, null,new AjxCallback(zimletInstance, zimletInstance.nextFiletoUpload));               
            }   
         }
      }
      if(!document.getElementById('RPostLargeMail'))
      {
         myWindow._cancelBtn();
      }
   }      
   req.send('This is an RMail attachment placeholder, it means your attachment was uploaded to RPost service, and is not stored on your mail server.');
};

/** This is a method that gets the next file to transload from Zimbra to RPost (called and called as callback when one attachment is finished)
 * Also cleans up after the last file is done.
 */
RPost.prototype.nextFiletoUpload = function () {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;

   var composeView = appCtxt.getCurrentView();
   var attachment = null;
   for(var x=0; x < composeView._partToAttachmentMap.length; x++)
   {
      if(!composeView._partToAttachmentMap[x].label.match(/\.rmail$/))
      {
         attachment = composeView._partToAttachmentMap[x];
         break;
      }
   }

   if(!attachment)
   {
      document.getElementById('RPostFormDescr').innerHTML = "";
      //make sure it is saved
      var controller = appCtxt.getApp(ZmApp.MAIL).getComposeController(appCtxt.getApp(ZmApp.MAIL).getCurrentSessionId(ZmId.VIEW_COMPOSE));
      controller.saveDraft(ZmComposeController.DRAFT_TYPE_MANUAL);
      zimletInstance.largeMailInProgress = false;
      zimletInstance._dialog.setButtonEnabled(DwtDialog.OK_BUTTON,true);
      return;
   }

   var xhr = new XMLHttpRequest();  
   xhr.open('GET', attachment.url, true);
   xhr.responseType = "blob";
   xhr.send();  
   xhr.onreadystatechange = function (oEvent) 
   {  
      if (xhr.readyState === 4) 
      {  
         if (xhr.status === 200) 
         {  
            var File = new Blob([xhr.response]);
            File.name = attachment.label;
            RPost.prototype._uploadFilesFromForm([File]);
            composeView._removeAttachedFile(attachment.spanId,attachment.part);
         }
      }
   }
};
