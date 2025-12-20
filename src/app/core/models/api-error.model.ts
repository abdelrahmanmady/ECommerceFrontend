/**
 * Backend unified error response structure
 */
export interface ApiError {
    statusCode: number;
    message: string;
    detail: string;
    timeStamp: string;
}
