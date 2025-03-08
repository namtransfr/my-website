$(document).ready(function(){
	var url = window.location.pathname.split('/');
	//=== temp count comments ===
	var count_comment_all = 0;
	var count_comment = 0;
	var temp_comment = 0;
	var array_comment_remove = [];
	var array_comment_no = [];
	var box_comment_id = 0;	
	//=== temp count reply ===
	var count_reply = 0;
	var temp_reply = 0;
	var box_reply_id=0
	var array_reply_remove = [];
	var array_reply_no = [];
	// ==== temp data remove reply ==
	var count_remove_reply = 0; 
	var temp_comment_id = 0; 
	var temp_data = [];
	
	//===  :: group  delete  comment ===
	$.views.helpers({				
		 countComment: function(count) {  count_comment_all=count;},
		 sumComment : function(status,comment_no,_id,reply_count) {			
			box_comment_id = box_comment_id;
			 if(status==2 ){				
				count_comment = count_comment+1;
				array_comment_remove.push(_id);
				array_comment_no.push(comment_no);
			 }
			 if(status!=2 || (comment_no%100)==0 || comment_no== count_comment_all  ){				 
				temp_comment = count_comment;
				var  txt = "คห. ถูกลบ ";							   
				var temp = '<div class="hideid display-post-wrapper with-top-border section-comment" data-hideid="'+array_comment_remove[0]+'" >'
				+'<a href="javascript:void(0)" class="seemore-comment-remove" >'
				+'<div class="remove-comment-toggle-bordertop">'
				+'<div class="remove-comment-toggle">'
				+'<span class="data-comment-remove" style="display:none;">'+array_comment_remove+'</span>'
				+'<img src="https://ptcdn.info/images/noti/ic_arrowdown_topic.png" width="10" height="10">&nbsp;'+txt+'</div>'
				+'</div></a></div>';		   				   
				array_comment_remove = [];
				array_comment_no = [];
				count_comment = 0
				if(temp_comment!=0){
				   return temp;
				}				
			 } 	
		} 
	});//end group comment
	
	
	$(document).on('mouseenter','.related-topic-interest',function(){
			$(this).find('.kong-eiei').removeClass('post-pick-footer-off').addClass('post-pick-footer');
		}).on('mouseleave','.related-topic-interest',function(){
			$(this).find('.kong-eiei').removeClass('post-pick-footer').addClass('post-pick-footer-off');
	});
	
	$.oauthFacebook.authen();
	$.oauthFacebook.btnLogin();
	$.oauthFacebook.btnSetpwd();
	$.oauthGoogle.authen();
	$.oauthSetPwd.confirm();
	// pre load zone

	// Login for comment login_lightbox 
	$.loginLBComment.emailCaptcha(); // login ด้วย email อื่นๆ
	$.loginLBComment.loginLBcaptchaBtn(); // login ด้วย email อื่นๆ form captcha
	$.loginLBComment.captchaReload(); // captcha โหลดใหม่
	$.loginLBComment.captchaChange(); // captcha เปลี่ยนภาษา
	//$.loginLBComment.closeCommentReply(); // ปุ่มปิดกล่องความคิดเห็นตอบกลับ
	$.loginLBComment.openForgotPwdLB(); // เปิด lightbox ลืม password
	$.loginLBComment.checkInputForgotPwdLB(); // เช็คข้อมูลที่ขอเมื่อลืม password
	$.loginLBComment.checkLoginEmailUser(); // login เข้าระบบ
	$.loginLBComment.passcodeEmailBtn(); // เช็ค passcode ที่กรอก

	$.commentTopic.pageUp(); /* ไปบนสุด */
	$.commentTopic.pageDown();/* ไปล่างสุด */
	$.commentTopic.mouseScroll(); /* scroll(เลื่อน) แล้วตรวจจับว่ากำลังอ่านที่อยู่หน้าใด */
	$.commentTopic.hover(); /*hover*/
	$.commentTopic.previewComment();/* preview ความเห็น */
	$.commentTopic.editComment();/* แก้ไขความเห็น */
	$.commentTopic.sendComment(); /* ส่งความเห็น */
	$.commentTopic.getComment(); /* แสดงผลความเห็น */
	$.commentTopic.dropdownPrev(); /* bar dropdown ที่อยู่กับ paging ด้านบน */
	$.commentTopic.dropdownNext(); /* bar dropdown ที่อยู่กับ paging ด้านล่าง */
	$.commentTopic.customizeJson(); /* set ข้อมูลเบื้องต้น */
	$.commentTopic.pagePrev(); /* คลิก bar paging ด้านบน */
	$.commentTopic.pageNext(); /* คลิก bar paging ด้านล่าง */
	$.commentTopic.bestAnswer(); /* */
	$.commentTopic.dropdownJump(); /* navigate paging  ที่บ่งบอกว่ากำลังอ่านอยู่ที่หน้าใด และต้องการกระโดดไปหน้าไหน */
	//$.commentTopic.positionDropdownJump();/* คำนวณตำแหน่ง dropdown สำหรับบ่งบอกว่ากำลังอ่านอยู่ที่หน้าใด */
	$.commentTopic.replyComment();/* คลิกตอบกลับที่ความเห็น */
	$.commentTopic.replySubComment();/* คลิกตอบกลับที่ตอบกลับ*/
	$.commentTopic.replyRemove();/* ปิดกล่อง reply  */
	$.commentTopic.focusComment();/*  เมื่อกดที่กล่องความเห็นจะลบ element ตอบกลับออก เพื่อให้เหลือ กล่องความเห็นเพียงแค่ 1 กล่อง และ focus มัน */
	$.commentTopic.previewReply();/* preview ตอบกลับ*/
	$.commentTopic.editReply();/* แก้ไขตอบกลับ */
	$.commentTopic.sendReply();/* ส่งตอบกลับ*/
	$.commentTopic.replyPrev();/* load more reply ก่อนหน้า */
	$.commentTopic.replyNext();/* load more reply ถัดไป*/
	$.commentTopic.showReply();/* แสดง reply */		
	$.commentTopic.bookmarks();/* กระทู้โปรด */
	
	//=== call fucntion show comment , show reply ===
	$.commentTopic.showCommentremove();/* แสดง comment ที่โดนลบ */
	$.commentTopic.showReplyremove();/* แสดง reply ที่โดนลบ */
	
	// emotion
	$.emotion.listen(); /* ready listen for event */
	
	//Poll
	$.poll.vote();
	$.poll.editVote();
	$.poll.resultVote();
	/* topic vote */
	$.topic_vote.start();
	/* comment vote */
	$.comment_vote.start();

	/* report */
	$.reportTopic.reportSend();
	$.reportTopic.reportCancel();
	$.reportTopic.reportTypeRule();
	$.reportTopic.otherDetail();
	$.reportTopic.reportConfirm();

	/* topic/comment/reply Edit */
	$.editMethod.cancel();
	$.editMethod.comment();
	$.editMethod.reply();
	$.editMethod.topic();
	$.editMethod.sendEdit();
	$.editMethod.preview();
	$.editMethod.previewSendEdit();
	$.editMethod.previewBackToEdit();
	
	/* sms active trust user */
	$.sms.send();
	
	/* Pin it*/
	$.pinIt.mark();
	
	/* Follow Kratoo */
	$.follow.topic();
});


(function($){	

	// This section defines helper functions to use in this page
	/**
	 * Show comment error feedback on form submission.
	 * @constructor
	 * @param {HTMLElement} element - The container of comment or reply block.
	 * @param {string} htmlMessage - The HTML message to show as error feedback.
	 */
	 function showCommentErrorFeedback(element, htmlMessage) {
		let container = element.closest('.display-post-story-footer');
		let errorDiv = container.querySelector('.comment-form-feedback');
		if (errorDiv) {
			errorDiv.remove();
		}
		errorDiv = document.createElement('div');
		errorDiv.className = 'comment-form-feedback error-txt input-line';
		errorDiv.style.marginTop = '15px';
		errorDiv.innerHTML = htmlMessage;
		container.prepend(errorDiv);
	}

	$.sms = {};
	$.commentTopic = {};
	$.oauthFacebook = {};
	$.oauthError = {};
	$.emotion = {};
	$.poll = {};
	$.reportTopic = {};
	$.pinIt = {};
	$.follow = {};
	
	$.sms.send = function()
	{
		$(document).on('click','.otp-submit',function(){
			$.ajax({
				type: "POST",
				url : "/settings/profile/ajax_active_trust",
				dataType : 'json',
				data : {
					code: $('#opt_password').val()
				},
				timeout : 15000,
				error : function(jqXHR,exception){
					$.errorNotice.dialog('มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง',{
						title : 'แจ้งเตือน',
						btn_close:'ดำเนินการต่อ'
					});
				},
				success : function(rs){
					if(rs.success == true)
					{
						// remove lightbox otp
						$('#otp_dialog').dialog('destroy').remove();
						// call function save comment
						if($.sms.type == 'comment')
						{
							sendComment();
						}
						else
						{
							sendReply();
						}
						
					}
					if(rs.error == true)
					{
						$('#lightbox_save').remove();
						lightBoxError(rs.error_message);
						$.errorNotice.dialog(rs.error_message,{
							title : 'แจ้งเตือน'
						});
						return false;
					}	
				}
			});
		});
						
		$(document).on('click', '.small-txt-fixed.otp-cancel', function(){
			$('#otp_dialog').remove();
		});

	}
	
	$.oauthFacebook.defaults = {
		ajaxrequest : false
	};

	$.commentTopic.defaults = {
		
		preview : false,
		preview_r : false,
		ajaxrequest : false,
		tempElement :''
	};

	$.commentTopic.objectSet = function(partialObject)
	{
		$.extend($.commentTopic.defaults, partialObject);
	};
	
	$.commentTopic.bookmarks = function (){
		var options = $.commentTopic.defaults;
		$(document).on('click','.btn-bookmarks',function(){
			//var xhrRequest;
			var tid = $(this).data('refbms');
			//console.log($(this).hasClass('icon-fav'));
			if($(this).hasClass('icon-unfav') == true)
			{
				if(options.ajaxrequest == false)
				{
					options.ajaxrequest = true;
					$.ajax({
						type: "POST",
						url : "/forum/topic/bookmarks",
						dataType : 'json',
						data : {
							tid:tid,
							ac:'push'
						},
						success : function(rs){
							options.ajaxrequest = false;
							if(rs.status=='failure')
							{
								requireLogin(window.location.href);
								return false;
							}
							/* push bookmarks */
							if(rs.status == 'success')
							{
								$('.btn-bookmarks').removeClass('icon-unfav').addClass('icon-fav').attr('title','เอาออกจากกระทู้โปรด');
								return false;
							}
						}
					});
				}
				
			}
			else
			{	
				if(options.ajaxrequest == false)
				{
					options.ajaxrequest = true;
					$.ajax({
						type: "POST",
						url : "/forum/topic/bookmarks",
						dataType : 'json',
						data : {
							tid:tid,
							ac:'pop'
						},
						success : function(rs)
						{
							options.ajaxrequest = false;
							if(rs.status=='failure')
							{
								requireLogin(window.location.href);
								return false;
							}
							/* pop bookmarks */
							if(rs.status == 'success')
							{
								$('.btn-bookmarks').removeClass('icon-fav').addClass('icon-unfav').attr('title','เก็บเป็นกระทู้โปรด');
								return false;
							}	
						}
					});
				}
				
			}
			
			
		});
		
	}

	$.commentTopic.replyRemove = function()
	{
		$(document).on('click','.close-comment-box', function(){
			removeReply();
		});
	}
	
	$.commentTopic.sendReply = function ()
	{
		var options = $.commentTopic.defaults;
		$(document).on('click', '#btn_reply', function(e){

			if($.trim($('#comment_sub').val()) == '')
			{
				showCommentErrorFeedback(e.target, '** กรุณากรอกข้อความ');
				return false;
			}

			if(options.ajaxrequest == false)
			{
				options.ajaxrequest = true;
				$.ajax({
					url : "/forum/topic/abxz",
					dataType : 'json',
					error : function(jqXHR,exception,err){
						
						options.ajaxrequest = false;
						$.errorNotice.dialog(err,{
							title : 'แจ้งเตือน',
							btn_close:'ดำเนินการต่อ'
						});
						
					},
					success : function(rs){
						options.ajaxrequest = false;
						if(rs.has_session == 1)
						{
							sendReply();
						}
						else
						{
							showCommentErrorFeedback(e.target, '<u><b>เกิดข้อผิดพลาด</b></u> ระบบไม่สามารถจดจำข้อความที่คุณพิมพ์ไว้ได้ กรุณาคัดลอกข้อความเก็บไว้ แล้วล็อกอินเข้าสู่ระบบใหม่อีกครั้ง');
						}
					}
				});
			}
			

		});
	}
	
	$.commentTopic.editReply = function()
	{
		var options = $.commentTopic.defaults;

		$(document).on('click','#btn_edit_reply',function(){
			
			if(options.preview_r == true)
			{
				var data = $.data(document.body).reply;
				/* remove label preview ออก*/
				$('.comment-box-color.sub-comment.preview-now').removeClass('comment-preview preview-now').addClass('first');
				/* แสดงผล form */
				
				/* แสดง bar comment */
				$('.head-bar-reply').removeClass('first').show();
				$('.display-post-story.form.sub-comment').show();
				$('.display-post-story.preview.sub-comment').hide();

				/* gen ปุ่ม preview ใหม่ */
				$('.display-post-action.sub-comment').html('<div class="button-container sub-comment">'
					+'<a class="button normal-butt" href="javascript:void(0);" id="btn_reply_preview"><span><em>Preview</em></span></a>&nbsp;'
					+'<a class="button letdo-butt" href="javascript:void(0);" id="btn_reply"><span><em>ส่งข้อความ</em></span></a>&nbsp;'
					+'<span class="remark-txt small-txt"><a class="close-comment-box" href="javascript:void(0);">ปิดกล่อง</a></span>'
					+'<div class="display-post-avatar avatarleft pt-display-avatar"></div>'
					+'<span class="error-txt sub-comment"></span>'
					+'</div>');
				/* แทรก avatar ลง*/
				$('.button-container.sub-comment').find('.pt-display-avatar').append(options.tempElement);
				/* แสดงผล */
				$('#comment_sub').val(data.raw);
				$.commentTopic.objectSet({
					preview_r : false
				});
			}

		});
	}

	$.commentTopic.previewReply = function ()
	{
		var options = $.commentTopic.defaults;

		$(document).on('click','#btn_reply_preview',function(){

			var value = $('#comment_sub');

			if(options.preview_r == false)
			{
				$.commentTopic.objectSet({
					tempElement : $('.pt-display-avatar').html()
				});

				/* set data */
				var before = $(document.body).data('reply');
				var after = $.extend({},before,{
					'raw':value.val()
				});
				$(document.body).data('reply',after);
				
				/* loading */
				var tempUi = $('.button-container.sub-comment').html();
				
				$('#btn_reply_preview').replaceWith('');
				$('#btn_reply').replaceWith('<span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
		
				$.ajax({
					type: "POST",
					url : "/forum/topic/preview_comment",
					dataType : 'json',
					data : {
						msg: $.data(document.body).reply
					},
					timeout : 15000, //15sec
					error : function(jqXHR,exception){
						$('.button-container.sub-comment').html(tempUi);
					},
					success : function(rs){
						/* แสดงผล การ reply */
						renderReplyPreview(rs,options);
						/* set ว่า preview อยู่ */
						$.commentTopic.objectSet({
							preview_r : true
						});
					}
				});
			}
		});
	};

	$.commentTopic.replySubComment = function(){
		var options = $.commentTopic.defaults;
		$(document).on('click','.reply.sub-comment',function(){
			if(options.ajaxrequest == false)
			{
				
				var refSubComment = $(this).parents('.section-comment.sub-comment').parents('.ref').data('refcm');
				//			console.log(refSubComment);
				$('#'+refSubComment).find('.reply.main-comment').trigger('click');
				
			}
			
		});
	}

	$.commentTopic.replyPrev = function(){
		$(document).on('click','.load-reply-prev',function(){
			var id = $(this).data('lmr').split('-');
			var firstId = id[0];
			var refId = id[1];
			var refCount = id[2];
			var refBar = $(this).parents('.loadmore-bar-paging.sub-loadmore').get(0).id;
			var owner = $('.main-post-inner').find('.display-post-name.owner').get(0).id;
			
			var unix = (new Date().getTime())+firstId+refId+(Math.ceil(Math.random()*100));

			$('#'+refBar).after('<div data-refcm="comment-'+refId+'" class="comment-'+refId+' ref" id="reply-sub-st-'+unix+'"></div>').html('<a href="javascript:void(0)"><span class="icon-expand-left"><small>&and;</small></span><span class="focus-txt">กำลังโหลดข้อมูล...</span><span class="icon-expand-right"><small>&and;</small></span></a>');

			$.ajax({
				type: "GET",
				url : "/forum/topic/render_replys?first="+firstId+"&cid="+refId+"&c="+refCount+"&ac=p&o="+owner,
				dataType : 'json',
				success : function(rs){
					//console.log(rs);
					var count_before = $(".comment-" + refId+".ref").find('.display-post-wrapper-inner').length;
					var data_before = $(".comment-" + refId+".ref").find('.display-post-wrapper');
					var before = [];
					for (i = 0; i < count_before; i++) { 							
						temp_id = data_before[i]['id'];
						before.push(temp_id);
					}						
					
					$('#'+refBar).remove();
					$.templates("", {
						markup: "#topic-reply-renovate-tmpl",
						allowCode: true
					});
					$('#reply-sub-st-'+unix).append(
						$('#topic-reply-renovate-tmpl').render(rs.replies)
					).show();
													
					if(rs.check_pinit == 'false')
					{
						$('.display-post-pin').remove();
					}
					else if(rs.check_pinit != '')
					{
						$('.pin-it.'+rs.check_pinit).addClass('unpin-it');
						$('.pin-it.'+rs.check_pinit).find('.display-post-unpin.icon.icon-unpin').removeClass('display-post-unpin icon icon-unpin').addClass('display-post-pinit icon icon-pinit');
					}
					
					/* loadmore prev */
					if(rs.reply_st == true)
					{
						$('#reply-sub-st-'+unix).before($('#loadmore-reply-prev').render(rs.lprev));
					}
					/* time ago */
					$('abbr.timeago').timeago();
					
					// === check data reply remove ===
					var count_after = $(".comment-" + refId+".ref").find('.display-post-wrapper-inner').length;
					var data_after = $(".comment-" + refId+".ref").find('.display-post-wrapper');									
					group_remove_for_reply(count_after,data_after,before);	
				}
			});
		});
	};

	$.commentTopic.replyNext = function(){
		$(document).on('click','.load-reply-next',function(){
			var id = $(this).data('lmr').split('-');
			var lastId = id[0];
			var refId = id[1];
			var refCount = id[2];
			var refBar = $(this).parents('.loadmore-bar-paging.sub-loadmore').get(0).id;
			var owner = $('.main-post-inner').find('.display-post-name.owner').get(0).id;
			
			var unix = (new Date().getTime())+lastId+refId+(Math.ceil(Math.random()*100));

			$('#'+refBar).after('<div data-refcm="comment-'+refId+'" class="comment-'+refId+' ref" id="reply-sub-ed-'+unix+'"></div>').html('<a href="javascript:void(0)"><span class="icon-expand-left"><small>&or;</small></span><span class="focus-txt">กำลังโหลดข้อมูล...</span><span class="icon-expand-right"><small>&or;</small></span></a>');

			$.ajax({
				type: "GET",
				url : "/forum/topic/render_replys?last="+lastId+"&cid="+refId+"&c="+refCount+"&ac=n&o="+owner,
				dataType : 'json',
				success : function(rs){
					//console.log(rs.replies);
					//== get data reply id before==
					var count_before = $(".comment-" + refId+".ref").find('.display-post-wrapper-inner').length;
					var data_before = $(".comment-" + refId+".ref").find('.display-post-wrapper');
					var before = [];
					for (i = 0; i < count_before; i++) { 							
						temp_id = data_before[i]['id'];
						before.push(temp_id);
					}		
					
					$('#'+refBar).remove();
					$.templates("", {
						markup: "#topic-reply-renovate-tmpl",
						allowCode: true
					});
					$('#reply-sub-ed-'+unix).append(
						$('#topic-reply-renovate-tmpl').render(rs.replies)
						).show();
									
		
					if(rs.check_pinit == 'false')
					{
						$('.display-post-pin').remove();
					}
					else if(rs.check_pinit != '')
					{
						$('.pin-it.'+rs.check_pinit).addClass('unpin-it');
						$('.pin-it.'+rs.check_pinit).find('.display-post-unpin.icon.icon-unpin').removeClass('display-post-unpin icon icon-unpin').addClass('display-post-pinit icon icon-pinit');
					}
					
					/* loadmore next */
					if(rs.reply_ed == true)
					{
						var root = $('#reply-sub-ed-'+unix)
						root.after($('#loadmore-reply-next').render(rs.lnext));
						root.nextUntil(".form", ".loadmore-bar").show();
					}	
					/* time ago */
					$('abbr.timeago').timeago(); 
					
					// === check data reply remove ===
					var count_after = $(".comment-" + refId+".ref").find('.display-post-wrapper-inner').length;
					var data_after = $(".comment-" + refId+".ref").find('.display-post-wrapper');					
					group_remove_for_reply(count_after,data_after,before);
				}
			});
		});
	};
	
	//====  ::  show comment remove , show reply remove  ====
	$.commentTopic.showCommentremove = function(){ 			
		$(document).on('click','.seemore-comment-remove',function() {			
			//alert('data comment' );
			var taget = $(this).find('.data-comment-remove').html();
			var str = taget;
			var comments = str.split(",");
			comments.forEach(function(entry) {
				//alert(entry);
				$('#comment-'+entry).show();
				$('#reply-comment-'+entry).show();
			});
			$(this).parent().hide();	
		});
	}
	$.commentTopic.showReplyremove = function(){ 			
		$(document).on('click','.seemore-reply-remove',function() {			
			//alert('data reply' );
			var taget = $(this).find('.data-reply-remove').html();
			var str = taget;
			var reply = str.split(",");
			reply.forEach(function(entry) {
				//alert(entry);
				$('#'+entry).show();
			});
			$(this).parent().hide();	
		});
	}	
	$.commentTopic.showReply = function(){ 
		$(document).on('click','.reply.see-more',function() {
			var root = $(this).parent().prev();
			var taget = root.attr("id");
			$("." + taget+".form").hide();			
			var display = $("." + taget).css('display');

			$('#reply-'+taget).remove();
			if(display == 'block')
			{
				$("." + taget).hide();
				root.nextUntil(".form", ".loadmore-bar").hide();
			}
			else if(display == 'none')
			{
				$("." + taget+".ref").show();				
				root.nextUntil(".form", ".loadmore-bar").show();				
				// === check data reply remove ===
				var count_remove = $("." + taget+".ref").find('.display-post-wrapper-inner').length;
				var temp_data = $('.'+taget).find('.display-post-wrapper');				
				group_remove_data(count_remove,temp_data);							
			}
						
//			var str = taget; 
//			var comment_id = str.replace("comment-","");
//			var count_remove = $('.status-replyhide-'+comment_id).length;
//			$('.focus-txt-'+comment_id).html('ดู '+count_remove+'  ความเห็นย่อยที่โดนลบ');			
//			if(count_remove==1){
//				$('.status-replyhide-'+comment_id).show();
//			}			
		});
	}
	
	$.commentTopic.replyComment = function(){
		var options = $.commentTopic.defaults;
		$(document).on('click','.reply.main-comment',function(){
			//console.log(options.preview_r);
			if(options.ajaxrequest == false)
			{
				options.ajaxrequest = true;
				/* ลบกล่องตอบกลับทั้งหน้าจอ */
				removeReply();
				//console.log($(this).data('reply'));
				var comment_id = $(this).parents('.section-comment').get(0).id;
				var ref = $(this).data('reply');
				var ref_id = $(this).data('reply_id');
				var ref_comment = $(this).data('comment');
				var time = $(this).data('time');
			
				//console.log(ref);
				$(document.body).data('reply',
				{
					'ref':ref,
					'ref_id':ref_id,
					'ref_comment':ref_comment,
					'time': time
				});
				//			console.log($(document.body).data('reply'));
				var elReply = '.sub-comment.head-bar-reply';
				
				$.ajax({
					type: "GET",
					cache: false,
					url : "/forum/topic/get_reply?time="+ Math.random(),
					dataType : 'json',
					success : function(rs)
					{
						if (typeof rs.errors !== 'undefined') {
							let url = new URL(document.location.href);
							let topicId = url.pathname.split('/')[2];
							let returnUrl = '/topic/' + topicId + '/' + ref_comment;
							alert('กรุณา login เข้าสู่ระบบ');
							requireLogin(returnUrl);
							return;
						}
						var refzcomment = ref_comment.replace('comment','');
						/* แทรก element */
						$('.'+comment_id+'.form').append('<div class="display-post-wrapper pageno-title pageno-title-counter sub-comment head-bar-reply" id="comment-counter" data-refzcomment="P'+refzcomment+'"><span class="title"><i class="icon-header-badge3 comment"></i>แสดงความคิดเห็น</span><div class="pageno-title-line"></div></div><div class="display-post-wrapper comment-box-color sub-comment reply-comment first"><div class="display-post-wrapper-inner"><div class="display-post-status-leftside"><div class="comment-preview-label"> Preview </div><div class="display-post-story-wrapper comment-wrapper"><div class="display-post-story form sub-comment"><div id="bb_detail"><div class="input-wrap "><textarea class="bb-code pt-form-sub-comment" id="comment_sub"></textarea></div></div></div><div style="display:none;" class="display-post-story preview sub-comment"></div></div><div class="display-post-story-footer"><div class="display-post-avatar comment"></div><div class="display-post-action sub-comment"><div class="button-container sub-comment"><a id="btn_reply" href="javascript:void(0);" class="button letdo-butt"><span><em>ส่งข้อความ</em></span></a>&nbsp;&nbsp;<span class="remark-txt small-txt"><a href="javascript:void(0);" class="close-comment-box">ปิดกล่อง</a></span><div class="display-post-avatar avatarleft pt-display-avatar"></div><span class="error-txt sub-comment"></span></div></div></div></div></div></div>');
						if($('.'+comment_id+'.form').css('display') == 'none')
						{
							$('.'+comment_id+'.form').css('display', 'block');
						}
						/* scroll */
						var targetOffset = $(elReply).offset().top-50;
						$('html,body').animate({
							scrollTop: targetOffset
						}, 700);
						/* focus reply*/
						$('#comment_sub').focus();
						/* เมื่อ login */
						if(rs != '')
						{
							/* แสดง bar bbcode และ ปุ่ม preview */
							ui_authen();
							/* แสดงรูป avatar */
							display_avatar(rs);
						}

						options.ajaxrequest = false;
					},
					complete: function () {
						options.ajaxrequest = false;
					}
				});
			}
			
		});
	};

	$.commentTopic.focusComment = function()
	{
		// $(document).on('focus', '#detail', function(){
		// 	removeReply();
		// });
	};
	
	$.commentTopic.pageUp = function(){
		$(document).on('click','#page-up',function(){
			$('html,body').animate({
				scrollTop: 0
			}, 700);
		});
	};

	$.commentTopic.pageDown = function(){
		$(document).on('click','#page-down',function(){
			$('html,body').animate({
				scrollTop: $(document).height()
			}, 700);
		});
	};
	
	$.commentTopic.positionDropdownJump = function(){
		stickyTop = $('.sticky-navi-comment:visible').offset().top;
		topicTitleMargin = 1;
		
		/* cal resize *///bottom:100px;
		$(window).resize(function() {
			
			var calWidth = $(window).width() ;
			var v = $('.sticky-navi-comment:visible').width();
			var right = ((calWidth/2)-(v/2))-45;
			
			$('#jump_paging').css({
				"right": right+'px',
				"top": stickyTop + topicTitleMargin
			});
	
		});
		/* cal position */
		var calWidth = $(window).width() ;
		var v = $('.sticky-navi-comment').width();
		var right = ((calWidth/2)-(v/2))-45;
		
		$('#jump_paging').animate({
			"right": right+'px',
			"top": stickyTop + topicTitleMargin
		});
	}

	$.commentTopic.hover = function (){
		$(document).on('mouseenter','.display-post-wrapper',function(){
			$(this).addClass('hover');
		}).on('mouseleave','.display-post-wrapper',function(){
			$(this).removeClass('hover');
		});
	};

	$.commentTopic.mouseScroll = function (){
		var timeout = null;
		var hasArr = null;
		$(window).on('scroll', function(event,direction){
			
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				var max ;
				var p = $(document.body).data('expand');
				var sortArr = p.page.sort(function s(a,b){
					return (a-b);
				});
				
				$.each(sortArr,function(index,value){

					if($('#pageno-title-'+value).length >0){
						
						var cal_page = Math.round($('#pageno-title-'+value).offset().top);
						var w_scroll = ($(window).scrollTop()+450);
						//console.log(w_scroll+'>'+cal_page+'-->'+value);
						if (w_scroll>cal_page)
						{
							max =  value;
						}
					}
				});
				
				if(max != '')
				{
					$('.dropdown-jump').val(max);
				}
				if(max == undefined && $('#page-1').length != 1){
					$('.dropdown-jump').val(1);
				}
			}, 100);
	
		});
	};

	
	$.commentTopic.bestAnswer = function ()
	{
		var pathArray = window.location.pathname.split( '/' );
		/* topic id */
		var topicId = pathArray[2];
		/* คำตอบที่ใช่ */
		$('.btn_yes').confirm_lightbox({
			ok_btn_txt : 'เลือกคำตอบนี้',
			cancel_btn_txt : 'ยกเลิก',
			confirm_title : 'แจ้งเตือน',
			confirm_desc : 'ยืนยันการเลือกคำตอบนี้ ?',
			ok_btn_class : 'letdo-butt',
			success_callback : function(ele)
			{
				var e = ele.attr('id').split('-');
				var comment_id = e[1];

				$.ajax({
					type : 'POST',
					url : '/forum/topic/best_answer',
					dataType : 'json',
					data : {
						tid : topicId,
						cid: comment_id
					},
					timeout : 15000,
					error : function(jqXHR,exception,err){

						$.errorNotice.dialog(err,{
							title : 'แจ้งเตือน',
							btn_close:'ดำเนินการต่อ'
						});
					},
					success : function(rs){
						
						validation_error(rs);
						
						if(rs.status == 'success')
						{
							window.location.reload();
						}
						
					}
				});
			}
		});
	}

	
	$.commentTopic.customizeJson = function ()
	{
		/* set expand data basic */
		$(document.body).data('expand',
		{
			'page':[]
		});
		
		
	}
	

	
	$.commentTopic.pagePrev = function ()
	{
		$(document).on('click','.bar-paging-st',function(){
			var pathArray = window.location.pathname.split( '/' );

			var topicType = $('#topic-type').val();
			/* topic id */
			var topicId = pathArray[2];

			var pageSplit = $(this).attr('id').split( '-' );
			/* page */
			var page = pageSplit[1];
			var parentBar = $(this).parents('.l-start').attr('id');
			var splitParent = parentBar.split( '-' )
			var parentId = splitParent[2];
		
			var expand = $(document.body).data('expand');
			
			var unix = (new Date().getTime())+page+(Math.ceil(Math.random()*100));
			$('#'+parentBar).after('<div id="comments-sub-st-'+unix+'"></div>').html('<div class="loadmore-bar loadmore-bar-paging"><a href="javascript:void(0)"><span class="icon-expand-left"><small>&#9660;</small></span><span class="focus-txt"><span class="loading-txt">กำลังโหลดข้อมูล...</span></span><span class="icon-expand-right"><small>&#9660;</small></span></a></div>');


			$.ajax({
				type: "GET",
				cache: false,
				url : "/forum/topic/render_comments?tid="+topicId+"&param=page"+page+"&type="+topicType+"&page="+page+"&parent="+parentId+"&expand="+expand.page+"&time="+Math.random(),
				dataType : 'json',
				success : function(rs)
				{					
					$('#'+parentBar).remove();
					/* Render comments */
					$('#comments-sub-st-'+unix).append(
						$('#topic-renovate-tmpl').render(rs.comments)
						);
					//					console.log(rs.paging);
					/* paging บน */
					if(rs.paging.st != '')
					{
						$('#comments-sub-st-'+unix).before('<div class="l-start" id="comments-st-'+rs.paging.st.min+'"></div>');
						groupingPaging('st',rs.paging);
					}
					/* paging ล่าง */
					if(rs.paging.ed != '')
					{
						$('#comments-sub-st-'+unix).after('<div class="l-end" id="comments-ed-'+rs.paging.ed.min+'"></div>');
						groupingPaging('ed',rs.paging);
					}
					
					if(rs.check_pinit == 'false')
					{
						$('.display-post-pin').remove();
					}
					else if(rs.check_pinit != '')
					{
						$('.pin-it.'+rs.check_pinit).addClass('unpin-it');
						$('.pin-it.'+rs.check_pinit).find('.display-post-unpin.icon.icon-unpin').removeClass('display-post-unpin icon icon-unpin').addClass('display-post-pinit icon icon-pinit');
					}

					/* Title page
					 * page 1 เท่านั้นที่ไม่ต้องมี title page แทรก 
					 * */
					//					console.log(rs.paging.st.total+' : '+rs.paging.page);
					if(rs.paging.page > 1)
					{
						$('#comments-sub-st-'+unix).before('<div id="pageno-title-'+page+'" class="display-post-wrapper pageno-title"><span class="title"><i class="icon-header-badge3 chatpage"></i>หน้า '+page+'</span><div class="pageno-title-line"></div></div>');
					}

					/* add Class เพื่อให้ กล่อง commentแรก ชิดบนเสมอ */
					$('#comments-sub-st-'+unix).find('.section-comment:first').addClass('first');

					/* set json */
					setJsonExpand(rs.paging);
				}
			});
		});
	};
	
	$.commentTopic.dropdownPrev = function ()
	{
		$(document).on('change','.dropdox-st',function(){
			var pathArray = window.location.pathname.split( '/' );

			var topicType = $('#topic-type').val();
			/* topic id */
			var topicId = pathArray[2];
			/* page */
			var page = $(this).val();
			/* parent */
			var parentBar = $(this).parents('.l-start').attr('id');
			var splitParent = parentBar.split( '-' )
			var parentId = splitParent[2];
			//alert(parentBar);
			var expand = $(document.body).data('expand');
			var unix = (new Date().getTime())+page+(Math.ceil(Math.random()*100));
			$('#'+parentBar).after('<div id="comments-sub-st-'+unix+'"></div>').html('<div class="loadmore-bar loadmore-bar-paging"><a href="javascript:void(0)"><span class="icon-expand-left"><small>&#9660;</small></span><span class="focus-txt"><span class="loading-txt">กำลังโหลดข้อมูล...</span></span><span class="icon-expand-right"><small>&#9660;</small></span></a></div>');

			$.ajax({
				type: "GET",
				cache: false,
				url : "/forum/topic/render_comments?tid="+topicId+"&param=page"+page+"&type="+topicType+"&page="+page+"&parent="+parentId+"&expand="+expand.page+"&time="+Math.random(),
				dataType : 'json',
				success : function(rs)
				{
					$('#'+parentBar).remove();
					/* Render comments */
					$('#comments-sub-st-'+unix).append(
						$('#topic-renovate-tmpl').render(rs.comments)
						);
					/* paging บน */
					if(rs.paging.st != '')
					{
						$('#comments-sub-st-'+unix).before('<div class="l-start" id="comments-st-'+rs.paging.st.min+'"></div>');
						groupingPaging('st',rs.paging);
					}
					/* paging ล่าง */
					if(rs.paging.ed != '')
					{
						$('#comments-sub-st-'+unix).after('<div class="l-end" id="comments-ed-'+rs.paging.ed.min+'"></div>');
						groupingPaging('ed',rs.paging);
					}
					
					if(rs.check_pinit == 'false')
					{
						$('.display-post-pin').remove();
					}
					else if(rs.check_pinit != '')
					{
						$('.pin-it.'+rs.check_pinit).addClass('unpin-it');
						$('.pin-it.'+rs.check_pinit).find('.display-post-unpin.icon.icon-unpin').removeClass('display-post-unpin icon icon-unpin').addClass('display-post-pinit icon icon-pinit');
					}
					/* Title page */
					$('#comments-sub-st-'+unix).before('<div id="pageno-title-'+page+'" class="display-post-wrapper pageno-title"><span class="title"><i class="icon-header-badge3 chatpage"></i>หน้า '+page+'</span><div class="pageno-title-line"></div></div>');

					/* add Class เพื่อให้ กล่อง commentแรก ชิดบนเสมอ */
					$('#comments-sub-st-'+unix).find('.section-comment:first').addClass('first');

					/* set json */
					setJsonExpand(rs.paging);
				}
			});
			
		});
	};
	
	$.commentTopic.pageNext = function ()
	{//
		$(document).on('click','.bar-paging-ed',function(){
			var pathArray = window.location.pathname.split( '/' );

			var topicType = $('#topic-type').val();
			/* topic id */
			var topicId = pathArray[2];

			var pageSplit = $(this).attr('id').split( '-' );
			/* page */
			var page = pageSplit[1];
			var parentBar = $(this).parents('.l-end').attr('id');
			var splitParent = parentBar.split( '-' )
			var parentId = splitParent[2];
			//			alert(parentBar);
			var expand = $(document.body).data('expand');
			var unix = (new Date().getTime())+page+(Math.ceil(Math.random()*100));
			$('#'+parentBar).after('<div id="comments-sub-ed-'+unix+'"></div>').html('<div class="loadmore-bar loadmore-bar-paging"><a href="javascript:void(0)"><span class="icon-expand-left"><small>&#9660;</small></span><span class="focus-txt"><span class="loading-txt">กำลังโหลดข้อมูล...</span></span><span class="icon-expand-right"><small>&#9660;</small></span></a></div>');
			
			$.ajax({
				type: "GET",
				cache: false,
				url : "/forum/topic/render_comments?tid="+topicId+"&param=page"+page+"&type="+topicType+"&page="+page+"&parent="+parentId+"&expand="+expand.page+"&time="+Math.random(),
				dataType : 'json',
				success : function(rs)
				{
					$('#'+parentBar).remove();
					/* Render comments tt*/
					$('#comments-sub-ed-'+unix).append(
						$('#topic-renovate-tmpl').render(rs.comments)
						);

					/* paging บน */
					if(rs.paging.st != '')
					{
						$('#comments-sub-ed-'+unix).before('<div class="l-start" id="comments-st-'+rs.paging.st.min+'"></div>');
						groupingPaging('st',rs.paging);
					}

					/* paging ล่าง */
					if(rs.paging.ed != '')
					{
						$('#comments-sub-ed-'+unix).after('<div class="l-end" id="comments-ed-'+rs.paging.ed.min+'"></div>');
						groupingPaging('ed',rs.paging);
					}
					
					if(rs.check_pinit == 'false')
					{
						$('.display-post-pin').remove();
					}
					else if(rs.check_pinit != '')
					{
						$('.pin-it.'+rs.check_pinit).addClass('unpin-it');
						$('.pin-it.'+rs.check_pinit).find('.display-post-unpin.icon.icon-unpin').removeClass('display-post-unpin icon icon-unpin').addClass('display-post-pinit icon icon-pinit');
					}

					/* Title page */
					$('#comments-sub-ed-'+unix).before('<div id="pageno-title-'+page+'" class="display-post-wrapper pageno-title"><span class="title"><i class="icon-header-badge3 chatpage"></i>หน้า '+page+'</span><div class="pageno-title-line"></div></div>');

					/* add Class เพื่อให้ กล่อง commentแรก ชิดบนเสมอ */
					$('#comments-sub-ed-'+unix).find('.section-comment:first').addClass('first');

					/* set json */
					setJsonExpand(rs.paging);
				}
			});
			
		});
	};
	
	$.commentTopic.dropdownNext = function (){
		$(document).on('change','.dropdox-ed',function(){
			var pathArray = window.location.pathname.split( '/' );

			var topicType = $('#topic-type').val();
			/* topic id */
			var topicId = pathArray[2];
			/* page */
			var page = $(this).val();
			/* parent */
			var parentBar = $(this).parents('.l-end').attr('id');
			var splitParent = parentBar.split( '-' )
			var parentId = splitParent[2];
			//alert(parentBar);
			var expand = $(document.body).data('expand');	
			var unix = (new Date().getTime())+page+(Math.ceil(Math.random()*100));
			$('#'+parentBar).after('<div id="comments-sub-ed-'+unix+'"></div>').html('<div class="loadmore-bar loadmore-bar-paging"><a href="javascript:void(0)"><span class="icon-expand-left"><small>&#9660;</small></span><span class="focus-txt"><span class="loading-txt">กำลังโหลดข้อมูล...</span></span><span class="icon-expand-right"><small>&#9660;</small></span></a></div>');


			$.ajax({
				type: "GET",
				cache: false,
				url : "/forum/topic/render_comments?tid="+topicId+"&param=page"+page+"&type="+topicType+"&page="+page+"&parent="+parentId+"&expand="+expand.page+"&time="+Math.random(),
				dataType : 'json',
				success : function(rs)
				{
					$('#'+parentBar).remove();
					/* Render comments */
					$('#comments-sub-ed-'+unix).append(
						$('#topic-renovate-tmpl').render(rs.comments)
						);

					/* paging บน */
					if(rs.paging.st != '')
					{
						$('#comments-sub-ed-'+unix).before('<div class="l-start" id="comments-st-'+rs.paging.st.min+'"></div>');
						groupingPaging('st',rs.paging);
					}

					/* paging ล่าง */
					if(rs.paging.ed != '')
					{
						$('#comments-sub-ed-'+unix).after('<div class="l-end" id="comments-ed-'+rs.paging.ed.min+'"></div>');
						groupingPaging('ed',rs.paging);
					}
					
					if(rs.check_pinit == 'false')
					{
						$('.display-post-pin').remove();
					}
					else if(rs.check_pinit != '')
					{
						$('.pin-it.'+rs.check_pinit).addClass('unpin-it');
						$('.pin-it.'+rs.check_pinit).find('.display-post-unpin.icon.icon-unpin').removeClass('display-post-unpin icon icon-unpin').addClass('display-post-pinit icon icon-pinit');
					}

					/* Title page */
					$('#comments-sub-ed-'+unix).before('<div id="pageno-title-'+page+'" class="display-post-wrapper pageno-title"><span class="title"><i class="icon-header-badge3 chatpage"></i>หน้า '+page+'</span><div class="pageno-title-line"></div></div>');

					/* add Class เพื่อให้ กล่อง commentแรก ชิดบนเสมอ */
					$('#comments-sub-ed-'+unix).find('.section-comment:first').addClass('first');

					/* set json */
					setJsonExpand(rs.paging);
				}
			});
		})

	}

	
	$.commentTopic.dropdownJump = function (){
		var options = $.commentTopic.defaults;

		$(document).on('change','.dropdown-jump',function(){

			var expand = $(document.body).data('expand');	
			var pathArray = window.location.pathname.split( '/' );
			var parentBar,splitParent,parentId;
			var topicType = $('#topic-type').val();
			/* topic id */
			var topicId = pathArray[2];
			/* page */
			var page = $(this).val();
			//console.log(page);
			if(page >=1){
				
				var unix = (new Date().getTime())+page+(Math.ceil(Math.random()*100));
				var sortArr = expand.page.sort(function s(a,b){
					return (a-b);
				});
				//			console.log(sortArr);
				/* มีอยู่แล้ว จะวิ่งไป */
				if($('#pageno-title-'+page).length >= 1 && page != 1)
				{
					var targetOffset = $('#pageno-title-'+page).offset().top-40;
					//$('html,body').scrollTop(targetOffset);
					$('html,body').animate({
						scrollTop: targetOffset
					}, 700);
				}
				else if(page == 1 && $('#pageno-title-'+page).length <=0)
				{

					var targetOffset = $('#comment-counter').offset().top-40;
					//$('html,body').scrollTop(targetOffset);
					$('html,body').animate({
						scrollTop: targetOffset
					}, 700);

					$('#page-1').trigger('click');
				}
				else
				{
					var insert = chk_expend(sortArr,page);
					if(insert == undefined)
					{
						//alert($('.l-end:last').attr('id'));
						parentBar =$('.l-end:last').attr('id');


					}
					else
					{
						//alert($('#pageno-title-'+insert).prev().attr('id'));
						parentBar = $('#pageno-title-'+insert).prev().attr('id');


					}



					if(parentBar != undefined && options.ajaxrequest == false)
					{
						options.ajaxrequest = true;
						splitParent = parentBar.split( '-' );
						parentId = splitParent[2];

						//$('#'+parentBar).after('<div id="comments-sub-'+splitParent[1]+'-'+unix+'"></div>').html('<div class="loadmore-bar loadmore-bar-paging"><a href="javascript:void(0)"><span class="icon-expand-left"><small>&#9660;</small></span><span class="focus-txt"><span class="loading-txt">กำลังโหลดข้อมูล...</span></span><span class="icon-expand-right"><small>&#9660;</small></span></a></div>');


						$('#'+parentBar).after('<div id="comments-sub-'+splitParent[1]+'-'+unix+'"></div>')
						.before('<div id="pageno-title-'+page+'" class="display-post-wrapper pageno-title"><span class="title"><i class="icon-header-badge3 chatpage"></i>หน้า '+page+'</span><div class="pageno-title-line"></div></div>')
						.html('<div class="loadmore-bar loadmore-bar-paging"><a href="javascript:void(0)"><span class="icon-expand-left"><small>&#9660;</small></span><span class="focus-txt"><span class="loading-txt">กำลังโหลดข้อมูล...</span></span><span class="icon-expand-right"><small>&#9660;</small></span></a></div>');
						
						var targetOffset = $('#pageno-title-'+page).offset().top-40;
						$('html,body').animate({
							scrollTop: targetOffset
						}, 200);
						
						$.ajax({
							type: "GET",
							cache: false,
							url : "/forum/topic/render_comments?tid="+topicId+"&param=page"+page+"&type="+topicType+"&page="+page+"&parent="+parentId+"&expand="+expand.page+"&time="+Math.random(),
							dataType : 'json',
							success : function(rs)
							{
								$('#'+parentBar).remove();
								/* Render comments */
								$('#comments-sub-'+splitParent[1]+'-'+unix).append(
									$('#topic-renovate-tmpl').render(rs.comments)
									);

								/* paging บน */
								if(rs.paging.st != '')
								{
									//$('#comments-sub-'+splitParent[1]+'-'+unix).before('<div class="l-start" id="comments-st-'+rs.paging.st.min+'"></div>');
									$('#pageno-title-'+page).before('<div class="l-start" id="comments-st-'+rs.paging.st.min+'"></div>');
									groupingPaging('st',rs.paging);
								}

								/* paging ล่าง */
								if(rs.paging.ed != '')
								{
									$('#comments-sub-'+splitParent[1]+'-'+unix).after('<div class="l-end" id="comments-ed-'+rs.paging.ed.min+'"></div>');
									groupingPaging('ed',rs.paging);
								}
								
								if(rs.check_pinit == 'false')
								{
									$('.display-post-pin').remove();
								}
								else if(rs.check_pinit != '')
								{
									$('.pin-it.'+rs.check_pinit).addClass('unpin-it');
									$('.pin-it.'+rs.check_pinit).find('.display-post-unpin.icon.icon-unpin').removeClass('display-post-unpin icon icon-unpin').addClass('display-post-pinit icon icon-pinit');
								}
								
								

								/* Title page */
								//$('#comments-sub-'+splitParent[1]+'-'+unix).before('<div id="pageno-title-'+page+'" class="display-post-wrapper pageno-title"><span class="title"><i class="icon-header-badge3 chatpage"></i>หน้า '+page+'</span><div class="pageno-title-line"></div></div>');

								/* add Class เพื่อให้ กล่อง commentแรก ชิดบนเสมอ */
								$('#comments-sub-'+splitParent[1]+'-'+unix).find('.section-comment:first').addClass('first');

								/* set json */
								setJsonExpand(rs.paging);
								options.ajaxrequest = false;
							}
						});
					}
				}
			}
				
		});
	}
	
	
	function chk_expend(sortArr,page){
		var max ;
		$.each(sortArr, function(key,value){
			if (page < value)
			{

				max =  value;
				return false;

			}
		});
		if(max != '')
		{
			return max;
		}
	}
	
	function groupingPaging(type,$obj)
	{
		
		var temp = new Array();
		
		
		
		if(type == 'st' && $obj.st != '')
		{
			var min =$obj.st.min;
			var max =$obj.st.max;
			var total = $obj.st.total;
		//console.log($obj.st);
		}
		
		if(type == 'ed' && $obj.ed != '')
		{
			var min =$obj.ed.min;
			var max =$obj.ed.max;
			var total = $obj.ed.total;
		//console.log($obj.ed);
			
		}
		
		for(var i = min ; i<=max ; i++)
		{
			/* หาช่วง เพื่อทำ dropdown */
			if(i > min && i < max && total >3)
			{
				var txt_max = i*$obj.limit;
				var txt_min = txt_max-($obj.limit-1);
				var comboBox = {
					'page':i,
					'o_txt' : txt_min+'-'+txt_max
				};
				temp.push(comboBox);

				
				
			}
			else
			{
				var txt_max = i*$obj.limit;
				var txt_min = txt_max-($obj.limit-1);
				
				$('#comments-'+type+'-'+min).append($('#loadmore-paging-number').render({
					'page':i,
					'type' : type,
					'txt_max' : txt_max,
					'txt_min' : txt_min
				}));
			}

			if(min == 1 && total>= 1)
			{/* bar paging ตัวแรก */
				$('#comments-'+type+'-'+min).find('.loadmore-bar.loadmore-bar-paging:first').addClass('firsttop');
			}
			if(i != max && i != min)
			{/*  bar paging ตัวกลาง */
				$('#comments-'+type+'-'+min).find('.loadmore-bar.loadmore-bar-paging').not(':first').addClass('middle');
			}
			
			if(i == max && total> 1)
			{/* bar paging ตัวสุดท้าย */
				$('#comments-'+type+'-'+min).find('.loadmore-bar.loadmore-bar-paging:last').addClass('bottom');
			}
		}
		/* ถ้ามี paging มากกว่า 3*/
		if(total > 3)
		{
			var rs = $.extend({},{
				'option' : temp,
				'type' : type
				
				
			});
			
			$('#comments-'+type+'-'+min).find('.loadmore-bar-paging.page-'+max+'.bottom').before($('#loadmore-paging-combobox').render(rs));
		}
	}

	
	function setJsonJump($obj)
	{
		$(document.body).data('jump',{
			max :$obj.ed.max
		});
		var jumpMax = $.data(document.body).jump.max;
		//console.log(jumpMax);
		for(var i=1;i<=jumpMax;i++)
		{
			$('.dropdown-jump').append('<option value="'+i+'">'+i+'</option>');
		}
		
		if(jumpMax > 0)
		{
			$('.float-nav-gotopage').show();
			$('.dropdown-jump').val($obj.page);
			$('#last-pageing').text(jumpMax);

		}
		
	}

	
	function setJsonExpand($obj)
	{
		var data = $(document.body).data('expand');
		var expand_json= {};
		var arr = $.makeArray($obj.page);
		
		if(data.page.length == 0)
		{// ไมมี array อยู่เลย
			expand_json['page'] = arr;	
		}
		else
		{// มี array อยู่เลย
			var mergeArr = $.merge(data.page, arr);
			expand_json['page'] =  mergeArr;
		}
		
		var before = $(document.body).data('expand');
		//console.log(before);
		var after = $.extend({},before,expand_json);
		//console.log(after);
		$(document.body).data('expand',after);
		//console.log($(document.body).data('expand'));

		$('abbr.timeago').timeago();
		$('.dropdown-jump').val($obj.page).blur();

		
	}
	
	$.commentTopic.getComment = function (){
		var pathArray = window.location.pathname.split( '/' );
		/* จำเป็นต้อง if เพราะกันคนใส่มามั่ว ๆ จะได้ตรวจสอบง่ายๆ */
		var param = (pathArray[3] != undefined) ? pathArray[3] : '';
		/* ไม่ต้อง if เพราะถ้าใส่ id ผิด ก็แสดงหน้า 404 */
		var id = pathArray[2];
		var type = $('#topic-type').val();
		var hideReply;

		$.ajax({
			type: "GET",
			cache: false,
			url : "/forum/topic/render_comments?tid="+id+"&param="+param+"&type="+type+"&time="+Math.random(),
			dataType : 'json',
			success : function(rs)
			{
				// check param then extract that 
				//console.log(id, param);
				//console.log(rs);		
				if(rs == undefined)
				{
					return false;
				}
				/* Render comments total */
				if(rs.count > 0)
				{
					$('#comments-counts').html($('#count-comment-tmpl').render(rs));
				}				
				$.templates("topic-renovate-tmpl", {
						markup: "#topic-renovate-tmpl",
						allowCode: true
					});
				/* Render comments */
				$('#comments-jsrender').html(
					$('#topic-renovate-tmpl').render(rs.comments)
				);			
			
				$.each($('.hideid'), function (index, item) {
					var pid = String($(item).data('hideid'));
					//var c = pid.split(',');
					$(this).insertBefore('#comment-'+pid);
				});
				
				/* paging บน */	
				if(rs.paging.st != ''){
					$('#comments-jsrender').before('<div class="l-start" id="comments-st-'+rs.paging.st.min+'"></div>');
					/* Title page */
					$('#comments-jsrender').before('<div id="pageno-title-'+rs.paging.page+'" class="display-post-wrapper pageno-title"><span class="title" id="page'+rs.paging.page+'"><i class="icon-header-badge3 chatpage"></i>หน้า '+rs.paging.page+'</span><div class="pageno-title-line"></div></div>');
				}
				/* paging ล่าง */
				if(rs.paging.ed != ''){
					$('#comments-jsrender').after('<div class="l-end" id="comments-ed-'+rs.paging.ed.min+'"></div>');
				}		
				
				groupingPaging('st',rs.paging);
				groupingPaging('ed',rs.paging);

				/* เพื่อให้ ติดกับ comment count */
				$('.section-comment:first').addClass('first');
				
				/* set json */
				setJsonExpand(rs.paging);
				
				/* set json jump */
				setJsonJump(rs.paging);
				
				//console.log($('#'+param).parents('.ref').attr('class').replace("ref",""));
				//console.log($('#'+param).parents('.ref').attr('class'));
				
				$('#'+param).parents('.ref').prev('.loadmore-bar.firsttop').show();
				$('#'+param).parents('.ref').next('.loadmore-bar.bottom').show();
				$('#'+param).parents('.ref').show();
				
				if($('#'+param).parents('.ref').attr('class') != undefined){		
					hideReply = $('#'+param).parents('.ref').attr('class').replace("ref","");
					//alert(hideReply);					
					$('#reply-'+hideReply).remove();
				}
				
				function setWindowLoadHandler(callback) {
					if (document.readyState === 'complete') {
						callback();
					} else {
						window.addEventListener('load', callback);
					}
				}

				/* scrollauto */
				setWindowLoadHandler(function () {
					scrollTopic(pathArray);
				});
				//========= start  : group remove reply ===========
				if(hideReply!=undefined){
					var count_remove  = $("." +hideReply).find('.display-post-wrapper-inner').length;
					var temp_data = $('.'+hideReply).find('.display-post-wrapper');
					group_remove_data(count_remove,temp_data);
				}//**end : group remove reply
				
				//console.log(rs.check_pinit);
				if(rs.check_pinit == 'false')
				{
					$('.display-post-pin').remove();
				}
				else if(rs.check_pinit != '')
				{
					$('.pin-it.'+rs.check_pinit).addClass('unpin-it');
					$('.pin-it.'+rs.check_pinit).find('.display-post-unpin.icon.icon-unpin').removeClass('display-post-unpin icon icon-unpin').addClass('display-post-pinit icon icon-pinit');
				}		
			}
		});
		
		
	//		
	}

	/*
	 * Create By 
	 * last update ???????
	 * เลื่อนๆ สวยงาม (มั้ง)
	 **/
	function scrollTopic(p)
	{
		
		var delay_loading = (function()
		{
			var timer = 0;
			return function(callback, ms)
			{
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
		})();
		
		//console.log(p);
		
		if(p.length >= 4)
		{
			var newurl;
			var str = p[3];
			var type = str.match(/^(comment|page)/i);
			if(type == null)
			{
				return false;
			}
			if(type[0] == 'page')
			{
				newurl  = str.match(/^((page)([0-9]+))/i);

			}else if(type[0] == 'comment'){

				newurl  = str.match(/^((comment)([0-9\-]+))/i);
			}
		}

		/* delay 0.5 วิ */
		delay_loading(function(){
			
			if(p.length >= 4 && newurl != null && $('#'+newurl[0]).length == 1)
			{

				var param = newurl[0];
				var targetOffset = $('#'+param).offset().top-40;
				$('html,body').animate({
					scrollTop: targetOffset
				}, 700);
			}
		}, 500 );
	
	}
	
	
	$.commentTopic.editComment = function ()
	{
		var options = $.commentTopic.defaults;
		$(document).on('click','#btn_edit_comment',function(){
			/* ลบกล่องตอบกลับทั้งหน้าจอ */
			removeReply();
			var expert = checkExpert("editComment");			
			if(options.preview == true)
			{
				var data = $.data(document.body).comment;
				/* remove label preview ออก*/
				$('.comment-box-color.comment-bar').removeClass('comment-preview preview-now').addClass('first');
				if($('.comment-box-ad-area').length > 0)
				{
					$('.comment-box-color.comment-bar').addClass('comment-box-w-ad');
				}
				/* แสดงผล form */
				$('.comment-box-ad').show();
				/* แสดง โฆษณา */
				$('.comment-box-ad-area').show();
				/* แสดง bar comment */
				$('.head-bar-comment').show();
				$('.display-post-story.form.main-comment').show();
				$('.display-post-story.preview.main-comment').hide();

				/* gen ปุ่ม preview ใหม่ */
				$('.display-post-action.main-comment').html('<div class="button-container main-comment">'
					+'<a class="button normal-butt" href="javascript:void(0);" id="btn_comment_preview"><span><em>Preview</em></span></a>&nbsp;'
					+'<a class="button letdo-butt" href="javascript:void(0);" id="btn_comment"><span><em>ส่งข้อความ</em></span></a>&nbsp;'
					+ expert
					+'<div class="display-post-avatar avatarleft pt-display-avatar"></div>'
					+'<span class="error-txt main-comment"></span>'
					+'</div>');
				/* แทรก avatar ลง*/
				$('.button-container.main-comment').find('.pt-display-avatar').append(options.tempElement);
				/* แสดงผล */
				$('#detail').val(data.raw);
				$.commentTopic.objectSet({
					preview : false
				});
			}

		});
	
	};
	
	

	function renderReplyPreview(rs,options)
	{
		/* ซ่อน bar comment */
		$('.head-bar-reply').hide();
		/* เพิ่ม ให้แสดง label preview */
		$('.comment-box-color.sub-comment').addClass('comment-preview preview-now').removeClass('first');
		$('.display-post-story.form.sub-comment').hide();

		/* gen ปุ่ม edit ใหม่ */
		$('.display-post-action.sub-comment').html('<div class="button-container sub-comment">'
			+'<a class="button normal-butt" href="javascript:void(0);" id="btn_edit_reply"><span><em>แก้ไขข้อความ</em></span></a>&nbsp;'
			+'<a class="button letdo-butt" href="javascript:void(0);" id="btn_reply"><span><em>ส่งข้อความ</em></span></a>&nbsp;'
			+'<div class="display-post-avatar avatarleft pt-display-avatar"></div>'
			+'<span class="error-txt sub-comment"></span>'
			+'</div>');
		/* แทรก avatar ลง*/
		$('.button-container.sub-comment').find('.pt-display-avatar').append(options.tempElement);
		
		/* แสดงผล */
		var before = $(document.body).data('reply');
		var after = $.extend({},before,{
			'raw':rs.raw,
			'disp' :rs.disp
		});
		$(document.body).data('reply',after);
		
		$('.display-post-story.preview.sub-comment').show().html(rs.disp);
	}

	/*
	 * Create By 
	 * last update ???????
	 * แสดงผล comment หลังจาก preview
	 **/
	function renderCommentPreview(rs,options)
	{
		var expert = checkExpert("previewComment");
		/* ซ่อน bar comment */
		$('.head-bar-comment').hide();
		/* เพิ่ม ให้แสดง label preview */
		//display-post-wrapper comment-box-w-ad comment-box-color comment-bar main-comment comment-preview preview-now
		$('.comment-box-color.comment-bar.main-comment').addClass('comment-preview preview-now').removeClass('first').removeClass('comment-box-w-ad');
		$('.comment-box-ad').hide();
		$('.comment-box-ad-area').hide();
		$('.display-post-story.form.main-comment').hide();

		/* gen ปุ่ม edit ใหม่ */
		$('.display-post-action.main-comment').html('<div class="button-container main-comment">'
			+'<a class="button normal-butt" href="javascript:void(0);" id="btn_edit_comment"><span><em>แก้ไขข้อความ</em></span></a>&nbsp;'
			+'<a class="button letdo-butt" href="javascript:void(0);" id="btn_comment"><span><em>ส่งข้อความ</em></span></a>&nbsp;'
			+expert
			+'<div class="display-post-avatar avatarleft pt-display-avatar"></div>'
			+'<span class="error-txt main-comment"></span>'
			+'</div>');
		/* แทรก avatar ลง*/
		$('.button-container.main-comment').find('.pt-display-avatar').append(options.tempElement);
		
		/* แสดงผล */
		$(document.body).data('comment',
		{
			'raw':rs.raw,
			'disp' :rs.disp
		});
		
		$('.display-post-story.preview.main-comment').show().html(rs.disp);
	}

	/*
	 * Create By 
	 * last update ???????
	 * คลิกปุ่ม ส่งกระทู้
	 **/
	$.commentTopic.sendComment = function()
	{
		var options = $.commentTopic.defaults;
		$(document).on('click', '#btn_comment', function(e){
			
			if($.trim($('#detail').val()) == '')
			{
				showCommentErrorFeedback(e.target, '** กรุณากรอกข้อความ');
				return false;
			}
			
			if(options.ajaxrequest == false)
			{
				options.ajaxrequest = true;
				$.ajax({
					url : "/forum/topic/abxz",
					dataType : 'json',
					error : function(jqXHR,exception,err){
						
						options.ajaxrequest = false;
						$.errorNotice.dialog(err,{
							title : 'แจ้งเตือน',
							btn_close:'ดำเนินการต่อ'
						});
						
					},
					success : function(rs){
						options.ajaxrequest = false;
						if(rs.has_session == 1)
						{
							sendComment();
						}
						else
						{
							showCommentErrorFeedback(e.target, '<u><b>เกิดข้อผิดพลาด</b></u> ระบบไม่สามารถจดจำข้อความที่คุณพิมพ์ไว้ได้ กรุณาคัดลอกข้อความเก็บไว้ แล้วล็อกอินเข้าสู่ระบบใหม่อีกครั้ง');
						}
					}
				});
			}
		});
	};

	/*
	 * Create By 
	 * last update 2012-11-08
	 * ส่งข้อมูล เก็บเข้า db
	 **/
	function saveComment(topic_id, expert)
	{
		var options = $.commentTopic.defaults;
		var dataSend = {
					msg: $.data(document.body).comment,
					type : $('#topic-type').val(),
					topic_id : topic_id,
					expert : expert
				};
		var preloading = lightboxLoading();

		
		if(preloading == true)
		{
			$.ajax({
				type: "POST",
				url : "/forum/topic/save_comment",
				dataType : 'json',
				data : dataSend,
				timeout : 15000,
				error : function(jqXHR,exception,err){
					if (exception === 'timeout')
					{
						err = 'Timeout : การเชื่อมต่อมีปัญหา หากท่านเพิ่งตั้ง/ตอบกระทู้ ข้อความท่านอาจเข้าสู่ระบบแล้ว กรุณารวจสอบก่อนค่อยกดตั้ง/ตอบกระทู้ใหม่';
					}
					$.errorNotice.defaults.refresh_page = true;			
					$.errorNotice.dialog(err,{
						title : 'แจ้งเตือน',
						btn_close:'ดำเนินการต่อ'
					});
				},
				success : function(rs){
					
					$.extend($.sms,{
						'type' : 'comment'
					});
					validation_error(rs);

					if(rs.status == 'success')
					{
						// api push call
						var dataApi = {
							detail : dataSend.msg.disp
							,type : dataSend.type
							,id : dataSend.topic_id
							,member_id : rs.member_id
							,nickname : rs.nickname
							,creatAt : rs.creatAt
							,methodType : 'comment'
							,comment_no : rs.comment_no							
						}
						
						var msg = 'ส่งข้อความสำเร็จแล้ว, <a href="javascript:void(0);" id="go">ดูข้อความของคุณ</a><br/><span class="small-txt">ไปยังข้อความของคุณ';
							lightboxSave(msg,rs.topic_id , rs.comment_no);							
					}
				}
			});
		}		
	}
	
	/* send data to api  */
	function api_push_call(obj,callback)
	{
		var dataSend = obj;
		$.ajax({
			url : '/node/api/push-check',
			dataType : 'json',
			type : 'POST' ,			
			contentType :'application/json; charset=UTF-8',
			data : JSON.stringify(dataSend) ,
			success : function () {
				if(typeof(callback) == 'function')
				{
					callback();
				}
			}
		}); 
	}

	
	
	/*
	 * Create By 
	 * last update ???????
	 * lightbox loading
	 **/
	function lightboxLoading()
	{
		/* create div */
		$('.content').after('<div class="lightbox-hide remove" id="lightbox_save"></div>');
		/* create light box */
		$('#lightbox_save').dialog({
			width : 238,
			closeOnEscape: false,
			modal: true,
			closeOnEscape : false,
			open: function(event, ui) {
				$(".ui-dialog-titlebar-close,.ui-dialog-titlebar").hide();
				$(this).attr('style','display: block; width: auto; min-height: auto; height: auto;');
			},
			resizable: false,
			draggable: false,
			close: function(){}
		}).append('<div class="dialog-loading-inner"><span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span></div>');
		return true;
	}
	
	/*
	 * Create By 
	 * last update ???????
	 * lightbox Save
	 **/
	function lightboxSave(msg,topic_id,comment_no)
	{
		if(!comment_no){
			comment_no = null;
		}
	
		var delay_loading = (function()
		{
			var timer = 0;
			return function(callback, ms)
			{
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
		})();

		if(comment_no == null)
		{			
			window.location = '/topic/'+topic_id;
		}
		else
		{				
			window.location = '/topic/'+topic_id+'/comment'+comment_no;
		}

	}
	
	
	function lightBoxError(msg)
	{
		/* create div */
		$('.content').after('<div class="lightbox-hide remove" id="lightbox_confirm"></div>');
		/* create light box */
		$('#lightbox_confirm').dialog({
			//width : 238,
			title: 'แจ้งเตือน',
			closeOnEscape: false,
			modal: true,
			closeOnEscape : false,

			resizable: false,
			draggable: false,
			close: function()
			{
				$('#lightbox_confirm').dialog( "destroy" ).remove();
			}
		}).append('<p class="desc">' + msg + '</p>'
			+'<div class="button-container">'
			+'<a class="button normal-butt" id="refresh_btn" href="javascript:void(0);"><span><em>ตกลง</em></span></a>'
			+'</div>');

		$('.ui-dialog').off('click').on('click','#refresh_btn',function(){
			window.location.reload();
		});
	}
	/*
	 * Create By 
	 * last update ???????
	 * นับถอยหลัง 
	 **/
	function counter_delay(c)
	{
		c--;
		if(c > 1){
			setTimeout(function(){
				counter_delay(c);
			},1000);
		}
		//console.log(c);
		$('#timer').html(c);
	}

	
	function removeReply()
	{
		// สำหรับ edit mode ของที่ tong ทำ
		$('.hide-edit-mode').show();	
		// หากมีการกด edit topic ไว้แล้วทำการลบออก
		if($('#topic-edit-form').length > 0)
		{
			$('#topic-edit-form').remove();
		}
		$('.edit-mode').remove();
		$('.sub-comment.head-bar-reply,.sub-comment.reply-comment').remove();
		$.commentTopic.objectSet({
			preview_r : false
		});
	}
	
	function sendReply()
	{

		var options = $.commentTopic.defaults;
		var value = $('#comment_sub');

		if(options.preview_r == false)
		{
			$.commentTopic.objectSet({
				tempElement : $('.pt-display-avatar').html()
			});
			/* set data */
			var before = $(document.body).data('reply');
			var after = $.extend({},before,{
				'raw':value.val()
			});
			$(document.body).data('reply',after);
			//console.log($.data(document.body).reply);
			
			/* loading */
			var tempUi = $('.button-container.sub-comment').html();
			$('#btn_reply_preview').replaceWith('');
			$('#btn_reply').replaceWith('<span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span>');

			$.ajax({
				type: "POST",
				url : "/forum/topic/preview_comment",
				dataType : 'json',
				data : {
					msg: $.data(document.body).reply
				},
				timeout : 15000,
				error : function(jqXHR,exception){
					$('.button-container.sub-comment').html(tempUi);
				},
				success : function(rs){
					/* แสดงผล การ reply */
					renderReplyPreview(rs,options);
					/* set ว่า preview อยู่ */
					$.commentTopic.objectSet({
						preview_r : true
					});
					if(options.preview_r == true)
					{
						//alert('ส่งข้อมูล');
						//console.log($.data(document.body).reply);
						/* ส่งข้อมูล */
						saveReply();
					}
				}
			});
			
			
		
		}
		else
		{
			if(options.preview_r == true)
			{
				//console.log($.data(document.body).reply);
				/* ส่งข้อมูล */
				saveReply();
			}
		}
	}
	
	function saveReply()
	{
		var url = window.location.pathname.split('/');
		var options = $.commentTopic.defaults;

		var preloading = lightboxLoading();
		if(preloading == true)
		{
			$.ajax({
				type: "POST",
				url : "/forum/topic/save_reply",
				dataType : 'json',
				data : {
					msg: $.data(document.body).reply,
					topic_id :url[2],
					type : $('#topic-type').val()
				},
				timeout : 15000,
				error : function(jqXHR,exception,err){
					if (exception === 'timeout')
					{
						err = 'Timeout : การเชื่อมต่อมีปัญหา หากท่านเพิ่งตั้ง/ตอบกระทู้ ข้อความท่านอาจเข้าสู่ระบบแล้ว กรุณารวจสอบก่อนค่อยกดตั้ง/ตอบกระทู้ใหม่';
					}
					$.errorNotice.defaults.refresh_page = true;
					$.errorNotice.dialog(err,{
						title : 'แจ้งเตือน',
						btn_close:'ดำเนินการต่อ'
					});
				},
				success : function(rs)
				{
				     /* เช็คคำไม่ผ่าน */
					if (rs.chkWord != undefined)
					{
						lightBoxProcess();
						window.location.href = rs.id;
						return false;
					}	
					$.extend($.sms,{
						'type' : 'reply'
					});
					validation_error(rs);

					if(rs.status == 'success')
					{
						var msg = 'ส่งข้อความสำเร็จแล้ว, <a href="javascript:void(0);" id="go">ดูข้อความของคุณ</a><br/><span class="small-txt">ไปยังข้อความของคุณ';
							lightboxSave(msg,rs.topic_id , rs.comment_no);
					}
					
				}
			});
		}
		
	}
	/*
	 * Create By 
	 * last update ???????
	 * logic ควบคุม ระวังการ กดส่งกระทู้ ทั้งหมด
	 **/
	function sendComment()
	{
		var url = window.location.pathname.split('/');
		var options = $.commentTopic.defaults;
		var value = $('#detail');
		var expert = checkExpert("sendComment");		
		if(options.preview == false)
		{
			$.commentTopic.objectSet({
				tempElement : $('.pt-display-avatar').html()
			});
			
			$(document.body).data('comment',
			{
				'raw':value.val()
			});
			/* loading */

			var tempUi = $('.button-container.main-comment').html();
			$('#btn_comment_preview').replaceWith('');
			$('#btn_comment').replaceWith('<span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
			$('.button-container.main-comment .display-checkbox-expert').hide();	
			$.ajax({
				type: "POST",
				url : "/forum/topic/preview_comment",
				dataType : 'json',
				
				data : {
					msg: $.data(document.body).comment
				},
				timeout : 15000,
				error : function(jqXHR,exception){
					$('.button-container.main-comment').html(tempUi);
				},
				success : function(rs){
					/* แสดงผล การ preview */
					renderCommentPreview(rs,options);
					/* set ว่า preview อยู่ */
					$.commentTopic.objectSet({
						preview : true
					});
					if(options.preview == true)
					{				
						/* ส่งข้อมูล */
						saveComment(url[2], expert);
					}						
				}
			});
		}
		else
		{
			if(options.preview == true)
			{
				/* ส่งข้อมูล */
				saveComment(url[2], expert);
			}
		}

	}
	/*
	 * Create By 
	 * last update ???????
	 * คลิกปุ่ม preview
	 *
	 **/
	$.commentTopic.previewComment = function ()
	{
		var options = $.commentTopic.defaults;

		$(document).on('click','#btn_comment_preview',function(){

			/* ลบกล่องตอบกลับทั้งหน้าจอ */
			removeReply();
			
			var value = $('#detail');

			if(options.preview == false)
			{
				$.commentTopic.objectSet({
					tempElement : $('.pt-display-avatar').html()
				});
				$(document.body).data('comment',
				{
					'raw':value.val()
				});
				/* loading */
				var tempUi = $('.button-container.main-comment').html();
				
				$('#btn_comment_preview').replaceWith('');
				$('#btn_comment').replaceWith('<span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
				$('.button-container.main-comment .display-checkbox-expert').hide();
				$.ajax({
					type: "POST",
					url : "/forum/topic/preview_comment",
					dataType : 'json',
					data : {
						msg: $.data(document.body).comment
					},
					timeout : 15000, //15sec
					error : function(jqXHR,exception){
						$('.button-container.main-comment').html(tempUi);
					},
					success : function(rs){
						/* แสดงผล การ preview */
						renderCommentPreview(rs,options);
						/* set ว่า preview อยู่ */
						$.commentTopic.objectSet({
							preview : true
						});
					}
				});
			}

		});
	};

	
	$.oauthFacebook.btnLogin = function()
	{
		var options = $.oauthFacebook.defaults;

		trigger_click('#member_password', '#user_login_btn_fb');

		$(document).on('click','#user_login_btn_fb',function(){
			var u_login = {};
			/* set เข้า .data */
			var before = $(document.body).data('fb_login');
			var after = $.extend({},before,{
				'crypted_password':$('#member_password').val()
			});
			$(document.body).data('fb_login',after);
			//console.log($(document.body).data('fb_login'));
			/* ส่งข้อมูล */
			if(options.ajaxrequest == false)
			{
				options.ajaxrequest = true;
				$(this).after('<span class="loading-txt small-txt">กำลังประมวลผล โปรดรอสักครู่..</span>');

				$.ajax({
					type: "POST",
					url : '/login/fb_login',
					dataType : 'json',
					data : {
						value: $.data(document.body).fb_login
					},
					timeout : 15000,
					error : function(jqXHR,exception,err){

						$.errorNotice.dialog(err,{
							title : 'แจ้งเตือน'
						});
						options.ajaxrequest = false;
					},
					success : function(rs){
						
						options.ajaxrequest = false;
						$('.loading-txt.small-txt').remove();
						
						if(rs.login_success == 0 )
						{
							$('#login_error').html('รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง');
						}
						else
						{
							/* case แจ้งเตือนข้อหา */
							if(rs.member_notify != undefined && rs.member_notify == 1)
							{
								$.errorNotice.dialog(rs.error_message,{
									title : 'แจ้งเตือน',
									btn_close:'รับทราบ',
									action : 'member_notify',
									url : '/login/l_acknowledge',
									authen_type : 'oauth',
									param_id : rs.id

								});
								return false;
							}
							
							if(rs.login_success == 1 )
							{
								/* แสดง bar bbcode และ ปุ่ม preview */
								ui_authen();
								/* แสดงรูป avatar */
								display_avatar(rs.display_avatar);
								/* ปิด lightbox */
								$('.login_lb_process').remove();
							}
							
						}
						$('.loading-txt').remove();
						
						
					}

				});
			}

		});
	};
	
	$.oauthFacebook.btnSetpwd = function()
	{
		var options = $.oauthFacebook.defaults;

		trigger_click('#member_password', '#user_pwd_btn');

		$(document).on('click','#user_pwd_btn',function(){
			var u_login = {};
			/* set เข้า .data */
			var before = $(document.body).data('fb_login');
			var after = $.extend({},before,{
				'crypted_password':$('#member_password').val()
			});
			$(document.body).data('fb_login',after);

			if(options.ajaxrequest == false)
			{
				options.ajaxrequest = true;
				$(this).after('<span class="loading-txt small-txt">กำลังประมวลผล โปรดรอสักครู่..</span>');
				$.ajax({
					type: "POST",
					url : '/login/fb_create',
					dataType : 'json',
					data : {
						value: $.data(document.body).fb_login
					},
					success : function(rs)
					{
						if(rs.pwd_success != undefined  && rs.pwd_success == 0)
						{
							$('#pwd-error').html('กรุณากรอกรหัสผ่านมากกว่า 6 ตัวอักษร!!');
							$('#member_password').focus();
						}

						if(rs.create_success != undefined && rs.create_success == 1)
						{
							/* แสดง bar bbcode และ ปุ่ม preview */
							ui_authen();
							/* แสดงรูป avatar */
							display_avatar(rs.display_avatar);
							/* ปิด lightbox */
							$('.login_lb_process').dialog('close').remove();
						}
						$('.loading-txt').remove();
						options.ajaxrequest = false;
					}
				});
			}





		});
	};
	
	function form_fb_login($obj)
	{
		/* email ตรงกันกับใน ระบบ */
		if($obj.email_matching == 1)
		{
			$('.section-oauth').remove();
			$('.ui-dialog-title').text('พบข้อมูลของคุณอยู่ในระบบ');
			/* set .data facebook */
			$(document.body).data('fb_login',
			{
				'email':$obj.user_email
			});
			/* title lightbox */
			$('#div_login_lb_form').prepend('<div class="input-line"><label></label><div class="input-container">คุณมีบัญชีผู้ใช้ใน pantip.com แล้ว</div></div>');
			/* section email */
			$('.section-one').html('<label>อีเมล</label><div class="input-container"><p>'+$obj.user_email+'</p></div>');
			/* section nickname */
			$('.section-one').after('<div class="input-line section-nickname"><label>นามแฝง</label><div class="input-container"><p>'+$obj.user_nickname+'</p></div></div>');
			/* section button */
			$('#user_login_btn').replaceWith('<a class="button normal-butt" id="user_login_btn_fb" href="javascript:void(0);"><span><em>ตกลง</em></span></a>');

		}
		/* email ไม่ตรงกับใน ระบบ */
		if($obj.email_matching == 0)
		{
			$.ajax({
				type: "POST",
				url : '/login/authen_set_pwd',
				success : function(rs){

					$('.login_lb_process')
					.html(rs)
					.dialog({
						title : 'กำหนดรหัสผ่านใหม่',
						modal: true,
						resizable: false,
						draggable: false,
						close: function(){
							$('.login_lb_process').dialog('destory').remove();
						}
					});
					$('#member_password').passwordStrength({
						targetDiv: '#iSM',
						classes : Array('weak','medium','strong')
					});
					$('#member_password').disallowThai();

					/* set */
					$(document.body).data('fb_login',
					{
						'email':$obj.user_email
					});
				}
			});

		}
		$('#member_password').focus();
	};
	
	$.oauthFacebook.authen = function()
	{
		/* https://developers.facebook.com/blog/post/2011/08/02/how-to--optimize-social-plugin-performance/ */
		window.fbAsyncInit = function() {
			FB.init({
				appId	: '117368861736328', 
				cookie	: true, // enable cookies to allow the server to access the session
				xfbml	: true, // enable XFBML and social plugins
				version	: 'v4.0'
			});
		};

		// Load the SDK Asynchronously
		(function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/th_TH/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
		$(document).on('click','#fb_authen',function(){


			FB.login(function(response) {
				if (response.authResponse)
				{
					FB.api('/me', {fields: 'name, email, link'} ,function(response) {
						if(response.email !== undefined)
						{
							$.ajax({
								type: "POST",
								url : '/login/fb_oauth',
								dataType : 'json',
								data : {
									v:response
								},
								timeout : 15000,
								error : function(jqXHR,exception,err){

									$.errorNotice.dialog(err,{
										title : 'แจ้งเตือน'
									});
								},
								success : function(rs){
									if(rs != null)
									{

										/* case display authen error */
										if(rs.authen_error != undefined && rs.authen_error == 1)
										{
											//$('.login_lb_process').html('<p>An error occurred. Please click button reload.</p><br/><a href="javascript:void(0);" id="user_reload" class="button normal-butt"><span><em>Reload</em></span></a>');
											$('.login_lb_process').html('<p>เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง</p>');
										}

										/* case แจ้งเตือนข้อหา */
										if(rs.member_notify != undefined && rs.member_notify == 1)
										{
											$.errorNotice.dialog(rs.error_message,{
												title : 'แจ้งเตือน',
												btn_close:'รับทราบ',
												action : 'member_notify',
												url : '/login/l_acknowledge',
												authen_type : 'oauth',
												param_id : rs.id

											});
											return false;
										}

										if(rs.error == true)
										{
											$.errorNotice.dialog(rs.error_message,{
												title : 'แจ้งเตือน'
											});
											return false;
										}	

										/* case email matching */
										if(rs.email_matching != undefined )
										{
											form_fb_login({
												user_email : response.email,
												user_nickname : rs.nickname,
												email_matching : rs.email_matching,
												type:'facebook'
											});
										}
										/* case login success */
										if(rs.login_success != undefined  && rs.login_success == 1)
										{
											/* แสดง bar bbcode และ ปุ่ม preview */
											ui_authen();
											/* แสดงรูป avatar */
											display_avatar(rs.display_avatar);
											$('.login_lb_process').dialog('close').remove();
										}


									}
								}
							});
						}
						else
						{
							$.errorNotice.dialog('ขออภัย ไม่สามารถเข้าสู่ระบบด้วย facebook ได้ กรุณาลองใหม่อีกครั้ง แล้วเลือกให้พันทิปเข้าถึงข้อมูล Email ของคุณบน facebook',{
								title : 'แจ้งเตือน'
							});
							return false;
						}
					});
				}
				else
				{
					//console.log('User cancelled login or did not fully authorize.');
					return false;
				}
			}, {
				scope: 'email',
				auth_type: 'rerequest'
			});
		});
	}
	
	
	var vote_url = '/vote1/cal_like';
	var $this;
	var element_vote_obj = {};
	var is_best_comment = 'normal';
	
	$.topic_vote = {}
	
	$.topic_vote.start = function() {
		$('.display-post-story-footer').on('click','.main-post-inner .icon-heart-like,.main-post-inner .icon-heart-dislike',$.topic_vote.init);
	}
	
	$.topic_vote.test = function ()
	{
		console.log('test');
	}

	
	$.topic_vote.cal_like = function (is_form_login)
	{
		// is_form_login ที่มีค่าของ login , display_avatar เฉพาะตอน check_login ด้วย lightbox_login เท่านั้น
		if(is_form_login.chk == 'true')
		{
			ui_authen();
			display_avatar(is_form_login.display_avatar);
		}

		
		// ในกรณีสำหรับ login จาก lightbox login มาค่าที่ได้จะเป็น object ต้องทำการเปลี่ยนก่อน
		if(typeof(is_form_login) == 'object')
		{
			is_form_login = is_form_login.chk;
		}
		
		
		// เช็คเรื่องการ login ผ่าน lightbox 
		if(!is_form_login)
		{
			$.extend($.topic_vote.defaults.dataSend, {
				'form_lb_login' : true
			});
			$.topic_vote.defaults.chk_loading  = true;
		}
		
		var d = new Date();		
		$.topic_vote.defaults.sendingAjax = $.post( vote_url + '?t=' + d.getTime(),$.topic_vote.defaults.dataSend,function(result){	
			// เรียกฟังก์ชั่นสำหรับการแจ้งประกาศให้แก่ User
			display_result(result);
			return false;
		},'json');
	
		return false;
	}

	/**
	 * ฟังก์ชั่นเริ่มต้นทำงานของการ Vote 
	 * ** ถ้าในกรณีเป็นปุ่มโหวต + ไม่มีปุ่มลบให้ใช้ function chk_vote_type_just_plus
	 * ** ถ้าในกรณีมี 2 ปุ่ม +,- ให้ใช้ chk_vote_type เหมือนเดิม
	 * 
	 * @access public
	 * @return bool
	 * @author Tong
	 */
	$.topic_vote.init = function ()
	{
		// สำหรับการป้องกันการกดด้วยโปรแกรม
		if($.topic_vote.defaults.chk_loading == true)
		{
			return false;
		}
		$.topic_vote.defaults.chk_loading = true;
		
		$this = $(this);
		//ถ้าปุ่มที่ถูกคลิกนั้นมีการโหวตแล้วจะไม่สามารถกดได้
		// ไม่ใช้ตรงนี้สำหรับการโหวตปุ่มเดียว
		//		if(has_class_no_working($this.hasClass('i-vote')))
		//		{
		//			return false;
		//		}
		$.extend(element_vote_obj,{
			'both_of_vote' : $('.main-post-inner .icon-heart-like,.main-post-inner .icon-heart-dislike'),
			'good' : $('.main-post-inner .icon-heart-like'),
			'bad' : $('.main-post-inner .icon-heart-dislike'),
			'score' : $('.main-post-inner .like-score')
		});
		
		var dataSend = {
			'topic_id' : location.pathname.split("/")[2],
			//			'vote_status' : chk_vote_type($this.attr('class')),
			'vote_status' : chk_vote_type_just_plus($this.attr('class')),
			'vote_type' : 1	
		};
		
		// set ค่า ele default เพื่อนำไปในต่อในทุกกระบวนการ
		topic_variable_set({
			'dataSend' : dataSend ,
			'ele' :$this
		});
		


		$.topic_vote.cal_like(true);
	}
	
	/* #########################################
	 * #				COMMENT				   #
	 * ######################################### 
	 * */
	$.comment_vote = {};
	
	$.comment_vote.start = function()
	{
		/* comment vote good/bad */				
		$(document).on('click','.comment-action .icon-heart-like,.comment-action .icon-heart-dislike',$.comment_vote.init);
	}
	$.comment_vote.init = function()
	{   
	
		if($.comment_vote.defaults.chk_loading == true)
		{
			return false;
		}
		
		$.comment_vote.defaults.chk_loading = true;
		
		$this = $(this);
		//reset value 
		$.comment_vote.defaults = {};
		//ถ้าปุ่มที่ถูกคลิกนั้นมีการโหวตแล้วจะไม่สามารถกดได้
		// ** กรณีใช้ 2 ปุ่ม +,- ถึงจะใช้ตรงนี้
		//		if(has_class_no_working($this.hasClass('i-vote')))
		//		{
		//			return false;
		//		}
		//		
		// detect type is comment/reply
		$.comment_vote.type = detect_type();
		if($.comment_vote.type == 'comment')
		{
			// get id form DOM
			var com_id = comment_detect_id($this);
			var dataSend = {
				'comment_id' : com_id,
				//			'vote_status' : chk_vote_type($this.attr('class')),
				'vote_status' : chk_vote_type_just_plus($this.attr('class')),
				'vote_type' : 2,
				'comment_no' : $(this).parents('.display-post-status-leftside').find('.display-post-number').attr('id').replace('comment',''),
				'topic_id' :location.pathname.split("/")[2]
			};
		}
		else if($.comment_vote.type == 'reply')
		{
			var id_string = $(this).parents('.display-post-wrapper').attr('data-rp').toString()
			$.comment_vote.defaults.cid = id_string.split("_")[0];		
			$.comment_vote.defaults.rp_id = id_string.split("_")[1];
			$.comment_vote.defaults.rp_no = id_string.split("_")[2];	
			
			var dataSend = {
				'cid' : $.comment_vote.defaults.cid,
				'rp_id' : $.comment_vote.defaults.rp_id ,
				'rp_no' : $.comment_vote.defaults.rp_no,
				//			'vote_status' : chk_vote_type($this.attr('class')),
				'vote_status' : chk_vote_type_just_plus($this.attr('class')),
				'vote_type' : 3,
				'comment_no' :$(this).parents('.display-post-status-leftside').find('.display-post-number').attr('id').split("-")[0].replace('comment',''),
				'topic_id' :location.pathname.split("/")[2]
			};
		}
		
		
		// ตั้งค่า ele สำหรับตอนสำหรับรับคะแนนมาแล้วไป update
		$.extend(element_vote_obj,{
			'both_of_vote' : $this.parents('.display-post-vote').children('.icon-heart-like,.icon-heart-dislike'),
			'good' : $this.parents('.display-post-vote').children('.icon-heart-like'),
			'bad' : $this.parents('.display-post-vote').children('.icon-heart-dislike'),
			'score' : $this.parents('.display-post-vote').children('.like-score')
		});
		
		$.extend($.comment_vote.defaults,{ 
			'dataSend' : dataSend ,
			'ele' :$this 
		});	
		
		$.comment_vote.cal_like_comment(true);
	}
	
	$.comment_vote.cal_like_comment = function (is_form_login)
	{		
		// is_form_login ที่มีค่าของ login , display_avatar เฉพาะตอน check_login ด้วย lightbox_login เท่านั้น
		if(is_form_login.chk == 'true')
		{
			ui_authen();
			display_avatar(is_form_login.display_avatar);
		}

		
		if(!is_form_login)
		{
			$.extend($.comment_vote.defaults.dataSend, {
				'form_lb_login' : true
			});
		}
		var d = new Date();
		$.comment_vote.defaults.sendingAjax = $.post(vote_url + '?t=' + d.getTime(),$.comment_vote.defaults.dataSend,function(result){
			if($.comment_vote.defaults.sendingAjax.readyState == 4 && $.comment_vote.defaults.sendingAjax.status == 200)
			{
				display_result(result);
			}
		},'json');
	
		return false;
	}

	/**
	 * ฟังก์ชั่นแจ้งประกาศข้อความกลับจากการโหวตแล้วว่ามี error หรือว่า สำเร็จแล้วเหลือกี่นาที
	 * 
	 * @access private
	 * @param JSON result
	 * @return bool
	 * @author Tong
	 */	
	function display_result(result)
	{
		if(result.error == true)
		{						
			// notification error
			if(result.error_type == 'no_login')
			{
				ajaxSending = false;
				// not login yet
				if(result.what_vote_type == 1)
				{
					// alert('Topic votes not logged in');
					let returnUrl = '/topic/' + $.topic_vote.defaults.dataSend.topic_id;
					requireLogin(returnUrl);
				} else if (result.what_vote_type == 2 || result.what_vote_type == 3) {
					// alert('Comment or reply votes not logged in');
					let returnUrl = '/topic/' + $.comment_vote.defaults.dataSend.topic_id + '/comment' + $.comment_vote.defaults.dataSend.comment_no;
					if (result.what_vote_type == 3) {
						returnUrl += '-' + $.comment_vote.defaults.dataSend.rp_no;
					}
					requireLogin(returnUrl);
				}
				return false;
			}		
			else if(result.error_type == 'account_no_verified')
			{					
				$.errorNotice.defaults.width = 500;
				$.errorNotice.dialog(result.error_message);
				$.topic_vote.defaults.chk_loading = false; 
				return false;
			}
			else if(result.error_type == 'vote_empty')
			{
				$.errorNotice.dialog(result.error_message);
				$.topic_vote.defaults.chk_loading = false; 
				return false;
			}
			else if(result.error_type == 'vote_conflict')
			{
				$.errorNotice.defaults.refresh_page = true;					
				$.errorNotice.dialog(result.error_message);				
				return false;
			}
			else if(result.error_type == 'vote_mineself')
			{				
				$.errorNotice.dialog(result.error_message);
				$.topic_vote.defaults.chk_loading = false; 
				return false;
			}
			else if(result.error_type == 'member_notify')
			{
				/* แจ้งข้อหาสมาชิก */
				$.errorNotice.dialog(result.error_message,{
					title : 'แจ้งเตือน',
					btn_close:'รับทราบ',
					action : 'member_notify',
					url : '/login/l_acknowledge',
					validation_user : true,
					param_id : result.id
				});	
				$.topic_vote.defaults.chk_loading = false; // ปิด lightbox
				
				return false;
			}
			else if(result.error_type == 'ban_user')
			{
				/*โดนแบนถาวร*/
				$.errorNotice.dialog(result.error_message);
				$.topic_vote.defaults.chk_loading = false; // ปิด lightbox
				return false;
			}
			
			return false;
		}
		else if(result.vote_success == true)
		{	
			$.pantipNotice.defaults.callbackAfterRemove = function(){
				clearInterval($.topic_vote.defaults.timer);
			};
					
			if(result.balance_time != false)
			{	
				clearInterval($.topic_vote.defaults.timer);
				var countDown = 0;
				$.topic_vote.defaults.timer = 	setInterval(function(){ 						
					var summand_time = new Date(result.balance_time);
					var subtrahend_time = new Date(result.subtrahend_time[countDown]);					
					var result_time = summand_time.getTime() - subtrahend_time.getTime();								
					var min_diff = '' + Math.floor(result_time/1000/60);
					result_time -= min_diff*1000*60
					var sec_diff = '' + Math.ceil(result_time/1000);
					if(sec_diff == '60')
					{
						sec_diff = '00';
					}
					if(sec_diff.length == 1)
					{
						sec_diff = '0' + sec_diff;
					}
					if(min_diff.length == 1)
					{
						min_diff = '0' + min_diff;
					}
					$('#balance_time').html(min_diff + ':' + sec_diff);			
					countDown++;
				},1000);					
			}
			$.pantipNotice.dialog(result.vote_message);					
			//			toggle_class_i_vote(result.active);
			toggle_class_i_vote_just_plus(result.active);
			push_score(result.p);
			//ถ้าเป็น comment จะต้องเช็คเกี่ยวกับ best comment ด้วย
			if(result.what_vote_type == 2)
			{							
				update_class_and_socre_equal(result.active,result.p);
			}
			$.topic_vote.defaults.chk_loading = false;
			$.comment_vote.defaults.chk_loading = false;
			return false;
		} // end if(result.error != 'undefiend')
	}
	
	/**
	 * ฟังก์ชั่นสำหรับเช็คว่ามี class ที่แสดงว่าปุ่ม active อยู่จะไม่สามารถกดปุ่มได้
	 * 
	 * @access private
	 * @param bool is_has_class_i_vote
	 * @return bool
	 * @author Tong
	 *
	 */
	function has_class_no_working(is_has_class_i_vote)
	{		
		if(is_has_class_i_vote)
		{
			return true;
		}
		return false;
	}
	
	
	
	/**
	 * ฟังก์ชั่นสำหรับการเช็คว่ามีการ setting default.ele หรือยังถ้ายังไม่มีก็ setting ele ที่ถูกคลิก vote
	 * ใช้สำหรับ topic เท่านั้น
	 * 
	 * @access private
	 * @return void
	 * @param obj { ele : ele ที่ถูกคลิก , dataSend : สำหรับส่งไปหน้า PHP โดยมี topic_id(int) , vote_type (-1/1)
	 * @author Tong
	 * 
	 **/
	function topic_variable_set(obj)
	{	
		$.extend($.topic_vote.defaults,obj);		
	}
	
	/**
	 * ฟังก์ชั่นสำหรับตรวจสอบว่าปุ่มที่ถูกกดนั้นมีสถานอะไรอยู่ ถ้า search ไม่เจอค่าจะเท่ากับ -1 ค่านี้จะนำไปบวกลบคะแนนแต่ต้องเช็คจาก PHP อีกที
	 * 
	 * @access private
	 * @return void
	 * @param string class_name
	 * @author Tong
	 */
	function chk_vote_type(class_name)
	{	
		if(class_name.search('i-vote') != -1)
		{					
			return 0;
		}
		else if(class_name.search('icon-heart-like') != -1)
		{	
			return 1;
		}
		else if(class_name.search('icon-heart-dislike') != -1)
		{			
			return -1;
		}		
	}
	
	
	/**
	 * ฟังก์ชั่นสำหรับตรวจสอบว่าปุ่มที่ถูกกดนั้นมีสถานอะไรอยู่ ถ้า search ไม่เจอค่าจะเท่ากับ -1 ค่านี้จะนำไปบวกลบคะแนนแต่ต้องเช็คจาก PHP อีกที
	 * ** ใช้สำหรับการมีปุ่มโหวตเพียงแค่ 1 ปุ่มเท่านั้น
	 * @access private
	 * @return void
	 * @param string class_name
	 * @author Tong
	 */
	function chk_vote_type_just_plus(class_name)
	{	
		if(class_name.search('i-vote') != -1)
		{					
			return -1;
		}
		else if(class_name.search('icon-heart-like') != -1)
		{	
			return 1;
		}		
	}
	
	
	/**
	 * ฟังก์ชั่นสำหรับการ Toggle การ active ของปุ่ม vote ให้ตัวไหนแสดงว่าโหวตอยู่
	 * 
	 * @access private
	 * @param int is_like_active (  1 / -1 )
	 * @return void
	 * @author Tong
	 */
	function toggle_class_i_vote(is_like_active)
	{			
		element_vote_obj.both_of_vote
		.removeClass('i-vote')
		.css('cursor','pointer');			
		element_vote_obj.good.attr('title','เนื้อหานี้ดี');
		element_vote_obj.bad.attr('title','เนื้อหานี้ไม่ดี');
		if(is_like_active == 1)
		{
			element_vote_obj.good.addClass('i-vote').attr('title','').css('cursor','default');				
			
		}
		else if(is_like_active == -1)
		{
			element_vote_obj.bad.addClass('i-vote').attr('title','').css('cursor','default');			
		}
	}
	
	/**
	 * ฟังก์ชั่นสำหรับการ Toggle การ active ของปุ่ม vote ให้ตัวไหนแสดงว่าโหวตอยู่
	 * ** กรณีมีปุ่มโหวต + เพียงปุ่มเดียว
	 * @access private
	 * @param int is_like_active (  1 / -1 )
	 * @return void
	 * @author Tong
	 */
	function toggle_class_i_vote_just_plus(is_like_active)
	{			
		element_vote_obj.both_of_vote
		.removeClass('i-vote')
		.css('cursor','pointer');			
		element_vote_obj.good.attr('title','กดปุ่มนี้เพื่อบอกว่าเนื้อหานี้ดี (กดอีกทีเพื่อยกเลิก)');		
		if(is_like_active == 1)
		{
			element_vote_obj.good.addClass('i-vote').attr('title','');				
			
		}		
	}
	
	/**
	 * ฟังก์ชั่นสำหรับการ Toggle การ active ของปุ่ม vote ให้ div อื่นที่มีการแสดงโชว์อยู่ในหน้าเดียวกันที่มี id เหมือนกัน
	 * 
	 * @access private
	 * @param int is_like_active (  1 / -1 )
	 * @param element ele
	 * @return void
	 * @author Tong
	 */
	function toggle_another_div_class_i_vote(is_like_active,ele)
	{	
		var vote_ele	= ele.find('.display-post-vote');
		vote_ele.children('.icon-heart-like,.icon-heart-dislike')
		.removeClass('i-vote')
		.css('cursor','pointer');			
		vote_ele.children('.icon-heart-like').attr('title','เนื้อหานี้ดี');
		vote_ele.children('.icon-heart-dislike').attr('title','เนื้อหานี้ไม่ดี');
		if(is_like_active == 1)
		{
			vote_ele.children('.icon-heart-like').addClass('i-vote').attr('title','').css('cursor','default');			
		}
		else if(is_like_active == -1)
		{
			vote_ele.children('.icon-heart-dislike').addClass('i-vote').attr('title','').css('cursor','default');			
		}
	}
	
	/**
	 * ฟังก์ชั่นสำหรับการ Toggle การ active ของปุ่ม vote ให้ div อื่นที่มีการแสดงโชว์อยู่ในหน้าเดียวกันที่มี id เหมือนกัน
	 * ** กรณีโหวตเพียงแค่ + ปุ่มเดียว
	 * @access private
	 * @param int is_like_active (  1 / -1 )
	 * @param element ele
	 * @return void
	 * @author Tong
	 */
	function toggle_another_div_class_i_vote_just_plus(is_like_active,ele)
	{	
		var vote_ele	= ele.find('.display-post-vote');
		vote_ele.children('.icon-heart-like,.icon-heart-dislike')
		.removeClass('i-vote')
		.css('cursor','pointer');			
		vote_ele.children('.icon-heart-like').attr('title','กดปุ่มนี้เพื่อบอกว่าเนื้อหานี้ดี (กดอีกทีเพื่อยกเลิก)');
		if(is_like_active == 1)
		{
			vote_ele.children('.icon-heart-like').addClass('i-vote').attr('title','').css('cursor','default');			
		}
		else if(is_like_active == -1)
		{
			vote_ele.children('.icon-heart-dislike').addClass('i-vote').attr('title','').css('cursor','default');			
		}
	}
	
	
	function push_score(score)
	{
		var like_score	=	element_vote_obj.score;
		//		var old_score = parseInt(like_score.html());
		//		var new_score =	parseInt(old_score + score);
		hilight_score(score);
		like_score.html(score);
		return false;		
	}
	
	/**
	 * ฟังก์ชั่นสำหรับการเอาค่าคะแนนที่ได้มาจากการคำนวน PHP บวกกับค่าเก่าให้กับ Div ที่เหมือนกันกับตัวที่ถูกกด like
	 * 
	 * @access private
	 * @param Int score
	 * @return bool
	 * @author Tong
	 *
	 */
	function push_score_another_div(score,ele)
	{
		var like_score	=	ele.find('.display-post-vote').children('.like-score');
		//		var old_score = parseInt(like_score.html());
		//		var new_score =	parseInt(old_score + score);
		hilight_score(score);
		like_score.html(score);
		return false;		
	}
	
	/**
	 * ฟังก์ชั่นสำหรับการเช็คว่าถ้าคะแนนมากกว่า 4 จะให้ class สีเหลือง มากกว่า 0 ให้สีขาว
	 * 
	 * @access private
	 * @param Int score
	 * @return bool
	 * @author Tong
	 *
	 */
	function hilight_score(score)
	{
		var like_score	=	element_vote_obj.score;
		if(score > 0 && score < 4)
		{
			like_score.addClass('has-score');
		}
		else if(score >= 4)
		{
			like_score.addClass('top-score');
		}
		else
		{
			like_score.removeClass('has-score');
		}
		return false;
	}
	

	
	function comment_detect_id(el)
	{
		// Au modify
		var raw_id = el.parents('.display-post-wrapper').attr('id').split('-');
		// split element id for type and id 
		var type = raw_id[0];
		var id = raw_id[1];
		
		// constant array table
		var type_list = ['topic', 'comment','reply', 'bestanswer', 'topcomment','expertcomment'];
		
		// simple check
		var type_p = $.inArray(type, type_list);
		
		// simple check all value is valid
		if((!isNaN(parseFloat(id))) && (isFinite(id)) && (type_p != -1))
		{
			//return;
			is_best_comment = type;
			return id;
		}
	}
	
	/**
	 * ฟังก์ชั่นสำหรับ update comment อีกตัวหนึ่งถ้า comment มีแสดงอยู่บน Best comment ไม่ว่าจะกดจาก Best หรือธรรมดาก็จะ 
	 * update ค่าให้เหมือนกันทั้งสอง comment
	 * 
	 * @access private
	 * @return void
	 * @author Tong
	 * 
	 */
	
	function update_class_and_socre_equal(is_like_active,score)
	{
		// Au modify
		// topcomment = สุดยอดความคิดเห็น
		// bestanswer = ความคิดเห็นที่ถูก จขกท. เลือก
		// expertcomment = ความคิดเห็นจากผู้เชี่ยวชาญ
		if(is_best_comment == 'topcomment' || is_best_comment == 'bestanswer' || is_best_comment == 'expertcomment')
		{
			// ต้องเช็คว่ามี comment ตัวมันเองแบบธรรมดากำลังแสดงอยู่หรือไม่
			var chk_ele_normal = $('#comment-' + $.comment_vote.defaults.dataSend.comment_id);
			if(chk_ele_normal.length > 0)
			{
				//toggle_another_div_class_i_vote(is_like_active,chk_ele_normal);
				toggle_another_div_class_i_vote_just_plus(is_like_active,chk_ele_normal);
				push_score_another_div(score,chk_ele_normal);
			}
		}
		else
		{			
			// ต้องรู้ว่ามี bestanswer หรือเปล่า
			var chk_ele_best_owner = $('#bestanswer-' + $.comment_vote.defaults.dataSend.comment_id);
			if(chk_ele_best_owner.length > 0)
			{
				toggle_another_div_class_i_vote_just_plus(is_like_active,chk_ele_best_owner);
				push_score_another_div(score,chk_ele_best_owner);
			}
			// ต้องรู้ว่ามี topcomment แสดงอยู่หรือไม่
			var chk_ele_best_comment = $('#topcomment-' + $.comment_vote.defaults.dataSend.comment_id);
			if(chk_ele_best_comment.length > 0)
			{
				toggle_another_div_class_i_vote_just_plus(is_like_active,chk_ele_best_comment);
				push_score_another_div(score,chk_ele_best_comment);
			}
				// ต้องรู้ว่ามี expertcomment แสดงอยู่หรือไม่
			var chk_ele_expert_comment = $('#expertcomment-' + $.comment_vote.defaults.dataSend.comment_id);
			if(chk_ele_expert_comment.length > 0)
			{
				toggle_another_div_class_i_vote_just_plus(is_like_active,chk_ele_expert_comment);
				push_score_another_div(score,chk_ele_expert_comment);
			}
		}		
	}
	
	
	$.topic_vote.defaults = {
		ele : '',
		timer : '',
		sendingAjax: '',
		chk_loading: false
	};

	$.comment_vote.defaults = {
		ele : '',
		sendingAjax: '',
		chk_loading: false
	};	
	
	$.loginLBComment = {};
	$.loginLBComment.ObjectSet = function(partialObject)
	{
		$.extend($.loginLBComment, partialObject);
	}

	
	$.loginLBComment.openForgotPwdLB = function(){ // เปิด lightbox ลืมรหัสผ่าน
		$(document).on('click', '#forgot_pw_lb', function(){
			var lb_ele_div = '<div id="lb_process" class="lightbox-hide"></div>';
			$('.footer').append(lb_ele_div);
			$.ajax({
				type: 'POST',
				url: '/login/form_forgot_pwd',
				data: '',
				dataType: 'html',
				success: function(result){
					$('#lb_process')
					.html(result)
					.dialog({
						width: 500,
						title: 'ลืมรหัสผ่าน',
						modal: false,
						resizable: false,
						draggable: false,
						close: function(){
							$('#lb_process').remove();
						}
					});
					$('#fw_user').focus();
					$('.login_lb_process').remove();
				}
			});
		});
	};

	
	$.loginLBComment.checkInputForgotPwdLB = function(){
		trigger_click('#fw_user', '#fw_get_pwd')
		$(document).on('click', '#fw_get_pwd', function(){
			var formFW = $('#forgot_pwd_form').serialize();
			var type = $('input:radio[name=fw_type]:checked').val();
			var checkVal = true;
			var error = '';
			var str_email = $.trim($('#fw_user').val());
			if(type == 'email'){
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if(str_email == '')
				{
					error = 'กรุณาใส่ข้อมูลอีเมลที่ต้องการขอรหัสผ่าน';
				}
				else if(!filter.test(str_email))
				{
					error = 'กรุณาใส่ข้อมูลอีเมลที่ต้องการขอรหัสผ่านให้ถูกต้อง';
				}
				if(error != '')
				{
					$('#error_fw_user').html('<p class="small-txt error-txt">'+error+'</p>');
					checkVal = false;
				}
				else
				{
					checkVal = true;
				}
			}else if(type == 'nickname'){
				if(str_email == '')
				{
					error = 'กรุณาใส่ข้อมูลนามแฝงที่ต้องการขอรหัสผ่าน';
				}
				if(error != '')
				{
					$('#error_fw_user').html('<p class="small-txt error-txt">'+error+'</p>');
					checkVal = false;
				}
				else
				{
					checkVal = true;
				}
			}
			if(checkVal == true)
			{
				$.ajax({
					type: "POST",
					url: '/login/form_fw_check_validation',
					cache: false,
					data :formFW,
					dataType : 'json',
					success: function(result){
						//						console.log(result);
						if(result.chk != 'true')
						{
							if(result.action == 'code_lock')
							{
								formPasscodeIn24('ลืมรหัสผ่าน', result);
							}
							else
							{
								$('#error_fw_user').html('<p class="small-txt error-txt">'+result.text+'</p>');
							}
						}
						else
						{
							/* set data.email เมื่อขอ passcode สำเร็จ */
							$(document.body).data('pc_email', {
								'id':str_email
							});

							// true:mail:code
							var txt = result.mail+','+result.code;
							//console.log($('input:radio[name=fw_type]:checked').val());
							formPasscodeForEmail(txt, $('#fw_user').val(), type, 'ลืมรหัสผ่าน');
						}
					}
				});
			}
		});
	};

	$.loginLBComment.emailCaptcha = function(){ //login ด้วยอีเมลอื่นๆ ต้องมี form captcha
		$(document).on('click', '#login_lb_email_captcha', function(){
			//login_form_lb_email_captcha
			if($('#lb_process').length < 1)
			{
				var lb_ele_div = '<div id="lb_process" class="lightbox-hide"></div>';
				$('.footer').append(lb_ele_div);
			}
			$.ajax({
				type: "POST",
				url: '/login/form_login_email_captcha',
				cache: false,
				success: function(result){
					$('#lb_process')
					.html(result)
					.dialog({
						width: 500,
						title: 'เข้าสู่ระบบ',
						modal: true,
						resizable: false,
						draggable: false,
						close: function(){
							$('#lb_process').remove();
						}
					});
					$('#login_lb_email').focus();
					$('#form_captcha').html('<span class="loading-inline focus-txt oauth-loading">กำลังโหลด Captcha โปรดรอสักครู่</span>');
					$.ajax({
						type: "POST",
						url: '/login/captcha_form',
						cache: false,
						success: function(rs){
							$('#form_captcha').html(rs);
						}
					});
					$('.login_lb_process').remove();
				}
			});

		});
	};

	$.loginLBComment.loginLBcaptchaBtn = function(){ //เช็ค captcha ที่กรอกแล้ว ไปเช็คอีเมลที่กรอก
		trigger_click('#login_lb_email, #captcha_word', '#login_lb_captcha_btn');

		$(document).on('click', '#login_lb_captcha_btn', function(){
			$('.loading-txt').remove();
			$(this).after(' <span class="loading-txt small-txt">กำลังประมวลผล โปรดรอสักครู่..</span>');
			var formD = $('#login_lb_email_other_form').serialize();
			var checkVal = true;
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			var str_email = $.trim($('#login_lb_email').val());
			$('#error_login_email').html('');
			if(str_email == '')
			{
				checkVal = false;
				$('#error_login_email').html('กรุณากรอกอีเมลที่ต้องการ');
				$('.loading-txt').remove();
			}
			else if(!filter.test(str_email))
			{
				checkVal = false;
				$('#error_login_email').html('กรุณากรอกอีเมลที่ต้องการให้ถูกต้อง');
				$('.loading-txt').remove();
			}

			if(checkVal == true)
			{
				$.ajax({
					type: "POST",
					url: "/login/action_email_other",
					cache: false,
					data :formD,
					dataType : 'json',
					success : function(result){
						$('.loading-txt').remove();
						if(result.chk == 'true')
						{
							$(document.body).data('pc_email', {
								'id':str_email
							});

							if(result.text == 'other')
							{
								// true:mail:code
								var txt = str_email+','+result.code;
								formPasscodeForEmail(txt, str_email, 'email', 'เข้าสู่ระบบ')
							}
							else if(result.text == 'gmail')// yahoo
							{
								//console.log('gmail / hotmail');
								formOauthEmail(result.text, str_email);
							}
							else
							{
								loginEmail(str_email);
							}
						}
						else
						{
							if(result.action == 'code_lock')
							{
								formPasscodeIn24('เข้าสู่ระบบ', result);
							}
							else if(result.action == 'error_ban_email')
							{
								errorMSGform('สมัครสมาชิก', result);
							}
							else
							{
								$('#reload').trigger('click');
								$('#captcha_word').val('');
								$('#notify_error').show().delay(5000).fadeOut('slow');
							}
						}

					}
				});
			}
		});
	};

	$.loginLBComment.captchaReload = function(){
		$(document).on('click', '#reload',function(){
			var currentname = $('#reload').attr('name').split('_');
			var cid = $('#cid').val();
			$.ajax({
				type: "POST",
				url: "/manage_captcha/reload",
				cache: false,
				data: "lang="+currentname[1]+"&cid="+cid,
				success: function(result){
					//alert(result);
					$('#captcha_image').html(result);
				}
			});
		});
	};

	$.loginLBComment.captchaChange = function(){
		$(document).on('click', '#change',function(){
			var currentname = $('#change').attr('name').split('_');
			var lang = 'th';
			var cid = $('#cid').val();
			if (currentname[1] == 'th') {
				lang = 'en';
			}

			$.ajax({
				type: "POST",
				url: "/manage_captcha/change",
				cache: false,
				data: "lang="+lang+"&cid="+cid,
				success: function(result){
					//alert(result);
					$('#form_captcha').html(result);
				}
			});
		});
	};

	
	function closeMe(rs)
	{
		//	console.log(rs.display_avatar);
		//	return false;
		ui_authen();
		display_avatar(rs.display_avatar);
		$('.login_lb_process').remove();
	}

	$.loginLBComment.closeCommentReply = function(){

	};

	$.loginLBComment.checkLoginEmailUser = function(){
		trigger_click('#member_password', '#user_login_email_btn');
		$(document).on('click', '#user_login_email_btn', function(){
			$('.loading-txt').remove();
			$(this).after(' <span class="loading-txt small-txt">กำลังประมวลผล โปรดรอสักครู่..</span>');
			
			if($('#member_password').val().length < 1)
			{ 
				$('#login_error').html('กรุณากรอกข้อมูลที่ช่อง รหัสผ่าน');
				$('#member_password').focus();
				$('.loading-txt').remove();
				return false;
			}
			else
			{
				$.ajax({
					url : '/login/ajax_authen',
					type : 'POST',
					data : $('#login_lb_form').serialize(),
					dataType: 'json',
					timeout : 15000,
					error : function(jqXHR,exception,err){

						$.errorNotice.dialog(err,{
							title : 'แจ้งเตือน'
						});
					},
					success : function(result){
						$('.loading-txt').remove();

						/* case แจ้งเตือนข้อหา */
						if(result.member_notify != undefined && result.member_notify == 1)
						{
							$.errorNotice.dialog(result.error_message,{
								title : 'แจ้งเตือน',
								btn_close:'รับทราบ',
								action : 'member_notify',
								url : '/login/l_acknowledge',
								authen_type : 'lightbox',
								param_id : result.id

							});
							return false;
						}
						else if(result.error == true)
						{
							$.errorNotice.dialog(result.error_message,{
								title : 'แจ้งเตือน'
							});
							return false;
						}	
						
						if(result!= undefined && result.chk == 'true')
						{
							ui_authen();
							/* แสดงรูป avatar */
							display_avatar(result.display_avatar);
							$('.bb-code').focus();
							$('#lb_process').remove();
						}
						else
						{
							
							//$('#login_error').html('กรุณากรอก Password ให้ถูกต้อง');
							$('#login_error').html(result.error_msg);
							$('#member_password').focus();
						}
					}
				});
			}
			
			
		});
	}

	$.loginLBComment.passcodeEmailBtn = function(){
		trigger_click('#pc_code', '#pc_confirm_btn');
		$(document).on('click', '#pc_confirm_btn', function(){
			$('.loading-txt').remove();
			$(this).after(' <span class="loading-txt small-txt">กำลังประมวลผล โปรดรอสักครู่..</span>');
			var checkVal = true;
			var pcCode = $.trim($('#pc_code').val());
			$('#error_passcode').html('');
			var  intRegex =  /^\d{6}$/; //^[0-9]{6}$/;// /^\d{6}$/ เลข passcode 6 ตัว
			if(!intRegex.test(pcCode))
			{
				$('#error_passcode').html('กรอกตัวเลขรหัส Passcode ให้ถูกต้อง');
				checkVal = false;
				$('.loading-txt').remove();
				return false;
			}
			if(checkVal == true)
			{
				/* set เข้า .data */
				var before = $(document.body).data('pc_email');
				var after = $.extend({},before,{
					'code':$('#pc_code').val()
				});
				$(document.body).data('pc_email',after);
				//console.log($(document.body).data('pc_email'));
				$(document.body).data('oauth_login',{
					'email': $(document.body).data('pc_email').id,
					'type':'other'
				});
				$.ajax({
					type: "POST",
					url: "/login/form_passcode_check_validation",
					cache: false,
					data :{
						pc: $(document.body).data('pc_email')
					},
					dataType: 'json',
					success : function(result){
						$('.loading-txt').remove();
						if(result.chk == 'false')
						{
							if(result.action == 'code_lock')
							{
								formPasscodeIn24('เข้าสู่ระบบ', result);
							}
							else
							{
								$('#error_passcode').html(result.text);
							}
						}
						else
						{
							//ตั้งรหัสผ่านใหม่
							formSetNewPwd();
						}
					}
				});
			}
		});

		$(document).on('click', '#pc_close_btn', function(){
			// form lightbox ของ fromPasscodeIn24 close_lightbox
			$('#lb_process').remove();
		});
	}

	
	function formPasscodeForEmail(value, inputUser, type, title)
	{
		var ajax_Sending = $.loginLBComment.defaults.ajax_sending;
		var pvalue = value;
		var pinputUser = inputUser;
		var ptype = type;
		var ptitle = title;
		if($('#lb_process').length < 1)
		{
			var lb_ele_div = '<div id="lb_process" class="lightbox-hide"></div>';
			$('.footer').append(lb_ele_div);
		}
		// เรียก form Passcode
		$.ajax({
			type: "POST",
			url: '/login/form_passcode',
			cache: false,
			data :'code='+pvalue,
			success: function(result){
				$('#lb_process')
				.html(result)
				.dialog({
					width: 520,
					title: ptitle,
					modal: true,
					resizable: false,
					draggable: false,
					close: function(){
						$('#lb_process').remove();
					}
				});
				$('#pc_code').focus();
				$('.login_lb_process').remove();
			}
		});
	}

	
	function formOauthEmail(strType, strEmail)
	{
		var email = strEmail;
		var type = strType.toUpperCase();
		var tagA = '';
		if(strType == 'gmail')
		{
			tagA = '<a class="button normal-butt" id="gm_authen" href="javascript:void(0);"><span><em>ดำเนินการต่อ</em></span></a><script type="text/javascript" src="https://apis.google.com/js/client.js"></script>';
		}
		else if(strType == 'hotmail')
		{
			tagA = '<a class="button normal-butt" id="ht_authen" href="javascript:void(0);"><span><em>ดำเนินการต่อ</em></span></a><script type="text/javascript" src="https://apis.google.com/js/client.js"></script>';
		}
		$('.login_lb_process').remove();

		var lb_ele_div = '<div class="login_lb_process lightbox-hide"></div>';
		var detail = '<div id="div_authorize"><div class="input-line"><p class="small-txt">พบว่าอีเมลของคุณเป็นบริการจาก <b>'+type+'</b>, คุณจึงสามารถเข้าสู่เว็บพันทิปผ่านการ Login จากผู้ให้บริการอีเมลได้เลย</p></div><div class="input-line"><p>'+tagA+'</p></div></div>';
		$('.footer').append(lb_ele_div);
		$('.login_lb_process')
		.html(detail)
		.dialog({
			width: 500,
			title: 'Oauth Login',
			modal: true,
			resizable: false,
			draggable: false,
			close: function(){
				$('.login_lb_process').remove();
			}
		});
		$('#lb_process').remove();
	}

	
	function loginEmail(email)
	{
		var ptitle = 'เข้าสู่ระบบ';
		var pemail = email;
		if($('#lb_process').length < 1)
		{
			var lb_ele_div = '<div id="lb_process" class="lightbox-hide"></div>';
			$('.footer').append(lb_ele_div);
		}
		// เรียก form login
		$.ajax({
			type: "POST",
			url: '/login/form_login_email_system',
			cache: false,
			data: 'email='+pemail,
			success: function(result){
				$('#lb_process')
				.html(result)
				.dialog({
					width: 500,
					title: ptitle,
					modal: true,
					resizable: false,
					draggable: false,
					close: function(){
						$('#lb_process').remove();
					}
				});
				$('#member_password').focus();
				$('.login_lb_process').remove();
			}
		});

	}

	
	function formPasscodeIn24(title, result)
	{
		var ptitle = title;
		var detail = '<div class="input-line"><p class="small-txt">'+result.text+'</p></div><div class="input-line"><p><a href="javascript:void(0);" id="pc_close_btn" class="button normal-butt" tabindex="1" ><span><em>ปิดหน้าต่าง</em></span></a></p></div>';
		if($('#lb_process').length < 1)
		{
			var lb_ele_div = '<div id="lb_process" class="lightbox-hide"></div>';
			$('.footer').append(lb_ele_div);
		}
		// เรียก form Passcode
		$('#lb_process')
		.html(detail)
		.dialog({
			width: 500,
			title: ptitle,
			modal: true,
			resizable: false,
			draggable: false,
			close: function(){
				$('#lb_process').remove();
			}
		});
		$('.login_lb_process').remove();
	}
	
	
	function errorMSGform(title, result)
	{
		var ptitle = title;
		var detail = '<div class="input-line"><p class="small-txt">'+result.text+'</p></div><div class="input-line"><p><a href="javascript:void(0);" id="pc_close_btn" class="button normal-butt" tabindex="1" ><span><em>ปิดหน้าต่าง</em></span></a></p></div>';
		if($('#lb_process').length < 1)
		{
			var lb_ele_div = '<div id="lb_process" class="lightbox-hide"></div>';
			$('.footer').append(lb_ele_div);
		}
		// เรียก form Passcode
		$('#lb_process')
		.html(detail)
		.dialog({
			width: 500,
			title: ptitle,
			modal: true,
			resizable: false,
			draggable: false,
			close: function(){
				$('#lb_process').remove();
			}
		});
		$('.login_lb_process').remove();
	}

	
	function formSetNewPwd()
	{
		//ตั้งรหัสผ่าน
		var lb_oauth_div = '<div id="oauth_lb_process" class="lightbox-hide"></div>';
		$('.footer').append(lb_oauth_div);

		$.ajax({
			type: "POST",
			url: '/login/authen_set_pwd',
			cache: false,
			success: function(result){
				$('#oauth_lb_process')
				.html(result)
				.dialog({
					width: 500,
					title: 'กำหนดรหัสผ่านใหม่',
					modal: true,
					resizable: false,
					draggable: false,
					close: function()
					{
						$('#oauth_lb_process').remove();
					}
				});
				$('#user_pwd_btn').attr('id', 'oauth_pwd_btn');
				$('#member_password').focus();
				$('#member_password').passwordStrength({
					targetDiv: '#iSM',
					classes : Array('weak','medium','strong')
				});
				$('#member_password').disallowThai();
				$('#lb_process').remove();
			}
		});
	}

	$.loginLBComment.defaults = {
		sess_user : false,
		ajax_sending : false
	}

	$.oauthGoogle = {};

	$.oauthGoogle.authen = function()
	{

		$(document).on('click', '#gm_authen', function(){
			handleGoogleClientLoad();
		});
	}


	//	var clientIdGoogle = '546046143998';
	//	var apiKeyGoogle = 'AIzaSyD6PMl4JEOtFhdM7oehNG_ZM_adajy5yJ0';
	var clientIdGoogle = '152470619813';
	var apiKeyGoogle = 'AIzaSyAN4v6JwDdORBCpaRSFyk38ZH72LGaUh1E';
	var scopesGoogle = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

	function handleGoogleClientLoad() {
		gapi.client.setApiKey(apiKeyGoogle);
		gapi.auth.authorize({
			client_id: clientIdGoogle,
			scope: scopesGoogle,
			immediate: false
		}, makeGoogleApiCall);
	}

	// Load the API and make an API call.  Display the results on the screen.
	function makeGoogleApiCall() {

		gapi.client.load('oauth2', 'v2', function() {

			var request = gapi.client.oauth2.userinfo.get({

				});
			request.execute(function(resp) {

				if(! resp.error)
				{
					if(!resp.link)
					{
						resp.link = '';
					}
					/* Dot Data Google */
					$(document.body).data('oauth_login',{
						'id' : resp.id,
						'email' : resp.email,
						'link' : resp.link,
						'type' : 'google'
					});
					checkOauthAccount($(document.body).data('oauth_login'));
				}
			});
		});
	}

	// เช็คว่าเป็นสมาชิกรึยัง
	function checkOauthAccount(data)
	{

		$.ajax({
			type: "POST",
			url : '/login/check_is_member',
			data : {
				v:data
			},
			timeout : 15000,
			error : function(jqXHR,exception,err){

				$.errorNotice.dialog(err,{
					title : 'แจ้งเตือน'
				});
			},
			success : function(rs){
				
				if(rs == "false")
				{
					$.errorNotice.dialog('ขออภัย Email นี้ไม่สามารถสมาชิกเว็บพันทิปได้ครับ',{
						title : 'แจ้งเตือน'
					});
					return false;
				}
				
				if(rs == "true")
				{
					$.ajax({
						type: "POST",
						url : '/login/oauth_login',
						dataType : 'json',
						data : {
							v:data
						},
						timeout : 15000,
						error : function(jqXHR,exception,err){

							$.errorNotice.dialog(err,{
								title : 'แจ้งเตือน'
							});
						},
						success : function(rs){
							
							/* case แจ้งเตือนข้อหา */
							if(rs.member_notify != undefined && rs.member_notify == 1)
							{
								$.errorNotice.dialog(rs.error_message,{
									title : 'แจ้งเตือน',
									btn_close:'รับทราบ',
									action : 'member_notify',
									url : '/login/l_acknowledge',
									authen_type : 'oauth',
									param_id : rs.id

								});
								return false;
							}
									
							/* case โดนแบนถาวร */
							if(rs.error == true)
							{
								$.errorNotice.dialog(rs.error_message,{
									title : 'แจ้งเตือน'
								});
								return false;
							}	
							
							if(rs.ck == 'true')
							{
								/* แสดง bar bbcode และ ปุ่ม preview */
								ui_authen();
								/* แสดงรูป avatar */
								display_avatar(rs.display_avatar);
								$('.login_lb_process').remove();
							}
						}
					});
				}
				else
				{
					$('.oauth_loading').remove();
					$('.login_lb_process').remove();
					var lb_oauth_div = '<div id="oauth_lb_process" class="lightbox-hide"></div>';
					$('.footer').append(lb_oauth_div);

					$('#oauth_lb_process')
					.html(rs)
					.dialog({
						width: 500,
						title: 'กำหนดรหัสผ่านใหม่',
						modal: true,
						resizable: false,
						dragable: false,
						close: function()
						{
							$('#oauth_lb_process').remove();
						}
					});
					$('#user_pwd_btn').attr('id', 'oauth_pwd_btn');
					$('#member_password').focus();
					$('#member_password').passwordStrength({
						targetDiv: '#iSM',
						classes : Array('weak','medium','strong')
					});
					$('#member_password').disallowThai();
				}
				
				return false;
			}
		});
	}

	/* End Function Google Oauth*/

	$.oauthSetPwd = {};

	// เซ็ต password
	$.oauthSetPwd.confirm = function()
	{
		trigger_click('#member_password', '#oauth_pwd_btn');

		$(document).on('click', '#oauth_pwd_btn', function(){
			//			if(ajaxSend == false)
			//			{
			//				ajaxSend = true;
			$('.loading-txt').remove();
			$(this).after(' <span class="loading-txt small-txt">กำลังประมวลผล โปรดรอสักครู่..</span>');
			if($.trim($('#member_password').val()).length < 6)
			{
				$('.oauth-loading').remove();
				$('#pwd-error').html('กรุณากำหนดรหัสผ่านใหม่อย่างน้อย 6 ตัวอักษร');
				$('#member_password').focus();
				$('.loading-txt').remove();
			}
			else
			{

				var before = $(document.body).data('oauth_login');
				var after = $.extend({},before,{
					'crypted_password':$('#member_password').val()
				});
				$(document.body).data('oauth_login',after);

				$('#pwd-error').html('');
				$.ajax({
					type: "POST",
					url : '/login/set_oauth_pwd',
					dataType : 'json',
					data : {
						v:$(document.body).data('oauth_login')
					},
					success : function(rs){
						$('.loading-txt').remove();
						if(rs.pwd_success != undefined  && rs.pwd_success == 0)
						{
							$('#pwd-error').html('กรุณากรอกรหัสผ่านมากกว่า 6 ตัวอักษร!!');
							$('#member_password').focus();
						}

						if(rs.create_success != undefined && rs.create_success == 1)
						{
							/* แสดง bar bbcode และ ปุ่ม preview */
							ui_authen();
							/* แสดงรูป avatar */
							display_avatar(rs.display_avatar);
							$('.oauth_loading').remove();
							$('#oauth_lb_process').remove();
						}
					}
				});
			}
		});
	}

	function signInUserWl() {
		WL.login({
			scope: "wl.basic, wl.emails"
		});
	}

	// after hotmail oauth complete.
	function onHotmailLogin() {
		var session = WL.getSession();
		if (session) {
			getHotmailUser(session);
		}
	}

	// get Data from hotmail oauth
	function getHotmailUser() {
		//		var strGreeting = "";
		WL.api(
		{
			path: "me",
			method: "GET"
		},
		function (resp) {
			if (!resp.error) {

				WL.logout();

				$(document.body).data('oauth_login',{
					'id' : resp.id,
					'email' : resp.emails.preferred,
					'link' : resp.link,
					'type' : 'hotmail'
				});

				checkOauthAccount($(document.body).data('oauth_login'));
			}
		});
	}


	function trigger_click(input, selector)
	{

		$(document).on('keydown', input, function(e){
			if(e.which == 13)
			{
				$(selector).trigger('click');
				return false;
			}
		});
	}

	/* End Oauth Hotmail*/

	/* Emotion */
	$.emotion.listen = function (){
		resp_queue = true;
		
		$(document).on('click','.display-post-emotion', function(event){
			event.preventDefault();
			
			var emo_user = $(this).parents('.display-post-story-footer ').find('.emotion-vote-user').is(':hidden');
			if (emo_user)
			{
				$(this).parents('.display-post-story-footer ').find('.emotion-vote-list').slideToggle('fast');
			}
			else
			{
				$(this).parents('.display-post-story-footer ').find('.emotion-vote-choice').slideToggle('fast');
			}
			
		});

		// when click topic emotion icon
		$('body').on('click', '.emotion-choice-icon', function(){
			if(resp_queue)
			{
				$.emotion.pointer = $(this);
				express_emotion($(this));
			}
		});
	}

	function express_emotion(pointer)
	{	
		// pointer ที่มีค่าของ login , display_avatar เฉพาะตอน check_login ด้วย lightbox_login เท่านั้น
		if(pointer.chk == 'true')
		{
			ui_authen();
			display_avatar(pointer.display_avatar);
		}
		
		// สำหรับการ callback กลับมา function นี้ตัว pointer จะเปลี่ยนค่า
		pointer = $.emotion.pointer;

		resp_queue = false;
		// split class for emotion
		var emo = pointer.attr("class").split(' ')[2];
		var topic_id = location.pathname.split("/")[2];
		// split id for type and id 
		var arr = pointer.parents(".display-post-wrapper").attr("id").split('-');
		var type = arr[0];
		var id = arr[1];
		var check_type = '';
		
		// constant array table
		var type_list = ['topic', 'comment','reply', 'bestanswer', 'topcomment', 'expertcomment']
		var emotion_list = ['emo-01', 'emo-02', 'emo-03', 'emo-04', 'emo-05', 'emo-06'];
		var emotion = ['like', 'laugh', 'love', 'impress', 'scary', 'surprised'];
		// simple check
		var emo_p = $.inArray(emo, emotion_list);
		var type_p = $.inArray(type, type_list);
		var send = "";
		// simple check all value is valid
		if((emo_p != -1) && (id % 1 == 0) && (type_p != -1))
		{	
			// trans type
			if((type == 'bestanswer') || (type == 'topcomment') || (type == "expertcomment"))
			{
				check_type = type;
				type = 'comment';
			}
			// prepare sending data
			emo = emotion[emo_p];
			send = 'id='+id+'&emo='+emo+'&type='+type+'&topic_id='+topic_id;

			let redirectData = {
				topicId: topic_id,
				commentNo: null,
				replyNo: null
			};
			if (type == 'comment') {
				redirectData.commentNo = pointer[0].closest('.display-post-status-leftside').querySelector('.display-post-number').getAttribute('id').replace('comment', '');
			} else if (type == 'reply') {
				var data_rp = pointer.parents(".display-post-wrapper").attr("data-rp").split('_');
				var rid = data_rp[0];
				//var id = data_rp[1];
				var no = data_rp[2];
				var comment_no = pointer.parents('.display-post-status-leftside').find('.display-post-number').attr('id').split("-")[0].replace('comment','');
				send = 'id='+id+'&rid='+rid+'&no='+no+'&emo='+emo+'&type='+type+'&topic_id='+topic_id+'&comment_no='+comment_no;

				redirectData.commentNo = comment_no;
				redirectData.replyNo = no;
			}
			

			$.ajax({
				type : 'POST',
				url: "/forum/topic/express_emotion",
				data : send,
				cache: false,
				dataType: 'json',
				success: function(data){
					resp_queue = true;
					if(data.status == 'ok')
					{
						$.ajax({
							type : 'POST',
							url: "/forum/topic/get_emotion_data",
							data : data.emotion,
							cache: false,
							async : false,
							dataType: 'json',
							success: function(data){
								// render to self
								// render to template
								$.templates("emotionsum", {
									markup: "#emo-sum-tmpl",
									allowCode: true
								});
								/* render ตัวเลขของ comment ปกติ */
								pointer.parents(".display-post-story-footer").find('.display-post-emotion').html($.render.emotionsum({
									sum:data.emotion.sum
								}));

								$.templates("emotion", {
									markup: "#emotion-tmpl",
									allowCode: true
								});
								/* render  emotion comment ปกติ */
								data.emotion.choice = true;
								pointer.parents(".emotion-vote-list").html($.render.emotion( data.emotion ));	
								if(type == 'comment')
								{
									var topcomment = $('#topcomment-'+id);
									var bestanswer = $('#bestanswer-'+id);
									var expertcomment = $('#expertcomment-'+id);
									var comment = $('#comment-'+id);
									if((topcomment.length) && (check_type != 'topcomment'))
									{ 
										// render to template
										$.templates("emotionsum", {
											markup: "#emo-sum-tmpl",
											allowCode: true
										});
										/* render ตัวเลขของ comment topcomment */

										topcomment.find('.display-post-emotion').html($.render.emotionsum({
											sum:data.emotion.sum
										}));
										$.templates("emotion", {
											markup: "#emotion-tmpl",
											allowCode: true
										});
										/* render  emotion comment topcomment */
										data.emotion.choice = topcomment.find(".emotion-vote-choice").is(":visible");
										topcomment.find(".emotion-vote-list").html($.render.emotion( data.emotion ));
										if(data.emotion.sum)
										{
											topcomment.find(".emotion-vote-list").show();
										}
										else
										{
											topcomment.find(".emotion-vote-list").hide();
										}
									}
									if((bestanswer.length) && (check_type != 'bestanswer'))
									{
										// render to template
										$.templates("emotionsum", {
											markup: "#emo-sum-tmpl",
											allowCode: true
										});
										/* render ตัวเลขของ comment bestanswer */

										bestanswer.find('.display-post-emotion').html($.render.emotionsum({
											sum:data.emotion.sum
										}));

										$.templates("emotion", {
											markup: "#emotion-tmpl",
											allowCode: true
										});
										/* render  emotion comment bestanswer */
										data.emotion.choice = bestanswer.find(".emotion-vote-choice").is(":visible");
										bestanswer.find(".emotion-vote-list").html($.render.emotion( data.emotion ));
										if(data.emotion.sum)
										{
											bestanswer.find(".emotion-vote-list").show();
										}
										else
										{
											bestanswer.find(".emotion-vote-list").hide();
										}
									}
									if((expertcomment.length) && (check_type != 'expertcomment'))
									{
										$.templates("emotionsum", {
											markup: "#emo-sum-tmpl",
											allowCode: true
										});
										expertcomment.find('.display-post-emotion').html($.render.emotionsum({
											sum:data.emotion.sum
										}));

										$.templates("emotion", {
											markup: "#emotion-tmpl",
											allowCode: true
										});
										data.emotion.choice = expertcomment.find(".emotion-vote-choice").is(":visible");
										expertcomment.find(".emotion-vote-list").html($.render.emotion( data.emotion ));
										if(data.emotion.sum)
										{
											expertcomment.find(".emotion-vote-list").show();
										}
										else
										{
											expertcomment.find(".emotion-vote-list").hide();
										}
									}
									if((comment.length) && ((check_type == 'bestanswer') || (check_type == 'topcomment') || (check_type == 'expertcomment')))
									{   
										// render to template
										$.templates("emotionsum", {
											markup: "#emo-sum-tmpl",
											allowCode: true
										});
										/* render ตัวเลขของ comment ปกติ */
										comment.find('.display-post-emotion').html($.render.emotionsum({
											sum:data.emotion.sum
										}));
								
										$.templates("emotion", {
											markup: "#emotion-tmpl",
											allowCode: true
										});
										/* render  emotion comment ปกติ */
										data.emotion.choice = comment.find(".emotion-vote-choice").is(":visible");
										comment.find(".emotion-vote-list").html($.render.emotion( data.emotion ));
									}
								}
							}	
						});
			
						
					}
					else if (data.message == 'notlogin')
					{
						// not login
						ajaxSending = false;
						let returnUrl = '/topic/' + redirectData.topicId;
						if (redirectData.commentNo !== null) {
							returnUrl += '/comment' + redirectData.commentNo;
							if (redirectData.replyNo !== null) {
								returnUrl += '-' + redirectData.replyNo;
							}
						}
						requireLogin(returnUrl);
					}
					else
					{
						// error case
						//console.log(data);
						/* case แจ้งเตือนข้อหา */
						if(data.member_notify == 1)
						{
							$.errorNotice.dialog(data.error_message,{
								title : 'แจ้งเตือน',
								btn_close:'รับทราบ',
								action : 'member_notify',
								url : '/login/l_acknowledge',
								validation_user : true,
								param_id : data.id

							});
							return false;
						}

						$.errorNotice.dialog(data.error_message,{
							title : 'แจ้งเตือน'
						});
						return false;
					}
				}
			});
		}
	}
	
	// Polls
	$.poll.vote = function (){
		$(document).on('click', '#no_vote_poll', function(){ 
			$('#lb_poll_div').remove();
		});
		
		$(document).on('click', '#btn_vote', function(){ 
			//		alert(document.domain);return false;
			var required_answer = $(this).parents('.display-post-story').find('.required-answer-poll').length;
			var arr_answer = new Array();
			var required = true;
			var cnt = 0;
			var data = new Array();
			var que = '';
			var type = '';
			var not_warnning = true;
		
			$('.callback-status').css('display', 'none'); // set ให้ div คุณลืมตอบคำถามที่ *จำเป็นต้องตอบ ซ่อนไว้
		
			var pathArray = window.location.pathname.split( '/' );
			var topic = pathArray[2];
			//var topic = pathArray[4];
			var choice_json = {};
		
			var topic_type = $('.display-post-wrapper.main-post').attr('id');
			//		console.log(topic_type);return false;
			var split_topic = topic_type.split('_');
			
			$(document.body).data('polls_result',
			{
				'topic_id': topic
			//				,'topic_type': split_topic[1]
			});
			
			$('.q-poll').each(function(index) {
				var cls = $(this).attr('class');
				var patt = /qtype_[0-9]+/gi;
				var id = $(this).attr('id');
				var que = id.split("_");
				var qtype = new String(cls.match(patt));
				var type = qtype.split("_");
	
				choice_json['vote'] = {};
				// อ่าน .data ทั้งหมดออกมาจาก body
				var before = $(document.body).data('polls_result');
				// รวม JSON เข้ากับ .data ทั้งหมดที่อ่านได้
				var after = $.extend({},before,choice_json);
				// เก็บ .data คืนไปไว้ใน body
				$(document.body).data('polls_result',after);
			
				if (required_answer == 1)
				{
					if($(this).find('.required-mark').length == 1)
					{
						required = check_required($(this), cls.match(patt));
						if(required == false)
						{
							$('.callback-status')
							.css('display', '')
							.html('คุณลืมตอบคำถามที่ <strong>*จำเป็นต้องตอบ</strong>');
						
							not_warnning = false;
							return false;
						}
					}
				}
			
				data[index] = check_count_answer($(this), cls.match(patt), que[1], type[1]);
			
				cnt = parseInt(data[index]['cnt'])+cnt;
			});
			//	console.log(data);return false;
			if(cnt == 0 && required_answer == 0)
			{
				$('.callback-status')
				.css('display', '')
				.html('กรุณาตอบคำถามอย่างน้อย 1 ข้อ');
				not_warnning = false;
				return false;
			}
			else
			{
				choice_json['vote'] = new Array();
			
				for(var i in data)
				{
					//console.log(data[i]['cnt']);
					choice_json['vote'][i] = set_json_polls(data[i], i);
				}
			}
		
			// อ่าน .data ทั้งหมดออกมาจาก body
			var before = $(document.body).data('polls_result');
			//console.log(before);
			// รวม JSON เข้ากับ .data ทั้งหมดที่อ่านได้
			var after = $.extend({},before,choice_json);
			// เก็บ .data คืนไปไว้ใน body
			$(document.body).data('polls_result',after);
	
			if(not_warnning == true)
			{
				add_polls_result();
			}
		
		});
	}

	function add_polls_result()
	{
		lightBoxProcess();
		var topic_id = $.data(document.body).polls_result.topic_id;

		var topic = {};
		topic['id'] = topic_id;
		$.ajax({
			type : 'POST',
			url : '/forum/topic/check_permission_vote_poll',
			dataType : 'json',
			data : topic,
			success : function(rs_permission){  //console.log(rs_permission);return false;
				if(rs_permission.result == 'false')
				{
					$('#lightbox_save').remove();
					if(rs_permission.err_msg != null)
					{
						var txt = '<p>'+rs_permission.err_msg+'</p>'
						+ '<div class="button-container">'
						+ '<a href="javascript:void(0);" id="no_vote_poll" class="button normal-butt"><span><em>ตกลง</em></span></a> '
						+ '</div>';
						var lb_poll_div = '<div id="lb_poll_div" class="lightbox-hide"></div>';
						$('.footer').append(lb_poll_div);
						$('#lb_poll_div')
						.addClass('dialog-fullheight')
						.dialog({
							width: 500,
							title: 'ไม่สามารถตอบโพลนี้ได้',
							modal: true,
							resizable: false,
							draggable: false,
							close: function()
							{
								$('#lb_poll_div').remove();
							}
						})
						.html(txt);
					}
					
					return false;
				}
				else
				{ 
					$.ajax({
						type: "POST",
						url : "/forum/topic/add_polls_result",
						dataType : 'json',
						async: false,
						data: {
							result: $.data(document.body).polls_result
						},
						timeout : 15000,
						error : function(jqXHR,exception,err){

							$.errorNotice.dialog(err,{
								title : 'แจ้งเตือน',
								btn_close:'ดำเนินการต่อ'
							});
						},
						success : function(rs){

							validation_error(rs);
							if(rs.status == 'success')
							{
								//alert(rs);
								//var val = rs.toString();
								//var val = topic;
								$('.preview-now').fadeOut(1000);
								//alert(val+' '+topic);
								var msg = 'ตอบโพลเรียบร้อยแล้ว, <a href="javascript:void(0);" id="go">กลับสู่หน้ากระทู้</a><br/><span class="small-txt">';
								lightboxSave(msg, location.pathname.split("/")[2]);
							}
						}
					});
				}
			}
		});
	}

	function set_json_polls(val, queue, question_id, poll_type)
	{
		var empty = true;
		var choice_json = {};
		choice_json['result'] = {};
		//choice_json['vote'][queue] = {};
		choice_json['question_id'] = {};
		choice_json['poll_type'] = {};
		//choice_json['result'] = {};
		
		//console.log(val);
		for(var i in val) {
			choice_json[i] = {};
			
			if(val[i] != '' || i == 'other')
			{
				choice_json[i] = val[i];
				empty = false;
			}
		}
		
		if(empty == false)
		{
			choice_json['question_id'] = val['question_id'];
			choice_json['poll_type'] = val['poll_type'];
		}
		//console.log(choice_json);
		return choice_json;
		
	}

	function check_count_answer(obj, cls, que, type)
	{
		
		var checked = new Array();
		checked['result'] = new Array();
		
		checked['question_id'] = que;
		checked['poll_type'] = type;
		
		//console.log(cls);
		if(cls == "qtype_6")
		{
			var sel = false;
			var cnt = 0;
			obj.find('.rank-select-rows').each(function(index) {
				//console.log($(this).find('.selectbox').val());
				checked['result'][index] = $(this).find('.selectbox').val();
				if(checked['result'][index] != '')
				{
					cnt = cnt+1;
				}
			});
			checked['cnt'] = cnt;
			return checked;
		}
		else if(cls == "qtype_5")
		{
			
			var grid_rows = obj.find('.grid-radio-rows').length;
			var grid_cols = obj.find('.grid-radio-rows:first').children('.grid-radio-cols').length;
			
			if(grid_rows < 2)
			{
				msgErrorPolls();
				return false;
			}
			
			var cnt = 0;
			obj.find('.grid-radio-rows').each(function(index) {

				if($(this).find('.radio-choice:checked').length > 0)
				{
					var val_checked = $(this).find('.radio-choice:checked').val();
					var split_checked = val_checked.split('_');
					var current_row = index+1;
					if(split_checked.length > 1 && ((split_checked[4] > grid_cols || split_checked[4] <= 0) || split_checked[3] != current_row))
					{
						msgErrorPolls();
						return false;
					}
					checked['result'][index] = val_checked;
					cnt = cnt+1;
				}
				else
				{
					checked['result'][index] = '';
				}
			});
			checked['cnt'] = cnt;
			return checked;
		}
		else if(cls == "qtype_3")
		{
			var cnt_option = obj.find('.selectbox option').length-1; //ตัดอันที่มี value ว่างออก
			var val_selected = obj.find('.selectbox').val();
			var split_selected = val_selected.split('_');
			if(split_selected.length > 1 && split_selected[2] >= cnt_option)
			{
				msgErrorPolls();
				return false;
			}
			checked['result'][0] = val_selected;
			if(checked['result'][0] == '')
			{
				checked['cnt'] = 0;
				return checked;
			}
			else
			{
				checked['cnt'] = 1;
				return checked;
			}
		}
		else if(cls == "qtype_2")
		{
			
			var cnt_radio = obj.find('.checkbox-choice').length;
			var cnt = 1;
			if(obj.find('.checkbox-choice:checked').length > 0)
			{
				obj.find('.checkbox-choice:checked').each(function(index) {
					var split_val = $(this).attr('id').split('_');
					if(split_val[1] == 'other')
					{
						checked['other'] = obj.find('.text.poll-other-text').val();
						checked['result'][index] = $(this).val();
					}
					else
					{
						var split_checked = $(this).val().split('_');
						if(split_checked.length > 1 && split_checked[2] >= cnt_radio)
						{
							msgErrorPolls();
							return false;
						}
						else
						{
							checked['result'][index] = $(this).val();
						}
					}
					
				}); 
			}
			else
			{
				checked['result'][0] = '';
				cnt = 0;
			}
			checked['cnt'] = cnt;
			return checked;
		}
		else if(cls == "qtype_1" || cls == "qtype_4")
		{
			var cnt = 1;
			
			if(obj.find('.radio-choice:checked').length == 0)
			{
				checked['result'][0] = '';
				cnt = 0;
			}
			else
			{
				var cnt_radio = obj.find('.radio-choice').length;
				var val_checked = obj.find('.radio-choice:checked').val();
				var split_checked = val_checked.split('_');
				if(split_checked.length > 1 && split_checked[2] >= cnt_radio)
				{
					msgErrorPolls();
				}
				
				if(cls == "qtype_1")
				{
					var split_val = obj.find('.radio-choice:checked').attr('id').split('_');
					if(split_val[1] == 'other')
					{
						checked['other'] = obj.find('.text.poll-other-text').val();
					}
					checked['result'][0] = obj.find('.radio-choice:checked').val();
					
				}
				else
				{
					checked['result'][0] = val_checked;
				}
			}
			checked['cnt'] = cnt;
			return checked;
		}
	}
	
	function msgErrorPolls()
	{
		alert('รู้นะคิดอะไรอยู่!!!');
		window.location = window.location.href;
	}
	
	function check_required(obj, cls)
	{
		if(cls == "qtype_6")
		{
			var sel = true;
			obj.find('.rank-select-rows').each(function(index) {
				if($(this).find('.selectbox').val() == '')
				{
					sel = false;
					return false;
				}
			});
			return sel;
		}
		else if(cls == "qtype_5")
		{
			var check = true;
			obj.find('.grid-radio-rows').each(function(index) {
				if($(this).find('.radio-choice:checked').length == 0)
				{
					check = false;
					return false;
				}
			});
			return check;
		}
		else if(cls == "qtype_3")
		{
			if(obj.find('.selectbox').val() == '')
			{
				return false;
			}
			return true;
		}
		else
		{
			if(obj.find('.radio-choice:checked, .checkbox:checked').length == 0)
			{
				return false;
			}
			return true;
		}
	}
	
	function lightBoxProcess()
	{
		/* create div */
		$('.content').after('<div class="lightbox-hide remove" id="lightbox_save"></div>');
		/* create light box */
		$('#lightbox_save').dialog({
			width : 238,
			closeOnEscape: false,
			modal: true,
			closeOnEscape : false,
			open: function(event, ui) {
				$(".ui-dialog-titlebar-close,.ui-dialog-titlebar").hide();
				$(this).attr('style','display: block; width: auto; min-height: auto; height: auto;');
			},
			resizable: false,
			draggable: false,
			close: function(){}
		}).append('<div class="dialog-loading-inner"><span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span></div>');
	}

	

	$.poll.editVote = function (){
		$(document).on('click', '#btn_edit_vote', function(){
			var pathArray = window.location.pathname.split( '/' );
			var topic = pathArray[2];
			window.location = 'https://'+window.location.hostname+'/topic/'+topic+'/edit';
		});
	};

	$.poll.resultVote = function (){
		$(document).on('click', '#btn_vote_result', function(){
			var pathArray = window.location.pathname.split( '/' );
			var topic = pathArray[2];
			var url = 'https://'+window.location.hostname+'/topic/'+topic+'/result';
			window.open(url)
		});
	};
	
	$.reportTopic.reportSend = function()
	{
		// เปิด lightbox แจ้งความเรื่องลบกระทู้หรือความคิดเห็นที่ไม่เหมาะสม
		$(document).on('click', '.icon.icon-reportbin', function(){
			var windowHeight = getsize_window();
			var newHeight = 0;
			var margin = 0;
			newHeight = windowHeight-20;
			var cmt = $(this).data('cmt');
			var cmtno = $(this).data('cmtno');
			//var tail = parents.attr('class'); // ยังไม่ได้ใช้ รอ reply 
			var topic_id = $('.display-post-wrapper.main-post.type').attr('id');
			var arr = topic_id.split('topic-');
			var topocid = arr[1];
			var lb_media_div = '<div id="links_lb_process" class="lightbox-hide"></div>';
			$('.footer').append(lb_media_div);
			$.ajax({
				type: 'POST',
				url: '/forum/topic/report_bin',
				data: {
					topocid: topocid,
					cmt: cmt,
					cmtno: cmtno
				},
				success: function(result){
					$('#links_lb_process')
					.addClass('dialog-fullheight')
					.dialog({
						width: 700,
						height: newHeight,
						title: 'แจ้งข้อความไม่เหมาะสม',
						modal: true,
						resizable: false,
						draggable: false,
						close: function()
						{
							$('#links_lb_process').remove();
						}
					})
					.html(result);
				}
			});
		});
	}
	$.reportTopic.reportCancel = function()
	{
		$('#report_cancel').live('click keydown', function(e){
			if(e.shiftKey && e.keyCode == 9)
			{
				return true;
			}
			else if (e.keyCode == 9)
			{
				return false;
			}
			else if (e.keyCode == 16)
			{
				return false;
			}
			$('#links_lb_process').remove();
		});
	};

	$.reportTopic.reportTypeRule = function()
	{
		$(document).on('click', 'input:radio[name=report_type_rule]:checked', function(){
			$('.callback-status').hide();
			if($(this).val() == 'other')
			{
				if(!$('#other_detail').val())
				{
					$('#error_other_detail').html('กรุณาระบุเหตุผลที่ต้องการให้ทีมงานลบข้อความนี้');
					$('#other_detail').focus()
				}
				else
				{
					$('#error_other_detail').html('');
				}
			}
			else
			{
				$('#error_other_detail').html('');
			}
		});
	};

	$.reportTopic.otherDetail = function()
	{
		$(document).on('keyup', '#other_detail', function(){
			var rule = $('input:radio[name=report_type_rule]:checked').val();
			if($(this).val() && rule == 'other')
			{
				$('#error_other_detail').html('');
			}
			else if(!$(this).val() && rule == 'other')
			{
				$('#error_other_detail').html('กรุณาระบุเหตุผลที่ต้องการให้ทีมงานลบข้อความนี้');
			}
		});
	};

	$.reportTopic.reportConfirm = function()
	{
		$(document).on('click', '#report_confirm', function(){
			var checkVal = true;
			$('#error_other_detail').html('');
			$('#error_report_email').html('');
			$('#error_chk_privacy_policy').html('');
			var rule = $('input:radio[name=report_type_rule]:checked').val();
			var chk_policy = $('input:checkbox[name=chk_privacy_policy]:checked').val();
			if(!chk_policy) {
				$('#error_chk_privacy_policy').html('<p class="small-txt error-txt">กรุณาเลือกศึกษาและยอมรับนโยบายข้อมูลส่วนบุคคล</p>');
				checkVal = false;
			}
			else {
				$('#error_chk_privacy_policy').html('');
				if(!$('#other_detail').val() && rule == 'other') {
					$('#error_other_detail').html('<p class="small-txt error-txt">กรุณาระบุเหตุผลที่ต้องการให้ทีมงานลบข้อความนี้</p>');
					$('#other_detail').focus();
					checkVal = false;
				}
				else if($('#report_email').val() == '') {
					$('#error_report_email').html('<p class="small-txt error-txt">กรุณากรอกอีเมล</p>')
					$('#report_email').focus();
					checkVal = false;
				}
				else if(!checkEmail($('#report_email').val())) {
					$('#error_report_email').html('<p class="small-txt error-txt">กรุณากรอกอีเมลให้ถูกต้อง</p>')
					$('#report_email').focus();
					checkVal = false;
				}
				else if(!rule) {
					$('.callback-status')
					.css('display', '')
					.html('กรุณาเลือกเหตุผลที่ต้องการแจ้งด้วยค่ะ');
					checkVal = false;
				}
			}

			if(checkVal == true) {
				var formD = $('#report_form').serialize();
				var arrD = formD.split('&');
				$.ajax({
					type: "POST",
					dataType : 'json',
					url: "/forum/topic/report_data",
					cache: false,
					data :formD,
					success : function(rs){
						if(rs.report_success == 'TRUE')
						{
							$('#links_lb_process').html('ขอบคุณทุกเหตุผล ทางทีมงานจะตรวจสอบและดำเนินการตามความเหมาะสมค่ะ <div class="button-container"><a class="button normal-butt" id="close_report" href="javascript:void(0);"><span><em>ปิดหน้าต่าง</em></span></a></div>');
							$('#close_report').click(function(){
								$('#links_lb_process').remove();
							});
						}
						else if(rs.report_success == 'FALSE')
						{
							$('#links_lb_process').html('มีข้อผิดพลาดเกิดขึ้นทำให้ไม่สามารถเก็บข้อมูลได้ กรุณาใส่ข้อมูลอีกครั้ง <div class="button-container"><a class="button normal-butt" id="close_report" href="javascript:void(0);"><span><em>ปิดหน้าต่าง</em></span></a></div>');
							$('#close_report').click(function(){
								$('#links_lb_process').remove();
							});
						}
					}
				});
			}
		});
	};

	function checkEmail(str_email)
	{
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (!filter.test(str_email))
		{
			return false;
		}
		else
		{
			return true;
		}
	}

	function getsize_window()
	{
		var myWidth = 0, myHeight = 0;
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			myWidth = window.innerWidth;
			myHeight = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			myWidth = document.body.clientWidth;
			myHeight = document.body.clientHeight;
		}
		return myHeight;
	}


	
	var ajax_request_edit_method;
	$.editMethod = {};
	// for cancel button
	$.editMethod.cancel = function()
	{
		$(document).on('click','.cancel-edit-comment',function()
		{
			
			$('.edit-mode').remove();
			$('.preview-mode').remove();
			$('.hide-edit-mode').show();			

			// unset
			$.removeData(document.body,"topic");
			$.removeData(document.body,"detail");
		});
		
	}
	
	$.editMethod.comment = function()
	{
		$(document).on('click','.edit-comment-button',$.editMethod.fire);
	//		$(document).on('click','.edit-comment-button',$.edit_comment.fire);
	}
	$.editMethod.reply = function()
	{
		$(document).on('click','.edit-reply-button',$.editMethod.fire);
	//		$(document).on('click','.edit-reply-button',$.edit_reply.fire);
	}
	$.editMethod.topic = function()
	{
		$(document).on('click','#edit-topic-button',$.edit_topic.fire);
	}
	
	$.editMethod.fire = function()
	{
		if(ajaxSending == true) {
			if (typeof ajax_request_edit_method !== 'undefined') {
				ajax_request_edit_method.abort();
			}
			ajaxSending = false;
		}
		
		var first_comment = false; // สำหรับเช็คว่าเป็น comment แรกของ comment 		
		var edit_form_tmpl; // สำหรับรับค่า template ในการ render ว่าตัวไหนสำหรับ comment/reply
		var form_render; 
		$.editMethod.variable.userData;
		$.editMethod.parentDiv = $(this).parents('.display-post-wrapper');
		// check is comment/reply
		$.editMethod.variable.type_edit = what_type_edit($(this).attr('class'));
		$.editMethod.variable.topic_id = location.pathname.split("/")[2];
		$.editMethod.variable.redirect_no = $(this).parents('.display-post-status-leftside').find('.display-post-number').attr('id').replace('comment','');
		
		if($.editMethod.variable.type_edit == 'reply')
		{
			// prepare reply
			var id_string = $(this).parents('.display-post-wrapper').attr('data-rp').toString()
			
			$.editMethod.variable.comment_no = $(this).parents('.display-post-status-leftside').find('.display-post-number').attr('id').split("-")[0].replace('comment','');
			$.editMethod.variable.cid = id_string.split("_")[0];		
			$.editMethod.variable.rp_id = id_string.split("_")[1];
			$.editMethod.variable.rp_no = id_string.split("_")[2];			
			$.editMethod.textarea_detail_id = '#detail_reply';
			$.extend($.editMethod.variable.sendEdit,{
				'url' : '/forum/topic/edit_reply_preview_and_update'
			});
			//			$.extend($.editMethod.variable.sendEdit, {'url' : '/forum/topic/edit_reply_preview'});
			$.editMethod.variable.url = '/forum/topic/get_reply_info';
			form_render = $('#edit-reply-comment-form-tmpl');
			$.extend($.editMethod.variable.preview,{
				'preview_tmpl' : '#edit-reply-preview-tmpl'
			});
			$.extend($.editMethod.variable.preview,{
				'url' : '/forum/topic/edit_reply_preview'
			});
			$.extend($.editMethod.variable.preview,{
				'sendEditPreviewing' : {
					'dataSend':{},
					'url' :	'/forum/topic/edit_reply_update'
				}
			});			
		}
		else
		{
			// parepare comment
			var autosend = false;
			var $this =  $(this);
			$.editMethod.variable.cid = $(this).parents('.display-post-wrapper').attr('id').toString().split("-")[1];
			$.editMethod.variable.seq =	$.editMethod.parentDiv.prev().attr('name');
			$.editMethod.variable.comment_no =	$(this).parents('.display-post-status-leftside').find('.display-post-number').attr('id').replace('comment','');
					
			if(is_first_comment($.editMethod.parentDiv)){
				first_comment = true;
			}
			$.editMethod.textarea_detail_id = '#detail_comment';
			$.extend($.editMethod.variable.sendEdit,{
				'url' : '/forum/topic/edit_comment_preview_and_update'
			});
			//	$.extend($.editMethod.variable.sendEdit, {'url' : '/forum/topic/edit_comment_preview'});
			$.editMethod.variable.url = '/forum/topic/get_comment_info';
			form_render = $('#edit-comment-form-tmpl');
			$.extend($.editMethod.variable.preview,{
				'preview_tmpl' : '#edit-comment-preview-tmpl'
			});
			$.extend($.editMethod.variable.preview,{
				'url' : '/forum/topic/edit_comment_preview'
			});
			$.extend($.editMethod.variable.preview,{
				'sendEditPreviewing' : {
					'dataSend':{},
					'url' :	'/forum/topic/edit_comment_update'
				}
			});
		}
		
		ajax_request_edit_method = $.post($.editMethod.variable.url,$.editMethod.variable,function(data, textStatus, jqXHR)
		{		
			if(data.error == true)
			{
				//notice error
				$.errorNotice.dialog(data.error_message);
			}
			else
			{
				// reset ทุก Div ที่มีการกด edit mode ไว้ให้พับเก็บให้หมด
				$('.edit-mode').remove();
				$('.preview-mode').remove();
				$('.hide-edit-mode').show();
				//hide div clicked
				$.editMethod.parentDiv.hide().addClass('hide-edit-mode');
				edit_form_tmpl	=	form_render.render(data.item);
				if(first_comment){
					$.extend(data.item,{
						'first' : 'first'
					});
				}
				// put tmpl into div
				$.editMethod.parentDiv.after(edit_form_tmpl);
				$.editMethod.variable.userData = data.item.user;
				$.editMethod.variable.currentUserData = data.item.user_current_status;
				$.editMethod.variable.nicknameIconPermission = data.item.nickname_icon_permission;
				$.editMethod.variable.memberId = data.item.member_id;
				//bb code
				$($.editMethod.textarea_detail_id).bbcode();
				// cal textarea width
				cal_width_equal($this);
			}
		},'JSON');
	}
	
	function get_3_edit_btn(ele)
	{
		// ele clicked by user
		$.extend($.editMethod,{
			element : {
				parent : ele.parents('.button-container')
			}
		});
		$.editMethod.element.btn_3_edit_mode = $.editMethod.element.parent.children('a.button');
	}
	
	function show_loading_msg()
	{
		$.editMethod.element.btn_3_edit_mode.hide();
		$.editMethod.element.parent.children('div.display-checkbox-expert').hide();
		$.editMethod.element.parent
		.children('.display-post-avatar.avatarleft')
		.before('<span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
	}
	
	function show_3_edit_btn()
	{
		$('.loading-inline.focus-txt').remove();
		$.editMethod.element.btn_3_edit_mode.show();
		$.editMethod.element.parent.children('div.display-checkbox-expert').show();
	}
	
	
	$.editMethod.preview = function()
	{
		$(document).on('click','#btn_edit_comment_preview,#btn_edit_reply_preview',function(event,param){
			//get 3 button before change to Loading message
			get_3_edit_btn($(this));
			show_loading_msg();
			var check_expert = checkExpert('sendEdit');
			var userData = $.editMethod.variable.userData;
			//console.log('preview', userData);
			// prepare variable
			$.extend($.editMethod.variable.preview,{
				'dataSend' : {
					'msg' : $($.editMethod.textarea_detail_id).val(),
					'check_expert' : check_expert
				}
			});
			
  
			// send ajax for render bb_codd & cut bad word
			ajax_request_edit_method =  $.ajax({
				url: $.editMethod.variable.preview.url
				,
				data : $.editMethod.variable.preview.dataSend
				,
				dataType : 'JSON'
				,
				type : 'POST'
				,
				timeout : 15000
				,
				success: function(result_preview){
					$.extend(result_preview,{
						'user' : $.editMethod.variable.userData,
						'user_current_status': $.editMethod.variable.currentUserData,
						'nickname_icon_permission': $.editMethod.variable.nicknameIconPermission,
						'member_id': $.editMethod.variable.memberId
					});
					var preview_tmpl	=	$($.editMethod.variable.preview.preview_tmpl).render(result_preview)
					// hide edit mode form
					$('.edit-mode')
					.hide()
					.after(preview_tmpl);
					if(userData['user_meta']['expert'] != undefined)
					{
						$('#btn_edit_comment_from_preview').siblings('div.display-checkbox-expert').addClass('expert-preview');
					}
					$.extend($.editMethod.variable.preview.resultPreview,result_preview);
				}
				,
				error : function(jqXHR, textStatus, errorThrown){
					//					console.log(jqXHR.abort(),textStatus,errorThrown);
					jqXHR.abort();
					show_3_edit_btn();
				}
			});
		});
	}
	
	$.editMethod.previewBackToEdit = function()
	{
		// click edit from preview mode
		$(document).on('click','#btn_edit_comment_from_preview,#btn_edit_reply_from_preview',function(){
			show_3_edit_btn();
			// show form for edit comment/reply
			$('.edit-mode').show();
			// remove preview
			$('.comment-preview').remove();
		});
	}
	
	$.editMethod.previewSendEdit = function()
	{
		$(document).on('click','#btn_edit_comment_send,#btn_edit_reply_send',function(){
			lightBoxProcess();
			// prepare variable
			if($.editMethod.variable.type_edit == 'reply')
			{
				$.extend($.editMethod.variable.preview.sendEditPreviewing.dataSend
					,{
						'cid':$.editMethod.variable.cid,
						'rp_no' : $.editMethod.variable.rp_no,
						'rp_id' : $.editMethod.variable.rp_id,
						'raw'  : $.editMethod.variable.preview.resultPreview.raw,
						'disp' : $.editMethod.variable.preview.resultPreview.disp,
						'topic_id' : $.editMethod.variable.topic_id,
						'comment_no' :  $.editMethod.variable.comment_no
					}
					);
			}
			else if($.editMethod.variable.type_edit == 'comment')
			{
				$.extend($.editMethod.variable.preview.sendEditPreviewing.dataSend,$.editMethod.variable.preview.resultPreview,{
					'cid' : $.editMethod.variable.cid,
					'topic_id' : $.editMethod.variable.topic_id,
					'comment_no' :  $.editMethod.variable.comment_no
				});
			}
						
			ajax_request_edit_commnet =  $.ajax({
				url: $.editMethod.variable.preview.sendEditPreviewing.url
				,
				data : $.editMethod.variable.preview.sendEditPreviewing.dataSend
				,
				dataType : 'JSON'
				,
				type : 'POST'
				,
				timeout : 15000
				,
				success: function(result_update){
					
					validation_error(result_update);
					
					if(result_update.success == true)
					{
						$('.preview-now').fadeOut(1000);	
						/*api_push_call(result_update,function(){
							var msg = 'บันทึกการเปลี่ยนแปลงสำเร็จแล้ว <br/><a href="javascript:void(0);" id="go">กลับสู่หน้ากระทู้</a><br/><span class="small-txt">';
							lightboxSave(msg,$.editMethod.variable.topic_id,$.editMethod.variable.redirect_no);	
						});	*/					
						var msg = 'บันทึกการเปลี่ยนแปลงสำเร็จแล้ว <br/><a href="javascript:void(0);" id="go">กลับสู่หน้ากระทู้</a><br/><span class="small-txt">';
							lightboxSave(msg,$.editMethod.variable.topic_id,$.editMethod.variable.redirect_no);	
					}
				}
				,
				error : function(jqXHR, textStatus, errorThrown){
					//					console.log(jqXHR.abort(),textStatus,errorThrown);
					jqXHR.abort();
					var msg = 'มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง';
					$.errorNotice.dialog(msg,{
						title : 'แจ้งเตือน',
						btn_close:'ดำเนินการต่อ'
					});
				}
			});
		});
	}
	
	$.editMethod.sendEdit = function()
	{
		$(document).on('click','#btn_edit_comment_send_before_preview,#btn_edit_reply_send_before_preview',function(){
			/* ตรวจค่า expert */
			var expert = checkExpert("sendEdit");
			$.editMethod.variable.expert = expert;
			lightBoxProcess();
			if($.editMethod.variable.type_edit == 'reply')
			{
				$.extend($.editMethod.variable.sendEdit,{
					'dataSend' : {
						'raw' : $($.editMethod.textarea_detail_id).val(),
						'cid':$.editMethod.variable.cid ,
						'rp_no' : $.editMethod.variable.rp_no,
						'rp_id' : $.editMethod.variable.rp_id,
						'topic_id' :$.editMethod.variable.topic_id,
						'comment_no' :$.editMethod.variable.comment_no
					}
				});
			}
			else if($.editMethod.variable.type_edit == 'comment')
			{
				$.extend($.editMethod.variable.sendEdit,{
					'dataSend' : {
						'raw' : $($.editMethod.textarea_detail_id).val(),
						'cid':$.editMethod.variable.cid,
						'topic_id' :$.editMethod.variable.topic_id,
						'comment_no' :$.editMethod.variable.comment_no,
						'expert': $.editMethod.variable.expert
					}
				});
			}
			
			//console.log($.editMethod.variable.sendEdit.dataSend);
			
			ajax_request_edit_method =  $.ajax({
				url: $.editMethod.variable.sendEdit.url
				,
				data : $.editMethod.variable.sendEdit.dataSend
				,
				dataType : 'json'
				,
				type : 'post'
				,
				timeout : 15000
				,
				success: function(result_update){
					validation_error(result_update);
					
					if(result_update.success == true)
					{						
						$('.preview-now').fadeOut(1000);						
						/*api_push_call(result_update,function(){
							var msg = 'บันทึกการเปลี่ยนแปลงสำเร็จแล้ว <br/><a href="javascript:void(0);" id="go">กลับสู่หน้ากระทู้</a><br/><span class="small-txt">';
							lightboxSave(msg,$.editMethod.variable.topic_id,$.editMethod.variable.redirect_no);	
						});	*/
						var msg = 'บันทึกการเปลี่ยนแปลงสำเร็จแล้ว <br/><a href="javascript:void(0);" id="go">กลับสู่หน้ากระทู้</a><br/><span class="small-txt">';
							lightboxSave(msg,$.editMethod.variable.topic_id,$.editMethod.variable.redirect_no);	
					}
				}
				,
				error : function(jqXHR, textStatus, errorThrown){
					//					console.log(jqXHR.abort(),textStatus,errorThrown);
					jqXHR.abort();
					var msg = 'มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง';
					$.errorNotice.dialog(msg,{
						title : 'แจ้งเตือน',
						btn_close:'ดำเนินการต่อ'
					});
				}
			}); // end ajax request
		});
	}
	function what_type_edit(id)
	{
		if(id.search('edit-reply-button') >= 0)
		{
			return 'reply';
		}
		return 'comment';
	}
	
	
	
	$.edit_topic = {};
	
	
	$.edit_topic.fire = function()
	{
		if(ajaxSending == true)
		{
			if (typeof ajax_request_edit_topic !== 'undefined') {
				ajax_request_edit_topic.abort();
			}
			ajaxSending = false;
		}
		
		
		ajax_request_edit_topic =  $.post($.edit_topic.variable.url,$.edit_topic.variable,function(data, textStatus, jqXHR){
					
			if(data.error == true)
			{
				//notice error
				$.errorNotice.dialog(data.error_message);
			}
			else
			{
				var editTopic = document.getElementById('topic-edit-form');
				if (editTopic !== null) {
					$('#topic-edit-form').remove();
				}

				var without_cancel_btn = false;
				var create_html = '<div id="topic-edit-form"></div>';
				var config_preview	=	{
					type_topic : data.item.topic_type,
					url : '/forum/new_topic/preview',
					show_btn_preview : true
				};
				// ซ่อนเนื้อหาที่แสดงและใส่ div ที่จะเป็น form
				$('.display-post-wrapper.main-post').hide().addClass('hide-edit-mode').after(create_html);
					
				var select_template = $('#edit-topic-form-template');
				
				// ถ้าเกิน 1 hr. แสดงอีกอัน
				if(data.item.over == true)
				{
					without_cancel_btn = true;
					select_template = $('#edit-topic-form-over-template');
					config_preview	=	{
						type_topic :  data.item.topic_type,
						url : '/forum/new_topic/preview'
					};
				}
				
				// check topic_status == 4 ? can edit tags anytime
				if(data.item.topic_status == 4)
				{
					without_cancel_btn = false;
					select_template = $('#edit-topic-form-template');
				}
				
				$('#topic-edit-form').html(
					select_template.render(data.item)
					);
				$('.create-post-wrapper.edit-mode').addClass('sticky-navi-comment');
				//prepare .data for preview
				$(document.body).data('topic',
				{
					'raw':data.item.raw_topic,
					'disp':data.item.disp_topic
				});
				
				$(document.body).data('edit_detail',
				{
					'raw':data.item.raw_msg,
					'disp':data.item.disp_msg
				});

				
				$(document.body).data('cancel_tag_btn',	without_cancel_btn);
				
				// call preview
				$('.preview').preview(config_preview);
				//bb code
				$('#detail-topic').bbcode();
				
				
				/* Modify By  */
				$('#counter_1,#counter_2').remove();
							
				/* Counter String */
				$('#topic').jqEasyCounter({
					'maxChars': 120,
					'maxCharsWarning': 115,
					'msgFontColor': '#A09DD5',
					'msgFontFamily': 'Arial',
					'msgTextAlign': 'left',
					'msgAppendMethod': 'insertAfter'
				});
			
				$('#detail-topic').jqEasyCounter({
					'maxChars': 10000,
					'maxCharsWarning': 9995,
					'msgFontColor': '#A09DD5',
					'msgFontFamily': 'Arial',
					'msgTextAlign': 'left',
					'msgAppendMethod': 'insertAfter'
				});
				
			
				
				
				$('.jqEasyCounterMsg').each(function(index)
				{
					$(this).attr('id','counter_'+(index+1));
				});
				
				if(data.item.over == true)
				{
					//move element
					$('#counter_1').appendTo('#button_detail');
				}else
				{
					$('#counter_1').appendTo('div[class="button-container"][id="button_topic"]');
					$('#counter_2').appendTo('div[class="button-container"][id="button_detail"]');
				}
				
				//ถ้าเป็นคลับปิด จะไม่สามารถติด tag ได้ ตอนแก้ไขก็ต้องไม่ขึ้น
				// ถ้าค่า hidden เป็น 0 คือเป็นกระทู้ทั่วไป
				// ถ้าเป็น 1 แสดงว่าเป็นกระทู้ club 
				if(data.item.hidden == 0)
				{
					
					$(document.body).data('tag-data',
					{
						'tags':data.item.tags						
					});
					$.tagRoom.tagRoomDefault();
				}
				else
				{
					// ลบบล๊อกแก้ไข tag ออก
					$('.create-post-item.post-tag-wrapper').remove();
				}				
				//save button
				$.preview.updateNormal({
					url : '/forum/topic/topic_update',
					validation :{
						topicMin : 5
					},
					'method' : 'update',
					'type' : data.item.topic_type,
					'topic_status' : data.item.topic_status,
					'topic_id' : $.edit_topic.variable.topic_id,
					'over_hr' : data.item.over
				});

				// Remove existing editor
				for (var i = top.tinymce.editors.length - 1 ; i > -1 ; i--) {
					var ed_id = top.tinymce.editors[i].id;
					top.tinymce.execCommand("mceRemoveEditor", true, ed_id);
				}
				// adding tinymce javascript
				init_tinymce_editor(function() {
					richTextEditor.set_editor_data('topic_id', data.item.topic_id);
					richTextEditor.set_editor_data('bbcode', data.item.raw_msg);
					var richText = richTextEditor.toRichText(data.item.raw_msg);
					top.tinymce.activeEditor.insertContent(richText);
				});
			}
			
		},'JSON');
	}
	
	
	var ajax_request_edit_topic;
	/* variable */
	$.edit_topic.variable = {
		'url' : '/forum/topic/get_topic_info',
		'topic_id'	:  location.pathname.split("/")[2]
	};

	
	
	
	
	
	
	
	function detect_type()
	{
		var div_id = $this.parents('.display-post-wrapper').attr('id');
		// ถ้าไม่เจอ search จะให้ผลเป็น -1
		if(div_id.search('comment') >= 0
			|| div_id.search('bestanswer') >= 0 // สำหรับกระทู้ที่เจ้าของเลือกมา
			|| div_id.search('topcomment') >= 0 // สำหรับกระทู้ที่มีคะแนนมากกว่า 4
			|| div_id.search('expertcomment') >= 0 // สำหรับความคิดเห็นที่มาจากผู้เชี่ยวชาญ
			)
			{
			return 'comment';
		}
		return 'reply';
	}
	
	
	function cal_width_equal()
	{
		var x = $('#detail_comment').prev().width();
		$('#detail_comment').width(x);
	}
	function is_first_comment(div_parents)
	{
		if(div_parents.filter('.first').length == 1)
		{
			return true;
		}
		return false;
	}
	
	
	$.editMethod.variable = {
		'type_edit' : '',
		'sendEdit' : {},
		'callFromEditUrl' : {},
		'preview': {
			'resultPreview' : {}
		}
	};
/*  ----------------------------------------------------------
	 *						End: editMethod  
	 *  ----------------------------------------------------------  
	 */
	
	/* ---------------------- *
	*		Start Pin It      *
	*		_id
			mid 
			topic_id
			mark
			shard_key : mid.topic_id
	* ----------------------- */
   
	$.pinIt.defaults = {
		ajaxrequest : false
	};
	$.pinIt.mark = function()
	{
		var options = $.pinIt.defaults;
		var mark = {};
		var url = window.location.pathname.split('/');
		$(document).on('click','.pin-it',function(){
			mark['mark'] = $(this).data('pinit');
			mark['topic_id'] = url[2];
			mark['del'] = 'N';
			$(document).data('mark', mark);
			if($(this).hasClass('unpin-it'))
			{
				mark['del'] = 'Y';
			}
			
			if(options.ajaxrequest == false)
			{
				options.ajaxrequest = true;
				$.ajax({
					type: "POST",
					url : "/forum/topic/pin_it",
					dataType : 'json',
					data : $(document).data('mark'),
					success : function(rs){
						options.ajaxrequest = false;
						if(rs.status == 'failed')
						{
							let returnUrl = '/topic/' + $(document).data('mark').topic_id + '/' + $(document).data('mark').mark;
							requireLogin(returnUrl);
						}
						if(rs.status == 'success')
						{ 
							$('.pin-it').removeClass('unpin-it');
							$('.pin-it').find('.display-post-pinit.icon.icon-pinit').removeClass('display-post-pinit icon icon-pinit').addClass('display-post-unpin icon icon-unpin');
							if(mark['del'] == 'N')
							{
								$('.pin-it.'+mark['mark']).addClass('unpin-it');
								$('.pin-it.'+mark['mark']).find('.display-post-unpin.icon.icon-unpin').removeClass('display-post-unpin icon icon-unpin').addClass('display-post-pinit icon icon-pinit');
							}
							else
							{
								$('.pin-it.'+mark['mark']).removeClass('unpin-it');
								$('.pin-it.'+mark['mark']).find('.display-post-pinit.icon.icon-pinit').removeClass('display-post-pinit icon icon-pinit').addClass('display-post-unpin icon icon-unpin');
							}
						}
						
					}
				});
			}
		});
	};
	
	function pinIt()
	{
		$.ajax({
			type: "POST",
			url : "/forum/topic/pin_it",
			dataType : 'json',
			data : $(document).data('mark'),
			success : function(rs){
				if(rs.status == 'success')
				{
					$('.pin-it').removeClass('unpin-it');
					$('.pin-it').find('.display-post-pinit.icon.icon-pinit').removeClass('display-post-pinit icon icon-pinit').addClass('display-post-unpin icon icon-unpin');
					if($(document).data('mark').del == 'N')
					{
						$('.pin-it.'+$(document).data('mark').mark).addClass('unpin-it');
						$('.pin-it.'+$(document).data('mark').mark).find('.display-post-unpin.icon.icon-unpin').removeClass('display-post-unpin icon icon-unpin').addClass('display-post-pinit icon icon-pinit');
					}
					else
					{ 
						$('.pin-it.'+$(document).data('mark').mark).removeClass('unpin-it');
						$('.pin-it.'+$(document).data('mark').mark).find('.display-post-pinit.icon.icon-pinit').removeClass('display-post-pinit icon icon-pinit').addClass('display-post-unpin icon icon-unpin');
					}
				}
			}
		});
	}
   /* ---------------------- *
	*		End Pin It      *
	* ----------------------- */
   function checkExpert(check_type){
		var expert_id = "expert_comment";
		var expert = false;
		var checked = "";
		if(check_type == "sendEdit")
		{
			expert_id = "edit_expert_comment";
		}
	   	if($('input[id="'+ expert_id +'"]:checked').length == 1)
		{  
			expert = true;
		}		
		/* preview and edit at main-contenr */
		if(check_type == "previewComment" || check_type == "editComment")
		{   
			var prev_class = '';
			var disable_click = '';
			if(expert == true)
			{
				checked = "checked";
			}
			if(check_type == "previewComment" )
			{
				prev_class = ' expert-preview';
				disable_click = ' disabled';
			}
			if($('input[id="expert_comment"]').val() !== undefined)
			{
				expert = '<div class="display-checkbox-expert'+ prev_class +'"><input id="expert_comment" type="checkbox" '+ checked + disable_click + '><label for="expert_comment">ตอบในฐานะ Expert Account</label></div>'
			}
			else
			{
				expert = "";
			}
		}
		return expert;
   }
    /* ---------------------- *
	*	   End checkExpert    *
	* ----------------------- */
   
   
 /* ---------------------- *
	*	start function group remove comment and reply by nook  *
* ----------------------- */
   function group_remove_data(count_remove,temp_data){
		var count_delete_reply =0;
		var temp_count_delete =0;
		var temp_id =[];
		var reply_no = [];
		var reply_id = [];
		for (i = 0; i < count_remove; i++) { 				
			var  data = $('#'+temp_data[i]['id']).data('remove');					
			var str =  $('#'+temp_data[i]['id']).find('.display-post-number').attr('id');
			var res = str.split("comment,");
			var no =  res;
			if(data==true){
				count_delete_reply++;		
				temp_id = temp_data[i]['id'];						
				reply_no.push(no);
				reply_id.push(temp_id);
			}else{
				temp_count_delete=count_delete_reply;
				count_delete_reply=0;
				var txt = 'คห. ถูกลบ ';	
				if(temp_id!=0){
					add_div_remove_comment(reply_id,txt,temp_id);	
				}
				temp_id=0;
				reply_no=[];
				reply_id=[];
			}
		}//end for
		if(count_delete_reply!=0){
			var txt = 'คห. ถูกลบ ';			
			if(temp_id!=0){				
				add_div_remove_comment(reply_id,txt,temp_id);				
			}
		}	
	}
	
	 function group_remove_for_reply(count_after,data_after,before){
		 var after = [];
		var count_delete_reply =0;
		var temp_count_delete =0;
		var temp_id =[];
		var reply_no = [];
		var reply_id = [];	
		for (j = 0; j < count_after; j++) { 	
			var check = before.indexOf(data_after[j]['id']);						
			if(check == -1){
				after.push(data_after[j]['id']);
			}
		}					
		after.forEach(function(entry) {
			var  data = $('#'+entry).data('remove');		
			if(data==true){
				var str =  $('#'+entry).find('.display-post-number').attr('id');
				var res = str.split("comment");				
				var no =  res;
				count_delete_reply++;		
				temp_id =entry;						
				reply_no.push(no);
				reply_id.push(temp_id);
			}else{
				temp_count_delete=count_delete_reply;
				count_delete_reply=0;
				var txt = 'คห. ถูกลบ ';
				if(temp_id!=0){
					add_div_remove_comment(reply_id,txt,temp_id);	
				}
				temp_id=0;
				reply_no=[];
				reply_id=[];
			}
		});					
		if(count_delete_reply!=0){
			var txt = 'คห. ถูกลบ ';
			if(temp_id!=0){
				add_div_remove_comment(reply_id,txt,temp_id);	
			}
		}	
	 }
   
	function add_div_remove_comment(reply_id,txt,temp_id){
		var div_data = '<div class="display-post-wrapper with-top-border section-comment sub-comment">'
		+'<a href="javascript:void(0)" class="seemore-reply-remove" >'
		+'<div class="remove-comment-toggle-bordertop">'
		+'<div class="remove-comment-toggle">'
		+'<span class="data-reply-remove" style="display:none;">'+reply_id+'</span>'
		+'<img src="https://ptcdn.info/images/noti/ic_arrowdown_topic.png" width="10" height="10">&nbsp;'+txt+'</div>'
		+'</div></a></div>'; 
		$(div_data).insertAfter('#'+temp_id);
	}
  
      /* ---------------------- *
	*	   End  group remove comment and reply   *
	* ----------------------- */
   
   $.follow.topic  = function ()
	{
		var timer;
		var timer_follow;
		$('.topic-follow-toggle').hide();
		
		$(document).on('mouseenter', '.btn-unfollow', function () {
			if ( ($('.topic-follow-toggle').css('display') == 'none') ){
				timer = setTimeout(
				function() 
				{
				  $( ".topic-follow-toggle" ).show();
				}, 400);
			}
			
		});
		
		$(document).on('mouseleave', '.btn-unfollow', function () {
			if ( $('.topic-follow-toggle').is(':hover') )
			{
				$( ".topic-follow-toggle" ).show();
			}
			else
			{
				$( ".topic-follow-toggle" ).hide();
				clearTimeout(timer);
			}
		});
		
		$(document).on('mouseenter', '.btn-follow', function () {
			if ( ($('.topic-follow-toggle').css('display') == 'none') ){
				timer_follow = setTimeout(
				function() 
				{
				  $( ".topic-follow-toggle" ).show();
				}, 400);
			}
			
		});
		
		$(document).on('mouseleave', '.btn-follow', function () {
			if ( $('.topic-follow-toggle').is(':hover') )
			{
				$( ".topic-follow-toggle" ).show();
			}
			else
			{
				$( ".topic-follow-toggle" ).hide();
				clearTimeout(timer_follow);
			}
		});
		
		$(document).on('mouseenter', '.topic-follow-toggle', function () {
			$( ".topic-follow-toggle" ).show();
		});
		
		$(document).on('mouseleave', '.topic-follow-toggle', function () {
			$( ".topic-follow-toggle" ).hide();
		});
		
		/* 3 */
		$(document).on('click', '.btn-unfollow', function () {
			$( ".topic-follow-toggle" ).hide();
			clearTimeout(timer);
			clearTimeout(timer_follow);
			if($('.btn-follow'))
			$('#follow_all').trigger('click');
		});
		
		$(document).on('click', 'input[name="follow_topic"]', function () {
			var c_no = 0;
			var type = $(this).val();
			var tid = $('.main-post.type').attr('id');
			tid = tid.replace("topic-", "");
			clearTimeout(timer);
			clearTimeout(timer_follow);
			if($(this).attr('id') == 'cancel_follow')
			{
				$('.topic-follow-toggle').siblings('button').removeClass('btn-follow color-1').addClass("btn-unfollow color-1").find('.icon-follow.btn-follow').addClass("btn-unfollow").removeClass("btn-follow");
				$('.txt-follow').html('ติดตาม');
				unFollowTopic(tid);
			}
			else
			{
				$('.topic-follow-toggle').siblings('button').removeClass('btn-unfollow color-1').addClass("btn-follow color-1").find('.icon-follow.btn-unfollow').addClass("btn-follow").removeClass("btn-unfollow");
				$('.txt-follow').html('ติดตามแล้ว');
				setFollowTopic(type, tid, c_no);
			}
			$('.topic-follow-toggle').hide();
		});
		
	}
	
	function setFollowTopic(type, tid, c_no)
	{
		$.ajax({
			type: "POST",
			url: "/forum/topic/set_follow",
			dataType: 'json',
			data: {
				follow_type: type,
				topic_id: tid,
				c_no: c_no
			},
			success: function (rs) {
				
			}
		});
	}
	
	function unFollowTopic(tid)
	{ 
		$.ajax({
			type: "POST",
			url: "/notifications/notifications/unfollow_topic?time="+Math.random(),
			dataType: 'json',
			data: {
				topic_id: tid
			},
			success: function (rs) {
				
			}
		});
	}
})(jQuery);
