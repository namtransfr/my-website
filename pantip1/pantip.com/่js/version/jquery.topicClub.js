$(document).ready(function () {
	var url_split = window.location.pathname.split('/');
	var type_list = url_split[1];
	$.club.defaults.type = type_list;
	$.filterDisplayTagCustomize();
	$.club.waitProcess({
		url: 'forum/topic/ajax_json_all_topic_club'
	});
	$.club.begin();
	$.club.mouseHover();
	$.club.topicType();
	$.club.topicTypeHover();
	$.club.viewModeHover();
	$(document).on('mouseenter', '.post-item', function () {
		$(this).addClass('hover');
	}).on('mouseleave', '.post-item', function () {
		$(this).removeClass('hover');
	});
	$.adsSlide.slideToPage();
	$('.p45b-container').children('.detail.slid-1').addClass("active");
});
function setIframeHeightBlackBox(iframeId) {
	var ifDoc,
	ifRef = document.getElementById(iframeId);
	try {
		ifDoc = ifRef.contentWindow.document.documentElement;
	} catch (e) {
		try {
			ifDoc = ifRef.contentDocument.documentElement;
		} catch (ee) {}
	}
	if (ifDoc) {
		ifRef.height = 1;
		ifRef.height = ifDoc.scrollHeight;
	}
}
(function ($) {
	$.club = {};
	$.club.begin = function () {
		var tid = parseInt((window.location.search).replace(/[^0-9\.]+/g, ''));
		$('.e-filter-mode-view').find('.default-mode').hide();
		$('.e-filter-mode-view').find('.minimallist-mode').addClass('nav-li-first');
		$('.e-filter-mode-view').find('.thumbnail-mode').addClass('nav-li-last');
		var tag_name = parseInt($('.u-here-wrapper').data('cbid'));
		if (!tag_name) {
			tag_name = 'undefined';
		}
		$.extend($.club.defaults, {
			'div_show_topic': $('div.#show_topic_lists'),
			'div_scroll_up': $('div.anchor_scroll'),
			'tag_name': tag_name,
			'dataSend': {
				'tag': tag_name,
				'topic_type': $(document.body).data('filterTopicType')
			}
		});
		var thub_btn = $('#thumbnail-view-topic-btn');
		$.club.defaults.div_show_topic.data('thumbnailview', false);
		var param_loadmore = {
			'url': '/forum/topic/ajax_json_all_topic_club',
			'dataSend': {
				'last_id_current_page': 0,
				'dataSend': $.club.defaults.dataSend,
				'thumbnailview': $.club.defaults.div_show_topic.data('thumbnailview')
			},
			'callback': topic_ajax_success
		};
		if (!isNaN(tid) && tid != undefined) {
			param_loadmore.dataSend.last_id_current_page = tid;
		}
		$.club.defaults.div_show_topic.loadmore(param_loadmore);
		$(document).on('click', '.thumbnail-mode', function () {
			$('#show_topic_lists').removeClass('minimallist');
			$('.minimallist-mode,.default-mode').show();
			$('.thumbnail-mode').hide();
			$(this).parents('.e-filter-mode-view').removeClass('grid-appear').addClass('grid-disappear');
			$('.dropdown-filter-mode').html($(this).text() + '&nbsp;<small>▼</small>');
			$('.navigation-right.n-filter-mode-view').find('.dropdown-filter-mode').attr('class', 'dropdown-filter-mode select view-gallery');
			$(this).parents('.e-filter-mode-view').find('li.nav-li-first').removeClass('nav-li-first');
			$(this).parents('.e-filter-mode-view').find('li.nav-li-last').removeClass('nav-li-last');
			$(this).parents('.e-filter-mode-view').find('.default-mode').addClass('nav-li-first');
			$(this).parents('.e-filter-mode-view').find('.minimallist-mode').addClass('nav-li-last');
			$.club.defaults.div_show_topic.html('');
			$.club.defaults.div_show_topic.data('current_page', 1);
			$.club.defaults.div_show_topic.loadmore('destroy');
			$.club.defaults.div_show_topic.data('thumbnailview', true);
			$.club.defaults.firstload = true;
			chk_loadmore_tag();
			$.club.defaults.div_show_topic.loadmore({
				'url': '/forum/topic/ajax_json_all_topic_club',
				'dataSend': {
					'dataSend': $.club.defaults.dataSend,
					'thumbnailview': $.club.defaults.div_show_topic.data('thumbnailview')
				},
				'callback': topic_ajax_success
			});
		});
		$(document).on('click', '.minimallist-mode', function () {
			$('#show_topic_lists').addClass('minimallist');
			$('.default-mode,.thumbnail-mode').show();
			$('.minimallist-mode').hide();
			$(this).parents('.e-filter-mode-view').removeClass('grid-appear').addClass('grid-disappear');
			$('.dropdown-filter-mode').html($(this).text() + '&nbsp;<small>▼</small>');
			$('.navigation-right.n-filter-mode-view').find('.dropdown-filter-mode').attr('class', 'dropdown-filter-mode select view-topic');
			$(this).parents('.e-filter-mode-view').find('li.nav-li-first').removeClass('nav-li-first');
			$(this).parents('.e-filter-mode-view').find('li.nav-li-last').removeClass('nav-li-last');
			$(this).parents('.e-filter-mode-view').find('.default-mode').addClass('nav-li-first');
			$(this).parents('.e-filter-mode-view').find('.thumbnail-mode').addClass('nav-li-last');
			$.club.defaults.div_show_topic.html('');
			$.club.defaults.div_show_topic.data('current_page', 1);
			$.club.defaults.div_show_topic.loadmore('destroy');
			$.club.defaults.div_show_topic.data('thumbnailview', false);
			chk_loadmore_tag();
			$.club.defaults.div_show_topic.loadmore({
				'url': '/forum/topic/ajax_json_all_topic_club',
				'dataSend': {
					'dataSend': $.club.defaults.dataSend,
					'thumbnailview': $.club.defaults.div_show_topic.data('thumbnailview')
				},
				'callback': topic_ajax_success
			});
		});
		$(document).on('click', '.default-mode', function () {
			$('#show_topic_lists').removeClass('minimallist');
			$('.minimallist-mode,.thumbnail-mode').show();
			$('.default-mode').hide();
			$(this).parents('.e-filter-mode-view').removeClass('grid-appear').addClass('grid-disappear');
			$('.dropdown-filter-mode').html($(this).text() + '&nbsp;<small>▼</small>');
			$('.navigation-right.n-filter-mode-view').find('.dropdown-filter-mode').attr('class', 'dropdown-filter-mode select view-list');
			$(this).parents('.e-filter-mode-view').find('li.nav-li-first').removeClass('nav-li-first');
			$(this).parents('.e-filter-mode-view').find('li.nav-li-last').removeClass('nav-li-last');
			$(this).parents('.e-filter-mode-view').find('.minimallist-mode').addClass('nav-li-first');
			$(this).parents('.e-filter-mode-view').find('.thumbnail-mode').addClass('nav-li-last');
			$.club.defaults.div_show_topic.html('');
			$.club.defaults.div_show_topic.data('current_page', 1);
			$.club.defaults.div_show_topic.loadmore('destroy');
			$.club.defaults.div_show_topic.data('thumbnailview', false);
			chk_loadmore_tag();
			$.club.defaults.div_show_topic.loadmore({
				'url': '/forum/topic/ajax_json_all_topic_club',
				'dataSend': {
					'dataSend': $.club.defaults.dataSend,
					'thumbnailview': $.club.defaults.div_show_topic.data('thumbnailview')
				},
				'callback': topic_ajax_success
			});
		});
	}
	$.club.tagout = function () {
		topic_follow_tag();
	}
	$.club.waitProcess = function (setting) {
		var options = $.club.defaults;
		if (setting.url == options.loadingFilter) {
			$('.loadmore-bar a').ajaxStart(function () {
				$('.loadmore-bar a').html('<span class="loading-txt">กำลังโหลดข้อมูล...</span>');
			}).ajaxStop(function () {
				$('.loadmore-bar a').html('<small>&#9660;</small>&nbsp;&nbsp;ดูอีก&nbsp;&nbsp;<small>&#9660;</small>');
			});
		}
	}
	$.club.calHeight = function () {
		var side = $(".col-sidebar-inner").css('height', 'auto');
		var main = $('#index-main').css('height', 'auto');
		if (main.height() < side.height()) {
			main.height(side.height() + 45);
		} else {
			side.height(main.height() - 45);
		}
	}
	$.club.objectSet = function (partialObject) {
		$.extend($.club.defaults, partialObject);
	}
	function setJsonTopicType($obj) {
		var data = $(document.body).data('filterTopicType');
		var topicType_json = {};
		if ($obj.topicType == "default") {
			if (data.default_type != 1) {
				topicType_json['default_type'] = 1;
				topicType_json['type'] = 0;
			}
		} else {
			topicType_json['default_type'] = 0;
			topicType_json['type'] = parseInt($obj.topicType);
		}
		var before = $(document.body).data('filterTopicType');
		var after = $.extend({}, before, topicType_json);
		$(document.body).data('filterTopicType', after);
	}
	$.club.topicType = function () {
		$('.e-filter-type').find('#type_default').parent('li').hide();
		$('.e-filter-type').find('#type_3').parent('li').addClass('nav-li-first');
		$('.e-filter-type').find('#type_6').parent('li').addClass('nav-li-last');
		$('.dropdown-filter-type').addClass('select');
		$(document).on('click', '.topic_type', function () {
			var id = $(this).attr('id');
			var split_type = id.split('_');
			var type = split_type[1];
			setJsonTopicType({
				topicType: type
			});
			$(this).parents('.e-filter-type').find('li.nav-li-first').removeClass('nav-li-first');
			$(this).parents('.e-filter-type').find('li.nav-li-last').removeClass('nav-li-last');
			$(this).parents('.e-filter-type').find('li:hidden').show();
			if (type == 'default') {
				$(this).parents('.e-filter-type').find('li:first').hide();
				$(this).parents('.e-filter-type').find('li').eq(1).addClass('nav-li-first');
				$(this).parents('.e-filter-type').find('li').eq(6).addClass('nav-li-last');
			} else {
				$('#type_' + type).parent('li').hide();
				$('#type_default').parent('li').show().addClass('nav-li-first');
				if (type == 6) {
					$(this).parents('.e-filter-type').find('li').eq(5).addClass('nav-li-last');
				} else {
					$(this).parents('.e-filter-type').find('li').eq(6).addClass('nav-li-last');
				}
			}
			$(this).parents('.e-filter-type').removeClass('nav-appear').addClass('nav-disappear');
			$('.dropdown-filter-type').html($(this).text() + '&nbsp;<small>▼</small>');
			$('.n-filter-type').find('.dropdown-filter-type').attr('class', 'dropdown-filter-type select').addClass($(this).attr('class').replace('topic_type', ''));
			$.club.tagout();
		});
	};
	$.club.viewModeHover = function () {
		$('.b-block-subtabbar4.floatright').on('click', '.navigation-right.n-filter-mode-view', function () {
			$(this).find('.e-filter-mode-view').removeClass('grid-disappear').addClass('grid-appear');
		}).on('mouseleave', '.navigation-right.n-filter-mode-view', function () {
			$(this).find('.e-filter-mode-view').removeClass('grid-appear').addClass('grid-disappear');
		});
	};
	$.club.topicTypeHover = function () {
		$('.b-block-subtabbar3').on('click', '.navigation-left.n-filter-type', function () {
			$(this).find('.e-filter-type').removeClass('nav-disappear').addClass('nav-appear');
		}).on('mouseleave', '.navigation-left.n-filter-type', function () {
			$(this).find('.e-filter-type').removeClass('nav-appear').addClass('nav-disappear');
		});
	};
	$.filterDisplayTagCustomize = function () {
		var options = $.club.defaults;
		$(document.body).data('filterTags', {
			'tagIn': [],
			'tagOut': []
		});
		$(document.body).data('filterCondition', 'or');
		$(document.body).data('filterTopicType', {
			'type': 0,
			'default_type': 1
		});
		$.expr[":"].econtains = function (obj, index, meta, stack) {
			return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
		}
		$("#chk_condition").attr('checked', false);
	};
	$.club.mouseHover = function () {
		$('.tag-filter-group').on('mouseenter', '.tag-item', function () {
			$(this).addClass('hover');
		}).on('mouseleave', '.tag-item', function () {
			$(this).removeClass('hover');
		});
	};
	function topic_ajax_success(result) {
		$.headerScroll.fixed();
		if (result.topic == '') {
			$.club.defaults.div_show_topic.html($("#no-post-template").render('null'));
			$.club.defaults.firstload = false;
			$.club.calHeight();
			remove_loadmore_navi();
			return false;
		}
		if ($.club.defaults.div_show_topic.data('thumbnailview') == false) {
			var id_render = $("#post-template");
		} else {
			var id_render = $("#thumbnail-view-topic-template")
		}
		if ($.club.defaults.type == 'club') {
			if ($.club.defaults.firstload == false) {
				if ($.club.defaults.div_show_topic.data('thumbnailview') == false) {
					$.club.defaults.div_show_topic.append(id_render.render(result.topic));
					$('.p45b-container').children('.detail.slid-1').addClass("active");
				}
				if ($.club.defaults.div_show_topic.data('thumbnailview') == true) {
					$.club.defaults.div_show_topic.data('thumbnailview', true);
					$.club.defaults.div_show_topic.append('<div class="thumb-page" style="width:100%;">' + id_render.render(result.topic) + '</div><div style="clear:both"></div>');
				}
			}
			if ($.club.defaults.firstload == true) {
				if ($.club.defaults.div_show_topic.data('thumbnailview') == true) {
					$.club.defaults.div_show_topic.append('<div class="thumb-page" style="width:100%;">' + id_render.render(result.topic) + '</div><div style="clear:both"></div>');
				}
				$.club.defaults.firstload = false;
			}
		}
		$.club.calHeight();
		$('abbr.timeago').timeago();
	}
	function remove_loadmore_navi() {
		$('.loadmore-bar').remove();
	}
	function hasDuplicates(arr, msgTag) {
		var len = arr.length;
		for (var i = 0; i < len; i++) {
			if (arr[i] == msgTag) {
				return false;
			}
		}
		return true;
	}
	function update_page_variable(obj) {
		$.club.defaults.pageVariable = $.extend({}, $.club.defaults.pageVariable, obj);
	}
	function update_dataSend_variable(obj, removeNull) {
		$.club.defaults.pageVariable.dataSend = $.extend({}, $.club.defaults.pageVariable.dataSend, obj);
		if (removeNull != 'undefined') {
			$.club.defaults.pageVariable.dataSend.tags.tagOut = $.map($.club.defaults.pageVariable.dataSend.tags.tagOut, function (n) {
					return n != '' ? n : null;
				});
		}
	}
	function topic_follow_tag() {
		update_dataSend_variable({
			'tags': $(document.body).data('filterTags'),
			'condition': $(document.body).data('filterCondition'),
			'topic_type': $(document.body).data('filterTopicType')
		}, true);
		$.club.defaults.dataSend = $.extend($.club.defaults.dataSend, {
				'tags': $(document.body).data('filterTags'),
				'condition': $(document.body).data('filterCondition'),
				'topic_type': $(document.body).data('filterTopicType'),
				'room': $.club.defaults.room_name
			});
		if ($.club.defaults.div_show_topic.data('thumbnailview')) {
			$.club.defaults.div_show_topic.html('');
			$.club.defaults.div_show_topic.data('current_page', 1);
			$.club.defaults.div_show_topic.loadmore('destroy');
			$.club.defaults.div_show_topic.data('thumbnailview', true);
			chk_loadmore_tag();
			$.club.defaults.div_show_topic.loadmore({
				'url': '/forum/topic/ajax_json_all_topic_club',
				'dataSend': {
					'dataSend': $.club.defaults.dataSend,
					'thumbnailview': $.club.defaults.div_show_topic.data('thumbnailview')
				},
				'callback': topic_ajax_success
			});
		} else {
			$.club.defaults.div_show_topic.html('');
			$.club.defaults.div_show_topic.data('current_page', 1);
			$.club.defaults.div_show_topic.loadmore('destroy');
			$.club.defaults.div_show_topic.data('thumbnailview', false);
			chk_loadmore_tag();
			$.club.defaults.div_show_topic.loadmore({
				'url': '/forum/topic/ajax_json_all_topic_club',
				'dataSend': {
					'dataSend': $.club.defaults.dataSend,
					'thumbnailview': $.club.defaults.div_show_topic.data('thumbnailview')
				},
				'callback': topic_ajax_success
			});
		}
	}
	function delayLoading(callback, ms) {
		var timer = 0;
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	}
	function chk_loadmore_tag() {
		if ($('.loadmore-bar.indexlist').length <= 0) {
			var loadmore_html = $('#loadmore-topic-template').render('null');
			$.club.defaults.div_show_topic.after(loadmore_html);
		}
	}
	$.adsSlide = {};
	$.adsSlide.slideToPage = function () {
		var check_slid = false;
		$(document).on('click', 'a.counting', function (event) {
			event.stopPropagation();
			event.preventDefault();
			var oThis = $(this),
			page = parseInt(oThis.children('span').text()),
			option = $.extend({}, $.adsSlide.defaults);
			var position_ads = oThis.data('posads');
			if (option.position_page != position_ads+'-'+page && check_slid == false)
			{
				option = $.extend({}, $.adsSlide.defaults, {position_page: position_ads+'-'+page});
				check_slid = true;
				silde(option, position_ads, page);
			}
			check_slid = false;
		});
	}
	function TimeToSlide() {
		var option = $.extend({}, $.adsSlide.defaults);
		option.nowPage += 1;
		if (option.nowPage > option.maxPage) {
			option.nowPage = 1;
		}
		$.adsSlide.defaults.nowPage = option.nowPage;
		silde(option);
	}
	function silde(option, position_ads, page) {
		$('.frmroom').attr('src', '');
		var check_slid = false;
		if (check_slid == false) {
			$.each($('.p45b-counting-container').children('a.counting.'+position_ads), function (index, item) {
				if ($(this).children('span').text() == page.toString()) {
					$(this).addClass('selected');
				} else {
					$(this).removeClass('selected');
				}
			});
			check_slid = true;
		}
		if (check_slid == true) {
			$('.slidep45b.'+position_ads).removeClass('active');
			$('.p45b-container').children('.detail.slid-' + page + '.slidep45b.'+position_ads).addClass('active');
			var adsText = $('.p45b-container').children('.detail.slid-' + page + '.slidep45b').data('frmroom');
			if (adsText != '') {
				$('.frmroom').attr('src', adsText);
			}
			check_slid = false;
			$.adsSlide.defaults.position_page = position_ads+'-'+page;
		}
	}
	$.adsSlide.defaults = {
		nowPage: 1,
		maxPage: 10,
		position_page: 'position2-1'
	}
	$.club.defaults = {
		dataSend: {},
		loadingFilter: 'forum/topic/ajax_json_all_topic_club',
		firstload: true,
		pageVariable: {
			cur_page: '',
			el_page_number: '',
			chk_same_page: '',
			el_keep_data: '',
			prev_btn: '',
			next_btn: '',
			page_data: '',
			dataSend: {},
			div_show_topic: '',
			div_scroll_up: ''
		}
	};
})(jQuery);
