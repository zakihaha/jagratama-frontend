import { ApprovalLetterManager } from "@/components/pdf-approval/approval-letter-manager";

interface Props {
  params: {
    slug: string
  }
}

export default async function Home({ params }: Props) {
  const { slug } = await params
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8">
        <ApprovalLetterManager slug={slug} />
      </div>
    </main>
  )
}
