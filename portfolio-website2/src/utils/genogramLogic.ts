export interface Person {
    id: string;
    name: string;
    spouse?: string;
    partnerId?: string;
    partners?: Person[];
    generation: number;
    children?: Person[];
    // GENOGRAM PROPS
    gender?: 'male' | 'female' | 'unknown';
    status?: 'living' | 'deceased';
    isIndex?: boolean;
    dateOfBirth?: string;
    substanceAbuse?: boolean;
    mentalHealth?: boolean;
    physicalIllness?: boolean;
}

// NEW: Relationship Interface
export interface Relationship {
    from: string; // ID of person A
    to: string;   // ID of person B
    type: 'conflict' | 'close' | 'distant' | 'codependent';
}

export const corleoneFamily: Person = {
    id: '1', name: 'Vito Corleone', gender: 'male', status: 'deceased', spouse: 'Carmela', generation: 1,
    children: [
        {
            id: '2', name: 'Sonny', gender: 'male', status: 'deceased', spouse: 'Sandra', generation: 2,
            children: [
                {
                    id: '2-1', name: 'Vincent', gender: 'male', status: 'living', generation: 3, isIndex: true,
                    children: [
                        { id: '2-1-1', name: 'Pepino', gender: 'male', status: 'living', generation: 4 }
                    ]
                }
            ]
        },
        {
            id: '3', name: 'Fredo', gender: 'male', status: 'deceased', generation: 2,
            children: []
        },
        {
            id: '4', name: 'Michael', gender: 'male', status: 'living', spouse: 'Kay', generation: 2,
            children: [
                { id: '4-1', name: 'Anthony', gender: 'male', status: 'living', generation: 3 },
                { id: '4-2', name: 'Mary', gender: 'female', status: 'deceased', generation: 3 }
            ]
        },
        {
            id: '5', name: 'Connie', gender: 'female', status: 'living', spouse: 'Carlo', generation: 2,
            children: [
                { id: '5-1', name: 'Victor', gender: 'male', status: 'living', generation: 3 }
            ]
        }
    ]
};

// NEW: Define Relationships here
export const familyRelationships: Relationship[] = [
    { from: '4', to: '3', type: 'conflict' }, // Michael vs Fredo (Conflict)
    { from: '1', to: '4', type: 'close' },    // Vito and Michael (Close)
    { from: '2', to: '5', type: 'distant' },  // Sonny and Connie (Distant)
    { from: '2-1', to: '4-2', type: 'codependent' } // Vincent and Mary (Codependent/Romance)
];

// ... (Keep getParentMap and findRelationship functions exactly as they were) ...
const getParentMap = (root: Person) => {
    const map = new Map<string, string>();
    const traverse = (node: Person) => {
        if (node.children) {
            node.children.forEach(child => {
                map.set(child.id, node.id);
                traverse(child);
            });
        }
    };
    traverse(root);
    return map;
};

export const findRelationship = (idA: string, idB: string, root: Person): string => {
    if (idA === idB) return "Same Person";
    const parentMap = getParentMap(root);
    const getPath = (id: string) => {
        const path = [id];
        let curr = id;
        while (parentMap.has(curr)) {
            curr = parentMap.get(curr)!;
            path.push(curr);
        }
        return path;
    };
    const pathA = getPath(idA);
    const pathB = getPath(idB);
    let lca = '';
    for (const p of pathA) {
        if (pathB.includes(p)) {
            lca = p;
            break;
        }
    }
    if (!lca) return "No relation found";
    const distA = pathA.indexOf(lca);
    const distB = pathB.indexOf(lca);

    if (distA === 0) {
        if (distB === 1) return "Parent";
        if (distB === 2) return "Grandparent";
        if (distB === 3) return "Great-Grandparent";
        return "Ancestor";
    }
    if (distB === 0) {
        if (distA === 1) return "Child";
        if (distA === 2) return "Grandchild";
        if (distA === 3) return "Great-Grandchild";
        return "Descendant";
    }
    if (distA === 1 && distB === 1) return "Sibling";
    if (distA === 2 && distB === 2) return "First Cousin";
    if (distA === 3 && distB === 3) return "Second Cousin";
    if (distA === 1 && distB === 2) return "Aunt/Uncle";
    if (distA === 1 && distB === 3) return "Great-Aunt/Uncle";
    if (distA === 2 && distB === 1) return "Niece/Nephew";
    if (distA === 3 && distB === 1) return "Great-Niece/Nephew";
    if (distA > 1 && distB > 1) {
        const genDiff = Math.abs(distA - distB);
        const cousinType = Math.min(distA, distB) - 1;
        return `${cousinType === 1 ? "First" : cousinType === 2 ? "Second" : "Distant"} Cousin ${genDiff}x Removed`;
    }
    // Check for In-laws (Spouse/Partner logic)
    // Helper to find a node by ID in the tree
    const findNode = (n: Person, id: string): Person | null => {
        if (n.id === id) return n;
        if (n.children) {
            for (const c of n.children) {
                const res = findNode(c, id);
                if (res) return res;
            }
        }
        return null;
    };

    const nodeB = findNode(root, idB);

    // 1. Partner of Sibling -> Brother/Sister-in-law
    if (distA === 1 && distB === 1) { // Sibling relationship
        // If B is actually a partner of the sibling found at pathB[pathB.length-1]
        // But our path logic doesn't explicitly track "via partner".
        // Instead, let's look at the structure directly.
    }

    // SIMPLER IN-LAW CHECK:
    // If B's partner is A's sibling -> Brother/Sister-in-law
    if (nodeB?.partnerId) {
        const partnerID = nodeB.partnerId;
        const partnerRelation = findRelationship(idA, partnerID, root);
        if (partnerRelation === "Sibling") return "Brother/Sister-in-law";
        if (partnerRelation === "Child") return "Son/Daughter-in-law";
    }

    // If A's partner is B's sibling -> Brother/Sister-in-law
    const nodeA = findNode(root, idA);
    if (nodeA?.partnerId) {
        const partnerID = nodeA.partnerId;
        const partnerRelation = findRelationship(partnerID, idB, root);
        if (partnerRelation === "Sibling") return "Brother/Sister-in-law";
        if (partnerRelation === "Parent") return "Mother/Father-in-law";
    }

    return "Distant Relative";
};