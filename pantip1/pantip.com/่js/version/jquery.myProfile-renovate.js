var accessToken = undefined
var isOwner = undefined
var displayProfileId = undefined
var listFollowingDataCheck = []

$(document).ready(function () {

	$.tabMenuProfile.tabMenuByUrl(); /* เมื่อเข้าหน้า profile ให้แสดง tab menu กระทู้ของฉันไว้ */
	$.tabMenuProfile.tabMenuSelect(); /* click tab menu */
	$.tabMenuProfile.nicknameHistory(); /* */
	$.tabMenuProfile.hoverMyBookmarks();
	$.tabMenuProfile.hoverMyhistory();
	$.tabMenuProfile.removeMyBookmarks();
	$.tabMenuProfile.removeMyhistory();
	$.tabMenuProfile.clickFollow();

	accessToken = $('#actk').val();
	isOwner = $('#is_owner').val() ? JSON.parse($('#is_owner').val()) : false;
	const profileId = $(document).find('.profile-follow').attr('id');
	const arr_pid = profileId.split('p_');
	const pid = arr_pid[1];
	displayProfileId = +pid

	$.templates({
		"post-template-tags-fullpage": {
			markup: "#post-template-tags-fullpage",
			helpers: {
				numberFormat: function (total) {
					/* IE10*/
					if (total.toLocaleString('en').indexOf(".") != -1) {
						return total.toLocaleString('en').slice(0, -3);
					}
					return total.toLocaleString('en');
				}
			}
		}
	});
});

var ajaxSending = false;
$.ajaxSetup({
	beforeSend: function () {
		ajaxSending = true;
	},
	complete: function () {
		// Handle the complete event
		ajaxSending = false;
	}
});
// End controll Ajax
(function ($) {
	/************************************* Public Function ********************************/
	var max_page = 0;
	$.followed = {};
	$.tabMenuProfile = {}

	$.tabMenuProfile.objectSet = function (partialObject) {
		$.extend($.tabMenuProfile.defaults, partialObject);
	}

	$.followed.objectSet = function (partialObject) {
		$.extend($.followed.defaults, partialObject);
	}
	/*
	 * Create By KonG
	 **/
	$.tabMenuProfile.removeMyhistory = function () {
		$('.icon-reportbin.my-history-item-ref').confirm_lightbox({
			ok_btn_txt: 'ตกลง',
			width: 450,
			cancel_btn_txt: 'ยกเลิก',
			confirm_title: 'ยืนยันการลบ',
			get_confirm_desc: true,
			replace_confirm_desc: 'คุณต้องการเอากระทู้ <b class="focus02-txt">{replace}</b> ออกจากรายการกระทู้ที่เคยอ่านใช่หรือไม่ ?',
			ok_btn_class: 'caution-butt',
			success_callback: function (ele) {
				var e = ele.get(0).id.split('-');
				var topic_id = e[0];
				var mid = e[1];

				$.ajax({
					type: 'POST',
					url: '/profile/me/remove_my_history',
					dataType: 'json',
					data: {
						topic_id: topic_id,
						mid: mid
					},
					success: function (rs) {

						if (rs.status == 'success') {
							$('#render-' + topic_id).fadeOut('slow');
							return false;
						}

						if (rs.status == 'failure') {
							window.location.reload();

						}
						return false;
					}
				});
			}
		});
	}

	/*
	 * Create By KonG
	 **/
	$.tabMenuProfile.removeMyBookmarks = function () {

		$('.icon-reportbin.my-bookmarks-item-ref').confirm_lightbox({
			ok_btn_txt: 'ตกลง',
			width: 450,
			cancel_btn_txt: 'ยกเลิก',
			confirm_title: 'ยืนยันการลบ',
			get_confirm_desc: true,
			replace_confirm_desc: 'คุณต้องการเอากระทู้ <b class="focus02-txt">{replace}</b> ออกจากรายการกระทู้โปรดใช่หรือไม่ ?',
			ok_btn_class: 'caution-butt',
			success_callback: function (ele) {
				var e = ele.get(0).id.split('-');
				var topic_id = e[0];
				var mid = e[1];

				$.ajax({
					type: 'POST',
					url: '/profile/me/remove_my_bookmarks',
					dataType: 'json',
					data: {
						topic_id: topic_id,
						mid: mid
					},
					success: function (rs) {

						if (rs.status == 'success') {
							$('#render-' + topic_id).fadeOut('slow');
							return false;
						}

						if (rs.status == 'failure') {
							window.location.reload();

						}
						return false;
					}
				});
			}
		});

	};
	/*
	 * Create By KonG
	 * 
	 **/
	$.tabMenuProfile.hoverMyBookmarks = function () {
		$(document).on('mouseenter', '.post-item.my-bookmarks-tab', function () {
			$(this).addClass('hover');
		}).on('mouseleave', '.post-item.my-bookmarks-tab', function () {
			$(this).removeClass('hover');
		});
	};
	/*
	 * Create By KonG
	 **/
	$.tabMenuProfile.hoverMyhistory = function () {
		$(document).on('mouseenter', '.post-item.my-history-tab', function () {
			$(this).addClass('hover');
		}).on('mouseleave', '.post-item.my-history-tab', function () {
			$(this).removeClass('hover');
		});
	};

	$.tabMenuProfile.nicknameHistory = function () {
		$(document).on('click', '#show_history_nickname', function () {
			var userId = $(this).data('pid');
			$.ajax({
				type: "POST",
				url: "/profile/me/nickname_history",
				data: {
					pid: userId
				},
				cache: false,
				success: function (rs) {
					$('#nickname_history').html(rs)
						.dialog({
							width: 500,
							height: 400,
							title: 'ประวัติการเปลี่ยนนามแฝง',
							modal: true,
							resizable: false,
							draggable: false,
							close: function () {
								//$('#nickname_history').dialog('close');
							}
						});

				}
			});

		});
	}

	/* เมื่อเลือกเปิด tab menu ของหน้า profile [CLICK] 
	 *   เมนูมีดังนี้
	 *		- กระทู้ของฉัน	{mytopic , #topics}
	 *		- กำลังติดตาม	{myfollowing , #following}
	 *		- ผู้ติดตาม		{myfollower , #follower}
	 */
	$.tabMenuProfile.tabMenuSelect = function () {
		$('.loading.b-block-inner.scroll-div').on('click', '.tabbar-item', function () {

			//			$('.my-tab-menu').addClass('freeze-click');
			if ($('.tabbar-item.my-tab-menu').hasClass('freeze-click') == false) {
				// หาชื่อของแต่ละ tab_menu ที่ถูกเรียกใช้งาน
				var tabMenu = $(this).attr('id');
				// web title เปลี่ยน กำหนดไว้ในหน้า view/profile/display
				var dataName = $(this).data('name');
				document.title = dataName;
				$('li a').removeClass('selected');
				$('.floatright').removeAttr('id');
				$('#' + tabMenu).addClass('selected');
				// เป็น div ที่แสดงข้อมูลของแต่ละ tab_menu ที่มี class ชื่อเดียวกัน โดยให้ hide ทั้งหมดก่อน
				$('.data-tabMenu-item').hide();

				if (tabMenu == 'myfollowing') {
					setTagsDefaults();
				}
				else if (tabMenu == 'myfollowingmember') {
					setFollowingMemberDefaults();
				}
				else if (tabMenu == 'myfollowermember') {
					setFollowerMemberDefaults();
				}
				else if (tabMenu == 'mypoint') {
					setPantipPointDefaults();
				}
				else if (tabMenu == 'mytopics') {
					setTopicDefaults();
				}
				else if (tabMenu == 'mycomments') {
					setCommentDefaults();
				}
				else if (tabMenu == 'mybookmarks') {
					setBookmarksDefaults();
				}
				else if (tabMenu == 'myhistory') {
					sethistoryDefaults();
				}
				else if (tabMenu == 'myblogs') {
					setBlogDefaults();
				}
				/* แสดงข้อมูลใน div{.data-tabMenu-item} เฉพาะของ tab นั้น ๆ ที่กดเลือกดู */
				$('#item_' + tabMenu).show();
				/* selected ตัวแรกเสมอ */
				$('.subtabbar-item:visible:eq(0)').addClass('selected');
				/* reset pageing*/
				$('#first_id_pageing').val('');
				$('#last_id_pageing').val('');
				$('#last_page_pageing').val('');

			}
		});
	};


	/* 
	 * Modify By KonG 
	 * 
	 */
	$.tabMenuProfile.tabMenuByUrl = function () {
		var tabMenu = window.location.hash;
		$('.floatright').removeAttr('id');
		$('.data-tabMenu-item').hide();

		if (tabMenu == '#pantip_point' && $('#mypoint').length > 0) {
			$('li a').removeClass('selected');
			$('#mypoint').addClass('selected');
			setPantipPointDefaults();
			/* แสดง tab นั้น ๆ ที่กด */
			$('#item_mypoint').show();
		}
		else if (tabMenu == '#comments') {
			$('li a').removeClass('selected');
			$('#mycomments').addClass('selected');
			setCommentDefaults();
			/* แสดง tab นั้น ๆ ที่กด */
			$('#item_mycomments').show();
		}
		else if (tabMenu == '#bookmarks') {
			$('li a').removeClass('selected');
			$('#mybookmarks').addClass('selected');
			setBookmarksDefaults();
			/* แสดง tab นั้น ๆ ที่กด */
			$('#item_mybookmarks').show();
		}
		else if (tabMenu == '#history' && $('#myhistory').length > 0) {
			$('li a').removeClass('selected');
			$('#myhistory').addClass('selected');
			sethistoryDefaults();
			/* แสดง tab นั้น ๆ ที่กด */
			$('#item_myhistory').show();
		}
		else if (tabMenu == '#blogs') {
			/* My Blogs */
			$('li a').removeClass('selected');
			$('#myblogs').addClass('selected');
			setBlogDefaults();
			/* แสดง tab นั้น ๆ ที่กด */
			$('#item_myblogs').show();
		}
		else if (tabMenu == '#following' && $('#myfollowingmember').length > 0) {
			/* My Following */
			$('li a').removeClass('selected');
			$('#myfollowingmember').addClass('selected');
			setFollowingMemberDefaults();
			/* แสดง tab นั้น ๆ ที่กด */
			$('#item_myfollowingmember').show();
		}
		else if (tabMenu == '#follower' && $('#myfollowermember').length > 0) {
			/* My Follower */
			$('li a').removeClass('selected');
			$('#myfollowermember').addClass('selected');
			setFollowerMemberDefaults();
			/* แสดง tab นั้น ๆ ที่กด */
			$('#item_myfollowermember').show();
		}
		else if (tabMenu == '#my_following' && $('#show_lists_mytags').length > 0) {
			/* My Tags */
			$('li a').removeClass('selected');
			$('#myfollowing').addClass('selected');
			setTagsDefaults();
			/* แสดง tab นั้น ๆ ที่กด */
			$('#item_myfollowing').show();
		}
		else {
			if (tabMenu != '#topics') {
				window.location.hash = 'topics';
			}
			/* My Topic */
			$('li a').removeClass('selected');
			$('#mytopics').addClass('selected');
			setTopicDefaults();
			/* แสดง tab นั้น ๆ ที่กด */
			$('#item_mytopics').show();
		}
	};

	// $(document).on('click', '.pt-ic-notification-outline, .pt-ic-notification-off-outline', () => {
	// 	$('#item_myfollowingmember').find('button.pt-php-follow-btn').attr('disabled',true)
	// 	$('#item_myfollowingmember').find('button.pt-php-following-btn').attr('disabled',true)
	// })

	$(document).on('click', '.pt-ic-notification-outline', debounce((e) => {
		if ($(e.target).hasClass('disabled')) return

		// $('#item_myfollowingmember').find('button.pt-php-follow-btn').attr('disabled',true)
		// $('#item_myfollowingmember').find('button.pt-php-following-btn').attr('disabled',true)

		element = e.target

		const mid = $(element).attr('data-mid')

		let apiUrl = '/api/follow-service/v1/members/setting/notification/' + mid
		let method = 'PATCH'

		const data = {
			status: "false"
		}

		$(element).remove()

		$(`#item-meta-${mid}`).append(`<i class="pt-lds-mini_ring" data-mid=${mid} ><div></div><div></div><div></div><div></div></i>`)

		$.ajax({
			type: method,
			url: apiUrl,
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			cache: false,
			beforeSend: function (xhr) {
				xhr.setRequestHeader('ptauthorize', `Bearer ${accessToken}`)
			},
			success: function (res) {

				$(`#item-meta-${mid} .pt-lds-mini_ring`).remove()

				$(`#item-meta-${mid}`).append(`<i class="pantip-icons pt-ic-notification-off-outline icon-va-8 icolor-secondary" data-mid="${mid}"></i>`)
				// $('#item_myfollowingmember').find('button.pt-php-follow-btn').attr('disabled',false)
				// $('#item_myfollowingmember').find('button.pt-php-following-btn').attr('disabled',false)
			},
			error: function () {
				$(this).prop("disabled", false)
				$(`#item-meta-${mid} .pt-lds-mini_ring`).remove()
				$(`#item-meta-${mid}`).append(`<i class="pantip-icons pt-ic-notification-outline icon-va-8 icolor-secondary" data-mid="${mid}"></i>`)
				// $('#item_myfollowingmember').find('button.pt-php-follow-btn').attr('disabled',false)
				// $('#item_myfollowingmember').find('button.pt-php-following-btn').attr('disabled',false)
			}
		})
	}))

	function debounce(callback, timeout = 1000) {
		let timer
		return (...args) => {
			clearTimeout(timer)
			timer = setTimeout(() => callback(...args), timeout)
		}
	}

	$(document).on('click', '.pt-ic-notification-off-outline', debounce((e) => {
		if ($(e.target).hasClass('disabled')) return

		// $('#item_myfollowingmember').find('button.pt-php-follow-btn').attr('disabled',true)
		// $('#item_myfollowingmember').find('button.pt-php-following-btn').attr('disabled',true)

		element = e.target

		const mid = $(element).attr('data-mid')

		let apiUrl = '/api/follow-service/v1/members/setting/notification/' + mid
		let method = 'PATCH'

		const data = {
			status: "true"
		}

		$(element).remove()

		$(`#item-meta-${mid}`).append(`<i class="pt-lds-mini_ring" data-mid=${mid} ><div></div><div></div><div></div><div></div></i>`)

		$.ajax({
			type: method,
			url: apiUrl,
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			cache: false,
			beforeSend: function (xhr) {
				xhr.setRequestHeader('ptauthorize', `Bearer ${accessToken}`)
			},
			success: function (res) {

				$(`#item-meta-${mid} .pt-lds-mini_ring`).remove()

				$(`#item-meta-${mid}`).append(`<i class="pantip-icons pt-ic-notification-outline icon-va-8 icolor-secondary" data-mid="${mid}"></i>`)
				// $('#item_myfollowingmember').find('button.pt-php-follow-btn').attr('disabled',false)
				// $('#item_myfollowingmember').find('button.pt-php-following-btn').attr('disabled',false)
			},
			error: function () {
				$(this).prop("disabled", false)
				$(`#item-meta-${mid} .pt-lds-mini_ring`).remove()
				$(`#item-meta-${mid}`).append(`<i class="pantip-icons pt-ic-notification-off-outline icon-va-8 icolor-secondary" data-mid="${mid}"></i>`)
				// $('#item_myfollowingmember').find('button.pt-php-follow-btn').attr('disabled',false)
				// $('#item_myfollowingmember').find('button.pt-php-following-btn').attr('disabled',false)
			}
		})
	}))

	$.tabMenuProfile.clickFollow = function () {
		$(document).on('click', 'button.pt-php-follow-btn, button.pt-php-following-btn', function () {
			$(this).parent('.pt-php-follow-lists-item__meta').find('i.pt-ic-notification-outline, i.pt-ic-notification-off-outline').addClass('disabled')

			if (accessToken) {
				const buttonText = $('span', this).text();
				if (!['ติดตาม', 'กำลังติดตาม'].includes(buttonText)) return;

				$('#item_myfollowingmember').find('button.pt-php-follow-btn').attr('disabled',true)
				$('#item_myfollowingmember').find('button.pt-php-following-btn').attr('disabled',true)

				const target = $(this);
				$(this).prop("disabled", true);
				const mid = $(this).attr('data-mid');
				let apiUrl = '/api/follow-service/v1/members';
				// let apiUrl = '/api/follow-service/api/follow-service/v1/members';
				let method = 'POST';

				if (buttonText === 'ติดตาม') {
					cntFollowingCheck = cntFollowingCheck + 1
					apiUrl += `/follow/${mid}`;
					method = 'POST';
				}
				if (buttonText === 'กำลังติดตาม') {
					cntFollowingCheck = cntFollowingCheck - 1
					apiUrl += `/unfollow/${mid}`;
					method = 'DELETE';
				}

				$.ajax({
					type: method,
					url: apiUrl,
					dataType: 'json',
					cache: false,
					beforeSend: function (xhr) {
						xhr.setRequestHeader('ptauthorize', accessToken ? `Bearer ${accessToken}` : 'Basic dGVzdGVyOnRlc3Rlcg==')
					},
					success: function (res) {
						if (res.success) {
							$('span', target).text(buttonText === 'ติดตาม' ? 'กำลังติดตาม' : 'ติดตาม')
							$(target).prop(
								'class',
								buttonText === 'ติดตาม'
									? 'pt-php-following-btn pt-php-btn-sm pt-php-btn-secondary'
									: 'pt-php-follow-btn pt-php-btn-sm pt-php-btn-primary'
							)

							if (isOwner && window.location.hash === '#following' && $(target).parent('div').find('.pantip-icons').length) {
								$(target).parent('div').find('.pantip-icons').remove();
								$(target).parent('div').append(
									buttonText === 'ติดตาม'
										? `<i class="pantip-icons pt-ic-notification-outline icon-va-8 icolor-secondary" data-mid="${mid}"></i>`
										: '<i class="pantip-icons" style="cursor: default !important;"></i>'
								);
							}
						}
						if (!res.success) {
							$.errorNotice.dialog(res.error_message, {
								title: 'แจ้งเตือน',
								btn_close: 'ดำเนินการต่อ'
							});
						}
						$(target).prop("disabled", false);
						$('#item_myfollowingmember').find('button.pt-php-follow-btn').attr('disabled',false)
						$('#item_myfollowingmember').find('button.pt-php-following-btn').attr('disabled',false)
					},
					error: function () {
						$.errorNotice.dialog('มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง', {
							title: 'แจ้งเตือน',
							btn_close: 'ดำเนินการต่อ'
						});
						$(target).prop("disabled", false);
						$('#item_myfollowingmember').find('button.pt-php-follow-btn').attr('disabled',false)
						$('#item_myfollowingmember').find('button.pt-php-following-btn').attr('disabled',false)
					}
				});
			} else {
				window.location.assign(`/login?redirect=${window.btoa(window.location.href)}`);
			}
		});
	}

	/**
	 * เป็น function ที่ดึงข้อมูลตาม เงื่อนไขเมนูนั้นๆ
	 *  - โดยดึงข้อมูลจากการเลือกเมนู หน้าเข้าผ่าน url
	 *  - เป็นการดึงข้อมูลของ Topic ของ user คนนั้นๆ
	 */
	function setTopicDefaults() {
		// ดึงค่า default มาใช้ เพื่อเช็คว่าหน้า load หน้านั้นแล้วไม่ให้คลิกเรียก ajax ซ้ำ
		var options = $.tabMenuProfile.defaults;
		if (options.myTopic == true) {
			$.tabMenuProfile.objectSet({
				div_show: $('div.#show_lists_topic'),
				div_show_topic: $('div.#show_lists_topic'),
				div_scroll_up: $('div.anchor_scroll.my-topic'),
				div_show_page: $('div#show_pages_topic')
			});

			// หาค่าของ profile_id ของ user คนนั้นๆ ที่ต้องการดูข้อมูล
			var profileId = $(document).find('.profile-follow').attr('id');
			var arr_pid = profileId.split('p_');
			var pid = arr_pid[1];
			var typeTopic = 'topic';
			// เรียก function listDataPage() เพื่อดึงข้อมูล
			listDataPage(pid, typeTopic);



			// กำหนดค่าให้เพื่อใช้ในการดูข้อมูล tab menu อื่นๆๆ
			$.tabMenuProfile.objectSet({
				myTopic: false,
				following: true,
				follower: true,
				myPoint: true,
				myComment: true,
				myBookmarks: true,
				myhistory: true,
				myBlogs: true,
				myTag: true
			});
		}
	}


	/**
	 * เป็น function ที่ดึงข้อมูลตาม เงื่อนไขเมนูนั้นๆ
	 *  - โดยดึงข้อมูลจากการเลือกเมนู หน้าเข้าผ่าน url
	 *  - เป็นการดึงข้อมูลของ Pantip Point ของ user คนนั้นๆ
	 */
	function setPantipPointDefaults() {
		// ดึงค่า default มาใช้ เพื่อเช็คว่าหน้า load หน้านั้นแล้วไม่ให้คลิกเรียก ajax ซ้ำ
		var options = $.tabMenuProfile.defaults;
		if (options.myPoint == true) {
			$.tabMenuProfile.objectSet({
				div_show: $('div.#show_lists_point'),
				div_show_topic: $('div.#show_lists_point'),
				div_scroll_up: $('div.anchor_scroll.my-point'),
				div_show_page: $('div#show_pages_point')
			});

			// หาค่าของ profile_id ของ user คนนั้นๆ ที่ต้องการดูข้อมูล
			var profileId = $(document).find('.profile-follow').attr('id');
			var arr_pid = profileId.split('p_');
			var pid = arr_pid[1];
			var typeTab = 'pantip-point';
			// เรียก function listDataPage() เพื่อดึงข้อมูล
			listDataPage(pid, typeTab);


			// กำหนดค่าให้เพื่อใช้ในการดูข้อมูล tab menu อื่นๆๆ
			$.tabMenuProfile.objectSet({
				myTopic: true,
				following: true,
				follower: true,
				myPoint: false,
				myComment: true,
				myBookmarks: true,
				myhistory: true,
				myBlogs: true,
				myTag: true
			});
		}
	}


	/*
	 * Create By KonG
	 **/
	function setCommentDefaults() {
		// ดึงค่า default มาใช้ เพื่อเช็คว่าหน้า load หน้านั้นแล้วไม่ให้คลิกเรียก ajax ซ้ำ
		var options = $.tabMenuProfile.defaults;
		if (options.myComment == true) {
			$.tabMenuProfile.objectSet({
				div_show: $('div.#show_lists_comment'),
				div_show_topic: $('div.#show_lists_comment'),
				div_scroll_up: $('div.anchor_scroll.my-comment'),
				div_show_page: $('div#show_pages_comment')
			});

			// หาค่าของ profile_id ของ user คนนั้นๆ ที่ต้องการดูข้อมูล
			var profileId = $(document).find('.profile-follow').attr('id');
			var arr_pid = profileId.split('p_');
			var pid = arr_pid[1];
			var typeTab = 'comment';
			// เรียก function listDataPage() เพื่อดึงข้อมูล
			listDataPage(pid, typeTab);


			// กำหนดค่าให้เพื่อใช้ในการดูข้อมูล tab menu อื่นๆๆ
			$.tabMenuProfile.objectSet({
				myTopic: true,
				following: true,
				follower: true,
				myPoint: true,
				myComment: false,
				myBookmarks: true,
				myhistory: true,
				myBlogs: true,
				myTag: true
			});
		}
	}
	/*
	 * Create By KonG
	 **/

	function sethistoryDefaults() {

		// ดึงค่า default มาใช้ เพื่อเช็คว่าหน้า load หน้านั้นแล้วไม่ให้คลิกเรียก ajax ซ้ำ
		var options = $.tabMenuProfile.defaults;
		if (options.myhistory == true) {
			$.tabMenuProfile.objectSet({
				div_show: $('div.#show_lists_history'),
				div_show_topic: $('div.#show_lists_history'),
				div_scroll_up: $('div.anchor_scroll.my-history'),
				div_show_page: $('div#show_pages_history')
			});

			// หาค่าของ profile_id ของ user คนนั้นๆ ที่ต้องการดูข้อมูล
			var profileId = $(document).find('.profile-follow').attr('id');
			var arr_pid = profileId.split('p_');
			var pid = arr_pid[1];
			var typeTab = 'history';
			// เรียก function listDataPage() เพื่อดึงข้อมูล

			listDataPage(pid, typeTab);


			// กำหนดค่าให้เพื่อใช้ในการดูข้อมูล tab menu อื่นๆๆ
			$.tabMenuProfile.objectSet({
				myTopic: true,
				following: true,
				follower: true,
				myPoint: true,
				myComment: true,
				myBookmarks: true,
				myhistory: false,
				myBlogs: true,
				myTag: true
			});
		}
	}
	/*
	 * Create By KonG
	 **/
	function setBookmarksDefaults() {
		// ดึงค่า default มาใช้ เพื่อเช็คว่าหน้า load หน้านั้นแล้วไม่ให้คลิกเรียก ajax ซ้ำ
		var options = $.tabMenuProfile.defaults;
		if (options.myBookmarks == true) {
			$.tabMenuProfile.objectSet({
				div_show: $('div.#show_lists_bookmarks'),
				div_show_topic: $('div.#show_lists_bookmarks'),
				div_scroll_up: $('div.anchor_scroll.my-bookmarks'),
				div_show_page: $('div#show_pages_bookmarks')
			});

			// หาค่าของ profile_id ของ user คนนั้นๆ ที่ต้องการดูข้อมูล
			var profileId = $(document).find('.profile-follow').attr('id');
			var arr_pid = profileId.split('p_');
			var pid = arr_pid[1];
			var typeTab = 'bookmarks';
			// เรียก function listDataPage() เพื่อดึงข้อมูล
			listDataPage(pid, typeTab);


			// กำหนดค่าให้เพื่อใช้ในการดูข้อมูล tab menu อื่นๆๆ
			$.tabMenuProfile.objectSet({
				myTopic: true,
				following: true,
				follower: true,
				myPoint: true,
				myComment: true,
				myBookmarks: false,
				myhistory: true,
				myBlogs: true,
				myTag: true
			});
		}
	}

	/**
	 * My Blogs
	 * @author Muay
	 */
	function setBlogDefaults() {
		// ดึงค่า default มาใช้ เพื่อเช็คว่าหน้า load หน้านั้นแล้วไม่ให้คลิกเรียก ajax ซ้ำ
		var options = $.tabMenuProfile.defaults;
		if (options.myBlogs == true) {
			$.tabMenuProfile.objectSet({
				div_show: $('div.#show_lists_item_blogs'), /* เป็น div child ที่แสดงข้อมูลเป็น html [@author Muay]*/
				div_scroll_up: $('div.anchor_scroll.my-blogs'),
				div_show_page: $('div#show_pages_blogs')
			});

			// หาค่าของ profile_id ของ user คนนั้นๆ ที่ต้องการดูข้อมูล
			var profileId = $(document).find('.profile-follow').attr('id');
			var arr_pid = profileId.split('p_');
			var pid = arr_pid[1];
			var typeTab = 'blogs';
			// เรียก function listDataPage() เพื่อดึงข้อมูล
			listDataPage(pid, typeTab);


			// กำหนดค่าให้เพื่อใช้ในการดูข้อมูล tab menu อื่นๆๆ
			$.tabMenuProfile.objectSet({
				myTopic: true,
				following: true,
				follower: true,
				myPoint: true,
				myComment: true,
				myBookmarks: true,
				myhistory: true,
				myBlogs: false,
				myTag: true
			});
		}
	}
	/**
	 * Modify By KonG
	 */
	var ajax_request;
	function listDataPage(pid, typeName) {
		// เช็คว่าต้องดึงข้อมูลประเภทไหน แล้วให้สร้าง url ที่ต้องการดึงข้อมูล
		var typeTab = '';
		var url = '';
		var last = '';

		if (typeName == 'following') {
			typeTab = 'following';
			url = '/profile/me/ajax_my_follow';
		}
		else if (typeName == 'follower') {
			typeTab = 'follower';
			url = '/profile/me/ajax_my_follow';
		}
		else if (typeName == 'pantip-point' && $('#mypoint').length > 0) {
			typeTab = 'pantip-point';
			url = '/profile/me/ajax_my_pantip_point';
		}
		else if (typeName == 'comment') {
			typeTab = 'comment';
			url = '/profile/me/ajax_my_comment';
		}
		else if (typeName == 'bookmarks') {
			typeTab = 'bookmarks';
			url = '/profile/me/ajax_my_bookmarks';
		}
		else if (typeName == 'history' && $('#myhistory').length > 0) {
			typeTab = 'history';
			url = '/profile/me/ajax_my_history';
		}
		else if (typeName == 'blogs') {
			typeTab = 'blogs';
			url = '/profile/me/ajax_my_blogs';
		}
		else if (typeName == 'tags') {
			typeTab = 'tags';
			url = '/profile/me/ajax_my_tags';
		}
		else {
			typeTab = 'topic';
			url = '/profile/me/ajax_my_topic';
		}

		//		if(ajaxSending == true)
		//		{
		//			ajax_request.abort();
		//			ajaxSending = false;
		//		}
		//		$.extend($.tabMenuProfile.defaults,{			
		//			'div_scroll_up' : $('div.anchor_scroll')
		//		});

		$('.my-tab-menu').addClass('freeze-click');
		var unix = (new Date().getTime()) + (Math.ceil(Math.random() * 100));
		var dataTypes = 'json';
		if (typeTab == 'blogs') {// เนื่องจากดึงมาเป็น HTML เลยกำหนด dataType เป็น html [@author Muay]
			dataTypes = 'html';
		}


		ajax_request = $.ajax({
			type: 'GET',
			url: url + '?type=' + typeTab + '&mid=' + pid + '&p=1' + '&t=' + unix,
			dataType: dataTypes,
			cache: false,
			success: function (rs) {

				//console.log(typeTab);
				/* My Blogs */
				if (typeTab == 'blogs') {// เนื่องจากดึงมาเป็น HTML เลยกำหนด dataType เป็น html [@author Muay]
					$.tabMenuProfile.defaults.div_show.html(rs);
					$('.my-tab-menu').removeClass('freeze-click');
					return false;
				}

				if (rs.status == 'success') {

					if ($('#last_id_pageing').val() == '') {
						$('#last_id_pageing').val(rs.last_id);

					}

					if ($('#first_id_pageing').val() == '') {
						$('#first_id_pageing').val(rs.first_id);

					}
					if ($('#first_pin_pageing').val() == '') {
						$('#first_pin_pageing').val(rs.first_pin);

					}
					if ($('#last_pin_pageing').val() == '') {
						$('#last_pin_pageing').val(rs.last_pin);

					}
					$('#last_page_pageing').val(rs.page);

					/* ไม่มี ข้อมูล */
					if (rs.max_page == 0) {


						$.tabMenuProfile.defaults.div_show.html(
							$("#no-post-template-" + typeTab).render('no-post')
						);

						$('.my-tab-menu').removeClass('freeze-click');

						return false;
					}
					/* My Topic */
					if (typeTab == 'topic') {
						//console.log($.tabMenuProfile.defaults);
						$.tabMenuProfile.defaults.div_show.html(
							$("#post-template-" + typeTab).render(rs.result)
						);

						$('#page_my_topic').pagination({
							request_type: 'GET',
							max: rs.max_page,
							url: url + '?type=' + typeTab + '&mid=' + pid,
							divDefaults: $.tabMenuProfile.defaults,
							template: $("#post-template-" + typeTab),
							cal_new_max: true,
							jsrender: true
						});

						$('abbr.timeago').timeago();
						$('.my-tab-menu').removeClass('freeze-click');
						return false;
					}

					/* My Comment */
					if (typeTab == 'comment') {
						//console.log($.tabMenuProfile.defaults);
						$.tabMenuProfile.defaults.div_show.html(
							$("#post-template-" + typeTab).render(rs.result)
						);
						//console.log($.tabMenuProfile.defaults);
						$('#page_my_comment').pagination({
							request_type: 'GET',
							max: rs.max_page,
							url: url + '?type=' + typeTab + '&mid=' + pid,
							divDefaults: $.tabMenuProfile.defaults,
							template: $("#post-template-" + typeTab),
							cal_new_max: true,
							jsrender: true
						});
						//					
						$('abbr.timeago').timeago();
						$('.my-tab-menu').removeClass('freeze-click');
						return false;
					}

					/* My Bookmarks */
					if (typeTab == 'bookmarks') {
						//console.log($.tabMenuProfile.defaults);
						$.tabMenuProfile.defaults.div_show.html(
							$("#post-template-" + typeTab).render(rs.result)
						);
						//console.log($.tabMenuProfile.defaults);
						$('#page_my_bookmarks').pagination({
							request_type: 'GET',
							max: rs.max_page,
							url: url + '?type=' + typeTab + '&mid=' + pid,
							divDefaults: $.tabMenuProfile.defaults,
							template: $("#post-template-" + typeTab),
							cal_new_max: true,
							jsrender: true
						});
						//					
						$('abbr.timeago').timeago();
						$('.my-tab-menu').removeClass('freeze-click');
						return false;
					}

					/* My History */
					if (typeTab == 'history') {

						//console.log($.tabMenuProfile.defaults);
						$.tabMenuProfile.defaults.div_show.html(
							$("#post-template-" + typeTab).render(rs.result)
						);
						//console.log($.tabMenuProfile.defaults);
						$('#page_my_history').pagination({
							request_type: 'GET',
							max: rs.max_page,
							url: url + '?type=' + typeTab + '&mid=' + pid,
							divDefaults: $.tabMenuProfile.defaults,
							template: $("#post-template-" + typeTab),
							cal_new_max: true,
							jsrender: true
						});
						//					
						$('abbr.timeago').timeago();
						$('.my-tab-menu').removeClass('freeze-click');
						return false;
					}

					/* My Point */
					if (typeTab == 'pantip-point') {
						//console.log($.tabMenuProfile.defaults);
						$.tabMenuProfile.defaults.div_show.html(
							$("#post-template-" + typeTab).render(rs.result)
						);
						$('.my-tab-menu').removeClass('freeze-click');
						return false;
					}

					if (typeTab == 'tags') {
						// tagsTemplate = "#post-template-"+typeTab;
						// if($('.leftside.fullpage').length == 1) {
						// 	tagsTemplate = "#post-template-"+typeTab+"-fullpage";
						// }
						tagsTemplate = "#post-template-" + typeTab + "-fullpage";
						var isShowMenu = $('.leftside.fullpage').length == 1 ? true : false;
						var myHelpers = { isShowMenu: isShowMenu };

						$.tabMenuProfile.defaults.div_show.html(
							$(tagsTemplate).render(rs.result, myHelpers)
						);


						$('#page_my_tags').pagination({
							request_type: 'GET',
							max: rs.max_page,
							url: url + '?type=' + typeTab + '&mid=' + pid,
							divDefaults: $.tabMenuProfile.defaults,
							template: $(tagsTemplate),
							cal_new_max: true,
							jsrender: true
						});

						$('abbr.timeago').timeago();

						$('.my-tab-menu').removeClass('freeze-click');
						return false;
					}
				}
			}
		});
	}



	function setTagsDefaults() {
		// ดึงค่า default มาใช้ เพื่อเช็คว่าหน้า load หน้านั้นแล้วไม่ให้คลิกเรียก ajax ซ้ำ
		var options = $.tabMenuProfile.defaults;
		if (options.myTag == true) {

			$.tabMenuProfile.objectSet({
				div_show: $('div.#show_lists_mytags'),
				div_show_topic: $('div.#show_lists_mytags'),
				div_scroll_up: $('div.anchor_scroll.my-tags'),
				div_show_page: $('div.#page_my_tags')
			});

			// หาค่าของ profile_id ของ user คนนั้นๆ ที่ต้องการดูข้อมูล
			var profileId = $(document).find('.profile-follow').attr('id');
			var arr_pid = profileId.split('p_');
			var pid = arr_pid[1];
			var typeTab = 'tags';
			// เรียก function listDataPage() เพื่อดึงข้อมูล
			listDataPage(pid, typeTab);
			$(".click-pinunpin-profile").live('click', function (e) {
				var tag_name = $(this).data("tag");
				var ispin = $(this).data("pin");
				if (tag_name != '') {
					if (ispin == 1) {
						$.pintags.unpintags(tag_name, function () {
							listDataPage(pid, typeTab);
						});
					} else {
						$.pintags.pintags(tag_name, function () {
							$('#first_id_pageing').val('');
							$('#last_id_pageing').val('');
							$('#last_page_pageing').val('');
							listDataPage(pid, typeTab);
						});
					}

				} else {
					var error = { error: true, error_message: 'เกิดข้อผิดพลาด' }
					validation_error(error);
				}
			});


			// กำหนดค่าให้เพื่อใช้ในการดูข้อมูล tab menu อื่นๆๆ
			$.tabMenuProfile.objectSet({
				myTopic: true,
				following: true,
				follower: true,
				myPoint: true,
				myComment: true,
				myBookmarks: true,
				myhistory: true,
				myBlogs: true,
				myTag: false
			});
		}
	}

	function setFollowingMemberDefaults() {

		// ดึงค่า default มาใช้ เพื่อเช็คว่าหน้า load หน้านั้นแล้วไม่ให้คลิกเรียก ajax ซ้ำ
		var options = $.tabMenuProfile.defaults;
		if (options.following == true) {
			$.tabMenuProfile.objectSet({
				div_show: $('ul.#show_lists_following'),
				div_show_topic: $('ul.#show_lists_following'),
				div_scroll_up: $('div.anchor_scroll.my-following'),
				div_show_page: ''
			});

			listDataFollow('following');

			if (ownerProfileCheck === 1 && suggestMembers.length === 0) {

				$('#container-suggest-follow-list').remove()
				$('#container-suggest-follow-header').remove()
			}

			// cntFollowingCheck = 0;
			// suggestMembers = [];

			$.tabMenuProfile.objectSet({
				myTopic: true,
				following: false,
				follower: true,
				myPoint: true,
				myComment: true,
				myBookmarks: true,
				myhistory: true,
				myBlogs: true,
				myTag: true
			});
		}
	}

	function setFollowerMemberDefaults() {
		// ดึงค่า default มาใช้ เพื่อเช็คว่าหน้า load หน้านั้นแล้วไม่ให้คลิกเรียก ajax ซ้ำ
		var options = $.tabMenuProfile.defaults;
		if (options.follower == true) {
			$.tabMenuProfile.objectSet({
				div_show: $('ul.#show_lists_follower'),
				div_show_topic: $('ul.#show_lists_follower'),
				div_scroll_up: $('div.anchor_scroll.my-follower'),
				div_show_page: ''
			});

			listDataFollow('follower');

			$.tabMenuProfile.objectSet({
				myTopic: true,
				following: true,
				follower: false,
				myPoint: true,
				myComment: true,
				myBookmarks: true,
				myhistory: true,
				myBlogs: true,
				myTag: true
			});
		}
	}

	function listDataFollow(tapType = '', data = {}, loadmore = false) {

		$('#container-suggest-follow-list').remove()
		$('#container-suggest-follow-header').remove()

		if (!accessToken) accessToken = $('#actk').val();
		if (typeof isOwner !== "boolean") isOwner = $('#is_owner').val() ? JSON.parse($('#is_owner').val()) : false;
		if (typeof displayProfileId !== "number") {
			const profileId = $(document).find('.profile-follow').attr('id');
			const arr_pid = profileId.split('p_');
			const pid = arr_pid[1];
			displayProfileId = +pid
		}

		let apiUrl = '/api/follow-service/v1/members';

		if (['following', 'follower'].includes(tapType)) {
			apiUrl += `/${tapType}/${displayProfileId}`;

			$('.my-tab-menu').addClass('freeze-click');
			// $(`#${tapType}-loadmore`).remove();
			$(`#show_pages_${tapType}`).empty()
			$(document).off('click', `#${tapType}-loadmore`);
			if (!loadmore) $.tabMenuProfile.defaults.div_show.empty();
			if (!loadmore) $(`.pt-php-lists-item`).remove();
			if (!loadmore) suggestMembers = [...suggestMembersTemp];
			if (!loadmore) $('#container-following').find('#show_pages_following').remove()
			if (!loadmore) $(`.btn_loadmore_follow_list`).remove();

			if (tapType == 'following') {

				if ($('#show_member_suggest_header')) {

					$('#show_member_suggest_header').remove()
					$('#show_member_suggest_list').remove()
				}

				followContainer = `<div class="post-list-wrapper" id="container-following">
				<div class="pt-php-suggest-follow-header">สมาชิกที่กำลังติดตาม</div>
				<div class="pt-php-user-follow-block">
					<ul class="pt-php-user-follow-lists pt-php-lists-dense pt-lists--two-line pt-php-lists--image-list" id="show_lists_following">
					</ul>
				</div>
			</div>`

				if ($('#container-following').length == 0) {

					$('#item_myfollowingmember').prepend(followContainer)
				}
			}

			followSkeletonLoadShow(tapType)

			$.ajax({
				type: 'GET',
				url: apiUrl,
				data: data,
				dataType: 'json',
				cache: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('ptauthorize', accessToken ? `Bearer ${accessToken}` : 'Basic dGVzdGVyOnRlc3Rlcg==')
				},
				success: function (res) {
					followSkeletonLoadRemove()
					if (res.data.length > 0) {

						if (tapType == 'following') {
							const resDataIds = new Set(res.data.map(item => item.member_id))
							suggestMembers = suggestMembers.filter(follow => !resDataIds.has(follow.member_id))

							// 	console.log('bb')

							// 	if ($('#show_member_suggest_header')) {

							// 		$('#show_member_suggest_header').remove()
							// 		$('#show_member_suggest_list').remove()
							// 	}

							// 	followContainer = `<div class="post-list-wrapper" id="container-following">
							// 	<div class="pt-php-suggest-follow-header">สมาชิกที่กำลังติดตาม</div>
							// 	<div class="pt-php-user-follow-block">
							// 		<ul class="pt-php-user-follow-lists pt-php-lists-dense pt-lists--two-line pt-php-lists--image-list" id="show_lists_following">
							// 		</ul>
							// 	</div>
							// </div>`

							// 	if ($('#container-following').length == 0) {

							// 		$('#item_myfollowingmember').append(followContainer)
							// 	}

							cntFollowingCheck = res.data.length
						}


						listFollowingDataCheck = res.data
						// if (!loadmore) $.tabMenuProfile.defaults.div_show.html($(`#post-template-${tapType}`).render(res.data));
						// if (loadmore) followRender(tapType, res.data);
						followRender(tapType, res.data);

						if (res.next_id && $('.btn_loadmore_follow_list').length === 0) {
							$(`#container-following`).append(`
							<div class="post-list-wrapper" id="show_pages_following">
								<div class="pagination-wrapper" style="margin-bottom: 40px;"></div>
								<!-- Pagination -->
							</div>
								<div class="pagination-wrapper btn_loadmore_follow_list" style="margin-bottom: 40px;">
									<table>
										<tbody>
											<tr>
												<td id"page_my_${tapType}">
													<ul class="pagination" style="visibility: visible;">
														<li><a href="javascript:void(0);" class="next numbers" id="${tapType}-loadmore" style="visibility: visible;" tabindex="-1">ดูเพิ่มเติม</a></li>
													</ul>
												</td>
											</tr>
										</tbody>
									</table>
								</div>`);

							}
							$(document).on('click', `#${tapType}-loadmore`, (event) => {

								$(document).off('click', `#${tapType}-loadmore`);
								$(`.btn_loadmore_follow_list`).remove();
								$(`#show_pages_following`).remove();
								// $(`#show_pages_${tapType}`).empty()
								listDataFollow(tapType, { next_id: res.next_id }, true);
							});
					}
					else {

						if (tapType == 'following') {
							$('#container-following').remove()
							cntFollowingCheck = 0
						}

						if (!loadmore) {

							if (ownerProfileCheck == 0) {

								// $('#show_lists_member_suggest').remove()

								followContainer = `<div class="post-list-wrapper" id="container-following">
								<div class="pt-php-suggest-follow-header">สมาชิกที่กำลังติดตาม</div>
								<div class="pt-php-user-follow-block">
									<ul class="pt-php-user-follow-lists pt-php-lists-dense pt-lists--two-line pt-php-lists--image-list" id="show_lists_following">
									</ul>
								</div>
							</div>`

								if ($('#container-following').length == 0) {

									$('#item_myfollowingmember').prepend(followContainer)
								}
							}

							if (tapType === 'following' && ownerProfileCheck == 1 && cntFollowingCheck == 0 && suggestMembers.length == 0) {

								console.log('a')

								listDataSuggest()
							}

							$(`#show_lists_${tapType}`).append(`<div class="post-item blank">
							<div class="post-item-title">${tapType === 'following' ? 'ยังไม่ได้ติดตามใคร' : 'ยังไม่มีใครมาติดตาม'}</div>
							<div class="post-item-footer"></div>
						</div>`)
						}
					}

					$('abbr.timeago').timeago();
					$('.my-tab-menu').removeClass('freeze-click');
				},
				error: function () {
					followSkeletonLoadRemove()

					$('abbr.timeago').timeago();
					$('.my-tab-menu').removeClass('freeze-click');

					if (!loadmore) {
						$(`#show_lists_${tapType}`).append(`
							<div class="post-item blank">
								<div class="post-item-title">ไม่พบข้อมูล</div>
								<div class="post-item-footer"></div>
							</div>
						`);
					}
				},
				complete: function () {
					if (tapType === 'following' && suggestMembers && suggestMembers.length) {
						followSuggestRender(tapType, suggestMembers)
					}
				},
			})
		}
	}

	function listDataSuggest() {

		$('#show_member_suggest_header').remove()
		$('#show_member_suggest_list').remove()

		const memberSuggestElement = `<div class="pt-php-suggest-follow-header" id="show_member_suggest_header">สมาชิกที่คุณอาจสนใจ</div>
		<div class="pt-php-user-follow-block" id="show_member_suggest_list">
			<ul class="pt-php-user-follow-lists pt-php-lists-dense pt-lists--two-line pt-php-lists--image-list " id="show_lists_member_suggest">
			</ul>
		</div>`

		$('#item_myfollowingmember').append(memberSuggestElement)

		followSkeletonLoadShowA()

		$.ajax({
			type: 'GET',
			url: '/api/follow-service/v1/members/suggest',
			cache: false,
			beforeSend: function (xhr) {
				xhr.setRequestHeader('ptauthorize', accessToken ? `Bearer ${accessToken}` : 'Basic dGVzdGVyOnRlc3Rlcg==')
			},
			success: function (res) {
				followSkeletonLoadRemove()
				if (res.data.length > 0) {
					followMemberSuggestRender('following', res.data)
				}

				$('abbr.timeago').timeago();
				$('.my-tab-menu').removeClass('freeze-click');
			},
			error: function () {

				followSkeletonLoadRemove()

				$('abbr.timeago').timeago();
				$('.my-tab-menu').removeClass('freeze-click');

				$(`#show_lists_member_suggest`).append(`<div class="post-item blank">
				<div class="post-item-title">ไม่พบข้อมูล</div>
				<div class="post-item-footer"></div></div>`)
			},
			complete: function () {
				// console.log(suggestMembers)
				// if (tapType === 'following' && !loadmore && suggestMembers && suggestMembers.length) {
				// 	followSuggestRender(tapType, suggestMembers)
				// }
			},
		})
	}

	function followMemberSuggestRender(type, data = []) {

		for (const i of data) {
			$(`#show_lists_member_suggest`).append(`
				<li class="pt-php-lists-item">
					<div class="pt-php-following-user">
						<a class="pt-php-follow-lists-item__graphic-link" href="/profile/${i.member_id}" title="${i.nickname}" target="_blank">
							<span class="pt-php-follow-lists-item__graphic  pt-php-img-thumbnail" style="background-image: url(${i.avatar?.large || ''});"></span>
						</a>
						<span class="pt-php-follow-lists-item__text">
							<div class="pt-php-user-follow-detail">
								<a href="/profile/${i.member_id}" target="_blank" title="${i.nickname}" style="margin-right: 4px;" >
									<span class="pt-php-follow-lists-item__primary-text">${i.nickname}</span>
								</a>
							</div>
						</span>
						<div class="pt-php-follow-lists-item__meta" id="item-meta-${i.member_id}">
							<button class="pt-php-follow-btn pt-php-btn-sm pt-php-btn-primary" data-mid="${i.member_id}"><span>ติดตาม</span></button>
							<i class="pantip-icons" style="cursor: default !important;"></i>
						</div>
					</div>
				</li>`);
		}
	}

	function followSuggestRender(type, data = []) {

		const followSuggestElement = `<div class="pt-php-suggest-follow-header" id="container-suggest-follow-header">สมาชิกแนะนำ</div>
		<div class="pt-php-user-follow-block" id="container-suggest-follow-list">
			<ul class="pt-php-user-follow-lists pt-php-lists-dense pt-lists--two-line pt-php-lists--image-list" id="show_lists_suggest">
			<!-- Lists follow_name from ajax -->
			</ul>
		</div>`

		$('#item_myfollowingmember').append(followSuggestElement)

		for (const i of data) {
			$(`#show_lists_suggest`).append(`
				<li class="pt-php-lists-item">
					<div class="pt-php-following-user">
						<a class="pt-php-follow-lists-item__graphic-link" href="/profile/${i.member_id}" title="${i.nickname}" target="_blank">
							<span class="pt-php-follow-lists-item__graphic  pt-php-img-thumbnail" style="background-image: url(${i.avatar || ''});"></span>
						</a>
						<span class="pt-php-follow-lists-item__text">
							<div class="pt-php-user-follow-detail">
								<a href="/profile/${i.member_id}" target="_blank" title="${i.nickname}" style="margin-right: 4px;" >
									<span class="pt-php-follow-lists-item__primary-text">${i.nickname}</span>
								</a>
							</div>
						</span>
						<div class="pt-php-follow-lists-item__meta" id="item-meta-${i.member_id}">
							<button class="pt-php-follow-btn pt-php-btn-sm pt-php-btn-primary" data-mid="${i.member_id}"><span>ติดตาม</span></button>
							<i class="pantip-icons" style="cursor: default !important;"></i>
						</div>
					</div>
				</li>`);
		}
	}

	function followRender(type, data = []) {

		for (const i of data) {
			const isFollowing = type == 'following';
			const isLoggedIn = !!accessToken

			$(`#show_lists_${type}`).append(`
				<li class="pt-php-lists-item follow-with-description">
					<div class="pt-php-following-user">
						<a class="pt-php-follow-lists-item__graphic-link" href="/profile/${i.member_id}" title="${i.nickname}" target="_blank">
							<span class="pt-php-follow-lists-item__graphic  pt-php-img-thumbnail" style="background-image: url(${i.avatar?.large || ''});"></span>
						</a>
						<span class="pt-php-follow-lists-item__text">
							<div class="pt-php-user-follow-detail">
								<a  href="/profile/${i.member_id}" target="_blank" title="${i.nickname}" style="margin-right: 4px;">
									<span class="pt-php-follow-lists-item__primary-text">${i.nickname}</span>
								</a>
								${i.user_icon == 'mobile' ? `<a title="สมาชิกแบบมือถือ" class="signature-user bg-awards" style="margin-right: 4px;" href="/profile/${i.member_id}" target="_blank"><img src="https://ptcdn.info/icon/privilege/ic-pri-phone.png" alt="สมาชิกแบบมือถือ"></a>` : ''}			
								${i.bloggang && i.bloggang.id ? `<a title="${i.bloggang.id}" class="icon-memberbadge-mini icon-memberbadge-bloggang" href="${i.bloggang.link}" target="_blank"></a>` : ''}					
							</div>
							<div>
								<span class="pt-php-follow-lists-item__secondary-text">ผู้ติดตาม ${i.follower_text} คน</span>
								${(!isOwner || isFollowing) && i.follow_back ? '<span class="pt-php-btn-sm pt-php-btn-primary following-you">กำลังติดตามคุณ</span>' : ''}
							</div>
						</span>
						<div class="pt-php-follow-lists-item__meta" id="item-meta-${i.member_id}">
							${i.show_btn ? i.show_btn === 'follow' ? `<button class="pt-php-follow-btn pt-php-btn-sm pt-php-btn-primary" data-mid="${i.member_id}"><span>ติดตาม</span></button>` : '' : ''}
							${i.show_btn ? i.show_btn === 'unfollow' ? `<button class="pt-php-following-btn pt-php-btn-sm pt-php-btn-secondary" data-mid="${i.member_id}"><span>กำลังติดตาม</span></button>` : '' : ''}
							${isLoggedIn && isOwner && isFollowing ? `<i class="pantip-icons pt-ic-notification${i.notification ? '' : '-off'}-outline icon-va-8 icolor-secondary" data-mid="${i.member_id}"></i>` : '<i class="pantip-icons" style="cursor: default !important;"></i>'}
						</div>
					</div>
					${i.topic_id ? `<div class="follow-description"><a href="/topic/${i.topic_id}" title="${i.topic_title}" target="_blank">${i.topic_title}</a></div>` : ''}
				</li>`);
		}
	}

	function followSkeletonLoadShow(type, num = 10) {
		const range = [...Array(num).keys()];
		const skload = `<li class="follow-skeleton-load">
							<div class="pt-loader-combox">
								<div class="pt-loader-avatar pt-loader"></div>
								<div class="pt-loader-combox-text m-r-8">
									<div class="pt-loader-header pt-loader"></div>
									<div class="pt-loader-text pt-loader"></div>
								</div>
								<div class="pt-loader-button pt-loader"></div>
							</div>
						</li>`;
		range.forEach(() => $(`#show_lists_${type}`).append(skload));
	}

	function followSkeletonLoadShowA(num = 10) {
		const range = [...Array(num).keys()];
		const skload = `<li class="follow-skeleton-load">
							<div class="pt-loader-combox">
								<div class="pt-loader-avatar pt-loader"></div>
								<div class="pt-loader-combox-text m-r-8">
									<div class="pt-loader-header pt-loader"></div>
									<div class="pt-loader-text pt-loader"></div>
								</div>
								<div class="pt-loader-button pt-loader"></div>
							</div>
						</li>`;
		range.forEach(() => $(`#show_lists_member_suggest`).append(skload));
	}

	function followSkeletonLoadRemove() {
		$('.follow-skeleton-load').remove();
	}

	/************************************* Defaults Param ********************************/
	$.followed.defaults = {
		cls: '',
		pid: '',
		that: ''
	}
	$.tabMenuProfile.defaults = {
		following: true,
		follower: true,
		myTopic: true,
		myPoint: true,
		myComment: true,
		myBookmarks: true,
		myhistory: true,
		myBlogs: true,
		myTag: true,
		div_show: '',
		div_show_page: '',
		div_scroll_up: ''
	}




})(jQuery);