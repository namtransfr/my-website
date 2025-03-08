var editorAutoResize = true;
var tinymceBbcodeDebug = false;
window.tinymceEnabled = true;
window.tinymceAskBeforeLeave = true;

window.CustomBlockUtils = (function () {
    const blockConfig = {
        spoil: {
            className: 'spoil-block',
            text: 'ใส่ข้อความ'
        },
        code: {
            className: 'code-block',
            text: 'ใส่โค้ด'
        }
    };

    function initEditor(editor) {
        leavingCustomBlockHandler(editor);
        confirmBlockDeleteHandler(editor);
        addClassesToButtons(editor);
    }

    function addClassesToButtons(editor){
		editor.on('load', function(e){
			const btns = document.getElementsByTagName('button')
			const btnArray = [...btns]
			   const btnNameArr = btnArray.map((btn)=>btn.firstElementChild)
			btnNameArr.pop()
			const prefixLength = 'mce-i-'.length
			const classes = btnNameArr.map((child)=>child.classList[1].slice(prefixLength))
		   
			for(let i=0; i < classes.length; i++){
				const toolbarBtn = document.querySelector(`#mceu_${i}-button`)
				toolbarBtn.classList.add(`toolbar-icon-${classes[i]}`)
			}
		})
	}

    function confirmBlockDeleteHandler(editor) {
        let locked = false;

        editor.on('keydown', function (e) {
            let selection = editor.selection;
            let currentNode = selection.getNode();

            if (e.keyCode == 8) {
                let block = getCustomBlock(currentNode);
                if (block) {
                    if (locked) {
                        return e.preventDefault();
                    }
                    if (
                        !block.classList.contains('active') &&
                        block.innerText.trim().length == 0 &&
                        !containsVisibleElements(block) &&
                        block.children.length <= 1
                    ) {
                        locked = true;
                        block.classList.add('active');
                        return e.preventDefault();
                    }
                }
            }

            if (e.keyCode != 8) {
                let block = getCustomBlock(currentNode);
                if (block) {
                    locked = false;
                    block.classList.remove('active');
                }
            }
        });

        editor.on('keyup', function (e) {
            if (e.keyCode == 8) {
                locked = false;
            }
        });
    }

    function leavingCustomBlockHandler(editor) {
        editor.on('keydown', function (e) {
            if (e.keyCode == 13) {
                let selection = editor.selection;
                let currentNode = selection.getNode();

                let block = getCustomBlock(currentNode);
                if (!block) {
                    return;
                }

                let lastElementChild = currentNode.closest('p,#_mce_caret');
                if (
                    block.children.length <= 1 ||
                    block.lastElementChild !== lastElementChild ||
                    (lastElementChild && lastElementChild.innerText.trim().length > 0) ||
                    containsVisibleElements(lastElementChild)
                ) {
                    return;
                }

                let removeParagraph = true;
                let prevP = lastElementChild.previousElementSibling;

                if (prevP && prevP.nodeName === 'HR') {
                    removeParagraph = false;
                }

                if (removeParagraph) {
                    lastElementChild.remove();
                }

                let newP = document.createElement('p');
                let br = document.createElement('br');
                br.setAttribute('data-mce-bogus', '1');
                newP.append(br);

                block.parentNode.insertBefore(newP, block.nextSibling);

                let range = new Range();
                range.selectNode(br);
                range.collapse(false);

                let sel = editor.selection.getSel();
                sel.removeAllRanges();
                sel.addRange(range);
                sel.collapseToEnd();

                e.preventDefault();
            }
        });
    }

    function containsVisibleElements(node) {
        return node.querySelector('img') || node.querySelector('iframe');
    }

    function getCustomBlockSelectors() {
        return Object.values(blockConfig).map(function (item) {
            return '.' + item.className;
        }).join(',');
    }

    function getCustomBlock(node) {
        let block = node.closest(getCustomBlockSelectors());
        return block;
    }

    function getRootBlock(node) {
        let block = node.closest('p,' + getCustomBlockSelectors());
        return block;
    }

    function isRootBlock(node) {
        let block = getRootBlock(node);
        let parent = block.parentElement;
        return parent.nodeName === 'BODY';
    }

    function createCustomBlock(type) {
        if (typeof blockConfig[type] === 'undefined') {
            throw new Error('Block type error');
        }

        let editor = tinymce.activeEditor;
        let selection = editor.selection;
        let currentNode = selection.getNode();

        if (type === 'spoil') {
            if (!isRootBlock(currentNode)) {
                return;
            }
        }

        let currentBlock = getRootBlock(currentNode);
        if (!currentBlock) {
            console.log('Current block is null, automatically locate paragraph.');
            currentBlock = editor.contentDocument.body.firstElementChild;
        }

        let block = document.createElement('div');
        block.className = blockConfig[type].className;

        let p = document.createElement('p');
        p.innerText = blockConfig[type].text;
        block.appendChild(p);

        let br = document.createElement('br');
        br.setAttribute('data-mce-bogus', '1');
        p.append(br);

        if (currentBlock.innerText.trim().length === 0) {
            currentBlock.replaceWith(block);
        } else {
            currentBlock.parentNode.insertBefore(block, currentBlock.nextSibling);
        }

        let range = new Range();
        range.selectNode(br);
        range.collapse(false);

        let sel = editor.selection.getSel();
        sel.removeAllRanges();
        sel.addRange(range);
        sel.collapseToEnd();
    }

    return {
        initEditor: initEditor,
        createCustomBlock: createCustomBlock
    };
})();

function init_tinymce_editor(callback) {
    var version = 26;
    var external_plugins = {
        'googlemap': '/js/tinymce_custom/tinymce-1-googlemap.plugin.js?v=' + version,
        'imagem': '/js/tinymce_custom/tinymce-2-image.plugin.js?v=' + version,
        'video': '/js/tinymce_custom/tinymce-3-video.plugin.js?v=' + version,
        'toy': '/js/tinymce_custom/tinymce-4-toy.plugin.js?v=' + version,
        'spoil': '/js/tinymce_custom/tinymce-5-spoil.plugin.js?v=' + version,
        'ptbbcode': '/js/tinymce_custom/tinymce-7-ptbbcode.plugin.js?v=' + version,
        'ptcode': '/js/tinymce_custom/tinymce-9-ptcode.plugin.js?v=' + version,
        'bbcodecorrection': '/js/tinymce_custom/tinymce-10-bbcode-correction.plugin.js?v=' + version
    };
    
	// load user permissions
	let ptConfig = JSON.parse(document.getElementById('ptConfig').innerText);
	let hasLinkPermission = ptConfig.user_post_permissions.has_link_permission;

    if (hasLinkPermission) {
        external_plugins['mylink'] = '/js/tinymce_custom/tinymce-6-link.plugin.js?v=' + version;
    }
    if (tinymceBbcodeDebug) {
        external_plugins['btnrender'] = '/js/tinymce_custom/tinymce-8-render-test.plugin.js?v=' + version;
    }
    var config = {
        //language: 'th_TH',
        selector: '.tinymce-detail-input',
        plugins: [
            'code fullscreen hr paste' + (editorAutoResize ? ' autoresize' : '')
        ],
        autoresize_bottom_margin: 0,
        relative_urls: false,
        remove_script_host: false,
        document_base_url: document.location.origin + '/',
        forced_root_block: 'p',
        schema: 'html5',
        element_format: 'html',
        entity_encoding: 'raw',
        //keep_styles: false,
        paste_as_text: true,
        paste_preprocess: function (plugin, args) {
            args.content = args.content.replace(/\<br ?\/?\>/g, '\n');
            args.content = args.content.replace(/ /g, '&nbsp;').replace(/\t/g, '&nbsp;&nbsp;');
            args.content = args.content.replace(/[\n\r]/g, '<br>');
        },
        valid_elements: [
            'br,hr',
            'p[style]',
            'div[class|style]',
            'strong,em,sup,sub,u',
            'span[class]',
            'blockquote[class]',
            'a[href]',
            'iframe[src|width|height|frameborder|allowfullscreen|data-vimeolink|data-maplink]',
            'img[class|src|style|data-bbcode]'
        ].join(','),
        // invalid_elements: 'span',
        valid_styles: {
            'div': 'text-align',
            'p': 'text-align'
        },
        invalid_styles: {
            '*': 'color font-size',
            'strong': 'text-decoration-line'
        },
        external_plugins: external_plugins,
        // | btnrender
        //toolbar: "undo redo | bold italic underline strikethrough superscript subscript | alignleft aligncenter alignright | imagem video googlemap toy mylink | spoil hr",
        toolbar: 'undo redo | imagem video googlemap toy | bold italic underline strikethrough | alignleft aligncenter alignright | ' + (hasLinkPermission ? 'mylink ' : '') + 'hr superscript subscript | ptcode spoil ' + (tinymceBbcodeDebug ? ' btnrender' : ''),
        content_css: [
            '/css/custom_tinymce.css?v=' + version
        ],
        object_resizing: false,
        link_context_toolbar: false,
        branding: false,
        menubar: false,
        formats: {
            alignleft: { selector: 'p', styles: { display: 'block', 'text-align': 'left' } },
            aligncenter: { selector: 'p', styles: { display: 'block', 'text-align': 'center' } },
            alignright: { selector: 'p', styles: { display: 'block', 'text-align': 'right' } },
            underline: { inline: 'u' },
            strikethrough: { inline: 'span', classes: 'strikethrough', exact: true },
        },
        setup: function (editor) {
            editor.on('init', function (e) {
                //console.log('Editor was initialized.');
                callback();

                // Ask before user close the page
                window.addEventListener('beforeunload', function (event) {
                    if (window.tinymceAskBeforeLeave && (richTextEditor.getBbcode().trim().length > 0 || $('#topic').val().trim().length > 0)) {
                        event.preventDefault();
                        event.returnValue = '';
                    }
                });
            });

            editor.on('keydown', function (e) {
                let currentNode = editor.selection.getNode();
                let closestP = currentNode.closest('p');

                if (!closestP && currentNode.closest('.code-block,.spoil-block')) {
                    let selection = editor.selection.getSel();
                    let focusNode = selection.focusNode;
                    let parentNode = focusNode.parentNode;

                    if (focusNode.nodeName === '#text') {
                        let p = document.createElement('p');

                        if (parentNode.nodeName === 'DIV') {
                            focusNode.parentNode.insertBefore(p, focusNode.nextSibling);
                            p.append(focusNode);
                        } else {
                            let span = parentNode.closest('#_mce_caret');
                            span.parentNode.insertBefore(p, span.nextSibling);
                            p.append(span);
                        }

                        let range = new Range();
                        range.selectNode(focusNode);
                        range.collapse(false);

                        selection.removeAllRanges();
                        selection.addRange(range);
                        selection.collapseToEnd();
                    }
                }
            });

            CustomBlockUtils.initEditor(editor);
        }
    };

    if (editorAutoResize) {
        config['autoresize_min_height'] = 420;
        config['autoresize_max_height'] = 1600;
    } else {
        config['height'] = 420;
    }
    tinymce.init(config);

    if (editorAutoResize) {
        var toolbarTop = 48;
        $(window).scroll(function () {
            var post = $('#pt-topic-detail-container');
            var h = post.height() - toolbarTop;
            // $('#mceu_19').css({'height': '40px'});
            if (post.position() !== null) {
                var top = post.position().top;
                var scroll = $(window).scrollTop();
                var diff = top - scroll;
                if (diff <= toolbarTop && diff >= -h) {
                    $('#mceu_21').css({
                        'position': 'fixed',
                        'top': toolbarTop + 'px',
                        'width': '1001px',
                        'border-bottom': '1px solid #5B79B4'
                    });
                } else {
                    $('#mceu_21').css({
                        'position': 'relative',
                        'top': '0px',
                        'width': '100%',
                        'border-bottom': 'none'
                    });
                }
            }
        });
    }
}

$(document).on('click', '.btn-edit-topic-cancel', function (e) {
    window.tinymceAskBeforeLeave = false;
});

; (function (global, factory) {
    global.richTextEditorHelper = factory();
}(this, (function () {
    'use strict';

    function insideNode(node, nodeName) {
        if (node.nodeName.toLowerCase() == 'body') {
            return false;
        }
        if (node.nodeName.toLowerCase() == nodeName) {
            return true;
        }
        var parentNode = null;
        do {
            parentNode = node.parentNode;
            if (parentNode === null) {
                return false;
            }
            if (parentNode.nodeName.toLowerCase() == nodeName) {
                return true;
            }
            node = parentNode;
        } while (parentNode.nodeName.toLowerCase() !== 'body');
        return false;
    }

    function insideNodeWithClass(node, nodeName, className) {
        if (node.nodeName.toLowerCase() == 'body') {
            return false;
        }
        if (node.nodeName.toLowerCase() == nodeName && node.classList.contains(className)) {
            return true;
        }
        var parentNode = null;
        do {
            parentNode = node.parentNode;
            if (parentNode === null) {
                return false;
            }
            if (parentNode.nodeName.toLowerCase() == nodeName && parentNode.classList.contains(className)) {
                return true;
            }
            node = parentNode;
        } while (parentNode.nodeName.toLowerCase() !== 'body');
        return false;
    }

    function getNeartestNode(node, nodeName) {
        if (node.nodeName.toLowerCase() == nodeName) {
            return node;
        }
        var parentNode = null;
        do {
            parentNode = node.parentNode;
            if (parentNode === null) {
                return false;
            }
            if (parentNode.nodeName.toLowerCase() == nodeName) {
                return parentNode;
            }
            node = parentNode;
        } while (parentNode.nodeName.toLowerCase() !== 'body');
        return false;
    }

    function getNeartestNodeWithClass(node, nodeName, className) {
        if (node.nodeName.toLowerCase() == nodeName && node.classList.contains(className)) {
            return node;
        }
        var parentNode = null;
        do {
            parentNode = node.parentNode;
            if (parentNode === null) {
                return false;
            }
            if (parentNode.nodeName.toLowerCase() == nodeName && parentNode.classList.contains(className)) {
                return parentNode;
            }
            node = parentNode;
        } while (parentNode.nodeName.toLowerCase() !== 'body');
        return false;
    }


    function getCaretCharacterOffsetWithin(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }

    function alertDialog(message) {
        $.errorNotice.dialog(message, {
            title: 'แจ้งเตือน',
            btn_close: 'ปิดหน้าต่าง'
        });
        // alert(message);
    }

    // Used for both spoil and codeblock
    function leaveSpoilBlock(editor, block, currentParagraph, currentNode, isBlockCallback, successCallback) {
        if (block === false || !isBlockCallback()) {
            editor.settings.force_p_newlines = true;
            return;
        }

        var children = $(block).children('p');
        var currentText = richTextEditor.toBbcode(currentParagraph.innerHTML.trim());
        currentText = currentText.replace(/\[\/?(b|i|s|u)\]/g, '');
        if (currentText == '<br data-mce-bogus="1">' && currentParagraph == children[children.length - 1]) {
            editor.settings.force_p_newlines = false;
            if (typeof currentNode.remove === 'function') {
                currentNode.closest('p').remove();
            } else {
                currentNode.parentElement.removeChild(currentNode);
            }
            var paragraph = document.createElement("p");
            var br = document.createElement('br');
            br.setAttribute('data-mce-bogus', '1');
            paragraph.append(br);
            block.parentNode.insertBefore(paragraph, block.nextSibling);
            tinymce.activeEditor.selection.select(br);
            tinymce.activeEditor.selection.collapse(false);
            successCallback();
        } else {
            editor.settings.force_p_newlines = true;
        }
    }

    function insertCustomElement(type, options) {
        const supportedTypes = {
            IMAGE: ['src'],
            YOUTUBE_VIDEO: ['src'],
            VIMEO_VIDEO: ['src', 'url'],
            GOOGLE_MAP: ['src', 'url'],
            TOY: ['src', 'bbcode'],
            LINK: ['url', 'text']
        };

        if (!Object.keys(supportedTypes).includes(type)) {
            throw new Error("Type '" + type + "' is not supported");
        }

        supportedTypes[type].forEach(function (field) {
            if (typeof options[field] === 'undefined') {
                throw new Error("Option '" + field + "' is expected for type " + type);
            }
        });

        if (type == 'IMAGE') {
            let img = document.createElement('img');
            img.className = 'img-in-post in-tiny-editor';
            img.src = options.src;
            insertNodeAtCaret(img);
        } else if (type == 'YOUTUBE_VIDEO') {
            let iframe = document.createElement('iframe');
            iframe.setAttribute('width', 640);
            iframe.setAttribute('height', 360);
            iframe.setAttribute('frameborder', 0);
            iframe.setAttribute('allow', 'fullscreen');
            iframe.src = options.src;
            insertNodeAtCaret(iframe);
        } else if (type == 'VIMEO_VIDEO') {
            let iframe = document.createElement('iframe');
            iframe.setAttribute('width', 640);
            iframe.setAttribute('height', 360);
            iframe.setAttribute('frameborder', 0);
            iframe.setAttribute('data-vimeolink', options.url);
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('webkitallowfullscreen', '');
            iframe.setAttribute('mozallowfullscreen', '');
            iframe.src = options.src;
            insertNodeAtCaret(iframe);
        } else if (type == 'GOOGLE_MAP') {
            let iframe = document.createElement('iframe');
            iframe.setAttribute('data-maplink', options.url);
            iframe.setAttribute('width', 600);
            iframe.setAttribute('height', 450);
            iframe.setAttribute('frameborder', 0);
            iframe.setAttribute('allowfullscreen', '');
            iframe.style.border = 0;
            iframe.src = options.src;
            insertNodeAtCaret(iframe);
        } else if (type == 'TOY') {
            let img = document.createElement('img');
            img.className = 'img-emotion-item img-emo';
            img.setAttribute('data-bbcode', options.bbcode);
            img.src = options.src;
            insertNodeAtCaret(img);
        } else if (type == 'LINK') {
            let link = document.createElement('a');
            link.innerText = options.text;
            link.href = options.url;
            insertNodeAtCaret(link);
        }
    }

    function insertNodeAtCaret(node) {
        tinymce.activeEditor.focus();
        let selection = tinymce.activeEditor.selection.getSel();
        let currentNode = tinymce.activeEditor.selection.getNode();
        let closestP = currentNode.closest('p');
        let customBlock = currentNode.closest('.code-block,.spoil-block');
        let range = selection.getRangeAt(0);

        if (!customBlock || closestP) {
            range.insertNode(node);
        } else {
            let wrapperNode = getNodeBeforeCustom(currentNode, customBlock);
            let p = document.createElement('p');
            if (wrapperNode) {
                range.insertNode(node);

                wrapperNode.parentNode.insertBefore(p, wrapperNode.nextSibling);
                p.append(wrapperNode);
            } else {
                p.append(node);

                range.insertNode(p);
            }
        }

        range.selectNode(node);
        range.collapse(false);

        selection.removeAllRanges();
        selection.addRange(range);
        selection.collapseToEnd();
    }

    function getNodeBeforeCustom(currentNode, customBlock) {
        if (currentNode === customBlock) {
            return null;
        }
        if (currentNode.parentNode === customBlock) {
            return currentNode;
        }
        return getNodeBeforeCustom(currentNode.parentNode, customBlock);
    }

    var helperFunctions = {
        alertDialog: alertDialog,
        insideNode: insideNode,
        insideNodeWithClass: insideNodeWithClass,
        getNeartestNode: getNeartestNode,
        getCaretCharacterOffsetWithin: getCaretCharacterOffsetWithin,
        getNeartestNodeWithClass: getNeartestNodeWithClass,
        leaveSpoilBlock: leaveSpoilBlock,
        insertCustomElement: insertCustomElement
    };

    return helperFunctions;
})));
