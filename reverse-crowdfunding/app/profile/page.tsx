import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowUpCircle, Settings, User } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg" alt="Profile" />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-4 text-xl font-bold">Jane Smith</h2>
        <p className="text-muted-foreground">Member since April 2023</p>

        <div className="flex gap-4 mt-4">
          <div className="text-center">
            <p className="text-lg font-bold">5</p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-lg font-bold">$350</p>
            <p className="text-xs text-muted-foreground">Contributed</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-lg font-bold">42</p>
            <p className="text-xs text-muted-foreground">Votes</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-medium">Your Activity</h2>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">You voted on "Youth Coding Workshop"</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">You contributed $50 to the fund</p>
                <p className="text-xs text-muted-foreground">1 week ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

