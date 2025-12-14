import api from './api';

export interface UploadResponse {
  url: string;
  filename: string;
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post<{ data: UploadResponse }>('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return res.data.data;
};
