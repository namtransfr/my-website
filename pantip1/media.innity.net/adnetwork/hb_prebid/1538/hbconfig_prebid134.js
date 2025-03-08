/* Tag_Forum_300x250 - 20250307 */
var PREBID_TIMEOUT = 1500;

var pbvar = {};
    pbvar.environment = 'none';
try {
    
} catch (e) {}

pbvar.zones = [];
pbvar.zones[0] = {none:89069}
pbvar.appnexusZones = [];
pbvar.unrulyZones = [];
pbvar.rubiconZones = [];
pbvar.criteoZones = [];
pbvar.teadsZones = [];
pbvar.sublimeZones = [];
pbvar.gridZones = [];

var adUnits = [{
    code: '/5363867/Tag_Forum_300x250',
    mediaTypes: {
        banner: {
            sizes: [
                [300,250],
            ]
        },
    },
    bids: [{
        bidder: 'innity',
        params: {
            pub: 1358,
            zone: pbvar.zones[0][pbvar.environment],
        }
    }
    ]
}];

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.bidderSettings = {
	standard: {
		adserverTargeting: [{
				key: "hb_pb",
				val: function(bidResponse) {
					return bidResponse.cpm;
				}
			},{
				key: "hb_bidder",
				val: function(bidResponse) {
					return bidResponse.bidderCode;
				}
			}, {
				key: "hb_adid",
				val: function(bidResponse) {
					return bidResponse.adId;
				}
			}, {
				key: "network",
				val: function(bidResponse) {
					var cpm = bidResponse.cpm;
					if (cpm > 0) {
						return 'innity';
					}
				}
			}
		]
	}
};

pbjs.que.push(function() {
	pbjs.addAdUnits(adUnits);
	pbjs.requestBids({
		bidsBackHandler: sendAdserverRequest
	});
});

function sendAdserverRequest() {
	if (pbjs.adserverRequestSent) return;
	pbjs.adserverRequestSent = true;
	googletag.cmd.push(function() {
		pbjs.que.push(function() {
			pbjs.setTargetingForGPTAsync();
			googletag.pubads().refresh();
		});
	});
}

setTimeout(function() {
	sendAdserverRequest();
}, PREBID_TIMEOUT);