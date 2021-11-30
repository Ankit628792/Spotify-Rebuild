import { ChevronDownIcon } from "@heroicons/react/outline"
import { signOut, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { playlistIdState, playlistState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import Songs from "./Songs"

const colors = [
    "from-indigo-400",
    "from-blue-400",
    "from-green-400",
    "from-yellow-400",
    "from-pink-400",
    "from-purple-400",
]
function Body() {
    const { data: session } = useSession()
    const spotifyApi = useSpotify()
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)

    useEffect(() => {
        setColor(colors.sort(() => Math.random() - 0.5).pop())
    }, [playlistId])

    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then((data) => {
            setPlaylist(data.body)
        }).catch(e => console.log("something went wrong! ", e))
    }, [spotifyApi, playlistId])

    return (
        <div className="flex-grow overflow-y-scroll h-screen">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full text-white font-medium p-1 pr-2"
                    onClick={() => signOut()}>
                        {
                            session?.user?.image ?
                            <img className="rounded-full w-10 h-10" src={session?.user?.image} alt="" />
:
<div className="rounded-full w-10 h-10 grid place-items-center text-[26px] leading-none font-bold bg-white text-gray-900"><h1>{session?.user?.name?.[0]}</h1></div>
                        }
                    <h2>{session?.user?.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>

            <section className={`flex items-end space-x-7 h-80 bg-gradient-to-b to-black ${color} p-8 text-white`}>
                <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt="" />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                </div>
            </section>

            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Body
