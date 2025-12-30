import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, User, CheckCheck, FileText, AlertTriangle, MessageCircle, UserPlus, CheckCircle, ThumbsUp, DollarSign, Reply } from 'lucide-react';
import { Button } from '../../ui/button/Button';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

// Mock notifications data
const NOTIFICATIONS = [
  {
    id: '1',
    type: 'review-request' as const,
    avatar: User,
    avatarBg: 'bg-blue-100',
    avatarColor: 'text-blue-600',
    badge: MessageCircle,
    badgeBg: 'bg-blue-500',
    title: (
      <>
        <span className="font-semibold">John Smith</span> requested your review on{" "}
        <span className="font-medium text-emerald-600">SOP-QA-015</span>
      </>
    ),
    time: '2m ago',
    onClick: () => console.log("Navigate to document review")
  },
  {
    id: '2',
    type: 'approval' as const,
    avatar: User,
    avatarBg: 'bg-emerald-100',
    avatarColor: 'text-emerald-600',
    badge: CheckCircle,
    badgeBg: 'bg-emerald-500',
    title: (
      <>
        <span className="font-semibold">Sarah Johnson</span> approved{" "}
        <span className="font-medium text-emerald-600">DEV-2023-089</span>
      </>
    ),
    time: '15m ago',
    onClick: () => console.log("Navigate to approved document")
  },
  {
    id: '3',
    type: 'capa-assignment' as const,
    avatar: AlertTriangle,
    avatarBg: 'bg-amber-100',
    avatarColor: 'text-amber-600',
    badge: UserPlus,
    badgeBg: 'bg-amber-500',
    title: (
      <>
        You were assigned to{" "}
        <span className="font-medium text-amber-600">CAPA-2023-045</span>
      </>
    ),
    time: '1h ago',
    onClick: () => console.log("Navigate to CAPA")
  },
  {
    id: '4',
    type: 'training-completion' as const,
    avatar: User,
    avatarBg: 'bg-purple-100',
    avatarColor: 'text-purple-600',
    badge: ThumbsUp,
    badgeBg: 'bg-purple-500',
    title: (
      <>
        <span className="font-semibold">Mike Wilson</span> completed training on{" "}
        <span className="font-medium">GMP Basics</span>
      </>
    ),
    time: '2h ago',
    onClick: () => console.log("Navigate to training")
  },
  {
    id: '5',
    type: 'document-update' as const,
    avatar: FileText,
    avatarBg: 'bg-cyan-100',
    avatarColor: 'text-cyan-600',
    badge: DollarSign,
    badgeBg: 'bg-cyan-500',
    title: (
      <>
        <span className="font-semibold">Quality Team</span> updated{" "}
        <span className="font-medium text-cyan-600">SOP-QA-001</span>
      </>
    ),
    time: '3h ago',
    onClick: () => console.log("Navigate to document")
  },
  {
    id: '6',
    type: 'comment-reply' as const,
    avatar: User,
    avatarBg: 'bg-slate-100',
    avatarColor: 'text-slate-600',
    badge: Reply,
    badgeBg: 'bg-slate-500',
    title: (
      <>
        <span className="font-semibold">Emma Davis</span> replied to your comment on{" "}
        <span className="font-medium">Document Review Process</span>
      </>
    ),
    time: '5h ago',
    onClick: () => console.log("Navigate to comment")
  }
];

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, onClose, onToggle }) => {
  const notificationRef = useRef<HTMLButtonElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      // Check if click is outside both the button and the dropdown
      if (notificationRef.current && !notificationRef.current.contains(target) &&
          notificationDropdownRef.current && !notificationDropdownRef.current.contains(target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 z-50"
          onClick={onClose}
        />,
        document.body
      )}

      {/* Notifications Button */}
      <span ref={notificationRef} className="inline-block">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="relative text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
        >
          <Bell className="h-5 w-5 md:h-6 md:w-6" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border border-white shadow-sm"></span>
        </Button>
      </span>

      {/* Notifications Dropdown */}
      {isOpen && createPortal(
        <div 
          ref={notificationDropdownRef}
          className="fixed w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-white border border-slate-200 rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-[100]"
          style={{
            top: `${notificationRef.current?.getBoundingClientRect().bottom! + window.scrollY + 8}px`,
            right: window.innerWidth < 640 
              ? '1rem'
              : `${window.innerWidth - notificationRef.current?.getBoundingClientRect().right! - window.scrollX}px`
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">Notifications</h3>
            <button 
              className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-slate-100 rounded-md transition-colors group"
              onClick={() => console.log("Mark all as read")}
              title="Mark all as read"
            >
              <CheckCheck className="h-4 w-4 text-slate-500 group-hover:text-emerald-600 transition-colors" />
              <span className="text-xs font-medium text-slate-600 group-hover:text-emerald-600 transition-colors">Mark all as read</span>
            </button>
          </div>

          {/* Notifications List - Max 4 items visible, scroll for more */}
          <div className="max-h-[304px] overflow-y-auto">
            {NOTIFICATIONS.map((notification, index) => {
              const AvatarIcon = notification.avatar;
              const BadgeIcon = notification.badge;
              
              return (
                <button 
                  key={notification.id}
                  onClick={notification.onClick}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left ${
                    index !== NOTIFICATIONS.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`h-10 w-10 rounded-full ${notification.avatarBg} flex items-center justify-center`}>
                      <AvatarIcon className={`h-5 w-5 ${notification.avatarColor}`} />
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full ${notification.badgeBg} flex items-center justify-center border-2 border-white`}>
                      <BadgeIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{notification.time}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
