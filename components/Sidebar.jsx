import { HeartIcon, HomeIcon, LibraryIcon, PlusCircleIcon, RssIcon, SearchIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { playlistIdState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'

function Sidebar() {
    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()
    const [playlists, setPlaylists] = useState([])
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items)
            })
        }
    }, [session, spotifyApi])

    return (
        <div className="text-gray-500 p-5 text-sm lg:text-base sm:max-w-[12rem] lg:max-w-[16rem] border-r border-gray-900 overflow-y-scroll h-screen pb-36 hidden md:inline-flex">
            <div className="space-y-4">
                <button className="flex items-center hover:text-white"><HomeIcon className="w-5 h-5 mr-2" />Home </button>
                <button className="flex items-center hover:text-white"><SearchIcon className="w-5 h-5 mr-2" />Search Songs </button>
                <button className="flex items-center hover:text-white"><LibraryIcon className="w-5 h-5 mr-2" />Your Library </button>
                <hr className="border-t-[0.1px] border-gray-800" />

                <button className="flex items-center hover:text-white"><PlusCircleIcon className="w-5 h-5 mr-2" />Create Playlist </button>
                <button className="flex items-center hover:text-white"><HeartIcon className="w-5 h-5 mr-2" />Liked Songs </button>
                <button className="flex items-center hover:text-white"><RssIcon className="w-5 h-5 mr-2" />Your Episodes </button>
                <hr className="border-t-[0.1px] border-gray-800" />

                {/* PlayList  */}
                {playlists?.length > 0 && playlists?.map((playlist) => (
                    <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white truncate">{playlist.name}</p>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
