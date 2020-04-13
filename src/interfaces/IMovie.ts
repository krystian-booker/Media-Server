export interface IMovie {
    _id: string;
    name: string;
    folder: string;
    movieLocationId: string;
    year: string;
}

export interface IMovieDTO {
    name: string;
    folder: string;
    file: string;
    movieLocationId: string;
    year: string;
}
