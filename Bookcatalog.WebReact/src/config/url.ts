export const loginUrl = 'accounts/login';
export const refreshTokenUrl = 'accounts/RefreshToken';

const enum ApiUrl {
    Local = 'https://localhost:5001/api/',
    Production = 'https://bookcatalogwebapi.jadro.space/api/'
}


export const getApiUrl = (): ApiUrl | undefined => {
    let url;

    switch (process.env.NODE_ENV) {
        case 'development':
            url = ApiUrl.Local
            break;
        case 'production':
            url = ApiUrl.Production;
            break;
    }

    return url;
}
