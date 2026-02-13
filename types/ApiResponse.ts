export type ErrorResponse = {
    code: string;
    message: string;
}

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    expiration: number
} 

export type Response = {
    error: any | null;
    data: any | null;
}