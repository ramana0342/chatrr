import React, { useState, createContext } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatApp from "./chat/ChatApp";
import AuthPage from "./AuthPage";
import { userProfile } from "../network/chatrrApiService/chatrrApiService";
import { useEffect } from "react";

export const store = createContext()

const MainHeader = () => {

    const token = localStorage.getItem("accesstoken")
    const [userDetails, setUserDetails] = useState(null)

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = async () => {
        try {
            if (!userDetails && token) {
                let res = await userProfile()
                setUserDetails(res.response.user)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (<>

        <store.Provider value={[userDetails, setUserDetails]}>
            <BrowserRouter>

                <Routes>
                    <Route path="/" element={token ? <ChatApp /> : <AuthPage />}></Route>
                 


                </Routes>
            </BrowserRouter>
        </store.Provider>

    </>)
}


export default MainHeader;