import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, increment } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAfmODQ8hgDyOscmVMuLgi9TeLhh_Ih-HE",
    authDomain: "high-scores-cc815.firebaseapp.com",
    projectId: "high-scores-cc815",
    storageBucket: "high-scores-cc815.appspot.com",
    messagingSenderId: "223223771805",
    appId: "1:223223771805:web:74e37fdfa2c133ba83da74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//console.log(app); 

const favoritesList = document.querySelector("#favorites-admin")

const writeFavNameData = (name, id, num) => {
    const db = getDatabase();
    const favRef = ref(db, 'favorites/parks/' + name);
    set(favRef, {
        name,
        id,
        likes: increment(num)
    });
};

const favoritesChanged = (snapshot) => {
    if (favoritesList) {
        favoritesList.innerHTML = "";

        snapshot.forEach(fav => {
            const childKey = fav.key;
            const childData = fav.val();
            console.log(childKey, childData);


            favoritesList.innerHTML += `<li><b>${childData.name} (${childData.id})</b>  - Likes: ${childData.likes}</li>`;
        }

        );

    }
};

const init = () => {
    const db = getDatabase();
    const favoritesRef = ref(db, 'favorites/parks');
    onValue(favoritesRef, favoritesChanged);

};

init();

export { writeFavNameData }