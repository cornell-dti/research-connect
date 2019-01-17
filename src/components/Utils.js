function dateIsBetween(date, lowerBound, upperBound) {
  return (lowerBound <= date && date <= upperBound);
}

export function gradYearToString(gradYear) {
  const presentDate = new Date();
  if (dateIsBetween(presentDate, new Date(gradYear - 4, 7, 10), new Date(gradYear - 3, 4, 23))) return 'Freshman';
  if (dateIsBetween(presentDate, new Date(gradYear - 3, 4, 24), new Date(gradYear - 2, 4, 23))) return 'Sophomore';
  if (dateIsBetween(presentDate, new Date(gradYear - 2, 4, 24), new Date(gradYear - 1, 4, 23))) return 'Junior';
  if (dateIsBetween(presentDate, new Date(gradYear - 1, 4, 24), new Date(gradYear, 4, 23))) return 'Senior';
  return 'Freshman';
}

export function convertDate(dateString) {
  const dateObj = new Date(dateString);
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDay() + 1;
  const year = dateObj.getUTCFullYear();
  return `${month.toString()}/${day.toString()}/${year.toString()}`;
}

export function capitalizeFirstLetter(string) {
  if (!string || string.length < 1) {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function refreshStorage() {
  sessionStorage.clear();
  window.location.href = '/';
}

// helper function for logoutGoogle
function tryLoggingOut() {
  if (!window.gapi || !window.gapi.auth2) {
    refreshStorage();
    return;
  }
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (auth2) {
    // sometimes auth2.signout and disconnect cause some obscure error with the google api that is impossbile to debug
    // with their compiled code, but this workaround seems to wrok...
    try {
      refreshStorage();
      auth2.signOut().then((e1) => {
        auth2.disconnect().then((e2) => {
          refreshStorage();
        }, (e3) => {
          // auth2.disconnect didn't work...
          refreshStorage();
        });
      });
    } catch (e) {
      refreshStorage();
    }
  } else {
    refreshStorage();
  }
}

export function logoutGoogle() {
  setTimeout(() => {
    if (window.gapi) {
      tryLoggingOut();
    } else {
      // if window.gapi hasn't loaded yet, wait 2 seconds and try again
      setTimeout(() => {
        if (window.gapi.auth2) {
          tryLoggingOut();
        } else {
          // if it's still not there for some reason, just do the "works half the time" solution
          refreshStorage();
        }
      }, 2000);
    }
  }, 500);
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
      if (window.location.pathname === '/') {
        logoutGoogle();
        return true;
      }
      alert('You either visited this page without being signed in or were inactive too long. '
                + "Sign up on the home page and you'll be able to see all the research opportunities available!");
      window.location.href = '/';
      logoutGoogle();
      return true;
    }
  }
  return false;
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
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);


  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
