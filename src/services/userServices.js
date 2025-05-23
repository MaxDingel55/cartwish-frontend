import { jwtDecode } from "jwt-decode";
import apiClient from "../utils/api-client";

const tokenName = "token";

// user here is formData (see LoginPage), an object containing the entered email and password as properties
export async function signup(user, profile) {
    const body = new FormData();
    body.append("name", user.name);
    body.append("email", user.email);
    body.append("password", user.password);
    body.append("deliveryAddress", user.deliveryAddress);
    body.append("profilePic", profile);

    const { data } = await apiClient.post("/user/signup", body);
    localStorage.setItem(tokenName, data.token); // built-in JS method that allows you to store key:value pairs in local browser storage
}

// user here is formData (see LoginPage), an object containing the entered email and password as properties
export async function login(user) {
    const { data } = await apiClient.post("/user/login", user); 
    localStorage.setItem(tokenName, data.token);
}

export function logout() {
    localStorage.removeItem(tokenName);
}

export function getUser() {
    try {
        const jwt = localStorage.getItem(tokenName); 
	    return jwtDecode(jwt);

    } catch (error) {
        return null;
    } 
}

export function getJwt() {
    return localStorage.getItem(tokenName);
}

    