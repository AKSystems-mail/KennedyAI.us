import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSwi2KxrUuOXwJ1BUYhl49Z36RM6C4RGU",
    authDomain: "kennedyai.firebaseapp.com",
    projectId: "kennedyai",
    storageBucket: "kennedyai.firebasestorage.app",
    messagingSenderId: "322135870218",
    appId: "1:322135870218:web:d0948838673589de1fc8f3",
    measurementId: "G-8WBTHJ518V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const submitWaitlist = async (email: string, projectId: string) => {
    try {
        const docRef = await addDoc(collection(db, "waitlist"), {
            email,
            projectId,
            timestamp: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: e };
    }
};

export default app;

