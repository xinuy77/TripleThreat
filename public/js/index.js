/* Global variable */
var userId;

M.AutoInit();

// listen start button 
// when html is fully loaded
$(document).ready(()=>{
    showPassword();
});

/**
 * Registers and recieve
 * userId and password from api,
 * show them to user
 */
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

/**
 * Set event to Next button.
 * Show password Input UI when
 * clicked.
 */
function listenNextButton() {
    $("#nextButton").click(()=>{
        $("#ui_2").fadeOut(null, ()=>{
            showPasswordInput();
        });
    });
};

/**
 * Shows password input UI 
 * to user.
 */
function showPasswordInput() {
    listenLoginButton();
    listenLoginInput();
    $("#ui_3").fadeIn();
};


/**
 * Set event to Login Button.
 * When clicked, sends password
 * to API
 */
function listenLoginButton() {
    $("#loginButton").click(()=>{
        var password = $("#passwordInput").val();
        login(password);
    });
};

/**
 * Set event on Login Input
 * When Enter key pressed, 
 * sends password to API
 */
function listenLoginInput() {
    $("#passwordInput").keypress((e)=>{
        var password = $("#passwordInput").val();
        if(e.which === 13) {
            login(password);
        }
    });
};


/**
 * Attempts login by sending request
 * to API
 * 
 * @param string password
 */
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

/**
 * Register user by sending
 * request to API. Status returned
 * to callback.
 *
 * @param function callback
 */
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

/**
 * Sends request to API accordingly
 * to parameter, returns status to callback
 *
 * @param string   type     // either "POST" or "GET"
 * @param string   url      // route
 * @param string   data     // stringified JSON object
 * @param function callback 
 *
 * @return $.ajax() // returns ajax instance
 */
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
