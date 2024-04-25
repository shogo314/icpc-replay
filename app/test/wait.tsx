function aWait() {
    return new Promise(callback => { setTimeout(callback, 3000) })
  }
  export default async function WaitComponent() {
    await aWait()
    return <div>Finished!</div>
  }
