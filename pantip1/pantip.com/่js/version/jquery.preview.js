(function($){
    

	
	$.fn.preview = function(options){
		var $this = $(this);
		
		var settings = $.extend({},$.fn.preview.defaults,options);
		$.preview = $.extend($.preview, settings);
		//		$.ajaxQueue = {};
		//		var que = $.ajaxQueue;
		
		$.ajaxSetup({
			type: "POST",
			url : settings.url,
			//dataType : 'json',
			cache: false,
			async: true,
			timeout : 15000, //7sec
			error : function(jqXHR,exception){
				$('#preview_btn').replaceWith("<a class='button normal-butt' href='javascript:void(0);' id='preview_btn'><span><em>Preview</em></span></a>");
				$.preview.ObjectSet({
					show_btn_preview:true,
					ajaxrequest :false
				});
			}		
		});
		
		//return this.each(function() {
		strCounter();
		wait_process($.fn.preview.defaults, settings);
		$this.previewFrist($.preview);
		$this.previewBtn($.preview);
		$this.previewEdit($.preview);
		


	//});
	};
	$.fn.previewBtn = function (options){

		$(document).on('click','#preview_btn',function(){

			var $this = $(this);
			var active = $(options.active);
			//post_preview(options,$this);
			if(active.hasClass('topic') == true)
			{
				if(options.ajaxrequest == false)
				{
					options.ajaxrequest = true;
					var value = active.find('.text:visible');
					//alert(value.val());
					if($.trim(value.val()) != '')
					{//alert('x1');
						$(document.body).data('topic',
						{
							'raw':$.trim(value.val())
						});

						$.ajax({
							dataType : 'json',
							data : {
								update: $.data(document.body).topic,
								preview_type : 'topic'
							},
							success : function(rs){
								/* hide title */
								active.find('.fill-input,.step-caption').css("display","none");
								/* assign value */
								render_edit(options,rs);
								/* show edit */
								active.find('.edit-mark.icon.icon-editpen').css("display","block");
								/* remove active & frist */
								active.removeClass('active').removeClass('hover');
								/* remove btn_preview */
								active.find('#preview_btn').remove();
								/* set button preview */
								options.show_btn_preview = false;
								options.ajaxrequest = false;
							//console.log('set btn:'+options.show_btn_preview);
							}
						});
					}
				}
			}
			else if(active.hasClass('detail') == true)
			{
				if(options.ajaxrequest == false)
				{
					options.ajaxrequest = true;
				
					var value = active.find('textarea');
					$(document.body).data('detail',
					{
						'raw':value.val()
					});
					$.ajax({
						dataType : 'json',
						data : {
							update: $.data(document.body).detail,
							preview_type : 'detail'
						},
						success : function(rs){
							/* hide title */
							active.find('.fill-input,.step-caption').css("display","none");
							/* assign value */
							render_edit(options,rs);
							/* show edit */
							active.find('.edit-mark.icon.icon-editpen').css("display","block");
							/* remove active & frist */
							active.removeClass('active');
							$('body').find(options.selector).removeClass('frist');
							/* remove btn_preview */
							active.find('#preview_btn').remove();
							/* set button preview */
							options.show_btn_preview = false;
							options.ajaxrequest = false;
						//console.log('set btn :'+options.show_btn_preview);
						}
					});
				}
			}
			else if(active.hasClass('polls') == true)
			{
				if(options.ajaxrequest == false)
				{
					options.ajaxrequest = true;
				
					var idSplit = active.attr('id').split('-');
					var poll_id = idSplit[0];
					var poll_type = active.find('select.qtype').val();

					//					setJsonPolls(poll_id,poll_type,active);
					//console.log($.data(document.body).polls);
					if(setJsonPolls(poll_id,poll_type,active) !== false)
					{
						$.ajax({
							dataType : 'json',
							data : {
								update: $.data(document.body).polls[poll_id],
								preview_type : 'polls'
							},
							success : function(rs)
							{
								render_edit(options,rs);
								/* remove active & frist */
								active.removeClass('active');
								$('body').find(options.selector).removeClass('frist');
								/* remove btn_preview */
								$('body').find('#preview_btn').remove();
								options.show_btn_preview = false;
								options.ajaxrequest = false;
							}
						});
					}
				}
			//console.log($.data(document.body).polls);
			}
			else if(active.hasClass('product') == true)
			{

				if(options.ajaxrequest == false)
				{
					options.ajaxrequest = true;

					var value = active.find('.text:visible');
					//alert(value.val());

					$(document.body).data('product',
					{
						'raw':value.val()
					});

					$.ajax({
						dataType : 'json',
						data : {
							update: $.data(document.body).product,
							preview_type : 'product'
						},
						success : function(rs){
							/* hide title */
							active.find('.fill-input,.step-caption').css("display","none");
							/* assign value */
							render_edit(options,rs);
							/* show edit */
							active.find('.edit-mark.icon.icon-editpen').css("display","block");
							/* remove active & frist */
							active.removeClass('active');
							$('body').find(options.selector).removeClass('frist');
							/* remove btn_preview */
							active.find('#preview_btn').remove();
							/* set button preview */
							options.show_btn_preview = false;
							options.ajaxrequest = false;
						//console.log('set btn:'+options.show_btn_preview);
						}
					});
				}
			}
		});

	}
	
	$.fn.previewEdit = function (options){
		$(document).on('click',options.edit_class,function(){
			//var $this = $(this).parents('.create-post-item');
			var $this = $(this).parents(options.selector);
			var active = options.active;
			//alert($this.attr('class'));
			
			//				console.log('edit preivew btn:'+options.show_btn_preview);
			//alert(options.show_btn_preview);
			/* case edit ปกติ */
				
			if(options.show_btn_preview == false)
			{
					
				$this.addClass('active');
				if($this.hasClass('topic') == true)
				{
					//					alert('topic edit normal');
					editNormalTopicShow(options,$this);			
				}
				else if($this.hasClass('detail') == true)
				{
					//alert('detail edit normal');
					editNormalDetailShow(options,$this);
				}
				else if($this.hasClass('polls') == true)
				{
					//alert('poll edit normal');
					editNormalPollsShow(options,$this);
				}
				else if($this.hasClass('product') == true)
				{
					//					console.log('product edit normal');
					editNormalProductShow(options,$this);
				}
				
			}
			else
			{/* case edit ไม่ปกติ sw กดที่ปุ่ม edit แทน */
				//console.log(options.ajaxrequest);
				/* sent ajax section active */
				//alert('2');
				if($(active).hasClass('topic') == true)
				{
					var value = $(active).find('.text:visible');
					if($.trim(value.val()) != '')
					{
						$(document.body).data('topic',
						{
							'raw':$.trim(value.val())
						});
							
						if(options.ajaxrequest == false)
						{
							options.ajaxrequest = true;
							$.ajax({
								dataType : 'json',
								data : {
									update: $.data(document.body).topic,
									preview_type : 'topic'
								},
								success : function(rs){
									/* hide title */
									$(active).find('.fill-input,.step-caption').css("display","none");
									/* assign value */
									render_edit(options,rs);
									/* show edit */
									$(active).find('.edit-mark.icon.icon-editpen').css("display","block");
									/* remove active & frist */
									$(active).removeClass('active').removeClass('hover');
									/* remove btn_preview */
									$('body').find('#preview_btn').remove();
									/* set button preview */
									options.show_btn_preview = false;
									//console.log('set btn :'+options.show_btn_preview);
									/* set ajax request */
									options.ajaxrequest = false;
									editSwitchPreview(options,$this);
								//console.log(options.ajaxrequest);
								}
							});
						}						
					}
					else
					{
						$.removeData(document.body,'topic');
						/* remove btn_preview */
						$('body').find('#preview_btn').remove();
						/* remove active & frist */
						$(active).removeClass('frist').removeClass('active');
						/* set button preview */
						options.show_btn_preview = false;
						//console.log('set btn :'+options.show_btn_preview);
						options.ajaxrequest = false;
						editSwitchPreview(options,$this);
					}
				}
				else if($(active).hasClass('detail') == true)
				{
					var value = $(active).find('textarea');
					$(document.body).data('detail',
					{
						'raw':value.val()
					});
						
					if(options.ajaxrequest == false)
					{
						options.ajaxrequest = true;
							
						$.ajax({
							dataType : 'json',
							data : {
								update: $.data(document.body).detail,
								preview_type : 'detail'
							},
							success : function(rs){
								//console.log(rs);
								/* hide title */
								$(active).find('.fill-input,.step-caption').css("display","none");
								/* assign value */
								render_edit(options,rs);
								/* show edit */
								$(active).find('.edit-mark.icon.icon-editpen').css("display","block");
								/* remove active & frist */
								$(active).removeClass('active');
								$('body').find(options.selector).removeClass('frist');
								/* remove btn_preview */
								$('body').find('#preview_btn').remove();
								/* set button preview */
								options.show_btn_preview = false;
								//console.log('set btn :'+options.show_btn_preview);
								/* set ajax request */
								options.ajaxrequest = false;
								editSwitchPreview(options,$this);
							//console.log(options.ajaxrequest);
							}
						});
					}
				}
				else if($(active).hasClass('polls') == true)
				{
					//alert('edit switch poll');
					if(options.ajaxrequest == false)
					{
						options.ajaxrequest = true;
						/* set ข้อมูล json ลง .data */
						var idSplit = $(active).attr('id').split('-');
						var poll_id = idSplit[0];
						var poll_type = $(active).find('select.qtype').val();
						
						//						setJsonPolls(poll_id,poll_type,active);
						//console.log($.data(document.body).polls);
						if(setJsonPolls(poll_id,poll_type,active) !== false)
						{
							$.ajax({
								dataType : 'json',
								data : {
									update: $.data(document.body).polls[poll_id],
									preview_type : 'polls'
								},
								success : function(rs){		

									render_edit(options,rs);
									/* remove active & frist */
									$(active).removeClass('active');
									$('body').find(options.selector).removeClass('frist');
									/* remove btn_preview */
									$('body').find('#preview_btn').remove();
									options.show_btn_preview = false;
									/* set ajax request */
									options.ajaxrequest = false;
									editSwitchPreview(options,$this);
									focusInput($(options.active));

								}
							});	
						}
					}
				}
				else if($(active).hasClass('product') == true)
				{
					var value = $(active).find('.text:visible');
					
					$(document.body).data('product',
					{
						'raw':value.val()
					});
							
					if(options.ajaxrequest == false)
					{
						options.ajaxrequest = true;
						$.ajax({
							dataType : 'json',
							data : {
								update: $.data(document.body).product,
								preview_type : 'product'
							},
							success : function(rs){

								/* hide title */
								$(active).find('.fill-input,.step-caption').css("display","none");
								/* assign value */
								render_edit(options,rs);
								/* show edit */
								$(active).find('.edit-mark.icon.icon-editpen').css("display","block");
								/* remove active & frist */
								$(active).removeClass('active');
								$('body').find(options.selector).removeClass('frist');
								/* remove btn_preview */
								$('body').find('#preview_btn').remove();
								/* set button preview */
								options.show_btn_preview = false;
								//console.log('set btn :'+options.show_btn_preview);
								/* set ajax request */
								options.ajaxrequest = false;
								editSwitchPreview(options,$this);
							//console.log(options.ajaxrequest);
									
							}
						});
					}
					
					
				}
			}
		//console.log($.data(document.body).polls);
		});
	}

	$.fn.previewFrist = function(options){

		this.on('click',function(){
			var frist = $('.create-post-item.active').hasClass('frist');
			var $this = $(this);
			if(frist == true)
			{/* กรณี frist */
				var value = $('.create-post-item.active.frist').find('input[type=text]');
				/* กด นอก active */
				if($this.hasClass('active') == false)
				{
					if($.trim(value.val()) != '')
					{//alert('x1');
						$(document.body).data('topic',
						{
							'raw':$.trim(value.val())
						});

						$.ajax({
							dataType : 'json',
							data : {
								update: $.data(document.body).topic,
								preview_type : 'topic'
							},
							success : function(rs){
								/* hide title */
								$(options.active).find('.fill-input,.step-caption').css("display","none");
								/* assign value */
								render_edit(options,rs);
								/* show edit */
								$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
								/* remove active & frist */
								$(options.active).removeClass('frist').removeClass('active');
								/* remove btn_preview */
								$('body').find('#preview_btn').remove();
								/* add active */
								$this.addClass('active');
								/* create preview_btn */
								$this.find('.button-container').css("display","block").prepend(options.el_preview);
								/* set button preview */
								options.show_btn_preview = true;
								/* focus input */
								//focusInput($this);
								if($this.hasClass('polls') == true)
								{
								//$this.find("input[type=text]:first").focus();
								}
								else
								{
									// alert('fffffff');
									$this.find("textarea").focus();
								}
							}
						});
					}
					else
					{//alert('x2');
						$.removeData(document.body,'topic');
						/* remove btn_preview */
						$(options.active).find('#preview_btn').remove();
						/* remove active & frist */
						$(options.active).removeClass('frist').removeClass('active');
						/* add active */
						$this.addClass('active');
						/* create preview_btn */
						$this.find('.button-container').css("display","block").prepend(options.el_preview);
						/* set button preview */
						options.show_btn_preview = true;
						/* focus input */
						focusInput($this);
					}
				}
			}
			else
			{/* กรณีไม่ frist */

				//alert('กรณีไม่ frist');
				//console.log(options.show_btn_preview);
				//console.log(active_preview(options,$this));
				if(active_preview(options,$this) == true)
				{
					//					console.log(options.show_btn_preview);
					//					//console.log(options);
					if(options.show_btn_preview == false)
					{//alert('active');
						$this.addClass('active');
						$this.find('.button-container').css("display","block").prepend(options.el_preview);
						options.show_btn_preview = true;
						focusInput($this);
					}
					/* กดนอก active */
					if($this.hasClass('active') == false)
					{//alert('กดนอก active');
						firstSwitchPreview(options,$this);
					}
				}
			}
		});	
	}

	//****************************************** Public Function *****************************************//
	$.preview = {};
	/* Static Function */
	$.preview.test = function (){
		alert('test');
	};

	$.preview.ObjectSet = function(partialObject)
	{
		$.extend($.preview, partialObject);
	//var options = $.extend({},$.fn.preview.defaults,$.preview); เรียกใช้ใน function Static
	}
	
	function validationTopic($obj)
	{
		/* remove status error */
		$('#error_msg').remove();
		var topic = $(document.body).data('topic');
		var product = $(document.body).data('product');
		var crReview = $(document.body).data('crReview');
		var srReview = $(document.body).data('srReview');
		var type = $obj.type;

		if(topic == undefined || topic.raw.length  < $obj.validation.topicMin)
		{//alert('c3');
			
			/* add alert error */
			$('.breadcrumb-wrapper').after('<div id="error_msg" class="callback-status error-txt">เกิดข้อผิดพลาดกรุณาตรวจสอบอีกครั้ง</div>');
			/* Smooth scrolling  */
			var targetOffset = $('.breadcrumb-wrapper').offset().top;
			$('html,body').animate({
				scrollTop: targetOffset
			}, 700);
			$('.preview:first').addClass('active');
			/* show edit */
			editNormalTopicShow($.preview,$('.active'));
			/* add alert msg */
			$('#topic').after('<p class="error-txt small-txt">*กรุณากรอกหัวข้อกระทู้อย่างน้อย '+$obj.validation.topicMin+' ตัวอักษร</p>');
			return false;
		} else {
			$('#topic').next('.error-txt.small-txt').remove();
		}
		// create new review
		if(type == 4 && $obj.method != 'update')
		{//alert('c4');
			
			var review_type = $('input[name=review_type]:checked').val();
			var review_cost = $('input[name=review_cost]:checked').val();
			var review_note = $('#review_note').val();
			var time_on_page_id = $('#time_on_page_id').val();
		
			$(document.body).data('review_type', review_type);
			$(document.body).data('review_cost', review_cost);
			$(document.body).data('review_note', review_note);
			$(document.body).data('time_on_page_id', time_on_page_id);
		
			/* validation ชื่อสินค้าหรือร้านค้าที่รีวิว */
			if(product == undefined || product.raw.length  < $obj.validation.productMin) {
				$('.breadcrumb-wrapper').after('<div id="error_msg" class="callback-status error-txt">เกิดข้อผิดพลาดกรุณาตรวจสอบอีกครั้ง</div>');
				/* Smooth scrolling  */
				var targetOffset = $('.breadcrumb-wrapper').offset().top;
				$('html,body').animate({
					scrollTop: targetOffset
				}, 700);
				$('.preview.product').addClass('active');
				/* show edit */
				editNormalProductShow($.preview, $('#product_input'));
				/* add alert msg */
				$('#product_input').after('<p class="error-txt small-txt">*กรุณาใส่ชื่อสินค้าที่ต้องการรีวิวอย่างน้อย '+$obj.validation.productMin+' ตัวอักษร</p>');
				return false;
			} else {
				$('#product_input').next('.error-txt.small-txt').remove();
			}
			
			if (typeof review_type === 'undefined' || typeof review_cost === 'undefined') {
				$('.breadcrumb-wrapper').after('<div id="error_msg" class="callback-status error-txt">เกิดข้อผิดพลาดกรุณาตรวจสอบอีกครั้ง</div>');
				/* Smooth scrolling  */
				var targetOffset = $('.breadcrumb-wrapper').offset().top;
				$('html,body').animate({
					scrollTop: targetOffset
				}, 700);
				if (typeof review_type === 'undefined') {
					$('#review-type-error').show();
				}
				if (typeof review_cost === 'undefined') {
					$('#review-cost-error').show();
				}
				return false;
			}

		}

		if (typeof window.tinymceEnabled !== 'undefined') {
			if (richTextEditor.getError().status) {
				/* add alert error */
				$('.breadcrumb-wrapper').after('<div id="error_msg" class="callback-status error-txt">' + richTextEditor.getError().description + ' โปรดติดต่อผู้ดูแลระบบเพื่อแก้ไข</div>');
				/* Smooth scrolling  */
				var targetOffset = $('.breadcrumb-wrapper').offset().top;
				$('html,body').animate({
					scrollTop: targetOffset
				}, 700);

				// log error
				richTextEditor.send_error($obj.method != 'update' ? 'create': 'update');
				return false;
			}
		}
		

		if($obj.method == 'update')			
		{			
			if($obj.type == 4 && $('input[name=review_type]').length > 0) {
				
				$(document.body).data('review_type', $('input[name=review_type]:checked').val());
				$(document.body).data('review_cost', $('input[name=review_cost]:checked').val());
				$(document.body).data('review_note', $('textarea[name=review_note]').val());
				
				$.extend($obj, {
					'review_type' : $.data(document.body).review_type
				} , {
					'review_cost' : $.data(document.body).review_cost
				} , {
					'review_note' : $.data(document.body).review_note
				});
			}
			
			$(document.body).data('rating',null);
			// กรณีสำหรับการแก้ไขกระทู้จะเข้า case นี้
			var tags = $.data(document.body).tags;
			/* กรณีไม่เลือก tags ตอนตั้งกระทู้ */
			if(tags == '')
			{
				lightBoxConfirm($obj);
				return false;
			}
			
			
			lightBoxProcess();
			if(!$.data(document.body).detail)
			{
				$.data(document.body).detail = $.data(document.body).edit_detail;
			}
			
			// edit for click update topic
			// choose .data to update
			$.extend($obj, {
				'detail' : $.data(document.body).detail
			} ,{
				'tags' : $.data(document.body).tags
			}, {
				'new_tags' : $.data(document.body).new_tags
			} , {
				'topic' : $.data(document.body).topic
			} , {
				'topic_status' : $.data(document.body).topic_status
			} , {
				'tags_suggest' : $.data(document.body).tags_suggest
			});

			$.ajax({
				url :$obj.url, // /forum/new_topic/preview
				dataType : 'json',
				data : {
					value: $obj					
				},
				timeout : 15000,
				error : function(jqXHR,exception){

					$.errorNotice.dialog('มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง',{
						title : 'แจ้งเตือน',
						btn_close:'ดำเนินการต่อ'
					});
				},
				success : function(rs){					
					validation_error(rs);
					
					if(rs.edit_success == true)
					{
						$obj =$.extend({},$obj,rs);
						lightBoxSave($obj);
						window.tinymceAskBeforeLeave = false;
						return false;
					}
					
				}
			});
			return false;
		}
		
		/****************** insert new topic ************************/
		
		var tags = $.data(document.body).tags;
		/* poll dummy กรณี ไม่เคย active และต้องเป็นหน้าตั้งกระทู้ Poll ด้วย */
		if($.data(document.body).polls == undefined && $('.preview').hasClass('polls') == true)
		{
			var idSplit = $('.preview.polls:first').attr('id').split('-');
			var poll_zero = idSplit[0];
			previewDummyPolls(poll_zero);
		}
		
		var xhrRequest;
		/* ทุก ๆ 15 วิ*/
		setInterval(alertAgain, 10000);
		
		$.ajaxSetup({
			timeout : 15000

		});
		
		/* กรณีไม่เลือก tags ตอนตั้งกระทู้ */
		var club_id = $('#club_id').val();	
		if(tags == '' && !club_id)
		{
			lightBoxConfirm($obj);
			return false;
		}
			
		lightBoxProcess();
		
		/* post data to server for SAVE !!! */
		xhrRequest = requestAjaxAdd(xhrRequest,$obj);
		
		/* ยกเลิก */
		$(document).on('click','#btn_cancel',function(){
			/* ยกเลิก request */
			xhrRequest.abort();
			/* ลบ lightbox */
			$('.lightbox-hide.remove').remove();	
		});

		
			
	}
	
	function requestAjaxAdd(xhrRequest,$obj)
	{
	  // console.log($.data(document.body),$obj);return false;
		
		xhrRequest = $.ajax({
			url :$obj.url,
			dataType : 'json',
			data : {
				value: $.data(document.body),
				topic_type : $obj.type
			},
			error : function(jqXHR,exception){
				alertAgain();
			},
			success : function(rs){

				validation_error(rs);
				if(rs.status == 'success')
				{
					if (rs.chkWord != undefined)
					{
						lightBoxProcess();
						window.location.href = rs.id;
						return false;
					}
					$obj =$.extend({},$obj,rs);
					lightBoxSave($obj);
					window.tinymceAskBeforeLeave = false;
					return false;
				}

				if(rs.edit_success == true)
				{
					$obj =$.extend({},$obj,rs);
					lightBoxSave($obj);
					window.tinymceAskBeforeLeave = false;
					return false;
				}
			}
		});

		return xhrRequest;

	}

	function alertAgain ()
	{
		if($('#lightbox_save').length>=1)
		{
			$('#lightbox_save').html('<div class="dialog-loading-inner">'
				+'<span class="loading-inline focus-txt">กำลังโหลดข้อมูล โปรดรอสักครู่</span>'
				+'<br/><p>&nbsp;&nbsp;<a id="btn_cancel" class="small-txt" href="javascript:void(0);">ยกเลิกการส่งกระทู้</a></p>'
				+'</div>');
		}
	}
	
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
	
	function lightBoxConfirm($obj)
	{
		/* create div */
		$('.content').after('<div class="lightbox-hide remove" id="lightbox_confirm"></div>');
		/* create light box */
		$('#lightbox_confirm').dialog({
			width : 238,
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
		}).append('<p class="desc">คุณยังไม่ได้เลือกแท็ก  กระทู้นี้จะไปอยู่ในห้องไร้สังกัด</p>'
			+'<div class="button-container">'
			+'<a class="button normal-butt" id="cfm_sent" href="javascript:void(0);"><span><em>ส่งกระทู้</em></span></a>'
			+'<a class="close_lightbox button notgo-butt" id="cfm_cancel_sent" href="javascript:void(0);"><span><em>กลับไปแก้ไข</em></span></a>'
			+'</div>');

		$(document).on('click','#cfm_cancel_sent',function(){
			$('#lightbox_confirm').dialog( "destroy" ).remove();
		});

		$('#lightbox_confirm').off('click').on('click','#cfm_sent',function(){
			$('#lightbox_confirm').dialog( "destroy" ).remove();
			lightBoxProcess();
			
			if($obj.method == 'update')
			{
				$.extend($.data(document.body),{
					'method' : 'update'
					,
					'topic_id' : $obj.topic_id // for edit topic
					,
					'over_hr' : $obj.over // for edit topic
					,
					'type' : $obj.type
					,
					'topic_status' : $obj.topic_status
				});
			}

			var xhrRequest;
			/* post data to server for SAVE !!! */
			xhrRequest = requestAjaxAdd(xhrRequest,$obj);
			/* ยกเลิก */
			$(document).on('click','#btn_cancel',function(){
				/* ยกเลิก request */
				xhrRequest.abort();
				/* ลบ lightbox */
				$('.lightbox-hide.remove').remove();	
			});
			
		//			$.ajax({
		//				url :$obj.url,
		//				dataType : 'json',
		//				data : {
		//					value: $.data(document.body),
		//					topic_type : $obj.type
		//				},
		//				error : function(jqXHR,exception){
		//					
		//					$.errorNotice.dialog('มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง',{
		//						title : 'แจ้งเตือน',
		//						btn_close:'ดำเนินการต่อ'
		//					});
		//				},
		//				success : function(rs){
		//					/* ถ้ามี error กลับมาจะทำตรงนี้ */
		//					if(rs.error == true)
		//					{
		//						$.errorNotice.dialog(rs.error_message,{
		//							title : 'แจ้งเตือน'
		//						});
		//						return false;
		//					}
		//					$obj =$.extend({},$obj,rs);
		//					lightBoxSave($obj);
		//				}
		//			});
			
			
			
		});

	}
	
	function lightBoxProcess()
	{
		/* create div */
		$('.content').after('<div class="lightbox-hide remove" id="lightbox_save"></div>');
		/* create light box */
		$('#lightbox_save').dialog({
			width : 248,
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
	
	function lightBoxSave($obj)
	{
		//		$('#lightbox_save').dialog({
		//			width : 280,
		//			closeOnEscape: false,
		//			modal: true,
		//			closeOnEscape : false,
		//			open: function(event, ui) {
		//				$(".ui-dialog-titlebar-close,.ui-dialog-titlebar").hide();
		//				$(this).attr('style','display: block; width: auto; min-height: auto; height: auto;');
		//			},
		//			resizable: false,
		//			draggable: false,
		//			close: function(){}
		//		});
		
		if($obj.edit_success == true)
		{
			// เอาออกเพราะว่าน๊อตบอกว่าอยากได้ให้มันเร็วไม่ต้องติด delay
			//			$('#lightbox_save').html('<div class="modal-success-wrapper"><div class="icon icon-success modal-success"></div>บันทึกข้อมูลสำเร็จ, <a href="javascript:void(0);" id="go">ดูกระทู้ของคุณ</a><br/><span class="small-txt">ไปยังข้อความของคุณ ภายใน <span id="timer"></span> วินาที</span></div>');
			//			$('#go').click(function(){
			//				$('.lightbox-hide.remove').remove();
			//				window.location.reload();
			//			});
			//			counter_delay(6);
			//			var delay_loading = (function()
			//			{
			//				var timer = 0;
			//				return function(callback, ms)
			//				{
			//					clearTimeout (timer);
			//					timer = setTimeout(callback, ms);
			//				};
			//			})();
			//			/* delay 5 วิ */
			//			delay_loading(function(){
			//				/* remove div */
			//				$('.lightbox-hide.remove').remove();
			//				window.location.reload();
			//			}, 5000 );
			//api_push_call($obj);
			$('.lightbox-hide.remove').remove();
			window.location.reload();
		}
		else if($obj.product_name == null && $obj.topic_type == 4)
		{
			$('#lightbox_save').remove();
			$('.breadcrumb-wrapper').after('<div id="error_msg" class="callback-status error-txt">เกิดข้อผิดพลาดกรุณาตรวจสอบอีกครั้ง</div>');
			/* Smooth scrolling  */
			var targetOffset = $('.breadcrumb-wrapper').offset().top;
			$('html,body').animate({
				scrollTop: targetOffset
			}, 700);
			$('.preview.product').addClass('active');
			/* show edit */
			editNormalProductShow($.preview,$('.active'));
			/* add alert msg */
			$('#product_input').after('<p class="error-txt small-txt">*กรุณาใส่ชื่อสินค้าที่ถูกต้อง</p>');
			return false;
		}
		
		//		else if($obj.id == null)
		//		{/* ถ้าไม่ login ตอนที่กำลังโหลด process ต้องเตือน member เรื่องที่ login เค้าหลุด */
		//			$('#lightbox_save').html('<p>กรุณาคลิก "ตกลง" เพื่อไป Login ก่อนค่ะ</p><div class="button-container"><a href="javascript:void(0);" id="chk_login" class="button normal-butt"><span><em>ตกลง</em></span></a></div>');
		//			$(document).on('click','#chk_login',function(){
		//				$.ajax({
		//					url : window.location.protocol+'//'+window.location.hostname+'/login/ajax_redirect_login',
		//					data : {path:'forum/new_topic'},
		//					dataType : 'json',
		//					success : function(rs)
		//					{
		//						window.location = window.location.protocol+'//'+window.location.hostname+'/login?redirect='+rs.url
		//					}
		//				});
		//			});
		//		}
		else
		{/* ถ้า login */
			//			$('#lightbox_save').html('<div class="modal-success-wrapper"><div class="icon icon-success modal-success"></div>บันทึกข้อมูลสำเร็จ, <a href="javascript:void(0);" id="go">ดูกระทู้ของคุณ</a><br/><span class="small-txt">ไปยังข้อความของคุณ ภายใน <span id="timer"></span> วินาที</span></div>');
			//			$('#go').click(function(){
			//				$('.lightbox-hide.remove').remove();
			//				window.location = $obj.success+$obj.id;
			//			});
			//			counter_delay(6);
			var delay_loading = (function()
			{
				var timer = 0;
				return function(callback, ms)
				{
					clearTimeout (timer);
					timer = setTimeout(callback, ms);
				};
			})();
			//			/* delay 5 วิ */
			//			delay_loading(function(){
			//				/* remove div */
			//				$('.lightbox-hide.remove').remove();
			//				window.location = $obj.success+$obj.id;
			//			}, 5000 );
			delay_loading(function(){
				$('.lightbox-hide.remove').remove();
				//api_push_call($obj);
				window.location.href = $obj.success+$obj.id;

			}, 2000 );
		}
	}

	function api_push_call(obj)
	{
		// api push
		// console.log($.data(document.body));
		 var dataSend = $.extend({},obj,{ topic : $.data(document.body).topic.disp , detail : $.data(document.body).detail.disp });
		if(obj.edit_success)
		{
			dataSend = {
				'topic' : obj.topic 
				,'detail' : obj.detail
				,'member_id' : obj.member_id
				,'nickname' : obj.nickname
				,'type' : obj.type
				,'createAt' : obj.updateAt
				,'method' : obj.method				
				,'id' : obj.topic_id
				,'statusType' : obj.statusType
			}
		}

		$.ajax({
			url : '/node/api/push-check',
			dataType : 'JSON',
			type : 'POST' ,
			contentType :'application/json; charset=UTF-8',
			data : JSON.stringify(dataSend)
		}); 
	}
	
	/**
	 * --------------------------------------------------------------
	 *	- edit topic
	 *	- เมื่อมีการ click ที่ปุ่ม save
	 * --------------------------------------------------------------
	 */
	$.preview.updateNormal = function ($obj){		
		var options = $.extend({},$.fn.preview.defaults,$.preview);		
		$('.content').off('click').on('click','#topic-edit-button',function(){	
			window.tinymceAskBeforeLeave = false;		
			/* มีการ active ที่ */
			if($(options.active).hasClass('topic') == true)
			{  
				var value = $(options.active).find('.text:visible');

				$(document.body).data('topic',
				{
					'raw':$.trim(value.val())
				});

				$.ajax({
					dataType : 'json',
					data : {
						update: $.data(document.body).topic,
						preview_type : 'topic'
					},
					success : function(rs)
					{
						/* hide title */
						$(options.active).find('.fill-input,.step-caption').css("display","none");
						/* assign value */
						render_edit(options,rs);
						/* show edit */
						$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
						/* remove active & frist */
						$(options.active).removeClass('active frist hover');
						/* remove btn_preview */
						$('body').find('#preview_btn').remove();

						$.preview.ObjectSet({
							show_btn_preview:false
						})
						// เช็คว่าค่าใน form ได้รับครบหรือยัง
						//						chk_all_data_form_avalible($obj.over_hr,'topic',options);
						validationTopic($obj);
						
					}
				});
				
			}
			else if($(options.active).hasClass('detail') == true)
			{
				var value = $(options.active).find('textarea');
				$(document.body).data('detail',
				{
					'raw':value.val()
				});
				$.ajax({
					dataType : 'json',
					data : {
						update: $.data(document.body).detail,
						preview_type : 'detail'
					},
					success : function(rs){
						/* hide title */
						$(options.active).find('.fill-input,.step-caption').css("display","none");
						/* assign value */
						render_edit(options,rs);
						/* show edit */
						$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
						/* remove active & frist */
						$(options.active).removeClass('active');
						$('body').find(options.selector).removeClass('frist');
						/* remove btn_preview */
						$(options.active).find('#preview_btn').remove();
						/* set button preview */
						$.preview.ObjectSet({
							show_btn_preview:false
						})
						// เช็คว่าค่าใน form ได้รับครบหรือยัง
						//						chk_all_data_form_avalible($obj.over_hr,'detail',options);						
						validationTopic($obj);

					}
				});
			
			}
			else
			{
				
				// เช็คว่าค่าใน form ได้รับครบหรือยัง
				//				chk_all_data_form_avalible($obj.over_hr,'',options);
				
				/* ไม่ active ตัวไหนเลย */
				// การอัพเดทสำหรับการแก้ไขกระทู้แบบ wysiwyg จะเข้าเงื่อนไขนี้เสมอ

				if (document.getElementById('topic') !== null) {
					$(document.body).data('topic',
					{
						'raw':$.trim($('#topic').val())
					});
				}
				$(document.body).data('detail',
				{
					'raw': richTextEditor.getBbcode()
				});
				validationTopic($obj);	
				
			}
		});
	};
	
	$.preview.saveNormal = function ($obj) {
		$(document).on('click', "#topic_save", function() {
			$(document.body).data('topic',
			{
				'raw':$.trim($('#topic').val())
			});
			$(document.body).data('detail',{
                'raw': richTextEditor.getBbcode()
            });
			validationTopic($obj);
			
		})
	};
	// $.preview.saveNormal = function ($obj){
	// 	var options = $.extend({},$.fn.preview.defaults,$.preview);
	// 	console.log('option', options);
	// 	$(document).on('click','#btn_save',function(){
	// 		/* มีการ active ที่ */
	// 		alert('ffff');
	// 		if(options.ajaxrequest == false)
	// 		{
	// 			options.ajaxrequest = true;
				
	// 			if($(options.active).hasClass('topic') == true)
	// 			{   console.log('has class topic');
	// 			alert(1);
				
	// 				var value = $(options.active).find('.text:visible');

	// 				$(document.body).data('topic',
	// 				{
	// 					'raw':$.trim(value.val())
	// 				});

	// 				$.ajax({
	// 					dataType : 'json',
	// 					data : {
	// 						update: $.data(document.body).topic,
	// 						preview_type : 'topic'
	// 					},
	// 					success : function(rs)
	// 					{
	// 						console.log('rs', rs);
	// 						/* hide title */
	// 						$(options.active).find('.fill-input,.step-caption').css("display","none");
	// 						/* assign value */
	// 						//render_edit(options,rs);
	// 						/* show edit */
	// 						$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
	// 						/* remove active & frist */
	// 						$(options.active).removeClass('active frist hover');
	// 						/* remove btn_preview */
	// 						$('body').find('#preview_btn').remove();

	// 						$.preview.ObjectSet({
	// 							show_btn_preview:false
	// 						})
	// 						validationTopic($obj);
							
	// 						options.ajaxrequest = false;
	// 					}
	// 				});

	// 			}
	// 			else if($(options.active).hasClass('detail') == true)
	// 			{   alert(2);
	// 				console.log('has class detail');
	// 				var value = $(options.active).find('textarea');
	// 				$(document.body).data('detail',
	// 				{
	// 					'raw':value.val()
	// 				});
	// 				$.ajax({
	// 					dataType : 'json',
	// 					data : {
	// 						update: $.data(document.body).detail,
	// 						preview_type : 'detail'
	// 					},
	// 					success : function(rs){
	// 						/* hide title */
	// 						$(options.active).find('.fill-input,.step-caption').css("display","none");
	// 						/* assign value */
	// 						render_edit(options,rs);
	// 						/* show edit */
	// 						$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
	// 						/* remove active & frist */
	// 						$(options.active).removeClass('active');
	// 						$('body').find(options.selector).removeClass('frist');
	// 						/* remove btn_preview */
	// 						$(options.active).find('#preview_btn').remove();
	// 						/* set button preview */
	// 						$.preview.ObjectSet({
	// 							show_btn_preview:false
	// 						});
							
	// 						validationTopic($obj);
							
	// 						options.ajaxrequest = false;
	// 					}
	// 				});
			
	// 			}
	// 			else
	// 			{
	// 				alert(3);
	// 				/* ไม่ active ตัวไหนเลย */
	// 				validationTopic($obj);	
					
	// 				options.ajaxrequest = false;
	// 			}
	// 		}
	// 	});
	// };
	$.preview.savePoll = function ($obj){
		var options = $.extend({},$.fn.preview.defaults,$.preview);
		$(document).on('click','#topic_save',function() { 

			/* remove status error */
			$('#error_msg').remove();
			var topic = $('#topic').val().trim();

			$('#topic_input .error-txt').each(function(index) {
				$(this).remove();
			});

			if (topic.length  < $obj.validation.topicMin)
			{
				/* add alert error */
				$('.breadcrumb-wrapper').after('<div id="error_msg" class="callback-status error-txt">เกิดข้อผิดพลาดกรุณาตรวจสอบอีกครั้ง</div>');
				/* Smooth scrolling  */
				var targetOffset = $('.breadcrumb-wrapper').offset().top;
				$('html,body').animate({
					scrollTop: targetOffset
				}, 700);
				$('.preview:first').addClass('active');
				/* show edit */
				/* add alert msg */
				$('#topic').after('<p class="error-txt small-txt">*กรุณากรอกหัวข้อกระทู้อย่างน้อย '+$obj.validation.topicMin+' ตัวอักษร</p>');
				return false;
			}

			var show_result = $('#show_result:checked').length;
			var member_vote = {};
			var key = '';
			member_vote['all_vote'] = $('#all_vote:checked').length;
			$(".vote-poll").each( function(index) { 
				key = $(this).attr('id');
				member_vote[key] = $('#'+key+':checked').length;
			});
			if(parseInt($.trim($('#days_vote').val())) == 0 || $.trim($('#days_vote').val()).search(/^[0-9]+$/) != 0)
			{
				show_result = 0;
			}

			$(document.body).data('polls_option',
			{
				'days_vote':$.trim($('#days_vote').val()),
				'show_result':show_result,
				'voter':member_vote
			});
			$(document.body).data('topic',
			{
				'raw':$.trim($('#topic').val())
			});
			$(document.body).data('detail',{
                'raw': richTextEditor.getBbcode()
			});

			if($(options.active).hasClass('polls') == true) {
				options.ajaxrequest = true;
				var idSplit = $(options.active).attr('id').split('-');
				var poll_id = idSplit[0];
				var poll_type = $(options.active).find('select.qtype').val();
				if(setJsonPolls(poll_id,poll_type,$(options.active)) !== false) {
					$.ajax({
						dataType : 'json',
						data : {
							update: $.data(document.body).polls[poll_id],
							preview_type : 'polls'
						},
						success : function(rs)
						{
							render_edit(options,rs);
							/* remove active & frist */
							$(options.active).removeClass('active');
							$('body').find(options.selector).removeClass('frist');
							/* remove btn_preview */
							$('body').find('#preview_btn').remove();
							/* set button preview */
							$.preview.ObjectSet({
								show_btn_preview:false
							});
							validationTopic($obj);
							
							options.ajaxrequest = false;
						}
					});
				}		
			} else {
				validationTopic($obj);	
			}				
		});
	}
	
	// $.preview.savePoll = function ($obj){
		
	// 	var options = $.extend({},$.fn.preview.defaults,$.preview);
	// 	$(document).on('click','#btn_save',function(){ 
	// 		var show_result = $('#show_result:checked').length;
	// 		//var idcard_vote = $('#idcard_vote:checked').length;
	// 		var member_vote = {};
	// 		var key = '';
	// 		member_vote['all_vote'] = $('#all_vote:checked').length;
	// 		$(".vote-poll").each( function(index) { 
	// 			key = $(this).attr('id');
	// 			member_vote[key] = $('#'+key+':checked').length;
	// 		});
			
	// 		if(parseInt($.trim($('#days_vote').val())) == 0 || $.trim($('#days_vote').val()).search(/^[0-9]+$/) != 0)
	// 		{
	// 			show_result = 0;
	// 		}

	// 		$(document.body).data('polls_option',
	// 		{
	// 			'days_vote':$.trim($('#days_vote').val()),
	// 			'show_result':show_result,
	// 			'voter':member_vote
	// 		});
			
	// 		if(options.ajaxrequest == false)
	// 		{
	// 			options.ajaxrequest = true;
	// 			/* มีการ active ที่ */
	// 			if($(options.active).hasClass('topic') == true)
	// 			{
	// 				var value = $(options.active).find('.text:visible');

	// 				$(document.body).data('topic',
	// 				{
	// 					'raw':$.trim(value.val())
	// 				});

	// 				$.ajax({
	// 					dataType : 'json',
	// 					data : {
	// 						update: $.data(document.body).topic,
	// 						preview_type : 'topic'
	// 					},
	// 					success : function(rs)
	// 					{
	// 						/* hide title */
	// 						$(options.active).find('.fill-input,.step-caption').css("display","none");
	// 						/* assign value */
	// 						render_edit(options,rs);
	// 						/* show edit */
	// 						$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
	// 						/* remove active & frist */
	// 						$(options.active).removeClass('active frist hover');
	// 						/* remove btn_preview */
	// 						$('body').find('#preview_btn').remove();

	// 						$.preview.ObjectSet({
	// 							show_btn_preview:false
	// 						});
							
	// 						validationTopic($obj);
							
	// 						options.ajaxrequest = false;
	// 					}
	// 				});

	// 			}
	// 			else if($(options.active).hasClass('detail') == true)
	// 			{
	// 				var value = $(options.active).find('textarea');
	// 				$(document.body).data('detail',
	// 				{
	// 					'raw':value.val()
	// 				});

	// 				$.ajax({
	// 					dataType : 'json',
	// 					data : {
	// 						update: $.data(document.body).detail,
	// 						preview_type : 'detail'
	// 					},
	// 					success : function(rs){
	// 						/* hide title */
	// 						$(options.active).find('.fill-input,.step-caption').css("display","none");
	// 						/* assign value */
	// 						render_edit(options,rs);
	// 						/* show edit */
	// 						$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
	// 						/* remove active & frist */
	// 						$(options.active).removeClass('active');
	// 						$('body').find(options.selector).removeClass('frist');
	// 						/* remove btn_preview */
	// 						$(options.active).find('#preview_btn').remove();
	// 						/* set button preview */
	// 						$.preview.ObjectSet({
	// 							show_btn_preview:false
	// 						});
							
	// 						validationTopic($obj);
							
	// 						options.ajaxrequest = false;
	// 					}
	// 				});
			
	// 			}
	// 			else if($(options.active).hasClass('polls') == true)
	// 			{
	// 				var idSplit = $(options.active).attr('id').split('-');
	// 				var poll_id = idSplit[0];
	// 				var poll_type = $(options.active).find('select.qtype').val();

	// 				//				setJsonPolls(poll_id,poll_type,$(options.active));
	// 				//console.log($.data(document.body).polls);
	// 				if(setJsonPolls(poll_id,poll_type,$(options.active)) !== false)
	// 				{
	// 					$.ajax({
	// 						dataType : 'json',
	// 						data : {
	// 							update: $.data(document.body).polls[poll_id],
	// 							preview_type : 'polls'
	// 						},
	// 						success : function(rs)
	// 						{
	// 							render_edit(options,rs);
	// 							/* remove active & frist */
	// 							$(options.active).removeClass('active');
	// 							$('body').find(options.selector).removeClass('frist');
	// 							/* remove btn_preview */
	// 							$('body').find('#preview_btn').remove();
	// 							/* set button preview */
	// 							$.preview.ObjectSet({
	// 								show_btn_preview:false
	// 							});
	// 							validationTopic($obj);
								
	// 							options.ajaxrequest = false;
	// 						}
	// 					});
	// 				}
	// 			}
	// 			else
	// 			{

	// 				/* ไม่ active ตัวไหนเลย */
	// 				validationTopic($obj);	
					
	// 				options.ajaxrequest = false;
	// 			}
	// 		}
	// 	});
	// };

	$.preview.saveReview = function ($obj){ 

		$(document).on('click','#topic_save',function(){
			$(document.body).data('topic',
			{
				'raw': $('#topic').val()
			});
			$(document.body).data('product',
			{
				'raw': $('#product_name').val()
			});
			$(document.body).data('detail',{
                'raw': richTextEditor.getBbcode()
            });
			validationTopic($obj);
		})
	}
	// $.preview.saveReview = function ($obj){
	// 	var options = $.extend({},$.fn.preview.defaults,$.preview);
	// 	$(document).on('click','#btn_save',function(){
	// 		if(options.ajaxrequest == false)
	// 		{
	// 			options.ajaxrequest = true;
	// 			/* มีการ active ที่ */
	// 			if($(options.active).hasClass('topic') == true)
	// 			{
	// 				var value = $(options.active).find('.text:visible');

	// 				$(document.body).data('topic',
	// 				{
	// 					'raw':$.trim(value.val())
	// 				});

	// 				$.ajax({
	// 					dataType : 'json',
	// 					data : {
	// 						update: $.data(document.body).topic,
	// 						preview_type : 'topic'
	// 					},
	// 					success : function(rs)
	// 					{
	// 						/* hide title */
	// 						$(options.active).find('.fill-input,.step-caption').css("display","none");
	// 						/* assign value */
	// 						render_edit(options,rs);
	// 						/* show edit */
	// 						$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
	// 						/* remove active & frist */
	// 						$(options.active).removeClass('active frist hover');
	// 						/* remove btn_preview */
	// 						$('body').find('#preview_btn').remove();

	// 						$.preview.ObjectSet({
	// 							show_btn_preview:false
	// 						});
							
	// 						validationTopic($obj);
							
	// 						options.ajaxrequest = false;
	// 					}
	// 				});

	// 			}
	// 			else if($(options.active).hasClass('detail') == true)
	// 			{
	// 				var value = $(options.active).find('textarea');
	// 				$(document.body).data('detail',
	// 				{
	// 					'raw':value.val()
	// 				});
	// 				$.ajax({
	// 					dataType : 'json',
	// 					data : {
	// 						update: $.data(document.body).detail,
	// 						preview_type : 'detail'
	// 					},
	// 					success : function(rs){
	// 						/* hide title */
	// 						$(options.active).find('.fill-input,.step-caption').css("display","none");
	// 						/* assign value */
	// 						render_edit(options,rs);
	// 						/* show edit */
	// 						$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
	// 						/* remove active & frist */
	// 						$(options.active).removeClass('active');
	// 						$('body').find(options.selector).removeClass('frist');
	// 						/* remove btn_preview */
	// 						$(options.active).find('#preview_btn').remove();
	// 						/* set button preview */
	// 						$.preview.ObjectSet({
	// 							show_btn_preview:false
	// 						});
							
	// 						validationTopic($obj);
							
	// 						options.ajaxrequest = false;
	// 					}
	// 				});

	// 			}
	// 			else if($(options.active).hasClass('product') == true)
	// 			{
	// 				var value = $(options.active).find('.text:visible');

	// 				$(document.body).data('product',
	// 				{
	// 					'raw':value.val()
	// 				});

	// 				$.ajax({
	// 					dataType : 'json',
	// 					data : {
	// 						update: $.data(document.body).product,
	// 						preview_type : 'product'
	// 					},
	// 					success : function(rs)
	// 					{
	// 						/* hide title */
	// 						$(options.active).find('.fill-input,.step-caption').css("display","none");
	// 						/* assign value */
	// 						render_edit(options,rs);
	// 						/* show edit */
	// 						$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
	// 						/* remove active & frist */
	// 						$(options.active).removeClass('active frist hover');
	// 						/* remove btn_preview */
	// 						$('body').find('#preview_btn').remove();

	// 						$.preview.ObjectSet({
	// 							show_btn_preview:false
	// 						});
							
	// 						validationTopic($obj);
							
	// 						options.ajaxrequest = false;
	// 					}
	// 				});

	// 			}
	// 			else
	// 			{//alert('c2');
	// 				/* ไม่ active ตัวไหนเลย */
	// 				validationTopic($obj);
					
	// 				options.ajaxrequest = false;
	// 			}
	// 		}
	// 	});
	// };

	/* Add a new question */
	$.preview.addQuestion = function () {
		var options = $.extend({},$.fn.preview.defaults,$.preview);
		var counter = 1;
		

		$(document).on('click','.create-post-item.post-add-question',function(){
			var idSplit = $('.preview.polls:first').attr('id').split('-');
			var poll_zero = idSplit[0];

			/* sent ajax section active */
			if($(options.active).hasClass('topic') == true)
			{  
				//alert('topic');
				var value = $(options.active).find('.text:visible');
				if($.trim(value.val()) != '')
				{
					$(document.body).data('topic',
					{
						'raw':$.trim(value.val())
					});

					$.ajax({
						dataType : 'json',
						data : {
							update: $.data(document.body).topic,
							preview_type : 'topic'
						},
						success : function(rs){
							/* hide title */
							$(options.active).find('.fill-input,.step-caption').css("display","none");
							/* assign value */
							render_edit(options,rs);
							/* show edit */
							$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
							/* remove active & frist */
							$(options.active).removeClass('active frist hover');
							/* remove btn_preview */
							$('body').find('#preview_btn').remove();

							$.preview.ObjectSet({
								show_btn_preview:false
							})

							/* add element question */
							//console.log($.data(document.body).polls);

							/* เช็คว่ามี การ set ค่า polls แล้วยัง */
							if($.data(document.body).polls == undefined)
							{//alert('a1');
								/* add element question */
								previewDummyPolls(poll_zero);
							}
							else
							{
							//alert('a2');
							}
							//console.log(options.show_btn_preview);
							if($.preview.show_btn_preview == false)
							{    
								//console.log($.data(document.body).polls[0]);
								var poll_no = counter;
								counter++;
								var question = $('<div class="create-post-item post-desc-wrapper preview polls active" id="'+poll_no+'-qwp"><div class="step-caption"></div><div class="fill-input"><div class="input-line post-que-title-input"><input class="text remark-txt"placeholder="คำถาม"type="text"><a href="javascript:void(0);"class="small-txt remove-que">ลบคำถาม</a></div><div class="input-line small-txt">ประเภทคำถาม <select id="'+poll_no+'-qtdd"class="small-txt qtype"><option value="1">เลือกตอบได้ข้อเดียว</option><option value="2">เลือกตอบได้หลายข้อ</option></select></div><div class="input-line"><ul class="post-que-option-list"><li class="one-choice1"><div class="option-input"><input class="radio"name="item_group:'+poll_no+'"type="radio">\n<input class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"type="text"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li><li class="one-choice2"><div class="option-input"><input class="radio"name="item_group:'+poll_no+'"type="radio">\n<input class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"type="text"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li><li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt or_txt or_txt">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);"class="small-txt add-other actv">+เพิ่ม"อื่นๆ โปรดระบุ"</a></li></ul></div><div id="button_polls"class="button-container"style="display:block;">&nbsp;&nbsp;<input id="required"class="checkbox"style=""type="checkbox"><label for="required"style="">จำเป็นต้องตอบคำถามนี้</label></div></div></div>');
								$('.preview.polls:last').after(question);
								$('.remove-que').confirm_lightbox({
									ok_btn_txt : 'ลบ',
									cancel_btn_txt : 'ไม่ลบ',
									success_callback : del_Q
								});
								//options.show_btn_preview = true;
								$.preview.ObjectSet({
									show_btn_preview:true
								})
								$(options.active).find('.button-container').css('display','block').prepend(options.el_preview);
								focusInput($(options.active));
								/* แสดงผล Required เฉพาะอันแรก*/
								displayRequired();
							}
						//console.log('ปุ่มเพิ่ม set btn :'+$.preview.show_btn_preview);
						}
					});
				}
				else
				{
                    
					$.removeData(document.body,'topic');
					/* remove btn_preview */
					$('body').find('#preview_btn').remove();
					/* remove active & frist */
					$(options.active).removeClass('active');
					/* เช็คว่ามี การ set ค่า polls แล้วยัง */
					//console.log($.data(document.body).polls);
					if($.data(document.body).polls == undefined)
					{//alert('b1');
						/* add element question */
						previewDummyPolls(poll_zero);
					}
					else
					{
					//alert('b2');
					}		
					var poll_no = counter;
					counter++;
					var question = $('<div class="create-post-item post-desc-wrapper preview polls active" id="'+poll_no+'-qwp"><div class="step-caption"></div><div class="fill-input"><div class="input-line post-que-title-input"><input class="text remark-txt"placeholder="คำถาม"type="text"><a href="javascript:void(0);"class="small-txt remove-que">ลบคำถาม</a></div><div class="input-line small-txt">ประเภทคำถาม <select id="'+poll_no+'-qtdd"class="small-txt qtype"><option value="1">เลือกตอบได้ข้อเดียว</option><option value="2">เลือกตอบได้หลายข้อ</option></select></div><div class="input-line"><ul class="post-que-option-list"><li class="one-choice1"><div class="option-input"><input class="radio"name="item_group:'+poll_no+'"type="radio">\n<input class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"type="text"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li><li class="one-choice2"><div class="option-input"><input class="radio"name="item_group:'+poll_no+'"type="radio">\n<input class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"type="text"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li><li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);"class="small-txt add-other actv">+เพิ่ม"อื่นๆ โปรดระบุ"</a></li></ul></div><div id="button_polls"class="button-container"style="display:block;">&nbsp;&nbsp;<input id="required"class="checkbox"style=""type="checkbox"><label for="required"style="">จำเป็นต้องตอบคำถามนี้</label></div></div></div>');
					$('.preview.polls:last').after(question);
					$('.remove-que').confirm_lightbox({						
						ok_btn_txt : 'ลบ',
						cancel_btn_txt : 'ไม่ลบ',
						success_callback : del_Q
					});
					/* set button preview */
					$.preview.ObjectSet({
						show_btn_preview:true
					})
					$(options.active).find('.button-container').css('display','block').prepend(options.el_preview);
					focusInput($(options.active));
					/* แสดงผล Required เฉพาะอันแรก*/
					displayRequired();
				}
			}
			else if($(options.active).hasClass('detail') == true)
			{
				
				//				//alert('option detail');
				var value = $(options.active).find('textarea');
				$(document.body).data('detail',
				{
					'raw':value.val()
				});

				$.ajax({
					dataType : 'json',
					data : {
						update: $.data(document.body).detail,
						preview_type : 'detail'
					},
					success : function(rs){
						//console.log(rs);
						/* hide title */
						$(options.active).find('.fill-input,.step-caption').css("display","none");
						/* assign value */
						render_edit(options,rs);
						/* show edit */
						$(options.active).find('.edit-mark.icon.icon-editpen').css("display","block");
						/* remove active & frist */
						$(options.active).removeClass('active');
						/* remove btn_preview */
						$('body').find('#preview_btn').remove();
						/* set button preview */
						$.preview.ObjectSet({
							show_btn_preview:false
						})
						/* add element question */
						//alert(options.show_btn_preview);
						if($.preview.show_btn_preview == false)
						{
							/* เช็คว่ามี การ set ค่า polls แล้วยัง */
							if($.data(document.body).polls == undefined)
							{//alert('c1');
								/* add element question */
								previewDummyPolls(poll_zero);
							}
							else
							{
							//alert('c2');
							}
							var poll_no = counter;
							counter++;
							var question = $('<div class="create-post-item post-desc-wrapper preview polls active" id="'+poll_no+'-qwp"><div class="step-caption"></div><div class="fill-input"><div class="input-line post-que-title-input"><input class="text remark-txt"placeholder="คำถาม"type="text"><a href="javascript:void(0);"class="small-txt remove-que">ลบคำถาม</a></div><div class="input-line small-txt">ประเภทคำถาม <select id="'+poll_no+'-qtdd"class="small-txt qtype"><option value="1">เลือกตอบได้ข้อเดียว</option><option value="2">เลือกตอบได้หลายข้อ</option></select></div><div class="input-line"><ul class="post-que-option-list"><li class="one-choice1"><div class="option-input"><input class="radio"name="item_group:'+poll_no+'"type="radio">\n<input class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"type="text"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li><li class="one-choice2"><div class="option-input"><input class="radio"name="item_group:'+poll_no+'"type="radio">\n<input class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"type="text"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li><li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt or_txt">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);"class="small-txt add-other actv">+เพิ่ม"อื่นๆ โปรดระบุ"</a></li></ul></div><div id="button_polls"class="button-container"style="display:block;">&nbsp;&nbsp;<input id="required"class="checkbox"style=""type="checkbox"><label for="required"style="">จำเป็นต้องตอบคำถามนี้</label></div></div></div>');
							$('.preview.polls:last').after(question);
							$('.remove-que').confirm_lightbox({														
								ok_btn_txt : 'ลบ',
								cancel_btn_txt : 'ไม่ลบ',						
								success_callback : del_Q
							});
							/* set button preview */
							$.preview.ObjectSet({
								show_btn_preview:true
							})
							$(options.active).find('.button-container').css('display','block').prepend(options.el_preview);
							focusInput($(options.active));
							/* แสดงผล Required เฉพาะอันแรก*/
							displayRequired();
						}
					}
				});

			}
			else if($(options.active).hasClass('polls') == true)
			{
				//alert('option polls');
				if($.preview.ajaxrequest == false)
				{
					$.preview.ajaxrequest = true;
					/* set ข้อมูล json ลง .data */
					var idSplit = $(options.active).attr('id').split('-');
					var poll_id = idSplit[0];
					var poll_type = $(options.active).find('select.qtype').val();

					//					setJsonPolls(poll_id,poll_type,options.active);
					//console.log($.data(document.body).polls);
					if(setJsonPolls(poll_id,poll_type,options.active) !== false)
					{
						$.ajax({
							dataType : 'json',
							data : {
								update: $.data(document.body).polls[poll_id],
								preview_type : 'polls'
							},
							success : function(rs){

								render_edit($.preview,rs);
								/* remove active & frist */
								$(options.active).removeClass('active');
								$('body').find(options.selector).removeClass('frist');
								/* remove btn_preview */
								$('body').find('#preview_btn').remove();
								$.preview.ObjectSet({
									show_btn_preview:false
								})
								/* set ajax request */
								$.preview.ObjectSet({
									ajaxrequest:false
								})
								/* add element question */
								//alert(options.show_btn_preview);
								if($.preview.show_btn_preview == false)
								{
									/* เช็คว่ามี การ set ค่า polls แล้วยัง */
									if($.data(document.body).polls == undefined)
									{//alert('c1');
										/* add element question */
										previewDummyPolls(poll_zero);
									}
									else
									{
									//alert('c2');
									}
									var poll_no = counter;
									counter++;
									var question = $('<div class="create-post-item post-desc-wrapper preview polls active" id="'+poll_no+'-qwp"><div class="step-caption"></div><div class="fill-input"><div class="input-line post-que-title-input"><input class="text remark-txt"placeholder="คำถาม"type="text"><a href="javascript:void(0);"class="small-txt remove-que">ลบคำถาม</a></div><div class="input-line small-txt">ประเภทคำถาม <select id="'+poll_no+'-qtdd"class="small-txt qtype"><option value="1">เลือกตอบได้ข้อเดียว</option><option value="2">เลือกตอบได้หลายข้อ</option></select></div><div class="input-line"><ul class="post-que-option-list"><li class="one-choice1"><div class="option-input"><input class="radio"name="item_group:'+poll_no+'"type="radio">\n<input class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"type="text"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li><li class="one-choice2"><div class="option-input"><input class="radio"name="item_group:'+poll_no+'"type="radio">\n<input class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"type="text"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li><li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt or_txt">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);"class="small-txt add-other actv">+เพิ่ม"อื่นๆ โปรดระบุ"</a></li></ul></div><div id="button_polls"class="button-container"style="display:block;">&nbsp;&nbsp;<input id="required"class="checkbox"style=""type="checkbox"><label for="required"style="">จำเป็นต้องตอบคำถามนี้</label></div></div></div>');
									$('.preview.polls:last').after(question);

									$('.remove-que').confirm_lightbox({															
										ok_btn_txt : 'ลบ',
										cancel_btn_txt : 'ไม่ลบ',
										success_callback : del_Q
									});


									/* set button preview */
									$.preview.ObjectSet({
										show_btn_preview:true
									})
									$(options.active).find('.button-container').css('display','block').prepend(options.el_preview);
									focusInput($(options.active));
									/* แสดงผล Required เฉพาะอันแรก*/
									displayRequired();


								}

							}
						});
					}
				}
			}
			else
			{//alert('case3'); /* ไม่มีตัวไหน active ในหน้าจอเลย */

				/* เช็คว่ามี การ set ค่า polls แล้วยัง */
				if($.data(document.body).polls == undefined)
				{
					//alert('d1');
					/* add element question */
					previewDummyPolls(poll_zero);

				}
				else
				{
				//alert('d2');
				}
				
				if(true){
					var poll_no = counter;
					counter++;
					var question = $('<div class="create-post-item post-desc-wrapper preview polls active" id="'+poll_no+'-qwp"><div class="step-caption"></div><div class="fill-input"><div class="input-line post-que-title-input"><input class="text remark-txt"placeholder="คำถาม"type="text"><a href="javascript:void(0);"class="small-txt remove-que">ลบคำถาม</a></div><div class="input-line small-txt">ประเภทคำถาม <select id="'+poll_no+'-qtdd"class="small-txt qtype"><option value="1">เลือกตอบได้ข้อเดียว</option><option value="2">เลือกตอบได้หลายข้อ</option></select></div><div class="input-line"><ul class="post-que-option-list"><li class="one-choice1"><div class="option-input"><input class="radio"name="item_group:'+poll_no+'"type="radio">\n<input class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"type="text"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li><li class="one-choice2"><div class="option-input"><input class="radio"name="item_group:'+poll_no+'"type="radio">\n<input class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"type="text"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li><li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt or_txt">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);"class="small-txt add-other actv">+เพิ่ม"อื่นๆ โปรดระบุ"</a></li></ul></div><div id="button_polls"class="button-container"style="display:block;">&nbsp;&nbsp;<input id="required"class="checkbox"style=""type="checkbox"><label for="required"style="">จำเป็นต้องตอบคำถามนี้</label></div></div></div>');
					$('.preview.polls:last').after(question);
					$('.remove-que').confirm_lightbox({												
						ok_btn_txt : 'ลบ',
						cancel_btn_txt : 'ไม่ลบ',						
						success_callback : del_Q
					});
					//options.show_btn_preview = true;
					$.preview.ObjectSet({
						show_btn_preview:true
					})
					$(options.active).find('.button-container').css('display','block').prepend(options.el_preview);
					focusInput($(options.active));
					/* แสดงผล Required เฉพาะอันแรก*/
					displayRequired();
				}
			//console.log('ปุ่มเพิ่ม set btn :'+$.preview.show_btn_preview);
			}
		});

	};



	$.preview.deleteQuestion = function ()
	{
	//		var options = $.extend({},$.fn.preview.defaults,$.preview);
	//		$(document).on('click','.remove-que' , function (){
	//			//			$(this).confirm_lightbox({success_callback:function (){
	//			//					alert('x1');
	//			//			}});
	//
	//			var idSplit = $(options.active).attr('id').split('-');
	//			var poll_id = idSplit[0];
	//
	//			/* remove section question */
	//			$('#'+poll_id+'-qwp').remove();
	//			/* display จำเป็นต้องกรอก */
	//			$('.preview.polls:first').find('.required-mark-label').css('display', 'block');
	//			/* set button preview */
	//			$.preview.ObjectSet({show_btn_preview:false})
	//			/* delete json */
	//			//console.log($.data(document.body).polls);
	//			delete $.data(document.body).polls[poll_id];
	//			var q = $.data(document.body).polls.question_len-1;
	//			var value = $.extend({},$.data(document.body).polls,{question_len:q});
	//			$(document.body).data('polls',value);
	//			//console.log($.data(document.body).polls);
	//		});

	};

	/* function on change polls */
	$.preview.change_question_type = function (){
		var settings = $.extend({},$.fn.preview.defaults);
		// when change select
		$(document).on('change','.qtype',function(){
			var  type = $(this).val();
			change_type(type,$(this));
		});
	};

	/* Begin Function */
	/*
	 * function สร้างคำถามโหวตแบบ "ตอบได้คำตอบเดียว"
	 * function สร้างคำถามโหวตแบบ "ตอบได้หลายคำตอบ"
	 */
	$.preview.question = function (){
		
		/* ปุ่มปิดได้ ทุก lightbox */
		$('body').on('click','.close_lightbox',function(){
			//			var x = $('#system-notify');
			//			console.log(x);
			$('#system-notify').dialog( "destroy" );
			$('#system-notify').remove();
		});

		// on add choice
		$(document).on('click', '.add-choice', function(){ 
			//addChoice($(this).parents('.create-post-item.post-desc-wrapper.poll'));
			add_choice($(this));
		});

		// on add other choice
		$(document).on('click','.add-other',function(){
			add_other($(this));
		});

		// remove choice
		$(document).on('click', '.option-remove', function(){
			remove_choice($(this));
		});
	};
	$.preview.mgtGrid = function(){
		// Remove row
		$(document).on('click','.active .icon-remove',function(){
			var row = $('.choice_row').length;
			// ถ้ามากกว่า 2 แถวถึงจะลบแถวได้
			if(row > 2)
			{
				$(this).parents('.active .choice_row').remove();
				//ถ้าเท่ากับ 2 แถวแล้วก็ซ่อนไป
				if($('.active .choice_row').length == 2)
				{
					$('.active .remove-cell').css("visibility","hidden");
				}
			}
		});

		
		$(document).on('change','.active .column_amount',function(){
			
			var new_colspan_val	=	$(this).val();
			var amount_rows = $(this).parents('.post-que-grid').find('.choice_row').length;
			
			if(new_colspan_val < $.preview.min_grid_cols || new_colspan_val > $.preview.max_grid_cols || amount_rows < $.preview.min_grid_rows)
			{
				var select = $(this).parents('.fill-input').find('.qtype');
				var type = select.val();
				msgErrorPolls(type, select);
				return false;
			}
			
			var current_column_choice	=	$('.active .choice_row:first').find('td.aligncenter').length-1;
			//alert($('.active .choice_row:first').html());
			var is_add	=	false;
			//console.log(new_colspan_val + ' ' + current_column_choice);

			if(new_colspan_val >= 5)
			{
				new_colspan_val = 5;
			}
			if(current_column_choice < new_colspan_val)
			{
				is_add = true
			}

			if(is_add == false)
			{
				for(var i = new_colspan_val;i<current_column_choice;i++)
				{
					// remove title column
					$('.active .title_row').find('td:last').remove()
					// change colspan
					.end().prev().find('td:last').attr('colspan',new_colspan_val);
					// remove last column
					$('.active .choice_row').find('td:last').prev().remove();
					// cheage colspan last tr
					$(this).parents('tbody').find('tr:last td').attr('colspan',parseInt(new_colspan_val) + 1);
				}
			}
			else
			{
				for(var i = current_column_choice;i<new_colspan_val;i++)
				{
					var title_html = '<td>'
					+ '<input type="text" class="text remark-txt" placeholder="ชื่อคอลัมน์" />'
					+'</td>';

					// remove title column
					$('.active .title_row').find('td:last').after(title_html)
					// change colspan
					.end().prev().find('td:last').attr('colspan',new_colspan_val);
					// remove last column
					var choice_html = '<td class="aligncenter"><input type="radio" class="radio" name=""/></td>';
					$('.active .choice_row').find('td:last').prev().after(choice_html);
					// change colspan last tr
					$(this).parents('tbody').find('tr:last').find('td').attr('colspan',parseInt(new_colspan_val) + 1);
				}

				$('.active .choice_row').each(function(){
					var cur_name = $(this).find('input:radio:first').attr('name');
					$(this).find('input:radio').attr('name',cur_name);
				});
			}
		})

		// Add choice row
		$(document).on('click','.active #add_row_choice',function(e) {
			var col_html = '';
			var new_colspan_val = $('.column_amount').val();
			var amount_rows = $(this).parents('.post-que-grid').find('.choice_row').length;
			if(new_colspan_val < $.preview.min_grid_cols || new_colspan_val > $.preview.max_grid_cols || amount_rows < $.preview.min_grid_rows)
			{
				var select = $(this).parents('.fill-input').find('.qtype');
				var type = select.val();
				msgErrorPolls(type, select);
				return false;
			}
			var amount_row = ($('table .choice_row').length);
			// limit 20 rows
			if(amount_row < 20)
			{
				//alert(new_colspan_val);
				for(var j = 0;j < new_colspan_val;j++)
				{
					col_html += '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup"/></td>';
				}

				var choice_row_html = '<tr class="choice_row">'
				+ '<td><textarea placeholder="ชื่อแถว" class="text remark-txt"></textarea></td>'
				+ col_html
				+ '<td class="aligncenter remove-cell"><span title="ลบ" class="icon icon-remove"></span></td>'
				+ '</tr>';
				$('.choice_row:last').after(choice_row_html);
				
				

				// Row have over than 2 rows add delete
				//				console.log(amount_row);
				if(amount_row >= 2)
				{
					//$('.remove-cell').show();
					$('.remove-cell').css("visibility","visible");
				//					console.log('show');
				}
				else
				{
					//					$('.remove-cell').hide();
					$('.remove-cell').css("visibility","hidden");
				//					console.log('hide');
				} // amount_row >= 2
			} // amount_row < 20
		});
	}
	$.preview.mgtScaleScore = function (){
		$('.create-post-wrapper.create-post-normal').on('change','select.sesc', function(){
			var tmp = $(this).attr('id');
			tmp = tmp.split('-');
			if(tmp.length > 1)
			{
				var number = tmp[0];
				var change = tmp[1];
				var begin = "";
				var end = "";
				var num = "";
				var items ="";
				if(change == "scldd")
				{
					begin = $(this).attr('value');
					end = $('#'+number+'-scudd').attr('value');
				}
				else if(change == "scudd")
				{
					begin = $('#'+number+'-scldd').attr('value');
					end = $(this).attr('value');
				}
				
				if((begin < $.preview.min_scldd || begin > $.preview.max_scldd) || (end < $.preview.min_scudd || end > $.preview.max_scudd))
				{
					var select = $(this).parents('.fill-input').find('.qtype');
					var type = select.val();
					msgErrorPolls(type, select);
					return false;
				}

				num = end - begin + 1;

				var radio = '<input type="radio" class="radio" name="'+number+'-scg"/>';

				for(i=0;i<num;i++)
				{
					items += radio;
				}
				$('#'+number+'-scrdctn').html(items);

			}

		});
	};

	/************************************************* Private Function *************************************************/
	function render_edit (options,rs)
	{
		
		var active = $(options.active);
		if(active.hasClass('topic') == true)
		{
			//console.log(rs);
			$(document.body).data('topic',
			{
				'raw':rs.raw,
				'disp' :rs.disp
			});
			//console.log($.data(document.body));
			active.find('.post-preview').css("display","block").html(rs.disp);
		}
		else if(active.hasClass('detail') == true)
		{
			//console.log(rs);
			// $(document.body).data('detail',
			// {
			// 	'raw':rs.raw,
			// 	'disp' :rs.disp
			// });
			// //console.log($.data(document.body));
			// if(rs.raw != '')
			// {
			// 	active.find('.post-preview').css("display","block").html(rs.disp);
			// }
			// else
			// {
			// 	active.find('.post-preview').css("display","block").html('<span class="small-txt-fixed remark-txt">คุณยังไม่ได้ใส่รายละเอียด <a href="javascript:void(0)" class="edit-btn">คลิกที่นี่เพื่อใส่ข้อความ</a></span>');
			// }
		}
		else if(active.hasClass('polls') == true)
		{
			var idSplit = $(active).attr('id').split('-');
			var poll_id = idSplit[0];
			//console.log($.data(document.body).polls[poll_id]);
			//$(document.body).data('polls',after);
			var choice_json = {};
			choice_json['choice'] = {};
			var rs_json = {};
			//			rs_json[poll_id] = {};
			var data = $.data(document.body).polls[poll_id];
			
			
				
			var edit = '<div style="display:block;" class="edit-btn edit-mark icon icon-editpen">แก้ไข</div>';
			var caption = '<div class="step-caption"><span style="display: none;" class="required-mark-label">* จำเป็นต้องตอบ</span></div>';
			// สร้างตัวแปรไว้เก็บโค้ด html สำหรับ preview
			var choice_preview = '';
			var choice_other_row= '';
			
			// สร้างส่วน choice
			if (data.poll_type == 1) //radio
			{
				for(var i=0;i<data.choice_len;i++)
				{
					var disp = '';
					// เช็คว่ามีรูปรึเปล่า
					if (rs.choice[i].media_url == 'undefined')
					{
						if(rs.choice[i].disp_name != '')
						{
							disp = rs.choice[i].disp_name;
						}
						var choice_media = '';
					}
					else
					{
						if(rs.choice[i].disp_name != '')
						{
							disp = rs.choice[i].disp_name+'<br/><br/>';
						}
						var choice_media = rs.choice[i].media_url_rs;
					}

			
					// สร้าง select สำหรับ preview
					choice_preview += '<tr>'
					+'<td class="choice-input"><input id="choice_'+poll_id+i+'" type="radio" class="radio" name="item_group:'+poll_id+'"></td>'
					+'<td class="choice-label">'
					+ '<label for="choice_'+poll_id+i+'">'
					+ disp
					+ choice_media
					+ '</label>'
					+'</td>'
					+'</tr>'
					
					/* set .data ด้วยข้อมูลใหม่ */
					choice_json['choice'][i] = {};
					choice_json['choice'][i] = rs.choice[i];
					rs_json[poll_id] = $.extend({},data,choice_json);
					
				}

				rs_json[poll_id] = $.extend({},rs_json[poll_id],{
					'disp_poll_title':rs.disp_poll_title
				});
				
				if(data.choice_required == true)
				{
					var required = '<span class="required-mark">*</span>';
				}
				else
				{
					var required = '';
				}
				// เช็คว่ามี input เพิ่มตัวเลือกอื่นๆรึเปล่า
				if(data.poll_other == true)
				{
					var choice_other_row = '<tr>'
					+'<td class="choice-input"><input id="other_'+poll_id+i+'" type="radio" class="radio" name="item_group:'+poll_id+'"></td>'
					+'<td class="choice-label">'
					+'<label for="other_'+poll_id+i+'">อื่นๆ</label> <input type="text" class="text remark-txt">'
					+'</td>'
					+'</tr>';
				}
				else
				{
					var choice_other_row = '';
				}


				var form = '<div class="fill-input post-preview">'
				+'<div class="input-line post-que-title-input">'+rs.disp_poll_title+required+'</div>'
				+'<div class="input-line">'
				+'<table cellspacing="0" cellpadding="0" class="post-que-table dotted-border full-width">'
				+choice_preview+choice_other_row
				+'</table>'
				+'</div>'
				+'</div>';
				
				var before = $(document.body).data('polls');
				var after = $.extend({},before,rs_json);
				$(document.body).data('polls',after);
			}
			else if (data.poll_type == 2) // checkbox
			{
				for(var i=0;i<data.choice_len;i++)
				{
					var disp = '';
					// เช็คว่ามีรูปรึเปล่า
					if (rs.choice[i].media_url == 'undefined')
					{
						if(rs.choice[i].disp_name != '')
						{
							disp = rs.choice[i].disp_name;
						}
						var choice_media = '';
					}
					else
					{
						if(rs.choice[i].disp_name != '')
						{
							disp = rs.choice[i].disp_name+'<br/><br/>';
						}
						var choice_media = rs.choice[i].media_url_rs;
					}

					
					// สร้าง select สำหรับ preview
					choice_preview += '<tr>'
					+'<td class="choice-input"><input type="checkbox" id="choice_'+poll_id+i+'" class="checkbox" name="item_group:'+poll_id+'"></td>'
					+'<td class="choice-label">'
					+ '<label for="choice_'+poll_id+i+'">'
					+ disp
					+ choice_media
					+'</label>'
					+'</td>'
					+'</tr>'
				
					/* set .data ด้วยข้อมูลใหม่ */
					choice_json['choice'][i] = {};
					choice_json['choice'][i] = rs.choice[i];
					rs_json[poll_id] = $.extend({},data,choice_json);		
				}

				rs_json[poll_id] = $.extend({},rs_json[poll_id],{
					'disp_poll_title':rs.disp_poll_title
				});
				
				if(data.choice_required == true)
				{
					var required = '<span class="required-mark">*</span>';
				}
				else
				{
					var required = '';
				}

				// เช็คว่ามี input เพิ่มตัวเลือกอื่นๆรึเปล่า
				if(data.poll_other == true)
				{
					var choice_other_row = '<tr>'
					+'<td class="choice-input"><input id="other_'+poll_id+i+'" type="checkbox" class="checkbox" name="item_group:'+poll_id+'"></td>'
					+'<td class="choice-label">'
					+'<label for="other_'+poll_id+i+'">อื่นๆ</label> <input type="text" class="text remark-txt">'
					+'</td>'
					+'</tr>';
				}
				else
				{
					var choice_other_row = '';
				}

				var form = '<div class="fill-input post-preview">'
				+'<div class="input-line post-que-title-input">'+rs.disp_poll_title+required+'</div>'
				+'<div class="input-line">'
				+'<table cellspacing="0" cellpadding="0" class="post-que-table dotted-border full-width">'
				+choice_preview+choice_other_row
				+'</table>'
				+'</div>'
				+'</div>';

				var before = $(document.body).data('polls');
				var after = $.extend({},before,rs_json);
				$(document.body).data('polls',after);
			}
			else if (data.poll_type == 3) // dropdown
			{
				for(var i=0;i<data.choice_len;i++)
				{
					// เช็คว่ามีรูปรึเปล่า
					if (rs.choice[i].media_url == 'undefined')
					{
						var choice_media = '';
					}
					else
					{
						var choice_media = rs.choice[i].media_url_rs;
					}
					//สร้าง select สำหรับ preview
					choice_preview += '<option>'
					+ rs.choice[i].disp_name
					+'</option>';
				
					/* set .data ด้วยข้อมูลใหม่ */
					choice_json['choice'][i] = {};
					choice_json['choice'][i] = rs.choice[i];
					rs_json[poll_id] = $.extend({},data,choice_json);		
				}

				rs_json[poll_id] = $.extend({},rs_json[poll_id],{
					'disp_poll_title':rs.disp_poll_title
				});
				if(data.choice_required == true)
				{
					var required = '<span class="required-mark">*</span>';
				}
				else
				{
					var required = '';
				}

				var form = '<div class="fill-input post-preview">'
				+'<div class="input-line post-que-title-input">'+rs.disp_poll_title+required+'</div>'
				+'<div class="input-line">'
				+'<select>'
				+choice_preview
				+'</select>'
				+'</div>'
				+'</div>';
			
				var before = $(document.body).data('polls');
				var after = $.extend({},before,rs_json);
				$(document.body).data('polls',after);
			}
			else if (data.poll_type == 4) // scale
			{
				/* set .data ด้วยข้อมูลใหม่ของ rs */
				choice_json = {};
				choice_json = rs;
				var choice = $.extend({},data.choice,choice_json.choice);
				/* extend  choice & disp title ที่มาจาก server */
				rs_json[poll_id] = $.extend({},data,{
					'choice':choice,
					'disp_poll_title':rs.disp_poll_title
				});
				/* อ่านออกมากก่อน */
				var before = $(document.body).data('polls');
				/* แล้ว set เข้าไปใหม่ */
				var after = $.extend({},before,rs_json);
				$(document.body).data('polls',after);

				
				var dotData= $.data(document.body).polls[poll_id];
				/* start */
				choice_preview += '<table cellspacing="0" cellpadding="0" class="post-que-table">';
				/* header */
				choice_preview +='<tr><td>&nbsp;</td>';
				for(i=dotData.choice.range_min;i<=dotData.choice.range_max;i++)
				{
					choice_preview +='<td class="aligncenter">'+i+'</td>';
				}
				choice_preview +='<td class="aligncenter">&nbsp;</td></tr>';
				
				/* content */
				choice_preview +='<tr><td>'+dotData.choice.disp_text_min+'</td>';
				for(i=dotData.choice.range_min;i<=dotData.choice.range_max;i++)
				{
					choice_preview +='<td class="aligncenter"><input class="radio" type="radio" name="scalegroup"></td>';
				}
				choice_preview +='<td>'+dotData.choice.disp_text_max+'</td></tr>';
				/* end */
				choice_preview += '</table>';
				
				if(data.choice_required == true)
				{
					var required = '<span class="required-mark">*</span>';
				}
				else
				{
					var required = '';
				}

				var form = '<div class="fill-input post-preview">'
				+'<div class="input-line post-que-title-input">'+rs.disp_poll_title+required+'</div>'
				+'<div class="input-line">'
				+choice_preview
				+'</div>'
				+'</div>';

			}
			else if(data.poll_type == 5) // grid
			{
				/* set .data ด้วยข้อมูลใหม่ของ rs */
				choice_json = {};
				choice_json = rs;
				//console.log(rs);
				
				var rows = {
					'disp_rows':rs.choice.disp_rows
				};
				var cols = {
					'disp_cols':rs.choice.disp_cols
				};
				
				var disp = $.extend({},rows,cols);
				//				console.log(disp);
				var choice = $.extend({},data.choice,disp);
				//				console.log(choice);
				/* extend  rows cols & disp title ที่มาจาก server */
				rs_json[poll_id] = $.extend({},data,{
					'choice':choice,
					'disp_poll_title':rs.disp_poll_title
				});
				/* อ่านออกมากก่อน */
				var before = $(document.body).data('polls');
				/* แล้ว set เข้าไปใหม่ */
				var after = $.extend({},before,rs_json);
				$(document.body).data('polls',after);
				//console.log($(document.body).data('polls'));
				var dotData= $.data(document.body).polls[poll_id];
				/* start */
				choice_preview += '<table cellspacing="0" cellpadding="0" class="post-que-table post-que-grid full-width">';
				/* header */
				choice_preview +='<tr><td>&nbsp;</td>';
				for(var i=0;i<dotData.choice.disp_cols.length;i++)
				{
					choice_preview +='<td class="aligncenter small-txt">'+dotData.choice.disp_cols[i]+'</td>';
				}
				choice_preview +='</tr>';
				for(var j=0;j<dotData.choice.disp_rows.length;j++)
				{
					choice_preview +='<tr><td class="post-que-grid-label">'+dotData.choice.disp_rows[j]+'</td>';
					for(var k=0;k<dotData.choice.disp_cols.length;k++)
					{
						choice_preview +='<td class="aligncenter"><input class="radio" type="radio" name="scalegroup"></td>';
					}
					choice_preview +='</tr>';
				}

			
				
				

				if(data.choice_required == true)
				{
					var required = '<span class="required-mark">*</span>';
				}
				else
				{
					var required = '';
				}

				var form = '<div class="fill-input post-preview">'
				+'<div class="input-line post-que-title-input">'+rs.disp_poll_title+required+'</div>'
				+'<div class="input-line">'
				+choice_preview
				+'</div>'
				+'</div>';
				
			}
			else if (data.poll_type == 6) // rank
			{
				for(var i=0;i<data.choice_len;i++)
				{
					var disp = '';
					// เช็คว่ามีรูปรึเปล่า
					if (rs.choice[i].media_url == 'undefined')
					{
						if(rs.choice[i].disp_name != '')
						{
							disp = rs.choice[i].disp_name;
						}
						var choice_media = '';
					}
					else
					{
						if(rs.choice[i].disp_name != '')
						{
							disp = rs.choice[i].disp_name+'<br/><br/>';
						}
						var choice_media = rs.choice[i].media_url_rs;
					}

					//สร้าง select สำหรับ preview
					choice_preview += '<tr>'
					+'<td class="choice-input">'
					+'<select>'

					for(var cnt=1;cnt<=data.choice_len;cnt++)
					{
						choice_preview += '<option>'+cnt+'</option>'
					}

					choice_preview += '</select>'
					+'</td>'
					+'<td class="choice-label">'
					+'<label for="'+poll_id+i+'">'
					+ disp
					+ choice_media
					+'</label>'
					+'</td>'
					+'</tr>'
				
					/* set .data ด้วยข้อมูลใหม่ */
					choice_json['choice'][i] = {};
					choice_json['choice'][i] = rs.choice[i];
					rs_json[poll_id] = $.extend({},data,choice_json);		
				}
				rs_json[poll_id] = $.extend({},rs_json[poll_id],{
					'disp_poll_title':rs.disp_poll_title
				});
				if(data.choice_required == true)
				{
					var required = '<span class="required-mark">*</span>';
				}
				else
				{
					var required = '';
				}

				var form = '<div class="fill-input post-preview">'
				+'<div class="input-line post-que-title-input">'+rs.disp_poll_title+required+'</div>'
				+'<div class="input-line">'
				+'<table cellspacing="0" cellpadding="0" class="post-que-table dotted-border full-width">'
				+choice_preview
				+'</table>'
				+'</div>'
				+'</div>';
				
				var before = $(document.body).data('polls');
				var after = $.extend({},before,rs_json);
				$(document.body).data('polls',after);
			//console.log($(document.body).data('polls'));
			}

			// อ่าน .data ทั้งหมดออกมาจาก body
			//var before = $(document.body).data('polls');
			// รวม JSON เข้ากับ .data ทั้งหมดที่อ่านได้
			//var after = $.extend({},before,rs_json);
			// เก็บ .data คืนไปไว้ใน body	
			//$(document.body).data('polls',after);
			//console.log($(document.body).data('polls'));
			/* แสดงผลตัวที่ active */
			$(active).html(edit+caption+form);
			/* แสดงผล Required เฉพาะอันแรก*/
			displayRequired();
			
		//alert('c1');
		}
		else if(active.hasClass('product') == true)
		{
			//console.log(rs);
			$(document.body).data('product',
			{
				'raw':rs.raw,
				'disp' :rs.disp
			});
			//console.log($.data(document.body));
			if(rs.raw != '')
			{
				active.find('.post-preview').css("display","block").html('ชื่อสินค้า : '+rs.disp);
			}
			else
			{
				active.find('.post-preview').css("display","block").html('<span class="small-txt-fixed remark-txt">คุณยังไม่ได้ใส่ชื่อสินค้า <a href="javascript:void(0)" class="edit-btn">คลิกที่นี่เพื่อใส่ชื่อสินค้า</a></span>');
			}
			
		}
		if(rs.redirect != undefined && rs.redirect != '' )
		{
			var lb_media_div = '<div id="lightbox_check_login_fail" class="lightbox"></div>';
			if($('#lightbox_check_login_fail').length == 0)
			{
				$('.footer').append(lb_media_div);
			}
			
			$('#lightbox_check_login_fail').dialog({
		
			title: 'แจ้งเตือน',
			
			modal: true,
			
			resizable: false,
			draggable: false,
			close: function()
			{
				$('#lightbox_check_login_fail').remove();
			}
		}).html('<p>เกิดข้อผิดพลาดกรุณา Login ใหม่ค่ะ</p><div class="button-container"><a href="javascript:void(0);" id="chk_login" class="button normal-butt"><span><em>ตกลง</em></span></a></div>');
			$(document).on('click','#chk_login',function(){
				$('#lightbox_check_login_fail').remove();
			});
			return false;
		}
		
	}


	/*
	 * set ข้อมูล json poll เข้า .data
	 * $this คือ section ที่กด edit
	 * active คือ ตัวที่ กำลังถูก active
	 *
	 * */
	function setJsonPolls(poll_id,poll_type,active)
	{
		if(poll_type == '4')
		{
			if(($('.sesc:first').val() < $.preview.min_scldd || $('.sesc:first').val() > $.preview.max_scldd) || ($('.sesc:last').val() < $.preview.min_scudd || $('.sesc:last').val() > $.preview.max_scudd))
			{
				var select = $('#'+poll_id+'-qtdd');
				var type = poll_type;
				$.preview.ajaxrequest = false;
				msgErrorPolls(type, select);
				return false;
			}
			
			// ประกาศโครงสร้าง json ที่จะใช้งาน
			var choice_json = {};
			choice_json[poll_id] = {};
			choice_json[poll_id]['choice'] = {};
			
			/* selector คำถาม */
			var title_preview = $(active).find('.text:visible:first').val();
			/* selector จำเป็นต้องกรอก */
			var choice_required = $(active).find('.checkbox').is(':checked');
			/* selector จำนวนคำถาม */
			var question_len = $('.create-post-item.polls').length;

			/* set json ตามโครงสร้างที่ประกาศไว้ */
			choice_json[poll_id]['raw_poll_title'] = title_preview;

			choice_json[poll_id]['poll_type'] = poll_type;
			choice_json[poll_id]['choice_required'] = choice_required;
			
			choice_json[poll_id]['choice']['range_min'] = $('.sesc:first').val();
			choice_json[poll_id]['choice']['range_max'] = $('.sesc:last').val();
			choice_json[poll_id]['choice']['raw_text_min'] = $('#text_min').val();
			choice_json[poll_id]['choice']['raw_text_max'] = $('#text_max').val();
	
			choice_json['question_len'] = question_len;
			
		}
		else if(poll_type == '5')
		{
			var amount_cols = $(active).find('.column_amount').val();
			var amount_rows = $(active).find('.choice_row').length;
			if(amount_cols < $.preview.min_grid_cols || amount_cols > $.preview.max_grid_cols || amount_rows < $.preview.min_grid_rows)
			{
				var select = $('#'+poll_id+'-qtdd');
				var type = poll_type;
				$.preview.ajaxrequest = false;
				msgErrorPolls(type, select);
				return false;
			}
			// ประกาศโครงสร้าง json ที่จะใช้งาน
			var cols = [];
			var rows = [];
			var choice_json = {};
			choice_json[poll_id] = {};
			choice_json[poll_id]['choice'] = {};

			/* selector คำถาม */
			var title_preview = $(active).find('.text:visible:first').val();
			/* selector จำเป็นต้องกรอก */
			var choice_required = $(active).find('.checkbox').is(':checked');
			/* selector จำนวนคำถาม */
			var question_len = $('.create-post-item.polls').length;

			/* set json ตามโครงสร้างที่ประกาศไว้ */
			choice_json[poll_id]['raw_poll_title'] = title_preview;
			
			choice_json[poll_id]['poll_type'] = poll_type;
			choice_json[poll_id]['choice_required'] = choice_required;
			
			/* loop cols  */
			$(active).find('tr[class="title_row"] > td .text:visible').each(function(index){
				cols[index] = $(this).val();
			});
			/* loop rows  */
			$(active).find('tr[class="choice_row"] > td textarea:visible').each(function(index){
				rows[index] = $(this).val();
			});
			choice_json[poll_id]['choice']['raw_cols'] = cols;
			choice_json[poll_id]['choice']['raw_rows'] = rows;
			choice_json['question_len'] = question_len;
			
		}
		else
		{
			// เตรียม JSON สำหรับเก็บค่าที่กรอกในตัวเลือก
			var choice_json = {};
			choice_json[poll_id] = {};
			choice_json[poll_id]['choice'] = {};

			// สร้างตัวแปรสำหรับเก็บค่า title, ตรวจสอบว่า required หรือไม่, ตรวจสอบว่ามีกี่ตัวเลือก
			var title_preview = $(active).find('.text:visible:first').val();
			var choice_required = $(active).find('.checkbox').is(':checked');
			var question_len = $('.create-post-item.polls').length;
			var choice_len = $(active).find('.text:visible:not(.text:visible:first,.poll-other-text)').length;
			var choice_other = $(active).find('.text:last:visible').is('.poll-other-text');
			var	media_url = '';

			// เก็บค่าในตัวเลือก เข้าไว้ใน JSON
			$(active).find('.text:visible:not(.text:visible:first,.poll-other-text)').each(function(index){
				choice_json[poll_id]['choice'][index] = {};
				choice_json[poll_id]['choice'][index]['raw_name'] = $(this).val();

				media_url = String($(this).next().find('.post-que-media-url').attr('title'));

				if(media_url.search(/youtube\.com|youtube\.be|youtu\.be/i) != -1)
				{
					media_url = '[youtube]'+media_url+'[/youtube]';
				}
				else if(media_url.search(/vimeo\.com/i) != -1)
				{
					media_url = '[vimeo]'+media_url+'[/vimeo]';
				}
				else if(media_url.search(/slideshare\.net/i) != -1)
				{
					media_url = '[slideshare]'+media_url+'[/slideshare]';
				}
				else if(media_url.search(/scribd\.com/i) != -1)
				{
					media_url = '[scribd]'+media_url+'[/scribd]';
				}
				else if(media_url.search(/maps\.google/i) != -1)
				{
					media_url = '[googlemaps]'+media_url+'[/googlemaps]';
				}
				else if(media_url.search(/(flickr\.com)|(multiply\.com)|(ptcdn\.info)/i) != -1)
				{
					media_url = '[img]'+media_url+'[/img]';
				}

				choice_json[poll_id]['choice'][index]['media_url'] = media_url;
			});

			// เก็บค่า title, ประเภทคำถาม, จำนวนตัวเลือก, required หรือไม่ เข้าไปไว้ใน JSON
			choice_json[poll_id]['raw_poll_title'] = title_preview;
			choice_json[poll_id]['poll_type'] = poll_type;
			choice_json[poll_id]['poll_other'] = choice_other;
			choice_json['question_len'] = question_len;
			choice_json[poll_id]['choice_len'] = choice_len;
			choice_json[poll_id]['choice_required'] = choice_required;

			var poll_option = {
				div_parent: $(active),
				poll_no: poll_id,
				title_preview: title_preview,
				cur_qtype: poll_type,
				choice_other: choice_other,
				question_len: question_len,
				choice_len: choice_len,
				choice_required: choice_required,
				media_url: media_url
			};
		}
		
		// อ่าน .data ทั้งหมดออกมาจาก body
		var before = $(document.body).data('polls');
		// รวม JSON เข้ากับ .data ทั้งหมดที่อ่านได้
		var after = $.extend({},before,choice_json);
		// เก็บ .data คืนไปไว้ใน body
		$(document.body).data('polls',after);
		
	//console.log($(document.body).data('polls'));
	}

	function editSwitchPreview(options,$this)
	{
		//alert('x1');
		if(options.show_btn_preview == false )
		{
			if($this.hasClass('topic') == true)
			{
				//alert('topic');
				editNormalTopicShow(options,$this);
				$this.addClass('active');
			}
			else if($this.hasClass('detail') == true)
			{
				//alert('detail');
				editNormalDetailShow(options,$this);
				$this.addClass('active');
			}
			else if($this.hasClass('polls') == true)
			{
				//alert('sw poll');
				editNormalPollsShow(options,$this);
				$this.addClass('active');
			}
			else if($this.hasClass('product') == true)
			{ // เน€เธเธดเธ”เธเธฒเธเธเธ”เธเธธเนเธก edit
				//alert('product editSwitchPreview');
				editNormalProductShow(options,$this);
				$this.addClass('active');
			}
		}
		
	}
	
	
	
	function editNormalTopicShow(options,$this)
	{
		var value;
		/* remove alert msg */
		$('.error-txt.small-txt').remove();
		/* show title */
		$this.find('.fill-input,.step-caption').css("display","block");
		/* hide  value */
		$this.find('.post-preview').css("display","none");
		/* hide edit */
		$this.find('.edit-mark.icon.icon-editpen').css("display","none");
		/* assign value on input */
		if($.data(document.body).topic != undefined )
		{
			value = $.data(document.body).topic.raw;
		}else
		{
			value = '';
		}
		$this.find('input[type=text]').val(value).focus().end().find('.button-container').css("display","block").prepend(options.el_preview);
		options.show_btn_preview = true;
	//console.log('set btn :'+options.show_btn_preview);
	}
	
	function editNormalDetailShow(options,$this)
	{
		/* remove iframe media */
		$this.find('iframe').remove();
		/* show title */
		$this.find('.fill-input,.step-caption').css("display","block");
		/* hide  value */
		$this.find('.post-preview').css("display","none");
		/* hide edit */
		$this.find('.edit-mark.icon.icon-editpen').css("display","none");
		/* assign value on input */
		$this.find('textarea').val($.data(document.body).detail.raw).focus().end().find('.button-container').css("display","block").prepend(options.el_preview);
		options.show_btn_preview = true;
	//console.log('set btn :'+options.show_btn_preview);
	}
	
	function editNormalPollsShow(options,$this)
	{
		//console.log(options.show_btn_preview);
		options.show_btn_preview = true;
		//console.log('set btn :'+options.show_btn_preview);
		//var poll_no = $('.create-post-item.polls').index($this);
		var idSplit = $this.attr('id').split('-');
		var poll_no = idSplit[0];
		//		alert(poll_no);
		var poll = $(document.body).data('polls');
		var qtype = poll[poll_no].poll_type;		
		var choice_list = '';
		var choice_other = '<li class="add-option"><a href="javascript:void(0);" class="small-txt add-choice">+ เพิ่มตัวเลือก</a></li>';
		
		choice_list += '<ul class="post-que-option-list">';
		
		// ช่อง input และ media ต่างๆ
		var cleanBBCode = '';
			
		var cnt_li = 1;
			
		for(var cnt_choice=0; cnt_choice < poll[poll_no].choice_len; cnt_choice++)
		{   
			var str_choice = poll[poll_no].choice[cnt_choice].raw_name;
			str_choice = str_choice.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
			var option_media = '';
			var media_link = '';
			if(poll[poll_no].choice[cnt_choice].media_url != 'undefined')
			{   
				option_media = '<div class="option-media" style="display:none;">'
				+'<a title="รูปภาพ" href="javascript:void(0);" class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a>'
				+'<a title="Youtube, Vimeo, Sideshare, Scribd" href="javascript:void(0);" class="toolbar-icon"><span  class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a>'
				+'</div>'; 
				cleanBBCode = cleanBBCodeMedia(poll[poll_no].choice[cnt_choice].media_url);
				media_link = '<div class="post-que-media-wrapper small-txt">'
				+option_media 
				+'<div class="post-que-media-url" title="'+cleanBBCode+'">ลิงก์: '+cleanBBCode+'</div><a href="javascript:void(0);" class="post-que-remove-media">ลบ</a>'
				+'</div>';
			}
			else
			{  //previwe แล้วกดแก้ไข
				option_media = '<div class="option-media">'
			+'<a title="รูปภาพ" href="javascript:void(0);" class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a>'
			+'<a title="Youtube, Vimeo, Sideshare, Scribd" href="javascript:void(0);" class="toolbar-icon"><span  class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a>'
			+'</div>';
			}
				
			if(qtype == 1 || qtype == 2) // radio or checkbox
			{
				if (qtype == 1)
				{
					var select_type = 'radio';
					var className = 'one-choice';
				}
				else
				{
					var select_type = 'checkbox';
					var className = 'multi-choice';
				}
				choice_list += '<li>'
				+'<div class="option-input">'
				+'<input type="'+select_type+'" class="'+select_type+'" name="item_group:l">'
				//+'\n<input type="text" class="text remark-txt" placeholder="ตัวเลือก" name="raw_txt" value="'+poll[poll_no].choice[cnt_choice].name+'">'
				+'\n<input type="text" class="text remark-txt" placeholder="ตัวเลือก" name="raw_txt" value="'+str_choice+'">'
				+media_link
				+'</div>'
				+option_media
				+'<div class="option-remove" style="display:none">'
				+'<span class="icon icon-remove" title="ลบ"></span>'
				+'</div>'
				+'</li>';
					
				// เช็คว่ามี input เพิ่มตัวเลือกอื่นๆรึเปล่า
				if(poll[poll_no].poll_other == true)
				{
					choice_other = '<li class="add-option"><a href="javascript:void(0);" class="small-txt add-choice">+ เพิ่มตัวเลือก</a><span class="small-txt or_txt" style="display:none;">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);" class="small-txt add-other actv" style="display:none;">+ เพิ่ม "อื่นๆ โปรดระบุ"</a></li>'
					choice_other += '<li id ="oth"><div class="option-input"><input type="'+select_type+'"name="item_group:l"class="'+select_type+'">\nอื่นๆ\n<input type="text"placeholder="โปรดระบุ "class="text poll-other-text" disabled="disabled"></div><div class="option-remove" style="display:none"><span title="ลบ"class="icon icon-remove"></span></div></li>';
				}
				else
				{
					choice_other = '<li class="add-option"><a href="javascript:void(0);" class="small-txt add-choice">+ เพิ่มตัวเลือก</a><span class="small-txt or_txt">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);" class="small-txt add-other actv">+ เพิ่ม "อื่นๆ โปรดระบุ"</a></li>';
				}
			}
			else if(qtype == 3) // dropdown
			{
				choice_list += '<li>'
				+'<div class="option-input">'
				+'&nbsp;<span class="no-option" id="option_'+cnt_li+'">'+cnt_li+'</span>.&nbsp;'
				//+'\n<input type="text" class="text remark-txt" placeholder="ตัวเลือก" name="raw_txt" value="'+poll[poll_no].choice[cnt_choice].name+'">'
				+'\n<input type="text" class="text remark-txt" placeholder="ตัวเลือก" name="raw_txt" value="'+str_choice+'">'
				+'</div>'
				+'<div class="option-remove" style="display:none">'
				+'<span class="icon icon-remove" title="ลบ"></span>'
				+'</div>'
				+'</li>';
			}
			else if(qtype == 6)
			{
				choice_list += '<li>'
				+'<div class="option-input">'
				+'&nbsp;<span class="no-option" id="option_'+cnt_li+'">'+cnt_li+'</span>.&nbsp;'
				//+'\n<input type="text" class="text remark-txt" placeholder="ตัวเลือก" name="raw_txt" value="'+poll[poll_no].choice[cnt_choice].name+'">'
				+'\n<input type="text" class="text remark-txt" placeholder="ตัวเลือก" name="raw_txt" value="'+str_choice+'">'
				+media_link
				+'</div>'
				+option_media
				+'<div class="option-remove" style="display:none">'
				+'<span class="icon icon-remove" title="ลบ"></span>'
				+'</div>'
				+'</li>';
			}
					
			cnt_li++;
		}

		/* render html scale */
		if(qtype == 4)
		{
			choice_other = '';
			
			choice_other += '<table cellspacing="0" cellpadding="0" class="post-que-table"><tr><td rowspan="2">&nbsp;</td><td class="aligncenter">คะแนน</td><td rowspan="2">&nbsp;</td></tr>';
			choice_other += '<tr><td class="aligncenter small-txt"><select id="1-scldd" class="sesc"><option value="0">0</option><option value="1">1</option></select> ถึง <select id="1-scudd" class="sesc"><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td></tr>'
			choice_other += '<tr>';
			choice_other += '<td><input id="text_min" class="text remark-txt" type="text" placeholder="น้อยสุด"></td>';
			choice_other += '<td id="1-scrdctn" class="aligncenter">';
			for(var j=poll[poll_no].choice.range_min;j<=poll[poll_no].choice.range_max;j++)
			{
				choice_other += '<input type="radio" class="radio" name="1-scg">';
			}
			choice_other += '</td>';
			choice_other += '<td><input type="text" class="text remark-txt" placeholder="มากสุด" id="text_max"></td>';
			choice_other += '</tr>';
			choice_other += '</table>';
			var choice_list = '';
			choice_list += choice_other;
		}
		

		if(qtype == 5)
		{
			//console.log(poll)
			choice_other = '';
			choice_other += '<table class="post-que-table post-que-grid full-width" cellspacing="0" cellpadding="0">';
			choice_other += '<tr><td rowspan="2">&nbsp;</td><td class="aligncenter" colspan="'+poll[poll_no].choice.disp_cols.length+'">จำนวนคอลัมน์<select class="column_amount"><option>2</option><option>3</option><option>4</option><option selected="selected">5</option></select></td></tr>';
			choice_other += '<tr class="title_row">';
			for(var i=0;i<poll[poll_no].choice.disp_cols.length;i++)
			{
				choice_other += '<td><input type="text" placeholder="ชื่อคอลัมน์" class="text remark-txt" value="'+poll[poll_no].choice.disp_cols[i]+'"></td>';
			}
			choice_other += '</tr>';
			
			for(var j=0;j<poll[poll_no].choice.disp_rows.length;j++)
			{
				choice_other += '<tr class="choice_row">';
				choice_other +='<td><textarea placeholder="ชื่อแถว" class="text remark-txt">'+poll[poll_no].choice.disp_rows[j]+'</textarea></td>';
				for(var k=0;k<poll[poll_no].choice.disp_cols.length;k++)
				{
					choice_other +='<td class="aligncenter"><input class="radio" type="radio" name="scalegroup:01"></td>';
				}
					
				if(poll[poll_no].choice.disp_rows.length >= 3)
				{
					var d = '<td class="aligncenter remove-cell" style="display: table-cell;"><span class="icon icon-remove" title="ลบ"></span></td>';
				}
				else
				{
					var d ='<td class="aligncenter remove-cell"><span class="icon icon-remove" title="ลบ"></span></td>';
				}
				choice_other += d+'</tr>';
			}
			//console.log(poll[poll_no].choice.disp_rows.length);
			choice_other += '<tr><td colspan="'+(poll[poll_no].choice.disp_cols.length+1)+'"><p class="post-que-grid-addrow"><a class="small-txt" id="add_row_choice" href="javascript:void(0);">+ เพิ่มแถว</a></p></td></tr>';
			choice_other += '</table>';
			var choice_list = '';
			choice_list += choice_other;
		}
		
		if(qtype != 5 && qtype != 4)
		{
			choice_list += choice_other+'</ul>';
		}
			
		
		
		
		
		
		var str = poll[poll_no].raw_poll_title;
		str = str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
		
		//					alert(str);
		$this.html('<div class="step-caption"></div>'
			+'<div class="fill-input">'
			+'<div class="input-line post-que-title-input">'
			+'<input type="text" class="text remark-txt" placeholder="คำถาม" value="'
			+str
			+'"><a href="javascript:void(0);" class="small-txt remove-que">ลบคำถาม</a>'
			+'</div>'
			+'<div class="input-line small-txt">'
			+'ประเภทคำถาม '
			+'<select id ="'+poll_no+'-qtdd" class="small-txt qtype">'
			+'<option value="1">เลือกตอบได้ข้อเดียว</option>'
			+'<option value="2">เลือกตอบได้หลายข้อ</option>'
			+'</select>'
			+'</div>'
			+'<div class="input-line">'
			+choice_list
			+'</div>'
			+''
			+'<div id="button_polls" class="button-container">&nbsp;&nbsp;<input type="checkbox" id="required" class="checkbox" style=""><label for="required" style="">จำเป็นต้องตอบคำถามนี้</label></div>'
			+'</div>');

		/* assign data scale */
		if(qtype == 4)
		{
			/* น้อยสุด */
			$('#text_min').val(poll[poll_no].choice.raw_text_min);
			/* มากสุด */
			$('#text_max').val(poll[poll_no].choice.raw_text_max);
			/* จากคะแนน */
			$('.sesc:first').val(poll[poll_no].choice.range_min);
			/* ถึงคะแนน */
			$('.sesc:last').val(poll[poll_no].choice.range_max);
		}

		/* assign data gird */
		if(qtype == 5)
		{
			/* select option */	
			$('.column_amount').val(poll[poll_no].choice.disp_cols.length);
			//console.log(poll[poll_no].choice.disp_cols.length);
			//console.log(poll[poll_no].choice.disp_rows.length);
			if(poll[poll_no].choice.disp_rows.length == 2)
			{
				/* ซ่อน ปุ่มลบ */
				$('.remove-cell').css("visibility","hidden");
			}
		
		}

		// เช็คว่ามีการเลือก จำเป็นต้องตอบ รึเปล่า3
		if(poll[poll_no].choice_required == true )
		{
			$('#required').attr('checked', 'checked');
		}
		
		// create Preview button
		$('#button_polls').prepend(options.el_preview);
		
		// เปลี่ยนชื่อ class ของ input ที่มีค่าอยู่
		$this.find('input[type=text]').each(function(){
			if( $(this).val() != '' ){ 
				$(this).removeClass('remark-txt').addClass('unremark-txt');
			}
		});
		
		// ใส่ icon ลบ
		if($this.find('input[type=text]').not(':first').size() > 2)
		{
			$this.find('.option-remove').css('display', 'block');
		}
		
		// select ประเภทคำถาม
		$this.find('.small-txt.qtype option[value="'+poll[poll_no].poll_type+'"]').attr("selected", "selected");
		/* ไว้สำหรับแสดงปุ่ม ลบคำถาม*/
		displayBtnDelete();
		/* focus input */
		focusInput($this);
	}
	
	function editNormalProductShow(options,$this)
	{
		var value;
		/* remove alert msg */
		$('.error-txt.small-txt').remove();
		/* show title */
		console.log('product show, $this', $this);
		$this.find('.fill-input,.step-caption').css("display","block");
		/* hide  value */
		$this.find('.post-preview').css("display","none");
		/* hide edit */
		$this.find('.edit-mark.icon.icon-editpen').css("display","none");
		/* assign value on input */
		if($.data(document.body).product != undefined )
		{
			value = $.data(document.body).product.raw;
		}
		else
		{
			value = '';
		}
		$this.find('input[type=text]').val(value).focus().end().find('.button-container').css("display","block").prepend(options.el_preview);
		options.show_btn_preview = true;
	//console.log('set btn :'+options.show_btn_preview);
	}

	function check_or()
	{
		//$('.active .or_txt').hide();
		var check = $('.or_txt');
		if(check.is(':visible'))
		{
			check.hide();
				
		}
		else
		{
			check.show();
				
		}
	}
		
	function displayBtnDelete()
	{
		var count = $('.preview.polls').size();
		if(count <= 1)
		{
			$('.create-post-item.active').find('.remove-que').css("display","none");	
		}
	}
	
	function displayRequired()
	{
		//alert('jj1');
		var data = $(document.body).data();
		var id_split = 0;
		//		console.log(polls);
		$.each(data.polls,function(key,val){
			//			console.log(key);
			//			console.log(val);
			//			if(polls[poll_id] != undefined)
			//			{
			//				console.log($('#0-qwp').html());
			if(data.polls[key].choice_required == true || data.polls[key].choice_required == 'true')
			{
				$('.required-mark-label:first').css('display', 'block');
				return false;
			}
			else //if(polls[id_split[0]].choice_required == false)
			{
				$('.required-mark-label:first').css('display', 'none');
			}
		//			}
		});
	}
	
	// ตัด BBCode ออกจาก media
	function cleanBBCodeMedia(str)
	{
		var reg = /\[youtube\]|\[\/youtube\]|\[googlemaps\]|\[\/googlemaps\]|\[vimeo\]|\[\/vimeo\]|\[slideshare\]|\[\/slideshare\]|\[scribd\]|\[\/scribd\]|\[img\]|\[\/img\]/g
		return str.replace(reg,"");
	}
	
	/* ไว้เช็ค active ว่าเป็นประเภทไหนจะได้ส่งไปแบบนั้นถูก */
	function active_preview(options,$this)
	{
		//alert($this.find('.text:visible'));
		//alert($this.attr('class'));
	
		if($this.hasClass('topic') == true)
		{
			var raw_data = $.data(document.body).topic;
			//console.log($.data(document.body).topic);
			//alert('topic');
			if(!raw_data)
			{
				return true;
			}

		}
		else if($this.hasClass('detail') == true)
		{
			var raw_data = $.data(document.body).detail;
			//			console.log($.data(document.body).detail);
			//alert('detail');
			if(!raw_data)
			{
				return true;
			}
		}
		else if($this.hasClass('polls') == true)
		{
			var raw_data = $.data(document.body).polls;
			//console.log($.data(document.body).poll);
			//alert('polls');
			if(!raw_data)
			{
				return true;
			}
		}
		else if($this.hasClass('product') == true)
		{
			//alert('product');
			var raw_data = $.data(document.body).product;
			
			if(!raw_data)
			{
				return true;
			}
		}

	}
	/* firstSwitchPreview */
	function firstSwitchPreview(options,$this)
	{
		var active = $(options.active);
		//alert(active.attr('class'));
		if(active.hasClass('topic') == true)
		{
			var value = active.find('.text:visible');
			//alert(value.val());
			if($.trim(value.val()) != '')
			{//alert('xxxxxx1');
				$(document.body).data('topic',
				{
					'raw':$.trim(value.val())
				});

				$.ajax({
					dataType : 'json',
					data : {
						update: $.data(document.body).topic,
						preview_type : 'topic'
					},
					success : function(rs){
						/* hide title */
						active.find('.fill-input,.step-caption').css("display","none");
						/* assign value */
						render_edit(options,rs);
						/* show edit */
						active.find('.edit-mark.icon.icon-editpen').css("display","block");
						/* remove active & frist */
						active.removeClass('active');
						/* remove btn_preview */
						active.find('#preview_btn').remove();
						/* set button preview */
						options.show_btn_preview = false;
						//console.log($.data(document.body));
						$this.addClass('active');
						if(options.show_btn_preview == false)
						{
							$this.find('.button-container').css("display","block").prepend(options.el_preview);
							options.show_btn_preview = true;
						}
						focusInput($this);
					}
				});
			}
			else
			{
				//alert('xxxxxxxxxy');
				$.removeData(document.body,'topic');
				/* remove btn_preview */
				$(options.active).find('#preview_btn').remove();
				/* remove active & frist */
				$(options.active).removeClass('frist').removeClass('active');
				/* add active */
				$this.addClass('active');
				/* create preview_btn */
				$this.find('.button-container').css("display","block").prepend(options.el_preview);
				/* set button preview */
				options.show_btn_preview = true;
				/* focus input */
				focusInput($this);
			}
		}
		else if(active.hasClass('detail') == true)
		{
			var value = active.find('textarea');
			$(document.body).data('detail',
			{
				'raw':value.val()
			});
			$.ajax({
				dataType : 'json',
				data : {
					update: $.data(document.body).detail,
					preview_type : 'detail'
				},
				success : function(rs){
					/* hide title */
					active.find('.fill-input,.step-caption').css("display","none");
					/* assign value */
					render_edit(options,rs);
					/* show edit */
					active.find('.edit-mark.icon.icon-editpen').css("display","block");
					/* remove active & frist */
					active.removeClass('active');
					/* remove btn_preview */
					active.find('#preview_btn').remove();
					/* set button preview */
					options.show_btn_preview = false;
					//console.log($.data(document.body));
					$this.addClass('active');
					if(options.show_btn_preview == false)
					{
						$this.find('.button-container').css("display","block").prepend(options.el_preview);
						options.show_btn_preview = true;
					}
					focusInput($this);
				}
			});
		}
		else if(active.hasClass('polls') == true)
		{
			//alert('click switch poll');		
			/* set ข้อมูล json ลง .data */
			var idSplit = active.attr('id').split('-');
			var poll_id = idSplit[0];
			var poll_type = active.find('select.qtype').val();
						
			//			setJsonPolls(poll_id,poll_type,options.active);
			//console.log($.data(document.body).polls);
			if(setJsonPolls(poll_id,poll_type,options.active) !== false)
			{
				$.ajax({
					dataType : 'json',
					data : {
						update: $.data(document.body).polls[poll_id],
						preview_type : 'polls'
					},
					success : function(rs){		

						render_edit(options,rs);
						/* remove active & frist */
						active.removeClass('active');
						$('body').find(options.selector).removeClass('frist');
						/* remove btn_preview */
						$('body').find('#preview_btn').remove();
						options.show_btn_preview = false;		
						//editSwitchPreview(options,$this);
						$this.addClass('active');
						if(options.show_btn_preview == false)
						{
							$this.find('.button-container').css("display","block").prepend(options.el_preview);
							options.show_btn_preview = true;
						}
						focusInput($this);

					}
				});			
			}
			
		}
		else if(active.hasClass('product') == true)
		{
			var value = active.find('.text:visible');
			//alert(value.val());
			$(document.body).data('product',
			{
				'raw':value.val()
			});

			$.ajax({
				dataType : 'json',
				data : {
					update: $.data(document.body).product,
					preview_type : 'product'
				},
				success : function(rs){
					/* hide title */
					active.find('.fill-input,.step-caption').css("display","none");
					/* assign value */
					render_edit(options,rs);
					/* show edit */
					active.find('.edit-mark.icon.icon-editpen').css("display","block");
					/* remove active & frist */
					active.removeClass('active');
					/* remove btn_preview */
					active.find('#preview_btn').remove();
					/* set button preview */
					options.show_btn_preview = false;
					//console.log($.data(document.body));
					$this.addClass('active');
					if(options.show_btn_preview == false)
					{
						$this.find('.button-container').css("display","block").prepend(options.el_preview);
						options.show_btn_preview = true;
					}
					focusInput($this);
				}
			});
		}

	}
	// ตรวจสอบ ว่าเป็นการ preview ประเภทไหน แล้ว render ซะ
	function render_preview (options,rs)
	{
		var active = $(options.active);
		if(active.hasClass('topic') == true)
		{
			//console.log(rs);
			$(document.body).data('topic',
			{
				'raw':rs.raw,
				'disp' :rs.disp
			});
			//console.log($.data(document.body));
			active.find('.post-preview').css("display","block").html(rs.disp);
		}
		else if(active.hasClass('detail') == true)
		{
			//console.log(rs);
			$(document.body).data('detail',
			{
				'raw':rs.raw,
				'disp' :rs.disp
			});
			//console.log($.data(document.body));
			if(rs.raw != '')
			{
				active.find('.post-preview').css("display","block").html(rs.disp);
			}
			else
			{
				active.find('.post-preview').css("display","block").html('<span class="small-txt-fixed remark-txt">คุณยังไม่ได้ใส่รายละเอียด <a href="javascript:void(0)" class="edit-btn">คลิกที่นี่เพื่อใส่ข้อความ</a></span>');
			}
		}
		else if(active.hasClass('polls') == true)
		{
			alert('ไม่ใช้แล้ว');
			
		}
	}

	function wait_process (current,setting)
	{
		var opts =  $.extend({},$.fn.preview.defaults,setting);
		$(current.active).ajaxSend(function(e, xhr, setting){
			//alert(opts.url);
			//alert(setting.url);
			if(setting.url === opts.url){
				$('#preview_btn').replaceWith('<span class="loading-txt " id="preview_btn">กำลังประมวลผล โปรดรอสักครู่..</span>');
			}
		});
	}
	// ไว้ทำตามชื่อ for preview
	function focusInput($this)
	{
		if($this.hasClass('polls') == true)
		{
			$this.find("input[type=text]:first").focus();
		}
		else
		{
			$this.find("textarea").focus();
		}
	}
	
	function strCounter()
	{
		/* Counter String */
		$('#topic').jqEasyCounter({
			'maxChars': 120,
			'maxCharsWarning': 115,
			'msgFontColor': '#A09DD5',
			'msgFontFamily': 'Arial',
			'msgTextAlign': 'left',
			'msgAppendMethod': 'insertAfter'
		});

		$('#detail').jqEasyCounter({
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
		$('#counter_1').appendTo('div[class="button-container"][id="button_topic"]');
		$('#counter_2').appendTo('div[class="button-container"][id="button_detail"]');
	}


	/* preview polls ตัวแรกสุดที่ไม่ได้ active */
	function previewDummyPolls(poll_zero)
	{

		$('.preview.polls:first')
		.attr('id',poll_zero+'-qwp')
		.html('<div style="display:block;" class="edit-btn edit-mark icon icon-editpen">แก้ไข</div><div class="step-caption"><span class="required-mark-label" style="display: none;">* จำเป็นต้องตอบ</span></div><div class="fill-input post-preview"><div class="input-line post-que-title-input"></div><div class="input-line"><table cellspacing="0" cellpadding="0" class="post-que-table dotted-border full-width"><tbody><tr><td class="choice-input"><input type="radio" name="item_group:0" class="radio" id="choice_0"></td><td class="choice-label"><label for="choice_0"><br></label></td></tr><tr><td class="choice-input"><input type="radio" name="item_group:0" class="radio" id="choice_1"></td><td class="choice-label"><label for="choice_1"><br></label></td></tr></tbody></table></div></div>');

		// เตรียม JSON สำหรับเก็บค่าที่กรอกในตัวเลือก
		var choice_json = {};
		choice_json[poll_zero] = {};
		choice_json[poll_zero]['choice'] = {
			0:{
				media_url:'undefined',
				raw_name:'',
				disp_name:''
			},
			1:{
				media_url:'undefined',
				raw_name:'',
				disp_name:''
			}
		};
		// เก็บค่า title, ประเภทคำถาม, จำนวนตัวเลือก, required หรือไม่ เข้าไปไว้ใน JSON
		choice_json[poll_zero]['raw_poll_title'] = '';
		choice_json[poll_zero]['disp_poll_title'] = '';
		choice_json[poll_zero]['poll_type'] = "1";
		choice_json[poll_zero]['poll_other'] = false;
		choice_json['question_len'] = 1;
		choice_json[poll_zero]['choice_len'] = 2;
		choice_json[poll_zero]['choice_required'] = false;

		// set .data คืนไปไว้ใน body
		$(document.body).data('polls',choice_json);
	}
	
	// when change question type
	function change_type(type, $this)
	{
		switch (type)
		{
			case '1': // trans data to tmp
				change_data(type, $this);
				break;
				
			case '2': // trans data to tmp
				change_data(type, $this);
				break;
				
			case '3': // trans data to tmp
				change_data(type, $this);
				break;
				
			case '4': // scale tmp
				//alert('scale');
				change_data(type, $this);
				break;
				
			case '5': // grid tmp
				change_data(type, $this);
				break;
			case '6': // trans data to tmp
				change_data(type, $this);
				break;
			default:
				alert("default");
		}
	}
	
	function change_data(type, $this){
		// for keep input text value
		var temp = {};
		// wait question number
		//temp[0] = {};
		
		// add other false default
		temp['other'] = false;
		
		// get question no.
		var info = find_info($this);
		temp['no'] = info[0];
		
		if (type == 1 || type == 2 || type == 3 || type == 6)
		{
			temp['type'] = 'normal';
		}
		else if (type == 4)
		{
			temp['type'] = 'scale';
		}
		else if (type == 5)
		{
			temp['type'] = 'grid';
		}
		
		// show all hide other for WTF! // TODO
		$('.active .poll-other-text').show();
		
		var items = $('.active .post-que-option-list li .option-input > input:text');
		//		console.log(items);
		items.each(function(index, domEle) {		
			if($(domEle).hasClass('unremark-txt') || $(domEle).hasClass('remark-txt'))
			{
				// เปลี่ยนเครื่องหมาย " เป็น &quot; เพื่อแก้ปัญหาค่าใน "" จะได้ไม่หายไป
				var str_choice = $(domEle).val();
				str_choice = str_choice.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
				
				temp[index] = {
					//'name': $(domEle).val(),
					'name': str_choice,
					'media_url': $(domEle).next().find('.post-que-media-url').attr('title'),
					media_type : ""
				};
			}
			else if($(domEle).hasClass('poll-other-text'))
			{
				temp['other'] = true;
			}
				
		});
		
		// store curent data into .active.data();
		if(temp[0] != undefined)
		{
			$('.active').data(temp);
		}
		
		if (type == 4)
		{
			$('.active').find('div[class="input-line"]').html('<table cellspacing="0" cellpadding="0" class="post-que-table"><tbody><tr><td rowspan="2">&nbsp;</td><td class="aligncenter">คะแนน</td><td rowspan="2">&nbsp;</td></tr><tr><td class="aligncenter small-txt"><select class="sesc" id="1-scldd"><option value="0">0</option><option value="1" selected="selected">1</option></select> ถึง <select class="sesc" id="1-scudd"><option value="3">3</option><option value="4">4</option><option value="5" selected="selected">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></td></tr><tr><td><input type="text" id="text_min" placeholder="น้อยสุด" class="text remark-txt"></td><td class="aligncenter" id="1-scrdctn"><input type="radio" name="1-scg" class="radio"><input type="radio" name="1-scg" class="radio"><input type="radio" name="1-scg" class="radio"><input type="radio" name="1-scg" class="radio"><input type="radio" name="1-scg" class="radio"></td><td><input type="text"  id="text_max" placeholder="มากสุด" class="text remark-txt"></td></tr></tbody></table>');
		}
		else if(type == 5)
		{
			var div_parent = $('.active');
			var info = find_info($this);
			var number = info[0];
			var type = info[1];

 
			var edit_grid_html = 
			'<table class="post-que-table post-que-grid full-width" cellpadding="0" cellspacing="0">'
			+ '<tr>'
			+ '<td rowspan="2">&nbsp;</td>'
			+ '<td colspan="5" class="aligncenter">'
			+ 'จำนวนคอลัมน์'
			+ '<select class="column_amount" class="small-txt">'
			+ '<option>2</option>'
			+ '<option>3</option>'
			+ '<option>4</option>'
			+ '<option selected="selected">5</option>'
			+ '</select>'
			+ '</td>'
			+ '</tr>'
			+ '<tr class="title_row">'
			+ '<td>'
			+ '<input type="text" class="text remark-txt" placeholder="ชื่อคอลัมน์" />'
			+ '</td>'
			+ '<td>'
			+ '<input type="text" class="text remark-txt" placeholder="ชื่อคอลัมน์" />'
			+ '</td>'
			+ '<td>'
			+ '<input type="text" class="text remark-txt" placeholder="ชื่อคอลัมน์" />'
			+ '</td>'
			+ '<td>'
			+ '<input type="text" class="text remark-txt" placeholder="ชื่อคอลัมน์" />'
			+ '</td>'
			+ '<td>'
			+ '<input type="text" class="text remark-txt" placeholder="ชื่อคอลัมน์" />'
			+ '</td>'
			+ '</tr>'
			+ '<tr class="choice_row">'
			+ '<td><textarea placeholder="ชื่อแถว" class="text remark-txt"></textarea></td>'
			+ '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup:' + number + '1"/></td>'
			+ '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup:' + number + '1"/></td>'
			+ '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup:' + number + '1"/></td>'
			+ '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup:' + number + '1"/></td>'
			+ '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup:' + number + '1"/></td>'
			+ '<td class="aligncenter remove-cell"><span title="ลบ" class="icon icon-remove"></span></td>'
			+ '</tr>'
			+ '<tr class="choice_row">'
			+ '<td><textarea placeholder="ชื่อแถว" class="text remark-txt"></textarea></td>'
			+ '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup:' + number + '2"/></td>'
			+ '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup:' + number + '2"/></td>'
			+ '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup:' + number + '2"/></td>'
			+ '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup:' + number + '2"/></td>'
			+ '<td class="aligncenter"><input type="radio" class="radio" name="scalegroup:' + number + '2"/></td>'
			+ '<td class="aligncenter remove-cell"><span title="ลบ" class="icon icon-remove"></span></td>'
			+ '</tr>'
			+ '<tr>'
			+ '<td colspan="6"><p class="post-que-grid-addrow"><a href="javascript:void(0);" id="add_row_choice" class="small-txt">+ เพิ่มแถว</a></p></td>'
			+ '</tr>'
			+ '</table>';

			$('.active div[class="input-line"]').html(edit_grid_html);
		}
		
		// show json data
		// console.log($('.active').data());

		// send data to generate choice! 
		var new_choice = gen_choice(type, $('.active').data());
		
		// render choices
		if(temp['type'] == 'normal')
		{
			$('.create-post-item.active div[class="input-line"]').empty().html(new_choice);
		}
		//		if(type == "1" || type == "2")
		//		{
		//			choice_mark();
		//		}
		choice_mark();
		/* ซ่อน ปุ่มลบ */
		$('.remove-cell').css("visibility","hidden");
	}
	
	function gen_choice_new(type, data)
	{  
		var number = 0;
		var no = 0;
		var temp ="";
		var media ="";
		var op_media ="";
		var other = "";
		var choice = "";
		var obj = data;
		
		//		if(type == "1" || type == "2")
		//		{
		// loop each send choice data 
		jQuery.each(obj, function(key, value) {
			if(key != "no" && key != "other" && key != "type")
			{
				if(type != "1" && type != "2")
				{
					if(key > 1)
					{
						return false;
					}
				}
				
				if(value.media_url != null)
				{
					if(type != "3")
					{
						media = '<div class="post-que-media-wrapper small-txt"><div class="post-que-media-url"title="'+value.media_url+'">ลิงก์: '+value.media_url+'</div><a href="javascript:void(0);" class="post-que-remove-media">ลบ</a></div>';
						op_media ='';
					}
					else
					{
						media = '<div class="post-que-media-wrapper small-txt" style="display: none;"><div class="post-que-media-url"title="'+value.media_url+'">ลิงก์: '+value.media_url+'</div><a href="javascript:void(0);" class="post-que-remove-media">ลบ</a></div>';
						op_media ='';
					}
				}
				// don't have media
				else
				{
					media = '';
					op_media = '<div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div>';
				}
						
				if(type == "1")
				{
					temp = '<input type="radio" class="radio" name="item_group:'+no+'">';
					choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="'+value.name+'">'+media+'</div>'+op_media+'<div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
							
				}
				else if (type == "2")
				{
					temp = '<input type="checkbox" class="checkbox" name="item_group:'+no+'">';
					choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="'+value.name+'">'+media+'</div>'+op_media+'<div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
				}
				else if (type == "3")
				{
					number++;
					temp = '&nbsp;<span class="no-option" id="option_'+number+'">'+number+'</span>.&nbsp;';
					choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="'+value.name+'"></div><div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
				}
				else if (type == "6")
				{
					number++;
					temp = '&nbsp;<span class="no-option" id="option_'+number+'">'+number+'</span>.&nbsp;';
					choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="'+value.name+'">'+media+'</div>'+op_media+'<div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
				}
				
			// gen new choice
			//choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="'+value.name+'">'+media+'</div>'+op_media+'<div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
			}
			else if(key == "no")
			{
				no = value.no;
			}
			
			else if(key == "other")
			{
				if ((value == false) && (type == "3" || type == "6")) // for hide
				{
					other ='<li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt"></li>';
				}
				else if ((value == true) && (type == "3" || type == "6")) // for hide
				{
					other ='<li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt"></li><li id="oth"style="display: none;"><div class="option-input">'+temp+'อื่นๆ\n<input type="text"placeholder="โปรดระบุ "class="text poll-other-text"></div><div class="option-remove"><span title="ลบ"class="icon icon-remove"></span></div></li>';
				}
				else if (value)
				{
					if(type == "1")
					{
						temp = '<input class="radio" type="radio" name="item_group:0">';
					}
					else if(type == "2")
					{
						temp = '<input class="checkbox" type="checkbox" name="item_group:0">';
					}
					// have other
					other ='<li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt or_txt" style="display: none;">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);"class="small-txt add-other actv" style="display: none;">+เพิ่ม"อื่นๆ โปรดระบุ"</a></li><li id="oth"><div class="option-input">'+temp+'อื่นๆ\n<input type="text"placeholder="โปรดระบุ "class="text poll-other-text"></div><div class="option-remove"><span title="ลบ"class="icon icon-remove"></span></div></li>';
				}
				else
				{
					// not have other
					other ='<li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt or_txt">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);"class="small-txt add-other actv">+เพิ่ม"อื่นๆ โปรดระบุ"</a></li>';
				}
			}
			
		});
		
		
		var all_choice = '<ul class="post-que-option-list">'+choice+other+'</ul>';
		return all_choice;
	}
	
	function gen_choice(type, data)
	{  
		var number = 0;
		var no = 0;
		var temp ="";
		var media ="";
		var op_media ="";
		var other = "";
		var choice = "";
		var obj = data;
		

		
		// loop each send choice data 
		jQuery.each(obj, function(key, value) {
			if(key != "no" && key != "other" && key != "type")
			{
				if(value.media_url != null)
				{
					if(type != "3")
					{
						media = '<div class="post-que-media-wrapper small-txt"><div class="post-que-media-url"title="'+value.media_url+'">ลิงก์: '+value.media_url+'</div><a href="javascript:void(0);" class="post-que-remove-media">ลบ</a></div>';
						op_media ='';
					}
					else
					{
						media = '<div class="post-que-media-wrapper small-txt" style="display: none;"><div class="post-que-media-url"title="'+value.media_url+'">ลิงก์: '+value.media_url+'</div><a href="javascript:void(0);" class="post-que-remove-media">ลบ</a></div>';
						op_media ='';
					}
				}
				// don't have media
				else
				{
					media = '';
					op_media = '<div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div>';
				}
						
				if(type == "1")
				{
					temp = '<input type="radio" class="radio" name="item_group:'+no+'">';
					choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="'+value.name+'">'+media+'</div>'+op_media+'<div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
							
				}
				else if (type == "2")
				{
					temp = '<input type="checkbox" class="checkbox" name="item_group:'+no+'">';
					choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="'+value.name+'">'+media+'</div>'+op_media+'<div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
				}
				else if (type == "3")
				{
					number++;
					temp = '&nbsp;<span class="no-option" id="option_'+number+'">'+number+'</span>.&nbsp;';
					choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="'+value.name+'"></div><div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
				}
				else if (type == "6")
				{
					number++;
					temp = '&nbsp;<span class="no-option" id="option_'+number+'">'+number+'</span>.&nbsp;';
					choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="'+value.name+'">'+media+'</div>'+op_media+'<div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
				}
				
			// gen new choice
			//choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="'+value.name+'">'+media+'</div>'+op_media+'<div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
			}
			else if(key == "no")
			{
				no = value.no;
			}
			
			else if(key == "other")
			{
				if ((value == false) && (type == "3" || type == "6")) // for hide
				{
					other ='<li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt"></li>';
				}
				else if ((value == true) && (type == "3" || type == "6")) // for hide
				{
					other ='<li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt"></li><li id="oth"style="display: none;"><div class="option-input">'+temp+'อื่นๆ\n<input type="text"placeholder="โปรดระบุ "class="text poll-other-text"></div><div class="option-remove"><span title="ลบ"class="icon icon-remove"></span></div></li>';
				}
				else if (value)
				{
					if(type == "1")
					{
						temp = '<input class="radio" type="radio" name="item_group:0">';
					}
					else if(type == "2")
					{
						temp = '<input class="checkbox" type="checkbox" name="item_group:0">';
					}
					// have other
					other ='<li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt or_txt" style="display: none;">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);"class="small-txt add-other actv" style="display: none;">+เพิ่ม"อื่นๆ โปรดระบุ"</a></li><li id="oth"><div class="option-input">'+temp+'อื่นๆ\n<input type="text"placeholder="โปรดระบุ "class="text poll-other-text"></div><div class="option-remove"><span title="ลบ"class="icon icon-remove"></span></div></li>';
				}
				else
				{
					// not have other
					other ='<li class="add-option"><a href="javascript:void(0);"class="small-txt add-choice">+เพิ่มตัวเลือก</a><span class="small-txt or_txt">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);"class="small-txt add-other actv">+เพิ่ม"อื่นๆ โปรดระบุ"</a></li>';
				}
			}
		});
		
		if(number == 1 && (type == 3 || type == 6))
		{
			if (type == "3")
			{
				number++;
				temp = '&nbsp;<span class="no-option" id="option_'+number+'">'+number+'</span>.&nbsp;';
				choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value =""></div><div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
			}
			else if (type == "6")
			{
				number++;
				temp = '&nbsp;<span class="no-option" id="option_'+number+'">'+number+'</span>.&nbsp;';
				choice += '<li><div class="option-input">'+temp+'\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt" value ="">'+media+'</div>'+op_media+'<div class="option-remove"style="display: none; "><span class="icon icon-remove"title="ลบ"></span></div></li>';
			}
		}
		var all_choice = '<ul class="post-que-option-list">'+choice+other+'</ul>';
		return all_choice;
	//console.log(choice+other);
	}
	
	// count choice for display x signal
	function choice_mark()
	{
		// find x selector
		//var point = $this.parents('ul').find('.option-remove');
		var item = $('.option-remove');
		//alert(point.size());
		// count choice option-input
		//		var count = item.size();
		var count = item.parent('li:visible').size();

		if(count > 2)
		{
			item.show();
		}
		else
		{
			item.hide();
		}
	}
	
	// remove choice func
	function remove_choice($this)
	{
		var obj = $this.parents('ul');
		// remove item
		$this.parents('li').remove();
		
		// run new number
		$.each(obj.find('.no-option'), function(i, value) {
			var num = i+1;
			$(this).attr('id', 'option_'+num).html(num);
		});
		
		if($this.parents('li#oth').size())
		{
			$('.add-other').show();
			check_or();
		}

		// calc remark it
		choice_mark();
		
		var temp = {};
		// wait question number
		//temp[0] = {};
		
		// add other false default
		temp['other'] = false;
		
		var obj_qtype = obj.parents('.fill-input').find('.qtype');
		var type = obj_qtype.val();
		
		// get question no.
		var info = find_info(obj_qtype);
		temp['no'] = info[0];
		
		if (type != 4 || type != 5)
		{
			temp['type'] = 'normal';
		
			// show all hide other for WTF! // TODO
			//			$('.active .poll-other-text').show();

			var items = obj.parents('.fill-input').find('li input[type="text"]').not('.add-option');
			items.each(function(index, domEle) {		
				if($(domEle).hasClass('unremark-txt') || $(domEle).hasClass('remark-txt'))
				{
					// เปลี่ยนเครื่องหมาย " เป็น &quot; เพื่อแก้ปัญหาค่าใน "" จะได้ไม่หายไป
					var str_choice = $(domEle).val();
					str_choice = str_choice.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

					temp[index] = {
						//'name': $(domEle).val(),
						'name': str_choice,
						'media_url': $(domEle).next().find('.post-que-media-url').attr('title'),
						media_type : ""
					};
				}
				else if($(domEle).hasClass('poll-other-text'))
				{
					temp['other'] = true;
				}

			});

			// store curent data into .active.data();
			if(temp[0] != undefined)
			{
				$('.active').removeData();
				$('.active').data(temp);
			}
		}
	}
	
	// add other func
	function add_other($this)
	{
		//var selected = $this.parents('.create-post-item.post-desc-wrapper.poll').find('.qtype option:selected').val();
		//alert(selected);
		var info = find_info($this);
		var number = info[0];
		var type = info[1];

		var chk = $('li#oth').size();
		if( chk == 0)
		{	
			if(type == "1")
			{
				var other = '<li id ="oth"><div class="option-input"><input type="radio"name="item_group:'+number+'"class="radio">\nอื่นๆ\n<input type="text"placeholder="โปรดระบุ "class="text poll-other-text" disabled="disabled"></div><div class="option-remove"><span title="ลบ"class="icon icon-remove"></span></div></li>';
			}
			else if(type == "2")
			{
				var other = '<li id ="oth"><div class="option-input"><input type="checkbox"name="item_group:'+number+'"class="checkbox">\nอื่นๆ\n<input type="text"placeholder="โปรดระบุ "class="text poll-other-text" disabled="disabled"></div><div class="option-remove"><span title="ลบ"class="icon icon-remove"></span></div></li>';
			}
			
			$this.parent().after(other);
			$this.hide();
			choice_mark();
			check_or();
		}
	}
	
	function add_choice($this)
	{
		var info = find_info($this);
		var number = info[0];
		var type = info[1];
		var temp ="";
		// count choice and pluse 1
		//		var count = $('.active .option-input').size();
		var count = $('.active .option-input').parent('li').not('#oth').size();
		// count choice and pluse 1
		
		// set max choice to 8 for test
		if($('.active .option-input').size()< 20)
		{
			count++;
			if(type == "1")
			{
				// single
				temp ='<li><div class="option-input"><input type="radio"class="radio"name="item_group:'+number+'">\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li>';
			}
			else if(type == "2")
			{
				// multiple
				temp ='<li><div class="option-input"><input type="checkbox"class="checkbox"name="item_group:'+number+'">\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style="display:none"><span class="icon icon-remove"title="ลบ"></span></div></li>';
			}
			else if(type == "3")
			{
				// list
				temp ='<li><div class="option-input">&nbsp;<span class="no-option" id="option_'+count+'">'+count+'</span>.&nbsp;\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"value=""></div><div class="option-remove"style=""><span class="icon icon-remove"title="ลบ"></span></div></li>';
			}
			else if(type == "6")
			{
				//return false;
				temp ='<li><div class="option-input">&nbsp;<span class="no-option" id="option_'+count+'">'+count+'</span>.&nbsp;\n<input type="text"class="text remark-txt"placeholder="ตัวเลือก"name="raw_txt"value=""></div><div class="option-media"><a title="รูปภาพ"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a><a title="Youtube, Vimeo, Sideshare, Scribd"href="javascript:void(0);"class="toolbar-icon"><span class="icon-toolbar icon-video icon-media-tool-lightbox"></span></a></div><div class="option-remove"style=""><span class="icon icon-remove"title="ลบ"></span></div></li>';
			}
		}
		else
		{
			//alert("choice cann't be more than 20!");
			max_choice_notify();
		}
		// then inset a new choice by each type
		$this.parent().before(temp);
		// focus on inputtext new choice
		$this.parent('li').prev().find('.text.remark-txt').focus().val('');
		choice_mark();
	//$this.insertBefore($this.find('li.add-option'));
	}
	
	function find_id($this)
	{
		var id = $this.parents('.create-post-item.post-desc-wrapper.polls').attr('id');
	}
	
	function find_info($this)
	{
		var arr =[];
		var id = $this.parents('.create-post-item.post-desc-wrapper.polls').attr('id');
		var tmp = id.split('-');
		if(tmp.length > 1)
		{
			var number = tmp[0];
			var change = tmp[1];
		}
		if(change == 'qwp')
		{
			var type = $('#'+number+'-qtdd option:selected').val();
			arr[0] = number;
			arr[1] = type;
		}
		else
		{
			return false;
		}
		return arr;
	}
	
	//======================================//
	
	/*
	 * function สร้างคำถามโหวตแบบ "กล่องรายชื่อ"
	 */
	/*$.preview.dropdownChoice = function (){
		// เพิ่มตัวเลือก
		$(document).on('click', '.add-choice', function(){
			addChoice($(this).parents('.create-post-item.post-desc-wrapper.poll'));
		});

		// ลบตัวเลือก
		$(document).on('click', '.option-remove', function(){
			//remove_option($(this));
			alert("yeddamoN!");
		});
	};*/

	
	/*
	 *	function การเพิ่มตัวเลือก
	 */
	function addChoice(parent)
	{   
		// ตัวแปร selected เป็นตัวแปรที่เช็คว่าเป็นตัวเลือกประเภทอะไร เช่น radio, checkbox, dropdown
		var selected = parent.find('.qtype option:selected').index();
		// ตัวแปร cnt_input เป็นตัวแปรของตัวเลือกที่เท่าไร
		var cnt_input = parent.find('.text:visible:not(:first, .text.poll-other-text)').size()+1;
		
		switch(selected)
		{  
			case(0):	//ตอบได้ 1 ข้อ
				$('<li class="one-choice'+cnt_input+'">'
					+'<div class="option-input">'
					+'<input type="radio" class="radio" name="item_group:l">\n'
					+'<input type="text" class="text remark-txt" placeholder="ตัวเลือก" name="raw_txt">'
					+'</div>'
					+'<div class="option-media">'
					+'<a title="รูปภาพ" href="javascript:void(0);" class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a>'
					+'<a title="Youtube, Vimeo, Sideshare, Scribd" href="javascript:void(0);" class="toolbar-icon"><span  class="icon-toolbar icon-video"></span></a>'
					+'</div>'
					+'<div class="option-remove" style="display:none">'
					+'<span class="icon icon-remove" title="ลบ"></span>'
					+'</div>'
					+'</li>')
				.insertBefore(parent.find('li.add-option'));
				parent.find('.text.remark-txt:last').focus().val(''); // สั่ง focus() ที่ input ล่าสุด
				add_icon_remove(parent); // เพิ่มรูปลบ (x)
				break;
			case(1):	//ตอบได้หลายข้อ
				$('<li class="multi-choice'+cnt_input+'">'
					+'<div class="option-input">'
					+'<input type="checkbox" class="checkbox" name="item_group:l">\n'
					+'<input type="text" class="text remark-txt" placeholder="ตัวเลือก" name="raw_txt">'
					+'</div>'
					+'<div class="option-media">'
					+'<a title="รูปภาพ" href="javascript:void(0);" class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a>'
					+'<a title="Youtube, Vimeo, Sideshare, Scribd" href="javascript:void(0);" class="toolbar-icon"><span  class="icon-toolbar icon-video"></span></a>'
					+'</div>'
					+'<div class="option-remove" style="display:none">'
					+'<span class="icon icon-remove" title="ลบ"></span>'
					+'</div>'
					+'</li>')
				.insertBefore(parent.find('li.add-option'));
				parent.find('.text.remark-txt:last').focus().val('');  // สั่ง focus() ที่ input ล่าสุด
				add_icon_remove(parent); // เพิ่มรูปลบ (x)
				break;
			case(2): //กล่องข้อความ
				$('<li class="dropdown-choice'+cnt_input+'">'
					+'<div class="option-input">'
					+'<span class="cnt-dropdown"></span> <input type="text" class="text remark-txt" placeholder="ตัวเลือก" name="raw_txt">'
					+'</div>'
					+'<div class="option-remove" style="display:none">'
					+'<span class="icon icon-remove" title="ลบ"></span>'
					+'</div>'
					+'</li>')
				.insertBefore(parent.find('li.add-option'));
				parent.find('.text.remark-txt:last').focus().val('');  // สั่ง focus() ที่ input ล่าสุด
				add_icon_remove(parent); // เพิ่มรูปลบ (x)
				break;
			case(5): //จัดอันดับ
				$('<li class="dropdown-choice'+cnt_input+'">'
					+'<div class="option-input">'
					+'<span class="cnt-dropdown"></span> <input type="text" class="text remark-txt" placeholder="ตัวเลือก" name="raw_txt">'
					+'</div>'
					+'<div class="option-media">'
					+'<a title="รูปภาพ" href="javascript:void(0);" class="toolbar-icon"><span class="icon-toolbar icon-photo ch-img-gal"></span></a>'
					+'<a title="Youtube, Vimeo, Sideshare, Scribd" href="javascript:void(0);" class="toolbar-icon"><span  class="icon-toolbar icon-video"></span></a>'
					+'</div>'
					+'<div class="option-remove" style="display:none">'
					+'<span class="icon icon-remove" title="ลบ"></span>'
					+'</div>'
					+'</li>')
				.insertBefore(parent.find('li.add-option'));
				parent.find('.text.remark-txt:last').focus().val('');  // สั่ง focus() ที่ input ล่าสุด
				add_icon_remove(parent); // เพิ่มรูปลบ (x)
				break;
		}
	}

	/*
	 * function ลบแถว li นั้นๆ
	 */
	function remove_option(li)
	{
		var parent = li.parents('.create-post-item.post-desc-wrapper.poll');

		// input ของ li แถว other
		// เช็คแถว li ที่กดลบ ว่ามีอยู่จริง / ถ้าลบแล้วจะเพิ่มข้อความ "เพิ่ม อื่นๆ โปรดระบุ" ขึ้นมากด้วย
		if(li.parent().find('.remove-other').length > 0)
		{
			parent.find('.add-option')
			.html('<a href="javascript:void(0);" class="small-txt add-choice">+ เพิ่มตัวเลือก</a><span class="small-txt or_txt">&nbsp;หรือ&nbsp;</span><a href="javascript:void(0);" class="small-txt add-other">+ เพิ่ม "อื่นๆ โปรดระบุ"</a>');
			parent.find('.other_choice').css('display', 'none');
		}
		else // input ของ li แถวนั้น เช็คแถว li ที่กดลบ ว่ามีอยู่จริง
		{
			li.parent().remove();
		}

		add_icon_remove(parent); // เพิ่มรูปลบ (x)
	}

	// function Add other question (เพิ่ม input ของ li อื่นๆโปรดระบุ)
	// ou modify 2/12/2011 18.00
	function add_other_option(div_parent)
	{
		var $this = div_parent;
		var chk = $('li#oth').size();
		if( chk == 0)
		{
			var other = '<li id ="oth"><div class="option-input"><input type="radio"name="item_group:l"class="radio">\nอื่นๆ\n<input type="text"placeholder="โปรดระบุ "class="text poll-other-text"></div><div class="option-remove"><span title="ลบ"class="icon icon-remove"></span></div></li>';
			$this.parent().after(other);
			$this.hide();
			choice_mark($this);
			
		}
			
	//var div = div_parent.parents('.create-post-item.post-desc-wrapper.poll');
	/*var other_parent = div_parent.parents('.post-que-option-list');

		other_parent.find('.other_choice').css('display', '');
		other_parent.find('.add-option').html('<a href="javascript:void(0);" class="small-txt add-choice">+ เพิ่มตัวเลือก</a>');
		 */
	//add_icon_remove(div); // เพิ่มรูปลบ (x)
	}
	
	function max_choice_notify()
	{
		$('div:last').after('<div id="system-notify"></div>');
		var $dialog = $('#system-notify')
		.html('<p>เพื่ม "ตัวเลือกคำตอบ" ได้ไม่เกิน 20 ตัวเลือก</p><div class="button-container"><a href="javascript:void(0);" class="button normal-butt close_lightbox"><span><em>ปิดหน้าต่างนี้</em></span></a></div>')
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
	
	// count choice for display x signal
	// นับจำนวน choice เพื่อดโชวหรือซ่อน์ icon ลบ (x)
	/*
	 * function เช็คจำนวน li input ให้มีอย่างน้อย 2 แถว [จะไม่มี "รูปลบ (x)"]
	 *    ถ้ามี li input มากกว่า 2 แถวจะมี "รูปลบ (x)" ต่อท้าย input แต่ละอัน
	 */
	function add_icon_remove(div)
	{
		// ตัวแปร selected เป็นตัวแปรที่เช็คว่าเป็นตัวเลือกประเภทอะไร เช่น radio, checkbox, dropdown
		var selected = div.find('.qtype option:selected').index();
		// ตัวแปร ul เป็นตัวแปร ที่ไม่ได้เป็น มี style=display:none และไม่มี class=add-option
		var ul = div.find('li:visible').not('.add-option');
		// ตัวแปร cnt_size เป็นตัวแปรที่ใช้นับจำนวน li
		var cnt_size = ul.size(); // จำนวน li
		var i = 0;

		// ถ้า li > 2 ให้มี "รูปลบ (x)"
		if (cnt_size > 2)
		{
			ul.find('.option-remove').css('display','block');
		}
		else // ถ้ามี li น้อยกว่าเท่ากับ 2 จะไม่มี "รูปลบ (x)"
		{
			ul.find('.option-remove').css('display','none');
		}

		// ถ้าเลือกคำถามแบบ "กล่องรายชื่อ" ต้องเรียงลำดับตัวเลขด้านหน้าช่อง input
		if(selected == 2 || selected == 5)
		{
			div.find('.text:visible:not(:first)').each(function(){
				i++;
				$(this).siblings('.cnt-dropdown').text(i+'. ');
			});
		}
	}
	
	/*
	 * แสดง alert error polls
	 */
	function msgErrorPolls(type, select)
	{
		alert('รู้นะคิดอะไรอยู่!!!');
		change_type(type,select);
		return false;
	}
	/*
	 * End function By Pla
	 */

	var del_Q = function(){
		
		var idSplit = $('.active').attr('id').split('-');
		var poll_id = idSplit[0];

		/* remove section question */
		$('#'+poll_id+'-qwp').remove();
		//$('.preview.polls:first').find('.required-mark-label').css('display', 'block');
		/* set button preview */
		$.preview.ObjectSet({
			show_btn_preview:false
		})
		/* delete json */
		//console.log($.data(document.body).polls);
		delete $.data(document.body).polls[poll_id];
		var q = $.data(document.body).polls.question_len-1;
		/* จำนวน คำถามที่ตั้ง poll ต้องมีอย่างน้อย 1 คำถามเสมอ */
		if(q <= 0)
		{
			q = 1;
		}
		var value = $.extend({},$.data(document.body).polls,{
			question_len:q
		});
		$(document.body).data('polls',value);
		/* แสดงผล Required เฉพาะอันแรก*/
		displayRequired();
	//console.log($.data(document.body).polls);
	}

	
	/* Defaults Function */
	$.fn.preview.defaults = {
		type_topic : 'topic',
		url : null,
		selector : '.create-post-item',
		active : '.create-post-item.active',
		edit_class : '.edit-btn',
		edit_enable : '.edit-enable',
		edit_disable : '.edit-disable',
		show_btn_preview : true,
		el_preview : "<a class='button normal-butt' href='javascript:void(0);' id='preview_btn'><span><em>Preview</em></span></a>",
		preview_btn :  '#preview_btn',
		ajaxrequest : false,
		url_save :null,
		form_save : null,
		btn_save : '#btn_save',
		min_scldd : 0,
		min_scudd : 3,
		max_scldd : 1,
		max_scudd : 10,
		min_grid_cols : 2,
		max_grid_cols : 5,
		min_grid_rows : 2
	};
	
})(jQuery);


