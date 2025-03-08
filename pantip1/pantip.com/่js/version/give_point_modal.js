//@ts-check
;(function (root, factory) {
    root.GivePointModal = factory()
})(typeof self !== 'undefined' ? self : this, function () {
    /**
     * @typedef {(close: Function) => HTMLElement|DocumentFragment} ModalContentFn
     */
    /**
     * @typedef {(close: Function) => void} onAcknowledgeFn
     */
    /**
     * @typedef {object} ModalOptions
     * @property {string} title
     * @property {HTMLElement} [container]
     * @property {boolean} [backdrop]
     * @property {(close: Function) => void} [onClose]
     * @property {boolean} [stopPropagation] Stop event propagation at the modal container, default to `true`.
     */
    /**
     * Show modal.
     * @param {ModalOptions & {content: string|ModalContentFn, bottom: ModalContentFn, onRendered?: Function}} options
     */
    function show(options) {
        const backdrop = typeof options.backdrop === 'undefined' ? true : options.backdrop
        const stopPropagation = typeof options.stopPropagation === 'undefined' ? true : options.stopPropagation

        const modal = document.createElement('div')
        modal.className = 'pt-modal pt-modal-mask pt-modal-layer2 flexbox'
        if (stopPropagation) {
            modal.addEventListener('click', function (e) {
                e.stopPropagation()
            })
        }

        function close() {
            modal.remove()
        }

        const outer = document.createElement('div')
        outer.className = `pt-dialog__box pt-dialog__minwidth pt-dialog__form`

        const inner = document.createElement('div')
        inner.className = `pt-dialog__mobile_fulid bg-purple-pantip-700`

        if (backdrop) {
            modal.addEventListener('click', function (e) {
                // @ts-ignore
                if (!inner.contains(e.target)) {
                    if (options.onClose) {
                        options.onClose(close)
                    } else {
                        close()
                    }
                }
            })
        }

        modal.append(outer)
        outer.append(inner)

        let header = document.createElement('div')
        header.className = 'pt-dialog__heading'

        {
            let h5 = document.createElement('h5')
            h5.innerText = options.title
            h5.style.paddingRight = '8px'
            h5.style.display = 'inline'

            header.append(h5)
            h5.style.paddingRight = '8px'
            h5.style.display = 'inline'

            let closeLink = document.createElement('a')
            closeLink.setAttribute('href', '#')
            closeLink.setAttribute('title', 'ปิด')
            closeLink.setAttribute('role', 'button')
            closeLink.innerHTML = `<i class="material-icons">clear</i>`
            closeLink.className = 'pt-sm-toggle-show'
            closeLink.addEventListener('click', function (e) {
                e.preventDefault()
                if (options.onClose) {
                    options.onClose(close)
                } else {
                    // Get the <html> element
                    const htmlElement = document.documentElement;

                    // Get the computed style object for the <html> element
                    const computedStyle = window.getComputedStyle(htmlElement);

                    // Get the value of the 'overflow' property
                    const overflowValue = computedStyle.overflow;

                    if (overflowValue == 'hidden') {
                        document.documentElement.style.overflow = ''
                    }
                    close()
                }
            })
            header.append(closeLink)
        }

        let content = document.createElement('div')
        content.className = 'pt-dialog__content'
        if (typeof options.content == 'string') {
            let section = document.createElement('section')
            section.innerText = options.content
            content.append(section)
        } else if (typeof options.content == 'function') {
            content.append(options.content(close))
        } else {
            content.append(options.content)
        }

        let bottom = document.createElement('div')
        bottom.className = 'pt-dialog__bottom'
        bottom.append(options.bottom(close))

        inner.append(header)
        inner.append(content)
        inner.append(bottom)

        if (typeof options.container !== 'undefined') {
            options.container.append(modal)
        } else {
            document.body.append(modal)
        }

        if (typeof options.onRendered !== 'undefined') {
            options.onRendered()
        }
    }

    /**
     * Show info modal.
     * @param {ModalOptions & {content: string, acknowledgeText: string, onAcknowledge?: onAcknowledgeFn}} options
     */
    function info(options) {
		show({
			backdrop: typeof options.backdrop === 'undefined' ? true : options.backdrop,
            container: options.container,
            title: options.title,
            content: function (close) {
                let section = document.createElement('section')
                section.innerText = options.content
                return section
            },
            bottom: getAcknowledgeFunction(options),
            stopPropagation: options.stopPropagation,
        })
    }

    /**
     * Get acknowledge function.
     * @private
     * @param {{acknowledgeText: string, onAcknowledge?: onAcknowledgeFn}} options
     * @returns {ModalContentFn}
     */
    function getAcknowledgeFunction(options) {
        /**
         * Acknowledge function.
         * @param {*} close
         * @returns
         */
        function acknowledge(close) {
            const fragment = new DocumentFragment()

            const span = document.createElement('span')
            span.className = 'pt-sm-toggle-show txt-secondary'
            fragment.append(span)

            const acknowledgeButton = document.createElement('button')
            acknowledgeButton.type = 'button'
            acknowledgeButton.className = 'btn btn-primary'
            acknowledgeButton.innerText = options.acknowledgeText
            acknowledgeButton.addEventListener('click', function (e) {
                e.preventDefault()
                if (options.onAcknowledge) {
                    options.onAcknowledge(close)
                }
            })
            fragment.append(acknowledgeButton)
            return fragment
        }

        return acknowledge
    }

    function show_padding_zero(options) {
        const backdrop = typeof options.backdrop === 'undefined' ? true : options.backdrop
        const stopPropagation = typeof options.stopPropagation === 'undefined' ? true : options.stopPropagation

        const modal = document.createElement('div')
        modal.className = 'pt-modal pt-modal-mask pt-modal-layer2 flexbox'
        if (stopPropagation) {
            modal.addEventListener('click', function (e) {
                e.stopPropagation()
            })
        }

        function close() {
            modal.remove()
        }

        const outer = document.createElement('div')
        outer.className = `pt-dialog__box pt-dialog__minwidth pt-dialog__form`

        const inner = document.createElement('div')
        inner.className = `pt-dialog__mobile_fulid bg-purple-pantip-700`

        if (backdrop) {
            modal.addEventListener('click', function (e) {
                // @ts-ignore
                if (!inner.contains(e.target)) {
                    if (options.onClose) {
                        options.onClose(close)
                    } else {
                        close()
                    }
                }
            })
        }

        modal.append(outer)
        outer.append(inner)

        let header = document.createElement('div')
        header.className = 'pt-dialog__heading'

        {
            let h5 = document.createElement('h5')
            h5.innerText = options.title
            header.append(h5)

            let closeLink = document.createElement('a')
            closeLink.setAttribute('href', '#')
            closeLink.setAttribute('title', 'ปิด')
            closeLink.setAttribute('role', 'button')
            closeLink.innerHTML = `<i class="material-icons">clear</i>`
            closeLink.className = 'pt-sm-toggle-show'
            closeLink.addEventListener('click', function (e) {
                e.preventDefault()
                if (options.onClose) {
                    options.onClose(close)
                } else {
                    // Get the <html> element
                    const htmlElement = document.documentElement;

                    // Get the computed style object for the <html> element
                    const computedStyle = window.getComputedStyle(htmlElement);

                    // Get the value of the 'overflow' property
                    const overflowValue = computedStyle.overflow;

                    if (overflowValue == 'hidden') {
                        document.documentElement.style.overflow = ''
                    }
                    close()
                }
            })
            header.append(closeLink)
        }

        let content = document.createElement('div')
        content.className = 'pt-dialog__content p-all-0'
        if (typeof options.content == 'string') {
            let section = document.createElement('section')
            section.innerText = options.content
            content.append(section)
        } else if (typeof options.content == 'function') {
            content.append(options.content(close))
        } else {
            content.append(options.content)
        }

        let bottom = document.createElement('div')
        bottom.className = 'pt-dialog__bottom'
        bottom.append(options.bottom(close))

        inner.append(header)
        inner.append(content)
        inner.append(bottom)

        if (typeof options.container !== 'undefined') {
            options.container.append(modal)
        } else {
            document.body.append(modal)
        }

        if (typeof options.onRendered !== 'undefined') {
            options.onRendered()
        }
    }

    return {
        show: show,
        info: info,
        show_padding_zero: show_padding_zero,
    }
})
