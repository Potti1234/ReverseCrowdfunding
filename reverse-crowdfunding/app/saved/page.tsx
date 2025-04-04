import { Heart } from "lucide-react"

export default function SavedPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Saved Projects</h1>

      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <Heart className="h-12 w-12 mb-4 stroke-muted-foreground" />
        <h2 className="text-lg font-medium">No saved projects yet</h2>
        <p className="max-w-xs mt-2">Projects you save will appear here for easy access.</p>
      </div>
    </div>
  )
}

