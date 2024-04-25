import { Suspense } from 'react'
import Loading from './loading'
import WaitComponent from './wait'

export default function Test() {
    return (
        <div>
            <h1>Loading Test</h1>
            <Suspense fallback={<Loading />}>
                <WaitComponent />
            </Suspense>
            <h1>Link</h1>
            <a href="/">Home</a>
        </div>
    )
}
