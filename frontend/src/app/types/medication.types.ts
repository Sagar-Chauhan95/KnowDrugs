import { ImageType } from './image.types';
import { IOwner } from './owner.types';
import { IReview } from './review.types';

export interface IMedication {
    _id?: string;
    name: string;
    first_letter?: string;
    generic_name: string;
    medication_class: string;
    availability: string;
    image?: ImageType;
    added_by: IOwner;
    reviews?: IReview[];
}
