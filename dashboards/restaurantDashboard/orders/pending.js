firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        userID = user.uid;
        console.log(userID)
        console.log('auth hogia')

        firebase.firestore().collection("users").doc(user.uid).get()
            .then((snapshot) => {
                // console.log("Snapshot", snapshot);
                // console.log("Snapshot Data", snapshot.data());
                // console.log("Snapshot username Data", snapshot.data().username);
                // username.innerText = snapshot.data().username;
                getPending(userID)
                // getTodo(userID);

            }).catch((er) => {
                console.log("Error", er);
            })

    } else {
        location.href("./login.html")

        // ...
        // console.log('user is not signed in to retrive username');
    }
});



let getPending = (userID) => {
    itemArray = []
    firebase.firestore().collection("pending").where("resUid", "==", userID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                itemObject = doc.data();
                console.log(doc.data());
                itemArray.push(doc.data());
                url = itemObject.image

                document.getElementById("main").innerHTML = "";
                document.getElementById("main").innerHTML += `
               
                    <div class="card col-sm-2" style="width: 18rem; margin: 10px 4px">
                        <img src="${url}" class="card-img-top" style="height: 250px; width: 250px">
                        <div class="card-body">
                        <h5 class="card-title">${itemObject.name}</h5>
                        <p class="card-text text-danger" style="font-weight: 500; margin: -1%;">Price: ${itemObject.price}rs</p>
                        <p class="card-text" style=" margin: -1%;" >Category: ${itemObject.category}</p>
                        <p class="card-text" style=" margin: -1%;" >Delivery Type : ${itemObject.deliveryType}</p>
                        <button  class="btn btn-danger" style="margin-top: 7px; margin-left: auto, margin-right: auto;" id="${doc.id}" onclick="accept(this)">Accept</button>
                        </div>
                    </div> `
            });

        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });



    }

var prgObj;
function accept(t)  {
        firebase.firestore().collection("pending").doc(t.id).get()
        .then((doc) => {
            if (doc.exists) {
                var data = doc.data()
                prgObj = {
                    status: "inProgress",
                    name: data.name,
                    price: data.price,
                    category: data.category,
                    deliveryType: data.deliveryType,
                    userUid: data.userUid,
                    resUid: data.resUid,
                    image: data.image
                }
                console.log(prgObj)
                firebase.firestore().collection("inProgress").add(prgObj)
                .then(() =>{
                        swal({
                            titel: "Order Accepted",
                            icon: "success",
                            button: "next",
                        })

                        location.href = "./progress.html"
                    }
                )
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
                    
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
            }
    