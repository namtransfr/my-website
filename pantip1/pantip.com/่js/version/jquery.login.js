$(document).ready(function(){$.oauthFacebook.authen();$.oauthFacebook.btnSetpwd();$.oauthFacebook.btnLogin();$.oauthGoogle.authen();$.oauthSetPwd.confirm();});(function($){$.oauthFacebook={};$.oauthGoogle={};$.oauthGoogle.authen=function()
{$(document).on('click','#gm_authen',function(){handleGoogleClientLoad();});}
$.oauthFacebook.defaults={ajaxrequest:false};$.oauthFacebook.authen=function()
{window.fbAsyncInit=function(){FB.init({appId:'117368861736328',cookie:true,xfbml:true,version:'v4.0'});};(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id)){return;}
js=d.createElement(s);js.id=id;js.src="//connect.facebook.net/th_TH/sdk.js";fjs.parentNode.insertBefore(js,fjs);}(document,'script','facebook-jssdk'));$(document).on('click','#fb_authen',function(){FB.login(function(response){if(response.authResponse)
{FB.api('/me',{fields:'name, email, link'},function(response){if(response.email!==undefined)
{$.ajax({type:"POST",url:'/login/fb_oauth',dataType:'json',data:{v:response},timeout:15000,error:function(jqXHR,exception,err){$.errorNotice.dialog(err,{title:'แจ้งเตือน'});},success:function(rs){if(rs!=null)
{if(rs.authen_error!=undefined&&rs.authen_error==1)
{$('.login_lb_process').html('<p>เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง</p>');}
if(rs.member_notify!=undefined&&rs.member_notify==1)
{$.errorNotice.dialog(rs.error_message,{title:'แจ้งเตือน',btn_close:'รับทราบ',action:'member_notify',url:'/login/l_acknowledge',authen_type:'oauth',param_id:rs.id});return false;}
if(rs.error==true)
{$.errorNotice.dialog(rs.error_message,{title:'แจ้งเตือน'});return false;}
if(rs.email_matching!=undefined)
{form_fb_login({user_email:response.email,user_nickname:rs.nickname,email_matching:rs.email_matching,type:'facebook'});return false;}
if(rs.login_success!=undefined&&rs.login_success==1&&rs.display_avatar.mid>0)
{window.location.reload();}}}});}
else
{$.errorNotice.dialog('ขออภัย ไม่สามารถเข้าสู่ระบบด้วย facebook ได้ กรุณาลองใหม่อีกครั้ง แล้วเลือกให้พันทิปเข้าถึงข้อมูล Email ของคุณบน facebook',{title:'แจ้งเตือน'});return false;}});}
else
{return false;}},{scope:'email',auth_type:'rerequest'});});}
$.oauthFacebook.btnSetpwd=function()
{var options=$.oauthFacebook.defaults;$(document).on('click','#user_pwd_btn',function(){var u_login={};var before=$(document.body).data('fb_login');var after=$.extend({},before,{'crypted_password':$('#member_password2').val()});$(document.body).data('fb_login',after);if(options.ajaxrequest==false)
{options.ajaxrequest=true;$(this).after('<span class="loading-txt small-txt">กำลังประมวลผล โปรดรอสักครู่..</span>');$.ajax({type:"POST",url:'/login/fb_create',dataType:'json',data:{value:$.data(document.body).fb_login},success:function(rs)
{options.ajaxrequest=false;$('.loading-txt').remove();if(rs.pwd_success!=undefined&&rs.pwd_success==0)
{$('#pwd-error').html('กรุณากรอกรหัสผ่านมากกว่า 6 ตัวอักษร!!');$('#member_password2').focus();}
if(rs.create_success!=undefined&&rs.create_success==1&&rs.display_avatar.mid>0)
{window.location.reload();}}});}});};$.oauthFacebook.btnLogin=function()
{var options=$.oauthFacebook.defaults;$(document).on('keydown','#member_password2',function(e){if(e.which==13)
{$('#user_login_btn_fb').trigger('click');}});$(document).on('click','#user_login_btn_fb',function(){var before=$(document.body).data('fb_login');var after=$.extend({},before,{'crypted_password':$('#member_password2').val()});$(document.body).data('fb_login',after);if(options.ajaxrequest==false)
{options.ajaxrequest=true;$(this).after('<span class="loading-txt small-txt">กำลังประมวลผล โปรดรอสักครู่..</span>');$.ajax({type:"POST",url:'/login/fb_login',dataType:'json',data:{value:$.data(document.body).fb_login},timeout:15000,error:function(jqXHR,exception,err){$.errorNotice.dialog(err,{title:'แจ้งเตือน'});options.ajaxrequest=false;},success:function(rs){options.ajaxrequest=false;$('.loading-txt.small-txt').remove();if(rs.login_success==0)
{$('#login_error').html('รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง');}
else
{if(rs.member_notify!=undefined&&rs.member_notify==1)
{$.errorNotice.dialog(rs.error_message,{title:'แจ้งเตือน',btn_close:'รับทราบ',action:'member_notify',url:'/login/l_acknowledge',authen_type:'oauth',param_id:rs.id});return false;}
if(rs.login_success==1)
{window.location.reload();}}
$('.loading-txt').remove();}});}});};$.oauthSetPwd={};$.oauthSetPwd.confirm=function()
{$(document).on('keydown','#member_password2',function(e){if(e.which==13)
{$('#oauth_pwd_btn').trigger('click');}});$(document).on('click','#oauth_pwd_btn',function(){$('.loading-txt').remove();$(this).after(' <span class="loading-txt small-txt">กำลังประมวลผล โปรดรอสักครู่..</span>');if($.trim($('#member_password2').val()).length<6)
{$('.oauth-loading').remove();$('#pwd-error').html('กรุณากำหนดรหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร');$('#member_password2').focus();$('.loading-txt').remove();}
else
{var before=$(document.body).data('oauth_login');var after=$.extend({},before,{'crypted_password':$('#member_password2').val()});$(document.body).data('oauth_login',after);$('#pwd-error').html('');$.ajax({type:"POST",url:'/login/set_oauth_pwd',dataType:'json',data:{v:$(document.body).data('oauth_login')},success:function(rs){$('.loading-txt').remove();if(rs.pwd_success!=undefined&&rs.pwd_success==0)
{$('#pwd-error').html('กรุณากรอกรหัสผ่านมากกว่า 6 ตัวอักษร!!');$('#member_password2').focus();}
if(rs.create_success!=undefined&&rs.create_success==1)
{window.location.reload();}}});}});}
var clientIdGoogle='152470619813';var apiKeyGoogle='AIzaSyAN4v6JwDdORBCpaRSFyk38ZH72LGaUh1E';var scopesGoogle='https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';function handleGoogleClientLoad()
{gapi.client.setApiKey(apiKeyGoogle);gapi.auth.authorize({client_id:clientIdGoogle,scope:scopesGoogle,immediate:false},makeGoogleApiCall);}
function makeGoogleApiCall(){gapi.client.load('oauth2','v2',function(){var request=gapi.client.oauth2.userinfo.get({});request.execute(function(resp){if(!resp.error)
{if(!resp.link)
{resp.link='';}
$(document.body).data('oauth_login',{'id':resp.id,'email':resp.email,'link':resp.link,'type':'google'});checkOauthAccount($(document.body).data('oauth_login'));}});});}
function checkOauthAccount(data)
{$.ajax({type:"POST",url:'/login/check_is_member',data:{v:data},timeout:15000,error:function(jqXHR,exception,err){$.errorNotice.dialog(err,{title:'แจ้งเตือน'});},success:function(rs){if(rs=="false")
{$.errorNotice.dialog('ขออภัย Email นี้ไม่สามารถสมาชิกเว็บพันทิปได้ครับ',{title:'แจ้งเตือน'});return false;}
if(rs=="true")
{$.ajax({type:"POST",url:'/login/oauth_login',dataType:'json',data:{v:data},timeout:15000,error:function(jqXHR,exception,err){$.errorNotice.dialog(err,{title:'แจ้งเตือน'});},success:function(rs){if(rs.member_notify!=undefined&&rs.member_notify==1)
{$.errorNotice.dialog(rs.error_message,{title:'แจ้งเตือน',btn_close:'รับทราบ',action:'member_notify',url:'/login/l_acknowledge',authen_type:'oauth',param_id:rs.id});return false;}
if(rs.error==true)
{$.errorNotice.dialog(rs.error_message,{title:'แจ้งเตือน'});return false;}
if(rs.ck=='true')
{window.location.reload();}}});}
else
{$('.oauth_loading').remove();$('.login_lb_process').remove();var lb_oauth_div='<div id="oauth_lb_process" class="lightbox-hide"></div>';$('.footer').append(lb_oauth_div);$('#oauth_lb_process').html(rs).dialog({width:500,title:'กำหนดรหัสผ่านใหม่',modal:true,resizable:false,dragable:false,close:function()
{$('#oauth_lb_process').remove();}}).find('#member_password').after('<input type="password" autocomplete="off" value="" id="member_password2" name="member[crypted_password]" class="text">').end().find('#member_password').hide();$('#user_pwd_btn').attr('id','oauth_pwd_btn');$('#member_password2').focus();$('#member_password2').passwordStrength({targetDiv:'#iSM',classes:Array('weak','medium','strong')});$('#member_password2').disallowThai();}
return false;}});}
function form_fb_login($obj)
{$('#lightbox_login').remove();$('.footer').after('<div class="lightbox-hide remove" id="lightbox_login"></div>');if($obj.email_matching==1)
{$.ajax({type:"POST",url:'/login/facebook_set_pwd',success:function(rs){$('#lightbox_login').html(rs).dialog({modal:true,resizable:false,width:500,draggable:false,close:function(){$('#lightbox_login').dialog('destory').remove();}}).find('#member_password').after('<input type="password" autocomplete="off" value="" id="member_password2" name="member[crypted_password]" class="text">').end().find('#member_password').hide();$('.section-oauth,.section-remember').remove();$('.ui-dialog-title').text('พบข้อมูลของคุณอยู่ในระบบ');$(document.body).data('fb_login',{'email':$obj.user_email});$('#div_login_lb_form').prepend('<div class="input-line"><label></label><div class="input-container">คุณมีบัญชีผู้ใช้ใน pantip.com แล้ว</div></div>');$('.section-one').html('<label>อีเมล</label><div class="input-container"><p>'+$obj.user_email+'</p></div>');$('.section-one').after('<div class="input-line section-nickname"><label>นามแฝง</label><div class="input-container"><p>'+$obj.user_nickname+'</p></div></div>');$('#user_login_btn').replaceWith('<a class="button normal-butt" id="user_login_btn_fb" href="javascript:void(0);"><span><em>ตกลง</em></span></a>');}});}
if($obj.email_matching==0)
{$.ajax({type:"POST",url:'/login/authen_set_pwd',success:function(rs){$('#lightbox_login').html(rs).dialog({title:'กำหนดรหัสผ่านใหม่',modal:true,resizable:false,width:500,draggable:false,close:function(){$('#lightbox_login').dialog('destory').remove();}}).find('#member_password').attr('id','member_password2');$('#member_password2').passwordStrength({targetDiv:'#iSM',classes:Array('weak','medium','strong')});$('#member_password2').disallowThai();$(document.body).data('fb_login',{'email':$obj.user_email});}});}}})(jQuery);