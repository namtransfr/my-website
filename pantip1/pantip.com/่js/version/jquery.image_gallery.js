// Controll Ajax Queue
//var ajaxSending = false;
//$.ajaxSetup({
//	beforeSend: function(){
//		ajaxSending	=	true;
//	},
//	complete: function(){
//		// Handle the complete event
//		ajaxSending	=	false;
//	}
//});
// End controll Ajax

(function () {
	$(document).on('click', '#cfm_cancel_sent', function (event) {
		$('#' + $.image_gallery.defaults.id_el_lb).dialog('destory');
		$('#' + $.image_gallery.defaults.id_el_lb).remove()
	});

	function ImageUploadPt() {
		let config = getGlobalConfig();

		this.isVisible = false;
		this.loadedInt = 0;

		this.urlUpload = config.file_services_base_url + 'v1.0.0/image_gallery/upload_image';
		this.urlDelete = config.file_services_base_url + 'v1.0.0/image_gallery/delete_image_temp';

		this.element = {
			preview: 'preview',
			imagePrefix: 'image',
			dropAreaId: 'drop-area'
		};

		this.sortable = true;

		this.counter = 0;
		this.total = 0;
		this.dropArea = null;

		this.imageData = {};

		// resize
		this.resizeQuality = .90;
		this.resizeImageMaxSize = 1500;
		this.resizeAllowFileType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		this.resizeFileSize = 700 * 1024; // 700 kb in bytes
		this.resizeMaxAllowFileSize = 1024 * 1024 * 32; // 32 MB in bytes
		this.maxUploaded = 20;
		this.resizePngPercent = 20;
		this.resizePngAttemp = 10;

		this.showErrorThumbnail = true;
		this.concurrentLimit = 5;

		this.init = function () {
			this.maxUploaded = $.image_gallery.defaults.maxUploaded;
			this.dropArea = document.getElementById(this.element.dropAreaId);
			if (!this.dropArea) {
				return false;
			}
			var warning = 'อนุญาตให้อัปโหลดรูปได้ไม่เกิน ' + this.maxUploaded + ' รูปต่อครั้ง <span id="image-upload-count">(0 / ' + this.maxUploaded + ')</span>';
			$('#over-upload-warning').html(warning);
			if (this.sortable) {
				var el = document.getElementById(this.element.preview);
				var sortable = Sortable.create(el);
			}
			this.isVisible = true;
			this.loadedInt++;
			this.counter = 0;
			this.total = 0;
			this.imageData = {};

			this.initDragDropEvent();
		}

		this.uploadModalGone = function () {
			//console.log('Modal close');
			this.isVisible = false;
			for (var key in this.imageData) {
				var item = this.imageData[key];
				if (item.xhr !== null) {
					if (item.xhr.readyState == 1 || item.xhr.readyState == 2 || item.xhr.readyState == 3) {
						item.xhr.abort();
					}
				}
			}
		}

		this.initButtonEvent = function () {
			var that = this;
			/*
			$(document).on('click', '#drop-area>.pt-image-upload-preview>.item', function(e) {
				var id = parseInt($(this).attr('data-id'));
				if (!that.imageData[id].success) {
					console.log('Uploading is not completed.')
					return false;
				}
				var data = that.imageData[id].url;
				var url = data.upload.url_o;
				prompt("Copy this code", url);
				e.preventDefault();
			});*/

			$(document).on('click', '#btn-insert-code', function (e) {
				
				var elements = document.getElementById(that.element.preview).childNodes;

				var data = [];

				for (var i = 0; i < elements.length && i < 20; i++) {
					var el = elements[i];
					var item_id = parseInt(el.getAttribute('data-id'));
					var item = that.imageData[item_id];
					if (item.state === 1) {
						var imageItem = {
							original_name: item.file.name,
							name_o: item.url.data.name_o,
							name_s: item.url.data.name_s,
							title: item.file.name.substring(0, 120),
							alt: ''
						}
						data.push(imageItem);
					}
				}
				$(this).hide();
				var that_button = this;
				$('#img-waiting-loading').show();
				$.image_gallery.imgUpload_submit_upload_multiple(data, function () {
					//when upload failed
					$(that_button).show();
					$('#img-waiting-loading').hide();
				});

				that.uploadModalGone();
				e.preventDefault();
			});

			$(document).on('click', '#cfm_cancel_sent', function (e) {
				that.uploadModalGone();
				e.preventDefault();
			});


			$(document).on('click', '#select-image-btn', function (e) {
				if (that.total >= that.maxUploaded) {
					return false;
				}
			});

		}

		this.initDragDropEvent = function () {
			var that = this;

			;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
				that.dropArea.addEventListener(eventName, preventDefaults, false);
				if (that.loadedInt == 1) {
					window.addEventListener(eventName, preventDefaults, false);
				}
			});
			;['dragenter', 'dragover'].forEach(function (eventName) {
				that.dropArea.addEventListener(eventName, highlight, false);
				if (that.loadedInt == 1) {
					window.addEventListener(eventName, highlight, false);
				}
			})

				;['dragleave', 'drop'].forEach(function (eventName) {
					that.dropArea.addEventListener(eventName, unhighlight, false);
					if (that.loadedInt == 1) {
						window.addEventListener(eventName, unhighlight, false);
					}
				});

			that.dropArea.addEventListener('drop', handleDrop, false);
			if (that.loadedInt == 1) {
				window.addEventListener('drop', handleDrop, false);
			}

			function preventDefaults(e) {
				e.preventDefault();
				e.stopPropagation();
			}

			function highlight(e) {
				that.dropArea.classList.add('image-upload-highlight');
			}

			function unhighlight(e) {
				that.dropArea.classList.remove('image-upload-highlight');
			}

			function handleDrop(e) {
				var dt = e.dataTransfer;
				var files = dt.files;

				that.handleFiles(files);
			}
		}

		this.handleFiles = function (files) {
			/*
			if (!this.isVisible) {
				console.log('Upload modal is not visible.');
				return false;
			}*/
			if (this.total >= this.maxUploaded) {
				return false;
			}

			if (!document.getElementById(this.element.dropAreaId)) {
				console.log('Upload modal is not visible.');
				return false;
			}

			if (files.length > this.maxUploaded) {
				var error_message = 'คุณสามารถเลือกไฟล์ได้ไม่เกิน ' + this.maxUploaded + ' ไฟล์ โปรดลองใหม่' + '<div class="button-container"><a href="javascript:void(0);" id="close-warning-over-select" class="button notgo-butt"><span><em>ปิดหน้าต่างนี้</em></span></a></div>';
				var otp_div = '<div id="over_select_dialog">'
					+ '<p class="">' + error_message + '</p>'
					+ '</div>';
				$('div:last').after(otp_div);
				$("#over_select_dialog").dialog({
					title: 'แจ้งเตือน',
					resizable: false,
					width: 500,
					modal: true,
					close: function () {
						$('#over_select_dialog').dialog('destroy').remove();
					}
				});

				$(document).on('click', '#close-warning-over-select', function () {
					$('#over_select_dialog').dialog('destroy').remove();
				});

				return false;


			}

			this.onInsertButtonStateChange(false);

			for (var i = 0; i < files.length; i++) {
				var id = this.counter++;

				var valid = this.isValidToUpload(files[i], id);
				if (!this.showErrorThumbnail && !valid.status) {
					continue;
				}

				if (this.showErrorThumbnail && !valid.status && valid.type === 'invalid_file_type') {
					continue;
				}

				this.total++;
				this.showOverUploadWarning(this.total);

				this.imageData[id] = {
					id: id,
					xhr: null,
					file: null,
					url: null,
					success: false,
					state: 0,
					attemp: 0
				};

				this.createPreviewElement(id);
				this.setState(id, 0);

				if (!valid.status) {
					this.notAllowFile(id, valid.message);
					continue;
				}

				this.imageData[id].file = files[i];

				if (files[i].size > this.resizeFileSize) {
					//console.log('Before resize: ' + (files[i].size / 1204) + ' KB');
					this.resize(files[i], id, function (file, id, that) {
						that.previewImage(file, id);
						if (that.IsConcurrentReady()) {
							that.uploadFile(file, id);
						}
					}, this);
				} else {
					this.previewImage(files[i], id);
					if (this.IsConcurrentReady()) {
						this.uploadFile(files[i], id);
					}
				}
			}

			this.onItemUploadCompleted();
		}

		this.IsConcurrentReady = function () {
			var count = 0;
			for (var key in this.imageData) {
				var item = this.imageData[key];
				if (item.state === 3) {
					count++;
				}
			}
			return count < this.concurrentLimit;
		};

		this.uploadNext = function () {
			if (!this.isVisible) {
				return false;
			}
			var that = this;
			if (!this.IsConcurrentReady()) {
				return false;
			}
			for (var key in this.imageData) {
				var item = this.imageData[key];
				if (item.state === 0) {
					this.shouldImageUpload(item.file, item.id)
					break;
				}
			}
		}

		this.shouldImageUpload = function (file, id) {
			if (file.size > this.resizeFileSize) {
				this.resize(file, id, function (file, id, that) {
					that.uploadFile(file, id);
				}, this);
			} else {
				this.uploadFile(file, id);
			}
		}

		this.setState = function (id, state) {
			this.imageData[id].state = state;
			//$('#' + this.element.imagePrefix + id).children('.info:eq(0)').text('State: ' + this.imageData[id].state)
		}

		this.isValidToUpload = function (file, id) {
			var isValidType = false;

			for (var i = 0; i < this.resizeAllowFileType.length; i++) {
				if (file.type === this.resizeAllowFileType[i]) {
					isValidType = true;
					break;
				}
			}

			if (!isValidType) {
				console.log('File is not an image (provided \'' + file.type + '\').');
				this.onItemUploadCompleted();
				return {
					status: false,
					type: 'invalid_file_type',
					message: 'ไฟล์ ' + file.name + ' ไม่ใช่รูปภาพ'
				};
			}

			if (file.size > this.resizeMaxAllowFileSize) {
				console.log('Image is larger than ' + (this.resizeMaxAllowFileSize / Math.pow(1024, 2)) + ' MB (provided ' + (file.size / Math.pow(1024, 2)) + ' MB).');
				this.onItemUploadCompleted();
				return {
					status: false,
					type: 'image_to_large',
					message: 'ไฟล์ ' + file.name + ' มีขนาดเกิน ' + (this.resizeMaxAllowFileSize / Math.pow(1024, 2)) + 'mb'
				};
			}
			return {
				status: true
			};
		}

		this.previewImage = function (file, id) {
			var that = this;
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (event) {
				$('#' + that.element.imagePrefix + id).children('.image:eq(0)').css("background-image", 'url(' + event.target.result + ')');
			};
		}

		this.createPreviewElement = function (id) {
			var str = '<div id="' + this.element.imagePrefix + id + '" class="item" data-id="' + id + '">';
			str += '<div class="image" ></div>';
			str += '<div class="loader"></div>';
			str += '<div class="hover"></div>';
			str += '<div class="error"></div>';
			str += '<a class="remove btn-remove" href="#">×</a>';
			str += '<div class="info"><div>';
			str += '</div>';

			$('#' + this.element.preview).append(str);
		}

		this.hasAlphaChanel = function (canvas) {
			var context = canvas.getContext('2d');
			var data = context.getImageData(0, 0, canvas.width, canvas.height).data;
			for (var i = 3, n = data.length; i < n; i += 4) {
				if (data[i] < 255) {
					return true;
				}
			}
			return false;
		}

		this.resize = function (file, id, callback, that) {
			var size = that.resizeImageMaxSize;
			var fileTracker = new FileReader;

			fileTracker.onload = function () {
				var image = new Image();
				image.onload = function () {

					var canvas = that.imageToCanvas(image, size);

					var hasAlpha = false;

					// if an image is png, check for alpha chenel
					if (file.type === 'image/png') {
						hasAlpha = that.hasAlphaChanel(canvas);
					}

					var blob = that.canvasToFile(canvas, file, id, hasAlpha);

					if (file.type === 'image/png' && hasAlpha) {
						var countResize = 0;
						while (blob.size > that.resizeFileSize && countResize < that.resizePngAttemp) {
							if (canvas.height >= canvas.width) {
								size = canvas.height * ((100 - that.resizePngPercent) / 100);
							} else {
								size = canvas.width * ((100 - that.resizePngPercent) / 100);
							}

							canvas = that.imageToCanvas(image, size);
							blob = that.canvasToFile(canvas, file, id, hasAlpha);
							countResize++;
						}
					}

					callback(blob, id, that);
				};
				image.onerror = function () {
					console.log('An error occured while loading the image.');
					that.uploadFailed(id, 'An error occured while loading the image.');
				}
				image.src = this.result;
			}

			fileTracker.readAsDataURL(file);

			fileTracker.onabort = function () {
				console.log('The upload was aborted.');
				that.uploadFailed(id, 'The upload was aborted.');
			}

			fileTracker.onerror = function () {
				console.log('An error occured while reading the file.');
				that.uploadFailed(id, 'An error occured while reading the file.');
			}
		}

		this.imageToCanvas = function (image, size) {
			var canvas = document.createElement("canvas");

			var width = image.width;
			var height = image.height;

			if (image.height >= image.width) {
				if (image.height > size) {
					height = size;
					width = size * image.width / image.height;
				}
			} else if (image.width > size) {
				width = size;
				height = size * image.height / image.width;
			}

			canvas.width = width;
			canvas.height = height;

			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(image, 0, 0, width, height);
			return canvas;
		}

		/*
		this.canvasToFile = function (canvas, file, id) {
			//var dataURL = canvas.toDataURL(file.type, this.resizeQuality);
			var q = this.resizeQuality - ((this.imageData[id].attemp) * 0.1);
			console.log('Attemp ' + q);

			var dataURL = canvas.toDataURL('image/jpeg', q);
			var blobBin = atob(dataURL.split(',')[1]);
			var array = [];
			for(var i = 0; i < blobBin.length; i++) {
				array.push(blobBin.charCodeAt(i));
			}
			return new File([new Uint8Array(array)], file.name, {type: file.type});
			//return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
		}*/

		this.canvasToFile = function (canvas, file, id, hasAlpha) {
			//var dataURL = canvas.toDataURL(file.type, this.resizeQuality);
			var q = this.resizeQuality - ((this.imageData[id].attemp) * 0.1);
			//console.log('Attemp ' + q);

			var data = null;
			// if an image is png and has no alpha, convert it to jpeg to reduce file size
			if ((file.type === 'image/png' && !hasAlpha) || file.type === 'image/gif') {
				data = canvas.toDataURL('image/jpeg', q);
			} else {
				data = canvas.toDataURL(file.type, q);
			}

			var byteString = atob(data.split(',')[1]);
			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			var bb = (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder);
			if (bb) {
				//    console.log('BlobBuilder');        
				bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
				bb.append(ab);
				return bb.getBlob(file.type);
			} else {
				//    console.log('Blob');  
				bb = new Blob([ab], {
					'type': (file.type)
				});
				return bb;
			}

		}

		this.uploadFile = function (file, id) {
			var that = this;
			//console.log(file.name);
			var xhr = new XMLHttpRequest();

			let params = new URLSearchParams({
				__url: this.urlUpload
			});

			var formData = new FormData();
			xhr.open('POST', '/proxy/forward?' + params.toString(), true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			// Add following event listener
			xhr.upload.addEventListener('progress', function (e) {
				that.updateProgress(id, (e.loaded * 100.0 / e.total) || 100);
			});

			xhr.addEventListener('readystatechange', function (e) {
				if (xhr.readyState == 4 && xhr.status == 200) {
					try {
						/** @type {{success: boolean, error_code: string, error_message: string}} */
						var response = JSON.parse(xhr.response);
						if (response.success) {
							that.uploadSuccess(id, response);
						} else {
							if (response.error_code == 'IMAGE_MAX_FILE_SIZE') {
								that.imageData[id].attemp++;
							}
							that.uploadFailed(id, response.error_message);
						}
					} catch (e) {
						that.uploadFailed(id, e);
					}
				} else if (xhr.readyState == 4 && xhr.status != 200) {
					that.uploadFailed(id, xhr.status);
				}
			});

			xhr.addEventListener('error', function (e) {
				that.uploadFailed(id, 'Network error');
			});
			xhr.addEventListener('abort', function (e) {
			});

			formData.append('id', id);
			formData.append('img_input_file', file);
			//console.log('After resize: ' + (file.size / 1204) + ' KB');
			xhr.send(formData);

			this.imageData[id].xhr = xhr;
			this.imageData[id].success = false;
			this.setState(id, 3);

			$('#' + this.element.imagePrefix + id).children('.loader:eq(0)').show();
		}

		this.uploadSuccess = function (id, response) {
			var that = this;

			$('#' + this.element.imagePrefix + id).children('.loader:eq(0)').css("width", '100%');

			this.imageData[id].success = true;
			this.imageData[id].url = response;
			this.setState(id, 1);

			$('#' + that.element.imagePrefix + id).children('div.image:eq(0)').css("opacity", '1');
			$('#' + that.element.imagePrefix + id).children('.loader:eq(0)').hide();
			$('#' + that.element.imagePrefix + id).children('.loader:eq(0)').css("width", '0%');

			/* var img = new Image();
			 img.onload = function () {		
				 $('#' + that.element.imagePrefix + id).children('.image:eq(0)').css("background-image", 'url(' + response.upload.url_s + ')');	
			 }
			 img.onerror = function(){
				 console.log('Image load error: ' + response.upload.url_s);
			 }
			 img.src = response.upload.url_s;*/
			this.onItemUploadCompleted();

			this.uploadNext();
		}

		this.retryUpload = function (id) {
			if (this.imageData[id].file === null) {
				console.log('Look like you\'re trying to upload an invalid file.');
				return false;
			}
			this.setState(id, 0);
			if (this.IsConcurrentReady()) {
				this.shouldImageUpload(this.imageData[id].file, id)
			}
			$('#' + this.element.imagePrefix + id).children('.error:eq(0)').hide();
			this.onInsertButtonStateChange(false);
		}

		this.uploadFailed = function (id, message) {
			this.setState(id, 2);
			$('#' + this.element.imagePrefix + id).children('.loader:eq(0)').hide();
			$('#' + this.element.imagePrefix + id).children('.loader:eq(0)').css("width", '0%');
			var error = $('#' + this.element.imagePrefix + id).children('.error:eq(0)');
			error.html('<h4>เกิดข้อผิดพลาด</h4><div style="max-height: 51px;">' + message + '</div><a class="btn-image-upload-retry" href="#">ลองใหม่</a>');
			error.css({ 'display': 'block' });
			this.onItemUploadCompleted();

			this.uploadNext();
		}

		this.notAllowFile = function (id, message) {
			this.setState(id, 2);
			this.imageData[id].valid = false;
			$('#' + this.element.imagePrefix + id).children('.loader:eq(0)').hide();
			$('#' + this.element.imagePrefix + id).children('.loader:eq(0)').css("width", '0%');
			$('#' + this.element.imagePrefix + id).children('.remove:eq(0)').show();
			var error = $('#' + this.element.imagePrefix + id).children('.error:eq(0)');
			error.html('<h4>เกิดข้อผิดพลาด</h4><div style="max-height: 51px;">' + message + '</div>');
			error.css({ 'display': 'block' });
			this.onItemUploadCompleted();
		}

		this.onItemUploadCompleted = function () {
			//var isCompleted = true;
			var count = [0, 0, 0, 0];
			var noFileCount = 0;
			var length = 0;
			for (var key in this.imageData) {
				length++;
				var item = this.imageData[key];
				if (item.file === null) {
					noFileCount++;
				} else {
					count[item.state]++;
				}
				/*
				if (item.state == 0) {
					isCompleted = false;
					break;
				}*/
			}
			//console.log('count: ' + count);
			//console.log(this.imageData.length, noFileCount);
			if (count[2] == length - noFileCount || count[0] + count[3] > 0) {
				this.onInsertButtonStateChange(false);
			} else {
				this.onInsertButtonStateChange(true);
			}
		}

		this.onInsertButtonStateChange = function (isCompleted) {
			if (isCompleted && this.total <= this.maxUploaded && this.total > 0) {
				var attr = $('#btn-insert-code').attr('disabled');
				if (typeof attr !== typeof undefined && attr !== false) {
					$('#btn-insert-code').removeAttr('disabled');
				}
			} else {
				$('#btn-insert-code').attr('disabled', 'disabled');
			}
		}

		this.uploadCancel_UNSED = function (id) {
			$('#' + this.element.imagePrefix + id).children('.loader:eq(0)').css("width", '0%');
		}

		this.updateProgress = function (id, percent) {
			if (percent < 100) {
				$('#' + this.element.imagePrefix + id).children('.loader:eq(0)').css("width", percent + '%');
			} else {
				$('#' + this.element.imagePrefix + id).children('.loader:eq(0)').css("width", '100%');
			}
		}

		this.initDeleteEvent = function () {
			var that = this;

			$(document).on('click', '.btn-remove', function (e) {
				var id = parseInt($(this).parent().attr('data-id'));
				$(this).remove();
				if (that.imageData[id].state === 0 || that.imageData[id].state === 3) {
					if (that.imageData[id].xhr !== null) {
						that.imageData[id].xhr.abort();
					}
					that.uploadFailed(id, 'Canceled');
					that.removeImage(id);
				} else if (that.imageData[id].state === 1) {
					that.deleteImage(id);
					that.removeImage(id);
				} else {
					that.removeImage(id);
				}
				that.onItemUploadCompleted();
				e.preventDefault();
			});

			$(document).on('click', '.btn-image-upload-retry', function (e) {
				var id = parseInt($(this).parent().parent().attr('data-id'));
				that.retryUpload(id);
				e.preventDefault();
			});

		}

		this.deleteImage = function (id) {
			var that = this;
			var res = this.imageData[id].url;

			let params = new URLSearchParams({
				name_o: res.data.name_o,
				name_s: res.data.name_s,
			});

			let params0 = new URLSearchParams({
				__url: this.urlDelete
			});

			var xhr = new XMLHttpRequest();
			var url = '/proxy/forward?' + params0.toString();

			xhr.open('POST', url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			//Send the proper header information along with the request
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			xhr.onreadystatechange = function () {//Call a function when the state changes.
				if (xhr.readyState == 4 && xhr.status == 200) {
					that.onImageDeleted(id);
				} else if (xhr.readyState == 4 && xhr.status != 200) {
					alert('HTTP ERROR ' + xhr.status);
				}
			};
			xhr.send(params.toString());
		}

		this.showOverUploadWarning = function (total) {
			if (total >= this.maxUploaded) {
				$('#select-image-btn').css({ 'opacity': '0.5', 'cursor': 'not-allowed' });
				$('#select-image-caption').css({ 'opacity': '0.5' });
			} else {
				$('#select-image-btn').css({ 'opacity': '1', 'cursor': 'pointer' });
				$('#select-image-caption').css({ 'opacity': '1' });
			}

			if (total > this.maxUploaded && !$('#over-upload-warning').hasClass('error-txt')) {
				$('#over-upload-warning').addClass('error-txt');
			} else if (total <= this.maxUploaded && $('#over-upload-warning').hasClass('error-txt')) {
				$('#over-upload-warning').removeClass('error-txt');
			}
			$('#image-upload-count').text('(' + total + ' / ' + this.maxUploaded + ')');
		}

		this.removeImage = function (id) {
			var that = this;
			$('#' + this.element.imagePrefix + id).fadeOut('fast', function () {
				$('#' + that.element.imagePrefix + id).remove();
			});
			that.total = that.total - 1;
			this.showOverUploadWarning(that.total);
			this.setState(id, 2);
			this.uploadNext();
		}

		this.onImageDeleted = function (id) {
			$('#' + this.element.imagePrefix + id).children('.image:eq(0)').css("opacity", '.a');
		}

		// these mnethod must be called once
		this.initDeleteEvent();
		this.initButtonEvent();
	}

	document.addEventListener('DOMContentLoaded', function () {
		window.ptImageUpload = new ImageUploadPt();
		window.ptImageUpload.init();
	}, false);

}());

function ptHandleFiles(files) {
	window.ptImageUpload.handleFiles(files);
};

$(document).ready(function(){
	
	// คลิกปุ่ม "ลบรูป" จากการ upload ในหน้าต่าง tab แรก	
	// when user has selected a file already.
	$('#image_cancel').confirm_lightbox({
		width:400,
		success_callback : function(ele) {
			$.ajax({
				type: "POST",
				dataType:'json',
				url : '/image_gallery/del_pic_temp',
				data: "o=" + $.image_gallery.varUpload.path_o + "&m=" + $.image_gallery.varUpload.path_m,
				success : function(result) {
					if(result.error == true)
					{
						$.errorNotice.dialog(result.error_message);
						return false;
					}					
					$('#' + $.image_gallery.defaults.id_el_lb).html(result.form_upload);
					// when user has selected a file already.
					$('#img_input_file').on('change',$.image_gallery.ajaxFormUpload);

					return false;
				}
			}) // End ajax
			return false;
		}
	});
	

});

/*
 *-----------------------------------------------------------------
 * Begin : Plugin Image gallery
 *-----------------------------------------------------------------
 * @author : Tong
 * @version : 1.1
 * @file-request :
 *    - lastest_jquery_ui.js
 *    - lastest_jquery_ui.css
 *    - style.css
 *    - lastest_jquery.js
 *    - current_position_jquery.js //สำหรับ detect ตำแหน่งใน textarea
 *    - jquery.iframe-post-form.js // สำหรับ upload ajax

 * @return : void
 * @description : this plugin use for create a image gallery
 * @param {String} : title_lb ( title ของ ligthbox ใหญ่ )
 * @param {String} : label_btn ( label ของปุ่ม แทรกรูปลงกระทู้ )
 * @param {function} : callbackAfterUploaded
 *   ( ถ้ามีการใส่ฟังก์ชั่นมาด้วยจะทำการคืนค่า url ของรูปภาพกลับไปให้ยังฟังก์ชั่น ถ้ากำหนดฟังก์ชั่นนี้ตัวแปร inputUploaded นั้นจะไม่ทำงาน)
 * @param {element selector} : inputUploaded ( ถ้าไม่มีการกำหนดจะลงค่าไปยัง $('#detail') )
 * @warning :  *** this plugin CANNOT changing method ***
 * @example : การใช้นั้นจำเป็นต้องเรียกหลังจากตัว element นั้นถูกคลิกแล้วเช่น
 *<code>
 * $('#element').live('click',function(){
 *		$(this).image_gallery({
 *			'callbackAfterUploaded' : function(img_url) {(
 *			    console.log('tong');
 *			)}
 *		});
 *
 * });
 *</code>
 */
(function($){
	
	$.image_gallery = {};
	
	$.image_gallery.init	=	function(options)
	{
		window.image_gallery_is_tinymce = false;
		if (typeof options !== 'undefined') {
			if (typeof options.is_tinymce !== 'undefined') {
				window.image_gallery_is_tinymce = true;
			}
		}
		$.image_gallery.varWarehouse.click_edit_onetime = true;
		var div_image_gallery = '<div id="image_lb_process" class="lightbox-hide"></div>';
		$('div:last').append(div_image_gallery);
		var windowHeight = parseInt(windowSize() - 20);
		
		// call dialog
		$.ajax({
			type: "POST",
			dataType:'html json',
			url: $.image_gallery.defaults.lb_frame_url,
			data: {mode: $.image_gallery.defaults.mode},
			success: function(result){
				if(result.error == true)
				{
					//alert('error ' + result.error_message);
					$.errorNotice.dialog(result.error_message);
					return false;
				}
				//console.log('ajax send success');
				// Call lightbox 3 tabs
				$('#' + $.image_gallery.defaults.id_el_lb)
				.dialog({
					width: 720,
					height: windowHeight,
					title: $.image_gallery.defaults.title_lb,
					modal: true,
					resizable: false,
					draggable: false,
					close: function()
					{								
						$('#' + $.image_gallery.defaults.id_el_lb).dialog('destroy');
						$('#' + $.image_gallery.defaults.id_el_lb).remove();
					}
				})
				.html(result.form_upload);
				
				// when user has selected a file already.
				$('#img_input_file').on('change',$.image_gallery.ajaxFormUpload);
				// detect ถ้า user กดเลือก tab แรก
				$('#' + $.image_gallery.defaults.id_el_lb).on('click','#img_upload,#img_url,#img_warehouse',loadpage);

				if (typeof window.ptImageUpload !== typeof undefined) {
					window.ptImageUpload.init();
				} else {
					console.log('Image mutiple upload script is not loaded property.');
				}
				
				return false;
			} // End Success
		}); // Edn ajax()

		return false;
	}

	
	$.image_gallery.ajaxFormUpload = function()
	{	
		//console.log('aaaa');
		$('#upload form').iframePostForm({
			json : true,
			post : function ()
			{
				$('#loading').html('<span class="loading-txt small-txt">กำลังอัปโหลดไฟล์รูปภาพ โปรดรอสักครู่</span>');
			},
			complete : function (response)
			{
				//console.log(response);
				// Notification Error
				if (!response.success)
				{
					var txt_error = '';
					if(response.error == 'type_error')
					{
						txt_error = 'กรุณาเลือกไฟล์นามสกุล gif, jpg หรือ png';
					}
					else if(response.error == 'size_error')
					{
						txt_error = 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 700K';
					}
					else if(response.error == 'size_type_error')
					{
						txt_error = 'กรุณาเลือกไฟล์นามสกุล gif, jpg หรือ png และมีขนาดไม่เกิน 700K';
					}
					$('#loading').html('<span class="error-txt small-txt">'+txt_error+'</span>');
					return false;
				}
				else
				{
					// Success !!
					$('#loading').html('');
					var url = response.upload.url_s;
					var filename	=	response.upload.only_name;
					$.ajax({
						type: "POST",
						dataType: 'json',
						url: "/image_gallery/lb_image",
						data: "url="+url,
						async: false,
						success: function(result){
							if(result.error == true)
							{
								$.errorNotice.dialog(result.error_message);
								return false;
							}	
							$('#image_load').html(result.form_upload);
							$('#image_confirm').find('em').html('ใส่รูปภาพลงในข้อความ');
							// edit by tong
							$('#input_image_url').val(filename).select();
							var varObj	=	{
								img_showing_path	:	response.upload.url_o,
								path_o	:	response.upload.del_o,
								path_m	:	response.upload.del_s,
								name_img_o	:	response.upload.name_o,
								name_img_m	:	response.upload.name_s
							}
							$.extend($.image_gallery.varUpload,varObj);							
							$('#image_confirm').one('click',imgUpload_insert_upload_image);
						
							return false;
						}
					});
				}
				return false;
			} // End : complete
		});
		$('#forum_form').submit();
		return false;
	}
	
	$.image_gallery.image_upload_page = function() 
	{		
		// แสดงรายละเอียดของเมนูแทบแรก image upload
		if(ajaxSending == false)
		{
			$.ajax({
				type: "POST",
				dataType:'json',
				url: '/image_gallery/lb_image',
				async: false,
				success: function(result){
					if(result.error == true)
					{
						$.errorNotice.dialog(result.error_message);
						return false;
					}					

					$('#image_load').show();
					$('#my_image_store').hide();
					//$('#' + $.image_gallery.defaults.id_el_lb).html(result.form_upload);
					$('#img_input_file').on('change',$.image_gallery.ajaxFormUpload);
				}
			});
		}
	}
	
	$.image_gallery.image_url_page = function()
	{
		// แสดงรายละเอียดของเมนูแทบที่สอง url
		if(ajaxSending == false)
		{
			$.ajax({
				type: "POST",
				url: "/image_gallery/lb_image_url",
				data: "",
				success: function(result){
					$('#image_load').html(result);
					$('#image_confirm_url').find('em').html('ใส่รูปภาพลงในข้อความ');
					$('#input_image').focus();
					$('#input_image').on('keyup', imgUrl_check_url);
					$('#image_cancel_url').on('click keydown',imgUrl_cancel_url);
					$('#image_confirm_url').on('click',imgUrl_put_url); // End image_confirm_url live.click
					return false;
				}
			});
		} // End ajaxSending == false
		
		
	}
	
	$.image_gallery.image_warehouse_page = function()
	{
		// แสดงรายละเอียดของเมนูแทบที่สาม image warehouse
		if(ajaxSending == false)
		{
			var d = new Date();
			$.ajax({
				type: "POST",
				dataType: 'json',
				url: "/image_gallery/lb_image_warehouse?t=" + d.getTime(),
				success: function(result)
				{
					if(result.error == true)
					{
						$.errorNotice.dialog(result.error_message);
						return false;
					}	
					
					$('ul.media-library-pagination.small-txt li:last').addClass('disabled');
					$('ul.media-library-pagination.small-txt li:first').addClass('disabled');

					$('#my_image_store').html(result.form_werehouse).show();
					$('#image_load').hide();
					/*
					 * Get image data thumbnail
					 */

					$.getJSON('/image_gallery/get_photos/1', function(data)
					{
						if (data.error == true) {
							$.errorNotice.dialog(data.error_message);
							$('ul.media-library-pagination.small-txt li:last').removeClass('disabled');
							$('ul.media-library-pagination.small-txt li:first').removeClass('disabled');
							return false;
						}
						if(data != 'null')
						{
							var item	=	[];
							var amount_page;
							totalPages	=	data.total_pages;
							$('#total_photos').html(data.total_photos);
							current_page	=	1;

							if(totalPages >= 5)
							{
								amount_page = 5;
							}
							else
							{
								amount_page = totalPages;
							}
							if(totalPages > 1)
							{
								$('ul.media-library-pagination.small-txt li:last').show();
							}


							var $i;
							var first_round = true;
							for($i= 1; $i <= amount_page; $i++)
							{
								if(first_round)
								{
									$('<li><a href="javascript:void(0);" class="current">' + $i + '</a></li>').insertBefore('ul.media-library-pagination.small-txt li:last');
									first_round = false;
								}
								else
								{
									$('<li><a href="javascript:void(0);">' + $i + '</a></li>').insertBefore('ul.media-library-pagination.small-txt li:last');
								}
							}

//							$.each(data.images,function(key,val)
//							{
//								var div = '<div class="media-library-thumbnail-item" id="picture-' + val._id + '">'
//								+ '<div class="media-library-thumbnail">'
//								+ '<div class="media-library-thumbnail-edit-bg">'
//								+ '</div>'
//								+ '<div class="media-library-thumbnail-edit-wrapper">'
//								+ '<div class="media-library-thumbnail-edit">'
//								+ '<a class="edit-title-image-button" href="javascript:void(0);">'
//								+ 'แก้ไขชื่อ'
//								+ '</a>'
//								+ ' | <a href="javascript:void(0);" class="error-txt">ลบ</a>'
//								+ '</div>'
//								+ '<div class="media-library-thumbnail-add">'
//								+ '<a tabindex="3" class="button letdo-butt insert_link_image"  href="javascript:void(0);">'
//								+ '<span><em>แทรกรูปลงกระทู้</em></span>'
//								+ '</a>'
//								+ '</div>'
//								+ '</div>'
//								+ '<img src="' + val.url_pic + '" width="200"/>'
//								+ '</div>'
//								+ '<p class="media-library-thumbnail-title">' + val.title + '</p>'
//								+ '</div>';
//								$(div).appendTo('#image_load');
//								$('#picture-' + val._id).data("id" , val._id );
////								$.data($('#picture-' + val._id),'id' , val._id);
//								
//							}); //End each
							$('ul.media-library-pagination.small-txt li:last').removeClass('disabled');
							$('ul.media-library-pagination.small-txt li:first').removeClass('disabled');
							insert_images(data.images);
							//call all function event with warehouse
							warehouse_bundle()
							
						} // End data != null
					}); // End getJSON
				} // End success
			}); // End ajax
		} // End ajaxSending == false
	}
		
	/************************************* Private Function *******************************/
	function loadpage()
	{		
		if(ajaxSending == false)
		{
			var id_current	=	toggleCurrent($(this));			
			if(id_current == 'img_upload')
			{
				$.image_gallery.image_upload_page();
			}
			else if(id_current == 'img_url')
			{
				$.image_gallery.image_url_page();
			}
			else if(id_current == 'img_warehouse')
			{
				$.image_gallery.image_warehouse_page();
			}
		}		
	}
	
	
	function toggleCurrent(ele_selector)
	{
		$('#img_url').removeClass('current');
		$('#img_warehouse').removeClass('current');
		$('#img_upload').removeClass('current');
		ele_selector.addClass('current');
		return ele_selector.attr('id');
	}
	/*
	 *----------------------------------------------------------------------------
	 *|					Begin: Controll File from user's computer				 |
	 *----------------------------------------------------------------------------
	 */

	$.image_gallery.imgUpload_submit_upload_multiple = function (data, callback) 
	{
		let config = getGlobalConfig();
		var counter = 0;
		var errorCount = 0;

		let params = new URLSearchParams({
			__url: config.file_services_base_url + 'v1.0.0/image_gallery/insert_image'
		});

		for (var i = 0; i < data.length; i++) {
			var varUpload = data[i];
			$.ajax({
				i: i,
				url: '/proxy/forward?' + params.toString(),
				type : "POST",
				dataType:'json',
				data: varUpload,
				success : function(result){
					if (!result.success) {
						errorCount++;
						$.errorNotice.dialog(result.error_message);
						$('#img-waiting-loading').hide();
						$('#btn-insert-code').show();
						console.error(result);
						return false;
					}

					// comment for using original image (proxy image on next phase) [06/02/2024]
					// let imageUrl;
					// if (result.data.url_proxy_o != "") {
					// 	imageUrl = result.data.url_proxy_o;
					// } else {
					// 	imageUrl = result.data.url_o;
					// }
					
					let imageUrl = result.data.url_o;

					data[this.i].url = imageUrl;
					
					counter++;
					if (counter === data.length - errorCount) {
						let imageUrls = data.map(function (image) {
							return image.url;
						});
						if (!window.image_gallery_is_tinymce) {
							if (typeof ($.image_gallery.defaults.callbackAfterUploaded) !== 'function') {
								let str = imageUrls.map(function (url) {
									return '[img]' + url + '[/img]';
								}).join("\n\n");
								$($.image_gallery.defaults.inputUploaded).replaceSelectedText(str);
							}
							else {
								$.image_gallery.defaults.callbackAfterUploaded(imageUrl);
							}	
						} else {
							imageUrls.forEach(function (url) {
								richTextEditorHelper.insertCustomElement('IMAGE', {
									src: url
								});
							});
						}
						$('#' + $.image_gallery.defaults.id_el_lb).dialog('destory');
						$('#' + $.image_gallery.defaults.id_el_lb).remove();
						
					}
					return false;
				}, error : function(jqXHR, exception){
					errorCount++;
					$.errorNotice.dialog('มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง',{
						title : 'แจ้งเตือน',
						btn_close:'ดำเนินการต่อ'
					});
					callback();
				}
			});
		}
	}

	/**
	 * @deprecated The usages was moved to imgUpload_submit_upload_multiple.
	 */
	function imgUpload_submit_upload () 
	{
		var varUpload	=	$.image_gallery.varUpload;
	
		var title_image	=	$('#input_image_url').val();

		if(typeof title_image == 'undefined' ) {
			title_image	= varUpload.title_image;
		}
		
		$.ajax({
			url : '/image_gallery/insert_image',
			type : "POST",
			dataType:'json',
			data : "o=" + varUpload.path_o 
				+ "&m=" + varUpload.path_m 
				+ "&title=" + title_image 
				+ "&name_img_o=" + varUpload.name_img_o 
				+ "&name_img_m=" + varUpload.name_img_m,
			success : function(result){
				if(result.error == true)
				{
					$.errorNotice.dialog(result.error_message);
					return false;
				}		
				if(typeof($.image_gallery.defaults.callbackAfterUploaded) !== 'function')
				{
					var fill_input = function(link_url)
					{	
						$($.image_gallery.defaults.inputUploaded).replaceSelectedText('[img]' + link_url + '[/img]'+ "\n");						
					}
					fill_input(result.path);
				}
				else
				{
					$.image_gallery.defaults.callbackAfterUploaded(result.path);
				}
				return false;
			}
			,error : function(jqXHR,exception){
					$.errorNotice.dialog('มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง',{
						title : 'แจ้งเตือน',
						btn_close:'ดำเนินการต่อ'
					});
			}
		})
		// End ajax
		return false;
	} // End submit_upload

	// ปุ่มแทรกลงกระทู้ ของ image upload
	function imgUpload_insert_upload_image(e)
	{
		e.preventDefault();
		e.stopPropagation();

		imgUpload_submit_upload();
		$('#' + $.image_gallery.defaults.id_el_lb).dialog('destroy');
		$('#' + $.image_gallery.defaults.id_el_lb).remove();
		return false;
	}
	/*
	 *----------------------------------------------------------------------------
	 *|					End: Controll File from user's computer					 |
	 *----------------------------------------------------------------------------
	 */
	
	
	/*
	 *----------------------------------------------------------------------------
	 *|					Controll URL 3rd API									 |
	 *----------------------------------------------------------------------------
	 */
	function imgUrl_check_url(e)
	{
		if(e.which == 13)
		{
			// for push enter button
			$('#image_confirm_url').trigger('click');
			return false;
		}
		else
		{
			$('#error_image').html('');
			if($('#input_image').val() == '')
			{
				$('#error_image').html('<span class="error-txt small-txt">*กรุณาใส่ลิงก์รูปภาพที่ต้องการ</span>');
				$('#error_image').val('false');
			}
			else
			{
				if(!$('#input_image').val().match(/flickr\.com.|multiply\.com.|ptcdn\.info./))
				{
					$('#error_image').html('<span class="error-txt small-txt">*ไม่สามารถดึงรูปภาพได้ กรุณาเลือกรูปภาพจากเว็บที่รองรับ</span>');
					$('#error_image').val('false');
				}
				else
				{
					$('#error_image').val('true');
				//$('#error_image').html('<span class="success-txt small-txt">*ลิงก์ถูกต้อง</span>');
				}
			}
		}
	}
	

	
	function imgUrl_put_url()
	{
		var tag = '';
		var tag_without_img = '';
		if($('#error_image').val() == 'false')
		{
			$('#input_image').focus();
		}
		else
		{			
			if($('#input_image').val().match(/flickr\.com.|multiply\.com.|ptcdn\.info./))
			{
				tag_without_img = $('#input_image').val();
				tag = '[img]'+$('#input_image').val()+'[/img]\n';
			}
			else
			{
				$('#input_image').focus();
				$('#error_image').html('<span class="error-txt small-txt">*ไม่สามารถดึงรูปภาพได้ กรุณาเลือกรูปภาพจากเว็บที่รองรับ</span>');
			}
		}
		//แทรก tag in input name=detail
		if(tag != '')
		{
			if(typeof($.image_gallery.defaults.callbackAfterUploaded) === 'function')
			{
				$.image_gallery.defaults.callbackAfterUploaded(tag_without_img);
			}
			else
			{
				var fill_input_url = function(link_url)
				{
					$($.image_gallery.defaults.inputUploaded).surroundSelectedText(link_url, '', true);
				}
				fill_input_url(tag);
			}
			$('#image_lb_process').dialog('destroy');
			$('#image_lb_process').remove();
		}
		else
		{
			$('#input_image').focus();
		}
		set_var_default();
	}
	function imgUrl_cancel_url(e)
	{
		if(e.shiftKey && e.keyCode == 9)
		{
			return true;
		}
		else if (e.keyCode == 9)
		{
			$('#input_image').select();
			return false;
		}
		else if (e.keyCode == 16)
		{
			return false;
		}
		$('#image_lb_process').dialog('destroy');
		$('#image_lb_process').remove();
	}
	/*
	 *----------------------------------------------------------------------------
	 *|					End: Controll URL 3rd API								 |
	 *----------------------------------------------------------------------------
	 */
	
	/*
	 * ------------------------------------------------------------------------------
	 *					Controll werehouse image
	 * ------------------------------------------------------------------------------
	 */
	
	function warehouse_bundle()
	{
		$('.insert_link_image').on('click',warehouse_put_image);
		$('.media-library-pagination a[class!=next][class!=prev]').on('click',warehouse_number_pagination_click);
		$('.prev,.next').on('click',warehouse_prev_next_pagination);		
		$('.edit-title-image-button').on('click',warehouse_edit_title_clicked);
		$('.error-txt').on('click', function(e) {
			targetElement = e.target;
		});
		
		/*
		 * toggle edit,del,insert
		 */
		$(".media-library-thumbnail-item").on('mouseover mouseout', function(event) {
			if (event.type == 'mouseover') {
				$(this).addClass("hover");
			} else {
				$(this).removeClass("hover");
			}
		});
		$('.media-library-thumbnail-edit-wrapper').on('click',function(){
			$('.media-library-thumbnail-edit-wrapper').removeClass("image_gallery_active");
			$(this).addClass("image_gallery_active");
		});
		
	}
	
	// ปุ่มแทรกลงกระทู้สำหรับเวลาเลือกใน werehouse
	function warehouse_put_image()
	{
		var url_image = $(this).parents('.media-library-thumbnail-edit-wrapper').next().attr('data-original');
		if(typeof($.image_gallery.defaults.callbackAfterUploaded) === 'function')
		{
			$.image_gallery.defaults.callbackAfterUploaded(url_image);
		}
		else
		{
			var get_picture_url = function(link_url)
			{
				if (!window.image_gallery_is_tinymce) {
					$($.image_gallery.defaults.inputUploaded).replaceSelectedText('[img]' + link_url + '[/img]');
				} else {
					richTextEditorHelper.insertCustomElement('IMAGE', {
						src: link_url
					});
				}
			}
			get_picture_url(url_image);
		}
		set_var_default();
		$('#image_lb_process').dialog('destroy');
		$('#image_lb_process').remove();
	}
	
	
	
	function warehouse_del_image_gallery() 
	{		
		if(ajaxSending == false)
		{
			$(".media-library-thumbnail-item").addClass("disabled");
			var id  = $('.image_gallery_active').parents('.media-library-thumbnail-item').data('id');
			var src	= $('.image_gallery_active').next().attr('src');
			$.ajax({
				url: "/image_gallery/del_pic",
				type: "POST",
				dataType:'json',
				data : "id=" + id + "&src=" + src ,
				success: function(result){
					if(result.error == true)
					{
						$.errorNotice.dialog(result.error_message);
						$(".media-library-thumbnail-item").removeClass("disabled");
						return false;
					}		
					// Check ajax status sending or not ?
					ajaxSending = false;
					// Delete that image in showing window
					$('.image_gallery_active').parents('.media-library-thumbnail-item').remove();
						var new_total_photos	=	parseInt($('#total_photos').text()) - 1;
						$('#total_photos').html(new_total_photos);
					// ถ้าจำนวนทั้งหมดถูกลบในหน้าที่แสดง 9 รูป					
					if($('.media-library-thumbnail-item').length == 0)
					{						
						var chk_next	=	 $('.media-library-pagination a.current').parent().next().children('[class!=next]').length;
						var chk_prev	=	 $('.media-library-pagination a.current').parent().prev().children('[class!=prev]').length;
						// ถ้ามีเป็นหน้าตรงกลางที่ยังมีปุ่น next , prev อยู่
						if(chk_next == 1 && chk_prev == 1)
						{						
							$('.media-library-pagination a[class=current]').removeClass('current').trigger('click');
						}
						else if(current_page == 1)
						{						
							// ถ้าเป็นหน้าแรก
							$('.media-library-pagination a[class=current]').removeClass('current').trigger('click');
						}
						else
						{							
							// ถ้าเป็นหน้าสุดท้าย
							$('.media-library-pagination a[class=prev]').trigger('click');
						}
					}
					$(".media-library-thumbnail-item").removeClass("disabled");

					// reorder old_data title
					$.image_gallery.varWarehouse.old_data = new Array();
					$.each($('.media-library-thumbnail-title'),function(index,el){
						$.image_gallery.varWarehouse.old_data.push($(el).text());
					});
					$.image_gallery.varWarehouse.old_data.reverse();
				}
			});
		} // end ajaxSending
	};
	
	/*---------------------------------------------------------------
	 *|				 when user click prev,next button				|
	 *---------------------------------------------------------------
	 */
	
	
	function warehouse_prev_next_pagination()
	{
		if($(this).attr('class') == 'next')
		{
			$('ul.media-library-pagination.small-txt li:last').addClass('disabled');
			$('ul.media-library-pagination.small-txt li:first').addClass('disabled');
			if(ajaxSending == false)
			{
				// reset global value
				$.image_gallery.varWarehouse.old_data = new Array();
				click_edit_onetime	= $.image_gallery.varWarehouse.click_edit_onetime;
				// end reset global value
				var page_num	=	$('.current').text();
				var next_page	=	parseInt(current_page) + 1;
				var next_el		=	$('.current').parent().next().children();
				
				$.image_gallery.varWarehouse.next_page_group	=	next_page + 4;
				if($.image_gallery.varWarehouse.next_page_group >= totalPages)
				{
					$.image_gallery.varWarehouse.next_page_group = totalPages;
				}
				// กด next ถึงตัวสุดท้ายแล้วเราจะทำการลบตัวเดิม page เดิมออกใส่ชุดใหม่เข้าไป
				if(current_page%$.image_gallery.varWarehouse.limit == 0)
				{
					$.image_gallery.varWarehouse.first_number_current_page_of_group	=	parseInt(current_page) + 1;

					// ลบของเดิมก่อน
					$('.media-library-pagination a[class!=next][class!=prev]').parent().remove();
					var $i;
					var first_round = true;
					for($i= parseInt(current_page) + 1; $i <= $.image_gallery.varWarehouse.next_page_group; $i++)
					{
						if(first_round)
						{
							$('<li><a href="javascript:void(0);" class="current">' + $i + '</a></li>').insertBefore('ul.media-library-pagination.small-txt li:last');
							first_round = false;
						}
						else
						{
							$('<li><a href="javascript:void(0);">' + $i + '</a></li>').insertBefore('ul.media-library-pagination.small-txt li:last');
						}
					}

					next_el	=	$('.current');
				}
				$('.media-library-pagination a').removeClass('current');
				next_el.addClass('current');



				// get images data and show
				$.getJSON('/image_gallery/get_photos/' + next_page, function(data)
				{
					if (data.error == true) {
						$.errorNotice.dialog(data.error_message);
						$('ul.media-library-pagination.small-txt li:last').removeClass('disabled');
						$('ul.media-library-pagination.small-txt li:first').removeClass('disabled');
						return false;
					}
					var item	=	[];
					totalPages	=	data.total_pages;
					$('#total_photos').html(data.total_photos);
					current_page	=	next_page;
					if(totalPages >= 1)
					{
						if(next_page != 1)
						{
							$('ul.media-library-pagination.small-txt li:first').show();
						}
						else
						{
							$('ul.media-library-pagination.small-txt li:first').hide();
						}

						if(next_page == totalPages)
						{
							$('ul.media-library-pagination.small-txt li:last').hide();
						}
						else
						{
							$('ul.media-library-pagination.small-txt li:last').show();
						}
					}

					$('ul.media-library-pagination.small-txt li:last').removeClass('disabled');
					$('ul.media-library-pagination.small-txt li:first').removeClass('disabled');
					$('#image_load .media-library-thumbnail-item').remove();
					$('#my_image_store .media-library-thumbnail-item').remove();
					insert_images(data.images);
//					$.each(data.images,function(key,val){
//						var div = '<div class="media-library-thumbnail-item"><div class="media-library-thumbnail"><div class="media-library-thumbnail-edit-bg"></div><div class="media-library-thumbnail-edit-wrapper"><div class="media-library-thumbnail-edit"><a class="edit-title-image-button" href="javascript:void(0);">แก้ไขชื่อ</a> | <a href="javascript:void(0);" class="error-txt">ลบ</a></div><div class="media-library-thumbnail-add"><a tabindex="3" class="button letdo-butt insert_link_image"  href="javascript:void(0);"><span><em>แทรกรูปลงกระทู้</em></span></a></div></div><img src="' + val.url_pic + '" width="200"/></div><p class="media-library-thumbnail-title">' + val.title + '</p></div>';
//						$('#image_load').append(div);
//					});
					//call all function event with warehouse
					warehouse_bundle();
				});
			}
		}
		else
		{
			// Prev
			if(ajaxSending == false && current_page != 1)
			{
				$('ul.media-library-pagination.small-txt li:last').addClass('disabled');
				$('ul.media-library-pagination.small-txt li:first').addClass('disabled');
				// reset global value
				$.image_gallery.varWarehouse.old_data = new Array();
				click_edit_onetime	= true;
				// end reset global value
				var page_num	=	$('.current').text();
				var prev_page	=	parseInt(current_page) - 1;
				var prev_el		=	$('.media-library-pagination .current').parent().prev().children();
				$.image_gallery.varWarehouse.prev_page_group	=	prev_page - 4;

				// กด prev ถึงตัวสุดท้ายแล้วเราจะทำการลบตัวเดิม page เดิมออกใส่ชุดใหม่เข้าไป
				if(current_page%$.image_gallery.varWarehouse.limit == 1)
				{
					$.image_gallery.varWarehouse.first_number_current_page_of_group	=	$.image_gallery.varWarehouse.prev_page_group;
					// ลบของเดิมก่อน
					$('.media-library-pagination a[class!=next][class!=prev]').parent().remove();
					var $i;
					var first_round = true;
					for($i= parseInt(current_page) - 1; $i >= $.image_gallery.varWarehouse.prev_page_group; $i--)
					{
						if(first_round)
						{
							$('<li><a href="javascript:void(0);" class="current">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
							first_round = false;
						}
						else
						{
							$('<li><a href="javascript:void(0);">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
						}

					}
					prev_el	=	$('.media-library-pagination .current');
				}
				$('.media-library-pagination a').removeClass('current');
				prev_el.addClass('current');



				$.getJSON('/image_gallery/get_photos/' + prev_page, function(data)
				{
					if (data.error == true) {
						$.errorNotice.dialog(data.error_message);
						$('ul.media-library-pagination.small-txt li:last').removeClass('disabled');
						$('ul.media-library-pagination.small-txt li:first').removeClass('disabled');
						return false;
					}
					var item	=	[];
					totalPages	=	data.total_pages;
					$('#total_photos').html(data.total_photos);
					current_page	=	prev_page;

					//alert('current_page=' + current_page + ' totalPages=' + totalPages);
					/*
					 *  เงื่อนไขนี้ใช้สำหรับเวลาลบทุก record ภาพแล้วเป็นหน้าสุดท้ายตัวแรกซึ่งต้องขึ้นแถวใหม่เช่นหน้า 6 ต้องกลับไปหน้า 1 - 5
					 *  จะทำการลบหน้าที่ไม่มีอยู่จริงออก
					 */

					if(current_page == totalPages)
					{
						// กด ตัวเลขหน้าเพจ แล้วต้องเช็คว่าจำนวนหน้าเพจเปลี่ยนจริงๆหรือเปล่า

						// ลบของเดิมก่อน
						$('.media-library-pagination a[class!=next][class!=prev]').parent().remove();
						var $i;
						var first_round = true;
						var first_page_section	=	$.image_gallery.varWarehouse.first_number_current_page_of_group;

						for($i= parseInt(current_page); $i >= parseInt(first_page_section); $i--)
						{
							if(first_round)
							{
								$('<li><a href="javascript:void(0);" class="current">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
								first_round = false;
							}
							else
							{
								$('<li><a href="javascript:void(0);">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
							}
						}
					}
					if(totalPages >= 1)
					{
						if(prev_page != 1)
						{
							$('ul.media-library-pagination.small-txt li:first').show();
						}
						else
						{
							$('ul.media-library-pagination.small-txt li:first').hide();
						}

						if(prev_page == totalPages)
						{
							$('ul.media-library-pagination.small-txt li:last').hide();
						}
						else
						{
							$('ul.media-library-pagination.small-txt li:last').show();
						}


					}
					$('ul.media-library-pagination.small-txt li:last').removeClass('disabled');
					$('ul.media-library-pagination.small-txt li:first').removeClass('disabled');
					$('#image_load .media-library-thumbnail-item').remove();
					$('#my_image_store .media-library-thumbnail-item').remove();
					insert_images(data.images);
//					$.each(data.images,function(key,val){
//						var div = '<div class="media-library-thumbnail-item"><div class="media-library-thumbnail"><div class="media-library-thumbnail-edit-bg"></div><div class="media-library-thumbnail-edit-wrapper"><div class="media-library-thumbnail-edit"><a class="edit-title-image-button" href="javascript:void(0);">แก้ไขชื่อ</a> | <a href="javascript:void(0);" class="error-txt">ลบ</a></div><div class="media-library-thumbnail-add"><a tabindex="3" class="button letdo-butt insert_link_image"  href="javascript:void(0);"><span><em>แทรกรูปลงกระทู้</em></span></a></div></div><img src="' + val.url_pic + '" width="200"/></div><p class="media-library-thumbnail-title">' + val.title + '</p></div>';
//						$('#image_load').append(div);
//					});
					//call all function event with warehouse
					warehouse_bundle();
				});
			}
		}
	}
	
	/*
	 * detect click on number page
	 */
	
	function warehouse_number_pagination_click(e)
	{
		e.preventDefault();
		e.stopPropagation();
		if(ajaxSending == false)
		{
			var el_class = $(this).attr('class');
			var page_num	=	$(this).text();
			var el		=	$(this);

			$('ul.media-library-pagination.small-txt li:last').addClass('disabled');
			$('ul.media-library-pagination.small-txt li:first').addClass('disabled');

			// reset global value		
			$.image_gallery.varWarehouse.old_data = new Array();
			$.image_gallery.varWarehouse.click_edit_onetime	= true;
			// end reset global value
			if(el_class != 'current')
			{
				$('.media-library-pagination a').removeClass('current');
				el.addClass('current');
				$.getJSON('/image_gallery/get_photos/' + page_num, function(data)
				{
					if (data.error == true) {
						$.errorNotice.dialog(data.error_message);
						$('ul.media-library-pagination.small-txt li:last').removeClass('disabled');
						$('ul.media-library-pagination.small-txt li:first').removeClass('disabled');
						return false;
					}
					if(data != "null")
					{
						var item	=	[];
						totalPages	=	data.total_pages;
						$('#total_photos').html(data.total_photos);
						current_page	=	page_num;
						if(current_page >= totalPages)
						{
							// กด ตัวเลขหน้าเพจ แล้วต้องเช็คว่าจำนวนหน้าเพจเปลี่ยนจริงๆหรือเปล่า

							// ลบของเดิมก่อน
							$('.media-library-pagination a[class!=next][class!=prev]').parent().remove();
							var $i;
							var first_round = true;

							for($i= parseInt(current_page); $i >= $.image_gallery.varWarehouse.first_number_current_page_of_group; $i--)
							{
								if(first_round)
								{
									$('<li><a href="javascript:void(0);" class="current">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
									first_round = false;
								}
								else
								{
									$('<li><a href="javascript:void(0);">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
								}
							}
						}
						if(totalPages >= 1)
						{
							if(page_num != 1)
							{
								$('ul.media-library-pagination.small-txt li:first').show();
							}
							else
							{
								$('ul.media-library-pagination.small-txt li:first').hide();
							}

							if(page_num == totalPages)
							{
								$('ul.media-library-pagination.small-txt li:last').hide();
							}
							else
							{
								$('ul.media-library-pagination.small-txt li:last').show();
							}
						}
						$('ul.media-library-pagination.small-txt li:last').removeClass('disabled');
						$('ul.media-library-pagination.small-txt li:first').removeClass('disabled');
						$('#image_load .media-library-thumbnail-item').remove();
						$('#my_image_store .media-library-thumbnail-item').remove();
						insert_images(data.images);
//						$.each(data.images,function(key,val){
//							var div = '<div class="media-library-thumbnail-item"><div class="media-library-thumbnail"><div class="media-library-thumbnail-edit-bg"></div><div class="media-library-thumbnail-edit-wrapper"><div class="media-library-thumbnail-edit"><a class="edit-title-image-button" href="javascript:void(0);">แก้ไขชื่อ</a> | <a href="javascript:void(0);" class="error-txt">ลบ</a></div><div class="media-library-thumbnail-add"><a tabindex="3" class="button letdo-butt insert_link_image"  href="javascript:void(0);"><span><em>แทรกรูปลงกระทู้</em></span></a></div></div><img src="' + val.url_pic + '" width="200"/></div><p class="media-library-thumbnail-title">' + val.title + '</p></div>';
//							$('#image_load').append(div);
//							$('#picture-' + val._id).data("id" , val._id );
//						});			
						//call all function event with warehouse
						warehouse_bundle();
					}
				});
			}
		}
	}
	
	function insert_images(data_images)
	{
		$.each(data_images,function(key,val){
			var div = '<div class="media-library-thumbnail-item" id="picture-' + val._id + '">'
			+ '<div class="media-library-thumbnail">'
			+ '<div class="media-library-thumbnail-edit-bg">'
			+ '</div>'
			+ '<div class="media-library-thumbnail-edit-wrapper">'
			+ '<div class="media-library-thumbnail-edit">'
			+ '<a class="edit-title-image-button" href="javascript:void(0);">'
			+ 'แก้ไขชื่อ'
			+ '</a>'
			+ ' | <a href="javascript:void(0);" class="error-txt">ลบ</a>'
			+ '</div>'
			+ '<div class="media-library-thumbnail-add">'
			+ '<a tabindex="3" class="button letdo-butt insert_link_image"  href="javascript:void(0);">'
			+ '<span><em>แทรกรูปลงกระทู้</em></span>'
			+ '</a>'
			+ '</div>'
			+ '</div>'
			+ '<img src="' + val.url_pic + '" data-original="' + val.url_pic_original + '" width="200"/>'
			+ '</div>'
			+ '<p class="media-library-thumbnail-title">' + val.title + '</p>'
			+ '</div>';
			$(div).appendTo('#my_image_store');
			$('#picture-' + val._id).data("id" , val._id );
		});
	}

	// ปุ่มแก้ไข	
	function warehouse_edit_title_clicked()
	{
		targetElement = this;
		var p_tag	=	$(this).parents('.media-library-thumbnail').next();
		var all_p_tag	=	$('.edit-title-image-button').parents('.media-library-thumbnail').next();

		if(p_tag.has('input').length == 0)
		{
			$.image_gallery.varWarehouse.data_for_input	=	p_tag.text();
		}

		if($.image_gallery.varWarehouse.click_edit_onetime == true)
		{
			$.each($('.media-library-thumbnail-title'),function(index,el){
				$.image_gallery.varWarehouse.old_data.push($(el).text());
			});

			$.image_gallery.varWarehouse.old_data.reverse()
			$.image_gallery.varWarehouse.click_edit_onetime = false;
			$.image_gallery.varWarehouse.data_for_input	=	p_tag.text();
		}

		// ทำให้ทุก p tag คืนค่าเดิมก่อนที่จะทำการกด edit btn
		$.each(all_p_tag,function(index,ele)
		{
			$(ele).html(htmlEntities($.image_gallery.varWarehouse.old_data[index]));
		});

		p_tag.html('<input type="text" id="edit-title" class="text with-button"/><a tabindex="3" class="button letdo-butt small-button save-edit-title-image" href="javascript:void(0);"><span><em>บันทึก</em></span></a>');

		document.getElementById("edit-title").value = $.image_gallery.varWarehouse.data_for_input;
		//hilight ข้อความให้
		p_tag.find('input').select();
		// ใน input box ถ้า user กด enter จะทำการคลิกปุ่ม บันทึกให้ทันที
		$('.media-library-thumbnail-title').find('input:focus').on('keydown',function(e){			
			var input	=	$(this);
			if(e.which == 13)
			{
				input.next().trigger('click');
			}
		});

		$('.save-edit-title-image').on('click',warehouse_save_title);
	}



	// ปุ่ม บันทึก	
	function warehouse_save_title()
	{	
		//$(this).parent().html('ไปเที่ยวเชียงใหม่มาเมื่อวาน');
		// เอาค่าที่แก้ไขใหม่ส่ง ajax
		var input_val   = encodeURIComponent($(this).prev().val());
//		var url_path	=	$(this).parents('.media-library-thumbnail-title').prev().find('img').attr('src');
		var input		=	$(this).parent();
		var id			=	$(this).parents('.media-library-thumbnail-item').data('id');
		$.ajax({
			url: "/image_gallery/title_image_update",
			type: "POST",
			dataType:'json',
			data : "title=" + input_val + "&id=" + id,
			success: function(result){
				if(result.error == true)
				{
					$.errorNotice.dialog(result.error_message);
					return false;
				}		
				input.html(htmlEntities(result.new_title));
				$.image_gallery.varWarehouse.click_edit_onetime = true;
				$.image_gallery.varWarehouse.old_data = new Array();
				
			},
			error : function (jqXHR,setting,thrownError) {
				$.errorNotice.dialog('เกิดข้อผิดพลาดลองส่งใหม่อีกครั้ง');
				return false;
			}
		});		
	}

	// ปุ่มลบใน image
	$('.media-library-thumbnail-edit-wrapper').find('.error-txt').confirm_lightbox({
		width : 300,
		bubble_event : true,
		success_callback : warehouse_del_image_gallery
		
	})

	/*
	 * ------------------------------------------------------------------------------
	 *					End: Controll werehouse image
	 * ------------------------------------------------------------------------------
	 */
	function windowSize() {
		var myWidth = 0, myHeight = 0;
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			myWidth = window.innerWidth;
			myHeight = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			myWidth = document.body.clientWidth;
			myHeight = document.body.clientHeight;
		}
		return myHeight;
	}
	
	function set_var_default()
	{
		$.image_gallery.defaults = {
			lb_frame_url : '/image_gallery/lb_image',
			id_el_lb : 'image_lb_process',
			title_lb : 'ใส่รูปภาพลงในข้อความ',
			callbackAfterUploaded : '',
			label_btn : 'ใส่รูปภาพลงในข้อความ',
			inputUploaded: '',
			mode: 'multiple',
			maxUploaded: 20
		};
		$.image_gallery.varUpload = {
			img_showing_path : '',
			name_img_m : '',
			name_img_o : '',
			path_m : '',
			path_o : ''		
		}
		
		$.image_gallery.varWarehouse = {
			click_edit_onetime : true,
			old_data : new Array(),
			data_for_input : '',
			limit : 5,
			current_page : 0,
			first_number_current_page_of_group : 1,
			next_page_group : '',
			prev_page_group : '',
			id : 0
		}
		return false;
	}

	const htmlEntities = function (str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
	
	/************************************* Defaults Param ********************************/
	$.image_gallery.defaults = {
		lb_frame_url : '/image_gallery/lb_image',
		id_el_lb : 'image_lb_process',
		title_lb : 'ใส่รูปภาพลงในข้อความ',
		callbackAfterUploaded : '',
		label_btn : 'ใส่รูปภาพลงในข้อความ',
		inputUploaded : '',
		mode: 'multiple',
		maxUploaded: 20
	};
	
	$.image_gallery.varUpload = {
		img_showing_path : '',
		name_img_m : '',
		name_img_o : '',
		path_m : '',
		path_o : ''		
	}
	
	$.image_gallery.varWarehouse = {
		click_edit_onetime : true,
		old_data : new Array(),
		data_for_input : '',
		limit : 5,
		current_page : 0,
		first_number_current_page_of_group : 1,
		next_page_group : '',
		prev_page_group : ''
	}

	

})(jQuery);

