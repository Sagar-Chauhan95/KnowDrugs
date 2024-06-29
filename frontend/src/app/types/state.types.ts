export interface IState {
    _id: string;
    fullname: string;
    email: string;
    jwt: string;
}

export const initial_state = {
    _id: '',
    fullname: '',
    email: '',
    jwt: '',
};
