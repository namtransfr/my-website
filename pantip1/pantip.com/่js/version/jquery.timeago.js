/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.10.0
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2011, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
(function($) {
	$.timeago = function(timestamp) {	  	  
		if (timestamp instanceof Date) {				
			return inWords(timestamp);
		} else if (typeof timestamp === "string") {				
			return inWords($.timeago.parse(timestamp));
		} else {				
			return inWords($.timeago.datetime(timestamp));
		}
	};
	var $t = $.timeago;
	var $server_time = '';
	var $this_data;
	var stime;
	var $this_body;
	var $this;
	var i = 0;
	var t;
	$.extend($.timeago, {
		settings: {
			refreshMillis: 60000,
			allowFuture: false,
			strings: {      
				suffixFromNow: "from now",
				seconds: "%time วินาทีที่แล้ว",
				minute: "1 นาทีที่แล้ว",
				minutes: "%time นาทีที่แล้ว",
				hour: "1 ชั่วโมงที่แล้ว",
				hours: "%time ชั่วโมงที่แล้ว",
				day: "1 วันที่แล้ว",
				days: "%time วันที่แล้ว",
				month: "1 เดือนที่แล้ว",
				months: "%time เดือนที่แล้ว",
				year: "1 ปีที่แล้ว",
				years: "%time ปีที่แล้ว",
				yesterday_th: "เมื่อวานนี้ เวลา %time น.",
				day_after_yesterday : "%th_day เวลา %time น.",		
				day_after_fourday : "%day %month เวลา %time น.",
				fullyear_th : "%day %month %year เวลา %time น.",
				thaiweek :	["วันอาทิตย์","วันจันทร์","วันอังคาร","วันพุธ","วันพฤหัส","วันศุกร์","วันเสาร์"],
				thaimonth:	["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],
				numbers: []
			}	
		},
		inWords: function(distanceMillis) {
			
			var $l = this.settings.strings;     
			var $t = $.timeago.settings;		  
			var seconds = Math.abs(distanceMillis) / 1000;
			var minutes = Math.floor(seconds / 60);
			var hours = Math.floor(minutes / 60);
			var days = Math.floor(hours / 24);
			var years = days / 365;
	  
			function substitute(stringOrFunction, number) {		  		  
				var string =  stringOrFunction;				
				var value = number ;	
				// Tong edit
				var time_replace = string.replace(/%time/i, value)
				.replace(/%th_day/i, $l.thaiweek[$this_data.data('el_time').day_at_moment])
				.replace(/%day/i, $this_data.data('el_time').date_at_moment)
				.replace(/%year/i, ($this_data.data('el_time').year_at_moment+543))
				.replace(/%month/i, $l.thaimonth[$this_data.data('el_time').month_at_moment]);
				
				return time_replace;
			}
	  
			function moment_time()
			{
				return fill_zero($this_data.data('el_time').hour_at_moment) + ':' + fill_zero( $this_data.data('el_time').minute_at_moment);
			}
	  
			function fill_zero(str_time)
			{	  		 
				var result;		  
				if(str_time.toString().length == 0)
				{
					result = '00';
				}
				else if(str_time.toString().length < 2)
				{			  
					result = '0' + str_time;			
				}
				else
				{
					result = str_time;
				}				  
				return result;		  
			}
	  
			function day_diff()
			{	
				//var result = new Date().getTime() -  $t.getTime_at_moment;
				var result = new Date($server_time).getDate() -   $this_data.data('el_time').date_at_moment;
				//result = result/1000/60/60/24;		  		  
							
				if(result < 0)
				{
					result = 5;
				}
				return (result);
			}
	  
			function year_diff()
			{
				return (new Date($server_time).getFullYear() -  $this_data.data('el_time').year_at_moment);
			}
			
			function month_diff()
			{
				
				return (new Date($server_time).getMonth() - $this_data.data('el_time').month_at_moment);
			}
			
			//console.log(distanceMillis , seconds , minutes , hours , days, years);
			
			
			var day_dif = day_diff();			
			var year_dif = year_diff();	
			var month_dif = month_diff();
			var words
			
			if(year_dif == 0 && month_dif == 0)
			{
				words = seconds < 60 && substitute($l.seconds, Math.round(seconds)) ||
				seconds < 90 && substitute($l.minute, 1) ||
				minutes < 60 && substitute($l.minutes, Math.round(minutes)) ||
				minutes < 90 && substitute($l.hour, 1) ||
				hours < 24 && substitute($l.hours, Math.round(hours));
			}
			
			if(hours >= 24)
			{	
				words = (day_dif == 1 && month_dif == 0 && year_dif == 0) && substitute($l.yesterday_th, moment_time()) ||			
				(day_dif < 4 && month_dif == 0 && year_dif == 0) && substitute($l.day_after_yesterday, moment_time()) ||      
				(day_dif >= 4 && year_dif == 0) && substitute($l.day_after_fourday, moment_time()) ||      
				year_dif > 0 && substitute($l.fullyear_th, moment_time())
			}
			// ป้องกันเวลาที่เกินเวลาปัจจุบันไปแล้ว
			if(words == false || !words)
			{
				words = substitute($l.fullyear_th, moment_time());				
			}
			
			return $.trim(words);
		},
		parse: function(iso8601) {		
		
			var s = $.trim(iso8601);
			s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
			s = s.replace(/-/,"/").replace(/-/,"/");
			s = s.replace(/T/," ").replace(/Z/," UTC");
			s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400	
	 
	  
			return new Date(s);
		},
		datetime: function(elem) {		
			// jQuery's `is()` doesn't play well with HTML5 in IE
		
			var isTime = $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
			var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("data-utime");
			return $t.parse(iso8601);
		}
	});

	$.fn.timeago = function() {	  
		var self = this;
		$this_body = $('body');

		$.ajax({
			type: "GET",
			async: false,			
			url : '/timeago/get_time',
			success : function(date_js_format)
			{				
				$server_time = date_js_format;
				stime = new Date($server_time).getTime();
				$this_body.data('servertime',stime);
				//console.log($server_time, $this_body.data('servertime'));
				
				self.each(getTime);
				clearInterval(t);
			}
		});

//		self.each(refresh);
		
		var $s = $t.settings;
		if ($s.refreshMillis > 0) {						
			t = setInterval(function() {self.each(refresh)}, $s.refreshMillis);      
		}
		return self;
	};
	
	function getTime()
	{
		$this = $(this);
		$this.removeData('servertime');
		$this_data	=	  $(this).data('el_time',{
			minute_at_moment : '',
			hour_at_moment : '',
			day_at_moment : '',
			date_at_moment : '',
			year_at_moment : '',
			getTime_at_moment: ''
		});
		
		
		var data = prepareData(this);	
		if (!isNaN(data.datetime)) {		
			$(this).text(inWords(data.datetime));
		}
		
		return this;
	}

	
	function refresh() {			
		
		$this = $(this);
	
//		if(!$this.data('servertime'))
//		{
//			stime = $this_body.data('servertime');
//		}
//		else
//		{
//			stime = $this.data('servertime') + parseInt($t.settings.refreshMillis);
//		}
		
		if(!$this.data('servertime'))
		{
			$this.data('servertime', $this_body.data('servertime'));
		}
		stime = $this.data('servertime') + parseInt($t.settings.refreshMillis);
		//console.log(stime);
		$this.data('servertime',stime);
		
		$this_data	=	  $(this).data('el_time',{
			minute_at_moment : '',
			hour_at_moment : '',
			day_at_moment : '',
			date_at_moment : '',
			year_at_moment : '',
			getTime_at_moment: ''
		});
		
		
		var data = prepareData(this);					
		if (!isNaN(data.datetime)) {		
			$(this).text(inWords(data.datetime));
		}
	
		return this;
	}

	function prepareData(element) {	  
	
		element = $(element);		
		if (!element.data("timeago")) {		
			element.data("timeago", {
				datetime: $t.datetime(element)
			});	 
			var text = $.trim(element.text());
			if (text.length > 0) {		  
				element.attr("data-utime", text);
			}
		}	
		return element.data("timeago");
	}

	function inWords(date)
	{
		return $t.inWords(distance(date));	
	}

	function distance(date) {   	  
	
		var moment = date;	  
		
		$this_data.data('el_time').minute_at_moment = moment.getMinutes();
		$this_data.data('el_time').hour_at_moment = moment.getHours();
		$this_data.data('el_time').day_at_moment = moment.getDay();
		$this_data.data('el_time').date_at_moment = moment.getDate();
		$this_data.data('el_time').month_at_moment = moment.getMonth();
		$this_data.data('el_time').year_at_moment = moment.getFullYear();
		$this_data.data('el_time').getTime_at_moment = moment.getTime();
	  
		
		return (stime - moment.getTime());
	}

	// fix for IE6 suckage
	document.createElement("abbr");
	document.createElement("time");
}(jQuery));