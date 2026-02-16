import { createFileRoute } from '@tanstack/react-router'
import { Plus, MoreHorizontal, FileText, Calendar } from 'lucide-react'
import { INITIAL_COLUMNS, STATUS_COLORS, STATUS_TITLE_COLORS } from '../mock/kanbanData'
import type { Card, Column, Priority, CardStatus } from '../types/kanban'
import { useKanban } from '../hooks/useKanban'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import type { DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import CardModal from '../components/modal/CardModal'

export const Route = createFileRoute('/')({
  component: KanbanPage,
})

function KanbanPage() {
  const { cards, moveCard, updateCard } = useKanban()
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Card') {
      setActiveCard(event.active.data.current.card)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveACard = active.data.current?.type === 'Card'
    const isOverACard = over.data.current?.type === 'Card'
    const isOverAColumn = over.data.current?.type === 'Column'

    if (!isActiveACard) return

    // Dropping a Card over another Card
    if (isActiveACard && isOverACard) {
      const overCardStatus = over.data.current?.card.status
      if (active.data.current?.card.status !== overCardStatus) {
        moveCard(activeId as string, overCardStatus)
      }
    }

    // Dropping a Card over a Column
    if (isActiveACard && isOverAColumn) {
      moveCard(activeId as string, overId as CardStatus)
    }
  }

  return (
    <div className="flex flex-col h-full bg-notion-bg">
      <header className="px-8 pt-8 pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-notion-text">
          <span>🚀</span>
          Kanban / Backlog de Produto
        </h1>
        <div className="flex items-center gap-4 mt-6 text-sm text-notion-text-muted border-b border-notion-border pb-2">
          <div className="px-2 py-1 bg-notion-hover text-notion-text rounded cursor-pointer">Board</div>
          <div className="px-2 py-1 hover:bg-notion-hover rounded cursor-pointer transition-colors text-notion-text-muted">Project Info</div>
        </div>
      </header>

      {!isMounted ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 flex gap-4 min-h-0">
          {INITIAL_COLUMNS.map((column) => (
            <div key={column.id} className="min-w-[280px] w-[280px] flex flex-col gap-3 group h-full">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-notion-hover text-notion-text-muted">
                  {column.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={() => setActiveCard(null)}
        >
          <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-8 flex gap-4 min-h-0">
            {INITIAL_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={cards.filter(c => c.status === column.id)}
                onEditCard={setEditingCard}
              />
            ))}
            <div className="min-w-[280px] w-[280px] h-fit opacity-50 hover:opacity-100 cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-notion-hover transition-all text-notion-text-muted">
              <Plus size={16} />
              <span className="text-sm font-medium">Adicionar coluna</span>
            </div>
          </div>

          {createPortal(
            <DragOverlay dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.5',
                  },
                },
              }),
            }}>
              {activeCard && <KanbanCard card={activeCard} isOverlay />}
            </DragOverlay>,
            document.body
          )}

          {editingCard && createPortal(
            <CardModal
              card={editingCard}
              onClose={() => setEditingCard(null)}
              onUpdate={updateCard}
            />,
            document.body
          )}
        </DndContext>
      )}
    </div>
  )
}

function KanbanColumn({ column, cards, onEditCard }: { column: Column, cards: Card[], onEditCard: (card: Card) => void }) {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  })

  const colColor = STATUS_COLORS[column.id]?.column || 'transparent'
  const titleBg = STATUS_TITLE_COLORS[column.id] || '#373737'

  return (
    <div
      className="min-w-[280px] w-[280px] flex flex-col gap-3 group h-full"
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded shadow-sm border border-white/5"
            style={{ backgroundColor: titleBg, color: '#fff' }}
          >
            {column.title}
          </span>
          <span className="text-notion-text-muted text-xs font-medium">{cards.length}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus size={14} className="text-notion-text-muted hover:text-notion-text cursor-pointer" />
          <MoreHorizontal size={14} className="text-notion-text-muted hover:text-notion-text cursor-pointer" />
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 rounded-xl p-2 transition-all min-h-[44px] overflow-y-auto pb-4 pr-1 scrollbar-thin h-fit"
        style={{ backgroundColor: colColor }}
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map(card => (
            <KanbanCard key={card.id} card={card} onEdit={() => onEditCard(card)} />
          ))}
        </SortableContext>

        <div
          className="flex items-center gap-2 p-2 mt-auto text-notion-text-muted hover:bg-white/5 rounded-lg cursor-pointer transition-all text-sm group/btn border border-transparent hover:border-white/5"
          onClick={() => {/* TODO: Implement new task */ }}
        >
          <Plus size={14} className="group-hover/btn:text-notion-text" />
          <span className="group-hover/btn:text-notion-text font-medium">Nova Tarefa</span>
        </div>
      </div>
    </div>
  )
}

function KanbanCard({ card, isOverlay, onEdit }: { card: Card, isOverlay?: boolean, onEdit?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
  })

  const bgMain = STATUS_COLORS[card.status]?.card || '#202020'
  const statusColorMap = STATUS_TITLE_COLORS[card.status] || '#373737'

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    backgroundColor: bgMain,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border border-notion-border rounded-lg p-3 h-[120px] opacity-30 shadow-inner"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        // Prevent opening modal when dragging starts
        if (isOverlay) return;
        onEdit?.();
      }}
      className={`
        border border-notion-border/40 rounded-lg p-4 shadow-sm 
        hover:border-notion-text-muted/30 cursor-grab active:cursor-grabbing transition-all group
        ${isOverlay ? 'shadow-xl rotate-1 scale-105 border-blue-500 z-50' : 'opacity-90 hover:opacity-100 hover:bg-opacity-80'}
      `}
    >
      <div className="flex flex-col gap-3">
        {/* Title and Icon */}
        <div className="flex items-start gap-2">
          <div className="mt-1 text-notion-text-muted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <h3 className="text-[13px] font-bold leading-tight text-notion-text uppercase tracking-tight">
            {card.title}
          </h3>
        </div>

        {/* Responsible */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-notion-hover flex items-center justify-center text-[10px] font-bold border border-notion-border text-notion-text">
            {card.responsible[0]}
          </div>
          <span className="text-[11px] text-notion-text-muted font-medium">{card.responsible}</span>
        </div>

        {/* Tags */}
        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {card.tags.map(tag => (
              <span
                key={tag.id}
                className="text-[10px] px-2 py-0.5 rounded font-bold"
                style={{ backgroundColor: tag.color ? `${tag.color}33` : '#373737', color: tag.color || '#fff' }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Feature (Hardcoded as requested) */}
        <div className="flex items-center gap-2 text-notion-text-muted group/feat">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
          <span className="text-[10px] font-medium truncate">Criação de interface em código</span>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5"
            style={{ backgroundColor: statusColorMap, color: '#fff' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            {card.status}
          </span>
          <PriorityBadge priority={card.priority} />
        </div>

        {/* Deadline and Attachments */}
        <div className="flex flex-col gap-2 pt-2 border-t border-notion-border/30">
          <div className="flex items-center gap-2 text-notion-text-muted">
            <Calendar size={12} className="opacity-60" />
            <span className="text-[10px] font-medium">
              Entrega: {new Date(card.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          </div>

          {card.attachments && card.attachments.length > 0 && (
            <div className="flex flex-col gap-1">
              {card.attachments.map(file => (
                <div
                  key={file}
                  className="flex items-center gap-2 p-1.5 rounded bg-notion-hover/50 hover:bg-notion-hover border border-notion-border/40 transition-colors group/file text-notion-text-muted hover:text-notion-text"
                >
                  <FileText size={12} className="group-hover/file:text-blue-400 transition-colors" />
                  <span className="text-[10px] font-medium truncate">{file}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const colors = {
    'Baixa': 'text-priority-low bg-priority-low/10',
    'Média': 'text-priority-medium bg-priority-medium/10',
    'Urgente': 'text-priority-urgent bg-priority-urgent/10',
  }

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${colors[priority]}`}>
      {priority}
    </span>
  )
}
