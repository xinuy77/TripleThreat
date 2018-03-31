var userId;

M.AutoInit();

$(document).ready(()=>{
    showPassword();
});

function showPassword() {
    register((data, err)=>{
        if(data === -1) {
            showErr(err);
        }
        else {
            data    = JSON.parse(data);
            userId  = data.userId;
            listenNextButton();
            $("#password").text(data.password);
            $("#ui_2").fadeIn();
        }
    });
};

function listenNextButton() {
    $("#nextButton").click(()=>{
        $("#ui_2").fadeOut(null, ()=>{
            showPasswordInput();
        });
    });
};

function showPasswordInput() {
    listenLoginButton();
    listenLoginInput();
    $("#ui_3").fadeIn();
};


function listenLoginButton() {
    $("#loginButton").click(()=>{
        var password = $("#passwordInput").val();
        login(password);
    });
};

function listenLoginInput() {
    $("#passwordInput").keypress((e)=>{
        var password = $("#passwordInput").val();
        if(e.which === 13) {
            login(password);
        }
    });
};


function login(password) {
    var data = {userId: userId, password: password};
    api("POST", "/login", JSON.stringify(data), (res)=>{
        if(res === -1) {
            M.toast({html: '<h4>Incorrect Password!</h4>', displayLength:500});
        }
        else {
            M.toast({html: '<h4>Successful Login!</h4>', displayLength: 500});
        }
    });
};

function register(callback) {
    api("GET", "/register", null, (res)=>{
        if(res === -1) {
            callback(res, "FAILED TO CONNECT API");
        }
        else {
            callback(res, null);
        }
    });
};

function api(type, url, data=null, callback) {
return $.ajax({
    type: type,
    contentType: "application/json",
    url: url,
    data: data,
    dataType: "text",
    error: (xhr, stat, err)=>{
        callback(-1);
    },
    success: (res=null)=>{
        callback(res);
    }
});
}
