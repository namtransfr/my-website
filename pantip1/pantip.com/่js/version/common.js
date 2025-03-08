var search_url = "https://pantip.com/search";
var tags_url = "https://pantip.com/tag/";
var targetElement = null;

/**
 * Get global config.
 * @returns {{[string]: any}}
 */
function getGlobalConfig() {
	let element = document.getElementById('ptConfig');
	if (!element) {
		console.error('ptConfig element does not exist');
	}
	return JSON.parse(element.innerText);
}

function cutSpace(s) {
	if (/^ *$/.test(s)) {
		return true;
	} else {
		return false;
	}
}

function detectIE() {

	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}

	var trident = ua.indexOf('Trident/');
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}

	var edge = ua.indexOf('Edge/');
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}
	// other browser
	return false;
}

function detectFirefox() {
	var browser = navigator.userAgent.toLowerCase();
	if (browser.indexOf('firefox') > -1) {
		return true;
	}
	return false;
}

function detectChrome() {
	var browser = navigator.userAgent.toLowerCase();
	if (browser.indexOf('chrome') > -1) {
		return true;
	}
	return false;
}

function connect_deep(mid, token, cnt) {
	var notiOpen = true;
	var num_error = 1;
	if (notiOpen && token.length > 0 && (detectIE() === false || detectIE() >= 10)) {
		client = deepstream('wss://' + window.location.host + '/deep/deepstream').login({
			token: token,
		}, function (success, data) {
			if (success && data.status) {

				client.event.subscribe('' + data.mid + '', function (json) {

					var json = $.extend({}, json, data);
					show_noti(json);
				});
			} else {
				//console.log('node false');// chk
			}
		});

		client.on('connectionStateChanged', function (connectionState) {

			if (connectionState == 'RECONNECTING') {
				//num_error++;
			}
			if (connectionState == 'OPEN') {
				//$('#deepstream_modal').text('').dialog('close');
			}
			if (connectionState == 'ERROR' && num_error == 3) {
				//console.log('deep false');// chk
			}
		});
	}
}

function getFormattedDate() {
	var date = new Date();
	var str = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	return str;
}

function tpl_noti_detail(json) {
	var max_str = 60;
	var topic = json.disp_topic;
	if (json.disp_topic.length >= max_str) {
		topic = json.disp_topic.substr(0, max_str) + "...";
	}
	var title = ''
	if (json.answer != '' && json.action_text != '') {
		title = json.answer + ' ' + json.action_text
	} else if (json.answer != '') {
		title = json.answer
	} else if (json.action_text != '') {
		title = json.action_text
	}
	var html = '<div id="' + json.rand + '" class="relative realtime-list-msg">'
		+ '<a title="ปิด" class="noti-realtime-close"></a>'
		+ '<a href="' + json.last_url + '" target="_blank"  class="realtime-list">'
		+ '<div class="noti-realtime-avatar">'
		+ '<img src="' + json.avatar + '" width="32px;" height="32px;">'
		+ '<div class="pl-3 relative">'
		+ '<span class="icon-noti-comment inactive"></span>'
		+ '<div class="noti-realtime-action">' + title
		+ '<br/>' + topic
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</a>'
		+ '</div>';
	return html;
}

function show_noti(json) {
	var badgeNotiClass = '.total-noti';

	// เช็คแสดงผลของหลังไมค์
	if (json.noti_detail && json.noti_detail.service_type) {
		if (json.noti_detail.service_type == 'private_message') {
			badgeNotiClass = '.total-msg';
		}
	}

	if (json.noti_cnt > 0) {
		if (json.noti_cnt > 9) {
			json.noti_cnt = '9+';
		}
		$(badgeNotiClass).html('<b class="pt-nav__badge">' + json.noti_cnt + '</b>');
	} else {
		$(badgeNotiClass).html('');
	}

	if (typeof json.close_noti !== 'undefined' && json.close_noti == false && typeof json.noti_detail !== 'undefined' && json.noti_detail != '') {

		if ($('.noti-realtime').find('.realtime-list-msg#' + json.noti_detail.rand).length == 0) {
			var oDialog = $(tpl_noti_detail(json.noti_detail));
			$('.noti-realtime').prepend(oDialog);
			hideDialod(oDialog);
		}

	}
}

function hideDialod(oDialog) {
	var timeoutId = setTimeout(function () {
		oDialog.fadeOut(2000, function () {
			oDialog.remove();
		});
		$('div.noti-mouse-hover').fadeOut(2000, function () {
			$(this).remove();
			if (typeof $('.noti-realtime').data('timeoutId') !== "undefined") {
				clearTimeout($('.noti-realtime').data('timeoutId'));
			}
		});
	}, 15000);
	oDialog.data('timeoutId', timeoutId);

	$('div.realtime-list-msg').off().on('mouseover mouseenter', function () {
		if (typeof $('.noti-realtime').data('timeoutId') !== "undefined") {
			clearTimeout($('.noti-realtime').data('timeoutId'));
		}
		if (typeof timeoutId !== "undefined") {
			clearTimeout(timeoutId);
		}
		$('div.realtime-list-msg:not(.noti-mouse-hover)').addClass('noti-mouse-hover');
		$('div.realtime-list-msg').stop().animate({ opacity: '100' }).fadeIn(500);
	}).on('mouseleave', function () {
		var someElement = $('.noti-realtime'),
			timeoutId = setTimeout(function () {
				$('div.noti-mouse-hover').fadeOut(2000, function () {
					$('div.noti-mouse-hover').remove();
				});
			}, 5000);
		someElement.data('timeoutId', timeoutId);
	});
}

function requireLogin(next) {
	let url = '/login';
	if (next) {
		let params = new URLSearchParams({ redirect: Base64.encode(next) });
		url += '?' + params.toString();
	}
	window.location = url;
}

$(document).ready(function () {
	var url = "/login/is_login_node?time=" + Math.random();
	$.ajax({
		url: url,
		dataType: 'json',
		success: function (result) {
			if (result != undefined && result) {
				show_noti({ "noti_cnt": result.cnt });
				connect_deep(result.mid, result.token, result.cnt);
			}
		}
	});
	$(document).on('click', '.unfollow_topic', function () {
		var url = "/notifications/notifications/unfollow_topic?time=" + Math.random();
		$.ajax({
			type: 'POST',
			url: url,
			dataType: 'json',
			data: {
				topic_id: $(this).attr("id")
			},
			success: function (rs) {
				if (rs.res == 'success') {
					window.location.href = "/notifications";
				}
			}
		});
	});

	//	$(document).on('click', '.total-noti', function(){
	//		window.location.href = '/notifications';
	//	});

	$(document).on('click', '.noti-realtime-close', function () {
		$(this).parent().remove();
	})

	$.tooltip.simple();
	$.searchbox.suggest(); /*กล่อง search*/
	$.message.openLightbox();
	$.message.previewMessage();
	$.message.editMessage();
	$.message.createMessage();
	$.message.closeLightbox();
	$.message.youtube_thumbnail();/* Load เล่น youtube */
	$.followtags.addtags();
	$.pintags.pin_unpin_tags();
	var tagPopover = new PtTagPopover();
	tagPopover.init();

	$('.icon-media-tool-lightbox').lightboxMedia();
	// tong edit
	$(document).on('click', '.msg-lightbox', function () {
		var el_textarea = $(this).parents('.surround-box-light').next();
		$.image_gallery.defaults.inputUploaded = el_textarea;
		$.image_gallery.defaults.maxUploaded = 20;
		$.image_gallery.defaults.mode = 'multiple';
		$.image_gallery.init();
	});

	/* Spoil */
	$(document).on('click', '.spoil-btn', function () {
		$(this).html('[Spoil] คลิกเพื่อดูข้อความที่ซ่อนไว้').toggleClass('spoil_hide').next().toggle();
		$('.spoil_hide').html('[Spoil] คลิกเพื่อซ่อนข้อความ');
	});

	$(document).on('click', 'a[rel="nofollow"]', function(e){});

	$(document).on("mouseenter", ".unfollow-tag", function (e) {

		e.preventDefault();

		if ($(this).hasClass('btn--secondary')) { // แสดงว่าคือปุ่มกำลังติดตาม
			// เปลี่ยนเป็นปุ่มเลิกติดตาม
			$(this).removeClass('btn--secondary');
			$(this).addClass('btn--unfollow');
			$(this).text('ยกเลิกติดตาม');
		}

	});

	$(document).on("mouseleave", ".unfollow-tag", function (e) {

		e.preventDefault();

		if ($(this).hasClass('btn--unfollow') && !$(this).hasClass('clicked-button')) { // แสดงว่าคือปุ่มเลิกติดตาม
			// เปลี่ยนเป็นปุ่มกำลังติดตาม
			$(this).removeClass('btn--unfollow');
			$(this).addClass('btn--secondary');
			$(this).text('กำลังติดตาม');
		}

	});

	$(document).on("click", ".follow-tag", function (e) {
		e.preventDefault();
		followUnfollowTag('follow', $(this));
	});

	$(document).on("click", ".unfollow-tag", function (e) {
		e.preventDefault();
		$(this).addClass('clicked-button');
		followUnfollowTag('unfollow', $(this));
	});

	// redirect กลับมาหน้าเดิมทุกครั้งหลังจากทำการ Login/Logout เสร็จ
	$('#login-btn,#login-btn-fixed').on('click', $.login.beforeDo);
	$('#logout-btn').on('click', $.logout.afterDo);
});

function unfollowToFollow(element) {
	if (element.hasClass('btn--primary')) { // แสดงว่าคือปุ่มติดตาม
		element.removeClass('btn--primary');

		// เปลี่ยนเป็นปุ่ม "กำลังติดตาม"
		element.addClass('btn--secondary');
		element.removeClass('follow-tag');
		element.addClass('unfollow-tag');
		element.text('กำลังติดตาม');

	}
}

function followToUnfollow(element) {
	if (element.hasClass('btn--unfollow') || element.hasClass('btn--secondary')) { // แสดงว่าคือปุ่มเลิกติดตามหรือกำลังติดตาม
		element.removeClass('btn--secondary');
		element.removeClass('btn--unfollow');
		element.removeClass('unfollow-tag');

		// เปลี่ยนเป็นปุ่ม "ติดตาม"
		element.addClass('btn--primary');
		element.addClass('follow-tag');
		element.text('ติดตาม');
		element.removeClass('clicked-button');
	}
}

function followRollback(follow_type, element) {
	switch (follow_type) {
		case 'follow':
			followToUnfollow(element)
			break;
		case 'unfollow':
			unfollowToFollow(element)
			break;
	}
}

function followUnfollowTag(follow_type, element) {

	var data = {
		'tag_name': element.data('tag'),
		'ts': Date.now()
	};

	switch (follow_type) {
		case 'follow':
			unfollowToFollow(element)
			break;
		case 'unfollow':
			followToUnfollow(element)
			break;
	}

	$.ajax({
		url: '/follow/tag/' + follow_type,
		type: 'post',
		dataType: 'json',
		data: data,
		cache: false,
		success: function (data) {

			if (typeof data.errors !== 'undefined') {
				followRollback(follow_type, element);
				var errors = data.errors;
				switch (errors.code) {
					case 403: {
						requireLogin(window.location.href);
						return false;
					}
					default: {
						errors.error = true;
						validation_error(errors);
						return false;
					}
				}
			} else {
				if (element.hasClass("unfollow-tag-profile")) {
					element.parent().parent().parent().fadeOut('short', function () {
						$(this).remove();
					});
				}
				if (element.hasClass("click-unfollw-tags-page")) {
					var tagElement = element.closest('.pt-tags-listitem-item'); /*ลบ tag ที่โดนยกเลิกติดตามออกจากรายการ */
					$.when($(tagElement).fadeOut(500)).then(function () {
						$(tagElement).fadeOut(500).remove();
						/* เพิ่ม tag ว่างๆ เพื่อแก้ css */
						$.tagDir.addEmptyTag();
						if ($('#my_tag_lists').find('.pt-tags-listitem-item').length == 0) {
							$('#my_tag_lists').removeClass('pt-tags-listitem').addClass('pt-tags-listitem-item-blank');
							$('#my_tag_lists').html('<div class="post-item blank"><div class="post-item-title" style="margin-bottom: 20px;">ยังไม่มีแท็กที่ติดตาม</div></div>');
							$('#my_tag_lists').css('display', 'block');
						}
					}
					);
				}
				if (element.hasClass("click-unfollow-sidebar")) {
					element.closest('.tagshome').fadeOut('short', function () {
						var cnt_tags_follow = $('#cnt-tags-follow').val();
						var count_hide_tags = element.closest('#div-body-tags-sidbar').children('.tagshome').filter(":hidden").size() - 1;
						var count_show_tags = element.closest('#div-body-tags-sidbar').children('.tagshome').filter(":visible").size();

						if (count_hide_tags == 0 && count_show_tags == 0 && cnt_tags_follow < 21) {
							$('#div-body-tags-sidbar').append('<div class="txt-sidebar-follow"><span class="desc">ไม่มีแท็กที่ติดตาม</span></div>');
						}

						if (count_hide_tags == 0 && count_show_tags == 0 && cnt_tags_follow > 20) {
							window.location.reload();
						}

						if (count_show_tags == 0 && count_hide_tags > 0) {
							$('.tagshome').show();
							$('#view-all-15tags').hide();
							$('#view-all-tags').hide();
							$.ajax({
								type: 'POST',
								url: '/follow/tag/get_count_follow_by_member',
								dataType: 'json',
								success: function (data) {
									if (typeof data.errors == 'undefined') {
										cnt_tags_follow = data.count_tags;
										if (data.count_tags > 21) {
											$('#view-all-tags').show();
										} else {
											$('#view-all-tags').hide();
										}
										$('#cnt-tags-follow').val(data.count_tags);
									} else {
										var error = { error: true, error_message: 'เกิดข้อผิดพลาด' }
										validation_error(error);
									}
								}
							});
						}

						element.closest('.tagshome').remove();
					});
				}


			}

		},
		error: function (xhr, textStatus, errorThrown) {
			console.log(errorThrown);
			followRollback(follow_type, element);
		}
	});
}
function closeMeReloadPage(rs) {
	//	console.log(rs.display_avatar);
	//	return false;
	ui_authen();
	display_avatar(rs.display_avatar);
	$('.login_lb_process').remove();
	location.reload();
}
function base64EncodeUnicode(str) {
	if (str.search('ฯ๑ฯ') > -1) {
		return str;
	}
	return encodeURIComponent(str).replace(/%2F/g, 'ฯ๑ฯ');
}

/*facebook share topic count func*/
function processFacebookShareCount(share_url) {
	$.getJSON('https://graph.facebook.com/fql?q=SELECT total_count FROM link_stat WHERE url="' + share_url + '"',
		function (result) {
			fb_share_count = 0;
			if (result.data[0].total_count != undefined) {
				fb_share_count = result.data[0].total_count;
			}
			setFacebookShareCount(fb_share_count);
		});


	return true;
}

function setFacebookShareCount(num) {
	$('#fb-count').html(num);
}

function validation_error(rs) {
	if (rs.reload == true) {
		window.location.reload();
		return false;
	}

	if (rs.error == true) {
		$('.lightbox-hide.remove.ui-dialog-content').remove();
		$('.ui-widget-overlay').remove();
		//หากเป็นต้องการ trust user
		if (rs.need_trust_user == '1') {
			var otp_div = '<div id="otp_dialog">'
				+ '<p class="">' + rs.error_message + '</p>'
				+ '</div>';
			$('div:last').after(otp_div);
			$("#otp_dialog").dialog({
				title: 'แจ้งเตือน',
				resizable: false,
				width: 500,
				modal: true,
				close: function () {
					$('#otp_dialog').dialog('destroy').remove();
				}
			});
			return false;
		}

		/* case แจ้งเตือนข้อหา */
		if (rs.member_notify == 1) {
			$.errorNotice.dialog(rs.error_message, {
				title: 'แจ้งเตือน',
				btn_close: 'รับทราบ',
				action: 'member_notify',
				url: '/login/l_acknowledge',
				validation_user: true,
				param_id: rs.id,
				width: 'auto'

			});
			return false;
		}

		$.errorNotice.dialog(rs.error_message, {
			title: 'แจ้งเตือน',
			width: 'auto'
		});
		return false;
	}
}
/*
 * Create By KonG
 * last update ???????
 **/
function ui_authen($obj) {
	$('.pt-form-comment').bbcode();
	$('.pt-form-sub-comment').bbcode();

	/* prepend ปุ่ม preview ที่ commentหลัก หลัง oauth เสร็จแล้ว */

	//if($('.button-container.main-comment').find('#btn_comment_preview').hasClass('normal-butt') == false)
	if ($('#btn_edit_comment').length <= 0 && $('#btn_comment_preview').length <= 0) {
		$('.button-container.main-comment').prepend('<a id="btn_comment_preview" href="javascript:void(0);"class="button normal-butt"><span><em>Preview</em></span></a>&nbsp;');
	}
	/* prepend ปุ่ม preview ที่ commentตอบกลับ หลัง oauth เสร็จแล้ว */

	//if($('.button-container.sub-comment').find('#btn_reply_preview').hasClass('normal-butt') == false)
	if ($('#btn_edit_reply').length <= 0 && $('#btn_reply_preview').length <= 0) {
		$('.button-container.sub-comment').prepend('<a id="btn_reply_preview" href="javascript:void(0);"class="button normal-butt"><span><em>Preview</em></span></a>&nbsp;');
	}
}

/*
 * Create By KonG
 * last update ???????
 **/
function display_avatar($obj) {
	if ($('#btn_comment_preview').length <= 0 && $('#btn_edit_comment').length <= 0) {
		$('.display-post-action.main-comment').find('.button-container.main-comment').prepend('<a class="button normal-butt" href="javascript:void(0);" id="btn_comment_preview"><span><em>Preview</em></span></a>');
	}
	$('.pt-display-avatar').html(
		'<a href="' + $obj.link + '" class="avatarlink"  target="_blank" >'
		+ '<img src="' + $obj.avatar.medium + '" />'
		+ '</a>'
		+ '<div class="display-post-avatar-inner pt-avatar-inner no-timestamp">'
		+ '<a  target="_blank" class="display-post-name" href="' + $obj.link + '">' + $obj.name + '</a>\n'
		+ '</div>'
	);
	var user_meta = $obj.user_meta;
	var nickname_icon_permission = $obj.nickname_icon_permission;
	if (user_meta != undefined && typeof (nickname_icon_permission) != 'undefined') {
		if (parseInt($obj.mid) <= 140000 && typeof (nickname_icon_permission.member_vip) != 'undefined' && nickname_icon_permission.member_vip != '') {
			$('.pt-avatar-inner').append('<a title="สมาชิกรุ่นเก่า" target="_blank" class="signature-user bg-awards" href="' + $obj.link + '"><img class="icon-signature-mini" src="' + nickname_icon_permission.member_vip + '"></a>\n');
		}
		if (user_meta.icon.type == 'smile' && typeof (nickname_icon_permission.id_card) != 'undefined' && nickname_icon_permission.id_card != '') {
			$('.pt-avatar-inner').append('<a title="สมาชิกอย่างเป็นทางการ" target="_blank" class="signature-user bg-awards" href="' + $obj.link + '"><img class="icon-signature-mini" src="' + nickname_icon_permission.id_card + '"></a>\n');
		}
		else if (user_meta.icon.type == 'mobile' && typeof (nickname_icon_permission.sms) != 'undefined' && nickname_icon_permission.sms != '') {
			$('.pt-avatar-inner').append('<a title="สมาชิกแบบมือถือ" target="_blank" class="signature-user bg-awards" href="' + $obj.link + '"><img class="icon-signature-mini" src="' + nickname_icon_permission.sms + '"></a>\n');
		}
		else if (user_meta.icon.type == 'organization' && typeof (nickname_icon_permission.organization) != 'undefined' && nickname_icon_permission.organization != '') {
			$('.pt-avatar-inner').append('<a title="สมาชิกแบบองค์กร" target="_blank" class="signature-user bg-awards" href="' + $obj.link + '"><img class="icon-signature-mini" src="' + nickname_icon_permission.organization + '"></a>\n');
		}
		else if (user_meta.icon.type == 'registered' && typeof (nickname_icon_permission.email) != 'undefined' && nickname_icon_permission.email != '') {
			$('.pt-avatar-inner').append('<a title="สมาชิกแบบอีเมล" target="_blank" class="signature-user bg-awards" href="' + $obj.link + '"><img class="icon-signature-mini" src="' + nickname_icon_permission.email + '"></a>\n');
		}
		else if (user_meta.icon.type == 'scientist') {
			$('.pt-avatar-inner').append('<a title="สมาชิกแบบ..." target="_blank" class="icon-memberbadge-mini icon-memberbadge-aisbrand" href="' + $obj.link + '"></a>\n');
		}

		if (user_meta.facebook && typeof (user_meta.facebook.id) != 'undefined' && user_meta.facebook.id != '' && typeof (nickname_icon_permission.facebook) != 'undefined' && nickname_icon_permission.facebook != '') {
			$('.pt-avatar-inner').append('<a title="สมาชิกลงทะเบียน facebook" target="_blank" class="signature-user bg-awards" href="' + $obj.link + '"><img class="icon-signature-mini" src="' + nickname_icon_permission.facebook + '"></a>\n');
		}
		if (user_meta.google && typeof (user_meta.google.id) != 'undefined' && user_meta.google.id != '' && typeof (nickname_icon_permission.google) != 'undefined' && nickname_icon_permission.google != '') {
			$('.pt-avatar-inner').append('<a title="สมาชิกลงทะเบียน google" target="_blank" class="signature-user bg-awards" href="' + $obj.link + '"><img class="icon-signature-mini" src="' + nickname_icon_permission.google + '"></a>\n');
		}
		if (user_meta.line && typeof (user_meta.line.id) != 'undefined' && user_meta.line.id != '' && typeof (nickname_icon_permission.line) != 'undefined' && nickname_icon_permission.line != '') {
			$('.pt-avatar-inner').append('<a title="สมาชิกลงทะเบียน line" target="_blank" class="signature-user bg-awards" href="' + $obj.link + '"><img class="icon-signature-mini" src="' + nickname_icon_permission.line + '"></a>\n');
		}
		if (user_meta.apple && typeof (user_meta.apple.id) != 'undefined' && user_meta.apple.id != '' && typeof (nickname_icon_permission.apple) != 'undefined' && nickname_icon_permission.apple != '') {
			$('.pt-avatar-inner').append('<a title="สมาชิกลงทะเบียน apple" target="_blank" class="signature-user bg-awards" href="' + $obj.link + '"><img class="icon-signature-mini" src="' + nickname_icon_permission.apple + '"></a>\n');
		}
		if (user_meta.expert != undefined && user_meta.small_expert_icon != undefined) {
			$('.pt-avatar-inner').append('<a title="Expert Account ด้าน' + user_meta.expert.expert_type + '" class="icon-expertbadge-mini" href="' + $obj.link + '" target="_blank"><img class="icon-expert-mini" src="' + user_meta.small_expert_icon + '"/></a>\n');

			if ($('#btn_comment').next('div.display-checkbox-expert').length == 0) {
				$('#btn_comment').after('&nbsp;&nbsp;<div class="display-checkbox-expert"><input id="expert_comment" type="checkbox"><label for="expert_comment">ตอบในฐานะ Expert Account2</label></div>');
			}
		}
		if (user_meta.signature != undefined && user_meta.signature.name != undefined && user_meta.signature.url != undefined) {
			$('.pt-avatar-inner').append('<a title="' + user_meta.signature.name + '" class="signature-user bg-awards" href="' + $obj.link + '" target="_blank"><img class="icon-signature-mini" src="' + user_meta.signature.url + '"/></a>\n');
		}
		if (user_meta.bloggang != undefined) {
			$('.pt-avatar-inner').append('<a title="BlogGang" class="icon-memberbadge-mini icon-memberbadge-bloggang" href="' + user_meta.bloggang.link + '"></a>\n');
		}
		if (user_meta != undefined && user_meta.bloggang != undefined && user_meta.bloggang.id != null && user_meta.bloggang.reward != null) {
			$('.pt-avatar-inner').append('<a class="signature-user bg-awards" target="_blank" href="' + user_meta.bloggang.link + '"><img class="icon-signature-mini" src="' + user_meta.bloggang.reward_path + user_meta.bloggang.reward + '"/></a>');
		}
	}


}


/* tong edit */


(function ($) {
	$.logout = {};
	$.logout.afterDo = function (event) {
		event.preventDefault();
		var cur_url = window.location.href;
		window.location = '/logout?redirect=' + Base64.encode(cur_url);
	}

	$.login = {};
	$.login.beforeDo = function (event) {
		event.preventDefault();
		// get current url
		var cur_url = window.location.pathname;
		if (cur_url != '/login') {
			window.location = '/login?redirect=' + Base64.encode(cur_url);
		}

	}
})(jQuery);


// Controll Ajax Queue
var ajaxSending = false;
$.ajaxSetup({
	beforeSend: function () {
		var classname = '';
		if (targetElement) {
			classname = $(targetElement).attr('class');
		}
		if (classname != 'edit-title-image-button' && classname != 'error-txt') {
			ajaxSending = true;
		}
	},
	complete: function () {
		var classname = '';
		if (targetElement) {
			classname = $(targetElement).attr('class');
		}
		if (classname != 'edit-title-image-button' && classname != 'error-txt') {
			ajaxSending = false;
		}
		targetElement = null;
	}
});

/* End: tong edit */
(function ($) {

	$.fn.authentication = function (options, callback) {
		var $this = $(this);
		var settings = $.extend({}, $.fn.authentication.defaults, options);
		$this.openLogin(settings);
		$this.submitLogin(settings, callback);
	};
	$.fn.submitLogin = function (options, callback) {

		$(document).on('click', options.elSubmit, function () {
			$.ajax({
				dataType: 'json',
				url: options.urlSubmit,
				type: 'POST',
				data: $('#login_lb_form').serialize(),
				success: function (rs) {
					//					console.log(rs);
					if (rs != null && rs.success == 1) {
						if (typeof callback == 'function') {
							callback.call(this, rs);
						}
					}
				}
			});
		});
	}

	$.fn.openLogin = function (options) {


		/* create div */
		$('.footer').after('<div class="lightbox-hide ' + options.elClass + '"></div>');
		$.ajax({
			//			dataType : 'json',
			type: "POST",
			url: '/login/l_login',
			data: {

			},
			success: function (rs) {
				$('.' + options.elClass).dialog({
					width: 500,
					title: options.elTitle,
					modal: true,
					resizable: false,
					draggable: false,
					close: function () {
						$('.' + options.elClass).dialog('destroy').remove();

					}
				}).append(rs);
			}
		});
	}
	$.headerScroll = {};
	$.headerScroll.fixed = function () { };
	$.notification = {};
	$.notification.menuMsg = function (mid) {
		if (mid != '') {
			var pm_url = window.location.pathname;
			if (pm_url != '/message') {
				get_notification_pm(mid);
			}
			else {
				setTimeout(function () {
					get_notification_pm(mid);
				}, 5000);
			}
		}
	}
	$.notification.defaults = {

	}

	$.message = {};

	$.message.defaults = {
		sending: false
	}

	$.message.youtube_thumbnail = function () {
		$(document).on('click', '.youtube-thumbnail a', function () {
			// set parrent.
			var par = $(this).parent('.youtube-thumbnail');
			// get "video_id".
			var video_id = par.find('.video_id').data('video-id');
			// get video resolution.
			var vdo = par.find('.video_preview');
			var vdo_height = vdo.attr('height');
			var vdo_width = vdo.attr('width');
			// remove "play_btn".
			par.find('.play_btn').remove();
			// render youtube iframe.
			var oldIE = (navigator.userAgent.match(/msie [567]/i));
			if (oldIE) {
				par.html('<object width="' + vdo_width + '" height="' + vdo_height + '" >'
					+ '<param name="movie" value="https://www.youtube.com/v/' + video_id + '?autoplay=1&amp;version=3" >'
					+ '</param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param>'
					+ '<embed src="https://www.youtube.com/v/' + video_id + '?autoplay=1&amp;version=3" type="application/x-shockwave-flash" '
					+ 'width="' + vdo_width + '" height="' + vdo_height + '" allowscriptaccess="always" allowfullscreen="true"></embed>'
					+ '</object>');
			}
			else {
				par.html('<iframe type="text/html" width="' + vdo_width + '" height="' + vdo_height + '"'
				    + 'src="https://www.youtube.com/embed/' + video_id + '?autoplay=1"' + 'title="Youtube video player"'
					+ 'frameborder="0">'
					+ '</iframe>');
			}
			return false;
		});

	}

	$.message.openLightbox = function () {

		$(document).on('click', '.send_message', function () {
			if ($.message.defaults.sending == false) {
				$.message.defaults.sending = true;
				$(document.body).data('obj',
					{
						'objSend': $(this)
					});

				$(this).force_login({
					callback: open_form_message,
					auto_click: false
				});
			}
		});
	}

	function previewClicked() {
		set_json($(this));
		var parents = $(this).parents('#div_message');
		var action = parents.find('#form_msg');
		var textarea_msg = parents.find('#textarea_msg');
		var preview = parents.find('#preview_msg');

		$('.loading-inline').remove();
		//		action.append('<span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
		parents.find('#cancel_create_msg').after('<span class="loading-inline focus-txt">&nbsp;&nbsp;กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
		$.ajax({
			type: "POST",
			url: "/message/private_message/render_bbcode_ajax",
			dataType: 'json',
			data: {
				msg: $.data(document.body).msg
			},
			success: function (rs) {
				textarea_msg.hide();
				preview.show();
				$('.loading-inline').remove();
				if (rs.detail == '') {
					rs.detail = '-';
				}
				preview.find('#preview_detail .plain-value').html(rs.detail);
			}
		});
	}


	$.message.previewMessage = function () {
		$('#btn_msg_preview').on('click', previewClicked);
	}

	$.message.editMessage = function () {
		$(document).on('click', '#btn_edit_msg', function () {
			var parents = $(this).parents('#div_message');
			var action = parents.find('#form_msg');
			var textarea_msg = parents.find('#textarea_msg');
			var preview = parents.find('#preview_msg');

			//			action.append('<span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
			parents.find('#create_msg').after('<span class="loading-inline focus-txt">&nbsp;&nbsp;กำลังโหลดข้อมูล โปรดรอสักครู่</span>');
			//var loading = parents.find('.loading-inline');
			//			return false;

			textarea_msg.show();
			//button.show();
			parents.find('#error_subject').html('');
			parents.find('#error_detail').html('');
			$('.loading-inline').remove();
			preview.hide();
			//			parents.find('.jqEasyCounterMsg').hide();
			parents.find('.error-txt').html('');
			//			$.message.previewMessage();
		});
	}

	$.message.createMessage = function () {
		$(document).on('click', '#create_msg', function () {
			set_json($(this));
			var cnt_error = 0;
			var parent_msg = $(this).parents('#div_message');
			var json = $.data(document.body).msg;

			if ($.data(document.body).reciever.mid.length == 0 && $('#recievers').val() != '') {
				cnt_error = cnt_error + 1;
				parent_msg.find('#error_reciever').html('กรุณากรอกชื่อผู้รับ ให้ถูกต้อง');
			}
			else if ($.data(document.body).reciever.mid.length == 0) {
				cnt_error = cnt_error + 1;
				parent_msg.find('#error_reciever').html('กรุณากรอกชื่อผู้รับ');
			}
			else {
				cnt_error = cnt_error;
				parent_msg.find('#error_reciever').html('');
			}

			if (json.subject_raw == '') {
				cnt_error = cnt_error + 1;
				parent_msg.find('#error_subject').html('กรุณากรอกชื่อเรื่อง');
			}
			else {
				cnt_error = cnt_error;
				parent_msg.find('#error_subject').html('');
			}

			if (json.detail_raw == '') {
				cnt_error = cnt_error + 1;
				parent_msg.find('#error_detail').html('กรุณากรอกข้อความ');
			}
			else {
				cnt_error = cnt_error;
				parent_msg.find('#error_detail').html('');
			}

			if (cnt_error == 0) {
				parent_msg.find('.error-txt').html('');
				$.ajax({
					type: "POST",
					url: "/message/private_message/create_message",
					dataType: 'json',
					data: {
						msg: $.data(document.body).msg,
						reciever: $.data(document.body).reciever
					},
					success: function (rs) {
						//console.log(rs);
						//alert(result);
						//						if(rs.error == true)
						//						{
						//							$.errorNotice.dialog(rs.error_message,{
						//								title : 'แจ้งเตือน',
						//								//width : 'auto',
						//								btn_close:'ตกลง'
						//							});
						//							return false;
						//						}
						validation_error(rs);

						if (rs.result == "true") {
							//						$('#message').dialog("destroy");
							$('#div_message').removeClass('callback-status error-txt').html('ส่งข้อความเรียบร้อยแล้ว<div class="button-container"><a href="javascript:void(0);" id="cancel_create_msg" class="button normal-butt"><span><em>ปิดหน้าต่างนี้</em></span></a></div>');
						}
						if (rs.result == "false" && rs.friend != null) {
							$('#error_friends').html(rs.friend);
						}
					} // endif success function
				});
			}
			//alert('create_msg');
		});
	}

	$.message.closeLightbox = function () {
		$(document).on('click', '#cancel_create_msg', function () {
			$('#message').dialog('destory');
			$('#message').remove();
			$('#links_lb_process').remove();
		});
	}

	// search box is under testing

	$.searchbox = {};
	$.searchbox.suggest = function () {
		//search-version-2
		//begin auto cmpl
		var term = "";
		var xhr_nav_search = null;
		var count_li = 0;

		var last_li_search;
		var search_keyword = '';

		$("#search-box").autocomplete({
			minLength: 0,
			delay: 500,
			source: function (request, response) {
				request.term = $("#search-box").val();
				search_keyword = $("#search-box").val();
				if (request.term.length !== 0 && $.trim(request.term).length !== 0) {
					if (xhr_nav_search !== null) {
						xhr_nav_search.abort();
					}
					xhr_nav_search = $.ajax({
						type: "POST",
						dataType: 'json',
						url: '/search/search/nodejs_api',
						data: {
							qmini: encodeURI(request.term)
						},
						success: function (rs) {
							var result = rs.data;
							count_li = 0;
							//var result = JSON.parse(rs.words).concat(rs.tags.data);	
							response(result);
						}
					});
					term = request.term;
				}
				else {
					
					var result_local = getLocalStorageRecent();
					if(result_local.length <= 0){
						result_local.push({status:'empty'});
					}

					if (xhr_nav_search !== null) {
						xhr_nav_search.abort();
					}
					xhr_nav_search = $.ajax({
						type: "POST",
						dataType: 'json',
						url: '/search/search/api_get_recent',
						success: function (rs) {
							var result_json = rs.data;
							count_li = 0;
							if(!rs.success){
								response(result_local);		
							}else{
								if(result_json.length <= 0){
									response([{status:'empty'}]);
								}else{
									response(result_json);
								}
							}
						}
					});
				}
			},
			focus: function( event, ui ) {
				event.preventDefault();
				$('.search-list').css("background-color", "#312f50");
				$('.search-list').removeClass("list-add-color");
				$('#block-'+ui.item.count_id).css("background-color", "#22203e");
				$('#block-'+ui.item.count_id).addClass("list-add-color");
				$('#removeblock-'+ui.item.count_id).css("background-color", "#22203e");
				$('#removeblock-'+ui.item.count_id).addClass("list-add-color");
			},
			select: function (event, ui) {
				event.preventDefault();
				if(count_li > 0){

					var type = $( this ).attr('data-block-type')
					if(type == 'removeblock'){
						var url = $('#removeblock-'+count_li).attr('data-url');
						var block_id = '#removeblock-1'
					}else{
						var url = $('#block-'+count_li).attr('data-url');
						var block_id = '#block-'+count_li
					}
	
					if(url != null && url != undefined){
						if($(block_id).attr('data-status') == 'api'  || $(block_id).attr('data-status') == 'local'){
							saveLocalStorageRecent($(block_id))
						}
						$.ajax({
							type: 'POST',
							url: '/search/search/ref',
							dataType: 'json',
							async:    false,
							data: {
								type: encodeURI($(block_id).attr('data-type')),
								id: $(block_id).attr('data-id'),
								title: encodeURI($(block_id).attr('data-title')),
								url: $(block_id).attr('data-url'),
								avatar: encodeURI($(block_id).attr('data-avatar')),
								keyword : $('#search-box').val()
							},
							success: function (data) {
								window.open(data.url, '_blank');
							}
						});
					}
				}
				return false;
			},
			open: function (){
				// $('.search-list').removeClass('ui-menu-item');
				$('.search-list > a').removeClass('ui-corner-all');
			},
			close: function (){
				count_li = 0;
			}

		}).data("autocomplete")._renderMenu = function (ul, item) {
			var count_words = 0;
			var count = 0;
			var count_id = 0;
			if(item[0].status == 'empty'){
				ul.append('<div class="search-box-recent ">ไม่มีการค้นหาล่าสุด</div>'); 
			}
			else if(item[0].status == 'local' || item[0].ref_id != null){
				if(item[0].status == 'local'){
					var status = 'local';
				}else{
					var status = 'recent_api';
				}
				ul.append('<div class="search-box-recent "><span class="search-recnt-text" style="white-space: nowrap;">การค้นหาล่าสุด</span><a href="" class="search-recnt-link" data-status="'+status+'" style="color: rgba(233, 229, 246, 0.6);" id="remove-all" >ล้างการค้นหา</a></div>'); 
			}

			ul.addClass('search-lists-box'); 
			$.each(item, function (index, item) {
				if (item.type == undefined) {
					count_words++;
				}
			})
			$.each(item, function (index, item) {
				count_id++;
				
				const htmlEntities = function (str) {
					return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
				}

				let searchTitle = htmlEntities(item.title);

				var item_type = 0
				if(item.type != null){
					item_type = item.type
				}

				var avatar = '<span class="search-list-icon" style="background-image: url(\''+item.avatar+'\');';
				avatar += 'background-size: cover; background-position: center; background-repeat: no-repeat;"></span>';

				var title = '<span class="search-list-text">';
				
				
				if(item.type != 'search_room' && item.type != 'search_all'){
					if(item.forum_tag != null){
						var type_th = 'ห้องที่มีแท็ก "' + item.forum_tag + '"';
					}else{
						var type_th = item.type_th;
					}
					title += '<span id="block-title-' + count_id + '" class="search-list__primary-text" >' + searchTitle + '</span>';
					title += '<span id="block-subtitle-'+count_id+'" class="search-list__secondary-text">'+type_th+'</span></span>';
				}else{
					if (item.ref_id != null) {
						title += '<span id="block-title-' + count_id + '" class="search-list__primary-text" >' + searchTitle + '</span>';
					} else {
						title += '<span id="block-title-' + count_id + '" class="search-list__primary-link" >' + searchTitle + '</span>';
					}
				}

				var data_type = 'data-url="' + encodeURI(item.url) + '" data-type_th="' + item.type_th + '" data-id="' + item.id + '"'
				data_type += ' data-type="'+item_type+'" data-avatar="'+item.avatar+'"  '

				var select_style = 'display:flex; cursor:pointer; padding: 0 16px;'

				item.count_id = count_id;

				if(item.status == 'local'  || item.ref_id != null){

					if(item.status == 'local' ){
						data_type +='data-status="local"';
					}else{
						data_type +='data-status="recent_api" data-ref="'+item.ref_id+'" data-mode="word" ';
					}

					if(item.type == 'search_room' || item.type == 'search_all'){
						title += '<span class="search-list__secondary-text">'+item.type_th+'</span></span>';
					}

					data_type += ' data-title="' + searchTitle + '"'
					
					var button = '<button id="removeblock-button-'+count_id+'" class="search-recnt-cancel" data-type="'+count_id+'" '+data_type+'><img src="https://ptcdn.info/search/icon/ic-close-512px.png" alt="cancel"></button>';
					var id_block = ' id="removeblock-'+count_id+'" ';
					return $('<li '+data_type+' '+id_block+'  data-block-type="block"></li>')
						.addClass('search-list search-list-recent pt-search-test')
						.data("item.autocomplete", item)
						.append('<a href="#" _target="_blank" style="'+select_style+'">'+avatar+ ''+title+'</a> '+button+'')
						.appendTo(ul);
				}else if(item.status == 'empty'){
					;
				}else{
					if(item.id == 0){
						data_type += ' data-title="' + htmlEntities(term) + '"'
					}else{
						data_type += ' data-title="' + searchTitle + '"'
					}
					data_type +='data-status="'+item.status+'"';
					return $('<li '+data_type+' id="block-'+count_id+'" data-block-type="removeblock"></li>')
						.addClass('search-list pt-search-test')
						.data("item.autocomplete", item)
						.append('<a href="#" _target="_blank" style="'+select_style+'">'+avatar+ ''+title+'</a>')
						.appendTo(ul);
				}

			});
		};
		
		$( "#search-box" ).keyup(function(event) {
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if(keycode == 13){
				$( ".search-list" ).each(function( index ) {
					if($( this ).hasClass('list-add-color')){
						send_ref($(this))
					}
				});
			}else{

				var type = $( this ).attr('data-block-type')

				if(type == 'removeblock'){
					var last_id = 'removeblock-'+$('.search-list').length
					var last_li_search_name = 'removeblock-1'
				}else{
					var last_id = 'block-'+$('.search-list').length
					var last_li_search_name = 'block-1'
				}


				$( ".search-list" ).each(function( index ) {
					if($( this ).hasClass('list-add-color')){
						if(last_li_search != 'undefined '){
							if(last_li_search == $( this ).attr('id') ){
								if(last_li_search == last_li_search_name && keycode == 40){
									// $( this ).css("background-color", "#312f50");
								}else if(last_id == last_li_search && keycode == 38){
									// $( this ).css("background-color", "#312f50");
								}else{
									$( this ).css("background-color", "#312f50");
								}
							}
						}
						last_li_search = $( this ).attr('id')
					}
				});
			}
		});


		function send_ref(val){
			if(val.attr('data-status') == 'api' || val.attr('data-status') == 'local'){
				saveLocalStorageRecent(val)
			}

			$.ajax({
				type: 'POST',
				url: '/search/search/ref',
				dataType: 'json',
				async:    false,
				data: {
					type: encodeURI(val.attr('data-type')),
					id: val.attr('data-id'),
					title: encodeURI(val.attr('data-title')),
					url: val.attr('data-url'),
					avatar: encodeURI(val.attr('data-avatar')),
					keyword : $('#search-box').val()
				},
				success: function (data) {
					window.open(data.url, '_blank');
				}
			});
		}


		function getLocalStorageRecent(){
			var data = []
			var recent = localStorage.getItem('recent');
			if(recent != null){
				data = JSON.parse(recent)
			}
			return data;
		}

		function saveLocalStorageRecent(jquery){
			saveLocalStorage(jquery.attr('data-type_th'), 
							jquery.attr('data-id'), 
							jquery.attr('data-title'), 
							jquery.attr('data-url'), 
							jquery.attr('data-avatar'),
							'local')
		}

		function checkDuplicateData(data, keyword, type_th){
			var count = false;
			for (var i = 0; i < data.length; i++) {
				if(data[i].title == keyword && data[i].type_th == type_th){
					count = i;
					break;
				}
			} 

			if(count !== false){
				data.splice(count, 1);
			}
			return data;
		}

		function saveLocalStorage(type_th, id, title, url, avatar, status){
			if(avatar == 'word')
				avatar = 'https://ptcdn.info/search/icon/word.png';

			if (avatar.indexOf('search.png') > -1) {
				avatar = 'https://ptcdn.info/search/icon/word.png';
			}

			var data = getLocalStorageRecent();
			data = checkDuplicateData(data, title, type_th);
			
			var temp = {
				type_th: type_th,
				id: id,
				title: title,
				url: url,
				avatar: avatar,
				status: status
			}
			data.unshift(temp)
			if(data.length >10){
				data.splice(-1,1)
			}
			localStorage.setItem('recent', JSON.stringify(data));
			
		}

		function apiSaveRecent(keyword, source_id, type){
			$.ajax({
				type: 'POST',
				url: '/search/search/api_save_recent',
				dataType: 'json',
				data: {
					keyword: encodeURI(keyword),
					source_id: source_id,
					type : type
				},
				success: function (data) {
					//console.log(data)
				}
			});
		}

		function getPositionRecent(data, keyword, type_th){
			var count = false;
			for (var i = 0; i < data.length; i++) {
				if(data[i].title == keyword && data[i].type_th == type_th){
					count = i;
					break;
				}
			} 
			return count;
		}

		//on mouseleave
		$('.ui-autocomplete').on('mouseleave', '.search-list', function(){
			$('.search-list').css("background-color", "#312f50");
			$('.search-list').removeClass("list-add-color");
			$( "#search-box" ).focus();
		});

		//remove mouseover
		$('.ui-autocomplete').on('mouseover', '.search-recnt-cancel', function(){
			var id = $(this).attr('data-type');
			$('.search-list').css("background-color", "#312f50");
			$('.search-list').removeClass("list-add-color");
			$('#block-'+id).css("background-color", "#22203e");
			$('#block-'+id).addClass("list-add-color");
			$('#removeblock-'+id).css("background-color", "#22203e");
			$('#removeblock-'+id).addClass("list-add-color");
		});

		//remove recent
		$('.ui-autocomplete').on('click', '.search-recnt-cancel', function(){
			var id = $(this).attr('data-type');
			var status = $(this).attr('data-status');
			if(status == 'recent_api'){
				$.ajax({
					type: 'POST',
					url: '/search/search/api_remove_recent',
					dataType: 'json',
					data: {
						type: $(this).attr('data-mode'),
						ref_id: $(this).attr('data-ref'),
					},
					success: function (data) {
						$('#removeblock-'+id).empty();
						if(data.length <= 0){
							$('.search-box-recent').text("ไม่มีการค้นหาล่าสุด");
						}
					}
				});
			}else{
				var data = getLocalStorageRecent();
				var count = getPositionRecent(data, $(this).attr('data-title'), $(this).attr('data-type_th'))
				if(count !== false){
					data.splice(count, 1);
					localStorage.removeItem('recent')
					localStorage.setItem('recent', JSON.stringify(data));
					$('#removeblock-'+id).empty();
					if(data.length <= 0){
						$('.search-box-recent').text("ไม่มีการค้นหาล่าสุด");
					}
				}
			}
			return false;
		});

		//remove all
		$('.ui-autocomplete').on('click', '.search-recnt-link', function(){
			//data-status
			var status = $(this).attr('data-status');
			if(status == 'local'){
				$('.search-box-recent').text('ไม่มีการค้นหาล่าสุด');
				$('.search-list').empty();
				localStorage.removeItem('recent')
			}else{
				$.ajax({
					type: 'POST',
					url: '/search/search/api_remove_recent',
					dataType: 'json',
					data: {
						type: 'all',
						ref_id: null,
					},
					success: function (data) {
						$('.search-box-recent').text('ไม่มีการค้นหาล่าสุด');
						$('.search-list').empty();
					}
				});
			}
			return false;
		});

		//click list
		$('.ui-autocomplete').on('click', '.search-list', function(){
			if($(this).attr('data-status') == 'api' || $(this).attr('data-status') == 'local'){
				saveLocalStorageRecent($(this))
			}

			$.ajax({
				type: 'POST',
				url: '/search/search/ref',
				dataType: 'json',
				async:    false,
				data: {
					type: encodeURI($(this).attr('data-type')),
					id: $(this).attr('data-id'),
					title: encodeURI($(this).attr('data-title')),
					url: $(this).attr('data-url'),
					avatar: encodeURI($(this).attr('data-avatar')),
					keyword : $('#search-box').val()
				},
				success: function (data) {
					window.open(data.url, '_blank');
				}
			});
		});

		$("#search-box").keypress(function (event) {
			var keycode = (event.keyCode ? event.keyCode : event.which);
			var txt = $("#search-box").val();
			if (keycode == '13' && $.trim(txt) != "") {
				url = "//" +window.location.hostname + "/search?q=" + encodeURIComponent($.trim(txt));
				window.open(url, '_blank');
				$.ajax({
					type: 'POST',
					url: '/search/search/api_get_recent',
					dataType: 'json',
					success: function (rs) {
						if(!rs.success){
							saveLocalStorage('คำค้นหา', 0, txt, url, 'word', 'local')
						}else{
							apiSaveRecent(txt, 0, 'search_all')
						}
					}
				});
			}
		});

		$("#search-box").on("click", function (e) {
			$("#search-box").autocomplete("search", "");
		});

		$(".pt-ic-search").on('click', function () {
			var txt = $("#search-box").val();
			if ($.trim(txt) != "") {
				url = "//" +window.location.hostname + "/search?q=" + encodeURIComponent($.trim(txt));
				window.open(url, '_blank');
			}
		});

		if ($('#search-folow-tag').length == 1) {
			//start: search follow tag 2018
			$("#search-folow-tag").autocomplete({
				minLength: 0,
				delay: 500,
				source: function (request, response) {
					if (request.term.length !== 0 && $.trim(request.term).length !== 0) {
						if (xhr_nav_search !== null) {
							xhr_nav_search.abort();
						}
						xhr_nav_search = $.ajax({
							type: "POST",
							dataType: 'json',
							url: '/search/search/search_words_and_tag',
							data: {
								qmini: $.trim(request.term)
							},
							success: function (rs) {
								var result = rs.tags.data;
								//var result = JSON.parse(rs.words).concat(rs.tags.data);					
								response(result);
							}
						});
						term = request.term;
					}
					else {
						$('.ui-autocomplete').empty();
					}
				},
				focus: function (event, ui) {
					if (ui.item !== undefined) {
						$("#search-folow-tag").val(ui.item.label);
					}
					return false;
				},
				select: function (event, ui) {
					var url = "";
					if (ui.item.type !== undefined) {
						url = tags_url + ui.item.label;
					}
					else {
						url = search_url + "?q=" + ui.item.label;
					}
					//window.open(url, '_blank');
					return false;
				}

			})
				.data("autocomplete")._renderMenu = function (ul, item) {
					var count_words = 0;
					var count = 0;
					$.each(item, function (index, item) {
						if (item.type == undefined) {
							count_words++;
						}
					})
					$.each(item, function (index, item) {
						if (item.value != false) {
							if (item.type == undefined) {
								count++;
								//words
								if (count_words == count) {
									return $('<li style="border-bottom: 1px solid rgba(255,255,255,.2);">')
										.data("item.autocomplete", item)
										.append('<a style="line-height: 2;">' + item.label + '</a>')
										.appendTo(ul);
								} else {
									return $('<li>')
										.data('item.autocomplete', item)
										.append('<a style="line-height: 2;">' + item.label + '</a>')
										.appendTo(ul);
								}

							} else {
								//tags
								return $('<li>')
									.data("item.autocomplete", item)
									.append('<a style="line-height: 2;"> <span class="icon-tag-inline"></span> ' + item.label + '</a>')
									.appendTo(ul);
							}
						}
					});
				};
		}


	}// end search box

	$.pintags = {};
	$.pintags.pin_unpin_tags = function () {

		$(document).on('click', '.icon-opt_menu', function () {
			$('.pt-menu-surface').hide();
			var pin = $(this).parent().find('.pt-menu-surface').data('pin');
			if (pin == 1) {
				$(this).parent().find('.pt-menu-surface ul li.pin-unpin').html('<a href="javascript:void(0);">ยกเลิกปักหมุด</a>');
			} else {
				$(this).parent().find('.pt-menu-surface ul li.pin-unpin').html('<a href="javascript:void(0);">ปักหมุดไว้บนสุด</a>');
			}
			$(this).parent().find('.pt-menu-surface').fadeToggle();
		});

		//click close toggle
		$(document).click(function (e) {
			var roomexpand = $(".pt-menu-surface");
			if (!$(e.target).hasClass('icon-opt_menu')) {
				roomexpand.fadeOut();
			}
		});

		// ESC close toggle
		$(document).keydown(function (e) {
			var roomexpand = $(".pt-menu-surface");
			if (e.keyCode === 27) {
				roomexpand.fadeOut();
			}
		});

		$(document).on("click", ".click-pinunpin-sidebar", function (e) {
			var tag_name = $(this).data("tag");
			var ispin = $(this).data("pin");
			var list = $(this).closest('.tagshome');
			//console.log(tag_name + ' ' + ispin );		
			if (tag_name != '') {
				if (ispin == 1) {
					//console.log('unpin');
					$.pintags.unpintags(tag_name, function () {
						list.fadeOut(500, function () {
							window.setTimeout(function () {
								$(list).find('.pt-menu-surface').data('pin', 0);
								$(list).find('.pt-menu-surface ul li.click-pinunpin-sidebar').text('ปักหมุดไว้บนสุด');
								$(list).find('.pt-menu-surface ul li.click-pinunpin-sidebar').data('pin', 0);
								$('#div-body-tags-sidbar').append(list);
								list.fadeIn(500);
							}, 600);
						});
					});
				} else {
					//console.log('pin');	
					$.pintags.pintags(tag_name, function () {
						list.fadeOut(500, function () {
							window.setTimeout(function () {
								$(list).find('.pt-menu-surface').data('pin', 1);
								$(list).find('.pt-menu-surface ul li.click-pinunpin-sidebar').text('ยกเลิกปักหมุด');
								$(list).find('.pt-menu-surface ul li.click-pinunpin-sidebar').data('pin', 1);
								$('#div-body-tags-sidbar').prepend(list);
								list.fadeIn(500);
							}, 600);
						});
					});
				}

			} else {
				var error = { error: true, error_message: 'เกิดข้อผิดพลาด' }
				validation_error(error);
			}
		});
	}

	$.followtags = {};
	$.followtags.addtags = function () {

		if ($('#box-sidebar-followtags').length == 1) {

			//click link head add tags sidebar			
			$(document).on('click', '.link-add-tagsidebar', function () {
				$(this).hide();
				$('.link-add-tagsidebar-finish').show();
				$('.tagshome-search').fadeIn();
			});
			//click link head finish tags sidebar
			$(document).on('click', '.link-add-tagsidebar-finish', function () {
				$(this).hide();
				$('.link-add-tagsidebar').show();
				$('.tagshome-search').fadeOut();
			});

			//click link all tags sidebar
			$('#view-all-15tags').on('click', function () {
				$('.tagshome').show();
				$('#view-all-15tags').hide();
				$.ajax({
					type: 'POST',
					url: '/follow/tag/get_count_follow_by_member',
					dataType: 'json',
					success: function (data) {
						if (typeof data.errors == 'undefined') {
							if (data.count_tags > 21) {
								$('#view-all-tags').show();
							}
							$('#cnt-tags-follow').val(data.count_tags);
						} else {
							var error = { error: true, error_message: 'เกิดข้อผิดพลาด' }
							validation_error(error);
						}
					}
				});
			});
		}

		//ADD FOLLOW TAGS
		if ($('#search-folow-tag').length == 1) {
			$('#add-tags-sidebar').on('click', function () {
				var tag_name = $("#search-folow-tag").val();
				if (tag_name != '') {
					$.ajax({
						type: "POST",
						url: "/follow/tag/follow",
						dataType: 'json',
						data: {
							tag_name: tag_name
						},
						success: function (data) {
							if (typeof data.errors !== 'undefined') {
								var errors = data.errors;
								switch (errors.code) {
									case 403: {
										$('#add-tags-sidebar').force_login({
											callback: closeMeReloadPage,
											auto_click: false
										});
										return false;
									}
									default: {
										$('#search-folow-tag').val('');
										errors.error = true;
										validation_error(errors);
										return false;
									}

								}

							} else {

								$('#search-folow-tag').val('');
								data.topic_count = data.topic_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
								var txt_unread = '';
								if (data.unread > 0) {
									txt_unread = data.unread + ' กระทู้ใหม่';
								}
								if (data.unread > 20) {
									txt_unread = '20+ กระทู้ใหม่';
								}

								var list = '<div class="tagshome" >'
									+ '<a target="_blank" href="/tag/' + data.tag_name + '" class="followed-tag" id="' + data.tag_name + '">'
									+ '<h1>' + data.tag_name + '</h1>'
									+ '<span>' + txt_unread + '</span>'
									+ '</a>'
									+ '<i class="icon-opt_menu" title="ตัวเลือก"></i>'
									+ '<div class="pt-menu-surface pt-menu-surface-mini" data-pin="0"> '
									+ '<ul>'
									+ '<li class="click-unfollow-sidebar unfollow-tag" data-tag="' + data.tag_name + '">'
									+ '<a href="javascript:void(0);"> ยกเลิกติดตาม</a>'
									+ '</li>'
									+ '<li class="pin-unpin click-pinunpin-sidebar" data-tag="' + data.tag_name + '" data-pin="0">'
									+ '</li>'
									+ '</ul>'
									+ '</div>'
									+ '</div>';

								if ($('.txt-sidebar-follow').is(":visible")) {
									$('.txt-sidebar-follow').hide();
								}
								$('#div-body-tags-sidbar').prepend(list);
								//$.followtags.addtags();				

							}
						}
					});
				} else {
					var error = { error: true, error_message: 'กรุณาใส่ข้อมูลแท็กที่ต้องการเพิ่ม' }
					validation_error(error);
				}
			});

		}

		//enter
		$('#form-follow-tag').submit(function (e) {
			e.preventDefault();
		});

		$("#search-folow-tag").keyup(function (event) {
			event.preventDefault();
			var keycode = (event.keyCode ? event.keyCode : event.which);
			var txt = $("#search-folow-tag").val();
			if (keycode == '13' && $.trim(txt) != "") {
				$.ajax({
					type: "POST",
					url: "/follow/tag/follow",
					dataType: 'json',
					data: {
						tag_name: txt
					},
					success: function (data) {
						if (typeof data.errors !== 'undefined') {
							var errors = data.errors;
							switch (errors.code) {
								case 403: {
									window.location = '/login?redirect=' + data.errors.redirect;
									return false;
								}
								default: {
									$('#search-folow-tag').val('');
									errors.error = true;
									validation_error(errors);
									return false;
								}
							}

						} else {

							$('#search-folow-tag').val('');
							data.topic_count = data.topic_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
							var txt_unread = '';
							if (data.unread > 0) {
								txt_unread = data.unread + ' กระทู้ใหม่';
							}
							if (data.unread > 20) {
								txt_unread = '20+ กระทู้ใหม่';
							}
							var list = '<div class="tagshome" >'
								+ '<a target="_blank" href="/tag/' + data.tag_name + '" class="followed-tag" id="' + data.tag_name + '">'
								+ '<h1>' + data.tag_name + '</h1>'
								+ '<span>' + txt_unread + '</span>'
								+ '</a>'
								+ '<i class="icon-opt_menu" title="ตัวเลือก"></i>'
								+ '<div class="pt-menu-surface pt-menu-surface-mini" data-pin="0"> '
								+ '<ul>'
								+ '<li class="click-unfollow-sidebar unfollow-tag" data-tag="' + data.tag_name + '">'
								+ '<a href="javascript:void(0);"> ยกเลิกติดตาม</a>'
								+ '</li>'
								+ '<li class="pin-unpin click-pinunpin-sidebar" data-tag="' + data.tag_name + '" data-pin="0">'
								+ '</li>'
								+ '</ul>'
								+ '</div>'
								+ '</div>';

							if ($('.txt-sidebar-follow').is(":visible")) {
								$('.txt-sidebar-follow').hide();
							}

							$('#div-body-tags-sidbar').prepend(list);

						}
					}
				});
			}
		});


	}


	$.pintags.pintags = function (tag_name, callback) {
		$.ajax({
			type: "POST",
			url: "/follow/tag/pintags",
			dataType: 'json',
			data: {
				tag_name: tag_name
			},
			success: function (data) {
				if (typeof data.errors !== 'undefined') {
					var errors = data.errors;
					switch (errors.code) {
						case 403: {
							requireLogin(window.location.href);
							return false;
						}
						default: {
							errors.error = true;
							validation_error(errors);
							return false;
						}
					}
				} else {
					if (typeof callback != typeof undefined) {
						callback();
					}
					return;
				}
			}
		});
	}

	$.pintags.unpintags = function (tag_name, callback) {
		$.ajax({
			type: "POST",
			url: "/follow/tag/unpintags",
			dataType: 'json',
			data: {
				tag_name: tag_name
			},
			success: function (data) {
				if (typeof data.errors !== 'undefined') {
					var errors = data.errors;
					switch (errors.code) {
						case 403: {
							requireLogin(window.location.href);
							return false;
						}
						default: {
							errors.error = true;
							validation_error(errors);
							return false;
						}
					}
				} else {
					if (typeof callback != typeof undefined) {
						callback();
					}
					return;
				}
			}
		});
	}

	function removeLable(mid) {
		$('#div_message').on('click', '.remove-label', function () {
			$(this).parent().remove();
			var obj_json = {};
			var data = $(document.body).data('reciever').mid;

			var id = $(this).attr('id').split('-');
			var removeArr = $.grep(data, function (value) {
				return value != id[1];
			});


			obj_json['mid'] = removeArr;
			var before = $(document.body).data('reciever');
			var after = $.extend({}, before, obj_json);
			$(document.body).data('reciever', after);
			//console.log($(document.body).data('reciever'));
		});
	}

	function setJsonMid($obj) {
		var obj_json = {};
		var data = $(document.body).data('reciever').mid;

		var arr = $.makeArray(parseInt($obj.id));
		//console.log(arr);
		if (data.length == 0) {
			obj_json['mid'] = arr;
		}
		else {
			obj_json['mid'] = $.merge(data, arr);
		}
		/* div label */
		var span = $("<span>").text($obj.name);
		var a = $("<a>").addClass("remove-label").attr({
			href: "javascript:void(0);",
			title: "Remove " + $obj.name,
			id: 'm-' + $obj.id
		}).text("x").appendTo(span);

		/* add follow to div*/
		span.insertBefore("#recievers");
		$("#recievers").delay(1).queue(function () {
			$(this).val('');
			$(this).dequeue();
		});

		var before = $(document.body).data('reciever');
		var after = $.extend({}, before, obj_json);
		$(document.body).data('reciever', after);
		//console.log($(document.body).data('reciever'));
	}

	function msgAutocomplete(mid) {
		/* click focus input */
		$(document).on('click', '#friends', function () {
			$('#recievers').focus();

		});
		/* click outfocus input */
		$(document).on('focusout', '#recievers', function () {
			$('#recievers').val('');
		});
		/* keypress input */
		var sizInput = 1;

		var oneLetterWidth = 10;

		var minCharacters = 1;

		$(document).on('keyup', '#recievers', function () {
			var v = $.trim($(this).val());
			var len = v.length;

			if (len > minCharacters) {
				// increase width
				$(this).width(len * oneLetterWidth);
			} else {
				// restore minimal width;
				$(this).width(10);
			}
		});


		var xhr;
		/* remove lable ด้วย mid */
		var removeId = removeLable(mid);
		$(document.body).data('reciever', {
			'mid': []
		});
		if ($('#hidden_mid').val() != 0 && $('#hidden_mid').length == 1) {


			/* set json */
			setJsonMid({
				'id': mid,
				'name': $('#hidden_name').val()
			});
		}
		if ($("#recievers").length == 1) {
			$("#recievers").autocomplete({
				minLength: 0,
				delay: 500,
				source: function (request, response) {

					if ($.trim(request.term) != '') {
						//pass request to server
						xhr = $.ajax({
							type: "POST",
							dataType: 'json',
							url: '/message/private_message/get_autocomplete?t=' + new Date().getTime(),
							data: {
								str: $.trim(request.term),
								//str:request.term,
								arr: $.data(document.body).reciever
							},
							success: function (rs) {
								response(rs);
							}
						});
					} else {

						$('.ui-autocomplete').hide();
						//ui-autocomplete ui-menu ui-widget ui-widget-content ui-corner-all
					}
				},
				select: function (e, ui) {
					//alert(ui.item.mid);
					/* set json label */

					setJsonMid({
						'id': ui.item.mid,
						'name': ui.item.value
					});
					/* set size input กลับเป็น 1 เมื่อมีการเลือก label*/
					$('#recievers').attr('size', sizInput);
				}
			})
				.data("autocomplete")._renderItem = function (ul, item) {
					return $("<li></li>")
						.data("item.autocomplete", item)
						.append("<a><img width='38' height='38' class='avatar' src='" + item.avatar + "' /><span class='avatar-name'>" + item.label + "</span></a>")
						.appendTo(ul)
				};

		}
	}

	function set_json(obj) {
		var parent_msg = obj.parents('#form_msg');

		if (parent_msg.length == 1) {
			var subject_raw = parent_msg.find('#subject').val();
			var detail_raw = parent_msg.find('#textarea_subject').val();
			if (parent_msg.find('#send_to').length == 1) {
				$(document.body).data('reciever', {
					'mid': []
				});
				var id = $.makeArray(parent_msg.find('#send_to').val());
				$(document.body).data('reciever',
					{
						'mid': id
					});
			}
			$(document.body).data('msg',
				{
					//'reciever':parent_msg.find('#send_to').val(),
					'subject_raw': subject_raw,
					'detail_raw': detail_raw
				});
		}

	}

	function open_form_message() {

		var obj = $(document.body).data('obj').objSend;

		var val = obj.attr('class'); /* mid */

		val = val.match(/\d+/);
		if (val != null) {
			val = parseInt(val);
		}
		else {
			val = 0;
		}

		var msg_div = '<div id="message" class="lightbox-hide"></div>';
		obj.append(msg_div);
		//return false;
		$.ajax({
			type: "POST",
			url: "/message/private_message/send_message",
			data: {
				send_to: val
			},

			success: function (result) {
				$('#message')
					.dialog({
						width: 800,
						title: 'ส่งข้อความ',
						modal: true,
						resizable: false,
						draggable: false,
						close: function () {
							$('#message').dialog('destory');
							$('#message').remove();
							$('#links_lb_process').remove();
						}
					})
					.html(result);
				$.message.previewMessage();
				$('#message').dialog('option', 'position', 'center');

				$('#preview_msg').hide();

				$('#textarea_subject').bbcode();

				$('#subject').jqEasyCounter({
					'maxChars': 120,
					'maxCharsWarning': 120,
					'msgFontSize': '12px',
					'msgFontColor': '#A09DD5',
					'msgFontFamily': 'Arial',
					'msgTextAlign': 'left',
					'msgWarningColor': '#A09DD5',
					'msgAppendMethod': 'insertAfter'
				});

				$('#textarea_subject').jqEasyCounter({
					'maxChars': 10000,
					'maxCharsWarning': 10000,
					'msgFontSize': '12px',
					'msgFontColor': '#A09DD5',
					'msgFontFamily': 'Arial',
					'msgTextAlign': 'left',
					'msgWarningColor': '#A09DD5',
					'msgAppendMethod': 'insertAfter'
				});
				/*  autocomplete  */
				msgAutocomplete(val);
				$.message.defaults.sending = false;
			}
		});
	}

	function get_notification_pm(mid) {
		$.ajax({
			type: "GET",
			url: "/notifications/notifications/get_notification?mid=" + mid,
			dataType: 'json',
			cache: false,
			success: function (rs) {
				//console.log(rs);
				if (rs.msg != null && rs.msg != 0) {
					if (rs.msg > 9) {
						rs.msg = '9+';
					}
					$('.total-msg').html('<b class="pt-nav__badge">' + rs.msg + '</b>');
					$('#cnt_new_msg').html('(' + rs.msg + ')');
				}
			}
		});


		$('.total-msg').click(function (e) {
			e.stopPropagation();
			$('.total-msg').html('');
			$.ajax({
				type: "POST",
				url: "/message/private_message/update_notification",
				dataType: 'json',
				data: {
					mid: mid
				},
				success: function (rs) {
					if (rs.status == 'ok') {
						$('.total-msg').html('');
						window.location.href = '/message';
					}

				}
			});
		});
	}

})(jQuery);



/* jQuery jqEasyCharCounter plugin
 * Examples and documentation at: http://www.jqeasy.com/
 * Version: 1.0 (05/07/2010)
 * No license. Use it however you want. Just keep this notice included.
 * Requires: jQuery v1.3+
 */
(function ($) {
	$.fn.extend({
		jqEasyCounter: function (b) {
			return this.each(function () {

				var f = $(this), e = $.extend({
					maxChars: 100,
					maxCharsWarning: 80,
					msgFontSize: "12px",
					msgFontColor: "#000000",
					msgFontFamily: "Arial",
					msgTextAlign: "right",
					msgWarningColor: "#F00",
					msgAppendMethod: "insertAfter"
				}, b);
				if (e.maxChars <= 0) {
					return
				}
				var d = $('<span class="jqEasyCounterMsg">&nbsp;</span>');
				var c = {
					"font-size": e.msgFontSize,
					color: e.msgFontColor,
					"text-align": e.msgTextAlign,
					opacity: 0
				};

				d.css(c);
				d[e.msgAppendMethod](f);
				f.bind("keydown keyup keypress", g).bind("focus paste", function () {
					setTimeout(g, 10)
				}).bind("focusout", function () {
					d
						.stop()
						.fadeTo("fast", 0)
					return false;
				});
				function g() {
					var i = f.val(), h = i.length;
					if (h >= e.maxChars) {
						i = i.substring(0, e.maxChars)
					}
					if (h > e.maxChars) {
						var j = f.scrollTop();
						f.val(i.substring(0, e.maxChars));
						f.scrollTop(j)
					}
					if (h >= e.maxCharsWarning) {
						d.css({
							color: e.msgWarningColor
						})
					} else {
						d.css({
							color: e.msgFontColor
						})
					}
					d.html("<br/> * พิมพ์ข้อความได้ไม่เกิน " + e.maxChars + ' ตัวอักษร (' + f.val().length + "/" + e.maxChars + ')');
					d.stop().fadeTo("fast", 1)
				}

			})
		}
	})
})(jQuery);

/*
 *-----------------------------------------------------------------
 * Begin : Plugin Confirm Lightbox
 *-----------------------------------------------------------------
 * @author : Tong
 * @version : 0.5 beta
 * @file-request : lastest_jquery_ui.js, style.css, lastest_jquery.js
 * @return : void
 * @description : this plugin use for create a lightbox for a element's selector
 * @param {String} : confirm_title ( the title's text on the top lightbox )
 * @param {String} : confirm_desc ( the text description in lightbox )
 * @param {function} : success_callback ( when user clicked on OK button and then call the function and return element)
 * @param {int} : witdh ( The lightbox's width )
 * @warning :  *** this plugin CANNOT changing method ***
 * @example :
 */
(function ($) {
	var $this;

	var function_callback;
	// OK button
	$(document).on('click', '#confirm_submit', function () {

		$('#confirm_lb').dialog("destroy");

		$('#confirm_lb').confirm_lightbox('destroy');

		$('#confirm_lb').remove();

		finish = 1;

		var callback = $.Callbacks();
		callback.add(function_callback);
		callback.fire($this);
	})
	var methods = {
		init: function (options) {
			//console.log('init confirm_ligthbox');
			var settings = $.extend({
				ok_btn_txt: 'ตกลง',
				cancel_btn_txt: 'ยกเลิก',
				confirm_title: 'ยืนยันการตัดสินใจ',
				confirm_desc: 'คุณแน่ใจว่าจะลบ ?',
				beforeConfirmDesc: '',
				ok_btn_class: 'normal-butt',
				success_callback: function (element) {
					//console.log ('confirm submit');
				},
				bubble_event: false,
				get_confirm_desc: false,
				selector_confirm_desc: '',
				width: 220
			}, options);
			//return this.each(function(){
			//this.on('click keydown',function(e){
			$(document).on('click keydown', '"' + this.selector + '"', function (e) {
				if (e.type == 'click' || (e.type == 'keydown' && e.which == 13)) {
					if (settings.bubble_event == false) {
						e.preventDefault();
						e.stopPropagation();
					}
					$this = $(this);
					var confirm_box_html = '<div id="confirm_lb" class="lightbox-hide">'
						+ '<p class="desc">'
						+ '</p>'
						+ '<div class="button-container">'
						+ '<a href="javascript:void(0);" id="confirm_submit" class="button ' + settings.ok_btn_class + '"><span><em>' + settings.ok_btn_txt + '</em></span></a> '
						+ '<a href="javascript:void(0);" id="confirm_cancel" class="close_lightbox button notgo-butt"><span><em>' + settings.cancel_btn_txt + '</em></span></a>'
						+ '</div>'
						+ '</div>';
					$('div:last').after(confirm_box_html);

					var selector_return = $(this);
					var selector_confirm = $('#confirm_lb');
					function_callback = settings.success_callback;

					if (settings.beforeConfirmDesc != '') {
						settings.confirm_desc = settings.beforeConfirmDesc;
					}

					if (settings.get_confirm_desc == true) {
						var title = $(this).data('title-desc');
						var format_replace = settings.replace_confirm_desc.replace("{replace}", title);

						settings.confirm_desc = format_replace;
					}

					selector_confirm
						.dialog({
							width: settings.width,
							title: settings.confirm_title,
							modal: true,
							resizable: false,
							draggable: false,
							close: function () {
								selector_confirm.dialog("destroy").confirm_lightbox('destroy');
								selector_confirm.remove();
							}
						})
						.find('p.desc')
						.html(settings.confirm_desc);


					// Cancel
					$('#confirm_cancel').on('click', function () {
						selector_confirm.dialog("destroy").confirm_lightbox('destroy');
						selector_confirm.remove();
					});
				} // end if click or keydown
			}); // End thie on click
			return this;
		} // End init
		,
		destroy: function () {
			this.unbind('.confirm_lightbox');
		}
	};


	$.fn.confirm_lightbox = function (method) {

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}
	};



})(jQuery);


/* jQuery bbcode plugin
 *
 */
(function ($) {
	$.fn.bbcode = function () {
		/*
		 * chk สำหรับเมื่อคลิกที่ textarea แล้วเช็คว่า แอด bbcode tab เข้าไปหรือยัง
		 */

		var el = this;
		var id_el = this.attr('id');
		var chk = this.prev().hasClass('bb-toolbar');
		if (chk == false) {
			var btn = {
				'<span  id="upload_image" class="icon-toolbar icon-photo msg-lightbox" title="ใส่รูปประกอบ"></span>': 'image'
				,
				'<span class="icon-toolbar icon-video media-detail icon-media-tool-lightbox" title="ใส่คลิปวิดีโอ"></span>': 'media'
				,
				'<span class="icon-toolbar icon-map map-detail icon-media-tool-lightbox" title="ใส่แผนที่"></span>': 'map'
				,
				'<span id="emo" class="icon-toolbar icon-emoticon icon-media-tool-lightbox" title="Pantip Toy"></span>': 'emoticon'
				,
				'space1': '<div class="toolbar-blank"></div>'
				,
				'<span class="icon-toolbar icon-bold" title="ตัวหนา"></span>': 'bold'
				,
				'<span class="icon-toolbar icon-italic" title="ตัวเอียง"></span>': 'italics'
				,
				'<span class="icon-toolbar icon-underline" title="ขีดเส้นใต้"></span>': 'underline'
				,
				'<span class="icon-toolbar icon-strike" title="ขีดฆ่า"></span>': 'strike-through'
				,
				'space2': '<div class="toolbar-blank"></div>'
				,
				'<span class="icon-toolbar icon-alignleft" title="ชิดซ้าย"></span>': 'left'
				,
				'<span class="icon-toolbar icon-aligncenter" title="กึ่งกลาง"></span>': 'center'
				,
				'<span class="icon-toolbar icon-alignright" title="ชิดขวา"></span>': 'right'
				,
				'space3': '<div class="toolbar-blank"></div>'
				,
				'<span class="icon-toolbar icon-hyperlink" title="ลิงก์"></span>': 'link'
				,
				'<span class="icon-toolbar icon-hr" title="เส้นคั่น"></span>': 'hr'
				,
				'<span class="icon-toolbar icon-superscript" title="ตัวยก"></span>': 'sup'
				,
				'<span class="icon-toolbar icon-subscript" title="ตัวห้อย"></span>': 'sub'
				,
				'space4': '<div class="toolbar-blank"></div>'
				,
				'<span class="icon-toolbar icon-code" title="ใส่โค้ด"></span>': 'code'
				,
				'<span class="icon-toolbar icon-spoil" title="สปอยล์"></span>': 'spoil'
			};
			var tag_insert = {
				'0': ''
				,
				'1': ''
				,
				'2': ''
				,
				'3': ''
				,
				'4': ''
				,
				'5': '[b],[/b]'
				,
				'6': '[i],[/i]'
				,
				'7': '[u],[/u]'
				,
				'8': '[s],[/s]'
				,
				'9': ''
				,
				'10': '[left],[/left]'
				,
				'11': '[center],[/center]'
				,
				'12': '[right],[/right]'
				,
				'13': ''
				,
				'14': '[url],[/url]'
				,
				'15': '[hr],'
				,
				'16': '[sup],[/sup]'
				,
				'17': '[sub],[/sub]'
				,
				'18': ''
				,
				'19': '[code],[/code]'
				,
				'20': '[spoil],[/spoil]'
			};
			var div_bbcode_btn_open = '<div class="surround-box-light bb-toolbar overflowhidden ' + id_el + '">';
			var div_bbcode_btn_close = '</div>';
			var div_bbcode = '';
			var implode_btn = '';
			$.each(btn, function (index, value) {
				if (index.search('space') != -1) {
					implode_btn += value;
				}
				else {
					implode_btn += '<a href="javascript:void(0);" class="toolbar-icon bbcode ' + value + '-txt">' + index + '</a>';
				}
			});
			/* implode all div */
			div_bbcode += div_bbcode_btn_open + implode_btn + div_bbcode_btn_close;
			checkUrlPermission();
			/* create btn bbcode */
			function checkUrlPermission() {
				$.ajax({
					type: 'POST',
					url: '/profile/me/checkUrlPermission',
					dataType: 'json',
					success: function (rs) {
						$(div_bbcode).insertBefore(el);
						if (!rs.has_permission) {
							$('.toolbar-icon.bbcode.link-txt').hide();
						}
					}
				});
			}
			/* when user click btn bbcode , then insert bbcode tag */
			$(document).on('click', '.bbcode', function () {
				/* check สำหรับว่าถ้ามีการใช้ ฟังก์ชั่นมากกว่า 1 input,textarea ให้ทำงานที่ใดที่เดียว */
				if ($(this).parent().next().attr('id') == id_el) {
					var index = $(this).index();
					var tag = tag_insert[index].split(',');
					var open_tag = tag[0];
					var close_tag = tag[1];
					if (!close_tag) {
						close_tag = '';
					}
					var selection = {};
					if (!el.data("lastSelection")) {
						selection.start = 0;
						selection.end = 0;
					}
					else {
						selection = el.data("lastSelection");
					}
					el.focus();
					el.setSelection(selection.start, selection.end);
					el.surroundSelectedText(open_tag, close_tag, true);
					el.focus();
				}
			}); // click on icon

			// debug IE when user focus out ref -> http://stackoverflow.com/questions/5889127/insert-value-into-textarea-where-cursor-was
			el.bind("beforedeactivate", function () {
				saveSelection();
				el.unbind("focusout");
			});

			function saveSelection() {
				var test = el.getSelection();
				el.data("lastSelection", el.getSelection());
			}

			el.focusout(saveSelection);
			// end : debug
		}
		else {
			el.prev().show();
		}
	}
})(jQuery);
/*
 * function disallowThai
 * ------------------------------------------------------------
 * description : สำหรับให้พิมพ์ได้เฉพาะ ตัวเลข ตัวอักษรภาษอังกฤษใหญ่เล็กและ _ เท่านั้น
 * ------------------------------------------------------------
 */
(function ($) {
	$.fn.disallowThai = function () {
		var is_ie = false;
		this.on('keypress', function (e) {
			jQuery.each(jQuery.browser, function (i, val) {
				if (i == 'msie' && val == true) {
					is_ie = true;
				}
			});
			if (is_ie == true) {
				var allow_keycode = [9, 8];
				if ($.inArray(e.keyCode, allow_keycode) != -1) {
					return true;
				}
				else if (
					((e.which >= 97) && (e.which <= 122))
					||
					((e.which >= 65) && (e.which <= 90))
					||
					((e.which >= 48) && (e.which <= 57))
					||
					(e.which == 95)
				) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				var allow_keycode = [9, 8, 35, 36, 46, 95];
				if ($.inArray(e.keyCode, allow_keycode) != -1) {
					return true;
				}
				else if (
					((e.which >= 97) && (e.which <= 122))
					||
					((e.which >= 65) && (e.which <= 90))
					||
					((e.which >= 48) && (e.which <= 57))
					||
					(e.which == 95)
				) {
					return true;
				}
				else {
					return false;
				}
			}
		});
	}
})(jQuery);
/*
 Rangy Text Inputs, a cross-browser textarea and text input library plug-in for jQuery.

 Part of Rangy, a cross-browser JavaScript range and selection library
 http://code.google.com/p/rangy/

 Depends on jQuery 1.0 or later.

 Copyright 2010, Tim Down
 Licensed under the MIT license.
 Version: 0.1.205
 Build date: 5 November 2010
 */
(function ($) {
	function o(e, g) {
		var a = typeof e[g];
		return a === "function" || !!(a == "object" && e[g]) || a == "unknown"
	}
	function p(e, g, a) {
		if (g < 0) g += e.value.length;
		if (typeof a == "undefined") a = g;
		if (a < 0) a += e.value.length;
		return {
			start: g,
			end: a
		}
	}
	function k() {
		return typeof document.body == "object" && document.body ? document.body : document.getElementsByTagName("body")[0]
	}
	var i, h, q, l, r, s, t, u, m;
	$(document).ready(function () {
		function e(a, b) {
			return function () {
				var c = this.jquery ? this[0] : this, d = c.nodeName.toLowerCase();
				if (c.nodeType ==
					1 && (d == "textarea" || d == "input" && c.type == "text")) {
					c = [c].concat(Array.prototype.slice.call(arguments));
					c = a.apply(this, c);
					if (!b) return c
				}
				if (b) return this
			}
		}
		var g = document.createElement("textarea");
		k().appendChild(g);
		if (typeof g.selectionStart != "undefined" && typeof g.selectionEnd != "undefined") {
			i = function (a) {
				return {
					start: a.selectionStart,
					end: a.selectionEnd,
					length: a.selectionEnd - a.selectionStart,
					text: a.value.slice(a.selectionStart, a.selectionEnd)
				}
			};

			h = function (a, b, c) {
				b = p(a, b, c);
				a.selectionStart = b.start;
				a.selectionEnd =
					b.end
			};

			m = function (a, b) {
				if (b) a.selectionEnd = a.selectionStart; else a.selectionStart = a.selectionEnd
			}
		} else if (o(g, "createTextRange") && typeof document.selection == "object" && document.selection && o(document.selection, "createRange")) {
			i = function (a) {
				var b = 0, c = 0, d, f, j;
				if ((j = document.selection.createRange()) && j.parentElement() == a) {
					f = a.value.length;
					d = a.value.replace(/\r\n/g, "\n");
					c = a.createTextRange();
					c.moveToBookmark(j.getBookmark());
					j = a.createTextRange();
					j.collapse(false);
					if (c.compareEndPoints("StartToEnd", j) >
						-1) b = c = f;
					else {
						b = -c.moveStart("character", -f);
						b += d.slice(0, b).split("\n").length - 1;
						if (c.compareEndPoints("EndToEnd", j) > -1) c = f;
						else {
							c = -c.moveEnd("character", -f);
							c += d.slice(0, c).split("\n").length - 1
						}
					}
				}
				return {
					start: b,
					end: c,
					length: c - b,
					text: a.value.slice(b, c)
				}
			};

			h = function (a, b, c) {
				b = p(a, b, c);
				c = a.createTextRange();
				var d = b.start - (a.value.slice(0, b.start).split("\r\n").length - 1);
				c.collapse(true);
				if (b.start == b.end) c.move("character", d);
				else {
					c.moveEnd("character", b.end - (a.value.slice(0, b.end).split("\r\n").length -
						1));
					c.moveStart("character", d)
				}
				c.select()
			};

			m = function (a, b) {
				var c = document.selection.createRange();
				c.collapse(b);
				c.select()
			}
		} else {
			k().removeChild(g);
			window.console && window.console.log && window.console.log("TextInputs module for Rangy not supported in your browser. Reason: No means of finding text input caret position");
			return
		}
		k().removeChild(g);
		l = function (a, b, c, d) {
			var f;
			if (b != c) {
				f = a.value;
				a.value = f.slice(0, b) + f.slice(c)
			}
			d && h(a, b, b)
		};

		q = function (a) {
			var b = i(a);
			l(a, b.start, b.end, true)
		};

		u = function (a) {
			var b =
				i(a), c;
			if (b.start != b.end) {
				c = a.value;
				a.value = c.slice(0, b.start) + c.slice(b.end)
			}
			h(a, b.start, b.start);
			return b.text
		};

		r = function (a, b, c, d) {
			var f = a.value;
			a.value = f.slice(0, c) + b + f.slice(c);
			if (d) {
				b = c + b.length;
				h(a, b, b)
			}
		};

		s = function (a, b) {
			var c = i(a), d = a.value;
			a.value = d.slice(0, c.start) + b + d.slice(c.end);
			c = c.start + b.length;
			h(a, c, c)
		};

		t = function (a, b, c) {
			var d = i(a), f = a.value;
			a.value = f.slice(0, d.start) + b + d.text + c + f.slice(d.end);
			b = d.start + b.length;
			h(a, b, b + d.length)
		};

		$.fn.extend({
			getSelection: e(i, false),
			setSelection: e(h,
				true),
			collapseSelection: e(m, true),
			deleteSelectedText: e(q, true),
			deleteText: e(l, true),
			extractSelectedText: e(u, false),
			insertText: e(r, true),
			replaceSelectedText: e(s, true),
			surroundSelectedText: e(t, true)
		})
	})
})(jQuery);

(function ($) {

	$.tooltip = {};

	$.tooltip.simple = function () {

		var delay = (function () {
			var timer = 0;
			return function (callback, ms) {
				clearTimeout(timer);
				timer = setTimeout(callback, ms);
			};
		})();
		delay(function () {
			/* for tooltip filterType*/
			var e_1 = $('.b-block-subtabbar-wrap.b-block-subtabbar-filter2');
			if (e_1.length > 0) {

				var filterType = e_1.offset();
				$('#filter-type').css({
					top: filterType.top + 50,
					left: filterType.left + 20
				}).show();
				/* for event click tooltip  */
				$(document).on('click', '#close_filter_type_type', function () {
					$.get('/tooltip/filter_type', function (data) {
						$('#filter-type').remove();
					});
				});
			}




			/* for tooltip filterTags*/
			var e_2 = $('.b-block-tabbar.altcolor02');
			if (e_2.length > 0) {

				var filterTags = e_2.offset();
				$('#filter-tags').css({
					top: filterTags.top - 150,
					left: filterTags.left - 100
				}).show();

				/* for event click tooltip  */
				$(document).on('click', '#close_filter_type_tags', function () {
					$.get('/tooltip/filter_tags', function (data) {
						$('#filter-tags').remove();
					});
				});
			}


			var e_3 = $('.sidebar-content.section-club');
			if (e_3.length > 0) {
				var club = e_3.offset();

				$('#club-ccb').css({
					"top": club.top,
					"left": club.left - 300
				}).show();

				/* for event click tooltip  */
				$(document).on('click', '#close_club', function () {
					$.get('/tooltip/club', function (data) {
						$('#club-ccb').remove();
					});
				});
			}


			var e_4 = $('#noti-msg-menu');
			if (e_4.length > 0) {
				var pm = e_4.offset();
				$('#message-pm').css({
					"top": pm.top + 40,
					"left": pm.left - 305
				}).show();


				/* for event click tooltip  */
				$(document).on('click', '#close_pm', function () {
					$.get('/tooltip/message', function (data) {
						$('#message-pm').remove();
					});
				});
			}
		}, 3000);
	}



	$.errorNotice = {};
	$.errorNotice.test = function () {
		//console.log('abc');
	}
	$.errorNotice.dialog = function (error_msg, opt) {

		error_msg = decodeURI(error_msg);
		error_msg = error_msg.replace(/%2F/g, "/");
		error_msg = error_msg.replace(/%3F/g, "?");
		error_msg = error_msg.replace(/%3A/g, ":");
		error_msg = error_msg.replace(/%26/g, "&");
		error_msg = error_msg.replace(/%3D/g, "=");
		error_msg = error_msg.replace(/%40/g, "@");
		error_msg = error_msg.replace(/%23/g, "#");

		var btn_close = 'ปิดหน้าต่างนี้';
		var title = 'เกิดข้อผิดพลาด';
		var url = '';
		var unix = Math.round((new Date()).getTime() / 1000);

		if (opt != undefined && opt.btn_close) {
			btn_close = opt.btn_close;
		}

		if (opt != undefined && opt.title) {
			title = opt.title;
		}

		if (opt != undefined && opt.width) {
			$.errorNotice.defaults.width = opt.width;
		}



		// check has model or not ?
		if ($('.ui-widget-overlay').length > 0) {
			$('.lightbox-hide.remove.ui-dialog-content').remove();
			$('.ui-widget-overlay').remove();
		}

		if (error_msg == '') {
			error_msg = 'มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง';
		}

		$('#error_notice').remove();
		var error_div = '';
		error_div = '<div id="error_notice">'
			+ '<p class="error_msg">' + error_msg + '</p>'
			+ '<div class="button-container">'
			+ '<a href="javascript:void(0);" class="button normal-butt close_lightbox">'
			+ '<span><em>' + btn_close + '</em></span></a>'
			+ '</div>'
			+ '</div>';
		$('div:last').after(error_div);
		$('#error_notice').dialog({
			width: $.errorNotice.defaults.width,
			title: title,
			modal: true,
			resizable: false,
			draggable: false,
			close: function () {
				$('#error_notice').dialog('destroy').remove();
				if ($.errorNotice.defaults.refresh_page == true) {
					window.location.reload();
				}
			}
		});

		$('#error_notice').on('click', '.close_lightbox', function () {
			if ($.errorNotice.defaults.refresh_page == true) {
				window.location.reload();
			}
			$('#error_notice').dialog('destroy').remove();
			$('#error_notice .lightbox-hide.ui-dialog-content').remove();
			$('.ui-widget-overlay').remove();


			/* ยอมรับแจ้งข้อหา ในทุกๆกิจกรรม ที่กระทำในระบบ เช่น ตอบความเห็น emo vote setprofile */
			if (opt != undefined && opt.action == 'member_notify' && opt.validation_user == true) {
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: opt.url + '?t=' + unix,
					data: {
						param: opt.param_id
					},
					success: function (rs) { }
				});
				return false;
			}

			/*  ยอมรับแจ้งข้อหา ส่วนของ login ธรรมดา */
			if (opt != undefined && opt.action == 'member_notify' && opt.authen_type == 'normal') {
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: opt.url + '?t=' + unix,
					data: {
						param: opt.param_id
					},
					success: function (rs) {

						/* reload หลังกดยอมรับ */
						if (opt.reload != undefined && opt.reload == true) {
							window.location.reload();
						}
						/* เพิ่ม option สำหรับ redirect หน้า */
						if (opt.redirect_url != undefined) {
							window.location.href = opt.redirect_url;
						}
					}
				});
				return false;
			}

			/*  ยอมรับแจ้งข้อหา ส่วนของ login lightbox + oauth */
			if (opt != undefined && opt.action == 'member_notify' && opt.authen_type != 'normal') {
				$.ajax({
					type: 'POST',
					dataType: 'json',
					url: opt.url + '?t=' + unix,
					data: {
						authen_type: opt.authen_type,
						param: opt.param_id
					},
					success: function (rs) {
						/* แสดง bar bbcode และ ปุ่ม preview */
						ui_authen();
						/* แสดงรูป avatar */
						display_avatar(rs.display_avatar);
						$('.login_lb_process').dialog('close').remove();

					}
				});
				return false;
			}
		})
		setDefaults_param($.errorNotice.defaults);
	}
	/************************************* Private Function *******************************/
	function setDefaults_param(obj) {
		$.extend($.errorNotice.defaults = {
			width: 300
		}, obj);
	}

	function login_acknowledge($obj) {

	}
	/************************************* Defaults Param ********************************/
	$.errorNotice.defaults = {
		width: 300,
		refresh_page: false,
		url: ''
		//u : 'mu.pantip.com'
		//u : 'javascript:(function(){document.open();document.domain="' + document.domain + '";var ed = window.parent.CodeMirror_boilerplate;document.write(ed);document.close();})()'

	};
})(jQuery);


(function ($) {

	$.pantipNotice = {};
	$.pantipNotice.test = function () {
		console.log('abc');
	}
	$.pantipNotice.dialog = function (msg) {
		var notice_div = '';
		notice_div = '<div class="callback-status modal-callback" style="display:none;top:30px;left:0px;">'
			+ '<div class="callback-status-inner">'
			+ '<a title="ปิด" class="callback-status-close" href="javascript:void(0);">x</a>'
			+ msg
			+ '</div>'
			+ '</div>';

		if ($('.callback-status').length != 0) {
			$('.callback-status').remove();
		}
		$('div.footer:last').after(notice_div);

		var winW = 630
		if (document.body && document.body.offsetWidth) {
			winW = document.body.offsetWidth;
			winH = document.body.offsetHeight;
		}
		if (document.compatMode == 'CSS1Compat' &&
			document.documentElement &&
			document.documentElement.offsetWidth) {
			winW = document.documentElement.offsetWidth;
		}
		if (window.innerWidth && window.innerHeight) {
			winW = window.innerWidth;
		}

		var select = $('.callback-status');
		var left_width = select.width();
		var left_position = (winW - left_width) / 2;
		var lheight = $(window).scrollTop() + 10;

		select.css({
			left: left_position,
			display: '',
			top: 0
		}).delay(5000).fadeOut('slow', function () {
			if (typeof ($.pantipNotice.defaults.callbackAfterRemove) === 'function') {
				$.pantipNotice.defaults.callbackAfterRemove();
			}
			$('.callback-status').remove();
			setDefaults_param();

		});


		$(document).on('click', '.callback-status-close', function () {
			if (typeof ($.pantipNotice.defaults.callbackAfterRemove) == 'function') {
				$.pantipNotice.defaults.callbackAfterRemove();
			}
			$('.callback-status').remove();
			setDefaults_param();
		})


	}
	/************************************* Private Function *******************************/
	function setDefaults_param() {
		$.pantipNotice.defaults = {
			width: 300,
			callbackAfterRemove: ''
		};
	}
	/************************************* Defaults Param ********************************/
	$.pantipNotice.defaults = {
		width: 300,
		callbackAfterRemove: ''
	};
})(jQuery);
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function (a) {
	(jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
})(navigator.userAgent || navigator.vendor || window.opera);

function windowSize() {
	var myWidth = 0, myHeight = 0;
	if (typeof (window.innerWidth) == 'number') {
		//Non-IE
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		//IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
		//IE 4 compatible
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	}
	return myHeight;
}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode: function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode: function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode: function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode: function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};

/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */

(function sortableModule(factory) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		define(factory);
	}
	else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	}
	else {
		/* jshint sub:true */
		window["Sortable"] = factory();
	}
})(function sortableFactory() {
	"use strict";

	if (typeof window === "undefined" || !window.document) {
		return function sortableError() {
			throw new Error("Sortable.js requires a window with a document");
		};
	}

	var dragEl,
		parentEl,
		ghostEl,
		cloneEl,
		rootEl,
		nextEl,
		lastDownEl,

		scrollEl,
		scrollParentEl,
		scrollCustomFn,

		lastEl,
		lastCSS,
		lastParentCSS,

		oldIndex,
		newIndex,

		activeGroup,
		putSortable,

		autoScroll = {},

		tapEvt,
		touchEvt,

		moved,

		forRepaintDummy,

		/** @const */
		R_SPACE = /\s+/g,
		R_FLOAT = /left|right|inline/,

		expando = 'Sortable' + (new Date).getTime(),

		win = window,
		document = win.document,
		parseInt = win.parseInt,
		setTimeout = win.setTimeout,

		$ = win.jQuery || win.Zepto,
		Polymer = win.Polymer,

		captureMode = false,
		passiveMode = false,

		supportDraggable = ('draggable' in document.createElement('div')),
		supportCssPointerEvents = (function (el) {
			// false when IE11
			if (!!navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie)/i)) {
				return false;
			}
			el = document.createElement('x');
			el.style.cssText = 'pointer-events:auto';
			return el.style.pointerEvents === 'auto';
		})(),

		_silent = false,

		abs = Math.abs,
		min = Math.min,

		savedInputChecked = [],
		touchDragOverListeners = [],

		alwaysFalse = function () { return false; },

		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
			// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
			if (rootEl && options.scroll) {
				var _this = rootEl[expando],
					el,
					rect,
					sens = options.scrollSensitivity,
					speed = options.scrollSpeed,

					x = evt.clientX,
					y = evt.clientY,

					winWidth = window.innerWidth,
					winHeight = window.innerHeight,

					vx,
					vy,

					scrollOffsetX,
					scrollOffsetY
					;

				// Delect scrollEl
				if (scrollParentEl !== rootEl) {
					scrollEl = options.scroll;
					scrollParentEl = rootEl;
					scrollCustomFn = options.scrollFn;

					if (scrollEl === true) {
						scrollEl = rootEl;

						do {
							if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||
								(scrollEl.offsetHeight < scrollEl.scrollHeight)
							) {
								break;
							}
							/* jshint boss:true */
						} while (scrollEl = scrollEl.parentNode);
					}
				}

				if (scrollEl) {
					el = scrollEl;
					rect = scrollEl.getBoundingClientRect();
					vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
					vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
				}


				if (!(vx || vy)) {
					vx = (winWidth - x <= sens) - (x <= sens);
					vy = (winHeight - y <= sens) - (y <= sens);

					/* jshint expr:true */
					(vx || vy) && (el = win);
				}


				if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
					autoScroll.el = el;
					autoScroll.vx = vx;
					autoScroll.vy = vy;

					clearInterval(autoScroll.pid);

					if (el) {
						autoScroll.pid = setInterval(function () {
							scrollOffsetY = vy ? vy * speed : 0;
							scrollOffsetX = vx ? vx * speed : 0;

							if ('function' === typeof (scrollCustomFn)) {
								if (scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt, touchEvt, el) !== 'continue') {
									return;
								}
							}

							if (el === win) {
								win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
							} else {
								el.scrollTop += scrollOffsetY;
								el.scrollLeft += scrollOffsetX;
							}
						}, 24);
					}
				}
			}
		}, 30),

		_prepareGroup = function (options) {
			function toFn(value, pull) {
				if (value == null || value === true) {
					value = group.name;
					if (value == null) {
						return alwaysFalse;
					}
				}

				if (typeof value === 'function') {
					return value;
				} else {
					return function (to, from) {
						var fromGroup = from.options.group.name;

						return pull
							? value
							: value && (value.join
								? value.indexOf(fromGroup) > -1
								: (fromGroup == value)
							);
					};
				}
			}

			var group = {};
			var originalGroup = options.group;

			if (!originalGroup || typeof originalGroup != 'object') {
				originalGroup = { name: originalGroup };
			}

			group.name = originalGroup.name;
			group.checkPull = toFn(originalGroup.pull, true);
			group.checkPut = toFn(originalGroup.put);
			group.revertClone = originalGroup.revertClone;

			options.group = group;
		}
		;

	// Detect support a passive mode
	try {
		window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
			get: function () {
				// `false`, because everything starts to work incorrectly and instead of d'n'd,
				// begins the page has scrolled.
				passiveMode = false;
				captureMode = {
					capture: false,
					passive: passiveMode
				};
			}
		}));
	} catch (err) { }

	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}       [options]
	 */
	function Sortable(el, options) {
		if (!(el && el.nodeType && el.nodeType === 1)) {
			throw 'Sortable: `el` must be HTMLElement, and not ' + {}.toString.call(el);
		}

		this.el = el; // root element
		this.options = options = _extend({}, options);


		// Export instance
		el[expando] = this;

		// Default options
		var defaults = {
			group: null,
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			ghostClass: 'sortable-ghost',
			chosenClass: 'sortable-chosen',
			dragClass: 'sortable-drag',
			ignore: 'a, img',
			filter: null,
			preventOnFilter: true,
			animation: 280,
			setData: function (dataTransfer, dragEl) {
				dataTransfer.setData('Text', dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false,
			dataIdAttr: 'data-id',
			delay: 0,
			touchStartThreshold: parseInt(window.devicePixelRatio, 10) || 1,
			forceFallback: false,
			fallbackClass: 'sortable-fallback',
			fallbackOnBody: false,
			fallbackTolerance: 0,
			fallbackOffset: { x: 0, y: 0 },
			supportPointer: Sortable.supportPointer !== false
		};


		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}

		_prepareGroup(options);

		// Bind all private methods
		for (var fn in this) {
			if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
				this[fn] = this[fn].bind(this);
			}
		}

		// Setup drag mode
		this.nativeDraggable = options.forceFallback ? false : supportDraggable;

		// Bind events
		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);
		options.supportPointer && _on(el, 'pointerdown', this._onTapStart);

		if (this.nativeDraggable) {
			_on(el, 'dragover', this);
			_on(el, 'dragenter', this);
		}

		touchDragOverListeners.push(this._onDragOver);

		// Restore sorting
		options.store && this.sort(options.store.get(this));
	}


	Sortable.prototype = /** @lends Sortable.prototype */ {
		constructor: Sortable,

		_onTapStart: function (/** Event|TouchEvent */evt) {
			var _this = this,
				el = this.el,
				options = this.options,
				preventOnFilter = options.preventOnFilter,
				type = evt.type,
				touch = evt.touches && evt.touches[0],
				target = (touch || evt).target,
				originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0]) || target,
				filter = options.filter,
				startIndex;

			_saveInputCheckedState(el);


			// Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
			if (dragEl) {
				return;
			}

			if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
				return; // only left button or enabled
			}

			// cancel dnd if original target is content editable
			if (originalTarget.isContentEditable) {
				return;
			}

			target = _closest(target, options.draggable, el);

			if (!target) {
				return;
			}

			if (lastDownEl === target) {
				// Ignoring duplicate `down`
				return;
			}

			// Get the index of the dragged element within its parent
			startIndex = _index(target, options.draggable);

			// Check filter
			if (typeof filter === 'function') {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent(_this, originalTarget, 'filter', target, el, el, startIndex);
					preventOnFilter && evt.preventDefault();
					return; // cancel dnd
				}
			}
			else if (filter) {
				filter = filter.split(',').some(function (criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el);

					if (criteria) {
						_dispatchEvent(_this, criteria, 'filter', target, el, el, startIndex);
						return true;
					}
				});

				if (filter) {
					preventOnFilter && evt.preventDefault();
					return; // cancel dnd
				}
			}

			if (options.handle && !_closest(originalTarget, options.handle, el)) {
				return;
			}

			// Prepare `dragstart`
			this._prepareDragStart(evt, touch, target, startIndex);
		},

		_prepareDragStart: function (/** Event */evt, /** Touch */touch, /** HTMLElement */target, /** Number */startIndex) {
			var _this = this,
				el = _this.el,
				options = _this.options,
				ownerDocument = el.ownerDocument,
				dragStartFn;

			if (target && !dragEl && (target.parentNode === el)) {
				tapEvt = evt;

				rootEl = el;
				dragEl = target;
				parentEl = dragEl.parentNode;
				nextEl = dragEl.nextSibling;
				lastDownEl = target;
				activeGroup = options.group;
				oldIndex = startIndex;

				this._lastX = (touch || evt).clientX;
				this._lastY = (touch || evt).clientY;

				dragEl.style['will-change'] = 'all';

				dragStartFn = function () {
					// Delayed drag has been triggered
					// we can re-enable the events: touchmove/mousemove
					_this._disableDelayedDrag();

					// Make the element draggable
					dragEl.draggable = _this.nativeDraggable;

					// Chosen item
					_toggleClass(dragEl, options.chosenClass, true);

					// Bind the events: dragstart/dragend
					_this._triggerDragStart(evt, touch);

					// Drag start event
					_dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, rootEl, oldIndex);
				};

				// Disable "draggable"
				options.ignore.split(',').forEach(function (criteria) {
					_find(dragEl, criteria.trim(), _disableDraggable);
				});

				_on(ownerDocument, 'mouseup', _this._onDrop);
				_on(ownerDocument, 'touchend', _this._onDrop);
				_on(ownerDocument, 'touchcancel', _this._onDrop);
				_on(ownerDocument, 'selectstart', _this);
				options.supportPointer && _on(ownerDocument, 'pointercancel', _this._onDrop);

				if (options.delay) {
					// If the user moves the pointer or let go the click or touch
					// before the delay has been reached:
					// disable the delayed drag
					_on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchend', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
					_on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
					options.supportPointer && _on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);

					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
				} else {
					dragStartFn();
				}


			}
		},

		_delayedDragTouchMoveHandler: function (/** TouchEvent|PointerEvent **/e) {
			if (min(abs(e.clientX - this._lastX), abs(e.clientY - this._lastY)) >= this.options.touchStartThreshold) {
				this._disableDelayedDrag();
			}
		},

		_disableDelayedDrag: function () {
			var ownerDocument = this.el.ownerDocument;

			clearTimeout(this._dragStartTimer);
			_off(ownerDocument, 'mouseup', this._disableDelayedDrag);
			_off(ownerDocument, 'touchend', this._disableDelayedDrag);
			_off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
			_off(ownerDocument, 'mousemove', this._disableDelayedDrag);
			_off(ownerDocument, 'touchmove', this._disableDelayedDrag);
			_off(ownerDocument, 'pointermove', this._disableDelayedDrag);
		},

		_triggerDragStart: function (/** Event */evt, /** Touch */touch) {
			touch = touch || (evt.pointerType == 'touch' ? evt : null);

			if (touch) {
				// Touch device support
				tapEvt = {
					target: dragEl,
					clientX: touch.clientX,
					clientY: touch.clientY
				};

				this._onDragStart(tapEvt, 'touch');
			}
			else if (!this.nativeDraggable) {
				this._onDragStart(tapEvt, true);
			}
			else {
				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);
			}

			try {
				if (document.selection) {
					// Timeout neccessary for IE9
					_nextTick(function () {
						document.selection.empty();
					});
				} else {
					window.getSelection().removeAllRanges();
				}
			} catch (err) {
			}
		},

		_dragStarted: function () {
			if (rootEl && dragEl) {
				var options = this.options;

				// Apply effect
				_toggleClass(dragEl, options.ghostClass, true);
				_toggleClass(dragEl, options.dragClass, false);

				Sortable.active = this;

				// Drag start event
				_dispatchEvent(this, rootEl, 'start', dragEl, rootEl, rootEl, oldIndex);
			} else {
				this._nulling();
			}
		},

		_emulateDragOver: function () {
			if (touchEvt) {
				if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
					return;
				}

				this._lastX = touchEvt.clientX;
				this._lastY = touchEvt.clientY;

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', 'none');
				}

				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
				var parent = target;
				var i = touchDragOverListeners.length;

				while (target && target.shadowRoot) {
					target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
					parent = target;
				}

				if (parent) {
					do {
						if (parent[expando]) {
							while (i--) {
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}

							break;
						}

						target = parent; // store last element
					}
					/* jshint boss:true */
					while (parent = parent.parentNode);
				}

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', '');
				}
			}
		},


		_onTouchMove: function (/**TouchEvent*/evt) {
			if (tapEvt) {
				var options = this.options,
					fallbackTolerance = options.fallbackTolerance,
					fallbackOffset = options.fallbackOffset,
					touch = evt.touches ? evt.touches[0] : evt,
					dx = (touch.clientX - tapEvt.clientX) + fallbackOffset.x,
					dy = (touch.clientY - tapEvt.clientY) + fallbackOffset.y,
					translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

				// only set the status to dragging, when we are actually dragging
				if (!Sortable.active) {
					if (fallbackTolerance &&
						min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance
					) {
						return;
					}

					this._dragStarted();
				}

				// as well as creating the ghost element on the document body
				this._appendGhost();

				moved = true;
				touchEvt = touch;

				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);

				evt.preventDefault();
			}
		},

		_appendGhost: function () {
			if (!ghostEl) {
				var rect = dragEl.getBoundingClientRect(),
					css = _css(dragEl),
					options = this.options,
					ghostRect;

				ghostEl = dragEl.cloneNode(true);

				_toggleClass(ghostEl, options.ghostClass, false);
				_toggleClass(ghostEl, options.fallbackClass, true);
				_toggleClass(ghostEl, options.dragClass, true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');
				_css(ghostEl, 'pointerEvents', 'none');

				options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
			}
		},

		_onDragStart: function (/**Event*/evt, /**boolean*/useFallback) {
			var _this = this;
			var dataTransfer = evt.dataTransfer;
			var options = _this.options;

			_this._offUpEvents();

			if (activeGroup.checkPull(_this, _this, dragEl, evt)) {
				cloneEl = _clone(dragEl);

				cloneEl.draggable = false;
				cloneEl.style['will-change'] = '';

				_css(cloneEl, 'display', 'none');
				_toggleClass(cloneEl, _this.options.chosenClass, false);

				// #1143: IFrame support workaround
				_this._cloneId = _nextTick(function () {
					rootEl.insertBefore(cloneEl, dragEl);
					_dispatchEvent(_this, rootEl, 'clone', dragEl);
				});
			}

			_toggleClass(dragEl, options.dragClass, true);

			if (useFallback) {
				if (useFallback === 'touch') {
					// Bind touch events
					_on(document, 'touchmove', _this._onTouchMove);
					_on(document, 'touchend', _this._onDrop);
					_on(document, 'touchcancel', _this._onDrop);

					if (options.supportPointer) {
						_on(document, 'pointermove', _this._onTouchMove);
						_on(document, 'pointerup', _this._onDrop);
					}
				} else {
					// Old brwoser
					_on(document, 'mousemove', _this._onTouchMove);
					_on(document, 'mouseup', _this._onDrop);
				}

				_this._loopId = setInterval(_this._emulateDragOver, 50);
			}
			else {
				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(_this, dataTransfer, dragEl);
				}

				_on(document, 'drop', _this);

				// #1143: Бывает элемент с IFrame внутри блокирует `drop`,
				// поэтому если вызвался `mouseover`, значит надо отменять весь d'n'd.
				// Breaking Chrome 62+
				// _on(document, 'mouseover', _this);

				_this._dragStartId = _nextTick(_this._dragStarted);
			}
		},

		_onDragOver: function (/**Event*/evt) {
			var el = this.el,
				target,
				dragRect,
				targetRect,
				revert,
				options = this.options,
				group = options.group,
				activeSortable = Sortable.active,
				isOwner = (activeGroup === group),
				isMovingBetweenSortable = false,
				canSort = options.sort;

			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}

			if (dragEl.animated) {
				return;
			}

			moved = true;

			if (activeSortable && !options.disabled &&
				(isOwner
					? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
					: (
						putSortable === this ||
						(
							(activeSortable.lastPullMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) &&
							group.checkPut(this, activeSortable, dragEl, evt)
						)
					)
				) &&
				(evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
			) {
				// Smart auto-scrolling
				_autoScroll(evt, options, this.el);

				if (_silent) {
					return;
				}

				target = _closest(evt.target, options.draggable, el);
				dragRect = dragEl.getBoundingClientRect();

				if (putSortable !== this) {
					putSortable = this;
					isMovingBetweenSortable = true;
				}

				if (revert) {
					_cloneHide(activeSortable, true);
					parentEl = rootEl; // actualization

					if (cloneEl || nextEl) {
						rootEl.insertBefore(dragEl, cloneEl || nextEl);
					}
					else if (!canSort) {
						rootEl.appendChild(dragEl);
					}

					return;
				}


				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
					(el === evt.target) && (_ghostIsLast(el, evt))
				) {
					//assign target only if condition is true
					if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
						target = el.lastElementChild;
					}

					if (target) {
						if (target.animated) {
							return;
						}

						targetRect = target.getBoundingClientRect();
					}

					_cloneHide(activeSortable, isOwner);

					if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
						if (!dragEl.contains(el)) {
							el.appendChild(dragEl);
							parentEl = el; // actualization
						}

						this._animate(dragRect, dragEl);
						target && this._animate(targetRect, target);
					}
				}
				else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
					if (lastEl !== target) {
						lastEl = target;
						lastCSS = _css(target);
						lastParentCSS = _css(target.parentNode);
					}

					targetRect = target.getBoundingClientRect();

					var width = targetRect.right - targetRect.left,
						height = targetRect.bottom - targetRect.top,
						floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display)
							|| (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),
						isWide = (target.offsetWidth > dragEl.offsetWidth),
						isLong = (target.offsetHeight > dragEl.offsetHeight),
						halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
						nextSibling = target.nextElementSibling,
						after = false
						;

					if (floating) {
						var elTop = dragEl.offsetTop,
							tgTop = target.offsetTop;

						if (elTop === tgTop) {
							after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
						}
						else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
							after = (evt.clientY - targetRect.top) / height > 0.5;
						} else {
							after = tgTop > elTop;
						}
					} else if (!isMovingBetweenSortable) {
						after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
					}

					var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

					if (moveVector !== false) {
						if (moveVector === 1 || moveVector === -1) {
							after = (moveVector === 1);
						}

						_silent = true;
						setTimeout(_unsilent, 30);

						_cloneHide(activeSortable, isOwner);

						if (!dragEl.contains(el)) {
							if (after && !nextSibling) {
								el.appendChild(dragEl);
							} else {
								target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
							}
						}

						parentEl = dragEl.parentNode; // actualization

						this._animate(dragRect, dragEl);
						this._animate(targetRect, target);
					}
				}
			}
		},

		_animate: function (prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = target.getBoundingClientRect();

				if (prevRect.nodeType === 1) {
					prevRect = prevRect.getBoundingClientRect();
				}

				_css(target, 'transition', 'none');
				_css(target, 'transform', 'translate3d('
					+ (prevRect.left - currentRect.left) + 'px,'
					+ (prevRect.top - currentRect.top) + 'px,0)'
				);

				forRepaintDummy = target.offsetWidth; // repaint

				_css(target, 'transition', 'all ' + ms + 'ms');
				_css(target, 'transform', 'translate3d(0,0,0)');

				clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

		_offUpEvents: function () {
			var ownerDocument = this.el.ownerDocument;

			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'pointermove', this._onTouchMove);
			_off(ownerDocument, 'mouseup', this._onDrop);
			_off(ownerDocument, 'touchend', this._onDrop);
			_off(ownerDocument, 'pointerup', this._onDrop);
			_off(ownerDocument, 'touchcancel', this._onDrop);
			_off(ownerDocument, 'pointercancel', this._onDrop);
			_off(ownerDocument, 'selectstart', this);
		},

		_onDrop: function (/**Event*/evt) {
			var el = this.el,
				options = this.options;

			clearInterval(this._loopId);
			clearInterval(autoScroll.pid);
			clearTimeout(this._dragStartTimer);

			_cancelNextTick(this._cloneId);
			_cancelNextTick(this._dragStartId);

			// Unbind events
			_off(document, 'mouseover', this);
			_off(document, 'mousemove', this._onTouchMove);

			if (this.nativeDraggable) {
				_off(document, 'drop', this);
				_off(el, 'dragstart', this._onDragStart);
			}

			this._offUpEvents();

			if (evt) {
				if (moved) {
					evt.preventDefault();
					!options.dropBubble && evt.stopPropagation();
				}

				ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

				if (rootEl === parentEl || Sortable.active.lastPullMode !== 'clone') {
					// Remove clone
					cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
				}

				if (dragEl) {
					if (this.nativeDraggable) {
						_off(dragEl, 'dragend', this);
					}

					_disableDraggable(dragEl);
					dragEl.style['will-change'] = '';

					// Remove class's
					_toggleClass(dragEl, this.options.ghostClass, false);
					_toggleClass(dragEl, this.options.chosenClass, false);

					// Drag stop event
					_dispatchEvent(this, rootEl, 'unchoose', dragEl, parentEl, rootEl, oldIndex, null, evt);

					if (rootEl !== parentEl) {
						newIndex = _index(dragEl, options.draggable);

						if (newIndex >= 0) {
							// Add event
							_dispatchEvent(null, parentEl, 'add', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);

							// Remove event
							_dispatchEvent(this, rootEl, 'remove', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);

							// drag from one list and drop into another
							_dispatchEvent(null, parentEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
							_dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
						}
					}
					else {
						if (dragEl.nextSibling !== nextEl) {
							// Get the index of the dragged element within its parent
							newIndex = _index(dragEl, options.draggable);

							if (newIndex >= 0) {
								// drag & drop within the same list
								_dispatchEvent(this, rootEl, 'update', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
								_dispatchEvent(this, rootEl, 'sort', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);
							}
						}
					}

					if (Sortable.active) {
						/* jshint eqnull:true */
						if (newIndex == null || newIndex === -1) {
							newIndex = oldIndex;
						}

						_dispatchEvent(this, rootEl, 'end', dragEl, parentEl, rootEl, oldIndex, newIndex, evt);

						// Save sorting
						this.save();
					}
				}

			}

			this._nulling();
		},

		_nulling: function () {
			rootEl =
				dragEl =
				parentEl =
				ghostEl =
				nextEl =
				cloneEl =
				lastDownEl =

				scrollEl =
				scrollParentEl =

				tapEvt =
				touchEvt =

				moved =
				newIndex =

				lastEl =
				lastCSS =

				putSortable =
				activeGroup =
				Sortable.active = null;

			savedInputChecked.forEach(function (el) {
				el.checked = true;
			});
			savedInputChecked.length = 0;
		},

		handleEvent: function (/**Event*/evt) {
			switch (evt.type) {
				case 'drop':
				case 'dragend':
					this._onDrop(evt);
					break;

				case 'dragover':
				case 'dragenter':
					if (dragEl) {
						this._onDragOver(evt);
						_globalDragOver(evt);
					}
					break;

				case 'mouseover':
					this._onDrop(evt);
					break;

				case 'selectstart':
					evt.preventDefault();
					break;
			}
		},


		/**
		 * Serializes the item into an array of string.
		 * @returns {String[]}
		 */
		toArray: function () {
			var order = [],
				el,
				children = this.el.children,
				i = 0,
				n = children.length,
				options = this.options;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, options.draggable, this.el)) {
					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
				}
			}

			return order;
		},


		/**
		 * Sorts the elements according to the array.
		 * @param  {String[]}  order  order of the items
		 */
		sort: function (order) {
			var items = {}, rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},


		/**
		 * Save the current sorting
		 */
		save: function () {
			var store = this.options.store;
			store && store.set(this);
		},


		/**
		 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
		 * @param   {HTMLElement}  el
		 * @param   {String}       [selector]  default: `options.draggable`
		 * @returns {HTMLElement|null}
		 */
		closest: function (el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},


		/**
		 * Set/get option
		 * @param   {string} name
		 * @param   {*}      [value]
		 * @returns {*}
		 */
		option: function (name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;

				if (name === 'group') {
					_prepareGroup(options);
				}
			}
		},


		/**
		 * Destroy
		 */
		destroy: function () {
			var el = this.el;

			el[expando] = null;

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'pointerdown', this._onTapStart);

			if (this.nativeDraggable) {
				_off(el, 'dragover', this);
				_off(el, 'dragenter', this);
			}

			// Remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = el = null;
		}
	};


	function _cloneHide(sortable, state) {
		if (sortable.lastPullMode !== 'clone') {
			state = true;
		}

		if (cloneEl && (cloneEl.state !== state)) {
			_css(cloneEl, 'display', state ? 'none' : '');

			if (!state) {
				if (cloneEl.state) {
					if (sortable.options.group.revertClone) {
						rootEl.insertBefore(cloneEl, nextEl);
						sortable._animate(dragEl, cloneEl);
					} else {
						rootEl.insertBefore(cloneEl, dragEl);
					}
				}
			}

			cloneEl.state = state;
		}
	}


	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
		if (el) {
			ctx = ctx || document;

			do {
				if ((selector === '>*' && el.parentNode === ctx) || _matches(el, selector)) {
					return el;
				}
				/* jshint boss:true */
			} while (el = _getParentOrHost(el));
		}

		return null;
	}


	function _getParentOrHost(el) {
		var parent = el.host;

		return (parent && parent.nodeType) ? parent : el.parentNode;
	}


	function _globalDragOver(/**Event*/evt) {
		if (evt.dataTransfer) {
			evt.dataTransfer.dropEffect = 'move';
		}
		evt.preventDefault();
	}


	function _on(el, event, fn) {
		el.addEventListener(event, fn, captureMode);
	}


	function _off(el, event, fn) {
		el.removeEventListener(event, fn, captureMode);
	}


	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
			}
		}
	}


	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			}
			else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}


	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}



	function _dispatchEvent(sortable, rootEl, name, targetEl, toEl, fromEl, startIndex, newIndex, originalEvt) {
		sortable = (sortable || rootEl[expando]);

		var evt = document.createEvent('Event'),
			options = sortable.options,
			onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

		evt.initEvent(name, true, true);

		evt.to = toEl || rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.clone = cloneEl;

		evt.oldIndex = startIndex;
		evt.newIndex = newIndex;

		evt.originalEvent = originalEvt;

		rootEl.dispatchEvent(evt);

		if (options[onName]) {
			options[onName].call(sortable, evt);
		}
	}


	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
		var evt,
			sortable = fromEl[expando],
			onMoveFn = sortable.options.onMove,
			retVal;

		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);

		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || toEl.getBoundingClientRect();
		evt.willInsertAfter = willInsertAfter;

		evt.originalEvent = originalEvt;

		fromEl.dispatchEvent(evt);

		if (onMoveFn) {
			retVal = onMoveFn.call(sortable, evt, originalEvt);
		}

		return retVal;
	}


	function _disableDraggable(el) {
		el.draggable = false;
	}


	function _unsilent() {
		_silent = false;
	}


	/** @returns {HTMLElement|false} */
	function _ghostIsLast(el, evt) {
		var lastEl = el.lastElementChild,
			rect = lastEl.getBoundingClientRect();

		// 5 — min delta
		// abs — нельзя добавлять, а то глюки при наведении сверху
		return (evt.clientY - (rect.top + rect.height) > 5) ||
			(evt.clientX - (rect.left + rect.width) > 5);
	}


	/**
	 * Generate id
	 * @param   {HTMLElement} el
	 * @returns {String}
	 * @private
	 */
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
			i = str.length,
			sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}

		return sum.toString(36);
	}

	/**
	 * Returns the index of an element within its parent for a selected set of
	 * elements
	 * @param  {HTMLElement} el
	 * @param  {selector} selector
	 * @return {number}
	 */
	function _index(el, selector) {
		var index = 0;

		if (!el || !el.parentNode) {
			return -1;
		}

		while (el && (el = el.previousElementSibling)) {
			if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && (selector === '>*' || _matches(el, selector))) {
				index++;
			}
		}

		return index;
	}

	function _matches(/**HTMLElement*/el, /**String*/selector) {
		if (el) {
			try {
				if (el.matches) {
					return el.matches(selector);
				} else if (el.msMatchesSelector) {
					return el.msMatchesSelector(selector);
				}
			} catch (_) {
				return false;
			}
		}

		return false;
	}

	function _throttle(callback, ms) {
		var args, _this;

		return function () {
			if (args === void 0) {
				args = arguments;
				_this = this;

				setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					args = void 0;
				}, ms);
			}
		};
	}

	function _extend(dst, src) {
		if (dst && src) {
			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}
		}

		return dst;
	}

	function _clone(el) {
		if (Polymer && Polymer.dom) {
			return Polymer.dom(el).cloneNode(true);
		}
		else if ($) {
			return $(el).clone(true)[0];
		}
		else {
			return el.cloneNode(true);
		}
	}

	function _saveInputCheckedState(root) {
		savedInputChecked.length = 0;

		var inputs = root.getElementsByTagName('input');
		var idx = inputs.length;

		while (idx--) {
			var el = inputs[idx];
			el.checked && savedInputChecked.push(el);
		}
	}

	function _nextTick(fn) {
		return setTimeout(fn, 0);
	}

	function _cancelNextTick(id) {
		return clearTimeout(id);
	}

	// Fixed #973:
	_on(document, 'touchmove', function (evt) {
		if (Sortable.active) {
			evt.preventDefault();
		}
	});

	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		is: function (el, selector) {
			return !!_closest(el, selector, el);
		},
		extend: _extend,
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		clone: _clone,
		index: _index,
		nextTick: _nextTick,
		cancelNextTick: _cancelNextTick
	};


	/**
	 * Create sortable instance
	 * @param {HTMLElement}  el
	 * @param {Object}      [options]
	 */
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};


	// Export
	Sortable.version = '1.7.0';
	return Sortable;
});

function PtTagPopover() {
	this.timeoutID = null;
	this.isHover = false;
	this.isTop = false;
	this.isLeft = true;
	this.xhr = null;

	this.popoverHeight = 95 + 28;
	this.popoverWidth = 354;
	this.popoverPreviewHeight = 47 + 28;
	this.popoverPreviewWidth = 446;
	this.padding = 30;
	this.hoverDelay = 400;
	this.leaveDelay = 300;

	this.tagMap = typeof Map === 'undefined' ? undefined : new Map();

	this.popoverContainer = 'tag-popover-container';

	this.init = function () {
		this.initEvent();
		this.initMouseEvent();
	}

	this.tagHoverTemplate = function (data, isTop, isLeft) {

		var c = !isTop ? 'top' : 'bottom';
		c += (isLeft ? '' : 'right');
		var html = '<ul class="callouts" style="position: relative; top: 0px;">';
		html += '<li class="callouts--' + c + '">';
		html += '<div class="pt-tag-pad1">';

		if (typeof data.url === 'undefined') {
			html += '<span class="heading-1 heading-1--callouts">' + data.name + '</span>';
		} else {
			html += '<a href="' + data.url + '" class="heading-1 heading-1--callouts">' + data.name + '</a>';
		}

		html += '</div>';
		html += '<div class="pt-tag-pad2">';
		html += '<span>' + (typeof data.total_count === 'undefined' ? 0 : data.total_count) + ' กระทู้&nbsp;&nbsp;' + (typeof data.follow_count === 'undefined' ? 0 : data.follow_count) + ' ผู้ติดตาม</span>';
		if (data.is_follow === 1) {
			html += '<b style="right: 12px; bottom: 8px; position: absolute;"><a href="javascript:void(0)" data-tag="' + data.name + '" class="btn btn--secondary tags-item__btn btn--sm  unfollow-tag js-btn-follow-tag">กำลังติดตาม</a></b>';
		} else {
			html += '<b style="right: 12px; bottom: 8px; position: absolute;"><a href="javascript:void(0)" data-tag="' + data.name + '" class="btn btn--primary tags-item__btn btn--sm follow-tag js-btn-follow-tag">ติดตาม</a></b>';
		}
		html += '</div>';
		html += '</li>';
		html += '</ul>';
		return html;
	}

	this.tagHoverTemplatPreview = function (data, isTop, isLeft) {
		var c = !isTop ? 'top' : 'bottom';
		c += (isLeft ? '' : 'right');
		var html = '<ul class="callouts" style="position: relative; top: 0px;">';
		html += '<li class="callouts--' + c + '">';
		html += '<div class="pt-tag-pad1" style="border-bottom: none;">';
		html += '<a href="' + data.url + '" class="heading-1 heading-1--callouts">กำลังโหลด...</a>';
		html += '</div>';
		html += '</li>';
		html += '</ul>';
		return html;
	}

	this.getDomOffset = function (elem, position) {
		var offsetKey = (position == 'left' ? 'offsetLeft' : 'offsetTop');
		var offset = 0;
		do {
			if (!isNaN(elem[offsetKey])) {
				offset += elem[offsetKey];
			}
		} while (elem = elem.offsetParent);
		return offset;
	}

	this.initEvent = function () {
		var self = this;
		$(document).ready(function () {
			$('head').append('<style type="text/css">#' + self.popoverContainer + ' {position: absolute; z-index: 210;} #' + self.popoverContainer + '>.callouts { z-index: 210;}</style>');
		});

		if (typeof self.tagMap !== 'undefined') {
			$(document).on('click', '.js-btn-follow-tag', function (e) {
				e.preventDefault();
				self.tagMap.delete($(this).attr('data-tag'));
			});
		}
	}

	this.fetchTagData = function (tagName, callback) {
		var self = this;
		if (typeof self.tagMap !== 'undefined') {
			if (self.tagMap.has(tagName)) {
				callback(self.tagMap.get(tagName));
				return false;
			}
		}
		if (this.xhr !== null) {
			this.xhr.abort();
		}

		this.xhr = $.ajax({
			url: '/follow/tag/get_tag',
			type: 'get',
			dataType: 'json',
			data: { tag_name: tagName, ts: Date.now() },
			success: function (data) {
				if (typeof data.errors !== 'undefined') {
					callback({
						name: data.errors.message,
						description: data.errors.message
					});
					return false;
				}
				if (data.id === 0) {
					return console.log('There is no data for this tag')
				}
				if (typeof self.tagMap !== 'undefined') {
					if (data.name != tagName) {
						self.tagMap.delete(tagName);
					} else {
						self.tagMap.set(tagName, data);
					}
				}
				callback(data);
			},
			beforeSend: function () {
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log(errorThrown);
			}
		});
	}

	this.initMouseEvent = function () {
		var self = this;

		$(document).on('mouseover', '#' + self.popoverContainer, function (e) {
			e.preventDefault();
			self.isHover = true;
		});

		$(document).on('mouseover', '[data-toggle="tag-popover"]', function (e) {
			e.preventDefault();

			var that = this;
			var tagName = $(this).attr('data-tag');

			self.isHover = true;
			//self.isTop = $(window).height() - that.getBoundingClientRect().top < self.popoverHeight + self.padding;
			self.isLeft = that.getBoundingClientRect().left + ($(that).width() / 2) < $(window).width() / 2;
			self.isTop = that.getBoundingClientRect().top + ($(that).height() / 2) >= $(window).height() / 2;

			if (self.timeoutID !== null) {
				clearTimeout(self.timeoutID);
			}

			self.timeoutID = setTimeout(function () {
				if (!self.isHover) {
					return false;
				}

				if (document.getElementById(self.popoverContainer) !== null) {
					$('#' + self.popoverContainer).remove();
				}

				self.timeoutID = setTimeout(function () {
					if (!self.isHover) {
						return false;
					}

					var html = self.tagHoverTemplatPreview({ tag_name: 'Loading...', url: '#' }, self.isTop, self.isLeft);
					if (document.getElementById(self.popoverContainer) === null) {
						$('body').append('<div id="' + self.popoverContainer + '">' + html + '</div>');
					} else {
						$('#' + self.popoverContainer).html(html)
					}

					var left = self.getDomOffset(that, 'left');
					var leftOffset = 58 - ($(that).width() / 2);
					if (!self.isLeft) {
						leftOffset = self.popoverWidth - $(that).width() - 38;
					}

					$('#' + self.popoverContainer).show();
					var top = self.getDomOffset(that, 'top');
					var topOffset = -$(that).outerHeight();

					if (self.isTop) {
						topOffset = $('#' + self.popoverContainer).children('ul:eq(0)').outerHeight() + 28;
					}

					$('#' + self.popoverContainer).css({ 'display': 'block', 'left': (left - leftOffset) + 'px', 'top': (top - topOffset) + 'px' });

					self.fetchTagData(tagName, function (data) {
						if (!self.isHover) {
							return false;
						}

						html = self.tagHoverTemplate(data, self.isTop, self.isLeft);
						if (document.getElementById(self.popoverContainer) === null) {
							$('body').append('<div id="' + self.popoverContainer + '">' + html + '</div>');
						} else {
							$('#' + self.popoverContainer).html(html);
						}

						if (self.isTop) {
							topOffset = $('#' + self.popoverContainer).children('ul:eq(0)').outerHeight() + 28 + 0;
						}

						$('#' + self.popoverContainer).css({ 'display': 'block', 'left': (left - leftOffset) + 'px', 'top': (top - topOffset) + 'px' });

					});
				}, self.hoverDelay);

			}, self.leaveDelay);
		});

		$(document).on('mouseleave', '[data-toggle="tag-popover"], #' + self.popoverContainer, function (e) {
			e.preventDefault();
			self.isHover = false;
			if (self.timeoutID !== null) {
				clearTimeout(self.timeoutID);
			}
			self.timeoutID = setTimeout(function () {
				if (self.isHover) {
					return false;
				}
				$('#' + self.popoverContainer).remove();
			}, self.leaveDelay);
		});
		/* Start Forgot Password By KonG */
		$('#forgot_pw').on('click', function () {
			$('#reload').attr('id', 'reload_login');
			$('#change').attr('id', 'change_login');
			$('#captcha_image').attr('id', 'captcha_image_login');
			$('#form_captcha').attr('id', 'form_captcha_login');
			$('.login_lb_process').remove();
			$.ajax({
				type: "POST",
				url: "/account/forgot_password/forms_login",
				cache: false,
				success: function (rs) {
					$('#forgot_pw_process').html(rs)
						.dialog({
							width: 375,
							title: 'ลืมรหัสผ่าน',
							modal: true,
							resizable: false,
							draggable: false,
							close: function () {

								$('#forgot_pw_process').text('');
								$('#reload_login').attr('id', 'reload');
								$('#change_login').attr('id', 'change');
								$('#captcha_image_login').attr('id', 'captcha_image');
								$('#form_captcha_login').attr('id', 'form_captcha');
							}
						})
				}
			})
		});
		/* End Forgot Password */
		$(document).on('click', '#reload', function () {
			var currentname = $('#reload').attr('name').split('_');
			var cid = $('#cid').val();
			$.ajax({
				type: "POST",
				url: "/manage_captcha/reload",
				cache: false,
				data: "lang=" + currentname[1] + "&cid=" + cid,
				success: function (result) {
					//alert(result);
					$('#captcha_image').html(result);
					$('#captcha_word').focus();
				}
			});
		});

		$(document).on('click', '#change', function () {
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
				data: "lang=" + lang + "&cid=" + cid,
				success: function (result) {
					//alert(result);
					$('#form_captcha').html(result);
					$('#captcha_word').focus();
				}
			});
		});

		/* for forgot pass */
		$('#forgot_pw_process').on('keypress', '#forgot_email_k,#captcha_word', function (event) {
			if (event.which == '13') {
				$('#submit_forgot').trigger('click');
				return false;
			}
		});


	}
}
