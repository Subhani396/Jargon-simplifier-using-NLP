import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useBriefData } from '@/hooks/useBriefData';
import {
    Clock,
    Trash2,
    Search,
    X,
    FileText,
    Bookmark,
    Calendar,
    Eye,
    Filter,
    ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const HistoryPage = () => {
    const navigate = useNavigate();
    const {
        history,
        deleteHistoryItem,
        clearHistory,
        searchHistory,
        saveItem,
        updateHistoryView
    } = useBriefData();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'views'>('recent');
    const [filterBy, setFilterBy] = useState<'all' | 'saved' | 'unsaved'>('all');

    // Filter and sort history
    const filteredHistory = useMemo(() => {
        let items = searchQuery ? searchHistory(searchQuery) : history;

        // Apply filter
        if (filterBy === 'saved') {
            items = items.filter(item => item.isSaved);
        } else if (filterBy === 'unsaved') {
            items = items.filter(item => !item.isSaved);
        }

        // Apply sort
        const sorted = [...items];
        if (sortBy === 'recent') {
            sorted.sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime());
        } else if (sortBy === 'oldest') {
            sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        } else if (sortBy === 'views') {
            sorted.sort((a, b) => b.viewCount - a.viewCount);
        }

        return sorted;
    }, [history, searchQuery, sortBy, filterBy, searchHistory]);

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
        updateHistoryView(id);
        // Navigate to dashboard with the selected brief
        navigate(`/dashboard?briefId=${id}`);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        deleteHistoryItem(id);
    };

    const handleSave = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        saveItem(id);
    };

    return (
        <div className="flex min-h-screen bg-background w-full">
            <DashboardSidebar onHistorySelect={handleItemClick} />
            <main className="flex-1 min-w-0">
                <header className="h-16 border-b border-border flex items-center px-6 justify-between">
                    <div>
                        <h1 className="font-display font-semibold text-lg">History</h1>
                        <p className="text-sm text-muted-foreground">
                            {filteredHistory.length} {filteredHistory.length === 1 ? 'brief' : 'briefs'}
                        </p>
                    </div>
                    {history.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear All
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete all {history.length} briefs from your history.
                                        Saved briefs will not be affected.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={clearHistory}>Clear History</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </header>

                <div className="p-6 max-w-6xl mx-auto space-y-6">
                    {/* Search and Filters */}
                    <div className="flex gap-3 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search history..."
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
                                    <Filter className="h-4 w-4 mr-2" />
                                    {filterBy === 'all' ? 'All' : filterBy === 'saved' ? 'Saved' : 'Unsaved'}
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterBy('all')}>
                                    All briefs
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterBy('saved')}>
                                    Saved only
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilterBy('unsaved')}>
                                    Unsaved only
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Sort: {sortBy === 'recent' ? 'Recent' : sortBy === 'oldest' ? 'Oldest' : 'Views'}
                                    <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortBy('recent')}>
                                    Most recent
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                                    Oldest first
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('views')}>
                                    Most viewed
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* History List */}
                    {filteredHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                                <Clock className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <h3 className="font-display font-semibold text-lg mb-2">
                                {searchQuery ? 'No results found' : 'No history yet'}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                {searchQuery
                                    ? 'Try adjusting your search or filters'
                                    : 'Your generated briefs will appear here for easy access'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredHistory.map((item) => (
                                <Card
                                    key={item.id}
                                    className="cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() => handleItemClick(item.id)}
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-base flex items-center gap-2">
                                                    <FileText className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">{item.title || 'Untitled Brief'}</span>
                                                </CardTitle>
                                                <CardDescription className="mt-1.5 flex flex-wrap gap-3 text-xs">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(item.lastViewed)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {item.viewCount} {item.viewCount === 1 ? 'view' : 'views'}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {item.audience}
                                                    </Badge>
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {item.isSaved && (
                                                    <Badge variant="secondary" className="gap-1">
                                                        <Bookmark className="h-3 w-3" />
                                                        Saved
                                                    </Badge>
                                                )}
                                                {!item.isSaved && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => handleSave(item.id, e)}
                                                    >
                                                        <Bookmark className="h-4 w-4" />
                                                    </Button>
                                                )}
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
                                                            <AlertDialogTitle>Delete this brief?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will remove this brief from your history. This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={(e) => handleDelete(item.id, e)}>
                                                                Delete
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

export default HistoryPage;
