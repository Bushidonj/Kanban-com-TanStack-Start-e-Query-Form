import { useForm } from '@tanstack/react-form';
import { X, Calendar, User, Tag, MessageSquare, AlertCircle } from 'lucide-react';
import type { Card, CardStatus, Priority } from '../../types/kanban';
import { INITIAL_COLUMNS } from '../../mock/kanbanData';

interface CardModalProps {
    card: Card;
    onClose: () => void;
    onUpdate: (card: Card) => void;
}

export default function CardModal({ card, onClose, onUpdate }: CardModalProps) {
    const form = useForm({
        defaultValues: {
            title: card.title,
            responsible: card.responsible,
            status: card.status,
            deadline: card.deadline,
            priority: card.priority,
            description: card.description || '',
        },
        onSubmit: async ({ value }) => {
            onUpdate({
                ...card,
                ...value,
            });
            onClose();
        },
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-notion-sidebar border border-notion-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-notion-border">
                    <div className="flex items-center gap-2 text-notion-text-muted text-sm capitalize">
                        <LayoutIcon status={card.status} />
                        <span>{card.status}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-notion-hover rounded transition-colors text-notion-text-muted hover:text-notion-text"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-6"
                    >
                        {/* Title */}
                        <form.Field
                            name="title"
                            children={(field) => (
                                <input
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="text-4xl font-bold bg-transparent border-none outline-none w-full text-notion-text placeholder-notion-text-muted/30"
                                    placeholder="Título sem nome"
                                />
                            )}
                        />

                        {/* Properties Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <PropertyItem icon={<User size={16} />} label="Responsável">
                                <form.Field
                                    name="responsible"
                                    children={(field) => (
                                        <input
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="bg-transparent outline-none w-full text-notion-text"
                                            placeholder="Ninguém"
                                        />
                                    )}
                                />
                            </PropertyItem>

                            <PropertyItem icon={<AlertCircle size={16} />} label="Status">
                                <form.Field
                                    name="status"
                                    children={(field) => (
                                        <select
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value as CardStatus)}
                                            className="bg-transparent outline-none w-full text-notion-text cursor-pointer appearance-none"
                                        >
                                            {INITIAL_COLUMNS.map(col => (
                                                <option key={col.id} value={col.id} className="bg-notion-sidebar">{col.title}</option>
                                            ))}
                                        </select>
                                    )}
                                />
                            </PropertyItem>

                            <PropertyItem icon={<Calendar size={16} />} label="Prazo">
                                <form.Field
                                    name="deadline"
                                    children={(field) => (
                                        <input
                                            type="date"
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="bg-transparent outline-none w-full text-notion-text cursor-pointer [color-scheme:dark]"
                                        />
                                    )}
                                />
                            </PropertyItem>

                            <PropertyItem icon={<Tag size={16} />} label="Prioridade">
                                <form.Field
                                    name="priority"
                                    children={(field) => (
                                        <select
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value as Priority)}
                                            className="bg-transparent outline-none w-full text-notion-text cursor-pointer appearance-none"
                                        >
                                            <option value="Baixa" className="bg-notion-sidebar">Baixa</option>
                                            <option value="Média" className="bg-notion-sidebar">Média</option>
                                            <option value="Urgente" className="bg-notion-sidebar">Urgente</option>
                                        </select>
                                    )}
                                />
                            </PropertyItem>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-notion-text-muted uppercase tracking-wider">Descrição</div>
                            <form.Field
                                name="description"
                                children={(field) => (
                                    <textarea
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className="w-full bg-notion-hover border border-notion-border rounded-lg p-3 min-h-[100px] outline-none text-notion-text resize-none text-sm"
                                        placeholder="Adicione uma descrição detalhada..."
                                    />
                                )}
                            />
                        </div>

                        {/* Comments Section */}
                        <div className="pt-6 border-t border-notion-border space-y-4">
                            <div className="flex items-center gap-2 text-notion-text font-semibold">
                                <MessageSquare size={18} />
                                <span>Comentários ({card.comments.length})</span>
                            </div>

                            <div className="space-y-4">
                                {card.comments.map(comment => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 border border-blue-500/30 flex-shrink-0">
                                            {comment.author[0]}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-notion-text">{comment.author}</span>
                                                <span className="text-[10px] text-notion-text-muted">{new Date(comment.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-notion-text-muted bg-notion-hover px-3 py-2 rounded-lg border border-notion-border inline-block">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* New Comment Input Simulation */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-notion-hover border border-notion-border flex items-center justify-center text-xs font-bold text-notion-text-muted">
                                        U
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            className="w-full bg-transparent border border-notion-border rounded-lg p-2 text-sm outline-none focus:border-notion-text-muted/50 transition-colors"
                                            placeholder="Escreva um comentário..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hidden Submit */}
                        <button type="submit" className="hidden" id="card-modal-submit" />
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-notion-border flex justify-end gap-3 bg-notion-hover/30">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium text-notion-text-muted hover:bg-notion-hover hover:text-notion-text transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => document.getElementById('card-modal-submit')?.click()}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}

function PropertyItem({ icon, label, children }: { icon: React.ReactNode, label: string, children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 px-2 py-1 hover:bg-notion-hover rounded transition-colors group">
            <div className="flex items-center gap-2 w-32 flex-shrink-0 text-notion-text-muted group-hover:text-notion-text-muted/80">
                {icon}
                <span className="font-medium text-xs uppercase tracking-tight">{label}</span>
            </div>
            <div className="flex-1 truncate">
                {children}
            </div>
        </div>
    );
}

function LayoutIcon({ status }: { status: CardStatus }) {
    return <div className="w-2 h-2 rounded-full bg-notion-text-muted" />;
}
