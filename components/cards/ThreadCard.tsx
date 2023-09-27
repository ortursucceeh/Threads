import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: { id: string; name: string; image: string } | null;
  createdAt: string;
  comments: { author: { image: string } }[];
  isComment?: boolean;
}

const ThreadCard = ({
  id,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  console.log("comments :>> ", comments);
  return (
    <article
      className={`flex flex-col w-full rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7 "
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-1 flex-grow w-full gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile image"
                fill
                className="rounded-full cursor-pointer"
              />
            </Link>
            <div className="thread-card_bar"></div>
          </div>

          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <Link href={`/profile/${author.id}`} className="w-fit">
                <h4 className="cursor-pointer text-base-semibold text-light-1">
                  {author.name}
                </h4>
              </Link>

              {!isComment && community && (
                <div className="flex justify-between">
                  <Link
                    href={`/communities/${community.id}`}
                    className="flex items-center text-gray-1"
                  >
                    {community.name}
                    <Image
                      src={community.image}
                      alt={community.name}
                      width={14}
                      height={14}
                      className="object-cover ml-1 rounded-full"
                    />
                  </Link>
                </div>
              )}

              <p className="text-subtle-medium text-gray-1">
                {formatDateString(createdAt)}
              </p>
            </div>

            <p className="mt-3 text-small-regular text-light-2">{content}</p>

            <div className={`flex flex-col gap-3 mt-5 ${isComment && "mb-10"}`}>
              <div className="flex gap-3.5 ">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heaer"
                  width={24}
                  height={24}
                  className="object-contain cursor-pointer"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="heaer"
                    width={24}
                    height={24}
                    className="object-contain cursor-pointer"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="heaer"
                  width={24}
                  height={24}
                  className="object-contain cursor-pointer"
                />
                <Image
                  src="/assets/share.svg"
                  alt="heaer"
                  width={24}
                  height={24}
                  className="object-contain cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* TODO: delete thread*/}
      </div>

      {!isComment && comments.length > 0 && (
        <Link href={`/thread/${id}`} className="flex items-center mt-3">
          {comments.slice(0, 3).map((comment, indx) => (
            <Image
              key={indx}
              src={comment.author.image}
              alt={`user_${indx}`}
              width={26}
              height={26}
              className={`${indx !== 0 && "-ml-3"} rounded-full object-cover`}
            />
          ))}

          <p className="ml-2 text-gray-1 text-small-medium">
            {comments.length} replies
          </p>
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
