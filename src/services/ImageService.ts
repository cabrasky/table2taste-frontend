import axios from "axios";
import { API_HOST } from "./conts";
import { getAxiosConfig } from "../utils/authUtils";

interface UploadImageResponseDTO {
    url: string;
}

class ImageService {
    protected baseUrl = `${API_HOST}/files`;

    async uploadImage(file: File): Promise<UploadImageResponseDTO> {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(`${this.baseUrl}/upload`, formData, getAxiosConfig());
        return response.data;
    }

    async getImageUrl(filename: string): Promise<string> {
        return `${this.baseUrl}/${filename}`;
    }
}

export const imageService = new ImageService();
