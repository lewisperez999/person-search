import { Suspense } from 'react'
import DirectoryTable from '../components/directory-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DirectoryPageProps {
  searchParams: Promise<{
    search?: string
    page?: string
  }>
}

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams?.search || ''
  const currentPage = parseInt(resolvedSearchParams?.page || '1')

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Directory</CardTitle>
          <CardDescription>
            Manage and search through all people in the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading directory...</div>}>
            <DirectoryTable initialSearch={search} initialPage={currentPage} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}