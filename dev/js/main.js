var btn = document.getElementById("btn");
var msg = document.getElementById("message");

btn.addEventListener("click",function( event ){
    event.preventDefault();
    msg.innerHTML = "I got it!";
});