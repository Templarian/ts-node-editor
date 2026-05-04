export interface ScriptComment {
    x: number;
    y: number;
    width?: number;
    height?: number;
    text: string;
}

export interface ScriptNode {
    id: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    description?: string;
    type?: string;
    args: Record<string, unknown>;
}

export interface ScriptJson {
    name: string;
    initialState: Record<string, string>;
    imports: string[];
    comments: ScriptComment[];
    nodes: ScriptNode[];
}

export default class Script {
    name: string;
    initialState: Record<string, string>;
    imports: string[];
    comments: ScriptComment[];
    nodes: ScriptNode[];

    constructor(json: ScriptJson) {
        this.name = json.name;
        this.initialState = json.initialState;
        this.imports = json.imports;
        this.comments = json.comments;
        this.nodes = json.nodes;
    }

    toJson(): ScriptJson {
        return {
            name: this.name,
            initialState: this.initialState,
            imports: this.imports,
            comments: this.comments,
            nodes: this.nodes,
        };
    }

    // Comments

    getComment(index: number): ScriptComment | undefined {
        return this.comments[index];
    }

    getComments(): ScriptComment[] {
        return this.comments;
    }

    addComment(comment: ScriptComment): void {
        this.comments.push(comment);
    }

    updateComment(index: number, obj: Partial<ScriptComment>): void {
        this.comments[index] = { ...this.comments[index], ...obj };
    }

    removeComment(index: number): void {
        this.comments.splice(index, 1);
    }

    // Nodes

    getNode(id: number): ScriptNode | undefined {
        return this.nodes.find(n => n.id === id);
    }

    getNodes(): ScriptNode[] {
        return this.nodes;
    }

    nextNodeId(): number {
        return this.nodes.length === 0 ? 1 : Math.max(...this.nodes.map(n => n.id)) + 1;
    }

    addNode(node: ScriptNode): void {
        node.id = this.nextNodeId();
        this.nodes.push(node);
    }

    updateNodeById(id: number, obj: Partial<ScriptNode>): boolean {
        const index = this.nodes.findIndex(n => n.id === id);
        if (index === -1) return false;
        this.nodes[index] = { ...this.nodes[index], ...obj };
        return true;
    }

    updateNodeArgsById(id: number, key: string, value: unknown): boolean {
        const index = this.nodes.findIndex(n => n.id === id);
        if (index === -1) return false;
        this.nodes[index].args[key] = value;
        return true;
    }

    removeNodeById(id: number): boolean {
        const index = this.nodes.findIndex(n => n.id === id);
        if (index === -1) return false;
        this.nodes.splice(index, 1);
        return true;
    }

    // Initial state

    updateInitialState(key: string, value: string): void {
        this.initialState[key] = value;
    }

    removeInitialState(key: string): void {
        delete this.initialState[key];
    }
}
