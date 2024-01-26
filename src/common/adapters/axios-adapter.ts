import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interface/http-adapter.interface";


export class AxiosAdapter implements HttpAdapter {
    private axios: AxiosInstance = axios

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await axios.get<T>(url)
            return data

        } catch (error) {
            throw new Error("Method not implemented.");

        }
    }

}