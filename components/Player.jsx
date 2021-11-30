import { HeartIcon, VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline"
import { RewindIcon, FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, VolumeUpIcon, SwitchHorizontalIcon } from "@heroicons/react/solid"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSongInfo from "../hooks/useSongInfo"
import useSpotify from "../hooks/useSpotify"

const buttonCss = 'w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out'

function Player() {
    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)
    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentTrackId(data.body?.item?.id)
                spotifyApi.getMyCurrentPlaybackState().then(data => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }

    const handlePlay = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data.body?.is_playing) {
                spotifyApi.pause()
                setIsPlaying(false)
            }
            else {
                spotifyApi.play()
                setIsPlaying(true)
            }
        })
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong()
            setVolume(50)
        }
    }, [currentTrackId, spotifyApi, session])

    function debounce(func, timeout) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => { spotifyApi.setVolume(volume).catch(e => console.log(e)) }, 500), [])

    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume()
        }
    }, [volume])

    return (
        <div className="text-white h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-sm md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album?.images[0]?.url} alt="" />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className={`${buttonCss}`} />
                <RewindIcon className={`${buttonCss}`} onClick={() => spotifyApi.skipToPrevious()} />
                {
                    isPlaying ? <PauseIcon onClick={handlePlay} className={`w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out`} /> : <PlayIcon onClick={handlePlay} className={`w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out`} />
                }
                <FastForwardIcon className={`${buttonCss}`} onClick={() => spotifyApi.skipToNext()} />
                <ReplyIcon className={`${buttonCss}`} />
            </div>

            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon onClick={() => volume >= 10 && setVolume(volume - 10)} className={`${buttonCss} `} />
                <input className="w-14 md:w-20" type="range" value={volume} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))} />
                <VolumeUpIcon onClick={() => volume <= 90 && setVolume(volume + 10)} className={`${buttonCss} `} />
            </div>
        </div>
    )
}

export default Player
