$(document).ready(function(){
	$.tagRoom.moreTagCaption();
	$.tagRoom.tagCaption();
	$.tagRoom.removeTag();
	$.tagRoom.closeLightbox();
});

(function($){
	$.suggest = {};
	$.suggest.init = function(){
		$( ".post-tag-search" ).on('keyup',function(){
			}).autocomplete({
			source: function(req, add) {
				req.term = $.trim(req.term);
				if(req.term.length == 0)
				{
					$('#div-add-tag-form').remove();
					$('.custom-multiselect').html('').show();
					create_room();
					return false;
				}
				else if(req.term.length <= 30)
				{
					req.term = $.trim(req.term);
					$.post("/suggest_word/get_suggest_tag", req, function(data){
						if(data)
						{
							$('.custom-multiselect').html('')
							var result = $.suggest.check_selected_result(data.result);
							$.suggest.add_tag_result_template(result);
						}
						else
						{
							$.suggest.add_tag_result_template(null);
						}
					},'json');
				}
				else
				{
					$.suggest.add_tag_result_template(null);
				}
			},
			minLength: 0,
			select: function( event, ui ) {
			},
			change: function(event, ui) {
			},
			close: function(event, ui) {
				if(!$.suggest.check_tag_search())
				{
					create_room();
				}
			}
		});
	}
	$.suggest.add_tag_result_template = function(data)
	{
		$.templates("result", {
			markup: "#result-template",
			allowCode: true
		});
		$("#room-ctn").html($.render.result(data));
	}
	$.suggest.check_tag_search = function()
	{
		if($('.post-tag-search').val())
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	$.suggest.check_tag_universe = function(tag)
	{
		var options = $.suggest.defaullts;
		var universe = options.universe;
		if(universe.length)
		{
			var temp = $.grep(universe, function(n, i){
				var regexp = new RegExp('^s*');
				return regexp.exec(tag);
			});
			return temp;
		}
		else
		{
			return false;
		}
	}
	$.suggest.check_selected_result = function(result)
	{
		var gen_result =[];
		var temp = {};
		for(var i=0; i < result.length; i++)
		{
			if(check_tag(result[i].name))
			{
				temp = $.extend(result[i], {
					selected: true
				});
			}
			else
			{
				temp = $.extend(result[i], {
					selected: false
				});
			}
			gen_result.push(temp);
		}
		return gen_result;
	}
	$.suggest.warn_tag = function()
	{
		var data	=	{
			'word' : $('.post-tag-search').val(),
			'type' : 'exceed'
		};
		$('.custom-multiselect').hide();
		$('<div id="div-add-tag-form" class="add-tag-form"></div>').insertBefore('.custom-multiselect-first');
		$('#div-add-tag-form').html(
			$('#add-tag-template').render(data)
			);
		$('#cancel-tag-button').on('click', function(){
			$('#div-add-tag-form').hide();
			$('.post-tag-search').val("");
			$('.custom-multiselect').show();
			create_room();
		});
	}
	$.tagRoom = {};
	$.tagRoom.objectSet = function(partialObject)
	{
		$.extend($.tagRoom.defaults, partialObject);
	}
	$.tagRoom.tagRoomDefault	=	function()
	{
		$('body').data('tags',[]);
		$('body').data('new_tags',[]);
		$('body').data('stage',[]);
		$('body').data('select',[]);
		$.tagRoom.genesis();
		$.suggest.init();
		$('div:last').after('<div id="system-notify"></div>');
	};
	$.tagRoom.moreTagCaption = function(){
		$(document).on('click',".moretag-caption, .room-tag", function(){
			var options = $.tagRoom.defaults;
			$(this).parents(".custom-multiselect").find(".multiselect-item").removeClass("selected");
			$(this).parents(".multiselect-item").addClass("selected");
			var index = $(this).parents(".custom-multiselect").attr("index");
			var parent = spilt_id($(this).parents(".tag-caption-wrapper").attr("id"), index);
			var room_id = $('body').data('room_id');
			var txt = $(this).prev(".tag-caption").children("span").text();
			if(!txt)
			{
				txt = $(this).children("span").text();
			}
			clear_ctn(index);
			var find_tags = find_that_tags(room_id, index, parent);
			$.each(find_tags, function(index, item) {
				if(item.tag_id == options.default_tag)
				{
					item.selected = 'default_tag';
				}
			});
			render_tags(find_tags, index);
		});
	};
	$.tagRoom.tagCaption = function (){
		$(document).on('click',".tag-caption:not(.room-tag , [disabled=disabled])",function(){
			var checked = $(this).parents(".multiselect-item");
			var index = $(this).parents(".custom-multiselect").attr("index");
			var txt = $(this).children("span").text();
			var selected_id = new Array();
			var i =0;
			$('span').filter(function(index) {
				if($(this).text() == txt)
				{
					selected_id[i] = $(this).parents('div.tag-caption-wrapper').attr('id');
					i++;
				}
			});
			if(checked.hasClass("checked"))
			{
				remove_tag(txt);
				checked.removeClass("checked");
			}
			else
			{
				add_tag(txt, selected_id, checked);
			}
		});
		// pick menion suggest
		var ajaxSent = false;
		$(document).on('click','.wrap-tag-suggest-frontend > .tag-title',function(event){
			event.stopPropagation();
			event.preventDefault();
			var oSuggestTag = $(this),
				tagName = replace_underline(oSuggestTag.data('tag-name')), //oSuggestTag.data('tag-name')
				tagDetail = '',
				tagId = '',
				tagIdBySearch = '';
			if( oSuggestTag.hasClass('tag-title-selected')) // กดอีกครั้งคือลบtag
			{
				remove_tag(tagName);
				oSuggestTag.removeClass('tag-title-selected');
				if(tagName === $('.post-tag-search').val())
				{
					$('.post-tag-search').val('');
					create_room();
				}
			}
			else
			{
				if( tagName != '' && ajaxSent == false)
				{
					var req = {	term : tagName };
					ajaxSent = true;
					$.post("/suggest_word/get_suggest_tag", req, function(data){
						if(data.result.length > 0)
						{
							$('.post-tag-search').val(tagName);
							tagIdBySearch = data.result[0].id;
							$('.custom-multiselect').html('');
							var result = $.suggest.check_selected_result(data.result);
							$.suggest.add_tag_result_template(result);
							tagId = find_tag_id(tagName);
							if($.inArray(tagIdBySearch, tagId) == -1)
							{
								tagId.push('tag-'+tagIdBySearch);
							}
							add_tag(tagName , tagId , $('#tag-'+tagId));
						}
						else
						{
							$('.custom-multiselect').html('');
						}
						if( $('.post-tag-search').val() == tagName && $('div.multiselect-item[id=tag-'+tagIdBySearch+']').hasClass("checked"))
						{
							if( $('ul#post-tag > li > span[id=tag-'+tagIdBySearch+']').length == 0 )
							{
								var selected_tag = $('body').data('tags');
								if($.inArray(tagName, selected_tag) < 0)
								{
									add_selected(tagName , tagIdBySearch);
								}
							}
						}
						ajaxSent = false;
					},'json');
					$('.post-tag-search').data().autocomplete.term = null; // reset autocomplete
				}
			}
		});
	};
	$.tagRoom.removeTag = function (){
		$(document).on('click',".remove-tag", function(){
			var tag = $(this).parents("li").attr("id");
			var tag_id = $(this).parents("li").children("span").attr("id");
			remove_tag(tag, tag_id);
		});
	};
	$.tagRoom.closeLightbox = function (){
		$(document).on('click','.close_lightbox',function(){
			$('#system-notify').dialog( "destroy" );
		});
	};
	$.tagRoom.genesis = function()
	{
		var options = $.tagRoom.defaults;
		var arrTag = '';
		if($(document.body).data('tag-data') != null)
		{
			arrTag = $(document.body).data('tag-data').tags;
		}
		if($(document.body).data('cancel_tag_btn') == null)
		{
			 $(document.body).data('cancel_tag_btn', false);
		}
		if($('#type_topic').val() != '' )
		{
			$.ajax({
				type : 'POST',
				url: "/forum/new_topic/get_rooms_tags",
				cache: false,
				dataType: 'json',
				success: function(data){
					var rooms = jsonToArray(data.rooms);
					thaiSort(rooms, 'room_name');
					options.rooms = rooms;
					options.tags = data.tags;
					$.templates("rooms", {
						markup: "#room-template",
						allowCode: true
					});
					$( "#room-ctn" ).html($.render.rooms( options.rooms ));
					if(arrTag.length > 0)
					{
						rander_tag_data(arrTag);
					}
				}
			});
		}
		if( $('body').data('tags').length == 0 )
		{
			$('#post-tag-ctn').next('.filter-header,.step-caption').hide();
		}
	}
	function thaiSort(arr, key)
	{
		if( typeof key !== 'undefined' )
		{
			return arr.sort(function(a, b) //This will sort your THAI array [By Natee3G]
			{
				var i = 0;
				var j = 0;
				var l = 0;
				var m = 0;
				var aSum = 0;
				var bSum = 0;
				var aSom = 0;
				var bSom = 0;
				if( key !== '' ){
					a = a[key].toString();
					b = b[key].toString();
				}
				while( l == m )
				{
					/* Start a calc */
					while ( a.charCodeAt(i) >= 3648 && a.charCodeAt(i) <= 3652 ) /* 3648-3652 ไม้หน้า */
					{
						aSum += a.charCodeAt(i);
						i++;
					}

					while ( a.charCodeAt(i) >= 3655 && a.charCodeAt(i) <= 3659 ) /* 3656-3659 วรรณยุกต์ */
					{
						aSom += a.charCodeAt(i)/Math.pow(2,i);
						i++;
					}

					if ( ! ( a.charCodeAt(i) >= 3655 && a.charCodeAt(i) <= 3659 ) ) /* ! วรรณยุกต์ */
					{
						l = a.charCodeAt(i);
					}

					if( isNaN(l) )
					{
						l = 0;
					}
					/* End a calc */
					/************************************/
					/* Start b calc */
					while ( b.charCodeAt(j) >= 3648 && b.charCodeAt(j) <= 3652 ) /* 3648-3652 ไม้หน้า */
					{
						bSum += b.charCodeAt(j);
						j++;
					}

					while ( b.charCodeAt(j) >= 3655 && b.charCodeAt(j) <= 3659 ) /* 3656-3659 วรรณยุกต์ */
					{
						bSom += b.charCodeAt(j)/Math.pow(2,j);
						j++;
					}

					if ( ! ( b.charCodeAt(j) >= 3655 && b.charCodeAt(j) <= 3659 ) ) /* ! วรรณยุกต์ */
					{
						m = b.charCodeAt(j);
					}

					if( isNaN(m) )
					{
						m = 0;
					}
					/* End b calc */
					/************************************/
					/* Start sorting */
					if( l < m ) {
						return -1;
					}
					if( l > m ) {
						return 1;
					}
					if( l == m )
					{
						l += aSum;
						m += bSum;
						if( l < m ) {
							return -1;
						}
						if( l > m ) {
							return 1;
						}
						if( l == m )
						{
							var aLim = a.length;
							var bLim = b.length;

							if( j == bLim && i == aLim )
							{
								l += aSom;
								m += bSom;
							}
							if( l < m ) {
								return -1;
							}
							if( l > m ) {
								return 1;
							}
							if( i == aLim && ( j == bLim )&&(i==j) )
							{
								return 0;
							}
							if(l==m)
							{
								i++;
								j++;
							}
						}
					} // if l == m
				/* end sorting */
				} // while l == m
			}); // function Thai Sort
		}
		else
		{
			return arr;
		}
	}

	function jsonToArray(json)
	{
		var json_key,arr_key = [];
		var arr = [];
		for (json_key in json) {
			if (json.hasOwnProperty(json_key)) {
				arr_key.push(json_key);
			}
		}
		arr_key.sort();
		for (json_key = 0; json_key < arr_key.length; json_key++) {
			arr[arr_key[json_key]] = json[arr_key[json_key]];
		}
		return arr;
	}
	function create_room()
	{
		var options = $.tagRoom.defaults;
		var rooms = options.rooms;
		$('.custom-multiselect').html('');
		$.templates("rooms", {
			markup: "#room-template",
			allowCode: true
		});
		var room_sort = jsonToArray(options.rooms);
		thaiSort(room_sort, 'room_name');
		$( "#room-ctn" ).html($.render.rooms( room_sort ));
	}
	function spilt_id(str, index)
	{
		if(index == 0)
		{
			var room_id = str.substr(5);
			$('body').data('room_id', room_id);
			return room_id;
		}
		else
		{
			return str.substr(4);
		}
	}
	function find_that_tags(id ,index, parent)
	{
		var options = $.tagRoom.defaults;
		var tags = options.tags;
		var find_tags =[];
		var temp = {};
		if(index == 0)
		{
			for(var i=0; i < tags.length; i++)
			{
				if((tags[i].room_id == id) && (tags[i].parent == ""))
				{
					temp = {};
					if(check_tag(tags[i].tag_name))
					{
						temp = {
							selected: true
						};
					}
					else
					{
						temp ={
							selected: false
						};
					}
					if(check_more(tags[i].tag_id))
					{
						temp = $.extend(temp, {
							more:true
						});
						temp = $.extend(tags[i], temp);
						find_tags.push(temp);
					}
					else
					{
						temp = $.extend(tags[i], temp);
						find_tags.push(temp);
					}
				}
			}
		}
		else if(index == 1)
		{
			for(var i=0; i < tags.length; i++)
			{
				if((tags[i].room_id == id) && (tags[i].parent == parent))
				{
					temp = {};
					if(check_tag(tags[i].tag_name))
					{
						temp = {
							selected: true
						};
					}
					else
					{
						temp ={
							selected: false
						};
					}
					if(check_more(tags[i].tag_id))
					{
						temp = $.extend(temp, {
							more:true
						});
						temp = $.extend(tags[i], temp);
						find_tags.push(temp);
					}
					else
					{
						temp = $.extend(tags[i], temp);
						find_tags.push(temp);
					}
				}
			}
		}
		else if(index == 2)
		{
			for(var i=0; i < tags.length; i++)
			{

				if((tags[i].room_id == id) && (tags[i].parent == parent))
				{
					temp = {};
					if(check_tag(tags[i].tag_name))
					{
						temp = $.extend(tags[i], {
							selected: true
						});
						find_tags.push(temp);
					}
					else
					{
						temp = $.extend(tags[i], {
							selected: false
						});
						find_tags.push(temp);
					}
				}
			}
		}
		else
		{
			return false;
		}
		return find_tags;
	}
	function render_tags(find_tags, index)
	{
		if(index == 0)
		{
			$.templates("tags", {
				markup: "#tag-template",
				allowCode: true
			});
			$( "#tag-ctn-1" ).html($.render.tags( find_tags ));
		}
		else if(index == 1)
		{
			$.templates("tags", {
				markup: "#tag-template",
				allowCode: true
			});
			$( "#tag-ctn-2" ).html($.render.tags( find_tags ));
		}
		else if(index == 2)
		{
			$.templates("tags", {
				markup: "#tag-template",
				allowCode: true
			});
			$( "#tag-ctn-3" ).html($.render.tags( find_tags ));
		}
		else
		{
			return false;
		}
	}
	function check_more(tag_id)
	{
		var options = $.tagRoom.defaults;
		var tags = options.tags;
		var bool = false;
		for(var i=0; i < tags.length; i++)
		{
			if((tags[i].parent == tag_id))
			{
				bool = true;
				break;
			}
		}
		return bool;
	}

	function check_tag(tag)
	{
		var tags = $('body').data('tags');
		if($.inArray(tag, tags)!= -1)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	function clear_ctn(index)
	{
		if(index == 0)
		{
			$('#tag-ctn-1').empty();
			$('#tag-ctn-2').empty();
			$('#tag-ctn-3').empty();
		}
		else if(index == 1)
		{
			$('#tag-ctn-2').empty();
			$('#tag-ctn-3').empty();
		}
		else if(index == 2)
		{
			$('#tag-ctn-3').empty();
		}
		else if(index == 3)
		{
			return false;
		}
	}
	function add_tag(tag, selected_id, checked, index)
	{
		if($('#edit-topic-form-no-tag').length > 0) $('#edit-topic-form-no-tag').remove();
		var selected_tag = $('body').data('tags');
		if(selected_tag.length < 5)
		{
			if( $('.tag-suggest > .wrap-tag-suggest-frontend > .tag-title').length  > 0 )
			{
				if( $(".tag-suggest").offset().top )
				{
					$('html, body').clearQueue().animate({
				        scrollTop: $(".tag-suggest").offset().top - 100
				    }, 200);
				}
			}
			if($.inArray(tag, selected_tag) < 0)
			{
				selected_tag.push(tag);
				$('body').data('tags', selected_tag);
				add_selected(tag , selected_id);
			}
			for (x in selected_id)
			{
				$('div.multiselect-item[id='+selected_id[x]+']').addClass("checked");
			}
			if( $('.custom-multiselect').is(':visible') && selected_id.length != 0 ) // ให้เช็คได้เมื่อ custom-multiselect ยังแสดงอยู่
			{
				$('.custom-multiselect > .multiselect-item').filter(function() {
					var tagTxt = $(this).find('a > .tag-caption-wrapper > .tag-caption > span').text();
					return tagTxt == tag;
				}).addClass('checked');
			}
			add_suggest_select(tag); //add Class selected to suggest menion
			return true;
		}
		else
		{
			selected_id = $.grep(selected_id, function(value) {
				return value != undefined;
			});
			if($.inArray(tag, selected_tag) >= 0 && selected_tag.length <= 5 && $('ul#post-tag > li > span[id='+selected_id+']').length)
			{
				return false;
			}
			else
			{
				if( $('#system-notify').length  < 1)
				{
					$('div:last').after('<div id="system-notify"></div>');
				}
				var $dialog = $('#system-notify')
				.html('<p>คุณสามารถเลือกแท็กได้ไม่เกิน 5 แท็ก</p><div class="button-container"><a href="javascript:void(0);" class="button normal-butt close_lightbox"><span><em>ปิดหน้าต่างนี้</em></span></a></div>')
				.dialog({
					width: 420,
					title: 'แจ้งเตือน',
					modal: true,
					resizable: false,
					draggable: false
				});
				$dialog.dialog('open');
				return false;
			}
		}
	}
	function add_suggest_select(tag_name)
	{
		var suggest_obj = $('a[data-tag-name="'+replace_space(tag_name)+'"]');
		if( !suggest_obj.hasClass('tag-title-selected') )
		{
			suggest_obj.addClass('tag-title-selected');
		}
	}
	function remove_suggest_select(tag_name)
	{
		var suggest_obj = $('a[data-tag-name="'+replace_space(tag_name)+'"]');
		if( suggest_obj.hasClass('tag-title-selected') )
		{
			suggest_obj.removeClass('tag-title-selected');
		}
	}
	function add_new_tag(tag)
	{
		var options = $.tagRoom.defaults;
		tag = $.trim(tag);
		var selected_tag = $('body').data('tags');
		var new_tag = $('body').data('new_tags');
		if(selected_tag.length < 5)
		{
			if(($.inArray(tag, new_tag) == -1) && ($.inArray(tag, selected_tag) == -1))
			{
				var id = replace_space(tag);
				var temp = {
					id: id,
					tag_name: tag,
					url : ""
				};
				$.templates("selectednewtags", {
					markup: "#new-select-template",
					allowCode: true
				});
				$($.render.selectednewtags(temp)).fadeIn().appendTo('#post-tag');
				new_tag.push(tag);
				selected_tag.push(tag);
				$('body').data('new_tags', new_tag);
				$('body').data('tags', selected_tag);
				$('#post-tag-ctn').show();
				$('.post-tag-search').val("");
				$('#div-add-tag-form').hide();
				$('.custom-multiselect').show();
				create_room();
				return true;
			}
			return false;
		}
		else
		{
			if( $('#system-notify').length  < 1)
			{
				$('div:last').after('<div id="system-notify"></div>');
			}
			var $dialog = $('#system-notify')
			.html('<p>คุณสามารถเลือกแท็กได้ไม่เกิน 5 แท็ก</p><div class="button-container"><a href="javascript:void(0);" class="button normal-butt close_lightbox"><span><em>ปิดหน้าต่างนี้</em></span></a></div>')
			.dialog({
				width: 420,
				title: 'แจ้งเตือน',
				modal: true,
				resizable: false,
				draggable: false
			});
			$dialog.dialog('open');
		}
		return false;
	}
	function remove_tag(tag, tag_id)
	{
		if( $('.tag-suggest > .wrap-tag-suggest-frontend > .tag-title').length > 0 )
		{
			if( $(".tag-suggest").offset().top )
			{
				$('html, body').clearQueue().animate({
			        scrollTop: $(".tag-suggest").offset().top - 100
			    }, 200);
			}
		}
		if(tag_id != 'undefined')
		{
			tag = replace_underline(tag);
		}
		remove_suggest_select(tag); // remove selected menion
		var find = find_tag_id(tag);
		var format = new RegExp(/^tag[-|_]/g);
		if( typeof tag_id != 'undefined' || format.test(tag_id) ){
			var iTagID = prepareIDtoInt(tag_id);
			if($.inArray(iTagID, find) == -1)
			{
				find.push(iTagID);
			}
		}
		else
		{
			$.each($('div.multiselect-item'),function(index,item){
				var thisItem = $(item).children('a').children('.tag-caption-wrapper');
				var tagName = $.trim(thisItem.text());
				if( tagName === tag )
				{
					$(item).removeClass('checked');
				}
			});
		}
		if(find.length)
		{
			for(var i=0; i<find.length ;i++)
			{
				$(".multiselect-item#tag-"+find[i]).removeClass("checked");
			}
		}
		else
		{
			$(".multiselect-item#"+tag_id).removeClass("checked");
			$.each($('div.multiselect-item'),function(index,item){
				var thisItem = $(item).children('a').children('.tag-caption-wrapper');
				var tagName = $.trim(thisItem.text());
				if( tagName === tag )
				{
					$(item).removeClass('checked');
				}
			});
		}
		var tag_list = replace_space(tag);
		tag_list = replace_special(tag_list);
		$("#post-tag").children("li#"+tag_list).hide(100,function() {
			$(this).remove();
			var selected_tag = $('body').data('tags');
			if($.inArray(tag, selected_tag) != -1)
			{
				selected_tag.splice( $.inArray(tag, selected_tag), 1 );
				$('body').data('tags', selected_tag);
			}
			var new_tag = $('body').data('new_tags');
			if($.inArray(tag, new_tag) != -1)
			{
				new_tag.splice( $.inArray(tag, selected_tag), 1 );
				$('body').data('new_tags', new_tag);
			}
			if($('body').data('tags').length == 0)
			{
				$("#post-tag-ctn").hide();
				$('#post-tag-ctn').next('.filter-header,.step-caption').hide();
			}
			else
			{
				$("#post-tag-ctn").show();
				$('#post-tag-ctn').next('.filter-header,.step-caption').show();
			}
		});

		return false;
	}
	function add_selected(tag_name, selected_id)
	{
		var options = $.tagRoom.defaults;
		var id = replace_space(tag_name);
		$('#post-tag-ctn').show();
		$('#post-tag-ctn').next('.filter-header,.step-caption').show();
		var hostname = window.location.hostname;
		var protocol = window.location.protocol;
		var url = protocol+'//'+hostname+'/tag/'+id;
		var ancestors = inw(tag_name, selected_id);
		var tag_id = selected_id;
		var temp = {};
		if(ancestors.length)
		{
			temp = [{
				id: id,
				ancestor: ancestors,
				tag_id: tag_id,
				tag_name: tag_name,
				url: url,
				club: options.club,
				'cancel_tag_btn' : $('body').data('cancel_tag_btn') // tong edit
			}];
		}
		else
		{
			temp = [{
				id: id,
				tag_id: tag_id,
				tag_name: tag_name,
				url: url,
				club: options.club,
				'cancel_tag_btn' : $('body').data('cancel_tag_btn') // tong edit
			}];
		}
		$.templates("selectedtags", {
			markup: "#select-template",
			allowCode: true
		});
		//$($.render.selectedtags(temp)).fadeIn().appendTo('#post-tag');
		$('#post-tag').append($.render.selectedtags(temp)).show('fast');
		return true;
	}
	function prepareIDtoInt(str)
	{
		$.trim(str);
		return parseInt(str.replace(/^tag[-|_]/g, ''));
	}
	function replace_space(str)
	{
		$.trim(str);
		return str.replace(/\s+/g, '_');
	}
	function replace_underline(str)
	{
		$.trim(str);
		return str.replace(/_/g, ' ');
	}
	function inw(tag, tag_id)
	{
		var options = $.tagRoom.defaults;
		var tags = options.tags;
		var temp =[];
		for(var i=0; i < tags.length; i++)
		{
			if(tags[i].tag_name == tag)
			{
				var room_id = tags[i].room_id;
				var parent = tags[i].parent;
				if (parent != "")
				{
					temp.push({
						stack:find_parent(parent,[]),
						tag_id:tag_id,
						tag_name:tag
					});
				}
				else
				{
					temp.push({
						stack:{
							level_name:find_room(room_id)
						},
						tag_id:tag_id,
						tag_name:tag
					});
				}
			}
		}
		return temp;
	}
	function find_room(room_id)
	{
		var options = $.tagRoom.defaults;
		var rooms = options.rooms;
		var room ="";
		for(var i=0; i < rooms.length; i++)
		{
			if(rooms[i].room_id == room_id)
			{
				room = rooms[i].room_name;
			}
		}
		return room;
	}
	function find_parent(parent, arr)
	{
		var options = $.tagRoom.defaults;
		var tags = options.tags;
		var temp = arr;
		for(var i=0; i < tags.length; i++)
		{
			if(tags[i].tag_id == parent)
			{
				if(tags[i].parent == "")
				{
					temp.push({
						level_name:tags[i].tag_name,
						level_id:tags[i].tag_id
					});
					temp.push({
						level_name:find_room(tags[i].room_id),
						level_id:tags[i].tag_id
					});
					temp.reverse();
				}
				else
				{
					temp.push({
						level_name:tags[i].tag_name,
						level_id:tags[i].tag_id
					});
					find_parent(tags[i].parent, temp);
				}
				break;
			}
		}
		return temp;
	}
	function find_tag_id(tag)
	{
		var options = $.tagRoom.defaults;
		var tags = options.tags;
		tag = replace_underline(tag);
		var temp =[];
		for(var i=0; i<tags.length ;i++)
		{
			if(tags[i].tag_name == tag)
			{
				temp.push(tags[i].tag_id);
			}
		}
		return temp;
	}
	$.tagRoom.add_current_tags = function(tags,without_cancel_btn,topic_status)
	{
		(!without_cancel_btn)?without_cancel_btn=false:without_cancel_btn;
		(!topic_status)?topic_status = false:topic_status;
			$('body').data('tags', tags);
			$('body').data('cancel_tag_btn', without_cancel_btn);
			if(tags.length > 0)
			{
				$.each(tags, function(key ,value){
					add_selected(value);
				});
			}
			else
			{
				$('#post-tag-ctn').show();
				var temp = {no_tag: true};
				$.templates("selectedtags", {
					markup: "#select-template",
					allowCode: true
				});
				$($.render.selectedtags(temp)).fadeIn().appendTo('#post-tag');
			}
	}
	function find_detail_tag(tag)
	{
		var options = $.tagRoom.defaults;
		var tags = options.tags;
		tag = replace_underline(tag);
		var temp =[];
		for(var i=0; i<tags.length ;i++)
		{
			if(tags[i].tag_name == tag)
			{
				temp.push({
					tag_id:tags[i].tag_id,
					tag_name:tags[i].tag_name,
					room_id:tags[i].room_id,
					parent:tags[i].parent
				});
			}
			else
			{
				temp.push({
					tag_id:tags[i].tag_id,
					tag_name:tags[i].tag_name
				});
			}
		}
		return temp;
	}
	function rander_default_tag()
	{
		$('body').data('tags',[]);
		$('body').data('room_id',[]);
		$('#post-tag').empty();
		var options = $.tagRoom.defaults;
		options.club = true;
		var tag = $('#default_tag').val();
		var detail = find_detail_tag(tag);
		var tag_id = detail[0].tag_id;
		var room_id = detail[0].room_id;
		var parent_id = detail[0].parent;
		$('body').data('room_id', room_id);
		options.default_tag = tag_id;
		add_tag(tag, tag_id, $('#tag-'+tag_id), parent_id);
		var tags_parent = find_parent(parent_id, [tag]);
		for(var i=0; i<tags_parent.length; i++){
			if(typeof(tags_parent) === 'object')
			{
				var find_tags = find_that_tags(room_id, i, tags_parent[i].level_id);
				$.each(find_tags, function(index, item) {
					if(item.tag_id == tag_id)
					{
						item.selected = 'default_tag';
					}
				});
				render_tags(find_tags, i);
			}
		}
		options.club = false;
	}
	function replace_special(str)
	{
		$.trim(str);
		return str.replace( /({|}|\[|\]|,|;|:|'|"|\(|\)|&|\+|\.|~|=|#|\<|\>|!|\/|\*|\?|%|@)/g, '\\$1');
	}
	function rander_tag_data(arr)
	{
		$('body').data('tags',[]);
		$('body').data('room_id',[]);
		$('#post-tag').empty();
		var options = $.tagRoom.defaults;
		var arrTag = arr;
		var detail = '';
		$.each(arrTag, function(index, item) {
			options.club = false;
			detail = find_detail_tag(item);
			var tag_id = 0;
			var room_id = 0;
			var parent_id = 0;
			if(detail[0] != null)
			{
				tag_id = detail[0].tag_id;
				room_id = detail[0].room_id;
				parent_id = detail[0].parent;
			}
			$('body').data('room_id', room_id);
			options.tag_data = tag_id;
			add_tag(item, tag_id, $('#tag-'+tag_id), parent_id);
			var tags_parent = find_parent(parent_id, [item]);
		});
	}
	$.tagRoom.defaults = {
		dataSend: {},
		rooms: {},
		tags: {},
		default_tag: null,
		club: false
	};
	$.suggest.defaullts = {
		universe: {}
	};
})(jQuery);