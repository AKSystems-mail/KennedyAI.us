
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
                    spouse: "Grace",
                    children: [
                        {
                            id: "11",
                            name: "Santino Jr.",
                            generation: 4,
                            children: []
                        },
                        {
                            id: "12",
                            name: "Lucia Corleone",
                            generation: 4,
                            children: []
                        }
                    ]
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
                    spouse: "Sofia",
                    children: [
                        {
                            id: "13",
                            name: "Michael Jr.",
                            generation: 4,
                            children: []
                        }
                    ]
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
                    spouse: "Isabella",
                    children: [
                        {
                            id: "14",
                            name: "Carlo Rizzi",
                            generation: 4,
                            children: []
                        }
                    ]
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
    let personA = peopleMap.get(personA_ID);
    let personB = peopleMap.get(personB_ID);

    if (!personA || !personB) return "Person not found in tree.";
    if (personA_ID === personB_ID) return "Same person.";

    // Always describe relationship from older generation to younger generation
    // Swap if personB is in an older generation than personA
    if (personB.generation < personA.generation) {
        [personA, personB] = [personB, personA];
    }

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

    // Find Lowest Common Ancestor (LCA)
    let lcaId: string | null = null;
    let aDistance = 0;
    let bDistance = 0;

    for (let i = 0; i < aAncestors.length; i++) {
        const bIdx = bAncestors.indexOf(aAncestors[i]);
        if (bIdx !== -1) {
            lcaId = aAncestors[i];
            aDistance = i + 1;
            bDistance = bIdx + 1;
            break;
        }
    }

    // Direct descent
    if (personB.parentId === personA.id) return `${personA.name} is ${personB.name}'s Parent`;
    if (personA.parentId === personB.id) return `${personA.name} is ${personB.name}'s Child`;

    if (aAncestors.includes(personB.id)) {
        const dist = aAncestors.indexOf(personB.id) + 1;
        if (dist === 2) return `${personB.name} is ${personA.name}'s Grandparent`;
        if (dist === 3) return `${personB.name} is ${personA.name}'s Great-Grandparent`;
        return `${personB.name} is ${personA.name}'s Ancestor`;
    }
    if (bAncestors.includes(personA.id)) {
        const dist = bAncestors.indexOf(personA.id) + 1;
        if (dist === 2) return `${personA.name} is ${personB.name}'s Grandparent`;
        if (dist === 3) return `${personA.name} is ${personB.name}'s Great-Grandparent`;
        if (dist === 4) return `${personA.name} is ${personB.name}'s Great-Great-Grandparent`;
        return `${personA.name} is ${personB.name}'s Ancestor`;
    }

    // Shared LCA
    if (lcaId) {
        // Siblings
        if (aDistance === 1 && bDistance === 1) return `${personA.name} and ${personB.name} are Siblings`;

        // Aunt/Uncle and Niece/Nephew
        if (aDistance === 1 && bDistance === 2) return `${personA.name} is ${personB.name}'s Aunt/Uncle`;
        if (aDistance === 2 && bDistance === 1) return `${personA.name} is ${personB.name}'s Niece/Nephew`;

        // Great Aunt/Uncle
        if (aDistance === 1 && bDistance === 3) return `${personA.name} is ${personB.name}'s Great Aunt/Uncle`;
        if (aDistance === 3 && bDistance === 1) return `${personA.name} is ${personB.name}'s Great Niece/Nephew`;

        // Cousins
        if (aDistance === 2 && bDistance === 2) return `${personA.name} and ${personB.name} are First Cousins`;
        if (aDistance === 3 && bDistance === 3) return `${personA.name} and ${personB.name} are Second Cousins`;

        // Removed cousins
        if (aDistance === 2 && bDistance === 3) return `${personA.name} and ${personB.name} are First Cousins once removed`;
        if (aDistance === 3 && bDistance === 2) return `${personA.name} and ${personB.name} are First Cousins once removed`;
    }

    return "They are related through the family tree.";
};

