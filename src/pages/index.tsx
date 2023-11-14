import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import { api } from "~/utils/api";

export default function Home() {
  const userData = useUser();
  const userId = userData.user?.id ?? "";
  const boards = api.boards.getAllBoardsForUser.useQuery({
    userId: userId,
  });

  console.log(boards);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex flex-col text-white">
          {userData.isSignedIn ? (
            <SignOutButton>Sign Out</SignOutButton>
          ) : (
            <SignInButton>Sign In</SignInButton>
          )}
        </div>
      </main>
    </>
  );
}
