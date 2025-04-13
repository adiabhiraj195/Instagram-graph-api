import React, { useEffect, useState } from "react";
import { useInstagram } from "../context";

export const PostPopup = ({
    onClose,
    media,
}: any) => {
    const [replyText, setReplyText] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const [replyTo, setReplyTo] = useState<string | null>(null);

    const { accessToken } = useInstagram();

    async function getCommentsWithReplies(mediaId: string, accessToken: string) {
        const commentsRes = await fetch(
            `https://graph.facebook.com/v19.0/${mediaId}/comments?fields=id,text,timestamp,username&access_token=${accessToken}`
        );
        const commentsData = await commentsRes.json();
        if (!commentsData.data) {
            return [];
        }
        const commentsWithReplies = await Promise.all(
            commentsData.data?.map(async (comment: any) => {
                const repliesRes = await fetch(
                    `https://graph.facebook.com/v19.0/${comment.id}/replies?fields=id,text,timestamp,username&access_token=${accessToken}`
                );
                const repliesData = await repliesRes.json();

                return {
                    ...comment,
                    replies: repliesData.data || []
                };
            })
        );

        return commentsWithReplies;
    }

    const replyToComment = async (commentId: any, replyText: any) => {
        try {
            await fetch(
                `https://graph.facebook.com/v19.0/${commentId}/replies?access_token=${accessToken}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: replyText }),
                }
            );
            alert("Reply sent successfully!");
        } catch (err) {
            console.error("Error replying to comment", err);
        }
    };

    useEffect(() => {
        if (media) {
            getCommentsWithReplies(media.id, accessToken as string).then((data) => {
                setComments(data);
            });
        }
    }, [media, comments]);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
            {/* Close Button */}
            <button
                className="absolute top-4 right-6 text-white text-3xl font-light"
                onClick={onClose}
            >
                X
            </button>

            <div className="bg-black w-full max-w-5xl rounded-lg overflow-hidden flex flex-col md:flex-row shadow-xl">
                {/* Left: Media */}
                <div className="md:w-1/2 w-full bg-black flex items-center justify-center">
                    {media.media_type === "IMAGE" ? (
                        <img src={media.media_url} alt="post" className="max-h-[90vh] object-contain" />
                    ) : (
                        <video
                            src={media.media_url}
                            controls
                            className="max-h-[90vh] object-contain"
                        />
                    )}
                </div>

                {/* Right: Details */}
                <div className="md:w-1/2 w-full flex flex-col max-h-[90vh]">
                    <div className="p-4 overflow-y-auto flex-1 border-b">
                        {/* captions */}
                        {media?.caption &&
                            <>
                                <div className="text-white font-medium mb-2">Caption</div>
                                <p className="text-gray-300 mb-4">{media.caption}</p>
                            </>
                        }

                        {/* comments  */}
                        <div className="font-medium mb-2">Comments</div>
                        {comments?.length === 0 ? (
                            <p className="text-gray-400">No comments yet.</p>
                        ) : (
                            comments.map((comment: any) => (
                                <div key={comment.id} className="mb-4">
                                    <div
                                        className="group cursor-pointer"
                                    >
                                        <p className="text-sm">
                                            <span className="font-semibold">{comment.username}</span>{" "}
                                            {comment.text}
                                        </p>
                                        <span className="text-xs text-blue-500 hidden group-hover:inline" onClick={() => {
                                            setReplyTo(comment.id);
                                            setReplyText(`@${comment.username} `);
                                        }}>
                                            Reply
                                        </span>
                                    </div>

                                    {/* Replies Section */}
                                    {comment.replies && (
                                        <div className="ml-4 mt-2 border-l border-gray-600 pl-3">
                                            {comment.replies.map((reply: any) => (
                                                <div key={reply.id} className="mb-2 text-sm text-gray-300">
                                                    <span className="font-semibold">{reply.username}</span>{" "}
                                                    {reply.text}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>


                    {/* Input: Reply */}
                    <div className="p-3 border-t flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={
                                replyTo ? "Replying to a comment..." : "Add a comment..."
                            }
                            className="flex-1 border px-3 py-2 rounded-full text-sm focus:outline-none focus:ring text-black"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button
                            className="text-blue-600 font-semibold"
                            onClick={() => {
                                if (replyText.trim()) {
                                    //   onReply(replyText.trim(), replyTo);
                                    replyToComment(replyTo, replyText);

                                    setReplyText("");
                                    setReplyTo(null);
                                }
                            }}
                        >
                            Post
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};