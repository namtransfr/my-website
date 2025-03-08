$.fn.passwordStrength = function( options ){
			return this.each(function(){
				var that = this;that.opts = {};
				that.opts = $.extend({}, $.fn.passwordStrength.defaults, options);

				that.div = $(that.opts.targetDiv);
				that.defaultClass = that.div.attr('class');

				that.percents = (that.opts.classes.length) ? 100 / that.opts.classes.length : 100;

				v = $(this)
				.keyup(function(e){
					if( typeof el == "undefined")
					{
						this.el = $(this);
					}
					if(this.value.length >= 6)
					{
						var t = getPasswordStrength (this.value);
							this.div
							.removeAttr('class')
							.addClass( this.defaultClass )
							.addClass( this.opts.classes[ t ] );							
					}
					else
					{
						this.div.removeAttr('class');						
					}
				});

			});

			function getPasswordStrength(H){
				var nc	=	0;	// Non character
				var ch	=	0;	// character
				var num	=	0;	// numeric
				var result		=	-1;
				var nc_check	=	/\W/;
				var ch_check	=	/[A-z]/;
				var num_check	=	/[0-9]/;
				if(H.length < 8)
				{
					if(nc_check.test(H))
					{
						result++;
					}
					if(num_check.test(H))
					{
						result++;
					}
					if( ch_check.test(H))
					{
						result++;
					}
					if(result >1) result = 1;
					return result;

				}
				else if(H.length >= 8)
				{
					result = 0;
					if( ch_check.test(H))
					{
						result = 1;
					}
					if(num_check.test(H) && nc_check.test(H))
					{
						result = 2;
					}
					else if(nc_check.test(H) || num_check.test(H))
					{						
						result++;
						if(result == 2) result = 1;
					}
					
					if(result > 2) result = 2

					return result;
				}

				/*
				var F=H.replace(/[0-9]/g,""); // จำนวนตัวเลขอย่างน้อย 3  ตัว
				var G=(H.length-F.length);				
				if(G>3){G=3}
				var B=H.replace(/[A-z]/g,""); // ตัวอักษรภาษาอังกฤษ
				var I=(H.length-B.length);
				if(I>3){I=3}
				var A=H.replace(/\W/g,""); // จำรวน non character ไม่เกิน 3 ตัว
				var C=(H.length-A.length);				
				if(C>3){C=3}
				
				//var E=(D*10)+(G*10)+(C*10)+(I*10);
				var E=(G*10)+(C*10)+(I*10);
				if(E<0){E=0}
				if(E>100){E=100}
				return E
				*/
			}

			// Removed generate password function
		};
