export interface SyncFormResponse {
    result?: SyncFormResponseResult[];
}

export interface SyncFormResponseResult {
    sourceIndex?: number;
    reasonError?: string;
}

export interface SyncFormOAuthResponse {
    access_token?: string;
    token_type?: string;
    expires_in?: number;
}