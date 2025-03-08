$(document).ready(function(){var tagname_stat=new Array();var re=$("#related_referer").val();
var u=window.location.href;var a=navigator.userAgent;var pt=$('meta[name="pt:data"]').attr("content");
if($('#open_comment1x1').length>0){setTimeout(function(){$('div.display-post-tag-wrapper > a').each(function(index){tagname_stat.push($(this).text());});
if(tagname_stat.length>0){var url_stream='/forum/datacst/streamclick_frukt';var data_post={'a':a,'d':'desktop','u':u,'t':tagname_stat,'re':re,'pt':pt,};
ajaxSent=true;$.ajax({url:url_stream,type:'post',data:data_post,success:function(rs){ajaxSent=false;}});}},400);}});