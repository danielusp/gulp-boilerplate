var bodyClick = {
    bindDom: {},
    exec: function ()
    {
        bodyClick.bindDom = document.getElementById("bd");
        bodyClick.bindDom.addEventListener("click",bodyClick.show);
    },

    show: function()
    {
        alert('You click me!');
    }
}

bodyClick.exec();