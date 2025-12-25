
export interface ApiError { //Input : ApiErrorResponseDto
    statusCode: number;
    message: string;
    detail: string;
    timeStamp: string;
}
