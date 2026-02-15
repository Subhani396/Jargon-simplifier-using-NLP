import { useState, useMemo } from "react";
import {
  FileText,
  History,
  Save,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Bookmark,
  Trash2,
  Search,
  X,
  ArrowLeft
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useBriefData } from "@/hooks/useBriefData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { icon: Sparkles, label: "New Brief", path: "/dashboard", badge: null },
  { icon: History, label: "History", path: "/dashboard/history", badge: "history" },
  { icon: Save, label: "Saved Reports", path: "/dashboard/saved", badge: "saved" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings", badge: null },
];

interface DashboardSidebarProps {
  onHistorySelect?: (id: string) => void;
  onSavedSelect?: (id: string) => void;
}

const DashboardSidebar = ({ onHistorySelect, onSavedSelect }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickView, setShowQuickView] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    history,
    savedItems,
    settings,
    deleteHistoryItem,
    unsaveItem,
    updateHistoryView,
  } = useBriefData();

  // Get badge counts
  const badges = useMemo(() => ({
    history: history.length,
    saved: savedItems.length,
  }), [history.length, savedItems.length]);

  // Quick view for recent items
  const recentHistory = useMemo(() =>
    history.slice(0, 5),
    [history]
  );

  const recentSaved = useMemo(() =>
    savedItems.slice(0, 5),
    [savedItems]
  );

  // Handle item selection
  const handleHistoryClick = (id: string) => {
    updateHistoryView(id);
    onHistorySelect?.(id);
  };

  const handleSavedClick = (id: string) => {
    onSavedSelect?.(id);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "h-screen sticky top-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-display font-bold text-sm">Jargon Simplifier</span>}
        </div>

        {/* Search - Only visible when expanded */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search briefs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 bg-sidebar-accent/50 border-sidebar-border"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="px-3 py-2 border-b border-sidebar-border">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="w-full justify-center"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Back to Home</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="w-full justify-start gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const badgeCount = item.badge ? badges[item.badge as keyof typeof badges] : null;

            const linkContent = (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {badgeCount !== null && badgeCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="h-5 min-w-5 px-1.5 text-xs"
                      >
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                    {badgeCount !== null && badgeCount > 0 && (
                      <p className="text-xs text-muted-foreground">{badgeCount} items</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}

          {/* Quick View Section - Only when expanded */}
          {!collapsed && (
            <>
              {/* Recent History */}
              {recentHistory.length > 0 && (
                <div className="pt-4 mt-4 border-t border-sidebar-border">
                  <div className="px-3 mb-2 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Recent
                    </span>
                  </div>
                  <div className="space-y-1">
                    {recentHistory.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistoryClick(item.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors group"
                      >
                        <div className="flex items-start gap-2">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {item.title || 'Untitled Brief'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(item.lastViewed)}
                            </p>
                          </div>
                          {item.isSaved && (
                            <Bookmark className="h-3 w-3 text-primary shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Saved Access */}
              {recentSaved.length > 0 && (
                <div className="pt-4 mt-4 border-t border-sidebar-border">
                  <div className="px-3 mb-2 flex items-center gap-2">
                    <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Pinned
                    </span>
                  </div>
                  <div className="space-y-1">
                    {recentSaved.slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSavedClick(item.id)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <Save className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {item.title || 'Untitled Brief'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.notes || formatDate(item.savedAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </nav>

        {/* User Settings Preview - Only when expanded */}
        {!collapsed && settings && (
          <div className="px-4 py-3 border-t border-sidebar-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className={cn(
                "h-2 w-2 rounded-full",
                settings.theme === 'dark' ? 'bg-blue-500' :
                  settings.theme === 'light' ? 'bg-yellow-500' :
                    'bg-purple-500'
              )} />
              <span className="capitalize">{settings.theme} mode</span>
            </div>
            {settings.autoSave && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Save className="h-3 w-3" />
                <span>Auto-save enabled</span>
              </div>
            )}
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>
    </TooltipProvider>
  );
};

export default DashboardSidebar;
