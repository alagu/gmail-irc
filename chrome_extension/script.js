var CHAT  = {};

(function(){

 CHAT.buttonLoaded = false;
 CHAT.user         = '';
 CHAT.domain       = '';
 CHAT.displayed    = false;
 

 CHAT.retryLoad = function()
 {
    var inboxNode = $('.nH');
    if(inboxNode)
    {
      CHAT.buttonLoaded = true;
      console.log("Page loaded");
      CHAT.loadChatBox();
    }
    
    if(CHAT.buttonLoaded == false)
    {
      setTimeout(CHAT.retryLoad, 1000);
    }
 };
 

 CHAT.toggleChatBox = function()
 {
   if(CHAT.displayed) {
     $('#content-iframe').hide();
     $('#teamchat').css('height','22px');
     CHAT.displayed = false;
   }
   else
   {
     $('#content-iframe').show();
     $('#teamchat').css('height','200px');
     CHAT.displayed = true;
   }
   localStorage["chat_displayed"] = CHAT.displayed;
 }
 
 CHAT.loadChatBox = function()
 {
   var node = $('<div id="teamchat" style="border:1px solid #d9d9d9;background-color:#fff;bottom:20px;width:500px;height:200px;left:10px;position:fixed;padding:1px;display:block !important;z-index:9999999;"><div id="toggleIRC" style="background-color:#222;color:#fff;font-size:13px;font-weight:bold;padding:2px;height:19px;cursor:pointer;font-family: arial, sans-serif;"><img style="background: url(https://mail.google.com/mail/u/0/?ui=2&view=dim&iv=mjkstio3e8w4&it=ic) no-repeat -20px -80px;width: 16px;height: 16px;float:right;" src="images/cleardot.gif" alt="Minimize"><div id="chat-title" style="margin-left: 5px;">IRC</div></div><iframe style="border:0 none;width:100%;height:100%;" id="content-iframe" style="display:none;"></iframe><div style="font-size:13px;padding:5px;" id="not-supported"></div></div>');
   $('body').append(node);
   CHAT.displayed = true;
   
   $('#toggleIRC').click(CHAT.toggleChatBox);
   if(localStorage["chat_displayed"] == "false")
   {
     CHAT.toggleChatBox();
   }
   
   
   var onGetInboxSuccess = function(data)
   {
     var parser = new DOMParser();
     var xmlDocument = $(parser.parseFromString(data, "text/xml"));
     var fullCount = xmlDocument.find('fullcount').text();

     var mailTitle = $(xmlDocument.find('title')[0]).text().replace("Gmail - ", "");
     var mailAddress = mailTitle.match(/([\S]+@[\S]+)/ig)[0];
     
     CHAT.user = mailAddress.split('@')[0];
     CHAT.domain = mailAddress.split('@')[1];

     if(CHAT.domain == 'gmail.com')
     {
       if(localStorage["gmailcom_info"] > 3) {
         $('#teamchat').remove();
       }
       else 
       {
         document.getElementById('chat-title').innerHTML = ('GMail.com is not supported');
         document.getElementById('not-supported').innerHTML = ('We think this works better for GMail businesses <br> Eg: <a href="http://google.com/a/twitter.com">http://google.com/a/twitter.com/</a>. <br> With gmail.com domain it becomes a public chat room. <br> &nbsp;&nbsp;-Alagu (allagappan@gmail.com)');
         $('#content-iframe').css('width','0px');
         $('#content-iframe').css('height','0px');
         $('#teamchat').css('height','22px');
         CHAT.displayed = false;
         localStorage["gmailcom_info"] = ("gmailcom_info" in localStorage) ? parseInt(localStorage["gmailcom_info"],10) + 1 : 1;
       }
     }
     else
     {
       $('#chat-title').html(CHAT.domain + '  chat');
       $('#content-iframe').attr('src','http://chat.alagu.net:81#' + mailAddress);
       $('#content-iframe').show();
     }
   }
   
   $.ajax({
      type: "GET",
      dataType: "text",
      url: "https://mail.google.com/mail/feed/atom/",
      timeout: 5000,
      success: function (data) { onGetInboxSuccess(data); },
      error: function (xhr, status, err) { console.log("Error");}
   });
   
 }
 
   setTimeout(CHAT.retryLoad, 1000);
 
 })();
