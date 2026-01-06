export interface Person {
    id: string;
    name: string;
    spouse?: string;
    partnerId?: string; // ID of primary partner/spouse
    partners?: Person[]; // Array for multi-partner support and rendering
    generation: number;
    children?: Person[];
    parent2Id?: string; // Explicitly link a second parent if they exist in the tree
    childType?: 'biological' | 'adopted' | 'foster';
    partnerStatus?: 'married' | 'separated' | 'divorced';
    // GENOGRAM PROPS
    gender?: 'male' | 'female' | 'unknown';
    status?: 'living' | 'deceased';
    isIndex?: boolean;
    dateOfBirth?: string;
    substanceAbuse?: boolean;
    mentalHealth?: boolean;
    physicalIllness?: boolean;
}

export interface Relationship {
    from: string;
    to: string;
    type: 'conflict' | 'close' | 'distant' | 'codependent';
}

export const corleoneFamily: Person = {
    id: '1',
    name: 'Vito Corleone',
    gender: 'male',
    status: 'deceased',
    generation: 1,
    partners: [
        {
            id: 'carmela',
            name: 'Carmela Corleone',
            gender: 'female',
            status: 'deceased',
            partnerId: '1',
            generation: 1
        }
    ],
    children: [
        {
            id: '2',
            name: 'Sonny',
            gender: 'male',
            status: 'deceased',
            generation: 2,
            parent2Id: 'carmela',
            partners: [
                {
                    id: 'sandra',
                    name: 'Sandra Corleone',
                    gender: 'female',
                    status: 'living',
                    partnerId: '2',
                    generation: 2
                }
            ],
            children: [
                {
                    id: '2-1',
                    name: 'Vincent',
                    gender: 'male',
                    status: 'living',
                    generation: 3,
                    isIndex: true,
                    parent2Id: 'sandra',
                    children: [{
                        id: '2-1-1',
                        name: 'Pepino',
                        gender: 'male',
                        status: 'living',
                        generation: 4
                    }]
                }
            ]
        },
        {
            id: '3',
            name: 'Fredo',
            gender: 'male',
            status: 'deceased',
            generation: 2,
            parent2Id: 'carmela',
            children: []
        },
        {
            id: '4',
            name: 'Michael',
            gender: 'male',
            status: 'living',
            generation: 2,
            parent2Id: 'carmela',
            partners: [
                {
                    id: 'kay',
                    name: 'Kay Adams',
                    gender: 'female',
                    status: 'living',
                    partnerId: '4',
                    generation: 2
                }
            ],
            children: [
                {
                    id: '4-1',
                    name: 'Anthony',
                    gender: 'male',
                    status: 'living',
                    generation: 3,
                    parent2Id: 'kay'
                },
                {
                    id: '4-2',
                    name: 'Mary',
                    gender: 'female',
                    status: 'deceased',
                    generation: 3,
                    parent2Id: 'kay'
                }
            ]
        },
        {
            id: '5',
            name: 'Connie',
            gender: 'female',
            status: 'living',
            generation: 2,
            parent2Id: 'carmela',
            partners: [
                {
                    id: 'carlo',
                    name: 'Carlo Rizzi',
                    gender: 'male',
                    status: 'deceased',
                    partnerId: '5',
                    generation: 2
                }
            ],
            children: [{
                id: '5-1',
                name: 'Victor',
                gender: 'male',
                status: 'living',
                generation: 3,
                parent2Id: 'carlo'
            }]
        }
    ]
};

export const familyRelationships: Relationship[] = [
    { from: '4', to: '3', type: 'conflict' },
    { from: '1', to: '4', type: 'close' },
    { from: '2', to: '5', type: 'distant' },
    { from: '2-1', to: '4-2', type: 'codependent' }
];

// --- HELPER FUNCTIONS ---

// Finds a node anywhere in the tree by its ID, recursively searching partners and children
const findNodeById = (n: Person, id: string): Person | null => {
    if (n.id === id) return n;
    if (n.partners) {
        for (const p of n.partners) {
            const found = findNodeById(p, id);
            if (found) return found;
        }
    }
    if (n.children) {
        for (const child of n.children) {
            const found = findNodeById(child, id);
            if (found) return found;
        }
    }
    return null;
};

// --- CORE RELATIONSHIP LOGIC ---

// Helper function to find primary parent (the one who has this person in children array)
const findPrimaryParent = (childId: string, root: Person): string | null => {
    let foundParent: string | null = null;

    const traverse = (node: Person) => {
        if (node.children) {
            for (const child of node.children) {
                if (child.id === childId) {
                    foundParent = node.id;
                    return;
                }
                traverse(child);
            }
        }
        if (node.partners) {
            for (const partner of node.partners) {
                traverse(partner);
            }
        }
    };

    traverse(root);
    return foundParent;
};

// Get all parents (biological parents - primary + parent2Id)
const getAllParents = (personId: string, root: Person): string[] => {
    const person = findNodeById(root, personId);
    const parents: string[] = [];

    // Find primary parent (the one who has this person in children array)
    const primary = findPrimaryParent(personId, root);
    if (primary) parents.push(primary);

    // Add parent2Id if exists
    if (person?.parent2Id) parents.push(person.parent2Id);

    return parents;
};

// Calculate generation difference between two nodes
const getGenerationDifference = (node1: Person, node2: Person): number => {
    return node2.generation - node1.generation;
};

// Check if two people share at least one parent
const shareParent = (id1: string, id2: string, root: Person): boolean => {
    const parents1 = getAllParents(id1, root);
    const parents2 = getAllParents(id2, root);
    return parents1.some(p1 => parents2.includes(p1));
};

// Check if person1 is an ancestor of person2 (direct lineage)
const isAncestor = (possibleAncestorId: string, descendantId: string, root: Person): boolean => {
    const ancestorNode = findNodeById(root, possibleAncestorId);
    const descendantNode = findNodeById(root, descendantId);

    if (!ancestorNode || !descendantNode) return false;

    // Quick check: descendant must have higher generation number
    if (descendantNode.generation <= ancestorNode.generation) return false;

    // Recursively check parents
    const checkParents = (currentId: string): boolean => {
        if (currentId === possibleAncestorId) return true;
        const parents = getAllParents(currentId, root);
        return parents.some(parentId => checkParents(parentId));
    };

    return checkParents(descendantId);
};

// Helper for ordinal numbers (1st, 2nd, 3rd, etc.)
const getOrdinal = (n: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};




export const findRelationship = (
    selectedId: string,
    hoveredId: string,
    root: Person
): string => {
    if (selectedId === hoveredId) return "Self";

    const selectedNode = findNodeById(root, selectedId);
    const hoveredNode = findNodeById(root, hoveredId);

    if (!selectedNode || !hoveredNode) return "Unknown";

    // --- HIERARCHICAL CHECKS (in order of priority) ---

    // 1. DIRECT PARTNERS
    const isDirectPartner = selectedNode.partnerId === hoveredId ||
        selectedNode.partners?.some(p => p.id === hoveredId);
    if (isDirectPartner) {
        const status = selectedNode.partnerStatus || 'married';
        const genderLabel = hoveredNode.gender === 'male' ? "Husband" :
            (hoveredNode.gender === 'female' ? "Wife" : "Partner");
        if (status === 'separated') return `Separated ${genderLabel}`;
        if (status === 'divorced') return `Ex-${genderLabel}`;
        return genderLabel;
    }

    // 2. PARENT-CHILD DIRECT RELATIONSHIPS
    // Check if hovered is selected's child
    const isMyChild = selectedNode.children?.some(child => child.id === hoveredId) ||
        getAllParents(hoveredId, root).includes(selectedId);

    if (isMyChild) {
        // We found a child relationship. Now determine type (biological/step/adopted)
        // If the link comes from 'parent2Id' or direct children array, it's usually biological/adopted
        // We'll trust the childType on the child node if it exists
        const childNode = selectedNode.children?.find(c => c.id === hoveredId) || findNodeById(root, hoveredId);
        const childType = childNode?.childType || 'biological';
        const genderLabel = hoveredNode.gender === 'male' ? "Son" :
            (hoveredNode.gender === 'female' ? "Daughter" : "Child");

        if (childType === 'adopted') return `Adopted ${genderLabel}`;
        if (childType === 'foster') return `Foster ${genderLabel}`;
        return genderLabel;
    }

    // Check if selected is hovered's child (hovered is parent)
    const isMyParent = getAllParents(selectedId, root).includes(hoveredId);
    if (isMyParent) {
        // Determine if biological, adoptive, foster, or step
        const allParents = getAllParents(selectedId, root);
        const isBiological = selectedNode.parent2Id === hoveredId ||
            (allParents[0] === hoveredId);

        if (isBiological) {
            const childType = selectedNode.childType || 'biological';
            if (childType === 'adopted') {
                return hoveredNode.gender === 'male' ? "Adoptive Father" : "Adoptive Mother";
            }
            if (childType === 'foster') {
                return hoveredNode.gender === 'male' ? "Foster Father" : "Foster Mother";
            }
            return hoveredNode.gender === 'male' ? "Father" : "Mother";
        } else {
            // Step-parent
            return hoveredNode.gender === 'male' ? "Stepfather" : "Stepmother";
        }
    }

    // 3. GRANDPARENT/GRANDCHILD (Multi-generational)
    const genDiff = getGenerationDifference(selectedNode, hoveredNode);

    // Grandparent (hovered is 2+ generations older)
    if (genDiff <= -2 && isAncestor(hoveredId, selectedId, root)) {
        const absDiff = Math.abs(genDiff);
        if (absDiff === 2) return hoveredNode.gender === 'male' ? "Grandfather" : "Grandmother";
        const greats = absDiff - 2;
        const prefix = "Great-".repeat(greats);
        return hoveredNode.gender === 'male' ? `${prefix}grandfather` : `${prefix}grandmother`;
    }

    // Grandchild (hovered is 2+ generations younger)
    if (genDiff >= 2 && isAncestor(selectedId, hoveredId, root)) {
        if (genDiff === 2) return hoveredNode.gender === 'male' ? "Grandson" : "Granddaughter";
        const greats = genDiff - 2;
        const prefix = "Great-".repeat(greats);
        return hoveredNode.gender === 'male' ? `${prefix}grandson` : `${prefix}granddaughter`;
    }

    // 4. SIBLINGS (same generation, share at least one parent)
    if (genDiff === 0 && shareParent(selectedId, hoveredId, root)) {
        return hoveredNode.gender === 'male' ? "Brother" : "Sister";
    }

    // 5. AUNT/UNCLE vs NIECE/NEPHEW (and Great- variations)
    // 5. AUNT/UNCLE vs NIECE/NEPHEW (and Great- variations)
    if (genDiff <= -1) {
        // Find ancestor of selected at generation (hoveredNode.generation)
        // We want to find the ancestor of 'selected' that is a sibling of 'hovered'
        const getAncestorsAtGen = (targetGen: number): string[] => {
            const result: string[] = [];
            const collect = (currentId: string) => {
                const node = findNodeById(root, currentId);
                if (!node) return;
                if (node.generation === targetGen) {
                    result.push(currentId);
                    return;
                }
                if (node.generation > targetGen) {
                    getAllParents(currentId, root).forEach(collect);
                }
            };
            collect(selectedId);
            return result;
        };

        const targetGen = hoveredNode.generation;
        if (targetGen < selectedNode.generation) {
            const ancestorsAtGen = getAncestorsAtGen(targetGen);
            for (const ancestorId of ancestorsAtGen) {
                // Check direct sibling
                const isSibling = shareParent(ancestorId, hoveredId, root);

                // Check partner of sibling (Great-Aunt/Uncle by marriage)
                let isPartnerOfSibling = false;

                // Check if hovered is partner of a sibling of ancestor
                if (!isSibling) {
                    const ancestorParents = getAllParents(ancestorId, root);
                    const ancestorSiblings = ancestorParents.flatMap(pId => {
                        const p = findNodeById(root, pId);
                        return p?.children?.map(c => c.id) || [];
                    }).filter(id => id !== ancestorId);

                    for (const sibId of ancestorSiblings) {
                        const sib = findNodeById(root, sibId);
                        if (sib?.partnerId === hoveredId || sib?.partners?.some(p => p.id === hoveredId)) {
                            isPartnerOfSibling = true;
                            break;
                        }
                    }
                }

                if (isSibling || isPartnerOfSibling) {
                    const absDiff = Math.abs(genDiff);
                    const genderLabel = hoveredNode.gender === 'male' ? "Uncle" : "Aunt";
                    if (absDiff === 1) return genderLabel;
                    const greats = absDiff - 1;
                    const prefix = "Great-".repeat(greats);
                    return `${prefix}${genderLabel.toLowerCase()}`;
                }
            }
        }
    }

    if (genDiff >= 1) {
        // Find ancestor of hovered at generation (selectedNode.generation)
        // We want to find the ancestor of 'hovered' that is a sibling of 'selected'
        const getAncestorsAtGen = (descendantId: string, targetGen: number): string[] => {
            const result: string[] = [];
            const collect = (currentId: string) => {
                const node = findNodeById(root, currentId);
                if (!node) return;
                if (node.generation === targetGen) {
                    result.push(currentId);
                    return;
                }
                if (node.generation > targetGen) {
                    getAllParents(currentId, root).forEach(collect);
                }
            };
            collect(descendantId);
            return result;
        };

        const targetGen = selectedNode.generation;
        const potentialAncestors = getAncestorsAtGen(hoveredId, targetGen);
        for (const ancestorId of potentialAncestors) {
            if (shareParent(selectedId, ancestorId, root)) {
                const genderLabel = hoveredNode.gender === 'male' ? "Nephew" : "Niece";
                if (genDiff === 1) return genderLabel;
                const greats = genDiff - 1;
                const prefix = "Great-".repeat(greats);
                return `${prefix}${genderLabel.toLowerCase()}`;
            }
        }
    }

    // 6. IN-LAWS (Partner relationships through marriage)
    // Partner of my child = Son-in-law/Daughter-in-law
    if (selectedNode.children) {
        for (const child of selectedNode.children) {
            if (child.partnerId === hoveredId || child.partners?.some(p => p.id === hoveredId)) {
                return hoveredNode.gender === 'male' ? "Son-in-law" : "Daughter-in-law";
            }
        }
    }

    // Parent of my partner = Parent-in-law
    const myPartnerIds = [selectedNode.partnerId, ...(selectedNode.partners?.map(p => p.id) || [])].filter(Boolean) as string[];
    for (const partnerId of myPartnerIds) {
        const partnerParents = getAllParents(partnerId, root);
        if (partnerParents.includes(hoveredId)) {
            return hoveredNode.gender === 'male' ? "Father-in-law" : "Mother-in-law";
        }
    }

    // Sibling of my partner OR partner of my sibling = Sibling-in-law
    for (const partnerId of myPartnerIds) {
        if (shareParent(partnerId, hoveredId, root)) {
            return hoveredNode.gender === 'male' ? "Brother-in-law" : "Sister-in-law";
        }
    }

    // Partner of my sibling
    const mySiblings = getAllParents(selectedId, root).flatMap(parentId => {
        const parent = findNodeById(root, parentId);
        return parent?.children?.map(c => c.id) || [];
    }).filter(id => id !== selectedId);

    for (const siblingId of mySiblings) {
        const sibling = findNodeById(root, siblingId);
        if (sibling?.partnerId === hoveredId || sibling?.partners?.some(p => p.id === hoveredId)) {
            return hoveredNode.gender === 'male' ? "Brother-in-law" : "Sister-in-law";
        }
    }

    // Partner of my partner's sibling (Co-sibling-in-law)
    for (const partnerId of myPartnerIds) {
        const partnerSiblings = getAllParents(partnerId, root).flatMap(pId => {
            const p = findNodeById(root, pId);
            return p?.children?.map(c => c.id) || [];
        }).filter(id => id !== partnerId);

        for (const pSibId of partnerSiblings) {
            const pSib = findNodeById(root, pSibId);
            if (pSib?.partnerId === hoveredId || pSib?.partners?.some(p => p.id === hoveredId)) {
                return hoveredNode.gender === 'male' ? "Brother-in-law" : "Sister-in-law";
            }
        }
    }

    // 7. STEP-SIBLINGS (children of my step-parent)
    const selectedParents = getAllParents(selectedId, root);
    for (const parentId of selectedParents) {
        const parent = findNodeById(root, parentId);
        const parentPartners = [parent?.partnerId, ...(parent?.partners?.map(p => p.id) || [])].filter(Boolean) as string[];

        for (const stepParentId of parentPartners) {
            if (stepParentId && stepParentId !== hoveredId) {
                const stepParent = findNodeById(root, stepParentId);
                const isStepSibling = stepParent?.children?.some(c => c.id === hoveredId);

                if (isStepSibling && !shareParent(selectedId, hoveredId, root)) {
                    return hoveredNode.gender === 'male' ? "Stepbrother" : "Stepsister";
                }
            }
        }
    }

    // 8. COUSINS (Recursive check for common ancestors, handles Removed relationships)
    // Formula: min(gen1, gen2) - ancestorGen - 1 = Cousin Level
    //           abs(gen1 - gen2) = Removed Count
    const getAncestors = (personId: string): string[] => {
        const ancestors = new Set<string>();
        const collect = (currentId: string) => {
            const parents = getAllParents(currentId, root);
            parents.forEach(parent => {
                if (!ancestors.has(parent)) {
                    ancestors.add(parent);
                    collect(parent);
                }
            });
        };
        collect(personId);
        return Array.from(ancestors);
    };

    const selectedAncestors = getAncestors(selectedId);
    const hoveredAncestors = getAncestors(hoveredId);
    const common = selectedAncestors.filter(a => hoveredAncestors.includes(a));

    if (common.length > 0) {
        // Find the most recent common ancestor
        const ancestorNodes = common.map(id => findNodeById(root, id)).filter(Boolean) as Person[];
        const lowestGen = Math.min(...ancestorNodes.map(a => a.generation));

        const minGen = Math.min(selectedNode.generation, hoveredNode.generation);
        const cousinLevel = minGen - lowestGen - 1;
        const removed = Math.abs(selectedNode.generation - hoveredNode.generation);

        if (cousinLevel >= 1) {
            let label = "";
            if (cousinLevel === 1) label = "First Cousin";
            else if (cousinLevel === 2) label = "Second Cousin";
            else if (cousinLevel === 3) label = "Third Cousin";
            else label = `${getOrdinal(cousinLevel)} Cousin`;

            if (removed > 0) {
                const times = removed === 1 ? "Once" : (removed === 2 ? "Twice" : `${removed} Times`);
                label += ` ${times} Removed`;
            }
            return label;
        }
    }

    // 9. STEP-CHILDREN (children of my partner that are NOT my children)
    for (const partnerId of myPartnerIds) {
        const partner = findNodeById(root, partnerId);
        const partnerChildren = partner?.children?.map(c => c.id) || [];

        if (partnerChildren.includes(hoveredId) &&
            !selectedNode.children?.some(c => c.id === hoveredId)) {
            return hoveredNode.gender === 'male' ? "Step-son" : "Step-daughter";
        }
    }

    // Default fallback
    return "Relative";
};