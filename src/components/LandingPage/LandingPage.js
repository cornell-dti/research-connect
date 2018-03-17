import React, {Component} from 'react';
import {Helmet} from "react-helmet";

class LandingPage extends Component {

    render() {
        return (
            <div>
                <Helmet>
                    <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
                    <meta name="google-signin-client_id"
                          content="938750905686-tvpse0g1e85us6emn2kv690ap5nsnshs.apps.googleusercontent.com"></meta>
                </Helmet>
                <script type="text/javascript">
                    function handleAuthClick(event) {
                        gapi.auth2.getAuthInstance().signIn();
                    }
                    function init() {
                    gapi.load('auth2', function () { // Ready.
                        gapi.auth2.init({
                            client_id: "938750905686-tvpse0g1e85us6emn2kv690ap5nsnshs.apps.googleusercontent.com",
                            fetch_basic_profile: false,
                            scope: "email",
                            hosted_domain: "cornell.edu"
                        }).then(function () {
                            //determine if they're signed in with line below:
                            //gapi.auth2.getAuthInstance().isSignedIn
                            let authorizeButton = document.getElementById('authorizeButton');
                            authorizeButton.onclick = handleAuthClick;
                        });
                    })
                }
                </script>
                <div id="authorizeButton" class="g-signin2" data-onsuccess="onSignIn"></div>
            </div>
        )
    }
}

export default LandingPage
