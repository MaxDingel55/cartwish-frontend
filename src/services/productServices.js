import apiClient from "../utils/api-client";

// search arg is the string that the user enters in the search bar
export function getSuggestionsAPI(search) {
    return apiClient.get(`/products/suggestions?search=${search}`);
}