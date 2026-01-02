import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export function LotusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-6 w-6', props.className)}
      {...props}
    >
      <path d="M8.5 18c3-3 5.5-3 8.5 0" />
      <path d="M12 15a3.5 3.5 0 0 0-3.5 3.5c0 1.5 1 2.5 3.5 2.5s3.5-1 3.5-2.5A3.5 3.5 0 0 0 12 15Z" />
      <path d="M12 3C7.5 7.5 7.5 14.5 12 15" />
      <path d="M12 3c4.5 4.5 4.5 11.5 0 12" />
      <path d="M15.5 18c-3-3-5.5-3-8.5 0" />
    </svg>
  );
}
