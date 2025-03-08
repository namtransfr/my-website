const givePointMaxLimit = 25
const givePointValidTypes = ['topic', 'bestanswer', 'topcomment', 'comment']
let givePointMemberListNextId = ''

$(document).ready(function () {
	$(document).on('click', 'div[data-give-point-id="give-point-button"]', handleClickGivePoint)
	$(document).on('click', 'a[data-give-point-id="give-point-list-btn"]', handleClickGivePointAllMembers)
	// $(document).on('click','a[id="give-point-member-loadmore"]',handleGivPointLoadmoreAllMembers)
})

/** Handle click give point button function.
 * @async
 * @param {MouseEvent} e
 */
async function handleClickGivePoint(e) {
	if (e.currentTarget.classList.contains('disable')) return
	document
		.querySelectorAll('div[data-give-point-id="give-point-button"]')
		.forEach((el) => el.classList.add('pt-pointer-none'))

	const topicId = location.pathname.split('/')[2]
	const arr = $(this).parents('.display-post-wrapper').attr('id').split('-')
	const type = arr[0] === 'topic' ? arr[0] : 'comment'
	const commentId = arr[0] === 'topic' ? 0 : arr[1]

	try {
		const response = await getGivePointStatus({ topicId, commentId, type })
		if (!response.success) {
			if (response.message == 'notlogin') return noLoggedInModal()

			return apiErrorModal({
				errorTitle: response?.error_title,
				errorMessage: response?.error_message,
				errorTextLink: response?.error_text_link,
				errorLinkUrl: response?.error_link_url,
				errorLinkTarget: response?.error_link_target,
			})
		}

		if (!!response?.data?.given_point && response?.data?.given_point >= givePointMaxLimit) return

		const avatarImg = response?.data?.avatar?.medium || 'https://ptcdn.info/images/avatar_member_default.png'
		const authorNickname = response?.data?.author_nickname || ''
		const anonymous = response?.data?.anonymous || false
		const userPoint = response?.data?.point || 0
		const givenPoint = response?.data?.point_given || 0
		const remainTransferPoint = response?.data?.point_remain_transfer || 0

		return givePointFormModal({
			topicId,
			commentId,
			type,
			authorNickname,
			anonymous,
			avatarImg,
			userPoint,
			givenPoint,
			remainTransferPoint,
		})
	} catch (error) {
		apiCatchErrorModal(error)
	} finally {
		document
			.querySelectorAll('div[data-give-point-id="give-point-button"]')
			.forEach((el) => el.classList.remove('pt-pointer-none'))
	}
}

async function handleClickGivePointAllMembers(e) {
	if (e.currentTarget.classList.contains('disable')) return

	document
		.querySelectorAll('a[data-give-point-id="give-point-list-btn"]')
		.forEach((el) => el.classList.add('pt-pointer-none'))

	const topicId = location.pathname.split('/')[2]
	const arr = $(this).parents('.display-post-wrapper').attr('id').split('-')
	const type = arr[0] === 'topic' ? arr[0] : 'comment'
	const commentId = arr[0] === 'topic' ? 0 : arr[1]
	
	try {
		const response = await getGivePointMemberList({ topicId, commentId, type })

		const res = response?.success ? response?.data : []

		return memberListModal({topicId, commentId, type, memberList:res, next_id:response?.next_id || ''})

	} catch (error) {
		return apiErrorModal({
			errorTitle : 'เกิดข้อผิดพลาด',
			errorMessage : 'ขออภัยมีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง',
			errorTextLink : '',
			errorLinkUrl : '',
			errorLinkTarget : '',
		})
	} finally {
		document
		.querySelectorAll('a[data-give-point-id="give-point-list-btn"]')
		.forEach((el) => el.classList.remove('pt-pointer-none'))
	}
	
	// console.log(topicId,type,commentId)

}

/** Show modal login warning function. */
function noLoggedInModal() {
	GivePointModal.info({
		backdrop: false,
		title: `ยังไม่ได้เข้าสู่ระบบ`,
		content: 'คุณต้องเข้าสู่ระบบเพื่อดำเนินการต่อ',
		acknowledgeText: 'เข้าสู่ระบบ',
		onAcknowledge: () => requireLogin(window.location.href),
	})
}

/** Show modal catch error warning function.
 * @param {Error} error
 */
function apiCatchErrorModal(error) {
	GivePointModal.info({
		backdrop: false,
		title: `ไม่สามารถให้พอยต์ได้ในขณะนี้`,
		content: 'ขออภัยมีบางอย่างผิดพลาด ไม่สามารถให้พอยต์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง',
		acknowledgeText: 'ตกลง',
		onAcknowledge: (close) => close(),
	})
}

/**
 * @typedef {object} ApiErrorModalArgs
 * @property {string} errorTitle - ข้อความหัวกล่อง
 * @property {string} errorMessage - ข้อความในกล่อง
 * @property {string} errorTextLink - ข้อความลิงค์
 * @property {string} errorLinkUrl - ข้อความลิงค์ที่อยู่
 * @property {string} errorLinkTarget - สำหรับ attribute target
 */
/** Show modal API error warning function.
 * @param {ApiErrorModalArgs} data
 */
function apiErrorModal(data) {
	const {
		errorTitle = 'ไม่สามารถให้พอยต์ได้ในขณะนี้',
		errorMessage = 'ขออภัยมีบางอย่างผิดพลาด ไม่สามารถให้พอยต์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง',
		errorTextLink = '',
		errorLinkUrl = '',
		errorLinkTarget = '',
	} = data

	GivePointModal.show({
		backdrop: false,
		title: errorTitle,
		content: function (close) {
			const fragment = new DocumentFragment()

			fragment.append(
				(function () {
					const section = document.createElement('section')
					section.innerText = errorMessage

					if (errorTextLink && errorLinkUrl) {
						const linkContainer = document.createElement('div')
						linkContainer.className = 'm-t-16 subtitle-1 link-purple'

						const link = document.createElement('a')
						link.href = errorLinkUrl
						link.title = errorTextLink
						link.innerText = errorTextLink
						if (errorLinkTarget) link.target = errorLinkTarget

						linkContainer.append(link)
						section.append(linkContainer)
					}

					return section
				})()
			)

			return fragment
		},
		bottom: function (close) {
			const fragment = new DocumentFragment()

			const span = document.createElement('span')
			span.className = 'pt-sm-toggle-show txt-secondary'

			const closeButton = document.createElement('button')
			closeButton.type = 'button'
			closeButton.className = 'btn btn-primary'
			closeButton.title = 'ปิด'
			closeButton.innerText = 'ปิด'
			closeButton.addEventListener('click', function () {
				close()
			})

			fragment.append(span)
			fragment.append(closeButton)

			return fragment
		},
	})
}

/**
 * @typedef {object} GivePointFormModalArgs
 * @property {string} authorNickname - นามแฝงผู้เขียนกระทู้/ความเห็น
 * @property {boolean} anonymous
 * @property {string} avatarImg - ภาพประจำตัวของผู้ใช้งาน
 * @property {number} userPoint - จำนวนพอยต์ที่ผู้ใช้งานมีอยู่
 * @property {number} givenPoint จำนวนพอยต์ที่ให้กระทู้/ความเห็นไปแล้ว
 * @property {number} remainTransferPoint - จำนวนคงเหลือพอยต์ที่ให้ได้
 */
/** Show modal give point function.
 * @param {GivePointFormModalArgs} data
 */
function givePointFormModal(data) {
	const { authorNickname, anonymous, avatarImg, userPoint, givenPoint, remainTransferPoint } = data

	let selectedPoint = 0
	let anonymousValue = false
	const pointList = [5, 10, 15, 20, 25]
	const givePointIconImg = 'https://ptcdn.info/icon/icon-give-point-color.svg'

	GivePointModal.show({
		backdrop: false,
		title: `ให้พอยต์เพื่อเป็นกำลังใจ`,
		content: function (close) {
			const fragment = new DocumentFragment()
			fragment.append(
				(function () {
					const section = document.createElement('section')

					const infoContainer = document.createElement('div')
					infoContainer.className = 'text-infornation_give_point'
					infoContainer.innerText = 'คุณสามารถให้พอยต์ได้สูงสุด 25 พอยต์ ต่อโพสต์หลัก หรือ ความคิดเห็น '

					const moreLink = document.createElement('a')
					moreLink.setAttribute('href', 'https://pantip.com/s/POMh6') // เปลี่ยนเป็น link กระทู้การใช้งาน give point จาก content
					moreLink.setAttribute('title', 'ดูเพิ่มเติม')
					moreLink.setAttribute('target', '_blank')
					moreLink.innerText = 'ดูเพิ่มเติม'

					infoContainer.append(moreLink)

					const toContainer = document.createElement('div')
					const toHeadline = document.createElement('div')
					toHeadline.innerText = 'เลือกจำนวนพอยต์ที่ต้องการจะให้กับ:'

					const toNickname = document.createElement('div')
					toNickname.className = 'php-txt-primary'
					toNickname.innerText = authorNickname

					toContainer.append(toHeadline, toNickname)
					section.append(infoContainer, toContainer)

					if (givenPoint > 0) {
						const givenWarnContainer = document.createElement('div')
						givenWarnContainer.className = 'give-more'
						givenWarnContainer.innerText = `ให้ไปแล้วจำนวน ${givenPoint} พอยต์ (ให้ได้อีก ${remainTransferPoint} พอยต์)`
						section.append(givenWarnContainer)
					}

					const listButtonContainer = document.createElement('div')
					listButtonContainer.className = 'list-bt-give-point'
					pointList.forEach((point) => {
						const pointButton = document.createElement('div')
						pointButton.className = 'select-point'
						if (userPoint > 0 && point <= remainTransferPoint) {
							pointButton.addEventListener('click', function (e) {
								;[...document.querySelectorAll('div.select-point')].forEach((btn) =>
									btn.classList.remove('active')
								)

								const customPointInput = document.getElementById('give-point-input-point')
								customPointInput.value = ''
								pointButton.classList.add('active')

								const givePointButton = document.getElementById('give-point-button')
								givePointButton.disabled = false
								givePointButton.innerText = `ส่ง ${point} พอยต์`
								document.querySelector('div.textNote').style.display = 'none'
								selectedPoint = point
							})
						} else {
							pointButton.classList.add('disabled')
						}

						const pointLink = document.createElement('a')
						pointLink.href = '#'
						pointLink.title = `${point} พอยต์`
						pointLink.addEventListener('click', function (e) {
							e.preventDefault()
						})

						const pointIconContainer = document.createElement('span')
						pointIconContainer.className = 'select-point-icon'
						pointIconContainer.innerHTML = `<img src="${givePointIconImg}" width="24" height="24" alt="${point} พอยต์">`

						const pointText = document.createElement('span')
						pointText.innerText = point

						pointLink.append(pointIconContainer, pointText)
						pointButton.append(pointLink)
						listButtonContainer.append(pointButton)
					})

					const customPointButton = document.createElement('div')
					customPointButton.className = 'select-point'

					customPointLink = document.createElement('a')
					customPointLink.href = '#'
					customPointLink.title = 'ระบุ'
					customPointLink.addEventListener('click', function (e) {
						e.preventDefault()
					})

					const customPointIconContainer = document.createElement('span')
					customPointIconContainer.className = 'select-point-icon'
					customPointIconContainer.innerHTML = `<img src="${givePointIconImg}" width="24" height="24" alt="ระบุ">`

					const customPointInputContainer = document.createElement('span')
					const customPointInput = document.createElement('input')
					customPointInput.id = 'give-point-input-point'
					customPointInput.type = 'text'
					customPointInput.className = 'input-point'
					customPointInput.placeholder = 'ระบุ'
					customPointInput.setAttribute('autocomplete', 'off')
					if (userPoint > 0 && remainTransferPoint > 0) {
						customPointInput.addEventListener('input', function (e) {
							const inputElement = this
							const givePointButton = document.getElementById('give-point-button')

							inputValue = parseInt(e.target.value.replace(/[^0-9]/g, ''))
							inputElement.value =
								inputValue > remainTransferPoint ? remainTransferPoint : inputValue || ''
							document.querySelector('div.textNote').style.display =
								inputValue > remainTransferPoint ? 'block' : 'none'
							isInputValid =
								!!e.target.value &&
								!isNaN(e.target.value) &&
								e.target.value > 0 &&
								e.target.value <= remainTransferPoint

							givePointButton.disabled = !isInputValid || !e.target.value
							givePointButton.innerText = isInputValid ? `ส่ง ${e.target.value} พอยต์` : 'ส่งพอยต์'
							selectedPoint = isInputValid ? e.target.value : 0
						})

						customPointButton.addEventListener('click', function (e) {
							const givePointButton = document.getElementById('give-point-button')

							;[...document.querySelectorAll('div.select-point')].forEach((btn) =>
								btn.classList.remove('active')
							)
							customPointButton.classList.add('active')
							customPointInput.focus()

							if (!!customPointInput.value && customPointInput.value > 0) {
								givePointButton.disabled = false
								givePointButton.innerText = `ส่ง ${customPointInput.value} พอยต์`
							} else {
								givePointButton.disabled = true
								givePointButton.innerText = `ส่งพอยต์`
								selectedPoint = 0
							}
						})
					} else {
						customPointButton.classList.add('disabled')
					}

					customPointInputContainer.append(customPointInput)

					customPointLink.append(customPointIconContainer, customPointInputContainer)
					customPointButton.append(customPointLink)
					listButtonContainer.append(customPointButton)
					section.append(listButtonContainer)

					const limitPointWarn = document.createElement('div')
					limitPointWarn.className = 'textNote'
					limitPointWarn.innerText = 'ไม่สามารถระบุจำนวนพอยต์เกินจำนวนสูงสุดได้'
					limitPointWarn.style.display = 'none'
					section.append(limitPointWarn)

					const anonymousSection = document.createElement('div')
					anonymousSection.className = 'pt-form-section anonymous-check'

					anonymousLabel = document.createElement('label')
					anonymousLabel.className = 'col-md-6 col-lg-3 pt-lists-item__checkbox align-items-center'

					const checkboxContainer = document.createElement('div')
					checkboxContainer.className = 'pt-lists-item__form pure-material-checkbox'

					const checkbox = document.createElement('input')
					checkbox.id = 'give-point-input-anonymous'
					checkbox.type = 'checkbox'
					if (givenPoint < 1) {
						checkbox.addEventListener('change', function (e) {
							anonymousValue = e.target.checked
						})
					} else {
						checkbox.disabled = true
						checkbox.checked = anonymous
					}

					const checkboxSpan = document.createElement('span')
					checkboxSpan.innerText = 'checkbox'

					const checkboxText = document.createElement('span')
					checkboxText.className = 'pt-lists-item__text align-self-center'
					checkboxText.innerText = 'ไม่ต้องการระบุตัวตน'

					checkboxContainer.append(checkbox, checkboxSpan)
					anonymousLabel.append(checkboxContainer, checkboxText)
					anonymousSection.append(anonymousLabel)
					section.append(anonymousSection)

					return section
				})()
			)

			return fragment
		},
		bottom: function (close) {
			const fragment = new DocumentFragment()

			const span = document.createElement('span')
			span.className = 'pt-sm-toggle-show txt-secondary'

			const avatarContainer = document.createElement('span')
			avatarContainer.className = 'your-point'
			avatarContainer.innerHTML = `<img src="${avatarImg}">`

			const textContainer = document.createElement('span')
			textContainer.className = 'text-primary'
			textContainer.innerHTML = ` คุณมี <span class="yellow-text">${userPoint}</span> พอยต์`
			span.append(avatarContainer, textContainer)

			const givePointButton = document.createElement('button')
			givePointButton.id = 'give-point-button'
			givePointButton.type = 'button'
			givePointButton.className = 'btn btn-primary'
			givePointButton.title = 'ส่งพอยต์'
			givePointButton.innerText = 'ส่งพอยต์'
			givePointButton.disabled = true
			givePointButton.addEventListener('click', async (event) => {
				const { topicId, commentId, type } = data
				const isValidType = givePointValidTypes.includes(type)
				const isTopic = type === 'topic'

				if (selectedPoint < 1 || !isValidType) return

				try {
					document.querySelector('div.pt-dialog__box').classList.add('pt-pointer-none')
					event.target.classList.add('loading', 'loading_linear-circle')

					const response = await givePoint({
						topicId,
						commentId: isTopic ? 0 : commentId,
						type: isTopic ? type : 'comment',
						point: selectedPoint,
						anonymous: anonymousValue,
					})

					if (!response.success) {
						if (response.message == 'notlogin') return noLoggedInModal()

						return apiErrorModal({
							errorTitle: response?.error_title,
							errorMessage: response?.error_message,
							errorTextLink: response?.error_text_link,
							errorLinkUrl: response?.error_link_url,
							errorLinkTarget: response?.error_link_target,
						})
					}

					GivePointModal.info({
						backdrop: false,
						title: 'ให้พอยต์สำเร็จ',
						content: `ให้พอยต์ ${authorNickname} จำนวน ${selectedPoint} พอยต์เรียบร้อยแล้ว`,
						acknowledgeText: 'ปิด',
						onAcknowledge: (close) => close(),
					})

					updateGivePointList({
						topicId,
						commentId,
						type,
						givenPoint: response?.data?.given_point || 0,
						latest: response?.data?.latest?.length > 0 ? response?.data?.latest : [],
						hasMore: response?.data?.has_more || false,
						displayTotal: response?.data?.display_total || '',
					})
				} catch (error) {
					apiCatchErrorModal(error)
				} finally {
					close()
				}
			})

			fragment.append(span)
			fragment.append(givePointButton)
			return fragment
		},
		onClose: (close) => {
			close()
		},
	})
}

function memberListModal(data) {
	const { memberList, next_id } = data

	document.documentElement.style.overflow = 'hidden'

	// console.log(data)
	GivePointModal.show_padding_zero({
		backdrop: false,
		title: 'ได้รับพอยต์จาก',
		content: function (close) {
			const fragment = new DocumentFragment()

			fragment.append(
				(function () {
					const section = document.createElement('section')

					const ulContainer = document.createElement('ul')
					ulContainer.className = 'pt-lists pt-lists--avatar-list list-all-give-point'
					ulContainer.id = 'list-give-point-member'

					if (memberList && memberList.length > 0) {

						memberList.forEach((item) => {
							const liList = document.createElement('li')
							const aLink = document.createElement('a')
							liList.className = 'pt-lists-item'
							aLink.href = item?.link_url ? item?.link_url : 'javascript:void();'
							aLink.title = item?.title_text || ''
							if (item?.link_url) {
								aLink.setAttribute('target', '_blank')
							}
		
							const spanThumbnail = document.createElement('span')
							const spanNickname = document.createElement('span')
							const spanPoint = document.createElement('span')
							const iconNoti = document.createElement('i')
							const img = document.createElement('img')
							spanNickname.className = 'pt-lists-item__text font-weight-meduim'
							spanPoint.className = 'pt-lists-item__meta caption txt-secondary'
							spanThumbnail.className = 'pt-lists-item__graphic img-thumbnail'
							iconNoti.className = 'pt-lists-item__icon-noti'
							img.src = 'https://ptcdn.info/icon/icon-give-point-color.svg'
							img.alt = 'พันทิปพอยต์'
							spanThumbnail.style.backgroundImage = `url("${item?.avatar?.medium}")` || ''
	
							spanNickname.innerText = item.disp_nickname || ''
							spanPoint.innerText = `${item.point_summary} พอยต์` || ''
							iconNoti.append(img)
	
							aLink.append(spanThumbnail, iconNoti, spanNickname, spanPoint)
							liList.append(aLink)
							ulContainer.append(liList)
						})
					
					}

					const buttonLoadmore = next_id ? memberListLoadmore(data) : new DocumentFragment()

					section.append(ulContainer,buttonLoadmore)

					return section
				})()
			)

			return fragment
		},
		bottom: function (close) {
			const fragment = new DocumentFragment()

			const span = document.createElement('span')
			span.className = 'pt-sm-toggle-show txt-secondary'

			const closeButton = document.createElement('button')
			closeButton.type = 'button'
			closeButton.className = 'btn btn-primary'
			closeButton.title = 'ปิด'
			closeButton.innerText = 'ปิด'
			closeButton.addEventListener('click', function () {
				document.documentElement.style.overflow = ''
				close()
			})

			fragment.append(span)
			fragment.append(closeButton)

			return fragment
		},
	})
}

function renderMemberListLoadmore(listMember) {
	
					const ulContainer = document.getElementById('list-give-point-member')

					if (listMember && listMember.length > 0) {

						listMember.forEach((item) => {
							const liList = document.createElement('li')
							const aLink = document.createElement('a')
							liList.className = 'pt-lists-item'
							aLink.href = item?.link_url ? item?.link_url : 'javascript:void();'
							aLink.title = item?.title_text || ''
							if (item?.link_url) {
								aLink.setAttribute('target', '_blank')
							}
		
							const spanThumbnail = document.createElement('span')
							const spanNickname = document.createElement('span')
							const spanPoint = document.createElement('span')
							const iconNoti = document.createElement('i')
							const img = document.createElement('img')
							spanNickname.className = 'pt-lists-item__text font-weight-meduim'
							spanPoint.className = 'pt-lists-item__meta caption txt-secondary'
							spanThumbnail.className = 'pt-lists-item__graphic img-thumbnail'
							iconNoti.className = 'pt-lists-item__icon-noti'
							img.src = 'https://ptcdn.info/icon/icon-give-point-color.svg'
							img.alt = 'พันทิปพอยต์'
							spanThumbnail.style.backgroundImage = `url("${item?.avatar?.medium}")` || ''
	
							spanNickname.innerText = item.disp_nickname || ''
							spanPoint.innerText = `${item.point_summary} พอยต์` || ''
							iconNoti.append(img)
	
							aLink.append(spanThumbnail, iconNoti, spanNickname, spanPoint)
							liList.append(aLink)
							ulContainer.append(liList)
						})
					
					}
}

function memberListLoadmore(data) {

	const { next_id } = data
		
	// btn loadmore
	const loadmoreBtn = document.createElement('a')
	const iconLoadmoreLeft = document.createElement('i')
	const iconLoadmoreRight = document.createElement('i')
	loadmoreBtn.className = 'pt-php-link__more'
	loadmoreBtn.id = 'give-point-member-loadmore'
	iconLoadmoreLeft.className = 'material-icons md-18 m-r-8'
	iconLoadmoreRight.className = 'material-icons md-18 m-r-8'
	iconLoadmoreLeft.innerText = ''
	iconLoadmoreRight.innerText = ''
	loadmoreBtn.append(iconLoadmoreLeft, 'ดูเพิ่มเติม', iconLoadmoreRight)
	loadmoreBtn.href = '#nogo'

	loadmoreBtn.addEventListener('click', async function () {
		// console.log(next_id + ' : before fetch');
	
		const loadmoreElement = document.getElementById('give-point-member-loadmore');
	
		// Check if the element exists before accessing its properties
		if (loadmoreElement && loadmoreElement.classList.contains('disable')) return;
	
		try {
			if (loadmoreElement) {
				loadmoreElement.classList.add('disable');
			}
	
			const response = await getGivePointMemberList(data);
	
			if (response?.success) {
				if (response?.data.length > 0) {
					renderMemberListLoadmore(response?.data || []);
				}
	
				// console.log(response?.next_id + ' : fetch');
	
				data.next_id = response?.next_id;
	
				if (!response?.next_id && loadmoreElement) {
					loadmoreElement.remove();
				} else if (response?.next_id) {
					memberListLoadmore(data);
				}
			} else {
				return apiErrorModal({
					errorTitle: response?.error_title,
					errorMessage: response?.error_message,
					errorTextLink: response?.error_text_link,
					errorLinkUrl: response?.error_link_url,
					errorLinkTarget: response?.error_link_target,
				});
			}
		} catch (error) {
			return apiErrorModal({
				errorTitle: 'เกิดข้อผิดพลาด',
				errorMessage: 'ขออภัยมีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง',
				errorTextLink: '',
				errorLinkUrl: '',
				errorLinkTarget: '',
			});
		} finally {
			if (loadmoreElement) {
				loadmoreElement.classList.remove('disable');
			}
		}
	});
	

	return loadmoreBtn
	
}

function handleGivPointLoadmoreAllMembers(e) {
	alert('test')	
}

/**
 * @typedef {object} Latest
 * @property {boolean} anonymous
 * @property {string} disp_nickname
 * @property {null | number} member_id
 * @property {number} point_summary
 */
/**
 * @typedef {object} GivePointListArgs
 * @property {number} topicId
 * @property {number} commentId
 * @property {'topic' | 'comment'} type
 * @property {number} givenPoint - จำนวนพอยต์ที่ให้กระทู้/ความเห็นไปแล้ว
 * @property {Latest[]} latest - รายการผู้ให้พอยต์กระทู้/ความเห็นล่าสุด
 * @property {boolean} hasMore - สำหรับปุ่มดูเพิ่มเติม
 * @property {string} displayTotal - จำนวนพอยต์ที่ให้กระทู้/ความเห็นจัดฟอร์แมตเป็น 1K, 2.5M
 */
/** Render update give point list function.
 * @param {GivePointListArgs} data
 */
function updateGivePointList(data) {
	const { topicId, commentId, type, givenPoint = 0, latest = [], hasMore = false, displayTotal = '' } = data

	const updateIds =
		type === 'topic' ? [`${type}-${topicId}`] : givePointValidTypes.map((type) => `${type}-${commentId}`)
	const fragment = new DocumentFragment()

	latest.forEach((item) => {
		const givePointChipContainer = document.createElement('div')
		givePointChipContainer.className = 'display-bt-give_point'

		const givePointChipLink = document.createElement('a')
		givePointChipLink.className = 'give-point-bt'
		// givePointChipLink.setAttribute('data-give-point-id','give-point-list-btn')
		givePointChipLink.href = item.anonymous ? 'javascript:void(0);' : `/profile/${item.member_id}`
		givePointChipLink.title = `${item.disp_nickname} ให้ ${item.point_summary} พอยต์`
		if (item.anonymous) {
			givePointChipLink.addEventListener('click', function (e) {
				e.preventDefault()
			})
		} else {
			givePointChipLink.setAttribute('target', '_blank')
		}

		const givePointIconContainer = document.createElement('span')
		givePointIconContainer.className = 'give-point-bt-icon'

		const iconPointSpan = document.createElement('span')
		iconPointSpan.className = 'icon-point'

		const textPointSpan = document.createElement('span')
		textPointSpan.className = 'text-point'
		textPointSpan.innerText = ` ${item.point_summary}`

		const iconTriangleSpan = document.createElement('span')
		iconTriangleSpan.className = 'icon-triangle'
		givePointIconContainer.append(iconPointSpan, textPointSpan, iconTriangleSpan)

		const nicknameSpan = document.createElement('span')
		nicknameSpan.className = 'txt-give-point'
		nicknameSpan.innerText = item.disp_nickname

		givePointChipLink.append(givePointIconContainer, nicknameSpan)
		givePointChipContainer.append(givePointChipLink)
		fragment.append(givePointChipContainer)
	})
	if (hasMore) {
		const moreButtonContainer = document.createElement('div')
		moreButtonContainer.className = 'display-bt-give_point'
		const moreLink = document.createElement('a')
		moreLink.className = 'give-point-bt'
		moreLink.setAttribute('href', 'javascript:void(0);')
		moreLink.setAttribute('title', 'ดูเพิ่มเติม')
		moreLink.setAttribute('data-give-point-id','give-point-list-btn')
		moreLink.addEventListener('click', function (e) {
			e.preventDefault()
		})
		const morePointTextContainer = document.createElement('span')
		morePointTextContainer.className = 'give-point-bt-icon'
		const spanIcon = document.createElement('span')
		spanIcon.className = 'icon-point'
		const textSpan = document.createElement('span')
		textSpan.className = 'text-poin'
		textSpan.innerText = displayTotal || ''
		const triangleSpan = document.createElement('icon-triangle')
		triangleSpan.className = 'icon-triangle'
		morePointTextContainer.append(spanIcon, textSpan, triangleSpan)
		const spanTextMore = document.createElement('span')
		spanTextMore.className = 'txt-give-point'
		spanTextMore.innerText = 'ดูทั้งหมด'
		moreLink.append(morePointTextContainer, spanTextMore)
		moreButtonContainer.append(moreLink)
		fragment.append(moreButtonContainer)
	}
	updateIds.forEach((id, index) => {
		targetEl = document.getElementById(id)
		if (!targetEl) return
		const pointButtonEl = targetEl.querySelector('div[data-give-point-id="give-point-button"]')
		if (givenPoint > 0 && givenPoint < givePointMaxLimit) {
			if (!pointButtonEl.classList.contains('active')) pointButtonEl.classList.add('active')
		} else if (givenPoint >= givePointMaxLimit) {
			if (pointButtonEl.classList.contains('active')) pointButtonEl.classList.remove('active')
			if (!pointButtonEl.classList.contains('disable')) pointButtonEl.classList.add('disable')
			pointButtonEl.removeAttribute('data-give-point-id')
		}
		const pointListEl = targetEl.getElementsByClassName('give-point-list')[0]
		index + 1 == updateIds.length
			? pointListEl.replaceChildren(fragment)
			: pointListEl.replaceChildren(fragment.cloneNode(true))
	})
}

/**
 * @typedef {object} NotLoggedInError
 * @property {false} success
 * @property {'notlogin'} message
 * @property {150} result
 */
/**
 * @typedef {object} ResponseError
 * @property {false} success
 * @property {string} error_title
 * @property {string} error_message
 * @property {string} error_link_url
 * @property {string} error_text_link
 * @property {string} error_link_target
 */

/**
 * @typedef {object} GivePointStatusArgs
 * @property {number} topicId
 * @property {number} commentId
 * @property {'topic' | 'comment'} type
 */
/**
 * @typedef {object} GivePointStatusResponse
 * @property {true} success
 * @property {{ anonymous: boolean, author_nickname: string, avatar: { original: string, small: string, medium: string, large: string } | {}, point: number, point_given: number, point_given_remain_transfer: number, point_remain_transfer: number, point_remain_transter_per_day: number }} data
 */
/** Service check give point status function.
 * @async
 * @param {GivePointStatusArgs} data
 * @returns {Promise<NotLoggedInError | ResponseError | GivePointStatusResponse>}
 */
async function getGivePointStatus(data) {
	const { topicId, commentId, type } = data
	const queryParams = new URLSearchParams({ topic_id: topicId, comment_id: commentId, type, ts: Date.now() })
	const apiUrl = `/forum/topic/give_point_status?${queryParams}`
	const response = await fetchWithTimeout(apiUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return response.json()
}

/**
 * @typedef {object} GivePointArgs
 * @property {number} topicId
 * @property {number} commentId
 * @property {'topic' | 'comment'} type
 * @property {number} point
 * @property {boolean} anonymous
 */
/**
 * @typedef {object} GivePointResponse
 * @property {true} success
 * @property {{ display_total: string, given_point: number, has_more: boolean, latest: Latest, total: number }} data
 */
/** Service give point function.
 * @async
 * @param {GivePointArgs} data
 * @returns {Promise<NotLoggedInError | ResponseError | GivePointResponse>}
 */
async function givePoint(data) {
	const { topicId, commentId, type, point, anonymous } = data
	const body = { topic_id: topicId, comment_id: commentId, type, point, anonymous, ts: Date.now() }
	const apiUrl = `/forum/topic/give_point`
	const response = await fetchWithTimeout(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
	return response.json()
}

/**
 * @typedef {object} ResponseError
 * @property {false} success
 * @property {string} error_title
 * @property {string} error_message
 * @property {string} error_link_url
 * @property {string} error_text_link
 * @property {string} error_link_target
 */

/**
 * @typedef {object} GivePointMemberListArgs
 * @property {number} topicId
 * @property {number} commentId
 * @property {'topic' | 'comment'} type
 */
/**
 * @typedef {object} GivePointMemberListResponse
 * @property {true} success
 * @property {[{_id: string, member_id: number, to_member_id: number, topic_id: number, comment_id: number, type: string, anonymous: boolean, nickname: string, display_name: string, avatar: string, created_time: Date, updated_time: Date }]} data
 * @property {string} next_id
 */
/** Service get give point member list function.
 * @async
 * @param {GivePointMemberListArgs} data
 * @returns {Promise<ResponseError | GivePointMemberListResponse>}
 */

async function getGivePointMemberList(data) {
	const { topicId, commentId, type, next_id = '' } = data
	let queryParams
	if (next_id) queryParams = new URLSearchParams({ topic_id: topicId, comment_id: commentId, type, next_id, ts: Date.now() })
	else queryParams = new URLSearchParams({ topic_id: topicId, comment_id: commentId, type, ts: Date.now() })
	const apiUrl = `/forum/topic/give_member_list?${queryParams}`
	const response = await fetch(apiUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Basic dGVzdGVyOnRlc3Rlcg==',
			'ptauthorize': 'Basic dGVzdGVyOnRlc3Rlcg=='
		},
	})
	return response.json()
}

/** fetch with timeout function.
 * @async
 * @param {RequestInfo | URL} url
 * @param {RequestInit | undefined} opts
 * @param {number | undefined} timeout
 */
async function fetchWithTimeout(url, opts = {}, timeout = 15_000) {
	const controller = new AbortController()
	const { signal } = controller

	const _fetchPromise = fetch(url, { ...opts, signal })

	const timer = setTimeout(() => controller.abort(), timeout)

	try {
		const result = await _fetchPromise
		clearTimeout(timer)
		return result
	} catch (e) {
		clearTimeout(timer)
		throw e
	}
}