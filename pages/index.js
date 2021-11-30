import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Body from '../components/Body'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head><title>Spotify Rebuild</title></Head>
      <style global jsx>{`
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <main className="flex">
        <Sidebar />
        <Body />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      session
    }
  }
}
