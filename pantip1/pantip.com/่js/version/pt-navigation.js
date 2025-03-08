//@ts-check
window.onload = function()
{
	var header = document.getElementById("pantipHeader");
	var sticky = header.offsetTop;
	var category_m = document.getElementById("pantipCategory_m");
	var other = document.getElementById("pantipOther");
	var userMenu = document.getElementById("ptListDropdownMenu");
	var communityMenu = document.getElementById("php-commu-dialog");

	var showUserMenu = false;
	var showCommunityMenu = false;
	
	/*Scroll Down Menu*/
	function stickNav() 
	{
		if (window.pageYOffset > sticky) 
		{
			header.classList.add("pt-sticky-navigation");
			category_m.classList.add("pt-sticky-container");
			other.classList.add("pt-sticky-container");
			
			document.getElementsByClassName("pt-stickyLogo")[0].classList.add("toggleCat");
			document.getElementsByClassName("pt-stickyLogo")[1].classList.remove("toggleCat");
			
		} 
		else 
		{
			header.classList.remove("pt-sticky-navigation");
			category_m.classList.remove("pt-sticky-container");
			other.classList.remove("pt-sticky-container");
			
			document.getElementsByClassName("pt-stickyLogo")[0].classList.remove("toggleCat");
			document.getElementsByClassName("pt-stickyLogo")[1].classList.add("toggleCat");
		}
	}
	/*Open Close Menu*/
	document.onclick = function(e)
	{
		// If click inside the community dialog, DO NOTHING
		if (communityMenu.contains(e.target)) {
			return;
		}

		if(e.target.id == "openCate_m" || e.target.id == "openCate") {
			if(userMenu != null){
				userMenu.style.display = 'none';
				userMenu.style.opacity = 0;
			}
			if (communityMenu != null) {
				communityMenu.classList.add("pt-php-block-hide");
			}
			showUserMenu = false;
			showCommunityMenu = false;
            if(document.getElementById("pantipCategory_m").classList.contains("toggleCat")) {
                other.classList.add("toggleCat");
                document.getElementById("pt-other-container").classList.remove("other-height");

                document.getElementById("pantipCategory_m").classList.remove("toggleCat");
                document.getElementById("pt-category-container").classList.add("cat-height");
            }
            else {
                document.getElementById("pantipCategory_m").classList.add("toggleCat"); 
                document.getElementById("pt-category-container").classList.remove("cat-height");
            }
		}
		
		else if(e.target.id == "openOther")
		{
			if(userMenu != null){
				userMenu.style.display = 'none';
				userMenu.style.opacity = 0;
			}
			if (communityMenu != null) {
				communityMenu.classList.add("pt-php-block-hide");
			}
			showUserMenu = false;
			showCommunityMenu = false;
            if(other.classList.contains("toggleCat")) {
                other.classList.remove("toggleCat");
                document.getElementById("pt-other-container").classList.add("other-height");
                document.getElementById("pantipCategory_m").classList.add("toggleCat"); 
                document.getElementById("pt-category-container").classList.remove("cat-height");
            }
            else {
                other.classList.add("toggleCat");
                document.getElementById("pt-other-container").classList.remove("other-height");
            }
			
		}
	
		else if(e.target.id == "openUserMenu")
		{
			switch(showUserMenu)
			{
				case true: 
					if(userMenu != null){
						userMenu.style.display = 'none';
						userMenu.style.opacity = 0;
					}
					showUserMenu = false;
				break;
				case false: 
					if(userMenu != null){
						userMenu.style.display = 'inline';
						userMenu.style.opacity = 1;
					}
					if (communityMenu != null) {
						communityMenu.classList.add("pt-php-block-hide");
					}
					showUserMenu = true;
					showCommunityMenu = false;
					document.getElementById("pantipCategory_m").classList.add("toggleCat");
					document.getElementById("pantipOther").classList.add("toggleCat");
					other.classList.add("toggleCat");
					document.getElementById("pt-other-container").classList.remove("other-height");
					document.getElementById("pantipCategory_m").classList.add("toggleCat"); 
                	document.getElementById("pt-category-container").classList.remove("cat-height");
				break;
				default:
			}
		}

		else if (e.target.id == "openCommunityMenu" || $(e.target).hasClass('community-box')) {
			if (e.target.id == "openCommunityMenu") {
				switch (showCommunityMenu) {
					case true:
						if (communityMenu != null) {
							communityMenu.classList.add("pt-php-block-hide");
						}
						showCommunityMenu = false;
						break;
					case false:
						if (communityMenu != null) {
							communityMenu.classList.remove("pt-php-block-hide");
						}
						if (userMenu != null) {
							userMenu.style.display = 'none';
							userMenu.style.opacity = 0;
						}
						showUserMenu = false;
						showCommunityMenu = true;
						document.getElementById("pantipCategory_m").classList.add("toggleCat");
						document.getElementById("pantipOther").classList.add("toggleCat");
						other.classList.add("toggleCat");
						document.getElementById("pt-other-container").classList.remove("other-height");
						document.getElementById("pantipCategory_m").classList.add("toggleCat");
						document.getElementById("pt-category-container").classList.remove("cat-height");
						break;
					default:
				}
			}
		}

		else {
			if (userMenu != null) {
				userMenu.style.display = 'none';
				userMenu.style.opacity = 0;
			}
			if (communityMenu != null) {
				communityMenu.classList.add("pt-php-block-hide");
			}
			showUserMenu = false;
			showCommunityMenu = false;
		}
	}
	
	window.onscroll = function() 
	{
		stickNav();
	};
};

(function (root, factory) {
	// @ts-ignore
	factory(window.Modal, jQuery, window, Base64);
}(typeof self !== "undefined" ? self : this, function (Modal, $, window, Base64) {

	/** @typedef {"room"|"tag"|"club"} CommunityType */

	/**
	 * @typedef {object} APIResponseSchema
	 * @property {boolean} success
	 * @property {object[]} data
	 * @property {string} error_code
	 * @property {string} error_message
	 * @property {number} [max_pin_limit]
	 * @property {number|string|null} [next_id]
	 */

	/**
	 * @typedef {object} APIResponseSchemaSearchUnpinned
	 * @property {boolean} success
	 * @property {object[]} data
	 * @property {string} error_code
	 * @property {string} error_message
	 * @property {number} result_count
	 * @property {string|null} [next_id]
	 * @property {string|null} [ranking_time]
	 */

	/** @type {{logged_in: boolean, tracking_code: string, service_base_url: string, mid: number}} */
	// @ts-ignore
	const config = getGlobalConfig();
	const REQUEST_LIMIT = 10;
	const REQUEST_SEARCH_UNPINNED_LIMIT = 10;
	const DEBUG_NO_FOLLOWED_AND_PINNED_TAGS = false;
	const DEBUG_NO_PINNED_COMMUNITIES = false;
	const DEBUG_COMMUNITY_ID = false;
	const DEBUG_SEARCH_PAGE_BORDER = false;

	class APIResponseError extends Error {
		/** @type {number|string} */
		code;

		/**
		 * @param {number|string} code 
		 * @param {string} message 
		 */
		constructor(code, message) {
			super(message);
			this.code = code;
		}
	}

	class Community {
		/** @type {number} */
		id;
		/** @type {string} */
		name;
		/** @type {string} */
		url;
		/** @type {boolean} */
		isPinned;
		/** @type {Date|null} */
		lastTopicDate = null;

		constructor(object) {
			this.id = object.id;
			this.name = object.name;
			this.isPinned = object.is_pinned;
			this.url = object.link_url;
			if (typeof object.latest_created_topic_date == "string") {
				this.lastTopicDate = new Date(object.latest_created_topic_date);
			}
		}

		getId() {
			throw new Error("This method must be implemented in a child class");
		}

		getName() {
			if (DEBUG_COMMUNITY_ID) {
				return this.name + ` (${this.getId()})`;
			}
			return this.name;
		}

		getUrl() {
			return this.url;
		}

		timeAgo(inputDate, dateNow = Date.now(), options = {}) {

			const units = [
				{
					short: 'sec',
					shortPlural: 'secs',
					full: 'second',
					fullPlural: 'seconds',
					th: 'วินาที',
					upperLimit: 60,
					divider: 1
				},
				{
					short: 'min',
					shortPlural: 'mins',
					full: 'minute',
					fullPlural: 'minutes',
					th: 'นาที',
					upperLimit: 60 * 60,
					divider: 60
				},
				{
					short: 'hr',
					shortPlural: 'hrs',
					full: 'hour',
					fullPlural: 'hours',
					th: 'ชั่วโมง',
					upperLimit: 60 * 60 * 24,
					divider: 3600
				},
				{
					short: 'd',
					shortPlural: 'd',
					full: 'day',
					fullPlural: 'days',
					th: 'วัน',
					upperLimit: 60 * 60 * 24 * 30,
					divider: 86400
				},
				{
					short: 'mo',
					shortPlural: 'mo',
					full: 'month',
					fullPlural: 'months',
					th: 'เดือน',
					upperLimit: 60 * 60 * 24 * 365,
					divider: 86400 * 30
				},
				{
					short: 'yr',
					shortPlural: 'yrs',
					full: 'year',
					fullPlural: 'years',
					th: 'ปี',
					upperLimit: null,
					divider: 86400 * 365
				}
			]

			const shotMonthTh = [
				'ม.ค.',
				'ก.พ.',
				'มี.ค.',
				'เม.ย.',
				'พ.ค.',
				'มิ.ย.',
				'ก.ค.',
				'ส.ค.',
				'ก.ย.',
				'ต.ค.',
				'พ.ย.',
				'ธ.ค.'
			]

			const fullYear = typeof options.fullYear === 'undefined' ? true : options.fullYear

			let nowDate = dateNow
			let now = new Date(nowDate)

			let date = new Date(inputDate)
			// @ts-ignore
			let second = Math.floor((now - date) / 1000)

			let count = 0
			const UnitsLevel = 3

			if (second <= 0) {
				return 'ตอนนี้'
			}
			for (let i in units) {

				if (count++ >= UnitsLevel) {
					break
				}

				let item = units[i]

				if (item.upperLimit == null || second < item.upperLimit) {
					let result = Math.floor(second / item.divider)
					return `${result} ${item.th}`
				}
			}

			if (date.getFullYear() < now.getFullYear()) {
				let year = date.getFullYear() + 543
				let yearText = ""
				if (!fullYear) {
					year = year % 100
					yearText = year < 10 ? '0' + year.toString().substring(-1, 1) : year.toString()
				} else {
					yearText = year.toString()
				}
				return `${date.getDate()} ${shotMonthTh[date.getMonth()]} ${yearText}`
			} else if (second >= 86400) {
				return `${date.getDate()} ${shotMonthTh[date.getMonth()]}`
			}
		}

		getLastTopicDateAgo() {
			if (this.lastTopicDate === null) {
				return "NULL";
			} else {
				return this.timeAgo(this.lastTopicDate)
			}
		}

		getLastTopicDate() {
			if (this.lastTopicDate !== null && this.lastTopicDate.toISOString() == '1970-01-01T00:00:00.000Z') {
				return 'ไม่มีกระทู้ใหม่'
			} else {
				return `• กระทู้ใหม่ล่าสุด ${this.getLastTopicDateAgo()}`
			}
		}

		getDescription() {
			throw new Error("This method must be implemented in child class");
		}

		/**
		 * Get type name.
		 * @param {CommunityType|null} type
		 * @returns {string}
		 */
		static getTypeName(type) {
			if (type == "room") {
				return "ห้อง";
			} else if (type == "tag") {
				return "แท็ก";
			} else {
				return "คลับ";
			}
		}

		/**
		 * Check is number ID.
		 * @param {CommunityType} type
		 * @returns {boolean}
		 */
		static isNumberId(type) {
			return ["room", "club"].includes(type);
		}
	}

	class Room extends Community {
		/** @type {string} */
		nameEn;
		/** @type {string} */
		slug;
		/** @type {string} */
		description;
		/** @type {Tag[]|undefined} Used for search unpinned API */
		tags;

		constructor(object) {
			super(object);
			this.nameEn = object.name_en;
			this.slug = object.slug;
			this.description = object.description;

			// Used for search unpinned API
			if (typeof object.tags != "undefined") {
				this.tags = object.tags.map(o => new Tag(Object.assign(o, {
					is_followed: false
				})));
			}
		}

		getIconUrl() {
			return `https://ptcdn.info/mobile/icon_room/pt-forum-${this.nameEn}.svg`;
		}

		getDescription() {
			return this.description;
		}

		getId() {
			return this.id;
		}

		hasTags() {
			return typeof this.tags != "undefined" && this.tags.length > 0;
		}

		getHasTagDescription() {
			if (typeof this.tags == "undefined" || this.tags.length == 0) {
				throw new Error("This method must be called when tags is not undefined and has at least one element");
			}
			return `• ห้องที่มีแท็ก "${this.tags[0].name}"`;
		}
	}

	class Tag extends Community {
		/** @type {string} */
		lowerName;
		/** @type {number|null|undefined} */
		groupId;
		/** @type {number} */
		unseenCount;
		/** @type {boolean} */
		isFollowed;

		constructor(object) {
			super(object);
			this.lowerName = object.name_lower;
			this.groupId = object.group_id;
			this.unseenCount = object.unread;
			if (typeof object.is_followed == "undefined") {
				throw new Error("object.is_followed is expected to be defined");
			}
			this.isFollowed = object.is_followed;
			if (DEBUG_NO_FOLLOWED_AND_PINNED_TAGS) {
				this.isPinned = false;
				this.isFollowed = false;
			}
		}

		getIconUrl() {
			return "https://ptcdn.info/images/pantip_icon/tag_blue.png";
		}

		getUnseenTopicDescription() {
			if (this.unseenCount <= 20) {
				return `• ${this.unseenCount} กระทู้ใหม่`;
			} else {
				return `• 20+ กระทู้ใหม่`;
			}
		}

		getDescription() {
			if (this.isFollowed) {
				return this.getUnseenTopicDescription();
			} else {
				return this.getLastTopicDate();
			}
		}

		getId() {
			return this.lowerName;
		}
	}

	class Club extends Community {
		getIconUrl() {
			return "https://ptcdn.info/images/pantip_icon/club_blue.png";
		}

		getDescription() {
			return this.getLastTopicDate();
		}

		getId() {
			return this.id;
		}
	}

	class NodeJsService {
		/** @type {string} */
		nodeJsBaseUrl;
		/** @type {string} */
		nodeJsProxy = "/proxy/forward";
		/** @type {boolean} */
		loggedIn;
		/** @type {string} */
		trackingCode;
		/** @type {number} */
		mid;

		constructor() {
			this.nodeJsBaseUrl = config.service_base_url;
			this.loggedIn = config.logged_in;
			this.trackingCode = config.tracking_code;
			this.mid = config.mid;
		}

		/**
		 * Make GET request.
		 * @param {URLSearchParams} params
		 * @returns {Promise<any>}
		 */
		async __get(params) {
			let response = await fetch(this.nodeJsProxy + "?" + params.toString());
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return response.json();
		}

		/**
		 * Get reccommended rooms.
		 * @returns {Promise<any>}
		 */
		async getRecommendedRooms() {
			let params = new URLSearchParams();
			params.append("__url", this.nodeJsBaseUrl + "forum-service/home/get_room_recommend");
			if (!this.loggedIn) {
				params.append("tracking_code", "{" + this.trackingCode + "}");
			} else {
				params.append("id", "{" + Base64.encode(this.mid.toString()) + "}")
			}

			return this.__get(params);
		}

		/**
		 * Get recommended tags.
		 * @param {number|null} limit
		 * @param {string|null} nextId
		 * @returns {Promise<any>}
		 */
		async getRecommendedTags(limit, nextId) {
			let params = new URLSearchParams();
			params.append("__url", this.nodeJsBaseUrl + "community-service/tag/get_recommend");
			if (limit) {
				params.append("limit", limit.toString());
			}
			if (nextId) {
				params.append("next_id", nextId);
			}

			return this.__get(params);
		}

		/**
		 * Get rooms by pinning status.
		 * @param {"pin"|"unpin"} type 
		 * @param {number} [limit]
		 * @returns {Promise<APIResponseSchema>}
		 */
		async getRoomsByPinningStatus(type, limit) {
			let params = new URLSearchParams();
			params.append("__url", this.nodeJsBaseUrl + "community-service/room/get_by_pinning");
			params.append("type", type);
			if (limit) {
				params.append("limit", limit.toString());
			}

			return this.__get(params);
		}

		/**
		 * Get clubs by pinning status v2
		 * @param {"pin"|"unpin"} type 
		 * @param {number} [limit]
		 * @param {number|string|null} [nextId]
		 * @returns {Promise<APIResponseSchema>}
		 */
		async getClubsByPinningStatusV2(type, limit, nextId) {
			let params = new URLSearchParams();
			params.append("__url", this.nodeJsBaseUrl + "community-service/club/get_by_pinning/v2");
			params.append("type", type);
			if (limit) {
				params.append("limit", limit.toString());
			}
			if (nextId) {
				params.append("next_id", nextId.toString());
			}

			return this.__get(params);
		}

		/**
		 * Get followed and pinned tags v2.
		 * @param {number} [limit]
		 * @param {string} [nextId]
		 * @returns {Promise<APIResponseSchema>}
		 */
		async getPinnedTagsV2(limit, nextId) {
			let params = new URLSearchParams();
			params.append("__url", this.nodeJsBaseUrl + "community-service/tag/get_pin/v2");
			if (limit) {
				params.append("limit", limit.toString());
			}
			if (nextId) {
				params.append("next_id", nextId.toString());
			}

			return this.__get(params);
		}

		/**
		 * Update pining orders.
		 * @param {CommunityType} type
		 * @param {string[]|number[]} orderList
		 * @param {string[]|number[]} pinList
		 * @param {string[]|number[]} unpinList
		 * @returns {Promise<APIResponseSchema>}
		 */
		async updatePiningOrders(type, orderList, pinList, unpinList) {
			let params = new URLSearchParams();
			params.append("__url", this.nodeJsBaseUrl + "community-service/community/update_orders");

			const response = await fetch(this.nodeJsProxy + "?" + params.toString(), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: type,
					order_list: orderList,
					pin_list: pinList,
					unpin_list: unpinList
				})
			});
			return response.json();
		}

		/**
		 * Search unpinned communities.
		 * @param {CommunityType} type 
		 * @param {string} query 
		 * @param {string[]|number[]} [tempUnpin] 
		 * @param {string[]|number[]} [tempPin] 
		 * @param {number} [limit] 
		 * @param {string} [fields] 
		 * @param {string} [nextId]
		 * @param {string} [rankingTime]
		 * @returns {Promise<APIResponseSchemaSearchUnpinned>}
		 */
		async search_UnpinnedCommunities(type, query, tempUnpin, tempPin, limit, fields, nextId, rankingTime) {
			let params = new URLSearchParams();
			params.append("__url", this.nodeJsBaseUrl + "community-service/community/search_unpin");

			let body = {
				type: type,
				query: query
			};
			if (typeof tempUnpin != "undefined") {
				body["temp_unpin"] = tempUnpin;
			}
			if (typeof tempPin != "undefined") {
				body["temp_pin"] = tempPin;
			}
			if (typeof limit != "undefined") {
				body["limit"] = limit;
			}
			if (typeof fields != "undefined") {
				body["fields"] = fields;
			}
			if (typeof nextId != "undefined") {
				body["next_id"] = nextId;
			}
			if (typeof rankingTime != "undefined") {
				body["ranking_time"] = rankingTime;
			}

			const response = await fetch(this.nodeJsProxy + "?" + params.toString(), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body)
			});
			return response.json();
		}
	}

	/** @type {HTMLElement} */
	let container;
	/** @type {HTMLElement} */
	let roomContainer;
	/** @type {HTMLDivElement} */
	let roomTryAgainContainer;
	/** @type {HTMLAnchorElement} */
	let roomEditPinningButton;

	/** @type {HTMLAnchorElement} */
	let seeAllRoomButton;
	/** @type {HTMLLIElement} */
	let openCommunityMenu;

	/** @type {HTMLDivElement} */
	let tagTopContainer;
	/** @type {HTMLElement} */
	let tagContainer;
	/** @type {HTMLAnchorElement} */
	let tagLoadMoreButton;
	/** @type {HTMLDivElement} */
	let tagTryAgainContainer;
	/** @type {HTMLAnchorElement} */
	let tagEditPinningButton;

	/** @type {HTMLDivElement} */
	let clubTopContainer;
	/** @type {HTMLElement} */
	let clubContainer;
	/** @type {HTMLAnchorElement} */
	let clubLoadMoreButton;
	/** @type {HTMLDivElement} */
	let clubTryAgainContainer;
	/** @type {HTMLAnchorElement|null} */
	let clubEditPinningButton;

	let searchModal = null;

	/**
	 * @typedef {object} PinningModalElementsType
	 * @property {HTMLButtonElement?} saveButton
	 * @property {HTMLButtonElement?} addPinningButton
	 * @property {HTMLButtonElement?} addPinningButtonBottom
	 * @property {HTMLElement?} pinningIsFullBold
	 * @property {Text?} countingText
	 * @property {HTMLDivElement?} contentNoData
	 * @property {HTMLUListElement?} contentHasData
	 */

	/** @type {PinningModalElementsType} */
	const pinningModalElements = {
		saveButton: null,
		addPinningButton: null,
		addPinningButtonBottom: null,
		pinningIsFullBold: null,
		countingText: null,
		contentNoData: null,
		contentHasData: null
	};

	/**
	 * @typedef {object} SearchModalElementsType
	 * @property {HTMLInputElement?} searchInput
	 * @property {HTMLSpanElement?} searchCountSpan
	 * @property {HTMLUListElement?} searchUl
	 * @property {HTMLDivElement?} searchNoResultDiv
	 * @property {Text?} searchNoResultText
	 * @property {HTMLDivElement?} searchTryAgainDiv
	 * @property {HTMLDivElement} modalContentContainer
	 */

	/** @type {SearchModalElementsType} */
	const searchModalElements = {
		searchInput: null,
		searchCountSpan: null,
		searchUl: null,
		searchNoResultDiv: null,
		searchNoResultText: null,
		searchTryAgainDiv: null,
		// @ts-ignore
		modalContentContainer: null
	};

	/**
	 * @typedef {object} StateType
	 * @property {boolean} showMenu
	 * @property {boolean} showAllRoom
	 * @property {Room[]} rooms
	 * @property {boolean} roomLoading
	 * @property {boolean} roomEnded
	 * @property {boolean} roomHasError
	 * @property {boolean} firstOpen
	 * @property {Tag[]} tags
	 * @property {boolean} tagLoading
	 * @property {string|null} tagNextId
	 * @property {boolean} tagEnded
	 * @property {boolean} tagHasError
	 * @property {Club[]} clubs
	 * @property {boolean} clubLoading
	 * @property {string|null} clubNextId
	 * @property {boolean} clubEnded
	 * @property {boolean} clubHasError
	 * @property {boolean} isPinningModalOpened
	 * @property {CommunityType?} modalCommunityType
	 * @property {boolean} modalFetchRequesting
	 * @property {Room[]|Tag[]|Club[]} modalCurrentPinnedCommunities
	 * @property {Room[]|Tag[]|Club[]} modalPinnedCommunities
	 * @property {Room[]|Tag[]|Club[]} modalToPinCommunities
	 * @property {Room[]|Tag[]|Club[]} modalToUnpinCommunities
	 * @property {boolean} modalSaveButtonLoading
	 * @property {number} modalPinningMax
	 * @property {boolean} modalSearchShow
	 * @property {CommunityType|null} modalSearchType
	 * @property {string} modalSearchQuery
	 * @property {Room[]|Tag[]|Club[]} modalSearchCommunities
	 * @property {string|null} modalSearchNextId
	 * @property {string|null} modalSearchRankingTime
	 * @property {boolean} modalSearchIsLoading
	 * @property {boolean} modalSearchIsEnded
	 * @property {number} modalSearchResultCount
	 * @property {boolean} modalSearchHasError
	 * @property {number} modalSearchPage
	 */

	/** @type {StateType} */
	let state = {
		firstOpen: true,
		showMenu: false,
		showAllRoom: false,
		rooms: [],
		roomLoading: false,
		roomEnded: false,
		roomHasError: false,
		tags: [],
		tagLoading: false,
		tagNextId: null,
		tagEnded: false,
		tagHasError: false,
		clubs: [],
		clubLoading: false,
		clubNextId: null,
		clubEnded: false,
		clubHasError: false,
		// Modal states
		isPinningModalOpened: false,
		modalFetchRequesting: false,
		modalCommunityType: null,
		modalCurrentPinnedCommunities: [],
		modalPinnedCommunities: [],
		modalToPinCommunities: [],
		modalToUnpinCommunities: [],
		modalSaveButtonLoading: false,
		modalPinningMax: 0,
		// Modal search states
		modalSearchShow: false,
		modalSearchType: null,
		modalSearchQuery: "",
		modalSearchCommunities: [],
		modalSearchNextId: null,
		modalSearchRankingTime: null,
		modalSearchIsLoading: false,
		modalSearchIsEnded: false,
		modalSearchResultCount: 0,
		modalSearchHasError: false,
		modalSearchPage: 1
	};

	/** @type {Map<string, Room|Tag|Club>} */
	const pinnedCommunitiesMap = new Map();

	function init() {
		// @ts-ignore
		openCommunityMenu = document.getElementById("openCommunityMenu");
		// @ts-ignore
		container = document.getElementById("php-commu-dialog");
		// @ts-ignore
		roomContainer = container.querySelector(".pt-php-forum-communities");
		// @ts-ignore
		seeAllRoomButton = roomContainer.nextElementSibling.querySelector(".pt-php-link__more");
		// @ts-ignore
		roomTryAgainContainer = roomContainer.nextElementSibling.nextElementSibling;

		// @ts-ignore
		tagTopContainer = container.querySelector(".community-tag-top-container");
		// @ts-ignore
		tagContainer = container.querySelector(".pt-lists-tag-commu");
		// @ts-ignore
		tagLoadMoreButton = tagContainer.nextElementSibling.firstElementChild;
		// @ts-ignore
		tagTryAgainContainer = tagContainer.nextElementSibling.nextElementSibling;

		// @ts-ignore
		clubTopContainer = container.querySelector(".community-club-top-container");

		let buttons = Array.from(container.querySelectorAll(".pt-php-forum-header")).map((el) => el.querySelector("a"));
		// @ts-ignore
		roomEditPinningButton = buttons[0];
		// @ts-ignore
		tagEditPinningButton = buttons[1];
		if (config.logged_in) {
			clubEditPinningButton = buttons[2];
		}

		/** @type {HTMLAnchorElement} */
		// @ts-ignore
		let clubTryAgainButton = null;

		if (config.logged_in) {
			// @ts-ignore
			clubContainer = container.querySelector(".pt-lists-club-commu");
			// @ts-ignore
			clubLoadMoreButton = clubContainer.nextElementSibling.firstElementChild;
			// @ts-ignore
			clubTryAgainContainer = clubContainer.nextElementSibling.nextElementSibling;
			// @ts-ignore
			clubTryAgainButton = clubTryAgainContainer.querySelector("a");
		}

		/** @type {HTMLAnchorElement} */
		// @ts-ignore
		let roomTryAgainButton = roomTryAgainContainer.querySelector("a");
		/** @type {HTMLAnchorElement} */
		// @ts-ignore
		let tagTryAgainButton = tagTryAgainContainer.querySelector("a");

		openCommunityMenu.addEventListener("click", function (e) {
			e.preventDefault();
			if (state.firstOpen) {
				setState({
					roomLoading: true,
					tagLoading: true,
					clubLoading: true,
					firstOpen: false
				});

				Promise.all([loadRooms(), loadTags()]).finally(() => {
					if (config.logged_in) {
						loadClubs();
					}
				});
			}
		});

		seeAllRoomButton.addEventListener("click", function (e) {
			e.preventDefault();
			setState({
				showAllRoom: !state.showAllRoom
			});
		});

		roomTryAgainButton.addEventListener("click", function (e) {
			e.preventDefault();
			loadRooms();
		});

		[tagLoadMoreButton, tagTryAgainButton].forEach(function (button) {
			button.addEventListener("click", function (e) {
				e.preventDefault();
				loadTags();
			});
		});

		if (config.logged_in) {
			[clubLoadMoreButton, clubTryAgainButton].forEach(function (button) {
				button.addEventListener("click", function (e) {
					e.preventDefault();
					loadClubs();
				});
			});
		}

		// Edit pinning buttons
		roomEditPinningButton.addEventListener("click", function (e) {
			e.preventDefault();
			loadPinnedCommunities("room");
		});

		tagEditPinningButton.addEventListener("click", function (e) {
			e.preventDefault();
			loadPinnedCommunities("tag");
		});

		if (clubEditPinningButton) {
			clubEditPinningButton.addEventListener("click", function (e) {
				e.preventDefault();
				loadPinnedCommunities("club");
			});
		}

		setState(state);
	}

	function resetModalPinningStates() {
		setState({
			modalCommunityType: null,
			modalCurrentPinnedCommunities: [],
			modalPinnedCommunities: [],
			modalToPinCommunities: [],
			modalToUnpinCommunities: [],
			modalSaveButtonLoading: false,
			modalPinningMax: 0
		});
	}

	/**
	 * @param {APIResponseError} err
	 * @param {{callback: () => void}} [options]
	 */
	function errorModal(err, options) {
		console.error(err);
		// Not logged in case but PHP proxy sends Basic token
		if (err.code == 3001003) {
			notLoggedInModal();
		} else {
			Modal.error({
				title: "เกิดข้อผิดพลาด",
				message: "ไม่สามารถดำเนินการได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง",
				details: err.message,
				acknowledgeText: "ตกลง",
				size: "md",
				onAcknowledge: (close) => {
					close();
					if (options && options.callback) {
						options.callback();
					}
				},
				onClose: (close) => {
					close();
					if (options && options.callback) {
						options.callback();
					}
				}
			});
		}
	}

	function notLoggedInModal() {
		Modal.info({
			title: "ยังไม่ได้เข้าสู่ระบบ",
			content: "คุณต้องเข้าสู่ระบบเพื่อดำเนินการต่อ",
			acknowledgeText: "เข้าสู่ระบบ",
			size: "sm",
			onAcknowledge: gotoLoginPage
		});
	}

	/**
	 * @param {CommunityType} type 
	 */
	function loadPinnedCommunities(type) {
		// Prevent double clicks on edit pinning buttons for all community types
		if (state.modalFetchRequesting) {
			return;
		}

		if (!config.logged_in) {
			notLoggedInModal();
			return;
		}

		setState({
			modalFetchRequesting: true
		});

		let service = new NodeJsService();
		/** @type {Promise<APIResponseSchema>} */
		let promise;
		if (type == "room") {
			promise = service.getRoomsByPinningStatus("pin", 100);
		} else if (type == "tag") {
			promise = service.getPinnedTagsV2(100);
		} else {
			promise = service.getClubsByPinningStatusV2("pin", 100);
		}
		promise.then((res) => {
			if (!res.success) {
				throw new APIResponseError(res.error_code, res.error_message);
			}

			if (DEBUG_NO_PINNED_COMMUNITIES) {
				res.data = [];
			}

			Modal.show({
				backdrop: false,
				size: "sm",
				title: `แก้ไขปักหมุด${Community.getTypeName(type)}`,
				content: function () {
					let fragment = new DocumentFragment();

					fragment.append((function () {
						let div = document.createElement("div");
						div.className = "aligncenter p-all-24";

						let p = document.createElement("p");
						p.className = "m-b-16 subtitle-1";
						p.innerText = "ไม่พบรายการปักหมุด คุณสามารถเพิ่มรายการได้ที่";
						div.append(p);

						let button = document.createElement("button");
						button.type = "button";
						button.className = "ptp-btn btn--primary btn-round";
						button.title = "เพิ่มรายการปักหมุด";
						button.innerHTML = `<i class="material-icons m-r-8 m-l-de4">add</i>ปักหมุดเพิ่ม`;
						button.addEventListener("click", function (e) {
							e.preventDefault();
							showSearchModal(type);
						});
						div.append(button);

						pinningModalElements.addPinningButton = button;
						pinningModalElements.contentNoData = div;
						return div;
					})());

					fragment.append((function () {
						let ul = document.createElement("ul");
						let className = "pt-lists pt-lists--two-line pt-lists--avatar-list p-all-0";
						if (type == "tag") {
							ul.className = `${className} pt-lists-item__one-line-pinned`;
						} else {
							ul.className = className;
						}
						ul.draggable = true;
						pinningModalElements.contentHasData = ul;
						return ul;
					})());

					return fragment;
				},
				bottom: function (close) {
					let fragment = new DocumentFragment();

					let addPinningButtonBottom = document.createElement("button");
					addPinningButtonBottom.type = "button";
					addPinningButtonBottom.className = "ptp-btn btn-sm btn-round btn--secondary m-r-8";
					addPinningButtonBottom.title = "เพิ่มรายการปักหมุด";
					addPinningButtonBottom.innerHTML = `<i class="material-icons md-18 m-r-4 m-l-de4">add</i>ปักหมุดเพิ่ม`;
					addPinningButtonBottom.style.display = "none";
					addPinningButtonBottom.addEventListener("click", function (e) {
						e.preventDefault();
						showSearchModal(type);
					});
					fragment.append(addPinningButtonBottom);

					let b = document.createElement("b");
					b.className = "primary-txt m-r-4";
					b.innerText = "ปักหมุดเต็มแล้ว";
					b.style.display = "none";
					fragment.append(b);

					let span = document.createElement("span");
					span.className = "flexbox align-items-center";
					let countingText = document.createTextNode("จำนวน 0/10");
					span.append(countingText);
					fragment.append(span);

					let saveButton = document.createElement("button");
					saveButton.type = "button";
					saveButton.className = "ptp-btn btn--primary disabled";
					saveButton.innerText = "บันทึก";
					saveButton.addEventListener("click", function (e) {
						e.preventDefault();
						updatePinningOrders().then(() => {
							close();
							setState({
								isPinningModalOpened: false
							});
						}).catch((e) => {
							errorModal(e, {
								callback: close
							});
						});
					});
					fragment.append(saveButton);

					pinningModalElements.addPinningButtonBottom = addPinningButtonBottom;
					pinningModalElements.pinningIsFullBold = b;
					pinningModalElements.countingText = countingText;
					pinningModalElements.saveButton = saveButton;

					return fragment;
				},
				onClose: (close) => {
					if (isPinningChanged()) {
						Modal.confirm({
							size: "md",
							title: "ยืนยันการบันทึกข้อมูล",
							content: "เนื่องจากมีการเปลี่ยนแปลงรายการปักหมุด ระบบจะทำการบันทึก คุณต้องการดำเนินการต่อหรือไม่",
							onConfirm: (close2) => {
								close2();
								updatePinningOrders().then(() => {
									close();
									setState({
										isPinningModalOpened: false
									});
								}).catch((e) => {
									errorModal(e, {
										callback: close
									});
								});
							},
							onCancel: (close2) => {
								close();
								setState({
									isPinningModalOpened: false
								});
								close2();
							}
						});
					} else {
						close();
						setState({
							isPinningModalOpened: false
						});
					}
				},
				onRendered: () => {
					$(pinningModalElements.contentHasData).sortable({
						containment: "parent",
						tolerance: "pointer",
						// scroll: false,
						axis: "y",
						handle: ".btn--icon_circle",
						cancel: "",
						forcePlaceholderSize: true,
						update: function (event, ui) {
							/** @type {HTMLLIElement[]} */
							// @ts-ignore
							let items = Array.from(pinningModalElements.contentHasData.children);
							/** @type {string[]} */
							// @ts-ignore
							let ids = items.map((li) => li.dataset.id);

							/** @type {Room[]|Tag[]|Club[]} */
							// @ts-ignore
							let communities = ids.map((id) => {
								return pinnedCommunitiesMap.get(id);
							});
							setState({
								modalPinnedCommunities: communities
							});
						}
					});
				}
			});

			// resetModalPinningStates();

			/** @type {Room[]|Tag[]|Club[]} */
			let communities;
			if (type == "room") {
				communities = res.data.map((item) => new Room(item));
			} else if (type == "tag") {
				communities = res.data.map((item) => {
					return new Tag(Object.assign(item, {
						is_followed: true
					}));
				});
			} else {
				communities = res.data.map((item) => new Club(item));
			}

			pinnedCommunitiesMap.clear();
			communities.forEach((community) => {
				pinnedCommunitiesMap.set(community.getId().toString(), community);
			});

			setState({
				isPinningModalOpened: true,
				modalCommunityType: type,
				modalCurrentPinnedCommunities: communities,
				modalPinnedCommunities: communities,
				modalPinningMax: res.max_pin_limit,
				modalSaveButtonLoading: false,
				// Reset community lists
				modalToPinCommunities: [],
				modalToUnpinCommunities: [],
			});
		}).catch(errorModal).finally(() => {
			setState({
				modalFetchRequesting: false
			});
		});
	}

	/**
	 * @returns {Promise<any>}
	 */
	async function updatePinningOrders() {
		let data = getUpdateOrdersAPIParameters();

		let type = state.modalCommunityType;

		setState({
			modalSaveButtonLoading: true
		});

		const service = new NodeJsService();
		try {
			let res = await service.updatePiningOrders(
				// @ts-ignore
				type,
				data.orderList,
				data.pinList,
				data.unpinList
			);

			if (!res.success) {
				throw new APIResponseError(res.error_code, res.error_message);
			}
			resetModalPinningStates();
			// @ts-ignore
			reloadCommunityMenu(type);
		} finally {
			setState({
				modalSaveButtonLoading: false
			});
		}
	}

	function gotoLoginPage() {
		window.location = "/login?redirect=" + Base64.encode(window.location.pathname);
	}

	/**
	 * @param {CommunityType} type 
	 */
	function reloadCommunityMenu(type) {
		if (type == "room") {
			setState({
				showAllRoom: false,
				rooms: [],
				roomLoading: false,
				roomEnded: false,
				roomHasError: false
			});
			loadRooms();
		} else if (type == "tag") {
			setState({
				tags: [],
				tagLoading: false,
				tagNextId: null,
				tagEnded: false,
				tagHasError: false
			});
			loadTags();
		} else {
			setState({
				clubs: [],
				clubLoading: false,
				clubNextId: null,
				clubEnded: false,
				clubHasError: false
			});
			loadClubs();
		}
	}

	/**
	 * @param {Room|Tag|Club} community 
	 */
	function onRemovePinnedCommunity(community) {
		let hasInToPinList = state.modalToPinCommunities.some((/** @type {Room|Tag|Club}*/item) => {
			return item.getId() == community.getId();
		});

		// Always removes from the pinned list.
		let pinnedCommunities = state.modalPinnedCommunities.filter((item) => {
			return community.getId() != item.getId();
		});
		let toPinCommunities = state.modalToPinCommunities;
		let toUnpinCommunities = state.modalToUnpinCommunities;

		// If has in to pin communities remove it from the list, 
		// this can cause when the user added it from the search modal, then remove it in the re-order modal.
		// Else just add it to unpin communities list.
		if (hasInToPinList) {
			// @ts-ignore
			toPinCommunities = toPinCommunities.filter((item) => {
				return item.getId() != community.getId();
			});
		} else {
			// @ts-ignore
			toUnpinCommunities.push(community);
		}

		setState({
			modalPinnedCommunities: pinnedCommunities,
			modalToPinCommunities: toPinCommunities,
			modalToUnpinCommunities: toUnpinCommunities
		});
	}

	/**
	 * @param {Room|Tag|Club} community 
	 */
	function onAddCommunityToPin(community) {
		// Add to map to use when reordering
		pinnedCommunitiesMap.set(community.getId().toString(), community);

		let hasInToUnpinList = state.modalToUnpinCommunities.some((/** @type {Room|Tag|Club}*/item) => {
			return item.getId() == community.getId();
		});

		// Always adds it in the front of order list.
		let pinnedCommunities = [community].concat(state.modalPinnedCommunities);
		let toPinCommunities = state.modalToPinCommunities;
		let toUnpinCommunities = state.modalToUnpinCommunities;

		// If has in to unpin list then remove it,
		// this can cause from the user unpinned it, then add it again in the search modal.
		// Else just add it to to pin list.
		if (hasInToUnpinList) {
			// @ts-ignore
			toUnpinCommunities = toUnpinCommunities.filter((item) => {
				return item.getId() != community.getId();
			});
		} else {
			// @ts-ignore
			toPinCommunities.push(community);
		}

		setState({
			modalPinnedCommunities: pinnedCommunities,
			modalToPinCommunities: toPinCommunities,
			modalToUnpinCommunities: toUnpinCommunities
		});

		closeSearchModal();
	}

	/**
	 * @returns {boolean}
	 */
	function isPinningChanged() {
		return (
			state.modalToPinCommunities.length > 0 ||
			state.modalToUnpinCommunities.length > 0 ||
			state.modalCurrentPinnedCommunities.length != state.modalPinnedCommunities.length ||
			(function () {
				for (let i = 0; i < state.modalPinnedCommunities.length; i++) {
					let a = state.modalCurrentPinnedCommunities[i];
					let b = state.modalPinnedCommunities[i];
					if (a.getId() != b.getId()) {
						return true;
					}
				}
				return false;
			})()
		);
	}

	function getUpdateOrdersAPIParameters() {
		return {
			orderList: state.modalPinnedCommunities.map((community) => community.getId()),
			unpinList: state.modalToUnpinCommunities.map((community) => community.getId()),
			pinList: state.modalToPinCommunities.map((community) => community.getId())
		};
	}

	function onNoFollowedAndPinnedTags() {
		/** @type {HTMLElement} */
		// @ts-ignore
		let parentNode = tagTopContainer.parentNode;
		parentNode.insertBefore(clubTopContainer, tagTopContainer);
	}

	async function loadRooms() {
		return new Promise(function (resolve, reject) {
			const service = new NodeJsService();

			setState({
				roomLoading: true,
				roomHasError: false
			});

			service.getRecommendedRooms().then((res) => {
				setState({
					rooms: res.data.map((item) => new Room(item))
				});
				resolve(true);
			}).catch((err) => {
				setState({
					roomHasError: true
				});
				console.error(err);
				reject(err);
			}).finally(() => {
				setState({
					roomLoading: false
				});
			});
		});
	}

	async function loadTags() {
		return new Promise(function (resolve, reject) {
			const service = new NodeJsService();

			setState({
				tagLoading: true,
				tagHasError: false
			});

			service.getRecommendedTags(REQUEST_LIMIT, state.tagNextId).then((res) => {
				/** @type {Tag[]} */
				let tags = res.data.map((item) => new Tag(item));

				// Move club container before tag container
				if (state.tagNextId === null && tags.length > 0 && tags.every((tag) => {
					return !tag.isPinned && !tag.isFollowed;
				})) {
					onNoFollowedAndPinnedTags();
				}

				setState({
					tags: state.tags.concat(tags),
					tagNextId: res.next_id,
					tagEnded: res.next_id === null
				});

				resolve(true);
			}).catch((err) => {
				setState({
					tagHasError: true
				});
				console.error(err);
				reject(err);
			}).finally(() => {
				setState({
					tagLoading: false
				});
			});
		})
	}

	function loadClubs() {
		const service = new NodeJsService();

		setState({
			clubLoading: true,
			clubHasError: false
		});

		service.getClubsByPinningStatusV2("pin", REQUEST_LIMIT, state.clubNextId).then((res) => {
			let clubs = res.data.map((item) => new Club(item));
			setState({
				clubs: state.clubs.concat(clubs),
				clubNextId: res.next_id,
				clubEnded: res.next_id === null
			});
		}).catch((err) => {
			setState({
				clubHasError: true
			});
			console.error(err);
		}).finally(() => {
			setState({
				clubLoading: false
			});
		});
	}

	/**
	 * @param {CommunityType} type 
	 */
	function showSearchModal(type) {
		resetSearchCommunitiesModal(true);

		searchModal = Modal.show({
			backdrop: false,
			size: "sm",
			title: "เพิ่มรายการปักหมุด",
			useBackArrow: true,
			content: function () {
				let fragment = new DocumentFragment();

				fragment.append((function () {
					let div = document.createElement("div");
					div.className = "ptp-pos_sticky";
					div.style.top = "0";

					let div1 = document.createElement("div");
					div1.className = "pt-php-communities__search";
					div.append(div1);

					let form = document.createElement("form");
					form.className = "m-all-0 p-all-0";
					div1.append(form);

					let searchInput = document.createElement("input");
					searchInput.type = "text";
					searchInput.placeholder = "ค้นหา" + Community.getTypeName(type) + "...";
					searchInput.title = "ค้นหา";
					form.append(searchInput);

					let timer = null;

					searchInput.addEventListener("input", (e) => {
						if (searchInput.value.length == 0 || searchInput.value.length >= 2) {
							if (timer !== null) {
								clearTimeout(timer);
							}
							timer = setTimeout(() => {
								setState({
									modalSearchQuery: searchInput.value.length == 0 ? "" : searchInput.value
								});
								resetSearchCommunitiesModal(false);
								searchUnpinnedCommunities();
							}, 350);
						}
					});

					searchModalElements.searchInput = searchInput;

					return div;
				})());

				fragment.append((function () {
					let h5 = document.createElement("h5");
					h5.className = "m-lnr-16 m-t-16 m-b-8";

					let span = document.createElement("span");
					span.className = "subtitle-1 txt-purple-pantip-300";
					span.innerText = `ผลการค้นหา{communityType} ({n} รายการ)`;
					h5.append(span);

					searchModalElements.searchCountSpan = span;

					return h5;
				})());

				fragment.append((function () {
					let ul = document.createElement("ul");
					ul.className = "pt-lists pt-lists--two-line pt-lists--avatar-list p-all-0 container-hidden-show";
					ul.style.minHeight = "200px";
					searchModalElements.searchUl = ul;
					return ul;
				})());

				fragment.append((function () {
					let div = document.createElement("div");
					div.className = "p-all-16 m-tnb-8 aligncenter";
					div.style.display = "none";
					let texts = [
						"ไม่พบ",
						"{community}",
						"ที่คุณต้องการค้นหา",
						"\n",
						"โปรดลองตรวจเช็คตัวสะกดอีกครั้ง",
						"\n",
						"หรือค้นหาด้วยคำอื่น"
					];
					texts.forEach((text, i) => {
						if (text === "\n") {
							div.append(document.createElement("br"));
						} else {
							let textNode = document.createTextNode(text);
							div.append(textNode);
							if (i == 1) {
								searchModalElements.searchNoResultText = textNode;
							}
						}
					});
					searchModalElements.searchNoResultDiv = div;
					return div;
				})());

				fragment.append((function () {
					let div = document.createElement("div");
					div.setAttribute(
						"style",
						"padding: 0.75rem 0.5rem; text-align: center; line-height: 1.25rem; display: none;"
					);
					let p = document.createElement("p");
					p.innerText = "เกิดข้อผิดพลาดบางอย่าง";
					let link = document.createElement("a");
					link.href = "#";
					link.role = "button";
					link.innerHTML = "<u>ลองใหม่</u>";
					link.addEventListener("click", (e) => {
						e.preventDefault();
						setState({
							modalSearchHasError: false
						});
						searchUnpinnedCommunities();
					});
					div.append(p);
					div.append(link);
					searchModalElements.searchTryAgainDiv = div;
					return div;
				})());

				return fragment;
			},
			onClose: closeSearchModal
		});

		// At this point modal rendering is complete
		setState({
			modalSearchType: type,
			modalSearchShow: true
		});
		searchUnpinnedCommunities();

		searchModalElements.modalContentContainer = searchModal.getContainer().querySelector(".ptp-dialog__content");
		searchModalElements.modalContentContainer.addEventListener("scroll", onSearchModalScroll);
	}

	function closeSearchModal() {
		searchModal.close();
		searchModal = null;
	}

	function onSearchModalScroll() {
		if (!searchModal) {
			return console.warn("The search modal is expected to open when this method is called");
		}

		const element = searchModalElements.modalContentContainer;

		if (Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) <= 50) {
			if (!state.modalSearchIsEnded && !state.modalSearchIsLoading && !state.modalSearchHasError) {
				searchUnpinnedCommunities();
			}
		}
	}

	/**
	 * 
	 * @param {boolean} hardReset
	 */
	function resetSearchCommunitiesModal(hardReset) {
		/** @type {{ [key in keyof StateType]?: any }} */
		let ob = {};
		if (hardReset) {
			ob = {
				modalSearchShow: false,
				modalSearchType: null,
				modalSearchQuery: "",
			};
		}

		setState(Object.assign({
			modalSearchCommunities: [],
			modalSearchNextId: null,
			modalSearchRankingTime: null,
			modalSearchIsLoading: false,
			modalSearchIsEnded: false,
			modalSearchResultCount: 0,
			modalSearchHasError: false,
			modalSearchPage: 1,
		}, ob));
	}

	let requestCounter = 0;

	function searchUnpinnedCommunities() {
		const counter = ++requestCounter;
		const service = new NodeJsService();

		setState({
			modalSearchIsLoading: true,
			modalSearchHasError: false
		});

		/** @type {number[]|string[]} */
		let tempPin = state.modalToPinCommunities.map((community) => community.getId());
		/** @type {number[]|string[]} */
		let tempUnpin = state.modalToUnpinCommunities.map((community) => community.getId());

		/** @type {CommunityType} */
		// @ts-ignore
		const communityType = state.modalSearchType;
		if (communityType === null) {
			throw new Error("communityType must not be null");
		}

		let skipFinally = false;

		service.search_UnpinnedCommunities(
			communityType,
			state.modalSearchQuery,
			tempUnpin.length == 0 ? undefined : tempUnpin,
			tempPin.length == 0 ? undefined : tempPin,
			REQUEST_SEARCH_UNPINNED_LIMIT,
			undefined,
			state.modalSearchNextId === null ? undefined : state.modalSearchNextId,
			state.modalSearchRankingTime === null ? undefined : state.modalSearchRankingTime
		).then((res) => {
			// Mocking error
			// if (requestCounter % 2 == 0) {
			// 	throw new Error("this is metin's error");
			// }
			if (counter < requestCounter) {
				skipFinally = true;
				return;
			}

			if (!res.success) {
				throw new APIResponseError(res.error_code, res.error_message);
			} else {
				/** @type {Room[]|Tag[]|Club[]} */
				let communities = [];
				if (communityType == "room") {
					communities = res.data.map((entity) => new Room(entity));
				} else if (communityType == "club") {
					communities = res.data.map((entity) => new Club(entity));
				} else {
					communities = res.data.map((entity) => new Tag(entity));
				}
				/** @type {Room[]|Tag[]|Club[]} */
				let nextCommunities = state.modalSearchPage == 1 ? [] : state.modalSearchCommunities;
				// @ts-ignore
				nextCommunities = nextCommunities.concat(communities);

				// console.log("Page " + state.modalSearchPage);
				// console.log({
				// 	nextId: res.next_id,
				// 	communities: nextCommunities.length
				// });

				setState({
					modalSearchCommunities: nextCommunities,
					modalSearchIsEnded: res.next_id === null,
					modalSearchNextId: res.next_id,
					modalSearchRankingTime: res.ranking_time,
					modalSearchResultCount: res.result_count,
					modalSearchPage: state.modalSearchPage + 1
				});
			}
		}).catch((/** @type {APIResponseError} */ err) => {
			// errorModal(err);
			console.error(err);
			setState({
				modalSearchHasError: true
			});
		}).finally(() => {
			if (!skipFinally) {
				setState({
					modalSearchIsLoading: false
				});

				// This is required to trigger scroll event manually because
				// the scroll may already be at the end when loading is complete
				onSearchModalScroll();
			}
		});
	}

	let debugCounter = 1;
	/**
	 * @param {(keyof StateType)[]} keys 
	 * @param {Function|null} map
	 */
	function debugState(keys, map = null) {
		let output = {};
		for (let k of keys) {
			output[k] = state[k];
			if (map) {
				output[k] = map(output[k]);
			}
		}
		console.log("STATE DEBUG " + (debugCounter++));
		for (let [k, v] of Object.entries(output)) {
			console.log(k, v);
		}
	}

	/**
	 * @param {{ [key in keyof StateType]?: any }} objects 
	 */
	function setState(objects) {
		for (let [k, v] of Object.entries(objects)) {
			state[k] = v;
		}
		// debugState([
		// 	"modalPinnedCommunities",
		// 	"modalToPinCommunities",
		// 	"modalToUnpinCommunities"
		// ], (v) => v.map(c => c.getId()));
		// @ts-ignore
		render(Object.keys(objects));
	}

	/**
	 * @param {(keyof StateType)[]} keys 
	 */
	function render(keys) {
		/**
		 * @param {(keyof StateType)[]} watchedKeys 
		 * @returns {boolean}
		 */
		function hasChanged(watchedKeys) {
			return watchedKeys.some((key) => keys.includes(key));
		}

		if (hasChanged(["showAllRoom"])) {
			for (let node of Array.from(seeAllRoomButton.children)) {
				if (node.nodeName == "SPAN") {
					node.textContent = state.showAllRoom ? "ดูน้อยลง" : "ดูทั้งหมด";
				} else {
					node.innerHTML = state.showAllRoom ? "&#xe5ce" : "&#xe5cf";
				}
			}
		}

		if (hasChanged(["rooms", "showAllRoom", "roomLoading", "roomHasError"])) {
			if (state.roomLoading || state.roomHasError) {
				seeAllRoomButton.style.display = "none";
			} else {
				seeAllRoomButton.style.display = "flex";
			}

			roomContainer.innerHTML = "";
			if (state.roomLoading) {
				const template = document.querySelector("#communityMenuRoomLoader");

				for (let i = 0; i < (state.showAllRoom ? 38 : 8); i++) {
					/** @type {HTMLDivElement} */
					// @ts-ignore
					const clone = template.content.cloneNode(true);
					roomContainer.append(clone);
				}
			} else {
				const template = document.querySelector("#communityMenuRoomItem");
				let i = 1;
				let rooms = state.showAllRoom ? state.rooms : state.rooms.slice(0, 8);
				for (let room of rooms) {
					/** @type {HTMLDivElement} */
					// @ts-ignore
					const clone = template.content.cloneNode(true);

					/** @type {HTMLDivElement} */
					// @ts-ignore
					let div = clone.firstElementChild;
					div.classList.remove("pt-php-forum-list__pin");
					if (room.isPinned) {
						div.classList.add("pt-php-forum-list__pin");
					}

					/** @type {HTMLAnchorElement} */
					// @ts-ignore
					let link = div.firstElementChild;
					link.classList.add("gtm-forum-item" + i.toString().padStart(2, "0"));
					link.setAttribute("href", room.getUrl());
					link.setAttribute("title", room.getDescription());

					{
						/** @type {HTMLDivElement} */
						// @ts-ignore
						let div = link.querySelector("div");
						div.style.backgroundImage = `url("${room.getIconUrl()}")`;
					}

					/** @type {HTMLHeadingElement} */
					// @ts-ignore
					let h2 = link.querySelector("h2");
					h2.innerText = room.getName();

					roomContainer.append(clone);
					i++;
				}
			}
		}

		if (hasChanged(["roomHasError"])) {
			roomTryAgainContainer.style.display = state.roomHasError ? "block" : "none";
		}

		if (hasChanged(["tagLoading", "tags", "tagHasError"])) {
			if (state.tagLoading || state.tags.length > 0 || state.tagHasError) {
				tagTopContainer.style.display = "block";
			} else {
				tagTopContainer.style.display = "none";
			}
		}

		if (hasChanged(["clubLoading", "clubs", "clubHasError"])) {
			if (state.clubLoading || state.clubs.length > 0 || state.clubHasError) {
				clubTopContainer.style.display = "block";
			} else {
				clubTopContainer.style.display = "none";
			}
		}

		/** @type {{communities: Tag[]|Club[], communityContainer: HTMLElement, communityLoading: boolean, communityEnded: boolean, communityLoadMoreButton: HTMLAnchorElement, communityHasError: boolean, communityTryAgainContainer: HTMLDivElement, watchedKeys: (keyof StateType)[]}[]} */
		let items = [
			{
				communities: state.tags,
				communityContainer: tagContainer,
				communityLoading: state.tagLoading,
				communityEnded: state.tagEnded,
				communityLoadMoreButton: tagLoadMoreButton,
				communityHasError: state.tagHasError,
				communityTryAgainContainer: tagTryAgainContainer,
				watchedKeys: ["tags", "tagLoading", "tagHasError"]
			}
		];
		if (config.logged_in) {
			items.push({
				communities: state.clubs,
				communityContainer: clubContainer,
				communityLoading: state.clubLoading,
				communityEnded: state.clubEnded,
				communityLoadMoreButton: clubLoadMoreButton,
				communityHasError: state.clubHasError,
				communityTryAgainContainer: clubTryAgainContainer,
				watchedKeys: ["clubs", "clubLoading", "clubHasError"]
			});
		}

		for (let item of items) {
			let {
				communityContainer,
				communities,
				communityLoading,
				communityEnded,
				communityLoadMoreButton,
				communityHasError,
				communityTryAgainContainer,
				watchedKeys
			} = item;
			if (hasChanged(watchedKeys)) {
				{
					/** @type {HTMLDivElement} */
					// @ts-ignore
					let container = communityContainer.children[0];
					container.innerHTML = "";
					const template = document.querySelector("#communityMenuTagItem");

					for (let community of communities) {
						/** @type {HTMLDivElement} */
						// @ts-ignore
						const clone = template.content.cloneNode(true);

						/** @type {HTMLAnchorElement} */
						// @ts-ignore
						let link = clone.querySelector("a");
						link.setAttribute("href", community.getUrl());

						/** @type {HTMLElement} */
						// @ts-ignore
						let icon = link.querySelector("i");
						icon.style.display = community.isPinned ? "block" : "none";

						/** @type {HTMLSpanElement} */
						// @ts-ignore
						let spanIcon = link.querySelector(".pt-lists-item__graphic");
						spanIcon.style.backgroundImage = `url("${community.getIconUrl()}")`;

						/** @type {HTMLSpanElement} */
						// @ts-ignore
						let spanText = link.querySelector(".pt-lists-item__text");
						// @ts-ignore
						spanText.children[0].innerText = community.getName();
						// @ts-ignore
						spanText.children[1].innerText = community.getDescription();

						container.append(clone);
					}
				}

				if (communityLoading) {
					/** @type {HTMLDivElement} */
					// @ts-ignore
					let contentContainer = communityContainer.children[1];
					contentContainer.innerHTML = "";

					const template = document.querySelector("#communityMenuTagLoader");

					let count = REQUEST_LIMIT <= 4 ? REQUEST_LIMIT : 4;
					for (let i = 0; i < count; i++) {
						/** @type {HTMLDivElement} */
						// @ts-ignore
						const clone = template.content.cloneNode(true);
						contentContainer.append(clone);
					}

					contentContainer.style.display = "block";
				} else {
					/** @type {HTMLDivElement} */
					// @ts-ignore
					let contentContainer = communityContainer.children[1];
					contentContainer.style.display = "none";
				}

				if (communityLoading || communityEnded || communityHasError) {
					communityLoadMoreButton.style.display = "none";
				} else {
					communityLoadMoreButton.style.display = "flex";
				}

				communityTryAgainContainer.style.display = communityHasError ? "block" : "none";
			}
		}

		if (hasChanged([
			"isPinningModalOpened",
			"modalCurrentPinnedCommunities",
			"modalPinnedCommunities",
			"modalToPinCommunities",
			"modalToUnpinCommunities",
			"modalSaveButtonLoading",
			"modalPinningMax"
		])) {
			if (state.isPinningModalOpened) {
				/** @type {HTMLDivElement} */
				// @ts-ignore
				let contentNoData = pinningModalElements.contentNoData;
				/** @type {HTMLUListElement} */
				// @ts-ignore
				let contentHasData = pinningModalElements.contentHasData;
				/** @type {Text} */
				// @ts-ignore
				let countingText = pinningModalElements.countingText;
				/** @type {HTMLButtonElement} */
				// @ts-ignore
				let addPinningButtonBottom = pinningModalElements.addPinningButtonBottom;
				/** @type {HTMLElement} */
				// @ts-ignore
				let pinningIsFullBold = pinningModalElements.pinningIsFullBold;
				/** @type {HTMLButtonElement} */
				// @ts-ignore
				let saveButton = pinningModalElements.saveButton;

				if (state.modalPinnedCommunities.length == 0) {
					contentNoData.style.display = "block";
					contentHasData.style.display = "none";
				} else {
					contentNoData.style.display = "none";
					contentHasData.style.display = "block";

					contentHasData.innerHTML = "";

					for (let community of state.modalPinnedCommunities) {
						let li = document.createElement("li");
						li.className = "pt-lists-item pt-lists-item__border";
						li.dataset.id = community.getId().toString();
						contentHasData.append(li);

						let removeButton = document.createElement("button");
						removeButton.type = "button";
						removeButton.className = "ptp-btn btn--remove m-lnr-16";
						removeButton.title = "เอาปักหมุดออก";
						removeButton.innerHTML = `<i class="material-icons md-18"></i>`;
						removeButton.addEventListener("click", function (e) {
							onRemovePinnedCommunity(community);
						});
						li.append(removeButton);

						li.append((function () {
							let span = document.createElement("span");
							if (community instanceof Room) {
								span.className = "pt-lists-item__graphic img-thumbnail pt-block-radius-none";
								span.style.backgroundImage = `url('${community.getIconUrl()}')`;
							} else {
								span.className = "pt-lists-item__graphic img-thumbnail bg-transparent";
								span.style.backgroundImage = `url('${community.getIconUrl()}')`;
							}
							return span;
						})());

						let span = document.createElement("span");
						span.className = "pt-lists-item__text";
						li.append(span);

						span.append((function () {
							let span = document.createElement("span");
							span.className = "pt-lists-item__primary-text php-font-weight-meduim";
							span.innerText = community.getName();
							return span;
						})());

						span.append((function () {
							let span = document.createElement("span");
							span.className = "pt-lists-item__secondary-text";
							span.innerHTML = `<span class="caption">${community.getDescription()}</span>`;
							return span;
						})());

						let sortButton = document.createElement("button");
						sortButton.type = "button";
						sortButton.className = "pt-lists-item__meta ptp-btn btn--icon_circle";
						sortButton.title = "ลากและวางเพื่อย้ายลำดับ";
						sortButton.innerHTML = `<i class="material-icons">drag_handle</i>`;
						li.append(sortButton);
					}
				}

				if (state.modalPinnedCommunities.length >= state.modalPinningMax) {
					pinningIsFullBold.style.display = "block";
				} else {
					pinningIsFullBold.style.display = "none";
				}

				countingText.textContent = `จำนวน ${state.modalPinnedCommunities.length}/${state.modalPinningMax}`;

				if (
					state.modalPinnedCommunities.length == 0 ||
					state.modalPinnedCommunities.length >= state.modalPinningMax
				) {
					addPinningButtonBottom.style.display = "none";
				} else {
					addPinningButtonBottom.style.display = "flex";
				}

				saveButton.classList.remove("disabled");

				let pinningChanged = isPinningChanged();

				if (!pinningChanged || state.modalSaveButtonLoading) {
					saveButton.classList.add("disabled");
				}

				if (state.modalSaveButtonLoading) {
					saveButton.innerText = "บันทึก...";
				} else {
					saveButton.innerText = "บันทึก";
				}
			}
		}

		if (hasChanged([
			"modalSearchShow",
			"modalSearchType",
			"modalSearchCommunities",
			"modalSearchIsLoading",
			"modalSearchIsEnded",
			"modalSearchResultCount",
			"modalSearchHasError"
		])) {
			if (state.modalSearchShow) {
				/** @type {HTMLDivElement} */
				// @ts-ignore
				const searchNoResultDiv = searchModalElements.searchNoResultDiv;
				/** @type {Text} */
				// @ts-ignore
				const searchNoResultText = searchModalElements.searchNoResultText;
				/** @type {HTMLSpanElement} */
				// @ts-ignore
				const searchCountSpan = searchModalElements.searchCountSpan;
				/** @type {HTMLAnchorElement} */
				// @ts-ignore
				const searchTryAgainDiv = searchModalElements.searchTryAgainDiv;
				/** @type {HTMLUListElement} */
				// @ts-ignore
				const searchUl = searchModalElements.searchUl;
				searchUl.innerHTML = "";

				const typeName = Community.getTypeName(state.modalSearchType);

				if (state.modalSearchCommunities.length == 0 && state.modalSearchIsEnded) {
					searchNoResultDiv.style.display = "block";
					searchNoResultText.textContent = typeName;
				} else {
					searchNoResultDiv.style.display = "none";
				}

				if (state.modalSearchIsLoading) {
					searchCountSpan.innerText = "กำลังค้นหา...";
				} else if (state.modalSearchQuery.length == 0) {
					searchCountSpan.innerText = `ปักหมุด${typeName}`;
				} else {
					searchCountSpan.innerText = `ผลการค้นหา${typeName} (${state.modalSearchResultCount} รายการ)`;
				}

				if (state.modalSearchCommunities.length > 0 || state.modalSearchIsLoading) {
					searchUl.style.display = "block";

					let i = 1;
					for (let community of state.modalSearchCommunities) {
						let li = document.createElement("li");
						li.className = "pt-lists-item pt-lists-item__border";

						if (DEBUG_SEARCH_PAGE_BORDER) {
							if (i++ % REQUEST_SEARCH_UNPINNED_LIMIT == 0) {
								li.style.borderBottom = "red 2px solid";
							}
						}

						li.append((function () {
							let span = document.createElement("span");
							if (community instanceof Room) {
								span.className = "pt-lists-item__graphic img-thumbnail pt-block-radius-none m-l-16";
								span.style.backgroundImage = `url('${community.getIconUrl()}')`;
							} else {
								span.className = "pt-lists-item__graphic img-thumbnail bg-transparent m-l-16";
								span.style.backgroundImage = `url('${community.getIconUrl()}')`;
							}
							return span;
						})());

						let span = document.createElement("span");
						span.className = "pt-lists-item__text";
						li.append(span);

						span.append((function () {
							let span = document.createElement("span");
							span.className = "pt-lists-item__primary-text php-font-weight-meduim";
							span.innerText = community.getName();
							return span;
						})());

						span.append((function () {
							let description = (() => {
								if (community instanceof Room && community.hasTags()) {
									return community.getHasTagDescription();
								} else {
									return community.getDescription();
								}
							})();

							let span = document.createElement("span");
							span.className = "pt-lists-item__secondary-text";
							span.innerHTML = `<span class="caption">${description}</span>`;
							return span;
						})());

						let button = document.createElement("button");
						button.className = "pt-lists-item__meta ptp-btn btn--icon_circle";
						button.title = "เพิ่มไปในรายการปักหมุด";
						button.innerHTML = `<i class="material-icons">add</i>`;
						button.addEventListener("click", (e) => {
							onAddCommunityToPin(community);
						});
						li.append(button);

						searchUl.append(li);
					}

					if (state.modalSearchIsLoading) {
						for (let i = 0; i < 10; i++) {
							let li = document.createElement("li");
							li.className = "pt-lists-item pt-lists-item__border";

							let link = document.createElement("a");
							link.role = "button";
							link.className = "pt-pointer-none";

							let span = document.createElement("span");
							if (state.modalSearchType == "room") {
								span.className = "pt-lists-item__graphic img-thumbnail pt-block-radius-none pt-loader";
							} else {
								span.className = "pt-lists-item__graphic img-thumbnail pt-loader";
							}

							link.append(span);

							link.append((function () {
								let span = document.createElement("span");
								span.className = "pt-lists-item__text align-self-center";
								span.innerHTML = `<div class="pt-loader pt-loader__txt-primary pt-loader__width75 m-b-8"></div>
								<div class="pt-loader pt-loader__txt-secondary pt-loader__width50"></div>`;
								return span;
							})());

							let div = document.createElement("div");
							div.className = "pt-block-relative m-r-12 pt-loader";

							li.append(link);
							li.append(div);

							searchUl.append(li);
						}
					}
				} else {
					searchUl.style.display = "none";
				}

				if (state.modalSearchHasError) {
					searchTryAgainDiv.style.display = "block";
				} else {
					searchTryAgainDiv.style.display = "none";
				}
			}
		}
	}

	document.addEventListener("DOMContentLoaded", init);
}));