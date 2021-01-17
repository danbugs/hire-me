export type User = {
    id: string;
    name: string;
    githubId: string;
    isRecruiter: boolean;
};

export type Question = {
    text: string;
    creatorId: string;
};