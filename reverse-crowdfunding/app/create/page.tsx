import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CreatePage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Create Project</h1>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Fill out the information below to create a new funding project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input id="title" placeholder="Enter project title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your project and why it should be funded" rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Funding Goal ($)</Label>
            <Input id="amount" type="number" placeholder="Enter amount needed" min="1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image</Label>
            <Input id="image" type="file" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Submit Project</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

