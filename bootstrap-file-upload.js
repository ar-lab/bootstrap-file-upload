(function ($) {

    $.fn.bootstrapFile = function (options) {

        var settings = $.extend({
            url: false,
            btnText: 'Browse',
            btnIcon: 'icon-folder-open',    // icon-folder-open | icon-file | icon-upload | icon-plus | icon-plus-sign
            btnType: ''                     // btn-primary | btn-info | btn-success | btn-warning | btn-danger | btn-inverse
        }, options);

        var form = $('<form method="post"></form>').css('margin', 0);

        var bar = $('<div class="bar"></div>');
        var percent = $('<div class="percent">0%</div>');
        var progress = $('<div class="progress hidden"></div>').css('margin-top', '10px');
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

            var group = $('<div class="input-append"></div>');

            var input = $('<input class="input-large uneditable-input" disabled="disabled" name="' + fileInputName + '" value="">');
            var button = $('<button class="btn' + type + '" type="button">' + icon + text + '</button>').click(function() {
                clone.click();
            });

            clone.on('change', function() {
                var uploadedFileName = $(this).val();
                uploadedFileName = uploadedFileName.replace("C:\\fakepath\\", "");
                input.val(uploadedFileName);
                uploadFile();
            });

            $(group).append(clone);
            $(group).append(input);
            $(group).append(button);

            $(group).appendTo(form);
            $(progress).appendTo(form);
            $(status).appendTo(form);

            self.replaceWith(form);

        });

    };

}(jQuery));