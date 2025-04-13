import { useState } from "react";
import { PostPopup } from "./post-popup";

export const PostCard = ({ media }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {isOpen && (
                <PostPopup media={media} onClose={() => setIsOpen(false)} />
            )}
            <div
                onClick={() => setIsOpen(true)}
                key={media.id}
                className="aspect-square relative group overflow-hidden bg-black h-80 w-full"
            >

                {media.media_type === "IMAGE" || media.media_type === "CAROUSEL_ALBUM" ? (
                    <img
                        src={media.media_url}
                        alt={media.caption || "Instagram post"}
                        className="object-cover w-full h-full group-hover:opacity-60 transition-opacity"
                    />
                ) : media.media_type === "VIDEO" ? (
                    <video
                        src={media.media_url}
                        controls={false}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster={media.thumbnail_url}
                        className="object-cover w-full h-full group-hover:opacity-60 transition-opacity"
                    />
                ) : null}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex medias-center items-center justify-center gap-4 text-white font-medium text-sm transition-opacity">
                    <div className="flex medias-center gap-1">
                        ❤️ <span>{media.like_count}</span>
                    </div>
                    <div className="flex medias-center gap-1">
                        💬 <span>{media.comments_count}</span>
                    </div>
                </div>
            </div>
        </>

    )
}