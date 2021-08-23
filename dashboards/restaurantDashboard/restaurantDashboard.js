var userID;
var itemArray = []

firebase.auth().onAuthStateChanged((user) => {
    const username = document.getElementById("username");
    if (user) {
        userID = user.uid;
        console.log(userID)
        firebase.firestore().collection("users").doc(user.uid).get()
            .then((snapshot) => {
                // console.log("Snapshot", snapshot);
                // console.log("Snapshot Data", snapshot.data());
                // console.log("Snapshot username Data", snapshot.data().username);
                username.innerText = snapshot.data().username;
                console.log(snapshot.data())
                getItems(userID);

            }).catch((er) => {
                console.log("Error", er);
            })

    } else {
        location.href("../dashboards/home.html")

        // ...
        // console.log('user is not signed in to retrive username');
    }
});


var storage = firebase.storage();

let addItem = () => {
    document.getElementById("main").innerHTML = "";
    var itemName = document.getElementById("itemName").value;
    var price = document.getElementById("price").value;
    var category = document.getElementById("category").value;
    var deliveryType = document.getElementById("deliveryType").value;
    var imageFile = document.getElementById("imageFile")
    var imageKey = imageFile.files[0];
    var imagesRef = storage.ref().child('images/' + imageKey.name);
    var uploadTask = imagesRef.put(imageKey);
 

    uploadTask.snapshot.ref.getDownloadURL()
        .then((url) => {
            console.log("URL", url);
            firebase.firestore().collection("items").add({
                    itemName: itemName,
                    uid: userID,
                    image: url,
                    price: price,
                    category: category,
                    deliveryType: deliveryType,
                })
                .then(function() {
                    console.log(userID);
                    console.log("Object url", url);
                    console.log("Data Added");
                    getItems(userID);
                })
                .catch(function(error) {
                    console.log(error);
                })
        })
        .catch((error) => {
            console.log(error);
        })
}

var refId;
var url;
var itemObject;

let getItems = (userID) => {
    // itemArray = []
    firebase.firestore().collection("items").where("uid", "==", userID)
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
                
               
                    
                 //   document.getElementById("main").innerHTML = ""
                    document.getElementById("main").innerHTML += `
                  
                    <div class="card col-sm-4" style="width: 18rem; margin: 10px 4px; border: 1px black solid; box-shadow: 5px 2px #888888;padding-top: 4px">
                    <img src="${url}" class="card-img-top"  style="height: 250px; width: 250px>
                    <div class="card-body">
                    <h5 class="card-title" style="text-align:center;">${itemObject.itemName}</h5>
                    <p class="card-text text-danger" style="font-weight: 500;text-align:center; margin: -1%;">Price: ${itemObject.price}rs</p>
                    <p class="card-text" style=" margin: -1%;text-align:center;" >Category: ${itemObject.category}</p>
                    <p class="card-text" style=" margin: -1%;text-align:center;" >Delivery : ${itemObject.deliveryType}</p>
                    <button  class="btn btn-danger" style="margin-top: 7px; margin-bottom: 8px;" id="${doc.id}" onclick="remove(this)">Remove</button>
                    </div>
                </div> 
                `
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

var newobj;
function remove(t){
    firebase.firestore().collection('items').doc(t.id)
        .delete()
        .then(() => {
            swal({
                titel: "Document Deleted,",
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

function deleteTodo(itemToDelete) {
    console.log('item delete', itemToDelete.parentNode.id)
    var docId = itemToDelete.parentNode.id;
    db.collection("todo").doc(docId).delete()
        .then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
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