// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore/lite';
import { getAuth, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import XLSX from 'xlsx';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDq2hDbk0zmb3h_SwtreEo0ZxzYjrmgOiM",
	authDomain: "laresatwork.firebaseapp.com",
	projectId: "laresatwork",
	storageBucket: "laresatwork.appspot.com",
	messagingSenderId: "775876937234",
	appId: "1:775876937234:web:b23dfc8f7323ff73893acb",
	measurementId: "G-2J506064TW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		const uid = user.uid;
		const _isAdmin = await hasAdminRole(user.email as string)
		if (_isAdmin) {
			const sectAdmin = document.getElementById('admin');
			if(sectAdmin) sectAdmin.style.display = 'inherit'
			const btnDownload = document.getElementById('download');
			if (btnDownload) {
				btnDownload.addEventListener("click", async () => {
					const db = getFirestore(app);
					const querySnapshot = await getDocs(collection(db, "worklog"));
					const _worklog: any = [];
					const wlFinished = new Promise((resolve, reject) => {
						let i = 1;
						querySnapshot.forEach(async (doc) => {
							const refDoc: any = await getDoc(doc.data().project);
							_worklog.push({
								'adres': doc.data().address,
								'clientId': doc.data().clientId,
								'project': refDoc.data().name,
								'datetime': doc.data().dateCreated.toDate().toLocaleString()
							})
							if (i++ == querySnapshot.size) resolve(true);
						});
					});
	
					wlFinished.then(() => {
						console.log(_worklog);
						const worklogWS = XLSX.utils.json_to_sheet(_worklog);
						const wb = XLSX.utils.book_new();
						XLSX.utils.book_append_sheet(wb, worklogWS, 'worklog');
						XLSX.writeFile(wb, 'worklog.xlsx');
					});
				})
			}
		}
	} else {
		signInWithRedirect(auth, provider)
		// User is signed out
		// ...
	}
});
// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     // Existing and future Auth states are now persisted in the current
//     // session only. Closing the window would clear any existing state even
//     // if a user forgets to sign out.
//     // ...
//     // New sign-in will be persisted with session persistence.
//     //return signInWithRedirect(auth, provider);
//   })
//   .catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });
// getRedirectResult(auth)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access Google APIs.
//     const credential = GoogleAuthProvider.credentialFromResult(result as UserCredential);
//     const token = credential?.accessToken;
//     // The signed-in user info.
//     const user = result?.user;
//   }).catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // ...
//   });
//if (!auth.currentUser) signInWithRedirect(auth, provider);

// try {
// 	const db = getFirestore(app);
// 	const cityList = getCities(db);
// } catch (e) {
// 	console.error(e);
// }

// Get a list of cities from your database
async function hasAdminRole(email: string): Promise<boolean> {
	const db = getFirestore(app);
	const q = query(collection(db, "users"), where("email", "==", email));
	let isAdministrator = false
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		if (doc.data().role == 'administrator') isAdministrator = true;
	});

	return isAdministrator;
}
function getDocFromCache(docRef: any) {
	throw new Error("Function not implemented.");
}

