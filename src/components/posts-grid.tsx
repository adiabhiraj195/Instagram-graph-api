
import { PostCard } from './post-card';

export default function PostsGrid({ media }: { media: any[] }) {

    if (!media || media.length === 0) return null;


    return (
        <div className="grid grid-cols-3 gap-2 mt-4">
            {media.map((item) => {

                return (
                    <PostCard media={item} key={item.id} />
                )
            })}
        </div>
    )
}

