
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Person, Relationship } from "../utils/genogramLogic";

export interface Genogram {
    id?: string;
    userId: string;
    name: string;
    familyData: Person;
    relationships: Relationship[];
    createdAt?: any;
    updatedAt?: any;
}

const COLLECTION_NAME = "genograms";

export const GenogramService = {
    // Create a new genogram
    createGenogram: async (userId: string, name: string, familyData: Person, relationships: Relationship[]) => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                userId,
                name,
                familyData: JSON.stringify(familyData), // Store as string to handle nested structure safely
                relationships: JSON.stringify(relationships),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Error creating genogram:", error);
            return { success: false, error };
        }
    },

    // Get all genograms for a user
    getUserGenograms: async (userId: string) => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("userId", "==", userId)
            );
            const querySnapshot = await getDocs(q);

            const docs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Parse JSON strings back to objects
                    familyData: JSON.parse(data.familyData),
                    relationships: JSON.parse(data.relationships)
                } as Genogram;
            });

            // Sort client-side to avoid needing a composite index in Firestore
            return docs.sort((a, b) => {
                const timeA = a.updatedAt?.seconds || 0;
                const timeB = b.updatedAt?.seconds || 0;
                return timeB - timeA;
            });
        } catch (error) {
            console.error("Error fetching genograms:", error);
            return [];
        }
    },

    // Get a specific genogram
    getGenogram: async (genogramId: string) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, genogramId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    familyData: JSON.parse(data.familyData),
                    relationships: JSON.parse(data.relationships)
                } as Genogram;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching genogram:", error);
            return null;
        }
    },

    // Update an existing genogram
    updateGenogram: async (genogramId: string, updates: Partial<Genogram>) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, genogramId);

            // Prepare update data
            const updateData: any = { ...updates, updatedAt: serverTimestamp() };

            // Stringify complex objects if present
            if (updates.familyData) updateData.familyData = JSON.stringify(updates.familyData);
            if (updates.relationships) updateData.relationships = JSON.stringify(updates.relationships);

            // Remove id from update data if present
            delete updateData.id;

            await updateDoc(docRef, updateData);
            return { success: true };
        } catch (error) {
            console.error("Error updating genogram:", error);
            return { success: false, error };
        }
    },

    // Delete a genogram
    deleteGenogram: async (genogramId: string) => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, genogramId));
            return { success: true };
        } catch (error) {
            console.error("Error deleting genogram:", error);
            return { success: false, error };
        }
    }
};
