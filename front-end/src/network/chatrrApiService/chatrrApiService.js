import { deleteRequest, getRequest , postRequest } from "../apiService";

export const userProfile = async()=>{
    let res = await getRequest("/user/user-profile",  {});
    return res.data;
}

export const userRegister = async(data)=>{
    let res = await postRequest("/user/register",  {data: data});
    return res.data;
}

export const userLogin = async(data)=>{
    let res = await postRequest("/user/login",  {data: data});
    return res.data;
}

export const userList = async()=>{
    let res = await getRequest("/user/search",  {});
    return res.data;
}

export const userChatMessages = async(userId)=>{
     let res = await getRequest(`/user/chat/${userId}`);
    return res.data;
}

export const userLogout = async()=>{
     let res = await postRequest(`/user/logout`);
    return res.data;
}
