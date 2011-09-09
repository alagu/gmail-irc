var CHAT  = {};

(function(){

 CHAT.buttonLoaded = false;
 CHAT.user         = '';
 CHAT.domain       = '';


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
 
 CHAT.loadChatBox = function()
 {
   var node = $('<div id="teamchat" style="background-color:#fff;bottom:20px;width:500px;height:200px;left:0px;position:fixed;padding:1px;display:block !important;z-index:9999999;"><div  id="teamchat-wrap" style="width:100%;height:100%;"><iframe style="border:0 none;width:100%;height:100%;" id="content-iframe" style="display:none;"></iframe></div>');
   $('body').append(node);
   
   
   var onGetInboxSuccess = function(data)
   {
     var parser = new DOMParser();
     var xmlDocument = $(parser.parseFromString(data, "text/xml"));
     var fullCount = xmlDocument.find('fullcount').text();

     var mailTitle = $(xmlDocument.find('title')[0]).text().replace("Gmail - ", "");
     var mailAddress = mailTitle.match(/([\S]+@[\S]+)/ig)[0];
     
     CHAT.user = mailAddress.split('@')[0];
     CHAT.domain = mailAddress.split('@')[1];
     console.log(CHAT.user);
     console.log(CHAT.domain);
     $('#content-iframe').attr('src','http://chat.alagu.net:81#' + mailAddress);
     $('#content-iframe').show();
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
