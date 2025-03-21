import axios from 'axios';
import {BASE_URL} from './config';

export const getImages = async (newOffset: any) => {
  try {
    const formData = new FormData();
    formData.append('user_id', '108');
    formData.append('offset', newOffset.toString());
    formData.append('type', 'popular');

    const response = await axios.post(`${BASE_URL}/getdata.php`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    return response?.data;
  } catch (error) {
    console.error(error);
  }
};

interface SavePostData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  xt_image: string;
}

export const savePost = async (data: SavePostData) => {
  try {
    const formData = new FormData();
    formData.append('first_name', data?.firstName);
    formData.append('last_name', data?.lastName);
    formData.append('email', data?.email);
    formData.append('phone', data?.phone);
    formData.append('user_image', {
      uri: data?.xt_image,
      type: 'image/jpeg',
      name: 'user_image.jpg',
    } as any);

   const res = await axios.post(`${BASE_URL}/savedata.php`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });
    return res?.data;
  } catch (error) {
    console.error(error);
  }
};
