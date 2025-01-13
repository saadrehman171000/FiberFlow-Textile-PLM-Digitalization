import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <SignIn forceRedirectUrl={"/"} appearance={{ layout: { privacyPageUrl: 'https://localhost:3000/user-dashboard' } }} />
        </div>
    )
}