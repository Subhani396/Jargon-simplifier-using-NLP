import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useBriefData } from '@/hooks/useBriefData';
import {
    Bookmark,
    Trash2,
    Search,
    X,
    FileText,
    Calendar,
    Edit2,
    ChevronDown,
    StickyNote
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SavedPage = () => {
    const navigate = useNavigate();
    const {
        savedItems,
        unsaveItem,
        searchSaved,
        updateSavedNotes
    } = useBriefData();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');
    const [editingNotes, setEditingNotes] = useState<{ id: string; notes: string } | null>(null);

    // Filter and sort saved items
    const filteredSaved = useMemo(() => {
        let items = searchQuery ? searchSaved(searchQuery) : savedItems;

        // Apply sort
        const sorted = [...items];
        if (sortBy === 'recent') {
            sorted.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        } else if (sortBy === 'oldest') {
            sorted.sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
        } else if (sortBy === 'title') {
            sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }

        return sorted;
    }, [savedItems, searchQuery, sortBy, searchSaved]);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleItemClick = (id: string) => {
        navigate(`/dashboard?briefId=${id}`);
    };

    const handleUnsave = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        unsaveItem(id);
    };

    const handleSaveNotes = () => {
        if (editingNotes) {
            updateSavedNotes(editingNotes.id, editingNotes.notes);
            setEditingNotes(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-background w-full">
            <DashboardSidebar onSavedSelect={handleItemClick} />
            <main className="flex-1 min-w-0">
                <header className="h-16 border-b border-border flex items-center px-6 justify-between">
                    <div>
                        <h1 className="font-display font-semibold text-lg">Saved Reports</h1>
                        <p className="text-sm text-muted-foreground">
                            {filteredSaved.length} {filteredSaved.length === 1 ? 'report' : 'reports'} saved
                        </p>
                    </div>
                </header>

                <div className="p-6 max-w-6xl mx-auto space-y-6">
                    {/* Search and Filters */}
                    <div className="flex gap-3 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search saved reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'oldest' ? 'Oldest' : 'Title'}
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortBy('recent')}>
                                    Recently saved
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                                    Oldest first
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('title')}>
                                    Title (A-Z)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Saved List */}
                    {filteredSaved.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                                <Bookmark className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <h3 className="font-display font-semibold text-lg mb-2">
                                {searchQuery ? 'No results found' : 'No saved reports yet'}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                {searchQuery
                                    ? 'Try adjusting your search'
                                    : 'Save important briefs for quick access later'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredSaved.map((item) => (
                                <Card
                                    key={item.id}
                                    className="cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() => handleItemClick(item.id)}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <Bookmark className="h-4 w-4 shrink-0 text-primary" />
                                                    <span className="truncate">{item.title || 'Untitled Brief'}</span>
                                                </CardTitle>
                                                <CardDescription className="mt-1.5 flex flex-wrap gap-3 text-xs">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Saved {formatDate(item.savedAt)}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {item.audience}
                                                    </Badge>
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingNotes({ id: item.id, notes: item.notes || '' });
                                                            }}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent onClick={(e) => e.stopPropagation()}>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Notes</DialogTitle>
                                                            <DialogDescription>
                                                                Add notes to help you remember important details about this brief.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <Textarea
                                                            placeholder="Add your notes here..."
                                                            value={editingNotes?.id === item.id ? editingNotes.notes : ''}
                                                            onChange={(e) => setEditingNotes({ id: item.id, notes: e.target.value })}
                                                            className="min-h-32"
                                                        />
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setEditingNotes(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button onClick={handleSaveNotes}>
                                                                Save Notes
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Remove from saved?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will remove this brief from your saved reports.
                                                                It will still be available in your history.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={(e) => handleUnsave(item.id, e)}>
                                                                Remove
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {item.simplifiedText}
                                        </p>
                                        {item.notes && (
                                            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <StickyNote className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-xs font-medium text-muted-foreground">Notes</span>
                                                </div>
                                                <p className="text-sm line-clamp-2">{item.notes}</p>
                                            </div>
                                        )}
                                        {item.tags && item.tags.length > 0 && (
                                            <div className="flex gap-2 mt-3">
                                                {item.tags.map((tag, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SavedPage;
