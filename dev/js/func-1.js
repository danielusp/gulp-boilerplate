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
    },

    //  Example of how a local variable is minified
    minifyVariable: function()
    {
        var localScope = "This variable is minified because has a local scope";
        console.log(localScope);
    }
}

bodyClick.exec();