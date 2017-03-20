(function ($) {

    $.fn.bootstrapFile = function (options) {

        var settings = $.extend({
            url: false,
            showInput: true,
            btnText: 'Browse',
            btnIcon: 'icon-folder-open',    // icon-folder-open | icon-file | icon-upload | icon-plus | icon-plus-sign
            btnType: ''                     // btn-primary | btn-info | btn-success | btn-warning | btn-danger | btn-inverse
        }, options);

        var form = $('<form method="post"></form>').css('display', 'none');

        var bar = $('<div class="bar"></div>');
        var percent = $('<div class="percent">0%</div>');
        var progress = $('<div class="progress hidden"></div>').css('margin-top', '10px').css('margin-bottom', '0');
        var status = $('<div id="status" class="hidden"></div>').css('margin-top', '10px');

        progress.append(bar);
        progress.append(percent);

        function uploadFile() {

            form.attr('method', "post");
            form.attr('enctype', "multipart/form-data");

            form.ajaxForm({

                url: settings.url,
                // iframe: true,
                // dataType: 'json',
                // timeout: 3000,
                // resetForm: true,
                // clearForm: true,

                beforeSend: function() {
                    progress.removeClass('hidden');
                    status.empty();
                    status.addClass('hidden');
                    var percentVal = '0%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                },
                uploadProgress: function(event, position, total, percentComplete) {
                    var percentVal = percentComplete + '%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                },
                success: function() {
                    var percentVal = '100%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                },
                complete: function(xhr) {
                    status.html(xhr.responseText);
                    status.removeClass('hidden');
                    form.removeAttr('method');
                    form.removeAttr('enctype');
                    progress.addClass('hidden');
                }
            });

            form.submit();
        }

        return this.each(function (e) {

            var self = $(this);
            var clone = self.clone();

            var fileInputName = clone.attr('name');

            clone.css('display', 'none');

            var icon = settings.btnIcon ? '<i class="' + settings.btnIcon + (settings.btnType ? ' icon-white' : '') + '"></i> ' : '';
            var text = settings.btnText ? settings.btnText : '';
            var type = settings.btnType ? ' ' + settings.btnType : '';

            var block = $('<div class="bootstrap-file-upload"></div>');
            var group = $('<div></div>');
            var value = $('<input type="hidden" name="' + fileInputName + '" value="">');
            var input = $('<input class="uneditable-input" disabled="disabled" value="">');
            var button = $('<button class="btn' + type + '" type="button">' + icon + text + '</button>');

            var currentVal = clone.attr('value');
            input.val(currentVal);
            value.val(currentVal);

            button.click(function() {
                clone.click();
            });

            clone.on('change', function() {
                var uploadedFileName = $(this).val();
                uploadedFileName = uploadedFileName.replace("C:\\fakepath\\", "");
                input.val(uploadedFileName);
                value.val(uploadedFileName);
                if (settings.url !== false) {
                    uploadFile();
                }
            });

            if (settings.showInput) {
                group.addClass('input-append');
                group.append(input);
            }
            group.append(button);

            if (settings.url !== false) {
                $(clone).appendTo(form);
                $(block).append(form);
                $(block).append(value);
            } else {
                $(block).append(clone);
            }
            $(block).append(group);
            $(block).append(progress);
            $(block).append(status);

            self.replaceWith(block);

        });

    };

}(jQuery));