function withValidProperties(properties: Record<string, undefined | string | string[]>) {
    return Object.fromEntries(
        Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
    );
}

export async function GET() {
    const URL = process.env.NEXT_PUBLIC_URL as string;
    return Response.json({
        "accountAssociation": {
            "header": "eyJmaWQiOjExMDQ3MzEsInR5cGUiOiJhdXRoIiwia2V5IjoiMHg4OTUxOURkODE2N2E4ZGM1Q2M1NmUxNjQ5MTEwNEY0MjUxMzBiZDRhIn0",
            "payload": "eyJkb21haW4iOiJuYXNiYXNlZ2FtZS52ZXJjZWwuYXBwIn0",
            "signature": "ShsuLp5j5VU698aBaGxCVLPjxJ0+5t6w16mpFvZwaUgi7P8QpJiTMV7FwVohnBcgQggVX1cw+zsZU9dmBkrDhxw="
        },
        "baseBuilder": {
            "ownerAddress": "0x21210dfB6B17AF5B46EeB0b9Ca25672B361A8B5f"
        },
        "miniapp": {
            "version": "1",
            "name": "Anime Runner",
            "homeUrl": "https://anime-runner.vercel.app/",
            "iconUrl": "https://nasbasegame.vercel.app/icon.png",
            "imageUrl": "https://nasbasegame.vercel.app/icon.png",
            "splashImageUrl": "https://nasbasegame.vercel.app/icon.png",
            "splashBackgroundColor": "#0d1117",
            "subtitle": "Fast, fun endless runner",
            "description": "A fast-paced endless runner game where you jump over obstacles to achieve the highest score.",
            "primaryCategory": "games",
            "tags": [
                "game",
                "runner",
                "entertainment"
            ],
            "tagline": "Jump to survive!",
            "ogTitle": "Anime Runner - Base Miniapp",
            "ogDescription": "Play the addictive Anime Runner game directly in your Farcaster client.",
            "ogImageUrl": "https://nasbasegame.vercel.app/icon.png",
            "requiredCapabilities": [
                "actions.ready"
            ]
        }
    }); // see the next step for the manifest_json_object
}