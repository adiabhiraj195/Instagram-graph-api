import React from 'react'

export default function ProfileCard({ userInfo }: { userInfo: any }) {
    return (
        <div className="text-white flex items-center justify-evenly pb-8">
            <div className="flex items-center justify-center">
                <img
                    src={userInfo.picture}
                    alt={userInfo.userName}
                    className="rounded-full w-24"
                />
            </div>

            <div className="flex flex-col ml-4 items-start">
                <h1 className="text-2xl font-semibold">{userInfo.userName}</h1>
                <div className="flex space-x-4 mt-2">
                    <p className=""> {userInfo.media_count} <span className="text-gray-500">posts</span></p>
                    <p className=""> {userInfo.followers_count} <span className="text-gray-500">followers</span> </p>
                    <p className=""> {userInfo.follows_count} <span className="text-gray-500">following</span></p>
                </div>
            </div>
        </div>
    )
}
