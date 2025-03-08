(function($){
	var setting;
	var req;
	var current_page;
	var $this;
	var is_loading = false;
	var max_page;
	var dataSend;
	var methods = {
		init : function( options ) {     			
			
			if(is_loading != false)
			{
				req.abort();
				is_loading = false;
				$(window).off('.scroll');
				
			}
			
			$this = this;
			// check has_data current page
			current_page = this.data('current_page');
			if(!current_page)
			{
				current_page = 1;
			}			
			
			dataSend = $.extend(options.dataSend, {
				'current_page' : current_page
			});
			setting = $.extend($.fn.loadmore.defaults,options);

			$(window).scroll(scr_loadmore);		
			
			return this.each(function(){
				run(dataSend);
			});
		},
		destroy : function( ) {
			
			this.unbind('.loadmore');
			$(window).unbind('scroll');
			max_page = undefined;
		}
  
	};
	
	/************************************* Private Function *******************************/
	function kong_c(){
		console.log('x1');
	}
	function run()
	{	
		is_loading = true;
		var cacheAjax = true;
		
		if ($.browser.safari) {
			cacheAjax = false;
		}

		//console.log(dataSend);
		req = $.ajax({
			'url' : setting.url + '?t=' + Math.random(),
			'type' : 'POST',
			'dataType':'JSON',
			'cache' : cacheAjax,
			'data' : dataSend,
			'success' : function(rs) {		//console.log(rs);return false;
				//console.log(rs.item.cnt_topic_show, rs.item.total_topic, rs.item.max_show, rs.item.last_id_current_page);
//				console.log(rs); console.log(rs.item.cnt_topic_show); console.log(rs.item.total_topic);return false;
				// ถ้ามีการโหลดครบ 4 ครั้งรวมครั้งแรกที่เข้ามาหน้าแรกก็จะหยุดการทำงานให้ user 
				// ตันสินใจว่าจะดูต่อหรือไม่
				if(current_page == 4)
				{
					$(window).unbind('scroll'); // disable event loadmore
					
					$('.loadmore-bar a').on('click',function(){				
						current_page++;
						run();

						$(window).scroll(scr_loadmore);
						return false;
					});				
				}
//				else if(rs.item.cnt_topic_show < rs.item.max_show || rs.item.cnt_topic_show == rs.item.total_topic)
//				else if(rs.item.cnt_topic_show < rs.item.max_show)
//				{						//alert('stop2!!!');
//					// มีจำนวน topic = 50
//					$(window).unbind('scroll'); // disable event loadmore
//					$('.loadmore-bar.indexlist').remove();
//				}
				
//				if(rs.item.total_topic == undefined) // มีแค่ 50  topic
//				{
//					$(window).unbind('scroll'); // disable event loadmore
//					$this.loadmore('destroy');
//					$('.loadmore-bar.indexlist').remove();	
//				}
				if(rs.item.more == 'N') // มีแค่ 50  topic
				{
					$(window).unbind('scroll'); // disable event loadmore
					$this.loadmore('destroy');
					$('.loadmore-bar.indexlist').remove();	
				}
				// ถ้ามีการ set ค่า callback ไว้จะทำการรัน callback และส่งค่า item กลับไปให้
				if($.isFunction($.fn.loadmore.defaults.callback))
				{	
					if(rs.item.last_id_current_page != undefined) // == undefined
					{						
						//console.log(rs.item.last_id_current_page);
						//<a href="example.com/forum/foo?from=500&to=1000" rel="next" onClick="ajaxLoadMore();return false;">aaa</a>
						$('.loadmore-bar a').attr({'rel':'next','href' : location.pathname+'?tid='+rs.item.last_id_current_page});
						$this.data('last_id_current_page',rs.item.last_id_current_page);
						dataSend = $.extend(dataSend, {
							'last_id_current_page' : rs.item.last_id_current_page
						});
					}
					
					$this.data('current_page',current_page);							
					$.fn.loadmore.defaults.callback(rs.item);							
					is_loading = false;
				}
				
				
//				else if( current_page == max_page || max_page == 1 )
//				{						
//					// ถ้าหน้าที่แสดงอยู่มีค่าเท่ากับ จำนวนหน้าก็จะหยุดการทำงาน หรือ มีจำนวนหน้าเท่ากับ 1 
//					$(window).unbind('scroll'); // disable event loadmore
//					$('.loadmore-bar.indexlist').remove();
//				}
//				// ถ้าหากตัวแปร max_page ที่ส่งกลับมามีค่า 1 ก็หยุดการทำงานเลย
//				if(rs.max_page == 1)
//				{
//					$this.loadmore('destroy');
//					$('.loadmore-bar.indexlist').remove();					
//				}	
//				// ถ้ามีการ set ค่า callback ไว้จะทำการรัน callback และส่งค่า item กลับไปให้
//				if($.isFunction($.fn.loadmore.defaults.callback))
//				{	
//					
//					if(rs.item.last_id_current_page != undefined) // == undefined
//					{						
//						$this.data('last_id_current_page',rs.item.last_id_current_page);
//						dataSend = $.extend(dataSend, {
//							'last_id_current_page' : rs.item.last_id_current_page
//						});
//					}
//					
//					$this.data('current_page',current_page);							
//					$.fn.loadmore.defaults.callback(rs.item);							
//					is_loading = false;
//				}
//				max_page = rs.max_page;	
			
			}
		}); // end ajax
				
	}
	
//	function bottomScrollRefresh(callback) {
//     var pastBottom = $(window).height() + $(window).scrollTop()+150 >= getDocumentHeight();
//		if(!scrolledPastBottom && pastBottom) {
//			callback($(window).height() + $(window).scrollTop());
//			scrolledPastBottom = true;
//		} else {
//			if(!pastBottom) scrolledPastBottom = false;
//		}
//		scrollPrevious = $(window).scrollTop();
//	}
	function scr_loadmore()
	{
		
		var timeout = null;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			var doc_height = $(document).height();
			var div_height	=	$('.loadmore-bar').offset();
			var offset = 0;
			offset	=	(doc_height.top*99)/100;
			if(div_height != null)
			{
				offset = (div_height.top*99)/100;
			}
				
			var scrollTop =  $(window).height() + $(window).scrollTop();
			//console.log(scrollTop+':'+offset);
			if(scrollTop > offset)
			{		
				//console.log('1212121');
				if(is_loading == false)
				{
					current_page++;
	
					dataSend = $.extend(dataSend, {
						'current_page' : current_page
					});
					run();

				}
			}
		}, 500);
		
	}
	/************************************* Default Variable *******************************/
	$.fn.loadmore = function( method ) {		
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.loadmore' );
		}    
	};
	$.fn.loadmore.defaults = {		
		'url' : '/forum/topic/ajax_json_all_topic_info',
		'callback' : '',				
		'dataSend': ''
	}
	
	
})(jQuery);

