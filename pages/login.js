import Image from 'next/image'
import Head from 'next/head'
import {getProviders, signIn} from 'next-auth/react'

function Login({providers}) {
    return (
        <div className="flex flex-col items-center justify-center bg-black min-h-screen w-full overflow-hidden">
            <Head><title>Spotify Login</title></Head>
            <img className="w-52 mb-10" src="https://links.papareact.com/9xl" alt="" />
            {
                Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                        <button className="bg-[#1DB954] text-white px-5 py-3 rounded-full text-xl font-medium" onClick={() => signIn(provider.id, {callbackUrl: '/'})}>Login with {provider.name}</button>
                    </div>
                ))
            }
        </div>
    )
}

export default Login

export async function getServerSideProps(){
    const providers = await getProviders()
    return {
        props: {
            providers
        }
    }
}
