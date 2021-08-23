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
                getProgress(userID)
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



let getProgress = (userID) => {
    itemArray = []
    firebase.firestore().collection("inProgress").where("resUid", "==", userID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                itemObject = doc.data();
                console.log(doc.data());
                itemArray.push(doc.data());
                url = itemObject.image

               // document.getElementById("main").innerHTML = "";
                document.getElementById("main").innerHTML += `

                    
                    <div class="card col-sm-4" style="width: 18rem; margin: 10px 4px; border: 1px black solid; box-shadow: 5px 2px #888888;padding-top: 4px">
                    <img src="${url}" class="card-img-top"  style="height: 250px; width: 250px>
                    <div class="card-body">
                    <h5 class="card-title" style="text-align:center;">${itemObject.name}</h5>
                    <p class="card-text text-danger" style="font-weight: 500;text-align:center; margin: -1%;">Price: ${itemObject.price}rs</p>
                    <p class="card-text" style=" margin: -1%;text-align:center;" >Category: ${itemObject.category}</p>
                    <p class="card-text" style=" margin: -1%;text-align:center;" >Delivery : ${itemObject.deliveryType}</p>
                    <button  class="btn btn-danger" style="margin-top: 7px; margin-bottom: 8px;" id="${doc.id}" onclick="delivered(this)">Delivered</button>
                    </div>
                </div> `
            });
            
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

    }

var deliveredObj;
function delivered(t)  {
        firebase.firestore().collection("inProgress").doc(t.id).get()
        .then((doc) => {
            if (doc.exists) {
                var data = doc.data()
                deliveredObj = {
                    status: "delivered",
                    name: data.name,
                    price: data.price,
                    category: data.category,
                    deliveryType: data.deliveryType,
                    userUid: data.userUid,
                    resUid: data.resUid,
                    image: data.image
                }
                console.log(deliveredObj)
                firebase.firestore().collection("delivered").add(deliveredObj)
                .then((t) =>{
                    removeObj(t)
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
    
var newobj;
function removeObj(t){
    firebase.firestore().collection('inProgress').doc(t.id)
        .delete()
        .then(() => {
            swal({
                titel: "Successfully delivered",
                icon: "success",
                button: "OK",
            })
            console.log("Document successfully deleted!");
            
        })
        .then(() => {
            location.reload();
        })
        .catch((error) => {
            console.error("Error removing document: ", error);
        });

}