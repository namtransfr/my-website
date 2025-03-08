(function($){

	$.fn.lightboxMedia = function(){
		var $that = $(this);
		$(document).on('click', '.icon-media-tool-lightbox', function(){
			var $this = $(this);
			var el_textarea = '';
			var typeObj = '';

			if($this.hasClass('icon-map'))
			{
				if($this.parent().find('.map-detail').length > 0)
				{
					el_textarea = $this.parents('.surround-box-light').next();
					typeObj = 'detail';
				}
				else
				{
					el_textarea = $this.parents('li');
					typeObj = 'choice';
				}
				$this.lightboxGoogleMapOpen(el_textarea);
				$this.inputUrlGoogleMap($('#links_lb_process'));
				$this.confirmUrlGoogleMap($('#links_lb_process'), typeObj)
				$this.cancelUrlGoogleMap();
				$this.choiceDeleteIcons();
			}
			else if($this.hasClass('icon-video'))
			{
				if($this.parent().find('.media-detail').length > 0)
				{
					el_textarea = $this.parents('.surround-box-light').next();
					typeObj = 'detail';
				}
				else
				{
					el_textarea = $this.parents('li');
					typeObj = 'choice';
				}
				$this.lightboxMediaOpen(el_textarea);
				$this.inputUrlMedia($('#links_lb_process'));
				$this.confirmUrlMedia($('#links_lb_process'), typeObj);
				$this.cancelUrlMedia();
				$this.choiceDeleteIcons();
			}
			else if($this.hasClass('icon-emoticon')){
				el_textarea = $this.parents('.surround-box-light').next(); //$this.parents('#bb_detail').find('textarea').attr('id');
				$this.lightboxEmoOpen(el_textarea);
				$this.selectEmo($('#links_lb_process'));
				$this.closeLightboxEmo();
			}
			else if($this.hasClass('icon-photo')){
				$this.choiceDeleteIcons();
			}
		});
		$that.closeLightboxEmoByOutside();
	};

	$.fn.closeLightboxEmoByOutside = function(){
		// ปิด lightbox เมื่อกดคลิกข้างนอก lightbox
		$(document).on('click', '.ui-widget-overlay', function(){
			$('#links_lb_process').remove();
			delete $.data(document.body).textarea_comment;
		});
	};

	/* lightbox Emotion */
	$.fn.lightboxEmoOpen = function(el_ment){
		// เปิด lightbox ของ emotion ในส่วนของ bbCode
		var lb_media_div = '<div id="links_lb_process" class="lightbox-hide"></div>';
		$('.footer').append(lb_media_div);
		var el_textarea = el_ment;
		var refzcomment = '';
		if(el_ment.hasClass('pt-form-sub-comment'))
		{
			refzcomment = this.parents().find('.comment-box-color.sub-comment.reply-comment').siblings('.pageno-title-counter').data('refzcomment');
		}
		else if(this.parents().find('.step-caption.aligncenter').data('refzcomment') != undefined)
		{
			refzcomment = this.parents().find('.step-caption.aligncenter').data('refzcomment');
		}
		else if(this.parents().find('.display-post-remark.aligncenter').data('refzcomment') != undefined)
		{
			refzcomment = this.parents().find('.display-post-remark.aligncenter').data('refzcomment');
		}
		else
		{
			refzcomment = this.parents().find('.comment-bar.main-comment').siblings('.pageno-title-counter').data('refzcomment');
		}
		$(document.body).data('textarea_comment',
		{
			'obj':el_textarea
		});
		$.ajax({
			type: 'POST',
			url: '/forum/topic/lightbox_emoticon',
			data: '',
			dataType: 'html',
			success: function(result){
				$('#links_lb_process')
				.addClass('dialog-fullheight')
				.attr('data-refzcomment', refzcomment)
				.dialog({
					width: 750,
					height: 500,
					title: 'ใส่ Pantip Toy',
					modal: true,
					resizable: false,
					draggable: false,
					close: function()
					{
						$('#links_lb_process').remove();
						delete $.data(document.body).textarea_comment;
					}
				})
				.html(result);
			}
		});
	};

	$.fn.selectEmo = function(options){
		options.on('click', '.emo-name', function(){
			var tag = '';
			tag = $(this).attr('name');
			if(tag != '')
			{
				var obj = $(document.body).data('textarea_comment').obj;
					obj.surroundSelectedText(tag, '', true);
					obj.focus();

				$('#msg_txt_insert_emo').html('&nbsp;&nbsp;ใส่ Pantip Toy ลงในข้อความแล้ว');
			}
		});
	};

	$.fn.closeLightboxEmo = function(){
		$(document).on('click keydown', '#emo_cancel', function(e){
			// Cancel LB url media :: page->topic_media
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
			delete $.data(document.body).textarea_comment;
		});
	};

	/* lightbox Media [youtube , vimeo] */
	$.fn.lightboxMediaOpen = function (el_ment){

		let config = JSON.parse(document.getElementById('ptConfig').innerText);

		if (!config.user_post_permissions.has_video_permission) {
			$.errorNotice.dialog('บัญชีของคุณไม่สามารถใช้ฟังก์ชันนี้ได้', {
				title: 'แจ้งเตือน',
				btn_close: 'ปิดหน้าต่าง'
			});
			return;
		}

		var lb_media_div = '<div id="links_lb_process" class="lightbox-hide"></div>';
		$('.footer').append(lb_media_div);
		var el_textarea = el_ment;
		$(document.body).data('textarea_comment',
		{
			'obj':el_textarea
		});
		$.ajax({
			type: 'POST',
			url: '/forum/topic/lightbox_links_media',
			data: '',
			dataType: 'html',
			success: function(result){
				$('#links_lb_process')
				.dialog({
					width: 700,
					title: 'ใส่คลิปวิดีโอ',
					modal: true,
					resizable: false,
					draggable: false,
					close: function()
					{
						$('#links_lb_process').remove();
						delete $.data(document.body).textarea_comment;
					}
				})
				.html(result);
				$('#input_url').focus();
			}
		});
	}

	$.fn.confirmUrlMedia = function (options, typeObj){
		options.on('click', '#media_confirm', function(){
			var tag = '';
			var obj = '';
			var value = $('#input_url').val();
			if(typeObj == 'detail')
			{
				if($('#error_media').val() == 'false')
				{
					$('#input_url').focus();
				}
				else
				{
					tag = getTagMediaDetail($.trim(value));
					if(tag != 'error')
					{
						obj = $(document.body).data('textarea_comment').obj;
						obj.surroundSelectedText(tag, '', true);
						$('#links_lb_process').remove();
						delete $.data(document.body).textarea_comment;
					}
					else
					{
						$('#error_media').html('<span class="error-txt small-txt">*กรุณาใช้ลิงก์ YouTube หรือ Vimeo เท่านั้น</span>');
						$('#error_media').val('false');
						$('#input_url').focus();
					}
				}
			}
			else if(typeObj == 'choice')
			{
				if($('#error_media').val() == 'false')
				{
					$('#input_url').focus();
				}
				else
				{
					tag = getUrlMedia($.trim(value));
					if(tag != 'error')
					{
						obj = $(document.body).data('textarea_comment').obj;
						obj.find('.option-input').append(
							'<div class="post-que-media-wrapper small-txt">'
							+'<div title="'+tag+'" class="post-que-media-url">ลิงก์: '+tag+'</div><a class="post-que-remove-media" href="javascript:void(0);">ลบ</a>'
							+'</div>'
						);

						obj.find('.option-media').hide();
						$('#links_lb_process').remove();
						delete $.data(document.body).textarea_comment;
					}
					else
					{
						$('#error_media').html('<span class="error-txt small-txt">*กรุณาใช้ลิงก์ YouTube หรือ Vimeo เท่านั้น</span>');
						$('#error_media').val('false');
						$('#input_url').focus();
					}
				}
			}
		});
	}

	$.fn.inputUrlMedia = function (options){
		options.on('keyup', '#input_url', function(e){
			if(e.which == 13)
			{
				$('#media_confirm').trigger('click');
				return false;
			}
			else
			{
				$('#error_media').html('');
				if($('#input_url').val() == '')
				{
					$('#error_media').html('<span class="error-txt small-txt">*กรุณาใส่ลิงก์ที่ต้องการ</span>');
					$('#error_media').val('false');
				}
				else
				{
					var inputValue = $('#input_url').val().trim();
					if (!inputValue.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*v=)|(?:youtu\.be\/))([-|~_0-9A-Za-z]{11})/i) && !inputValue.match(/^(\s+)?http(?:s)?:\/\/vimeo\.com\/(\d+)/i)) {
						/*
						 * http://www.youtube.com/.....
						 * http://youtu.be/.....
						 * http://www.vimeo.com/.....
						 * http://vimeo.com/.....
						 */
						//error : false => value is not format URL
						$('#error_media').html('<span class="error-txt small-txt">*กรุณาใช้ลิงก์ YouTube หรือ Vimeo เท่านั้น</span>');
						$('#error_media').val('false');
					}
					else
					{
						$('#error_media').val('true');
					}
				}
			}
		});
	};

	$.fn.cancelUrlMedia = function (){
		$(document).on('click keydown', '#media_cancel', function(e){
			// Cancel LB url media :: page->topic_media
			if(e.shiftKey && e.keyCode == 9)
			{
				return true;
			}
			else if (e.keyCode == 9)
			{
				$('#input_url').select();
				return false;
			}
			else if (e.keyCode == 16)
			{
				return false;
			}
			$('#links_lb_process').remove();
			delete $.data(document.body).textarea_comment;
		});
	};

	$.fn.choiceDeleteIcons = function (){
		// ข้อความ "ลบ" หลังลิงค์ของ Media ทุกอันที่เป็น Choice
		$(document).on('click','.post-que-remove-media',function(){
			$(this).parents('.option-input').next().show();
			$(this).parents('.post-que-media-wrapper.small-txt').remove();
		});
	};

	/** Lightbox Google Maps */
	$.fn.lightboxGoogleMapOpen = function (el_ment){
		var lb_media_div = '<div id="links_lb_process" class="lightbox-hide"></div>';
		$('.footer').append(lb_media_div);
		var el_textarea = el_ment;
		$(document.body).data('textarea_comment',
		{
			'obj':el_textarea
		});
		$.ajax({
			type: 'POST',
			url: '/forum/topic/lightbox_links_map',
			data: '',
			dataType: 'html',
			success: function(result){
				$('#links_lb_process')
				.dialog({
					width: 700,
					title: 'ใส่แผนที่',
					modal: true,
					resizable: false,
					draggable: false,
					close: function()
					{
						$('#links_lb_process').remove();
						delete $.data(document.body).textarea_comment;
					}
				})
				.html(result);
				$('#input_map').focus();
			}
		});
	}

	$.fn.confirmUrlGoogleMap = function (options, type){
		options.on('click', '#map_confirm', function(){
			var tag = '';
			var obj = '';
			var value = $('#input_map').val();
			var typeObj = type;
			if(typeObj == 'detail')
			{
				if($('#error_map').val() == 'false')
				{
					$('#input_map').focus();
				}
				else
				{
					tag = getTagUrlMap($.trim(value), typeObj);
					if(tag != 'error')
					{
						if (value.match(/https:\/\/goo.gl\/maps\/[A-Za-z0-9]+/) || value.match(/https:\/\/maps.app.goo.gl\/[A-Za-z0-9]+/)) {
							$.ajax({
								type: 'post',
								url: '/forum/new_topic/get_google_map',
								data: { url: $.trim(value) },
								dataType: 'json',
								success: function (data) {
									if (data.success) {
										obj = $(document.body).data('textarea_comment').obj;
										obj.surroundSelectedText(tag, '', true);
										$('#links_lb_process').remove();
										delete $.data(document.body).textarea_comment;
									} else {
										$('#error_map').html('<span class="error-txt small-txt">*ลิงก์ของแผนที่ที่คุณให้มาไม่ถูกต้อง</span>');
										$('#error_map').val('false');
										$('#input_map').focus();
									}
								},
								error: function (xhr, textStatus, errorThrown) {
									$('#error_map').html('<span class="error-txt small-txt">*ลิงก์ของแผนที่ที่คุณให้มาไม่ถูกต้อง</span>');
									$('#error_map').val('false');
									$('#input_map').focus();
								}
							});
						} else {
							obj = $(document.body).data('textarea_comment').obj;
							obj.surroundSelectedText(tag, '', true);
							$('#links_lb_process').remove();
							delete $.data(document.body).textarea_comment;	
						}
					}
					else
					{
						$('#error_map').html('<span class="error-txt small-txt">*กรุณาใช้ลิงก์จาก Google Maps เท่านั้น</span>');
						$('#error_map').val('false');
						$('#input_map').focus();
					}
				}
			}
			else if(typeObj == 'choice')
			{
				if($('#error_map').val() == 'false')
				{
					$('#input_map').focus();
				}
				else
				{
					tag = getTagUrlMap($.trim(value), typeObj);
					if(tag != 'error')
					{
						if (value.match(/https:\/\/goo.gl\/maps\/[A-Za-z0-9]+/) || value.match(/https:\/\/maps.app.goo.gl\/[A-Za-z0-9]+/)) {
							$.ajax({
								type: 'post',
								url: '/forum/new_topic/get_google_map',
								data: { url: $.trim(value) },
								dataType: 'json',
								success: function (data) {
									if (data.success) {
										obj = $(document.body).data('textarea_comment').obj;
										obj.find('.option-input').append(
											'<div class="post-que-media-wrapper small-txt">'
											+ '<div title="' + tag + '" class="post-que-media-url">ลิงก์: ' + tag + '</div><a class="post-que-remove-media" href="javascript:void(0);">ลบ</a>'
											+ '</div>'
										);

										obj.find('.option-media').hide();
										$('#links_lb_process').remove();
										delete $.data(document.body).textarea_comment;
									} else {
										$('#error_map').html('<span class="error-txt small-txt">*ลิงก์ของแผนที่ที่คุณให้มาไม่ถูกต้อง</span>');
										$('#error_map').val('false');
										$('#input_map').focus();
									}
								},
								error: function (xhr, textStatus, errorThrown) {
									$('#error_map').html('<span class="error-txt small-txt">*ลิงก์ของแผนที่ที่คุณให้มาไม่ถูกต้อง</span>');
									$('#error_map').val('false');
									$('#input_map').focus();
								}
							});
						} else {
							obj = $(document.body).data('textarea_comment').obj;
							obj.find('.option-input').append(
								'<div class="post-que-media-wrapper small-txt">'
								+ '<div title="' + tag + '" class="post-que-media-url">ลิงก์: ' + tag + '</div><a class="post-que-remove-media" href="javascript:void(0);">ลบ</a>'
								+ '</div>'
							);

							obj.find('.option-media').hide();
							$('#links_lb_process').remove();
							delete $.data(document.body).textarea_comment;
						}
					}
					else
					{
						$('#error_map').html('<span class="error-txt small-txt">*กรุณาใช้ลิงก์จาก Google Maps เท่านั้น</span>');
						$('#error_map').val('false');
						$('#input_map').focus();
					}
				}
			}
			//delete $.data(document.body).textarea_comment;
		});
	}

	$.fn.inputUrlGoogleMap = function (options){
		options.on('keyup', '#input_map', function(e){
			if(e.which == 13)
			{
				$('#map_confirm').trigger('click');
				return false;
			}
			else
			{
				$('#error_map').html('');
				if($('#input_map').val() == '')
				{
					$('#error_map').html('<span class="error-txt small-txt">*กรุณาใช้ลิงก์จาก Google Maps เท่านั้น</span>');
					$('#error_map').val('false');
				}
				else
				{
                    if (!$('#input_map').val().match(/(maps\.google\..)|((www.google)\.([a-z\.]{2,6})\/maps)|(goo\.gl\/maps\/)|(maps\.app\.goo\.gl\/)/))
					{
						/*
						* maps.googlemap...... เช็ค format url ให้ถูก format googlemaps
						*/
						//error : false => value is not format URL Google Map
						$('#error_map').html('<span class="error-txt small-txt">*กรุณาใช้ลิงก์จาก Google Maps เท่านั้น</span>');
						$('#error_map').val('false');
					}
					else
					{
						$('#error_map').val('true');
						//$('#error_map').html('<span class="success-txt small-txt">*ลิงก์ถูกต้อง</span>');
					}
				}
			}
		});
	}

	$.fn.cancelUrlGoogleMap = function (){
		$(document).on('click keydown', '#map_cancel', function(e){
			//  Cancel LB url google map :: page->topic_map
			if(e.shiftKey && e.keyCode == 9)
			{
				return true;
			}
			else if (e.keyCode == 9)
			{
				$('#input_map').select();
				return false;
			}
			else if (e.keyCode == 16)
			{
				return false;
			}
			$('#links_lb_process').remove();
			delete $.data(document.body).textarea_comment;
		});
	};




	/* Defaults Function */
	//$.fn.lightboxMedia.defaults = {}

	//****************************************** Public Function *****************************************//
	function getUrlMedia(theValue)
	{
		var value = theValue.trim();
		var tag = '';

		if(value != '')
		{
			if (value.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*v=)|(?:youtu\.be\/))([-|~_0-9A-Za-z]{11})/i) != null)
			{
				tag = value;
			}
			else if ($('#input_url').val().trim().match(/^(\s+)?http(?:s)?:\/\/vimeo\.com\/(\d+)/i) != null)
			{
				tag = value;
			}
			else if($('#input_url').val().search(/slideshare.net\/./) != -1)
			{
				tag = value;
			}
			else if($('#input_url').val().search(/scribd.com\/./) != -1)
			{
				tag = value;
			}
		}
		else
		{
			tag = 'error';
		}
		return tag;
	}

	function getTagMediaDetail(theValue)
	{
		var value = theValue.trim();
		var tag = '';

		if(value != '')
		{
			if (value.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*v=)|(?:youtu\.be\/))([-|~_0-9A-Za-z]{11})/i) != null)
			{
				tag = '[youtube]'+value+'[/youtube]\n';
			}
			else if ($('#input_url').val().trim().match(/^(\s+)?http(?:s)?:\/\/vimeo\.com\/(\d+)/i) != null)
			{
				tag = '[vimeo]'+value+'[/vimeo]\n';
			} 
			else 
			{
				tag = 'error';
			}

		}
		else
		{
			tag = 'error';
		}
		return tag;
	}

	function getTagUrlMap(theValue, typeObj)
	{
		var value = theValue;
		var tag = '';
		var type = typeObj;
		//console.log($.trim(value));
		if (value != '')
		{
			if(value.search(/(maps\.google\..)|((www.google)\.([a-z\.]{2,6})\/maps)|(goo\.gl\/maps\/)|(maps\.app\.goo\.gl\/)/) != -1)
			{
				if(type == 'detail')
				{
					tag = '[googlemaps]'+value+'[/googlemaps]\n';
				}
				else if(type == 'choice')
				{
					tag = value;
				}
			}
		}
		else
		{
			tag = 'error';
		}
		return tag;
	}

})(jQuery);


