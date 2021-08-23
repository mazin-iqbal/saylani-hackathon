let signUp = () => {
    
    var username = document.getElementById("userName").value;
    var email = document.getElementById("userEmail").value;
    var city = document.getElementById("userCity").value;
    var phone = document.getElementById("userPhone").value;
    var country = document.getElementById("userCountry").value;
    var password = document.getElementById("userPassword").value;
    var accountType = document.querySelector('input[name="accType"]:checked');

    if (!email || !password || !city || !username || !phone || !country  || !accountType) {
        swal({
            title: "Empty Fields",
            text: "Please fill all input fields",
            icon: "error",
            button: "Try Again",
        });
    } 
    
    else {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            console.log("signup Successfull");
            console.log(user.uid);

            firebase.firestore().collection("users").doc(user.uid).set({
                    username: username,
                    email: email,
                    uid: user.uid,
                    password: password,
                    country: country,
                    city: city,
                    phone: phone,
                    accountType: accountType.value,
                })
                .then(function(value) {
                    console.log("value", value);
                    
                   })
           
                swal({
                    title: "Good job!",
                    text: "Successfully sign up",
                    icon: "success",
                    button: "next",
                 })
           
                .then((value) => {
                        console.log(value)
                       location.href = "sign.html"
                     
                    })
        })
    
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error", errorMessage)
            swal("OOpS!", errorMessage, "error");
            
     });

}
}

// Login

let logIn = (event) => {

    console.log(event);
    event.preventDefault();

    var email = document.getElementById("uemail").value;
    var password = document.getElementById("upassword").value;
    // console.log(email);
    // console.log(password);
    var form = document.getElementById('needs-validation')

    if (!form) {
        return
    }
    form.classList.add('was-validated')


    if (!email || !password) {
        swal({
            title: "Empty Fields",
            text: "please fill input fields",
            icon: "error",
            button: "Try Again",
        });
    } 
    
    
    else {

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                console.log("Login Successfull");
                firebase.firestore().collection("users").doc(user.uid).get()
                    .then((snapshot) => {
                        console.log("Snapshot Data", snapshot.data());
                        userData = snapshot.data()
                       
                        
                        if (userData.accountType === "restaurant") {
                                location.href = "../dashboards/restaurantDashboard/restaurantDashboard.html"  
                            }
                        
                        else if (userData.accountType === "customer") {
                                location.href = "../dashboards/userDashboard/userDashboard.html"    
                            }
                        });
                    })
               
           
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("error", errorMessage)
                swal({
                    title: "Error",
                    text: errorMessage,
                    icon: "error",
                    button: "Try Again",
                });
            });

        }
}

