$(document).ready(function () {
    $(document).on('click', '.seemore-comment-mute', function (e) {
        const el = e.currentTarget
        const items = document.querySelectorAll(`.${el.getAttribute('data-mute-group')}`)
        items.forEach(item => {
            item.style.display = ''
        })
        el.remove()
    })

    $(document).on('click', '.icon-mute', async function (e) {
        const el = e.currentTarget
        if (el.classList.contains('disable')) return

        const memberId = el.getAttribute('data-mute-mid') || ''
        const memberName = el.getAttribute('data-mute-name') || ''
        
        try {
            el.classList.add('disable')
            clear_mute_snackbar()
            const response = await mute_member(memberId)

            if (!response.success) {
                if (response.message == 'notlogin') return noLoggedInModal()
                mute_no_button_snackbar(response.error_message)
                snackbar_mute_timer()
                return;
            }
            
            el.classList.remove('icon-mute')
            el.classList.add('icon-unmute')
            change_mute_icon_mid('icon-mute', 'icon-unmute', memberId)
            mute_success_snackbar(response.data?.member_id, memberName, el)
            snackbar_mute_timer()
        } catch (error) {
            console.log(error)
            mute_no_button_snackbar('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง')
            snackbar_mute_timer()
            return;
        } finally {
            el.classList.remove('disable')
        }
        // console.log(el.getAttribute('data-mute-mid'))
    })

    $(document).on('click', '.icon-unmute', async function (e) {
        const el = e.currentTarget
        if (el.classList.contains('disable')) return

        const memberId = el.getAttribute('data-mute-mid') || ''
        const memberName = el.getAttribute('data-mute-name') || ''
        
        try {
            el.classList.add('disable')
            clear_mute_snackbar()
            const response = await unmute_member(memberId)

            if (!response.success) {
                if (response.message == 'notlogin') return noLoggedInModal()
                mute_no_button_snackbar(response.error_message)
                snackbar_mute_timer()
                return;
            }
            
            el.classList.remove('icon-unmute')
            el.classList.add('icon-mute')
            change_mute_icon_mid('icon-unmute', 'icon-mute', memberId)
            unmute_success_snackbar(response.data?.member_id, memberName)
            snackbar_mute_timer()
        } catch (error) {
            console.log(error)
            mute_no_button_snackbar('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง')
            snackbar_mute_timer()
            return;
        } finally {
            el.classList.remove('disable')
        }
        // console.log(el.getAttribute('data-mute-mid'))
    })

    $(document).on('click', '.unmute-member-btn', async function (e) {
        const el = e.currentTarget
        if (el.classList.contains('disable')) return

        const memberId = el.getAttribute('data-mute-mid') || ''
        const memberName = el.getAttribute('data-mute-name') || ''
        
        try {
            el.classList.add('disable')
            clear_mute_snackbar()
            const response = await unmute_member(memberId)

            if (!response.success) {
                if (response.message == 'notlogin') return noLoggedInModal()
                mute_no_button_snackbar(response.error_message)
                snackbar_mute_timer()
                return;
            }
            
            remove_unmute_btn_mid(memberId)
            unmute_success_snackbar(response.data?.member_id, memberName)
            snackbar_mute_timer()
        } catch (error) {
            mute_no_button_snackbar('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง')
            snackbar_mute_timer()
            return;
        } finally {
            el.classList.remove('disable')
        }
    })

    $(document).on('mouseenter', '.snackbar-mute-member', function (e) {
        snackbar_mute_timer_clear()
    })

    $(document).on('mouseleave', '.snackbar-mute-member', function (e) {
        snackbar_mute_timer()
    })

    // Function to create and show the snackbar
    function mute_success_snackbar(mid, name, element = null) {

        // clear_mute_snackbar()
        // Create the main snackbar container
        const snackbar = document.createElement('div')
        snackbar.className = 'pt-snackbar pt-snackbar--leading pt-snackbar-toast pt-snackbar--open snackbar-mute-member'
    
        // Create the surface div
        const surface = document.createElement('div')
        surface.className = 'pt-snackbar__surface pt-snackbar__surface__white'
    
        // Create the label div
        const label = document.createElement('div')
        label.className = 'pt-snackbar__label'
        label.textContent = `${name} ถูกซ่อนแล้ว` // Set the text with the member name
    
        // Create the actions div
        const actions = document.createElement('div')
        actions.className = 'pt-snackbar__actions'
    
        // Create the undo button
        const undoButton = document.createElement('button')
        undoButton.type = 'button'
        undoButton.className = 'pt-btn pt-btn-text-primary'
        undoButton.textContent = 'เลิกทำ'
    
        // Create the refresh button
        const refreshButton = document.createElement('button');
        refreshButton.title = 'รีเฟรช';
        refreshButton.className = 'pt-btn pt-btn-icon pt-btn-circle pt-btn-text-light';
        const refreshIcon = document.createElement('i');
        refreshIcon.className = 'material-icons';
        refreshIcon.textContent = 'refresh';
    
        // Append the icon to the refresh button
        refreshButton.appendChild(refreshIcon);
    
        // Append buttons to actions
        actions.appendChild(undoButton);
        actions.appendChild(refreshButton);

        // Append label and actions to surface
        surface.appendChild(label);
        surface.appendChild(actions);
    
        // Append surface to snackbar
        snackbar.appendChild(surface);
    
        // Append snackbar to the body or a specific container
        document.body.appendChild(snackbar);
    
        // Optionally, add event listeners to buttons
        undoButton.addEventListener('click', async () => {

            if (undoButton.classList.contains('disable')) return
            document.body.removeChild(snackbar) // Remove the snackbar after undo action
            clear_mute_snackbar()
            
            try {
                undoButton.classList.add('disable')
                const response = await unmute_member(mid)

                if (!response.success) {
                    if (response.message == 'notlogin') return noLoggedInModal()
                    mute_no_button_snackbar(response.error_message)
                    snackbar_mute_timer()
                    return;
                }
                
                // if (element) {
                //     element.classList.remove('icon-unmute')
                //     element.classList.add('icon-mute')
                // }
                change_mute_icon_mid('icon-unmute', 'icon-mute', mid)
                // mute_no_button_snackbar(`${response.data?.nickname} ถูกยกเลิกซ่อนแล้ว`)
                unmute_success_snackbar(mid, name)
                snackbar_mute_timer()
            } catch (error) {
                mute_no_button_snackbar('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง')
                snackbar_mute_timer()
            } finally {
                undoButton.classList.remove('disable')
            }

        })

        refreshButton.addEventListener('click', () => {
            clear_mute_snackbar()
            location.reload()
        })
        
    }
    
    function unmute_success_snackbar(memberId = '', name = '') {
        // clear_mute_snackbar()
        // Create the main snackbar container
        const snackbar = document.createElement('div');
        snackbar.className = 'pt-snackbar pt-snackbar--leading pt-snackbar-toast pt-snackbar--open snackbar-mute-member';
    
        // Create the surface div
        const surface = document.createElement('div');
        surface.className = 'pt-snackbar__surface pt-snackbar__surface__white';
    
        // Create the label div
        const label = document.createElement('div');
        label.className = 'pt-snackbar__label';
        label.textContent = `ยกเลิกการซ่อนความคิดเห็นของ ${name} แล้ว`; // Set the text with the member name
    
        // Create the actions div
        const actions = document.createElement('div');
        actions.className = 'pt-snackbar__actions';
    
        // Create the refresh button
        const refreshButton = document.createElement('button');
        refreshButton.title = 'รีเฟรช';
        refreshButton.className = 'pt-btn pt-btn-icon pt-btn-circle pt-btn-text-light';
        const refreshIcon = document.createElement('i');
        refreshIcon.className = 'material-icons';
        refreshIcon.textContent = 'refresh';
    
        // Append the icon to the refresh button
        refreshButton.appendChild(refreshIcon);
    
        // Append buttons to actions
        actions.appendChild(refreshButton);

        // Append label and actions to surface
        surface.appendChild(label);
        surface.appendChild(actions);
    
        // Append surface to snackbar
        snackbar.appendChild(surface);
    
        // Append snackbar to the body or a specific container
        document.body.appendChild(snackbar);

        refreshButton.addEventListener('click', () => {
            document.body.removeChild(snackbar)
            clear_mute_snackbar()
            location.reload()
        })
        
    }

    function mute_no_button_snackbar(desc = '') {

        // clear_mute_snackbar()
        // Create the main snackbar container
        const snackbar = document.createElement('div')
        snackbar.className = 'pt-snackbar pt-snackbar--leading pt-snackbar-toast pt-snackbar--open snackbar-mute-member'
    
        // Create the surface div
        const surface = document.createElement('div')
        surface.className = 'pt-snackbar__surface pt-snackbar__surface__white'
    
        // Create the label div
        const label = document.createElement('div')
        label.className = 'pt-snackbar__label'
        label.textContent = `${desc}`

        // Append label and actions to surface
        surface.appendChild(label)
    
        // Append surface to snackbar
        snackbar.appendChild(surface)
    
        // Append snackbar to the body or a specific container
        document.body.appendChild(snackbar)
        
    }

    let snackbarMuteTimer = null
    function snackbar_mute_timer() {
        clearTimeout(snackbarMuteTimer)
        snackbarMuteTimer = setTimeout(() => {
            document.querySelectorAll('.snackbar-mute-member').forEach(element => {
                element.remove()
            })
        }, 4000)
    }

    function snackbar_mute_timer_clear() {
        clearTimeout(snackbarMuteTimer)
    }

    function clear_mute_snackbar() {
        const elements = document.querySelectorAll('.snackbar-mute-member');

        if (elements.length > 0) {
            elements.forEach(element => {
                element.remove();
            });
        }
    }
  
    // call api //
    async function mute_member(memberId) {
        if (!memberId) return

        const body = { member_id: memberId, ts: Date.now() }
        const apiUrl = `/forum/topic/mute_member`
        const response = await fetchWithTimeout(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        return response.json()
    }

    async function unmute_member(memberId) {
        if (!memberId) return

        const body = { member_id: memberId, ts: Date.now() }
        const apiUrl = `/forum/topic/unmute_member`
        const response = await fetchWithTimeout(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        return response.json()
    }

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

    function noLoggedInModal() {
        GivePointModal.info({
            backdrop: false,
            title: `ยังไม่ได้เข้าสู่ระบบ`,
            content: 'คุณต้องเข้าสู่ระบบเพื่อดำเนินการต่อ',
            acknowledgeText: 'เข้าสู่ระบบ',
            onAcknowledge: () => requireLogin(window.location.href),
        })
    }

    function change_mute_icon_mid(classIcon, toIcon, memberId) {
        const elements = document.querySelectorAll(`.${classIcon}`);

        if (elements.length > 0) {
            elements.forEach(element => {
                const mid = element.getAttribute('data-mute-mid') || ''
                if (mid && (mid == memberId)) {
                    element.classList.remove(classIcon)
                    element.classList.add(toIcon)
                }
            })
        }
    }

    function remove_unmute_btn_mid(memberId) {
        const elements = document.querySelectorAll('.unmute-member-btn');
        console.log(elements.length)
        if (elements.length > 0) {
            elements.forEach(element => {
                const mid = element.getAttribute('data-mute-mid') || ''
                if (mid && (mid == memberId)) {
                    element.remove()
                }
            })
        }
    }

    async function mute_api(memberId) {

        try {
            el.classList.add('disable')
            const response = await mute_member(memberId)

            if (!response.success) {
                if (response.message == 'notlogin') return noLoggedInModal()
                mute_no_button_snackbar(response.error_message)
                snackbar_mute_timer()
                return
            }
            
            mute_success_snackbar(response.data?.member_id, response.data?.nickname)
            snackbar_mute_timer()
        } catch (error) {
            mute_no_button_snackbar('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง')
            snackbar_mute_timer()
            return
        } finally {
            el.classList.remove('disable')
        }
    }
  
})
