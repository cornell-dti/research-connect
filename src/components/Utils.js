function dateIsBetween(date, lowerBound, upperBound) {
    return (lowerBound <= date && date <= upperBound);
}

export function gradYearToString(gradYear) {
    let presentDate = new Date();
    if (dateIsBetween(presentDate, new Date(gradYear - 4, 7, 10), new Date(gradYear - 3, 4, 23))) return "Freshman";
    if (dateIsBetween(presentDate, new Date(gradYear - 3, 4, 24), new Date(gradYear - 2, 4, 23))) return "Sophomore";
    if (dateIsBetween(presentDate, new Date(gradYear - 2, 4, 24), new Date(gradYear - 1, 4, 23))) return "Junior";
    if (dateIsBetween(presentDate, new Date(gradYear - 1, 4, 24), new Date(gradYear, 4, 23))) return "Senior";
    return "Freshman";
}

export function convertDate(dateString) {
    let dateObj = new Date(dateString);
    let month = dateObj.getUTCMonth() + 1;
    let day = dateObj.getUTCDay() + 1;
    let year = dateObj.getUTCFullYear();
    return month.toString() + "/" + day.toString() + "/" + year.toString();
}

export function capitalizeFirstLetter(string) {
    if (!string || string.length < 1){
        return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Takes care of the response and checking for errors specifically due to outdated tokens.
 * If there is a session error, it'll sign them out, redirect them to the index page, and return true.
 * Otherwise will return false and do nothing so you can handle the other errors.
 * @param error the Error object (special type of object, look it up, took me a while to find that out...) you get from
 * the promise callback for axios
 * @return {boolean} returns false if there was no token-related error.
 */
export function handleTokenError(error) {
    if (error.response) {
        console.log(error.response.data);
        if (error.response.status === 409 || error.response.status === 412 || error.response.status === 500) {
            alert("You were either inactive for too long or visited this page without being signed in. " +
                "You'll be signed out and taken to the home page. Sign up/in and then come back to this page to view its contents.");
            console.log(1);
            logoutGoogle();
            return true;
        }
    }
}

/**
 * Gets query parameter from url. example url: google.com?id=bear
 * @param name is name of query parameter, in example it's id
 * @param url
 * @return string the value of that url param, in our example it'd be bear
 */
export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//helper function for logoutGoogle
function tryLoggingOut(){
    console.log("trying to log out");
    const auth2 = window.gapi.auth2.getAuthInstance();
    console.log("got instance");
    if (auth2 != null) {
        console.log("auth 2 not null");
        auth2.signOut().then(
            auth2.disconnect().then(function (e) {
                console.log("disconnecting");
                sessionStorage.clear();
                window.location.href = "/";
            }, function (e) {
                console.log("disconnect didn't work, error below");
                console.log(e);
                //auth2.disconnect didn't work...
                sessionStorage.clear();
                window.location.href = "/"
            })
        ).catch((e) => {
            console.log("error with auth2.signout below");
            console.log(e);
        })
    }
    else {
        console.log("auth not null");
        console.log(auth2);
    }
}

export function logoutGoogle() {
    if (window.gapi) {
        console.log("logging out window gapi");
        tryLoggingOut();
    }
    else {
        console.log("about to set timeout");
        //if window.gapi hasn't loaded yet, wait 2 seconds and try again
        setTimeout(function () {
            console.log("in set timeout");
            if (window.gapi) {
                console.log("window gapi loaded, logging out");
                tryLoggingOut();
            } else {
                //if it's still not there for some reason, just do the "works half the time" solution
                console.log("no gapi");
                sessionStorage.clear();
                window.location.href = "/"
            }
        }, 2000);
    }
}