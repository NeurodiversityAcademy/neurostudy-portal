'use client';
import { useVisitTracker } from '@/app/hooks/useVisitTracker';
interface VisitTrackerWrapperProps {
  id: string;
  type: 'article' | 'blog';
}

export default function VisitTrackerWrapper({
  id,
  type,
}: VisitTrackerWrapperProps) {
  useVisitTracker(id, type);
  return null;
}
