function dateIsBetween(date, lowerBound, upperBound) {
  return (lowerBound <= date && date <= upperBound);
}

export function gradYearToGrade(gradYear) {
  const presentDate = new Date();
  if (dateIsBetween(presentDate, new Date(gradYear - 4, 7, 10), new Date(gradYear - 3, 4, 23))) return 'freshman';
  if (dateIsBetween(presentDate, new Date(gradYear - 3, 4, 24), new Date(gradYear - 2, 4, 23))) return 'sophomore';
  if (dateIsBetween(presentDate, new Date(gradYear - 2, 4, 24), new Date(gradYear - 1, 4, 23))) return 'junior';
  if (dateIsBetween(presentDate, new Date(gradYear - 1, 4, 24), new Date(gradYear, 4, 23))) return 'senior';
  return '';
}

export function gradYearToString(gradYear) {
  const presentDate = new Date();
  if (dateIsBetween(presentDate, new Date(gradYear - 4, 7, 10), new Date(gradYear - 3, 4, 23))) return 'Freshman';
  if (dateIsBetween(presentDate, new Date(gradYear - 3, 4, 24), new Date(gradYear - 2, 4, 23))) return 'Sophomore';
  if (dateIsBetween(presentDate, new Date(gradYear - 2, 4, 24), new Date(gradYear - 1, 4, 23))) return 'Junior';
  if (dateIsBetween(presentDate, new Date(gradYear - 1, 4, 24), new Date(gradYear, 4, 23))) return 'Senior';
  return '';
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

export function getMajorList(){
  let majorList = ["Africana Studies", "Agricultural Sciences", "American Studies", "Animal Science", "Anthropology", "Applied Economics and Management", "Archaeology", "Architecture", "Asian Studies", "Astronomy", "Atmospheric Science", "Biological Engineering", "Biological Sciences", "Biology and Society", "Biomedical Engineering", "Biometry and Statistics", "Chemical Engineering", "Chemistry and Chemical Biology", "China and Asia-Pacific Studies", "Civil Engineering", "Classics (Classics, Classical Civ., Greek, Latin)", "College Scholar Program", "Communication", "Comparative Literature", "Computer Science", "Design and Environmental Analysis", "Development Sociology", "Economics", "Electrical and Computer Engineering", "Engineering Physics", "English", "Entomology", "Environmental and Sustainability Sciences", "Environmental Engineering", "Feminist, Gender & Sexuality Studies", "Fiber Science and Apparel Design", "Fine Arts", "Food Science", "French", "German", "German Area Studies", "Global & Public Health Sciences", "Government", "History", "History of Architecture (transfer students only)", "History of Art", "Hotel Administration School of Hotel Administration", "Human Biology, Health and Society", "Human Development", "Independent Major—Arts and Sciences", "Independent Major—Engineering", "Industrial and Labor Relations School of Industrial and Labor Relations", "Information Science", "Information Science, Systems, and Technology", "Interdisciplinary Studies", "International Agriculture and Rural Development", "Italian", "Landscape Architecture", "Linguistics", "Materials Science and Engineering", "Mathematics", "Mechanical Engineering", "Music", "Near Eastern Studies", "Nutritional Sciences", "Operations Research and Engineering", "Performing and Media Arts", "Philosophy", "Physics", "Plant Science", "Policy Analysis and Management", "Psychology", "Religious Studies", "Science and Technology Studies", "Science of Earth Systems", "Sociology", "Spanish", "Statistical Science", "Urban and Regional Studies", "Viticulture and Enology", "Undecided"];
  return majorList;
}

export function getCSAreas(){
  const csAreas = {	"cloudComputing": "Cloud Computing and/or Distributed systems",
                		"operatingSystems": "Operating systems",
                		"networks": "Computer networks",
                		"algorithms": "Algorithms",
                		"humanComputerInteraction": "Human-Computer Interaction",
                		"programmingLanguages": "Programming Languages",
                		"naturalLanguageProcessing": "Natural Language Processing",
                		"machineLearning": "Machine Learning and/or Artificial Intelligence",
                		"robotics": "Robotics",
                		"graphics": "Graphics",
                		"security": "Security",
                		"optimization": "Optimization",
                		"computationalBiology": "Computational Biology",
                		"other": "Other" };
  return csAreas;
}

export function getCompensation(){
  const compensations = {"money": "Money", "credit" : "Credit"};
  return compensations;
}

export function getYears(){
  const years = { "freshman":"Freshman",
                  "sophomore":"Sophmore",
                  "junior":"Junior",
                  "senior":"Senior"};
  return years;
}
