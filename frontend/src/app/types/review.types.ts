export interface IReview {
    _id?: string;
    review: string;
    rating: number;
    by: { user_id: string; fullname: string; };
    date: number;
}
