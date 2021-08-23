var userID;
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        userID = user.uid;
        console.log(userID)
       

        firebase.firestore().collection("users").doc(user.uid).get()
            .then((snapshot) => {
                // console.log("Snapshot", snapshot);
                // console.log("Snapshot Data", snapshot.data());
                // console.log("Snapshot username Data", snapshot.data().username);
                //username.innerText = snapshot.data().username;
                
                console.log('before', userID)
                getProgress(userID)
                // getTodo(userID);

            }).catch((er) => {
                console.log("Error", er);
            })

    } else {
        location.href("../../home.html")

        // ...
    }
});

var url;

let getProgress = (userID) => {
    console.log("./login.html")
    itemArray = []
    firebase.firestore().collection("inProgress").where("userUid", "==", userID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                itemObject = doc.data();
                console.log(doc.data());
                itemArray.push(doc.data());
                url = itemObject.image

                //document.getElementById("main").innerHTML = "";
                document.getElementById("main").innerHTML += `
                  
                    <div class="card col-sm-4" style="width: 18rem; margin: 10px 4px; border: 1px black solid; box-shadow: 5px 2px #888888;padding-top: 4px">
                    <img src="${url}" class="card-img-top"  style="height: 250px; width: 250px>
                    <div class="card-body">
                    <h5 class="card-title" style="text-align:center;">${itemObject.name}</h5>
                    <p class="card-text text-danger" style="font-weight: 500;text-align:center; margin: -1%;">Price: ${itemObject.price}rs</p>
                    <p class="card-text" style=" margin: -1%;text-align:center;" >Category: ${itemObject.category}</p>
                    <p class="card-text" style=" margin: -1%;text-align:center;" >Delivery : ${itemObject.deliveryType}</p>
                    
                    </div>
                </div> 
                `

            });

           
            
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }




