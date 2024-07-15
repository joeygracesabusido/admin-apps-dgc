const login = async () => {
    var username = document.querySelector('#username').value;
    var password = document.querySelector('#password').value;
    let alert;

    const search_url = `/api-login/?username1=${username}&password1=${password}`;

    try {
        const response = await fetch(search_url);
        const data = await response.json();

        console.log(data);

        if (response.ok) {
            // Login successful
            console.log("Login successful");
            // document.querySelector('#alert').innerHTML = 'Login successful';
            window.location.assign("/dashboard/")
            // Redirect or perform any other actions on successful login
        } else if (response.status === 400) {
            // Incorrect password or username
            document.querySelector('#alert').innerHTML = 'Incorrect Password or Username';
        } else if (response.status === 500) {
            // Incorrect password
            document.querySelector('#alert').innerHTML = 'Incorrect Password';
        } else {
            // Other errors
            document.querySelector('#alert').innerHTML = 'Error: ' + response.statusText;
        }
    } catch (error) {
        // Network or fetch error
        console.error('Error:', error);
        document.querySelector('#alert').innerHTML = 'Network or Fetch Error';
    }
};

var loginCredential = document.querySelector('#BtnLogin');
loginCredential.addEventListener("click", function () {
    login();
});
