(function($) {
	$.pagination = function(element, options) {
		var defaults = {
			group : 2,
			max : 1,
			url : '',
			firstText : 'หน้าแรก',
			lastText : 'หน้าสุดท้าย',
			prevText : '<< ก่อนหน้า',
			nextText : 'ถัดไป >>',
			divDefaults : '',
			template : '',
			jsrender : false,
			request_type  : 'GET',
			typeRender : 'topic', // ถ้าเป็น table อาจจะต้องเป็นพวก append 
			divShowList : '', // หากว่าต้องการให้โชว์ที่อื่นก็สามารถส่ง id div นั้นๆมาได้
			callbackAfterRender : '', // หากเป็นพวก table เราอาจจะต้องการเรียก ฟังก์ชั่นสำหรับลบแถวหรือทำอย่างอื่นด้วย
			callbackBeforeRender : '', // หากเป็นพวก table เราอาจจะต้องการเรียก ฟังก์ชั่นสำหรับลบแถวหรือทำอย่างอื่นด้วย
			searchData : {} ,
			offEvent : false, // สำหรับลบ event จากปุ่มเลขหน้าเพราะหากมีการเรียกใช้อีกครั้งในหน้าจะเป็น event ซ้ำซ้อนต้องลบออกก่อน
			cal_new_max : false,
			show_timeago : true
		}
		
		var plugin = this;
		
		plugin.settings = {}
		
		var $element = $(element);
		var init = function(update) {
			if (!update) plugin.settings = $.extend({}, defaults, options);
			if (options.offEvent == true)
			{
				offEventButton();
			}
			manage_page();
			link_page();
		}
	
		var offEventButton = function(){
			$element;
		}
	
		var sendRequest = function(){		
			
			var pageId = $(this).attr('id');
			var page = pageId.split('page_')[1]; 
			
			var first_id = '';
			var last_id = '';
			
			var last_page = '';
			var first_pin = '';
			var last_pin = '';
			
			if($('#first_id_pageing').length > 0)
			{
				first_id = $('#first_id_pageing').val();
			}
			
			if($('#last_id_pageing').length > 0)
			{
				last_id = $('#last_id_pageing').val();
			}

			if($('#last_page_pageing').length > 0)
			{
				last_page = $('#last_page_pageing').val();
			}
			
			if($('#first_pin_pageing').length > 0)
			{
				first_pin = $('#first_pin_pageing').val();
			}
			if($('#last_pin_pageing').length > 0)
			{
				last_pin = $('#last_pin_pageing').val();
			}
			
			//console.log(options.url+'&p='+page+'&last='+last);
			var unix = (new Date().getTime())+(Math.ceil(Math.random()*100));
			$.ajax({
				url : options.url+'&p='+page+'&ltpage='+last_page+'&ftid='+first_id+'&ltid='+last_id+'&ftpin='+first_pin+'&ltpin='+last_pin+'&t='+unix, 
				type: options.request_type,
				dataType : 'JSON' , 
				data : plugin.settings.searchData,
				cache: false,
				success : function(res)
				{ 
					$('#last_id_pageing').val(res.last_id);
					$('#last_page_pageing').val(res.page);
					$('#first_id_pageing').val(res.first_id);
					$('#last_pin_pageing').val(res.last_pin);
					$('#first_pin_pageing').val(res.first_pin);
//					console.log($.data(document.body).current_my_page);
//					$(document.body).data('current_my_page',
//					{
//						'n':res.page
//					});
					
					if(options.cal_new_max == true)
					{
						plugin.settings.max = res.max_page;
					}
					
					
					if(plugin.settings.jsrender == true)
					{
						if(plugin.settings.typeRender == 'topic')
						{ 
							options.divDefaults.div_show_topic.html(
								options.template.render( res.result )
								);
						}
						else if(plugin.settings.typeRender == 'pm')
						{ 
							options.divDefaults.div_show_topic.html(
								options.template.render( res.item.msg )
								);
						}
						else
						{
							// ทำไว้สำหรับการใช้กับพวก table 
							if(typeof(plugin.settings.callbackBeforeRender) == 'function')
							{	
								plugin.settings.callbackBeforeRender();
							}
							plugin.settings.divShowList.append(
								options.template.render( res.result )
								);
							if(typeof(plugin.settings.callbackAfterRender) == 'function')
							{
								plugin.settings.callbackAfterRender();
							}
						}
					}
					else
					{
						plugin.settings.template.html(res.list)
					}
						
					manage_page(page);
					
					if(options.divDefaults.div_scroll_up != '' )
					{
						var targetOffset = $(options.divDefaults.div_scroll_up).offset().top-40;
						$('html,body').animate({
							scrollTop: targetOffset
						}, 700);
					}
					
					if(options.show_timeago == false)
					{
						plugin.settings.show_timeago = false
					}
					else
					{
						$('abbr.timeago').timeago();
					}
					
				}
			});
				
		}
		var link_page = function() {
			$element.off('click').on('click', '.numbers', sendRequest);
		}
		
		var manage_page = function(page) {
			var text = '';
			var start = 0;
			var end = 0;
			var num = 0;
			var change_view = Math.floor(plugin.settings.group/2)+2;
			
			if(!page) page = 1;
			page = parseInt(page);
			
			if(!page || page == 1 || page<change_view)
			{ 
				//console.log('x111');
				start = 1;
				//start = page+1;
				end = plugin.settings.group;
				if(plugin.settings.max < plugin.settings.group)
				{
					end = plugin.settings.max;
				}
			}
			else 
			{
				//console.log('x222');
				start = page-Math.floor(plugin.settings.group/2);
				end = page+Math.floor(plugin.settings.group/2);
				if((plugin.settings.group%2) == 0)
				{
					end = end-1;
				}
			}
			
			if(page == plugin.settings.max || end > plugin.settings.max)
			{
				//console.log('x333');
				start = 1;
				if(plugin.settings.max > plugin.settings.group)
				{ 
					start = plugin.settings.max-(plugin.settings.group-1);
				}
				end = plugin.settings.max;
			}

			if(page > plugin.settings.max)
			{
				//console.log('x444');
				start = plugin.settings.max-plugin.settings.group;
				end = plugin.settings.max;
			}

			if(page && page != 1)
			{
				//console.log('x555');
				num = page-1;
				/* ก่อนหน้า*/
				text = text+'<li><a href="javascript:void(0);" class="prev numbers" id="page_'+num+'" style="visibility: visible;" tabindex="-1">'+plugin.settings.prevText+'</a></li>';
			}
			
			//console.log(start+':'+end);
			
			
			
			//console.log(page+'::'+parseInt((page+plugin.settings.group)-1));
			for(var i=start; i<=parseInt((page+plugin.settings.group)-1); i++)
			{
				var classPage = '';
				var numbers = 'numbers';
				if(i == parseInt(page))
				{
					classPage = 'current';
					numbers = '';
				}
				if(plugin.settings.max>=i){
					text = text+'<li class="page_number"><a href="javascript:void(0);" class="'+classPage+' '+numbers+'" id="page_'+i+'">'+i+'</a></li>';
				}
				
			}
			//console.log( plugin.settings.max);
			//for(var i=start; i<=end; i++)
			//{
			//	
			//	var classPage = '';
			//	var numbers = 'numbers';
			//	if(i == parseInt(page))
			//	{
			//		classPage = 'current';
			//		numbers = '';
			//	}
			//	text = text+'<li class="page_number"><a href="javascript:void(0);" class="'+classPage+' '+numbers+'" id="page_'+i+'">'+i+'</a></li>';
			//}
			
			if(end < plugin.settings.max || page < plugin.settings.max)
			{
				num = parseInt(page)+1;
				/* ถัดไป */
				text = text+'<li><a href="javascript:void(0);" class="next numbers" id="page_'+num+'" style="visibility: visible;" tabindex="-1">'+plugin.settings.nextText+'</a></li>';
				
			}
			text = '<ul class="pagination" style="visibility: visible;">'+text+'</ul>';
			$element.html(text);
		}
		
		init();
	}
	
	$.fn.pagination = function(options) { 
		if(options.max > 1)
		{
			var plugin = new $.pagination(this, options);
		}
	}
	
	
})(jQuery);