import { useState } from "react";
import PostsGrid from "./posts-grid";
import { useInstagram } from "../context";

type MediaItem = {
    id: string;
    media_type: string;
    media_url: string;
    thumbnail_url?: string;
    caption?: string;
    like_count?: number;
    comments_count?: number;
    timestamp: string;
};


const InstagramMedia = () => {
    const [activeTab, setActiveTab] = useState<"POSTS" | "SAVED" | "TAGGED">("POSTS");
    const [taggesdMedia, setTaggedMedia] = useState<MediaItem[] | null>(null);
    const [media, setMedia] = useState<MediaItem[] | null>(null);

    const { accessToken, userInstaId } = useInstagram();

    const fetchTaggedMedia = async (igUserId: any, token: any) => {
        try {
            const res = await fetch(
                `https://graph.facebook.com/v19.0/${igUserId}/tags?fields=id,media_type,media_url,thumbnail_url,caption,timestamp,like_count,comments_count&access_token=${token}`);
            const data = await res.json();
            setTaggedMedia(data.data);
            console.log("Media Data:", data.data);
            console.log(media)
            return data;
        } catch (err) {
            console.error("Error fetching IG media", err);
        }
    };

    const fetchPostMedia = async (igUserId: any, token: any) => {
        try {
            const res = await fetch(
                `https://graph.facebook.com/v19.0/${igUserId}/media?fields=id,caption,media_url,thumbnail_url,media_type,timestamp,like_count,comments_count&access_token=${token}`
            );
            const data = await res.json();
            setMedia(data.data);
            console.log("Media Data:", data.data);
        } catch (err) {
            console.error("Error fetching IG media", err);
        }
    };

    const renderMedia = () => {
        if (activeTab === "POSTS") {
            if (!media) {
                fetchPostMedia(userInstaId, accessToken);
                return <div>Loading...</div>;
            }
            return (
                <PostsGrid media={media} />
            );
        }
        if (activeTab === "SAVED") {
            return (
                <div>Cannot have access by api</div>
            );
        }
        if (activeTab === "TAGGED") {
            if (!taggesdMedia) {
                fetchTaggedMedia(userInstaId, accessToken);
                return <div>Loading...</div>;
            }
            return (
                <PostsGrid media={taggesdMedia} />
            );
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            {/* Nav Tabs */}
            <div className="flex justify-center border-t border-b border-gray-600 mt-6">
                {["POSTS", "SAVED", "TAGGED"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`py-3 px-6 uppercase text-sm font-semibold tracking-widest flex items-center gap-2
              ${activeTab === tab ? "border-t-2 border-white text-white" : "text-gray-400"}`}
                    >
                        {tab === "POSTS" && <span>📷</span>}
                        {tab === "SAVED" && <span>🔖</span>}
                        {tab === "TAGGED" && <span>📸</span>}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Media Grid */}
            {renderMedia()}
        </div>
    );
};

export default InstagramMedia;