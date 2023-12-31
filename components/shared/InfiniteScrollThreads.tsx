"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { fetchThreads } from "@/lib/actions/thread.actions";

import { Document } from "mongodb";
import Spinner from "../ui/spinner";
import ThreadCard from "../cards/ThreadCard";
import { usePathname } from "next/navigation";

type Props = {
  initialThreads: Document[] | undefined;
  currentUserId: string;
  userSaves: { _id: string }[];
};

export const dynamic = "force-dynamic";

export default function InfiniteScrollThreads({
  initialThreads,
  currentUserId,
  userSaves,
}: Props) {
  const pathname = usePathname();
  const [threads, setThreads] = useState(initialThreads);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  const [isLastPage, setIsLastPage] = useState(true);
  async function loadMoreThreads() {
    const next = page + 1;
    const { threads, isNext } = await fetchThreads(next);
    setIsLastPage(isNext);

    if (threads?.length) {
      setPage(next);
      setThreads((prev: Document[] | undefined) => [
        ...(prev?.length ? prev : []),
        ...threads,
      ]);
    }
  }

  useEffect(() => {
    if (inView) {
      loadMoreThreads();
    }
  }, [inView]);

  return (
    <>
      {threads?.map((thread) => (
        <ThreadCard
          key={thread._id.toString()}
          id={thread._id.toString()}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likes}
          isSaved={userSaves
            .map((thread) => thread._id)
            ?.includes(thread._id.toString())}
          pathname={pathname}
        />
      ))}
      {isLastPage && (
        <div
          ref={ref}
          className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4"
        >
          <Spinner />
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </>
  );
}
