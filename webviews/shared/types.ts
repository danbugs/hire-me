export type User = {
    id: string;
    name: string;
    githubId: string;
    isRecruiter: boolean;
};

export type Question = {
    text: string;
    creatorId: string;
    id: string;
};

export type Answer = {
    text: string;
    creatorId: string;
    id: string;
    questionId: number;
};

export interface FeedResponse {
    questions: Question[];
  }