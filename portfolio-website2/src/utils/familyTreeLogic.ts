
export interface Person {
    id: string;
    name: string;
    generation: number;
    spouse?: string;
    children?: Person[];
}

export const corleoneFamily: Person = {
    id: "1",
    name: "Vito Corleone",
    generation: 1,
    spouse: "Carmela",
    children: [
        {
            id: "2",
            name: "Sonny Corleone",
            generation: 2,
            children: [
                {
                    id: "6",
                    name: "Vincent Corleone",
                    generation: 3,
                    children: []
                }
            ]
        },
        {
            id: "3",
            name: "Fredo Corleone",
            generation: 2,
            children: []
        },
        {
            id: "4",
            name: "Michael Corleone",
            generation: 2,
            spouse: "Kay",
            children: [
                {
                    id: "7",
                    name: "Anthony Corleone",
                    generation: 3,
                    children: []
                },
                {
                    id: "8",
                    name: "Mary Corleone",
                    generation: 3,
                    children: []
                }
            ]
        },
        {
            id: "5",
            name: "Connie Corleone",
            generation: 2,
            children: [
                {
                    id: "9",
                    name: "Victor Rizzi",
                    generation: 3,
                    children: []
                },
                {
                    id: "10",
                    name: "Michael Francis Rizzi",
                    generation: 3,
                    children: []
                }
            ]
        }
    ]
};

// Map to quickly look up people and their parents
interface FlattenedPerson extends Person {
    parentId?: string;
}

const flattenTree = (person: Person, parentId?: string, map: Map<string, FlattenedPerson> = new Map()) => {
    const flatPerson = { ...person, parentId };
    // Remove children from the flat object to avoid circular JSON (if we were stringifying), 
    // but here we just need the reference to the parent.
    map.set(person.id, flatPerson);

    if (person.children) {
        person.children.forEach(child => flattenTree(child, person.id, map));
    }
    return map;
};

export const findRelationship = (personA_ID: string, personB_ID: string, treeData: Person): string => {
    const peopleMap = flattenTree(treeData);
    const personA = peopleMap.get(personA_ID);
    const personB = peopleMap.get(personB_ID);

    if (!personA || !personB) return "Person not found in tree.";
    if (personA_ID === personB_ID) return "Same person.";

    // Calculate distance or relationship based on Logic
    // Logic:
    // Same parent = 'Siblings'.
    // Parent/Child = 'Parent/Child'.
    // Same Grandparent but different Parent = 'First Cousins'.
    // Sibling of Parent = 'Aunt/Uncle/Niece/Nephew'.

    // Check Parent/Child
    if (personA.parentId === personB.id) return `${personB.name} is ${personA.name}'s Parent`;
    if (personB.parentId === personA.id) return `${personA.name} is ${personB.name}'s Parent`; // Or Child, depending on phrasing. Prompt says "Parent/Child"

    // Check Siblings (Same Parent)
    // Note: Root has no parentId (undefined). If both undefined, they are main roots? (Usually one root).
    if (personA.parentId && personB.parentId && personA.parentId === personB.parentId) {
        return `${personA.name} is ${personB.name}'s Sibling`;
    }

    // Get older generations to check Grandparents/Uncles
    const getAncestors = (id: string, map: Map<string, FlattenedPerson>): string[] => {
        const ancestors: string[] = [];
        let current = map.get(id);
        while (current && current.parentId) {
            ancestors.push(current.parentId);
            current = map.get(current.parentId);
        }
        return ancestors;
    };

    const aAncestors = getAncestors(personA.id, peopleMap);
    const bAncestors = getAncestors(personB.id, peopleMap);

    // Check Aunt/Uncle / Niece/Nephew
    // Case 1: A's parent is B's sibling. (B is A's Aunt/Uncle, A is B's Niece/Nephew)
    if (personA.parentId) {
        const parentA = peopleMap.get(personA.parentId);
        if (parentA && parentA.parentId && personB.parentId && parentA.parentId === personB.parentId) {
            // ParentA and PersonB are siblings.
            if (personB.generation < personA.generation) {
                return `${personB.name} is ${personA.name}'s Aunt/Uncle`;
            } else {
                return `${personA.name} is ${personB.name}'s Niece/Nephew`;
            }
        }
    }
    // Case 2: B's parent is A's sibling. (A is B's Aunt/Uncle, B is A's Niece/Nephew)
    if (personB.parentId) {
        const parentB = peopleMap.get(personB.parentId);
        if (parentB && parentB.parentId && personA.parentId && parentB.parentId === personA.parentId) {
            // ParentB and PersonA are siblings.
            if (personA.generation < personB.generation) {
                return `${personA.name} is ${personB.name}'s Aunt/Uncle`;
            } else {
                return `${personB.name} is ${personA.name}'s Niece/Nephew`;
            }
        }
    }

    // Check First Cousins
    // Share same grandparent, different parents.
    if (aAncestors.length >= 2 && bAncestors.length >= 2) {
        if (aAncestors[1] === bAncestors[1] && personA.parentId !== personB.parentId) {
            return `${personA.name} is ${personB.name}'s First Cousin`;
        }
    }

    // Fallback for general path finding or deeper relationships?
    // The user asked for specific logic mapping, but also "traverse the tree to find the shortest path".
    // Let's implement a BFS for shortest path just in case, but prioritize the specific logic rules requested.

    return "Relationship not defined in basic logic.";
};
