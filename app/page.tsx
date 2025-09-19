export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          CreatorBets
        </h1>
        <div className="card p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to CreatorBets
          </h2>
          <p className="text-muted-foreground mb-6">
            A decentralized platform for creator betting powered by OnchainKit.
          </p>
          <div className="flex gap-4">
            <button className="btn-primary">
              Get Started
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}