//@ts-check
(function (root, factory) {
	root.Modal = factory();
}(typeof self !== 'undefined' ? self : this, function () {
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
	 * @property {"sm"|"md"} [size]
	 * @property {boolean} [backdrop]
	 * @property {boolean} [stopPropagation] Stop event propagation at the modal container, default to `true`.
	 * @property {boolean} [useBackArrow] Use back arrow as close button, default to `false`.
	 * @property {(close: Function) => void} [onClose]
	 * @property {Function} [onRendered] Called when the modal element is attached to the dom, use to register dom events.
	 */

	class Modal {
		/** @type {string} */
		title;
		/** @type {HTMLElement|undefined} */
		container;
		/** @type {"sm"|"md"} */
		size;
		/** @type {boolean} */
		backdrop;
		/** @type {boolean} */
		stopPropagation;
		/** @type {boolean} */
		useBackArrow;
		/** @type {((close: Function) => void)|undefined} */
		onClose;
		/** @type {Function|undefined} */
		onRendered;

		/** @type {string|ModalContentFn} */
		content;
		/** @type {ModalContentFn|undefined} */
		bottom;

		/** @internal @type {HTMLDivElement} */
		modal;

		/**
		 * @param {ModalOptions & {content: string|ModalContentFn, bottom?: ModalContentFn}} options 
		 */
		constructor(options) {
			this.title = options.title;
			this.container = options.container;
			this.size = options.size ? options.size : "md";
			this.backdrop = typeof options.backdrop === "undefined" ? true : options.backdrop;
			this.stopPropagation = typeof options.stopPropagation === "undefined" ? true : options.stopPropagation;
			this.useBackArrow = typeof options.useBackArrow === "undefined" ? false : options.useBackArrow;
			this.onClose = options.onClose;
			this.onRendered = options.onRendered;

			this.content = options.content;
			this.bottom = options.bottom;

			this.render();
		}

		render() {
			this.modal = document.createElement("div");
			this.modal.className = "ptp-modal ptp-modal-mask";
			if (this.stopPropagation) {
				this.modal.addEventListener("click", (e) => {
					e.stopPropagation()
				});
			}

			let inner = document.createElement("div");
			inner.className = `ptp-dialog__box ptp-dialog__border-1 ptp-dialog__${this.size}`;

			if (this.backdrop) {
				this.modal.addEventListener("click", (e) => {
					// @ts-ignore
					if (!inner.contains(e.target)) {
						if (this.onClose) {
							this.onClose(this.close.bind(this));
						} else {
							this.close();
						}
					}
				});
			}

			this.modal.append(inner);

			inner.append(this.createHeader());
			inner.append(this.createContent());

			if (typeof this.bottom !== "undefined") {
				inner.append(this.createBottom());
			}

			if (typeof this.container !== "undefined") {
				this.container.append(this.modal);
			} else {
				document.body.append(this.modal);
			}

			if (typeof this.onRendered !== "undefined") {
				this.onRendered();
			}
		}

		/**
		 * @private
		 * @returns {HTMLDivElement}
		 */
		createHeader() {
			let header = document.createElement("div");
			header.className = "ptp-dialog__heading";

			/**
			 * @param {MouseEvent} e 
			 */
			const onClick = (e) => {
				e.preventDefault();
				if (this.onClose) {
					this.onClose(this.close.bind(this));
				} else {
					this.close();
				}
			};

			if (this.useBackArrow) {
				let closeLink = document.createElement("a");
				closeLink.setAttribute("href", "#");
				closeLink.setAttribute("title", "กลับ");
				closeLink.setAttribute("role", "button");
				closeLink.className = "ptp-dialog__left-icon";
				closeLink.innerHTML = `<i class="material-icons">arrow_back</i>`;
				closeLink.addEventListener("click", onClick);
				header.append(closeLink);
			}

			let h5 = document.createElement("h5");
			h5.innerText = this.title;
			header.append(h5);

			if (!this.useBackArrow) {
				let closeLink = document.createElement("a");
				closeLink.setAttribute("href", "#");
				closeLink.setAttribute("title", "ปิด");
				closeLink.setAttribute("role", "button");
				closeLink.innerHTML = `<i class="material-icons">clear</i>`;
				closeLink.addEventListener("click", onClick);
				header.append(closeLink);
			}
			return header;
		}

		/**
		 * @private
		 * @returns {HTMLDivElement}
		 */
		createContent() {
			let content = document.createElement("div");
			content.className = "ptp-dialog__content";
			if (typeof this.content == "string") {
				let p = document.createElement("p");
				p.innerText = this.content;
				content.append(p);
			} else if (typeof this.content == "function") {
				content.append(this.content(close));
			} else {
				throw new Error("Invalid this.content type");
			}
			return content;
		}

		/**
		 * @private
		 * @returns {HTMLDivElement}
		 */
		createBottom() {
			let bottom = document.createElement("div");
			bottom.className = "ptp-dialog__bottom p-l-12";
			if (typeof this.bottom !== "undefined") {
				bottom.append(this.bottom(this.close.bind(this)));
			}
			return bottom;
		}

		close() {
			this.modal.remove();
		}

		/**
		 * @returns {HTMLDivElement}
		 */
		getContainer() {
			return this.modal;
		}

		/**
		 * Show modal.
		 * @param {ModalOptions & {content: string|ModalContentFn, bottom?: ModalContentFn}} options 
		 * @return {Modal}
		 */
		static show(options) {
			return new Modal(options);
		}

		/**
		 * Show info modal.
		 * @param {ModalOptions & {content: string, acknowledgeText: string, onAcknowledge?: onAcknowledgeFn}} options
		 * @return {Modal}
		 */
		static info(options) {
			return new Modal({
				container: options.container,
				title: options.title,
				content: function (close) {
					let div = document.createElement("div");
					div.className = "p-all-24";
					div.innerText = options.content;
					return div;
				},
				size: options.size,
				bottom: getAcknowledgeFunction(options),
				stopPropagation: options.stopPropagation
			});
		}

		/**
		 * Show confirmation modal.
		 * @param {ModalOptions & {content: string|ModalContentFn, confirmText?: string, onConfirm?: (close: Function) => void, cancelText?: string, onCancel?: (close: Function) => void}} options
		 * @return {Modal}
		 */
		static confirm(options) {
			return new Modal({
				container: options.container,
				size: options.size,
				title: options.title,
				content: function (close) {
					let div = document.createElement("div");
					div.className = "p-all-24";
					if (typeof options.content == "string") {
						div.innerText = options.content;
					} else {
						div.append(options.content(close));
					}
					return div;
				},
				bottom: function (close) {
					let fragment = new DocumentFragment();

					let span = document.createElement("span");
					span.innerHTML = "&nbsp;";
					fragment.append(span);

					let confirmButton = document.createElement("button");
					confirmButton.type = "button";
					confirmButton.className = "ptp-btn btn--primary";
					confirmButton.innerText = options.confirmText ? options.confirmText : "ยืนยัน";
					confirmButton.addEventListener("click", function (e) {
						if (options.onConfirm) {
							options.onConfirm(close);
						}
					});
					fragment.append(confirmButton);

					let closeButton = document.createElement("button");
					closeButton.type = "button";
					closeButton.className = "ptp-btn btn--secondary m-l-8";
					closeButton.innerText = options.cancelText ? options.cancelText : "ยกเลิก";
					closeButton.addEventListener("click", function (e) {
						if (options.onCancel) {
							options.onCancel(close);
						}
					});
					fragment.append(closeButton);
					return fragment;
				},
				stopPropagation: options.stopPropagation
			});
		}

		/**
		 * Show error modal.
		 * @param {ModalOptions & {message: string, details: string|string[], acknowledgeText: string, onAcknowledge?: onAcknowledgeFn, onClose?: () => void}} options
		 * @return {Modal}
		 */
		static error(options) {
			return new Modal({
				container: options.container,
				title: "เกิดข้อผิดพลาด",
				content: function () {
					let container = document.createElement("div");
					container.className = "p-all-24";
					let text = document.createTextNode(options.message);
					container.append(text);

					let detailsDiv = document.createElement("div");
					detailsDiv.className = "m-t-16";
					if (typeof options.details == "string") {
						detailsDiv.innerText = options.details;
					} else {
						for (let i = 0; i < options.details.length; i++) {
							let text = document.createTextNode(options.details[i]);
							detailsDiv.append(text);
							if (i < options.details.length - 1) {
								let br = document.createElement("br");
								detailsDiv.append(br);
							}
						}
					}
					container.append(detailsDiv);

					let div = document.createElement("div");
					div.className = "m-t-16";

					let showDetails = false;

					let link = document.createElement("a");
					link.innerText = "แสดงรายละเอียดเพิ่มเติม";
					link.style.color = "#B39DDB";
					link.style.textDecoration = "underline";
					link.role = "button";
					link.href = "#";

					function renderDetails() {
						link.innerText = `แสดงรายละเอียด${!showDetails ? "เพิ่มเติม" : "น้อยลง"}`;
						detailsDiv.style.display = showDetails ? "block" : "none";
					}
					renderDetails();

					link.addEventListener("click", function (e) {
						e.preventDefault();
						showDetails = !showDetails;
						renderDetails();
					});

					div.append(link);
					container.append(div);

					return container;
				},
				size: options.size,
				bottom: getAcknowledgeFunction(options),
				stopPropagation: options.stopPropagation,
				onClose: options.onClose
			});
		}
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
			let fragment = new DocumentFragment();

			let span = document.createElement("span");
			span.innerHTML = "&nbsp;";
			fragment.append(span);

			let acknowledgeButton = document.createElement("button");
			acknowledgeButton.type = "button";
			acknowledgeButton.className = "ptp-btn btn--primary";
			acknowledgeButton.style.marginRight = "8px";
			acknowledgeButton.innerText = options.acknowledgeText;
			acknowledgeButton.addEventListener("click", function (e) {
				e.preventDefault();
				if (options.onAcknowledge) {
					options.onAcknowledge(close);
				}
			});
			fragment.append(acknowledgeButton);
			return fragment;
		}

		return acknowledge;
	}

	return Modal;
}));