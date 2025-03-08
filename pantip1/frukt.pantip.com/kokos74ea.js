//var base_url = "http://frukt.devpantip.com/";
var base_url = "https://frukt.pantip.com/";
											 
/*document.write('<script src="'+ base_url +'bluebird.min.js" type="text/javascript"></script>');
document.write('<script src="'+ base_url +'fetch.js" type="text/javascript"></script>');*/
var jsapp = 'kokos';
var kokosApi = base_url + jsapp + '/page/';
var kokosApiRd = base_url +'kokos/rd_page_random/';
var dispScriptUrl = base_url + jsapp + '/display/';
var hitUrl = base_url + jsapp + '/hit/';
var slotUrl = base_url + jsapp + '/position_slot/';

//var kokosApiCt = base_url +'kokos3/rd_page_random/';
var kokosApiCt = base_url +'kokos/rd_page_random_5min/';
//var kokosApiCtTest = base_url +'kokos3/rd_page_random_test/';

var atime = [1000];

//var troom = ['greenzone', 'home'];
//var troom = ['all_room'];
//var troom = ['blueplanet', 'chalermthai', 'greenzone', 'jatujak', 'cartoon'];
var troom = ['all_room', 'greenzone', 'isolate'];
var troom2 = ['korea', 'rajdumnern'];

var meatball_start = 20230925;
var meatball_start2 = 20231003;

var mb_all_room = true;
var mb_all_room_date = 20231030;
var mb_room = [
	['greenzone', 'isolate'], 
	['korea', 'rajdumnern'],
];
var mb_date = [
	20230925, 
	20231003, 
];

var arr_position = ["1104-0", "1104-1", "1104-2", "1105-0", "1105-1", "1105-2", "1108-0", "1108-1", "1108-2", "1205-0"];

var arr_pos_null = [];

var loaded = false;

create_count_css();

function check_meatball(sel_room, exp_page)
{
	var res = [];
	var room = exp_page;
	var room_sel = sel_room;
	res['is_meatball'] = false;
	res['date_mb'] = 0;
	
	//console.log(mb_all_room);
	if(mb_all_room == false)
	{
		if(room_sel == 'home' && exp_page[1] == 'home')
		{
			room_sel = ['pantip-home'];//หน้าแรก
		}
		
		for(var i=0; i<mb_room.length; i++)
		{
			if(inArray_haystack(room_sel, mb_room[i]) == true)
			{
				res['is_meatball'] = true;
				res['date_mb'] = mb_date[i];
				break;
			}
		}
	}
	
	if(mb_all_room == true)
	{
		if(room_sel == 'home' && exp_page[1] == 'home')
		{
			room_sel = ['pantip-home'];//หน้าแรก
		}
		
		for(var i=0; i<mb_room.length; i++)
		{
			if(inArray_haystack(room_sel, mb_room[i]) == true)
			{
				res['is_meatball'] = true;
				res['date_mb'] = mb_date[i];
				break;
			}
		}
		
		res['is_meatball'] = true;
		if(res['date_mb'] == 0)
		{
			res['date_mb'] = mb_all_room_date;
		}
		
	}
	return res;
}

function create_count_css()
{
    var el = document.getElementsByTagName("body");

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'a.bingsu-counting { float: left;color: #7e79ad;padding: 0px 5px;margin: 0 2px;text-decoration: none;border: #3c3a62 solid 1px;cursor:pointer;line-height: 1.3;} .bingsu-counting.selected{background: #7b77aa;color: #eee;border-radius: 4px;display: inline-flex;margin-left: 4px;}';
    document.getElementsByTagName('head')[0].appendChild(style);
}

/* ---- 0 ---- */
function kokosMaker(page)
{
    var date = new Date();
    var timestamp = date.getTime();
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();
    m = m+1;
    if(m < 10) { m = "0" + m; }
    if(d < 10) { d = "0" + d; }
    var fulldate = y.toString()+m.toString()+d.toString();
	var urlApi = kokosApi;

    /*var length = troom.length;
    var str = page.split(":");
    var key = str.length-1;
    for(var i = 0; i < length; i++) {
        if(troom[i] == str[key]) 
        {
            urlApi = kokosApiRd;
        }
    }*/
	var str = page.split(":");
	var key = str.length-1;
	
	var res_check_mb = check_meatball(str[key], str);
	
	//console.log(res_check_mb);
	
	var is_mb = false;
	if(res_check_mb['is_meatball'] == true  && fulldate >= res_check_mb['date_mb'])
	{
		is_mb = true;
		urlApi = kokosApiCt;
	}
	//console.log(urlApi);
	
	/*var length_troom = troom.length;
	if(length_troom > 0)
	{
		
		if(troom[0] == 'all_room')
		{
			//urlApi = kokosApiRd;
			urlApi = kokosApiCt;
		}
		else
		{
			var is_mb = false;
			if(inArray_haystack(str[key], troom) == true  && fulldate >= meatball_start)
			{
				is_mb = true;
			}
			else if(inArray_haystack(str[key], troom2) == true  && fulldate >= meatball_start2)
			{
				is_mb = true;
			}
			//console.log(is_mb, fulldate, meatball_start2);
			if(is_mb == true)
			{
				//urlApi = kokosApiRd;
				if(str[key] == 'home' && str[1] == 'home')
				{
					urlApi = kokosApi;
				}
				else
				{
					urlApi = kokosApiCt;
				}
				
			}
		}
	}*/

	
	//console.log(urlApi);

    /*if(fulldate >= meatball_start)
    {
        urlApi = kokosApiRd;
    }*/
	
    fetch(urlApi + page + '?t=' + timestamp, {cache: "no-cache",
        headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
       }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        //for(var i=0; i<atime.length; i++)
        //{
            var data = JSON.stringify(myJson);
            var cpm_banner = new Array();
            var slot_banner = new Array();
            var cnt_cpm = 0;
            var cnt_slot = 0;

            if (typeof(data) === 'string')
            {
                var obj = JSON.parse(data);
				/*console.log(obj);
                console.log(typeof(obj));return false;*/
                if (typeof(obj) === 'object')
                {
                    for (var i=0; i<obj.length; i++) {

                        if (obj[i]['type'] === 'slot')
                        {
                            slot_banner[cnt_slot] = obj[i];
                            cnt_slot = cnt_slot+1;
                        }
                        else{
                            cpm_banner[cnt_cpm] = obj[i];
                            cnt_cpm = cnt_cpm+1;
                        }
                    }
                }
            }
            genKokos(JSON.stringify(cpm_banner), false, page);

			setTimeout(function(){ 
				genKokos(JSON.stringify(slot_banner), false, page);
                slidePage();
			}, 1000);
        //}
    });
}

function kokosTabMaker(page)
{
    var date = new Date();
    var timestamp = date.getTime();
	var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();
    m = m+1;
    if(m < 10) { m = "0" + m; }
    if(d < 10) { d = "0" + d; }
    var fulldate = y.toString()+m.toString()+d.toString();
    var urlApi = kokosApi;
	
	var str = page.split(":");
    var key = str.length-1;
	var res_check_mb = check_meatball(str[key], str);
	
	//console.log(res_check_mb);
	
	var is_mb = false;
	if(res_check_mb['is_meatball'] == true  && fulldate >= res_check_mb['date_mb'])
	{
		is_mb = true;
		urlApi = kokosApiCt;
	}
	
	//console.log(urlApi);
	
	/*var length = troom.length;
    var str = page.split(":");
    var key = str.length-1;
	for(var i = 0; i < length; i++) {
        if(troom[i] == str[key]) 
        {
            urlApi = kokosApiRd;
        }
    }*/
	
	/*var length_troom = troom.length;
	if(length_troom > 0)
	{
		var str = page.split(":");
		var key = str.length-1;
		if(troom[0] == 'all_room')
		{
			//urlApi = kokosApiRd;
			urlApi = kokosApiCt;
		}
		else
		{
			var is_mb = false;
			if(inArray_haystack(str[key], troom) == true  && fulldate >= meatball_start)
			{
				is_mb = true;
			}
			else if(inArray_haystack(str[key], troom2) == true  && fulldate >= meatball_start2)
			{
				is_mb = true;
			}
			//console.log(is_mb, fulldate, meatball_start2);
			if(is_mb == true)
			{
				//urlApi = kokosApiRd;
				if(str[key] == 'home' && str[1] == 'home')
				{
					urlApi = kokosApi;
				}
				else
				{
					urlApi = kokosApiCt;
				}
			}
		}
	}*/
	
	if(str[key] == 'cartoon')
	{
		//urlApi = kokosApiCt;
		//urlApi = kokosApiCtTest;
	}
	//console.log(urlApi);
	
	/*if(fulldate >= meatball_start)
    {
        urlApi = kokosApiRd;
    }*/
	
    fetch(urlApi + page + '/tab?t=' + timestamp, {cache: "no-cache",
        headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
       }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        //for(var i=0; i<atime.length; i++)
        //{
            var data = JSON.stringify(myJson);
            var cpm_banner = new Array();
            var slot_banner = new Array();
            var cnt_cpm = 0;
            var cnt_slot = 0;
            if (typeof(data) === 'string')
            {
                var obj = JSON.parse(data);
				//console.log(obj);//return false;
                //console.log(typeof(obj));
                if (typeof(obj) === 'object')
                {
                    for (var i=0; i<obj.length; i++) {

                        if (obj[i]['type'] === 'slot')
                        {
                            slot_banner[cnt_slot] = obj[i];
                            cnt_slot = cnt_slot+1;
                        }
                        else{
                            cpm_banner[cnt_cpm] = obj[i];
                            cnt_cpm = cnt_cpm+1;
                        }
                    }
                }
            }
            genKokos(JSON.stringify(cpm_banner), true, page);
			
			setTimeout(function(){ 
				genKokos(JSON.stringify(slot_banner), false, page);
                slidePage();
			}, 1000);
        //}
    });
}

function genKokos(json_string, is_tab, page){
	var split_page = page.split(":");
	var chk_is_tab = is_tab;
//console.log(json_string);
    if (typeof(json_string) === 'string')
    {
        var obj = JSON.parse(json_string);
        //console.log(obj);return false;
        if (typeof(obj) === 'object')
        {
            for (var i=0; i<obj.length; i++) {
                // if(obj[i]['position'] == "pantip:forum:pantip:1103"){
                //     console.log(obj[i]['type']);return false;
                // }

                //console.log(obj[i]['position']);
                is_tab = chk_is_tab;
                if (obj[i]['type'] === 'slot')
                {
                    //console.log(obj[i]['position']);
                    var items = obj[i]['items'];
                    
					//console.log(items);
                    var tmp_arr = [];
					
					var pos = obj[i]['position'].split(":");

                    // if(obj[i]['position'] == "pantip:forum:pantip:1103"){
                    //     console.log(items);return false;
                    // }
                    for(var j=0; j<items.length; j++)
                    {
                        tmp_arr.push(j);
                    }
                    if(pos[3] != 1205 && pos[3] != 1201){
                        tmp_arr = shuffle(tmp_arr);
                    }
		   
                    //tmp_arr = shuffle(tmp_arr);

                    var t_arr=[];
                    var data_arr = [];
                    
                    if(tmp_arr.length > 0){
                        for(var ta=0; ta<tmp_arr.length; ta++)
                        {
                            // if(obj[i]['position'] == "pantip:forum:pantip:1103"){
                            //     console.log(items[tmp_arr[ta]]['bingsu_id']);return false;
                            // }
                            // console.log(obj[i]['position']);
                            // console.log(ta);
                            t_arr[ta] = items[tmp_arr[ta]]['bingsu_id'];
                            //console.log(t_arr[ta]);
                            items[tmp_arr[ta]]['position'] = obj[i]['position'];
                            items[tmp_arr[ta]]['type'] = obj[i]['type'];
                            data_arr[ta] = items[tmp_arr[ta]];
                            // if(obj[i]['position'] == "pantip:forum:pantip:1104"){
                            //     console.log("1104", data_arr);
                            // }

                            //displayKokos(is_tab, data_arr[ta], obj[i]['position'] + "-" + tmp_arr[ta], tmp_arr.length, t_arr);
                            // if(obj[i]['position'] == "pantip:forum:pantip:1103"){
                            //     console.log("a", obj[i]['position'], data_arr[ta]);
                            //     displayKokos(is_tab, data_arr[ta], obj[i]['position'] + "-" + tmp_arr[ta], tmp_arr.length, t_arr);
                            //     // displayKokos(is_tab, data_arr[tmp_arr[ta]], obj[i]['position'] + "-" + tmp_arr[ta], tmp_arr.length, t_arr);
                            // }
                        }
                    }
                    else
                    {
                        
                        t_arr = items['bingsu_id'];
                        items['position'] = obj[i]['position'];
                        items['type'] = obj[i]['type'];
                        data_arr = items;

                        // if(obj[i]['position'] == "pantip:forum:pantip:1101"){
                        //     console.log(data_arr);return false;
                        // }
						//console.log(items['bingsu_id'], is_tab);
                        
                        displayKokos(page, is_tab, data_arr, obj[i]['position'], tmp_arr.length, t_arr);
                    }
                    
                    /*console.log(items);*/
					var pos = obj[i]['position'].split(":");
                    //if(pos[0] == "mpantip" && pos[3] == 1103){
                    if(split_page[0] == "mpantip" && pos[3] == 1103){
                        var pos_name = obj[i]['position'];
                        data_arr['position'] = pos_name;
                        data_arr['type'] = obj[i]['type'];
                        displayKokos(page, is_tab, data_arr, pos_name, tmp_arr.length, t_arr);
                    }
                    else if((pos[3] >= 1003 && pos[3] <= 1005) || pos[3] == 1201 || pos[3] == 1205){
                        // var pos_name = obj[i]['position'] + '-0';
                        var pos_name = obj[i]['position'];
                        data_arr['position'] = obj[i]['position'];
                        data_arr['type'] = obj[i]['type'];
                        data_arr['max_slot'] = obj[i]['slot_option']['random'];
                        data_arr['items'] = obj[i]['items'];
                        displayKokos(page, is_tab, data_arr, pos_name, tmp_arr.length, t_arr);
                    }
                    else
                    {
                        var old = "";
                        if(tmp_arr.length > 0){
							var check_is_tab = false;
                            for(var j=0; j<tmp_arr.length; j++)
                            {
                                //console.log(j, t_arr[j]);
                                var pos_name = '';
                                if(pos[3] == 1205){
                                    pos_name = obj[i]['position'];
                                } else {
                                    pos_name = obj[i]['position'] + "-" + j;
                                }
                                
                                var position = pos[3] + "-" + j;
                                
								//console.log(inArray(position));
								if(old == obj[i]['position'] && inArray(position))
								{
									//console.log(position);

									is_tab = true;
								}
								else
								{
									is_tab = false;
								}
                                //check_is_tab = true; 
                                displayKokos(page, is_tab, data_arr[j], pos_name, tmp_arr.length, t_arr);
								old = obj[i]['position'];
                            }
                        }
                    }
                    
                    
                }
                /*else if (obj[i]['type'] === 'vcpm')
                {
                    displayBingsu(obj[i], obj[i]['position']);
                    eyeonBingsu(obj[i]['bingsu_id']);
                }*/
                else
                {
					var obj_pos = obj[i]['position'];
                    displayKokos(page, is_tab, obj[i], obj[i]['position']);
					//setTimeout(function() {displayKokos(page, is_tab, obj[i], obj_pos)}, 200);
                }
            }
        }
    }
}

function displayKokos(page, is_tab, obj, position, cnt_slot, t_arr){
    //console.log(position);
    //var split_pos = position.split(":");
	var st_view = false;
    //console.log(typeof position);

    //console.log(position);
	
	var split_page = page.split(":");
    
    //console.log(position);
    id_pos = 0;
    if(obj['position'] != undefined){
        var pos = obj['position'].split(":");
        id_pos = pos[pos.length-1];
    }
    //console.log(id_pos, pos[0], obj, position);
    try {
        //console.log(position+ 'x');
        if(obj['type'] == 'slot') {
            if(split_page[0] == "mpantip")
			{
				if(document.getElementById(position) == null){
					//console.log(position);
					if(split_page[0] == 'mpantip')
					{
						position = position.substring(1);
						//console.log(position.substring(1));
					}
					else if(split_page[0] == 'pantip')
					{
						position = 'm'+position;
						//console.log('m'+position);
					}
				}
			}

/*if(document.getElementById(position) == null)
{
	console.log(position, document.getElementById(position));
}*/


            if(document.getElementById(position) != null){
                if (document.getElementById(position).innerHTML.trim() === '')
                {
					st_view = true;
                    if(id_pos == "1103" && pos[0] == "mpantip"){

                        var key = 0;
                        var now = new Date().getTime();
                        //var amount = obj['items'].length;
                        var amount = 4;
                        var mod = now%amount;
                        if(mod == 0){
                            key = amount-1;
                        }
                        else {
                            key = mod-1;
                        }
                        //console.log("mod: " + key);//return false;

                        if(obj[key] != undefined){
                            // document.getElementById(position).style.width = obj[0]['size']['width'].toString() + 'px';
                            // document.getElementById(position).style.height = obj[0]['size']['height'].toString() + 'px';
                            // document.getElementById(position).style.maxWidth = obj[0]['size']['width'].toString() + 'px';
                            // document.getElementById(position).style.maxHeight = obj[0]['size']['height'].toString + 'px';
                            if(obj[key]['source']['type_file'] != "Script"){
                                document.getElementById(position).innerHTML = obj[key]['html'];
                            }
                            else{
                                var scrt = obj[key]['html'];
								scrt_check = scrt.replace(/<div class="ads_box_type1 m-b-20">/g, "");
								scrt_check = scrt_check.replace(/(\r\n|\n|\r)/gmi,"");
								var n = scrt_check.search(/^<(script|ins|iframe)/igm);
								//console.log(position);
								
								var check_mobile = position.search(/^mpantip/ig);
								var is_mobile = '';
								var cls_toggle = "pt-md-toggle-show";
								if(check_mobile >= 0){
									is_mobile = '/mobile';
									cls_toggle = "pt-md-toggle-hide";
								}
				
								st_view = false;
								//document.getElementById(position).innerHTML = obj['items'][0]['html'];
								document.getElementById(position).innerHTML = '<iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj[key]['bingsu_id']+is_mobile+'" width="100%" height="286" frameborder="0" class="ads_box_type1 m-b-20"  style="padding: 8px;overflow:hidden;" title="ads"></iframe>';

								
								
								/*if(n >= 0){
									//console.log(obj['items'][0]['bingsu_id']);
									var check_mobile = position.search(/^mpantip/ig);
									var is_mobile = '';
									if(check_mobile >= 0){
										is_mobile = '/mobile';
									}
									//document.getElementById(position).innerHTML = obj['items'][0]['html'];
									document.getElementById(position).innerHTML = '<iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj[key]['bingsu_id']+is_mobile+'" width="100%" height="286" frameborder="0" class="ads_box_type1 m-b-20"  style="padding: 8px;overflow:hidden;" title="ads"></iframe>';
								}
								else
								{
									iframe_scrt(position, scrt, '100%', 286);
								}*/
                                //iframe_scrt(position, scrt, '100%', 286);
                            }
							if(obj[key]['html'] != "" && st_view == true){
								view_stat(page, is_tab, obj[key]['bingsu_id']);
							}
                            
                        }
                    }
                    else if((id_pos >= 1003 && id_pos <= 1005) || id_pos == 1201 || id_pos == 1205)
                    {
                        //console.log(obj['max_slot'], obj['items'].length, "ree");return false;
                        var key = 0;
                        var now = new Date().getTime();
                        //var amount = obj['items'].length;
                        var amount = obj['max_slot'];

                        if(id_pos >= 1003 && id_pos <= 1005){
                            if(obj['max_slot'] > obj['items'].length){
                                amount = obj['items'].length;
                            }
                        }
                        

                        var mod = now%amount;

                        if(mod == 0){
                            key = amount-1;
                        }
                        else {
                            key = mod-1;
                        }

                        if(obj[key] != undefined){
                            // document.getElementById(position).style.width = obj[0]['size']['width'].toString() + 'px';
                            // document.getElementById(position).style.height = obj[0]['size']['height'].toString() + 'px';
                            // document.getElementById(position).style.maxWidth = obj[0]['size']['width'].toString() + 'px';
                            // document.getElementById(position).style.maxHeight = obj[0]['size']['height'].toString + 'px';
                            document.getElementById(position).classList.add("pt-list-item");
                            if(obj[key]['source']['type_file'] != "Script"){
                                document.getElementById(position).innerHTML = obj[key]['html'];
                            }
                            else{
                                var scrt = obj[key]['html'];
                                var new_height = obj[0]['size']['height']+36;
								
								var new_height = obj[0]['size']['height']+36;
								
								scrt_check = scrt.replace(/<div class="ads_box_type1 m-b-20">/g, "");
								scrt_check = scrt_check.replace(/(\r\n|\n|\r)/gmi,"");
								var n = scrt_check.search(/^<(script|ins|iframe)/igm);
								//console.log(position);
								
								st_view = false;
								var check_mobile = position.search(/^mpantip/ig);
								var is_mobile = '';
								var cls_toggle = "pt-md-toggle-show";
								if(check_mobile >= 0){
									is_mobile = '/mobile';
									cls_toggle = "pt-md-toggle-hide";
								}
								var cls_ad_box_ifrm = 'class="ads_box_iframe"';
								if(id_pos == 1004)
								{
									cls_ad_box_ifrm = '';
								}
								//document.getElementById(position).innerHTML = obj['items'][0]['html'];
								document.getElementById(position).innerHTML = '<iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj[key]['bingsu_id']+is_mobile+'" width="100%" height="'+new_height+'" frameborder="0" class="ads_box_type1 m-b-20"  style="padding: 8px;overflow:hidden;" title="ads"></iframe>';
								
								
								/*if(n >= 0){
									//console.log(obj['items'][0]['bingsu_id']);
									var check_mobile = position.search(/^mpantip/ig);
									var is_mobile = '';
									if(check_mobile >= 0){
										is_mobile = '/mobile';
									}
									//document.getElementById(position).innerHTML = obj['items'][0]['html'];
									document.getElementById(position).innerHTML = '<iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj[key]['bingsu_id']+is_mobile+'" width="100%" height="'+new_height+'" frameborder="0" class="ads_box_type1 m-b-20"  style="padding: 8px;overflow:hidden;" title="ads"></iframe>';
								}
								else
								{
									iframe_scrt(position, scrt, '100%', new_height);
								}*/
								
                                //iframe_scrt(position, scrt, '100%', new_height);
                            }
							if(obj[key]['html'] != "" && st_view == true && id_pos != 1201){
								view_stat(page, is_tab, obj[key]['bingsu_id']);
							}
                            
                        }
                    }
                    else
                    {
                        // document.getElementById(position).style.width = obj['size']['width'].toString() + 'px';
                        // document.getElementById(position).style.height = obj['size']['height'].toString() + 'px';
                        // document.getElementById(position).style.maxWidth = obj['size']['width'].toString() + 'px';
                        // document.getElementById(position).style.maxHeight = obj['size']['height'].toString + 'px';
                        //if (obj['html'].match(/<script/gi))

                        if(obj['source']['type_file'] == "Script")
                        {
                            //console.log("sc", obj['bingsu_id'], obj['size']['width']);
                            /*document.getElementById(position).innerHTML = "<iframe src='"
                                + dispScriptUrl + obj['bingsu_id']
                                + "' width='" + obj['size']['width']
                                + "' height='" + obj['size']['height']
                                + "' FRAMEBORDER='0' SCROLLING='NO' title='ads'></iframe>";*/
								var scrt = obj['html'];
							
								scrt_check = scrt.replace(/<div class="ads_box_type1 m-b-20">/g, "");
								scrt_check = scrt_check.replace(/(\r\n|\n|\r)/gmi,"");
								var n = scrt_check.search(/^<(script|ins|iframe)/igm);
								//console.log(position);
								
								st_view = false;
								var check_mobile = position.search(/^mpantip/ig);
								var is_mobile = '';
								if(check_mobile >= 0){
									is_mobile = '/mobile';
								}
									//document.getElementById(position).innerHTML = obj['items'][0]['html'];
									document.getElementById(position).innerHTML = '<iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj['bingsu_id']+is_mobile+'" width="100%" height="282" frameborder="0" class="ads_box_type1 m-b-20"  style="padding: 8px;overflow:hidden;" title="ads"></iframe>';
							
								
								
								/*if(n >= 0){
									//console.log(obj['items'][0]['bingsu_id']);
									var check_mobile = position.search(/^mpantip/ig);
									var is_mobile = '';
									if(check_mobile >= 0){
										is_mobile = '/mobile';
									}
									//document.getElementById(position).innerHTML = obj['items'][0]['html'];
									document.getElementById(position).innerHTML = '<iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj['bingsu_id']+is_mobile+'" width="100%" height="282" frameborder="0" class="ads_box_type1 m-b-20"  style="padding: 8px;overflow:hidden;" title="ads"></iframe>';
								}
								else
								{
									iframe_scrt(position, scrt, '100%', 282);
								}*/
								
								
								
								//iframe_scrt(position, scrt, '100%', 282);
                        }
                        else
                        {
							
                            if(inArray(position) == true){
                                var old_element = document.getElementById(position);
                                var pos = position.split("-");
                                //console.log(pos);
                                
                                var str = pos[0].split(":");
                                var key = str.length-1;

                                var add_cls = "";
                                if(str[key] == "1108"){
                                    add_cls = "";
                                }
                                else{
                                    add_cls = " pt-list-item__ad-card-view";
                                }

                                // get the parent
                                var parent = old_element.parentNode;

                                var new_element = document.createElement('li');

                                if(pos[pos.length-1] == 0){
                                    //new_element.style.display = 'none';
                                    new_element.className = 'pt-list-item ad-slot' + add_cls;
                                    //view_stat(is_tab, obj['bingsu_id']);
                        //console.log(obj['bingsu_id'], position);
                                }
                                else
                                {
                                    new_element.className = 'pt-list-item ad-slot' + add_cls;
                                    new_element.style.display = 'none';
                                }
                                new_element.id = position;
                                obj['html'] = obj['html'] + '<div class="pt-list-item__stats" style="justify-content: center;">';


                                if(cnt_slot > 1){
                                    for(var i=1; i<=cnt_slot; i++){
                                        var selected = "";
                                        if(i == 1){
                                            selected = " selected";
                                        }
                                        //console.log(t_arr, i, t_arr[i-1], "xx");
                                        obj['html'] = obj['html'] + '<a class="bingsu-counting clk-slot '+ pos[0] + selected +'" data-posads="'+ pos[0] +'" data-bingid="'+t_arr[i-1]+'"><span>'+ i +'</span></a>';
                                        //console.log(t_arr[i-1], "yy");
                                    }
                                }


                                obj['html'] = obj['html'] + '</div>';

                                new_element.innerHTML = stripAndExecuteScript(obj['html']);

                                // replace child of the parent
                                parent.replaceChild(new_element, old_element);

                                document.getElementById(position).innerHTML = stripAndExecuteScript(obj['html']);
                            }
                            else{
                                //console.log("nsc", obj['bingsu_id']);
                                document.getElementById(position).innerHTML = stripAndExecuteScript(obj['html']);
                            }
                        }
						
						if(obj['html'] != ""  && st_view == true)
						{
							view_stat(page, is_tab, obj['bingsu_id']);
						}
						
                    }


                    
                }
            }
        }
        else {
            // CPM
            //console.log("cpm" + obj['items'][0]['bingsu_id'], is_tab);
			//return false;
			//console.log(document.getElementById(position), position);
            if(document.getElementById(position) != null){				
			//console.log(document.getElementById(position));
				if (document.getElementById(position).innerHTML.trim() === '')
                {
					if(obj['items'][0]['source']['type_file'] != "Script"){
						//console.log(position, obj['items'][0]['html']);
						var arr_pos = obj['position'].split(":");
						//console.log(arr_pos[2]);
						
						var length_troom = troom.length;
						if(length_troom > 0)
						{
							if(troom[0] == 'all_room')
							{
								st_view = true;
							}
							else
							{
								if(inArray_haystack(arr_pos[2], troom) == false)
								{
									//st_view = false;
									st_view = true;
								}
							}
						}

						if(is_tab === false)
						{
							document.getElementById(position).innerHTML = obj['items'][0]['html'];

						}

					}
					else{
						var scrt = obj['items'][0]['html'];
						scrt_check = scrt.replace(/<div class="ads_box_type1 m-b-20">/g, "");
						scrt_check = scrt_check.replace(/(\r\n|\n|\r)/gmi,"");
						var n = scrt_check.search(/^<(script|ins|iframe)/igm);
						//console.log(n);
						
						st_view = false;
						var check_mobile = position.search(/^mpantip/ig);
						var is_mobile = '';
						var cls_toggle = "pt-md-toggle-show";
						if(check_mobile >= 0){
							is_mobile = '/mobile';
						}
						if(check_mobile >= 0){
							is_mobile = '/mobile';
							cls_toggle = "pt-md-toggle-hide";
						}
						
						//document.getElementById(position).innerHTML = obj['items'][0]['html'];
						//document.getElementById(position).innerHTML = '<iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj['items'][0]['bingsu_id']+is_mobile+'" width="100%" height="288" frameborder="0" class="ads_box_type1 m-b-20 ads_box_iframe"  style="padding: 8px;overflow:hidden;" title="ads"></iframe>';
						
						/*var ifm_width = "970";
						var ifm_height = "265";
						if(check_mobile >= 0){
							ifm_width="100%";
							ifm_height = "288";
						}*/
						//console.log(check_mobile);
						//document.getElementById(position).innerHTML = '<div class="ads_box_type1 ads_with_iframe m-b-20 pt-md-toggle-show"><iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj['items'][0]['bingsu_id']+is_mobile+'" width="100%" height="265" frameborder="0" class="ads_box_iframe" title="ads"></iframe></div>'; 
				
						if(is_tab === false)
						{
							var height_ifrm = 265;
							if(obj['items'][0]['size_banner'] != undefined)
							{
								height_ifrm = obj['items'][0]['size_banner']['height']+10;
							}
							if(check_mobile >= 0){
								document.getElementById(position).innerHTML = '<div class=" '+cls_toggle+'"><iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj['items'][0]['bingsu_id']+is_mobile+'" width="100%" height="'+ height_ifrm +'" frameborder="0" title="ads" ></iframe></div>'; 
								//document.getElementById(position).innerHTML = '<div class="ads_box_type1 m-b-20 '+cls_toggle+'"><iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj['items'][0]['bingsu_id']+is_mobile+'" width="100%" height="'+ height_ifrm +'" frameborder="0" title="ads" ></iframe></div>'; 
							}
							else
							{
								document.getElementById(position).innerHTML = '<div class="ads_box_type1 ads_with_iframe m-b-20 '+cls_toggle+'"><iframe src="'+base_url+jsapp+'/show_ifrm_app/'+obj['items'][0]['bingsu_id']+is_mobile+'" width="100%" height="'+ height_ifrm +'" frameborder="0" class="ads_box_iframe" title="ads"></iframe></div>'; 
							}
						}
						
					}
					if(obj['items'][0]['html'] != ""  && st_view == true){
                        if(obj['nor_rem'] != undefined)
                        {
                            page = page + ':' + obj['nor_rem'];
                        }
						
						//console.log(page); return false;
						if(pos[0] == "mpantip"){
							if(is_tab === false)
							{
                                if(obj['items'][0]['source']['type_file'] != "Script")
                                {
                                    view_stat(page, is_tab, obj['items'][0]['bingsu_id']);
                                }
								
							}
							//console.log(obj['items'][0]['bingsu_id']);
						}
						else{
							//console.log(is_tab, obj['items'][0]['bingsu_id']);
							if(is_tab === false)
							{
								//view_stat(page, false, obj['items'][0]['bingsu_id']);
                                if(obj['items'][0]['source']['type_file'] != "Script")
                                {
								    view_stat(page, is_tab, obj['items'][0]['bingsu_id']);
                                }
								
								//console.log(obj['items'][0]['bingsu_id']);
							}
						}
						
						
					}
				}
            }
			
        }
    } 
    catch(err) {
        //console.log('Missing '+ position + ' / '+ err);
    }

}




/* ---- 1 ---- */

function view_stat(page, is_tab, aid){
//console.log(is_tab, aid);
	//console.log(loaded);
    if(aid == 2389)
    {
        //console.log(aid, is_tab);
    }
	loaded = true;

	if(is_tab === false)
	{
		
		var date = new Date();
		var timestamp = date.getTime();
		//fetch(base_url + jsapp + '/viewStat/' + aid + '?t=' + timestamp, {cache: "no-cache",
		fetch(base_url +'kokos/viewStat/' + aid + '/'+ page +'?t=' + timestamp, {cache: "no-cache",
			headers : {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
		   }
		})
		.then(function(response) {
			return;
		})
		.then(function(myJson) {
			return true;
		});
	}

}


function del_select(el, position_ads, curPage, max) {

    for(var i=0; i<el.length; i++){

        var has = el[i].className.search(position_ads);
        if(has > -1){

            if(curPage != el[i].innerText){
                el[i].classList.remove("selected");
            }
            else
            {
                el[i].classList.add("selected");
            }
        }

    }
    for(var i=1; i<=max; i++){
        var ad_page = i-1;
        //console.log(i, curPage);
        if(document.getElementById(position_ads +'-'+ ad_page) != null){
            //console.log(document.getElementById(position_ads +'-'+ i));
            document.getElementById(position_ads +'-'+ ad_page).style.display = "none";
            if(i == curPage){
                //alert(ad_page);
                document.getElementById(position_ads +'-'+ ad_page).style.removeProperty('display');
            }
        }
    }

}

function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

function slidePage(){
    var el = document.querySelectorAll('.bingsu-counting');
    var className = "selected";
    //console.log(el.length);return false;
    for (i = 0; i < el.length; i++) {
        el.item(i).onclick = function(){ 
            var date = new Date();
            var timestamp = date.getTime();
            if(hasClass(this, "selected") == false){
                var bingid = this.getAttribute('data-bingid');
                fetch(slotUrl + bingid + '?t=' + timestamp, {cache: "no-cache"})
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    //
                });
            }

            var curPage = this.children[0].innerHTML;
            var curClass = this.getAttribute('class');
            var n = curClass.search(/\sselected|selected/);

            var position_ads = this.getAttribute('data-posads');
            var clickPage = i+1;

            del_select(el,position_ads, curPage, 3);

            if(n == -1){
                this.class = curClass.trim() + ' selected';
                this.style.display = "block";
                this.className = this.class;
            }
        }
    }
}

function sleep(time){
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, time);
    });
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function iframe_scrt(div_id, scrt, width, height){
    scrt = scrt.replace(/\//g, '|slsh|');
    scrt = escape(scrt.replace(/(\r\n|\n|\r)/gmi,""));
    document.getElementById(div_id).innerHTML = '<iframe src="'+base_url+jsapp+'/show_ifrm/'+scrt+'" width="'+width+'" height="'+height+'" frameborder="0" class="ads_box_type1 m-b-20"  style="padding: 8px;overflow:hidden;" title="ads"></iframe>';
}

function stripAndExecuteScript(text) {
    return text;
}

function inArray(needle) {
    var length = arr_position.length;
    var str = needle.split(":");
    var key = str.length-1;
    for(var i = 0; i < length; i++) {
        if(arr_position[i] == str[key]) return true;
    }
    return false;
}

function inArray_haystack(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}


window.addEventListener("load", function load(event)
{
	let adsFrame = document.getElementsByClassName("ads_box_iframe");
	let adsBox_1 = document.getElementsByClassName("ads_with_iframe");
    let inviPadding;
	let scaleX;
	AdsScaler();
	window.addEventListener("resize", AdsResize);
	window.addEventListener("click", ClickScale);
	function AdsScaler()
	{
		for(let i = 0 ; i < adsFrame.length; i++)
		{
			if(adsBox_1[i].offsetWidth >= 1044)
			{
				scaleX = (adsBox_1[i].offsetWidth - 74) / 970;
				adsBox_1[i].style.height = ((adsBox_1[i].offsetWidth - 100 )/ 970) * 285 + "px";
                
                // (ตัวแปรหาค่าความกว้าง) = (ความกว้าง Container - Padding ทั้งสองข้างรวมกัน) / ความกว้างของรูป;
                // ความสูง Container = ((ความกว้าง Container - 100 ) / ความกว้างของรูป) * ความสูงของ Container;
			}
            
			if(adsBox_1[i].offsetWidth < 1044 && adsBox_1[i].offsetWidth >= 1004)
			{
                inviPadding = adsBox_1[i].offsetWidth - 970;
                scaleX = (adsBox_1[i].offsetWidth - inviPadding) / 970;
				adsBox_1[i].style.height = (adsBox_1[i].offsetWidth / 970) * 285 + "px";
			}
            
            
            if(adsBox_1[i].offsetWidth < 1004 && adsBox_1[i].offsetWidth > 970)
			{
				scaleX = (adsBox_1[i].offsetWidth - 32) / 970;
				adsBox_1[i].style.height = (adsBox_1[i].offsetWidth / 970) * 285 + "px";		
			}

			if(adsBox_1[i].offsetWidth <= 970)
			{
				scaleX = (adsBox_1[i].offsetWidth - 32) / 970;
				adsBox_1[i].style.height = (adsBox_1[i].offsetWidth / 970) * 285 + "px";	
			}
			if(adsBox_1[i].style.height >= 285 + "px")
			{
				adsBox_1[i].style.height = 285 + "px"
			}
			if(scaleX >= 1)
			{
				scaleX = 1;
				adsFrame[i].style.transform = "scale(" + scaleX + ")";
			}
			if(scaleX <= 0.34)
			{
				scaleX = 0.34;
				adsFrame[i].style.transform = "scale(" + scaleX + ")";
			}
			else
			{
				adsFrame[i].style.transform = "scale(" + scaleX + ")";
			}
			
		}
	}
	function AdsResize()
	{	
		AdsScaler();
	}
	function ClickScale()
	{
		AdsScaler();
	}
}, false);	

