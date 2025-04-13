import React, { useEffect } from 'react'

export default function LoginButton({ setAccessToken, fetchIGBusinessAccount, accessToken }: { accessToken: string | null, setAccessToken: React.Dispatch<React.SetStateAction<any>>, fetchIGBusinessAccount: (token: string) => void }) {

    useEffect(() => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: process.env.REACT_APP_FB_APP_ID,
                cookie: true,
                xfbml: true,
                version: "v19.0",
            });
        };

        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const loginWithFacebook = () => {
        if (accessToken) {
            console.log("Already logged in");
            return;
        }
        window.FB.login(
            (response: any) => {
                if (response.authResponse) {
                    setAccessToken(response.authResponse.accessToken);
                    fetchIGBusinessAccount(response.authResponse.accessToken);
                    // const pagesRes = getFacebookPages(response.authResponse.accessToken);

                    localStorage.setItem(
                        "fb_access_token",
                        response.authResponse.accessToken
                    );
                    localStorage.setItem(
                        "fb_user_id",
                        response.authResponse.userID
                    );
                }
            },
            {
                scope:
                    "pages_show_list,instagram_basic,instagram_manage_comments,business_management",
            }
        );
    };
    return (
        <button
            onClick={loginWithFacebook}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
            Login with Instagram (via Facebook)
        </button>
    )
}
