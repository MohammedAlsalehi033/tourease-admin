export interface Report {
    id: number;
    content: {
        type: string;
        id: number;
        link: string;
    };
    reporter: {
        id: number;
        name: string;
    };
    reason: string;
    status: 'PENDING' | 'RESOLVED' | 'DISMISSED' | 'INVESTIGATING';
    createdAt: string;
}