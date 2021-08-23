
var userID;
var todoArray = []

firebase.auth().onAuthStateChanged((user) => {
    const username = document.getElementById("username");
    if (user) {
        userID = user.uid;
        console.log(userID)
        console.log('auth hogia')

        firebase.firestore().collection("users").doc(user.uid).get()
            .then((snapshot) => {
                // console.log("Snapshot", snapshot);
                // console.log("Snapshot Data", snapshot.data());
                // console.log("Snapshot username Data", snapshot.data().username);
                username.innerText = snapshot.data().username;
                getItems(userID)
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



var refId;
var url;
var itemObject;

let getItems = (userID) => {
    itemArray = []
    firebase.firestore().collection("items")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                //console.log(doc.data().id);
             //   console.log(doc.id);
                itemObject = doc.data()
                var src = itemObject.image
                storage = firebase.storage();
                var storageRef = storage.ref();
                url = itemObject.image;
                    
                document.getElementById("main").innerHTML += `
                  
                    <div class="card col-sm-4" style="width: 18rem; margin: 10px 4px; border: 1px black solid; box-shadow: 5px 2px #888888;padding-top: 4px">
                    <img src="${url}" class="card-img-top"  style="height: 250px; width: 250px>
                    <div class="card-body">
                    <h5 class="card-title" style="text-align:center;">${itemObject.itemName}</h5>
                    <p class="card-text text-danger" style="font-weight: 500;text-align:center; margin: -1%;">Price: ${itemObject.price}rs</p>
                    <p class="card-text" style=" margin: -1%;text-align:center;" >Category: ${itemObject.category}</p>
                    <p class="card-text" style=" margin: -1%;text-align:center;" >Delivery : ${itemObject.deliveryType}</p>
                    <button  class="btn btn-danger" style="margin-top: 7px; margin-bottom: 8px;" id="${doc.id}" onclick="order(this)">Order</button>
                    </div>
                    </div> 
                    `
   
         //       document.getElementById("main").innerHTML = "";

            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

var newobj;
 function order(t){

    var docRef = firebase.firestore().collection("items").doc(t.id);
    docRef.get().then((doc) => {
        if (doc.exists) {
            var data = doc.data()
            newobj = {
                status: "pending",
                name: data.itemName,
                price: data.price,
                category: data.category,
                deliveryType: data.deliveryType,
                userUid: userID,
                resUid: data.uid,
                image: data.image
            }
            console.log(newobj)
            var db = firebase.firestore().collection("pending");
            db.add(newobj)
            .then(
                () =>{
                    swal({
                        titel: "good Job",
                        icon: "success",
                        button: "next",
                    })
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



let logOut = () => {
    firebase.auth().signOut()
        .then(function() {
            location.href = "../../home.html"
        })
        .catch(function(er) {
            console.log(er);
        })
}

