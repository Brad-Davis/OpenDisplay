function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//This shows the username or gives a link to login
function main(){
    const userName = getCookie('user');
    if(userName){
        document.getElementById('userName').innerHTML = "Welcome " + userName;
    }else{
        document.getElementById('userName').innerHTML = "<a href='/login'>login!</a>";
    }
}


document.addEventListener("DOMContentLoaded", main);

