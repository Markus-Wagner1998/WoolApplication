import { environment } from "src/environments/environment";

export function getHttpUrl(urlPath: string): string {
    const backendUrl: string = getBackendUrl();
    return backendUrl + urlPath;
}

function getBackendUrl(): string {
    const backendUrl: string = environment.backendUrl;
    if (backendUrl.endsWith('/')) {
        return backendUrl.slice(0, backendUrl.length - 1);
    }
    return backendUrl;
}