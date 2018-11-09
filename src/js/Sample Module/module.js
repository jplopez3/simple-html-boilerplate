var App = App || {}

App.module = function (el) {
    const $MODULE = $(el),
        $button = $MODULE.find('button');

    function init() {
        events();
    }

    function events() {
        $button.on('click', function () {
            alert('Thanks m8! you clicked me.');
        });
    }

    return {
        init: init
    }
}

$(document).ready(function () {

    var el = $('#Test');

    if (el.length) {
        el.each(function () {
            var myModule = App.module(this);
            myModule.init();
        });
    }
});