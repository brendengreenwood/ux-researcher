'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function NewPersona() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      projectId,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      characteristics: formData.get('characteristics') as string,
    }

    const res = await fetch('/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const persona = await res.json()
      router.push(`/projects/${projectId}/personas/${persona.id}`)
    } else {
      setLoading(false)
      alert('Failed to create persona')
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}`}>Project</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Persona</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Persona</h1>
        <p className="text-muted-foreground">
          Define a target user type for your research
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Persona Details</CardTitle>
          <CardDescription>
            Describe who this persona represents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Persona Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g., Power User, First-time Customer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Who is this persona? What defines them?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="characteristics">Key Characteristics</Label>
              <Textarea
                id="characteristics"
                name="characteristics"
                rows={4}
                placeholder="Demographics, behaviors, goals, pain points..."
              />
              <p className="text-sm text-muted-foreground">
                These will help AI agents contextualize interview analysis
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Persona'}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/projects/${projectId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
