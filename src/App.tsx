import { useContext, useEffect, useState } from "react";
import LoginButton from "./components/ui/login";
import ProfileCard from "./components/profile";
import InstagramMedia from "./components/insta-media";
import { useInstagram } from "./context";

// Extend the Window interface to include fbAsyncInit
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const FB_APP_ID = process.env.REACT_APP_FB_APP_ID;
const REDIRECT_URI = "http://localhost:3000"; // Update to your domain

interface UserInfo {
  id: string;
  userName: string;
  picture: string;
  followers_count: string;
  follows_count: string;
  media_count: string;
}
export default function InstagramGraphApp() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const [comments, setComments] = useState<any>({});
  const [replies, setReplies] = useState({});

  const { setAccessToken, setUserInstaId, accessToken } = useInstagram();

  useEffect(() => {
    if (accessToken) {
      fetchIGBusinessAccount(accessToken);
      // fetchUserData(accessToken);
      // fetchUserMedia(userInfo.id, accessToken);
      console.log(userInfo, "User Info");
    }
  }, []);

  const fetchIGBusinessAccount = async (token: any) => {
    try {
      const pagesRes = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`
      );

      const pages = await pagesRes.json();
      const pageId = pages.data[0].id;

      if (pagesRes.ok && pageId) {
        const instaRes = await fetch(
          `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${token}`
        );
        const instaData = await instaRes.json();
        const igId = instaData.instagram_business_account.id;
        setUserInstaId(igId);
        fetchUserData(igId, token);
        // fetchUserMedia(igId, token);
      }
    } catch (err) {
      console.error("Failed to fetch IG Business Account", err);
    }
  };

  const fetchUserData = async (igId: string, token: any) => {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${igId}?fields=username,followers_count,follows_count,media_count,profile_picture_url&access_token=${token}`
      );
      const data = await res.json();
      console.log("User Data:", data);
      setUserInfo({
        id: data.id,
        userName: data.username,
        picture: data.profile_picture_url,
        followers_count: data.followers_count,
        follows_count: data.follows_count,
        media_count: data.media_count,
      });
    } catch (err) {
      console.error("Error fetching IG media", err);
    }
  };

  const fetchComments = async (mediaId: any) => {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${mediaId}/comments?access_token=${accessToken}`
      );
      const data = await res.json();
      setComments((prev: any) => ({ ...prev, [mediaId]: data.data }));
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

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

  return (
    <div className="p-8 font-sans w-full h-screen flex flex-col items-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Instagram Graph API</h1>
      {!accessToken ? (

        <LoginButton
          accessToken={accessToken}
          setAccessToken={setAccessToken}
          fetchIGBusinessAccount={fetchIGBusinessAccount}
        />

      ) : (
        <div className="w-full max-w-3xl  p-6 rounded-lg">

          {/* users profile details  */}
          <ProfileCard userInfo={userInfo} />


          <InstagramMedia />

          {/* <h2 className="text-xl font-bold mb-4">Instagram Media</h2> */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {media.map((item: any) => (
              <div key={item.id} className="border rounded p-2">
                {item.media_type === "IMAGE" ||
                  item.media_type === "CAROUSEL_ALBUM" ? (
                  <img
                    src={item.media_url}
                    alt={item.caption}
                    className="w-full h-auto"
                  />
                ) : item.media_type === "VIDEO" ? (
                  <video
                    src={item.media_url}
                    controls
                    className="w-full h-auto"
                  />
                ) : null}
                <p className="text-sm mt-1">{item.caption}</p>
                <button
                  className="mt-2 text-blue-600 underline"
                  onClick={() => fetchComments(item.id)}
                >
                  Show Comments
                </button>
                {comments[item.id] && (
                  <div className="mt-2">
                    {comments[item.id].map((comment: { id: React.Key | null | undefined; text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                      <div key={comment.id} className="mb-2">
                        <p className="text-gray-700 text-sm">{comment.text}</p>
                        <input
                          className="border text-sm p-1 rounded mt-1 w-full"
                          placeholder="Reply..."
                          onChange={(e) =>
                            setReplies((prev: any) => ({
                              ...prev,
                              [String(comment.id)]: e.target.value,
                            }))
                          }
                        />
                        <button
                          className="mt-1 bg-green-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() =>
                            replyToComment(
                              comment.id,
                              replies[String(comment.id)] || ""
                            )
                          }
                        >
                          Reply
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
}
