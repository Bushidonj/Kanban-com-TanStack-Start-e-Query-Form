import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/docs')({
    component: DocsPage,
})

function DocsPage() {
    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-notion-text">Documentação</h1>
            <div className="p-8 border border-notion-border rounded-xl bg-notion-sidebar/50">
                <p className="text-notion-text-muted leading-relaxed">
                    Esta é a página de documentação do projeto Kanban SaaS.
                </p>
                <div className="mt-8 space-y-4">
                    <div className="h-4 bg-notion-hover rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-notion-hover rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-notion-hover rounded w-5/6 animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}
