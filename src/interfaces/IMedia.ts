export interface IMedia {
    _id: string;
    filename: string;
    location: string;
}

export interface IMediaDTO {
    filename: string;
    location: string;
    mediaLocationName: string;
}
